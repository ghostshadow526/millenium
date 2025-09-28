"use client";
import Protected from '@/components/Protected';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getStudentById } from '@/lib/data';

export default function StudentPage(){
  return <Protected allowed={['student','admin']}><StudentDashboard /></Protected>;
}

function StudentDashboard(){
  const { user, roleInfo } = useAuth();
  const [loading,setLoading] = useState(true);
  const [student,setStudent] = useState<any>(null);
  useEffect(()=>{ (async()=>{
    if(roleInfo?.role==='student' && roleInfo.studentId){
      const s = await getStudentById(roleInfo.studentId);
      setStudent(s); setLoading(false);
    } else if(roleInfo?.role==='admin'){ setLoading(false); }
  })(); }, [roleInfo]);
  if(loading) return <p className="p-10 text-center">Loading...</p>;
  if(!student) return <div className="max-w-md mx-auto p-6 card text-center space-y-3"><h2 className="font-semibold text-lg">No Student Record</h2><p className="text-sm text-grey">Student document not found for this login.</p></div>;
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="card p-6 flex gap-6">
        {student.photoUrl && <img src={student.photoUrl} className="w-24 h-24 rounded object-cover" />}
        <div>
          <h1 className="text-2xl font-semibold text-midnight_text">{student.name}</h1>
          <p className="text-sm text-grey">Class: {student.class}</p>
          <p className="text-xs text-grey">ID: {student.id}</p>
        </div>
      </div>
      <div className="card p-6">
        <h2 className="font-medium mb-2">Fee Status</h2>
        {(['term1','term2','term3'] as const).map(t => <p key={t} className="text-sm">{t.replace('term','Term ')}: {student.feeStatus?.[t]? <span className="text-green-500">Paid</span>: <span className="text-red-500">Unpaid</span>}</p>)}
      </div>
    </div>
  );
}
