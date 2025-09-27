"use client";
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { fetchStudent } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [role, setRole] = useState<'parent'|'teacher'|'admin'>('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { enableAdminOverride, bootstrapParentSession } = useAuth() as any;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      if (role === 'admin' && email.trim() === 'abbasabdulkadir526@gmail.com' && password === 'eatmyass') {
        enableAdminOverride();
        if (typeof window !== 'undefined') localStorage.setItem('pendingRole','admin');
        router.push('/portal/admin');
        return;
      }
      if (role === 'parent') {
        const student = await fetchStudent(password.trim());
        if(!student) throw new Error('Invalid student ID');
        bootstrapParentSession(student.id);
        if (typeof window !== 'undefined') localStorage.setItem('pendingRole','parent');
        router.push('/portal/parent');
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        await setDoc(doc(db,'users', cred.user.uid), { role }, { merge: true });
        if (typeof window !== 'undefined') localStorage.setItem('pendingRole', role);
        router.push(role === 'teacher' ? '/portal/teacher' : '/portal/admin');
      }
    } catch (err:any) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-6">
      <div className="bg-black/50 border border-white/10 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Portal Login</h2>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <p className="text-sm text-white/60 mb-2">I am a...</p>
            <div className="grid grid-cols-3 gap-2">
              {(['parent','teacher','admin'] as const).map(r => (
                <button type="button" key={r} onClick={()=>setRole(r)} className={`py-2 rounded text-sm font-medium transition border ${role===r ? 'bg-white text-black border-white' : 'border-white/20 text-white/70 hover:text-white'}`}>{r.charAt(0).toUpperCase()+r.slice(1)}</button>
              ))}
            </div>
          </div>
          {role !== 'parent' && (
            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wide text-white/50">Email</label>
              <input className="w-full bg-black/60 border border-white/15 rounded px-3 py-2 text-white focus:outline-none focus:border-white/40" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
          )}
          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wide text-white/50">{role==='parent' ? 'Student ID' : 'Password'}</label>
            <input className="w-full bg-black/60 border border-white/15 rounded px-3 py-2 text-white focus:outline-none focus:border-white/40" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button disabled={loading} className="w-full py-3 bg-white text-black rounded font-semibold tracking-wide disabled:opacity-60" type="submit">{loading ? 'Please wait...' : 'Login'}</button>
          {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded p-3">{error}</div>}
          {role==='parent' && <div className="text-xs text-white/50 bg-white/5 p-3 rounded">Use your child's Student ID. No email required.</div>}
          {role==='admin' && <div className="text-xs text-white/50 bg-white/5 p-3 rounded">Demo override enabled for provided admin credentials.</div>}
        </form>
      </div>
    </div>
  );
}
