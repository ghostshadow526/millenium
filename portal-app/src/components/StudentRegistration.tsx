"use client";

// Refactored comprehensive Student Registration component
// Implements legacy student ID format CLASS-YYYY-####, removes roll number & student email fields for teachers,
// admin-only QR + optional student email provisioning, robust validation & undefined filtering.

import { useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { useAuth } from '@/contexts/AuthContext';
import QRCode from 'qrcode';
import compress from 'browser-image-compression';
import toast from 'react-hot-toast';
import { Student } from '@/types';

interface StudentRegistrationProps { onStudentRegistered?: (student: Student) => void; }

interface FormState {
  name: string;
  age: string; // keep as string for controlled input then parse
  class: string;
  parentPhone: string;
  parentEmail: string;
  parentPassword: string; // new for parent auth creation
  parentConfirm: string;  // confirmation
  studentEmail?: string; // (deprecated) no longer used for student login but retained if future
}

export default function StudentRegistration({ onStudentRegistered }: StudentRegistrationProps) {
  const { user, roleInfo } = useAuth();
  const isAdmin = roleInfo?.role === 'admin';
  const [loading, setLoading] = useState(false);
  const [lastStudentId, setLastStudentId] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [form, setForm] = useState<FormState>({ name: '', age: '', class: '', parentPhone: '', parentEmail: '', parentPassword: '', parentConfirm: '', studentEmail: '' });

  // ---------------- Helpers ----------------
  const removeUndefined = <T extends Record<string, any>>(obj: T): T => {
    const cleaned: Record<string, any> = {};
    Object.entries(obj).forEach(([k, v]) => { if (v !== undefined) cleaned[k] = v; });
    return cleaned as T;
  };

  const normalizeClass = (input: string): string => input.trim().toUpperCase().replace(/\s+/g, '');

  const generateUniqueId = async (classLabel: string): Promise<string> => {
    const cls = normalizeClass(classLabel) || 'CLASS';
    const year = new Date().getFullYear();
    for (let i = 0; i < 18; i++) { // attempts
      const rand = Math.floor(1000 + Math.random() * 9000);
      const candidate = `${cls}-${year}-${rand}`;
      const ref = doc(collection(db, 'students'), candidate);
      const snap = await getDoc(ref);
      if (!snap.exists()) return candidate;
    }
    // fallback entropy
    return `${cls}-${year}-${Date.now().toString().slice(-4)}`;
  };

  const buildQrDataUrl = async (studentId: string): Promise<string> => {
    const url = `${window.location.origin}/student-id/${studentId}`;
    return QRCode.toDataURL(url, { width: 220, margin: 2, color: { dark: '#000000', light: '#ffffff' } });
  };

  const uploadToImageKit = async (file: File): Promise<string> => {
    const compressed = await compress(file, { maxSizeMB: 0.4, maxWidthOrHeight: 700, useWebWorker: true });
    const base64 = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve((r.result as string).replace(/^data:[^;]+;base64,/, ''));
      r.onerror = reject; r.readAsDataURL(compressed);
    });
    const res = await fetch('/api/imagekit/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ file: base64, fileName: `student_${Date.now()}.jpg` }) });
    if (!res.ok) throw new Error('Image upload failed');
    const j = await res.json();
    if (!j?.url) throw new Error('No image URL returned');
    return j.url as string;
  };

  // ---------------- Handlers ----------------
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return; setPhotoFile(f);
    const reader = new FileReader(); reader.onload = () => setPhotoPreview(reader.result as string); reader.readAsDataURL(f);
  };

  const validate = (): boolean => {
    if (!form.name.trim()) { toast.error('Name is required'); return false; }
    if (!form.age.trim() || isNaN(Number(form.age))) { toast.error('Valid age required'); return false; }
    if (!form.class.trim()) { toast.error('Class is required'); return false; }
    if (!form.parentEmail.trim()) { toast.error('Parent email required'); return false; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.parentEmail)) { toast.error('Invalid parent email'); return false; }
    if (form.parentPassword.length < 6) { toast.error('Parent password min 6 chars'); return false; }
    if (form.parentPassword !== form.parentConfirm) { toast.error('Parent passwords do not match'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; if (!validate()) return;
    setLoading(true);
    try {
      const studentId = await generateUniqueId(form.class);
      let photoUrl: string | undefined = undefined;
      if (photoFile) {
        try { photoUrl = await uploadToImageKit(photoFile); } catch { toast.error('Photo upload failed'); }
      }
      const name = form.name.trim();
      const nameParts = name.split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;
      const baseData: Omit<Student, 'id'> = {
        name,
        firstName,
        lastName,
        class: form.class.trim(),
        classLevel: form.class.trim(),
        age: Number(form.age),
        rollNumber: studentId, // mirror id for uniformity (legacy views rely on rollNumber)
        parentPhone: form.parentPhone || undefined,
        parentEmail: form.parentEmail || undefined,
        photoUrl,
        registeredBy: isAdmin ? 'admin' : 'teacher',
        registeredByUid: user.uid,
        feeStatus: { term1: false, term2: false, term3: false },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  // studentEmail removed from auth flow (no student direct login now)
      if (isAdmin) {
        const qrCode = await buildQrDataUrl(studentId);
        (baseData as any).qrCode = qrCode;
        (baseData as any).qrGeneratedAt = new Date();
        (baseData as any).qrGeneratedBy = user.uid;
        (baseData as any).qrHistory = [{ generatedAt: new Date(), generatedBy: user.uid }];
      }

      const cleaned = removeUndefined(baseData);
      const ref = doc(collection(db, 'students'), studentId);
      await setDoc(ref, cleaned);

      // Parent auth provisioning (admin OR teacher) using parent email/password
      try {
        const SECONDARY = 'parent-provision';
        const secondaryApp = getApps().find(a => a.name === SECONDARY) || initializeApp((auth.app.options as any), SECONDARY);
        const secondaryAuth = getAuth(secondaryApp as any);
        const cred = await createUserWithEmailAndPassword(secondaryAuth, form.parentEmail.trim(), form.parentPassword);
        await setDoc(doc(collection(db,'users'), cred.user.uid), { role:'parent', studentId, email: form.parentEmail.trim(), createdAt: new Date() }, { merge:true });
      } catch(e:any) { toast.error('Parent auth create failed: '+ (e?.message||'error')); }

      const newStudent: Student = { ...(cleaned as any), id: ref.id };
      setLastStudentId(ref.id);
      toast.success(`Student registered${isAdmin ? ' (QR ready)' : ''}. ID generated.`);
      toast.custom(
        <div className="bg-white text-midnight_text text-xs px-3 py-2 rounded shadow">
          <div>Student ID:</div>
          <div className="font-mono text-sm font-semibold">{ref.id}</div>
        </div>, { duration: 8000 }
      );
      // reset
  setForm({ name: '', age: '', class: '', parentPhone: '', parentEmail: '', parentPassword:'', parentConfirm:'', studentEmail: '' });
      setPhotoFile(null); setPhotoPreview('');
      onStudentRegistered?.(newStudent);
    } catch (err: any) {
      console.error('Registration error', err);
      toast.error('Registration failed: ' + (err?.message || 'unknown'));
    } finally { setLoading(false); }
  };

  // ---------------- UI ----------------
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"><i className="fas fa-user-plus text-primary" /></div>
        <div>
          <h2 className="text-xl font-semibold text-midnight_text">Register New Student</h2>
          <p className="text-sm text-grey">{isAdmin ? 'Admin registration (QR + optional login)' : 'Teacher registration (no QR, no student email field)'}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {lastStudentId && (
          <div className="p-3 rounded border border-green-500/40 bg-green-500/10 text-xs flex items-center justify-between gap-3">
            <div>
              <strong>Last Student ID:</strong> <span className="font-mono">{lastStudentId}</span>
              <div className="text-[10px] text-grey mt-1">Used as initial password if login was provisioned.</div>
            </div>
            <button type="button" onClick={() => { navigator.clipboard.writeText(lastStudentId); toast.success('Copied'); }} className="btn outline text-xs">Copy</button>
          </div>
        )}

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-midnight_text mb-2">Student Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full Name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight_text mb-2">Age *</label>
            <input value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} placeholder="e.g. 12" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight_text mb-2">Class *</label>
            <input value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))} placeholder="JSS1" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-midnight_text mb-2">Student Email (optional)</label>
              <input value={form.studentEmail || ''} onChange={e => setForm(p => ({ ...p, studentEmail: e.target.value }))} placeholder="student@example.com" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
          )}
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-midnight_text mb-2">Student Photo</label>
          <div className="flex items-center gap-4">
            {photoPreview ? <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" /> : (
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center"><i className="fas fa-camera text-gray-400 text-xl" /></div>
            )}
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="flex-1" />
          </div>
        </div>

        {/* Parent Contact + Credentials */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-midnight_text mb-2">Parent Phone</label>
            <input value={form.parentPhone} onChange={e => setForm(p => ({ ...p, parentPhone: e.target.value }))} placeholder="+234..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight_text mb-2">Parent Email</label>
            <input type="email" value={form.parentEmail} onChange={e => setForm(p => ({ ...p, parentEmail: e.target.value }))} placeholder="parent@example.com" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight_text mb-2">Parent Password</label>
            <input type="password" value={form.parentPassword} onChange={e => setForm(p => ({ ...p, parentPassword: e.target.value }))} placeholder="Parent password" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-midnight_text mb-2">Confirm Password</label>
            <input type="password" value={form.parentConfirm} onChange={e => setForm(p => ({ ...p, parentConfirm: e.target.value }))} placeholder="Confirm password" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
        </div>

        {isAdmin && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
            <i className="fas fa-qrcode text-primary mt-1" />
            <div>
              <h4 className="font-medium text-primary">QR Code Auto Generation</h4>
              <p className="text-xs text-grey mt-1">Admins automatically create a QR code used for the student's digital ID card.</p>
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full btn btn-primary btn-lg justify-center">
          {loading ? (<><i className="fas fa-spinner fa-spin" /> Processing...</>) : (<><i className="fas fa-user-plus" /> {isAdmin ? 'Register Student (QR)' : 'Register Student'}</>)}
        </button>
      </form>
    </div>
  );
}