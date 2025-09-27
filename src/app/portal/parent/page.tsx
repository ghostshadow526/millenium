"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchStudent, getAttendanceMonth, getResults } from '@/lib/data';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function ParentDashboardPage(){
  const { roleInfo } = useAuth();
  if(!roleInfo || roleInfo.role !== 'parent') return <div className="p-10 text-center text-white/60">Parent access required.</div>;
  return <ParentDashboard studentId={roleInfo.studentId!}/>;
}

function ParentDashboard({ studentId}:{ studentId:string }){
  const [info, setInfo] = useState<any | null>(null);
  const [monthDate, setMonthDate] = useState(new Date());
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});
  const [term, setTerm] = useState('term1');
  const [results, setResultsState] = useState<any | null>(null);

  useEffect(()=>{ (async()=>{ setInfo(await fetchStudent(studentId)); })(); }, [studentId]);
  useEffect(()=>{ (async()=>{ const yr = monthDate.getFullYear(); const m = monthDate.getMonth()+1; setAttendanceMap(await getAttendanceMonth(studentId, yr, m)); })(); }, [studentId, monthDate]);
  useEffect(()=>{ (async()=>{ setResultsState(await getResults(studentId, term)); })(); }, [studentId, term]);

  function daysInView(){ const start = startOfMonth(monthDate); const end = endOfMonth(monthDate); return eachDayOfInterval({ start, end }); }
  if(!info) return <div className="p-10 text-center text-white/60">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-black/50 border border-white/10 rounded-xl p-6 flex gap-5 items-center">
        {info.photoUrl && <img src={info.photoUrl} className="w-24 h-24 rounded object-cover" />}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">{info.firstName} {info.lastName}</h2>
          <p className="text-white/60 text-sm mb-1">Class: {info.classLevel}</p>
          <p className="text-white/50 text-xs">ID: {info.id}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-black/50 border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">Attendance</h3>
          <div className="flex items-center gap-2 mb-3">
            <button onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()-1, 1))} className="px-2 py-1 border border-white/20 rounded text-white">Prev</button>
            <span className="text-white/60 text-sm">{format(monthDate,'MMMM yyyy')}</span>
            <button onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()+1, 1))} className="px-2 py-1 border border-white/20 rounded text-white">Next</button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {daysInView().map(day => { const iso = format(day,'yyyy-MM-dd'); const present = attendanceMap[iso]; return <div key={iso} className={`aspect-square text-xs rounded flex items-center justify-center border ${present? 'bg-green-500 text-black border-green-600':'border-white/15 text-white/50'}`}>{format(day,'dd')}</div>; })}
          </div>
        </div>
        <div className="bg-black/50 border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">Fees</h3>
          {(['term1','term2','term3'] as const).map(t => (
            <p key={t} className="text-sm text-white/70 flex items-center gap-2 mb-2"><span className="w-16 inline-block uppercase text-white/40">{t}</span> {info.feeStatus?.[t] ? <span className="px-2 py-1 rounded text-xs bg-green-500 text-black">Paid</span>: <span className="px-2 py-1 rounded text-xs bg-red-500 text-black">Unpaid</span>}</p>
          ))}
        </div>
        <div className="bg-black/50 border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">Results</h3>
          <select value={term} onChange={e=>setTerm(e.target.value)} className="bg-black/60 border border-white/15 rounded px-3 py-2 text-white text-sm mb-3">
            <option value="term1">Term 1</option>
            <option value="term2">Term 2</option>
            <option value="term3">Term 3</option>
          </select>
          <table className="w-full text-sm">
            <thead><tr className="text-white/70"><th className="py-1 text-left">Subject</th><th className="py-1 text-left">Grade</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {results?.subjects?.length ? results.subjects.map((s:any)=> <tr key={s.name}><td className="py-1">{s.name}</td><td className="py-1">{s.grade}</td></tr>) : <tr><td colSpan={2} className="py-3 text-white/40">No results yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
