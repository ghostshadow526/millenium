"use client";
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchStudent } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { Icon } from '@iconify/react';

export default function LoginPage(){
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
    <section className="bg-slateGray min-h-screen flex items-center justify-center">
      <div className="portal-container">
        <div className="max-w-md mx-auto">
          <div className="card">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Icon icon="solar:login-3-bold" className="text-2xl text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-midnight_text">Portal Login</h2>
              <p className="text-grey mt-2">Access your dashboard</p>
            </div>
            
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-midnight_text mb-3">Select Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['parent','teacher','admin'] as const).map(r => (
                    <button 
                      key={r} 
                      type="button" 
                      onClick={()=>setRole(r)} 
                      className={`px-4 py-3 rounded-lg text-sm font-medium border transition ${
                        role===r
                          ? 'bg-primary text-white border-primary' 
                          : 'border-gray-300 text-midnight_text hover:bg-gray-50'
                      }`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {role !== 'parent' && (
                <div>
                  <label className="block text-sm font-medium text-midnight_text mb-2">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e=>setEmail(e.target.value)} 
                      required 
                      placeholder="user@example.com" 
                      className="w-full pl-12" 
                    />
                    <Icon icon="solar:letter-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-grey text-lg" />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-midnight_text mb-2">
                  {role==='parent' ? 'Student ID' : 'Password'}
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    required 
                    placeholder={role==='parent' ? 'Enter Student ID' : '••••••••'} 
                    className="w-full pl-12" 
                  />
                  <Icon 
                    icon={role === 'parent' ? "solar:card-bold" : "solar:lock-password-bold"} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-grey text-lg" 
                  />
                </div>
              </div>
              
              <button className="btn w-full justify-center" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Icon icon="solar:loading-bold" className="text-lg animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Icon icon="solar:login-2-bold" className="text-lg" />
                    Sign In
                  </>
                )}
              </button>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                  <Icon icon="solar:danger-circle-bold" className="text-lg text-red-500" />
                  {error}
                </div>
              )}
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-grey">
                Demo: Use admin override credentials for testing
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
