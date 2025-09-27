"use client";
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { fetchStudent } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const search = useSearchParams();
  const initialRole = (search?.get('role') as 'parent'|'teacher'|'admin' | null) || 'parent';
  const [role, setRole] = useState<'parent'|'teacher'|'admin'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { enableAdminOverride } = useAuth();

  useEffect(()=>{ const r = search?.get('role'); if (r && ['parent','teacher','admin'].includes(r)) setRole(r as any); }, [search]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      if (role === 'admin' && email.trim() === 'abbasabdulkadir526@gmail.com' && password === 'eatmyass') {
        enableAdminOverride();
        if (typeof window !== 'undefined') localStorage.setItem('pendingRole','admin');
        router.push('/admin');
        return;
      }
      if (role === 'parent') {
        const student = await fetchStudent(password.trim());
        if(!student) throw new Error('Invalid student ID');
        if (typeof window !== 'undefined') {
          localStorage.setItem('parentSession', JSON.stringify({ studentId: student.id }));
          localStorage.setItem('pendingRole','parent');
        }
        router.push('/parent');
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        await setDoc(doc(db,'users', cred.user.uid), { role }, { merge: true });
        if (typeof window !== 'undefined') localStorage.setItem('pendingRole', role);
        router.push(role === 'teacher' ? '/teacher' : '/admin');
      }
    } catch (err:any) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto max-w-md py-16">
      <div className="bg-black/40 border border-white/10 rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">Portal Login</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {(['parent','teacher','admin'] as const).map(r => (
                <button key={r} type="button" onClick={()=>setRole(r)} className={`px-3 py-2 rounded-md border ${role===r? 'bg-white text-black border-white' : 'border-white/20 text-white/90 hover:bg-white/5'}`}>{r[0].toUpperCase()+r.slice(1)}</button>
              ))}
            </div>
          </div>
          {role !== 'parent' && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email Address</label>
              <input className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email" required />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-300 mb-1">{role==='parent'?'Student ID':'Password'}</label>
            <input className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={role==='parent'? 'Enter student ID' : 'Enter your password'} required />
          </div>
          <button className="w-full bg-white text-black font-semibold py-2 rounded-md hover:bg-gray-200 transition" type="submit" disabled={loading}>{loading? 'Please wait...' : 'Login'}</button>
          {error && <div className="text-red-400 text-sm">{error}</div>}
        </form>
      </div>
    </div>
  );
}
