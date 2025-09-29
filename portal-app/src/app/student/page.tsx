"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Deprecated: Student dashboard removed. Redirect users to login.
export default function StudentPage(){
  const router = useRouter();
  useEffect(()=>{ router.replace('/login'); }, [router]);
  return <p className="p-8 text-center text-sm text-gray-500">Student portal deprecated. Redirecting...</p>;
}
