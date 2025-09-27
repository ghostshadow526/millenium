"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchStudent } from '@/lib/data';

export default function PublicCard(){
  const params = useParams();
  const studentId = params?.studentId as string | undefined;
  const [info,setInfo] = useState<any|null>(null);
  const [loading,setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ if(!studentId) return; const s = await fetchStudent(studentId); setInfo(s); setLoading(false); })(); }, [studentId]);
  if(loading) return <div className="py-24 text-center">Loading...</div>;
  if(!info) return <div className="py-24 text-center">Not found.</div>;
  return (
    <div className="min-h-[60vh] flex items-start justify-center py-16 px-6">
      <div className="card w-full max-w-md text-center">
        {info.photoUrl && <img src={info.photoUrl} className="w-40 h-40 rounded object-cover mx-auto mb-6" />}
        <h2 className="text-xl font-semibold mb-2">STUDENT ID</h2>
        <p className="text-lg font-medium mb-1">{info.firstName} {info.lastName}</p>
        <p className="text-white/60 text-sm mb-1">Class: {info.classLevel}</p>
        <p className="text-white/40 text-xs">ID: {info.id}</p>
      </div>
    </div>
  );
}
