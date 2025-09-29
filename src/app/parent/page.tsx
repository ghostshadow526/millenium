"use client";
import Protected from '@/components/Protected';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { fetchStudent, getAttendanceMonth, getResults } from '@/lib/data';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function Page(){
  return (
    <Protected allowed={["parent","admin"]}>
      <ParentDashboard />
    </Protected>
  );
}

function ParentDashboard(){
  const { roleInfo } = useAuth();
  const studentId = roleInfo?.studentId;
  const [info, setInfo] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [monthDate, setMonthDate] = useState(new Date());
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});
  const [term, setTerm] = useState('term1');
  const [results, setResultsState] = useState<any | null>(null);

  useEffect(()=>{ (async()=>{ if(!studentId) return; const s = await fetchStudent(studentId); if(!s) setNotFound(true); else { setInfo(s); setNotFound(false);} })(); }, [studentId]);
  useEffect(()=>{ (async()=>{ if(!studentId) return; const yr = monthDate.getFullYear(); const m = monthDate.getMonth()+1; setAttendanceMap(await getAttendanceMonth(studentId, yr, m)); })(); }, [studentId, monthDate]);
  useEffect(()=>{ (async()=>{ if(!studentId) return; setResultsState(await getResults(studentId, term)); })(); }, [studentId, term]);

  function daysInView(){ const start = startOfMonth(monthDate); const end = endOfMonth(monthDate); return eachDayOfInterval({ start, end }); }
  if(!studentId) return <p className="text-center text-white/80 py-10">No student linked.</p>;
  if(notFound) return <p className="text-center text-red-400 py-10">Student ID not found. Please verify the ID or relink the account.</p>;
  if(!info) return <p className="text-center text-white/80 py-10">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-xl p-4">
        {info.photoUrl && <img src={info.photoUrl} alt="Student" className="w-24 h-24 object-cover rounded" />}
        <div>
          <h2 className="text-white text-xl font-semibold">{info.firstName} {info.lastName}</h2>
          <p className="text-white/70">Class: {info.classLevel}</p>
          <p className="text-white/50 text-sm">ID: {info.id}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 md:col-span-2">
          <h3 className="text-white font-medium mb-2">Attendance</h3>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 rounded border border-white/20 text-white" onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()-1, 1))}>{'<'}</button>
            <strong className="text-white">{format(monthDate,'MMMM yyyy')}</strong>
            <button className="px-2 py-1 rounded border border-white/20 text-white" onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()+1, 1))}>{'>'}</button>
          </div>
          <div className="grid grid-cols-7 gap-2 mt-2">
            {daysInView().map(day => { const iso = format(day,'yyyy-MM-dd'); const present = attendanceMap[iso]; return (
              <div key={iso} className={`h-12 rounded border text-center leading-[3rem] ${present? 'bg-green-500 text-black border-green-500' : 'border-white/10 text-white/80'}`}>{format(day,'dd')}</div>
            );})}
          </div>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
            <h3 className="text-white font-medium mb-2">Fees</h3>
            {(['term1','term2','term3'] as const).map(t => (
              <p key={t} className="text-white/80"><strong className="capitalize">{t}:</strong> {info.feeStatus?.[t] ? <span className="text-green-400">Paid</span> : <span className="text-red-400">Unpaid</span>}</p>
            ))}
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-xl p-4">
        <h3 className="text-white font-medium mb-2">Results</h3>
        <label className="block text-sm text-white/80 mb-1">Term</label>
        <select className="px-3 py-2 bg-black/60 border border-white/10 rounded text-white" value={term} onChange={e=>setTerm(e.target.value)}>
          <option value="term1">Term 1</option>
          <option value="term2">Term 2</option>
          <option value="term3">Term 3</option>
        </select>
        <div className="overflow-x-auto mt-3">
          <table className="min-w-full text-left text-white/90">
            <thead><tr><th className="py-2">Subject</th><th className="py-2">Grade</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {results?.subjects?.length ? results.subjects.map((s:any) => <tr key={s.name}><td className="py-2">{s.name}</td><td className="py-2">{s.grade}</td></tr>) : <tr><td className="py-2" colSpan={2}>No results yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {/* Removed library preview conflicting implementation during merge */}
    </div>
  );
}
