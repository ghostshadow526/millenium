"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, Role } from '@/contexts/AuthContext';

export default function Protected({ allowed, children }: { allowed: Role[]; children: React.ReactNode }) {
  const { loading, roleInfo, isOverrideAdmin } = useAuth();
  const router = useRouter();
  const effectiveRole = roleInfo?.role || (isOverrideAdmin ? 'admin' : null);

  useEffect(() => {
    if (!loading && (!effectiveRole || !allowed.includes(effectiveRole))) {
      router.replace('/auth/login');
    }
  }, [loading, effectiveRole, allowed, router]);

  if (loading) return <p className="text-center py-10 text-white/80">Loading...</p>;
  if (!effectiveRole || !allowed.includes(effectiveRole)) return null;
  return <>{children}</>;
}
