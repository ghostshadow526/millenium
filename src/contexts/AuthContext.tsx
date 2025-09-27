"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type Role = 'parent' | 'teacher' | 'admin';
interface RoleInfo { role: Role; studentId?: string; classLevels?: string[] }
interface AuthContextType {
  user: User | null;
  loading: boolean;
  roleInfo: RoleInfo | null;
  logout: () => Promise<void>;
  isOverrideAdmin: boolean;
  bootstrapParentSession: (studentId: string) => void;
  enableAdminOverride: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, roleInfo: null,
  logout: async () => {}, isOverrideAdmin: false,
  bootstrapParentSession: () => {}, enableAdminOverride: () => {}
});

export const AuthProvider: React.FC<{ children: any }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);
  const [overrideAdmin, setOverrideAdmin] = useState<boolean>(!!(typeof window !== 'undefined' && localStorage.getItem('overrideAdmin')));

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      const pendingRole = typeof window !== 'undefined' ? (localStorage.getItem('pendingRole') as Role | null) : null;
      if (u) {
        const ref = doc(db, 'users', u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          setRoleInfo({ role: data.role as Role, studentId: data.studentId, classLevels: data.classLevels });
        } else {
          if (pendingRole) setRoleInfo({ role: pendingRole }); else setRoleInfo(null);
        }
      } else {
        const parentSession = typeof window !== 'undefined' ? localStorage.getItem('parentSession') : null;
        if (parentSession) {
          try { const parsed = JSON.parse(parentSession); if (parsed.studentId) setRoleInfo({ role: 'parent', studentId: parsed.studentId }); else setRoleInfo(null); }
          catch { setRoleInfo(null); }
        } else { setRoleInfo(null); }
      }
      setLoading(false);
      if (pendingRole && typeof window !== 'undefined') localStorage.removeItem('pendingRole');
    });
    return () => unsub();
  }, []);

  async function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('overrideAdmin');
      localStorage.removeItem('parentSession');
    }
    if (auth.currentUser) await signOut(auth);
  }

  function bootstrapParentSession(studentId: string) {
    if (typeof window !== 'undefined') localStorage.setItem('parentSession', JSON.stringify({ studentId }));
    setRoleInfo({ role: 'parent', studentId });
  }

  function enableAdminOverride() {
    if (typeof window !== 'undefined') localStorage.setItem('overrideAdmin', 'true');
    setOverrideAdmin(true);
    setRoleInfo({ role: 'admin' });
  }

  return (
    <AuthContext.Provider value={{ user, loading, roleInfo: roleInfo || (overrideAdmin ? { role: 'admin' } : null), logout, isOverrideAdmin: overrideAdmin, bootstrapParentSession, enableAdminOverride }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
