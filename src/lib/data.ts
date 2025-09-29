import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, startAfter, updateDoc } from 'firebase/firestore';
import imageCompression from 'browser-image-compression';
import QRCode from 'qrcode';
import type { StudentInput, StudentRecord, AddStudentResult, SubjectGrade, TermKey } from '@/types/portal';

// Generate deterministic student id: CLASSLEVEL-YYYY-RAND4
export async function generateStudentId(classLevel: string): Promise<string> {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `${classLevel.replace(/\s+/g, '').toUpperCase()}-${year}-${rand}`;
}

// Create student record + optional photo upload (ImgBB legacy) + QR data URL
export async function addStudent(data: StudentInput): Promise<AddStudentResult> {
  const id = await generateStudentId(data.classLevel);
  let photoUrl: string | undefined;
  if (data.photoFile) {
    const file = data.photoFile;
    const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!ACCEPTED.includes(file.type)) throw new Error('VALIDATION_UNSUPPORTED_TYPE');
    if (file.size > 5 * 1024 * 1024) throw new Error('VALIDATION_FILE_TOO_LARGE');
    const compressed = await imageCompression(file, { maxSizeMB: 0.25, maxWidthOrHeight: 600 });
    const uploadBlob: Blob = compressed instanceof Blob ? compressed : new Blob([compressed]);
    const formData = new FormData();
    formData.append('image', uploadBlob, `${id}.jpg`);
    const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY || 'eb795bdf868353332baf6495a1a83fa0'; // fallback dev key
    const resp = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: formData });
    const result = await resp.json();
    if (!resp.ok || !result?.success) throw new Error('IMGBB_UPLOAD_FAILED');
    photoUrl = result.data?.url; if (!photoUrl) throw new Error('IMGBB_NO_URL_RETURNED');
  }
  const { photoFile: _omit, ...rest } = data;
  const student: StudentRecord = { ...rest, id, photoUrl, feeStatus: { term1: false, term2: false, term3: false }, createdAt: Date.now() };
  await setDoc(doc(db, 'students', id), student);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const qrDataUrl = await QRCode.toDataURL(`${origin}/id/${id}`);
  return { student, qrDataUrl, password: id };
}

export async function fetchStudent(id: string) {
  const snap = await getDoc(doc(db, 'students', id));
  return snap.exists() ? (snap.data() as StudentRecord) : null;
}

export async function searchStudents(term: string) {
  const colRef = collection(db, 'students');
  const all = await getDocs(colRef);
  const lower = term.toLowerCase();
  return all.docs
    .map(d => ({ ...(d.data() as StudentRecord), id: (d.data() as any).id || d.id }))
    .filter(s =>
      (s.firstName || '').toLowerCase().includes(lower) ||
      (s.lastName || '').toLowerCase().includes(lower) ||
      (s.id || '').toLowerCase().includes(lower)
    );
}

export async function fetchStudentsPage(pageSize = 10, cursor?: any) {
  const colRef = collection(db, 'students');
  let qRef = query(colRef, orderBy('createdAt', 'desc'), limit(pageSize));
  if (cursor) qRef = query(colRef, orderBy('createdAt', 'desc'), startAfter(cursor), limit(pageSize));
  const snap = await getDocs(qRef);
  const students = snap.docs.map(d => ({ ...(d.data() as StudentRecord), id: (d.data() as any).id || d.id }));
  const nextCursor = snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : null;
  return { students, cursor: nextCursor };
}

export async function updateFeeStatus(studentId: string, term: TermKey, paid: boolean) {
  await updateDoc(doc(db, 'students', studentId), { [`feeStatus.${term}`]: paid });
}

export async function setAttendance(studentId: string, dateIso: string, present: boolean) {
  const date = new Date(dateIso);
  if (isNaN(date.getTime())) throw new Error('Invalid date');
  const ym = dateIso.slice(0, 7);
  const ref = doc(db, 'students', studentId, 'attendance', ym);
  const snap = await getDoc(ref);
  const days = snap.exists() ? (snap.data() as any).days || {} : {};
  (days as any)[dateIso] = present;
  await setDoc(ref, { days }, { merge: true });
}

export async function getAttendanceMonth(studentId: string, year: number, month: number) {
  const ym = `${year}-${String(month).padStart(2, '0')}`;
  const ref = doc(db, 'students', studentId, 'attendance', ym);
  const snap = await getDoc(ref);
  return snap.exists() ? ((snap.data() as any).days || {}) : {};
}

export async function setResults(studentId: string, term: string, subjects: SubjectGrade[]) {
  await setDoc(doc(db, 'students', studentId, 'results', term), { subjects, updatedAt: Date.now() });
}
export async function getResults(studentId: string, term: string) {
  const snap = await getDoc(doc(db, 'students', studentId, 'results', term));
  return snap.exists() ? snap.data() : null;
}
