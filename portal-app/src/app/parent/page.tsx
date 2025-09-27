"use client";
import Protected from '@/components/Protected';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { fetchStudent, getAttendanceMonth, getResults } from '@/lib/data';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function ParentPage(){ return <Protected allowed={['parent','admin']}><ParentDash/></Protected>; }

function ParentDash(){
  const { roleInfo } = useAuth();
  const studentId = roleInfo?.studentId;
  const [info,setInfo] = useState<any|null>(null);
  const [monthDate,setMonthDate] = useState(new Date());
  const [attendanceMap,setAttendanceMap] = useState<Record<string,boolean>>({});
  const [term,setTerm] = useState('term1');
  const [results,setResultsState] = useState<any|null>(null);

  useEffect(()=>{ (async()=>{ if(!studentId) return; setInfo(await fetchStudent(studentId)); })(); }, [studentId]);
  useEffect(()=>{ (async()=>{ if(!studentId) return; const yr=monthDate.getFullYear(); const m=monthDate.getMonth()+1; setAttendanceMap(await getAttendanceMonth(studentId, yr, m)); })(); }, [studentId, monthDate]);
  useEffect(()=>{ (async()=>{ if(!studentId) return; setResultsState(await getResults(studentId, term)); })(); }, [studentId, term]);
  function daysInView(){ const start = startOfMonth(monthDate); const end = endOfMonth(monthDate); return eachDayOfInterval({ start, end }); }
  if(!studentId) return <p className="text-center py-20">No student linked.</p>;
  if(!info) return <p className="text-center py-20">Loading...</p>;
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="card flex gap-6 items-center">
        {info.photoUrl && <img src={info.photoUrl} className="w-24 h-24 object-cover rounded" />}
        <div>
          <h2 className="text-xl font-semibold">{info.firstName} {info.lastName}</h2>
          <p className="text-white/60 text-sm">Class: {info.classLevel}</p>
          <p className="text-white/40 text-xs">ID: {info.id}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <button className="btn outline" onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()-1, 1))}>{'<'}</button>
            <strong>{format(monthDate,'MMMM yyyy')}</strong>
            <button className="btn outline" onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()+1, 1))}>{'>'}</button>
          </div>
          <div className="grid grid-cols-7 gap-2 mt-2">
            {daysInView().map(day=>{ const iso = format(day,'yyyy-MM-dd'); const present = attendanceMap[iso]; return <div key={iso} className={`h-12 rounded border text-center leading-[3rem] text-sm ${present? 'bg-green-500 text-black border-green-500' : 'border-white/10 text-white/60'}`}>{format(day,'dd')}</div>; })}
          </div>
        </div>
        <div className="card">
          <h3 className="font-medium mb-2">Fees</h3>
          {(['term1','term2','term3'] as const).map(t => <p key={t} className="text-sm">{t.replace('term','Term ')}: {info.feeStatus?.[t] ? <span className="text-green-400">Paid</span> : <span className="text-red-400">Unpaid</span>}</p>)}
        </div>
      </div>
      <div className="card">
        <h3 className="font-medium mb-2">Results</h3>
        <select value={term} onChange={e=>setTerm(e.target.value)} className="mb-3">
          <option value="term1">Term 1</option>
          <option value="term2">Term 2</option>
          <option value="term3">Term 3</option>
        </select>
        <div className="overflow-auto">
          <table className="table">
            <thead><tr><th>Subject</th><th>Grade</th></tr></thead>
            <tbody>{results?.subjects?.length ? results.subjects.map((s:any)=> <tr key={s.name}><td>{s.name}</td><td>{s.grade}</td></tr>) : <tr><td colSpan={2}>No results yet.</td></tr>}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
