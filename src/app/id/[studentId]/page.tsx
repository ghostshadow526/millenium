"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchStudent } from '@/lib/data';

export default function PublicStudentCardPage(){
  const params = useParams();
  const studentId = params?.studentId as string | undefined;
  const [info, setInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ (async()=>{ if(!studentId) return; const s = await fetchStudent(studentId); setInfo(s); setLoading(false); })(); }, [studentId]);
  if (loading) return <div className="container mx-auto p-10"><p className="text-white">Loading...</p></div>;
  if (!info) return <div className="container mx-auto p-10"><p className="text-white">Student not found.</p></div>;

  return (
    <div className="min-h-[60vh] flex items-start justify-center py-16 px-6">
      <div className="bg-black/60 border border-white/10 rounded-xl p-8 w-full max-w-md text-center">
        {info.photoUrl && <img src={info.photoUrl} alt="Student" className="w-40 h-40 rounded object-cover mx-auto mb-6" />}
        <h2 className="text-xl font-semibold text-white mb-2">ID CARD</h2>
        <p className="text-white text-lg font-medium mb-1">{info.firstName} {info.lastName}</p>
        <p className="text-white/60 text-sm mb-1">Class: {info.classLevel}</p>
        <p className="text-white/50 text-xs">Student ID: {info.id}</p>
      </div>
    </div>
  );
}
