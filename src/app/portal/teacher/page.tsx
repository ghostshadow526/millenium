"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { searchStudents, fetchStudent, getAttendanceMonth, setAttendance, setResults, updateFeeStatus, getResults } from '@/lib/data';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function TeacherDashboardPage(){
  const { roleInfo } = useAuth();
  if(!roleInfo || roleInfo.role !== 'teacher') return <div className="p-10 text-center text-white/60">Teacher access required.</div>;
  return <TeacherDashboard/>;
}

function TeacherDashboard(){
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [info, setInfo] = useState<any | null>(null);
  const [monthDate, setMonthDate] = useState(new Date());
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});
  const [term, setTerm] = useState('term1');
  const [gradesText, setGradesText] = useState('Mathematics:A, English:B');
  const [results, setResultsState] = useState<any|null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{ const t = setTimeout(()=>doSearch(), 400); return ()=>clearTimeout(t); }, [query]);
  useEffect(()=>{ if(selectedId) loadStudent(); }, [selectedId]);
  useEffect(()=>{ if(selectedId) loadAttendance(); }, [selectedId, monthDate]);
  useEffect(()=>{ if(selectedId) loadResults(); }, [selectedId, term]);

  async function doSearch(){
    if(!query.trim()) { setStudents([]); return; }
    const res = await searchStudents(query.trim());
    setStudents(res as any);
  }

  async function loadStudent(){ if(!selectedId) return; setInfo(await fetchStudent(selectedId)); }
  function daysInView(){ const start = startOfMonth(monthDate); const end = endOfMonth(monthDate); return eachDayOfInterval({ start, end }); }
  async function loadAttendance(){ if(!selectedId) return; const yr = monthDate.getFullYear(); const m = monthDate.getMonth()+1; const map = await getAttendanceMonth(selectedId, yr, m); setAttendanceMap(map); }
  async function toggleAttendance(dateIso: string){ if(!selectedId) return; const present = !attendanceMap[dateIso]; await setAttendance(selectedId, dateIso, present); setAttendanceMap(prev=>({...prev,[dateIso]:present})); }
  async function loadResults(){ if(!selectedId) return; setResultsState(await getResults(selectedId, term)); }
  async function saveResults(){ if(!selectedId) return; setSaving(true); try { const subjects = gradesText.split(',').map(p=>{ const [n,g]=p.split(':').map(s=>s.trim()); return { name:n, grade:g }; }).filter(x=>x.name && x.grade); await setResults(selectedId, term, subjects); loadResults(); } finally { setSaving(false);} }
  async function setFee(termKey:'term1'|'term2'|'term3', paid:boolean){ if(!selectedId) return; await updateFeeStatus(selectedId, termKey, paid); loadStudent(); }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <section className="bg-black/50 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Student Search</h2>
        <input placeholder="Search by name or ID" value={query} onChange={e=>setQuery(e.target.value)} className="w-full bg-black/60 border border-white/15 rounded px-3 py-2 text-white" />
        {students.length>0 && (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm text-white/80">
              <thead className="text-white">
                <tr><th className="py-2 text-left">Name</th><th className="py-2 text-left">ID</th><th className="py-2 text-left">Class</th><th className="py-2 text-left">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map(s=> (
                  <tr key={s.id}>
                    <td className="py-2">{s.firstName} {s.lastName}</td>
                    <td className="py-2"><span className="px-2 py-1 text-xs rounded bg-white/10">{s.id}</span></td>
                    <td className="py-2">{s.classLevel}</td>
                    <td className="py-2"><button onClick={()=>setSelectedId(s.id)} className="px-3 py-1 text-xs bg-white text-black rounded">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {query.trim() && students.length===0 && <p className="text-white/40 text-sm mt-4">No students found.</p>}
      </section>

      {selectedId && info && (
        <section className="grid lg:grid-cols-2 gap-6">
          <div className="bg-black/50 border border-white/10 rounded-xl p-6 space-y-6">
            <div className="flex gap-4 items-center">
              {info.photoUrl ? <img src={info.photoUrl} className="w-24 h-24 object-cover rounded"/> : <div className="w-24 h-24 rounded bg-white/5 flex items-center justify-center text-xs text-white/40">No Photo</div>}
              <div>
                <h3 className="text-white font-semibold">{info.firstName} {info.lastName}</h3>
                <p className="text-white/60 text-sm">Class: {info.classLevel}</p>
                <p className="text-white/60 text-xs">ID: {info.id}</p>
              </div>
            </div>
            <div>
              <h4 className="text-white/80 font-medium mb-2">Attendance</h4>
              <div className="flex items-center gap-2 mb-3">
                <button onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()-1, 1))} className="px-2 py-1 border border-white/20 rounded text-white">Prev</button>
                <span className="text-white/60 text-sm">{format(monthDate,'MMMM yyyy')}</span>
                <button onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()+1, 1))} className="px-2 py-1 border border-white/20 rounded text-white">Next</button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {daysInView().map(day=>{ const iso=format(day,'yyyy-MM-dd'); const present = attendanceMap[iso]; return (
                  <button key={iso} onClick={()=>toggleAttendance(iso)} className={`aspect-square text-xs rounded flex items-center justify-center border ${present? 'bg-green-500 text-black border-green-600':'border-white/15 text-white/60 hover:text-white'}`}>{format(day,'dd')}</button>
                ); })}
              </div>
            </div>
            <div>
              <h4 className="text-white/80 font-medium mb-2">Fee Status</h4>
              {(['term1','term2','term3'] as const).map(t => (
                <div key={t} className="flex items-center justify-between py-1 text-sm">
                  <span className="text-white/60">{t.toUpperCase()}</span>
                  <span className="flex gap-2">
                    <button onClick={()=>setFee(t,true)} className={`px-2 py-1 text-xs rounded ${info.feeStatus?.[t] ? 'bg-green-500 text-black':'bg-white/10 text-white/70'}`}>Paid</button>
                    <button onClick={()=>setFee(t,false)} className={`px-2 py-1 text-xs rounded ${!info.feeStatus?.[t] ? 'bg-red-500 text-black':'bg-white/10 text-white/70'}`}>Unpaid</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-black/50 border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-medium mb-4">Results Entry</h3>
            <div className="flex gap-3 mb-3">
              <select value={term} onChange={e=>setTerm(e.target.value)} className="bg-black/60 border border-white/15 rounded px-3 py-2 text-white">
                <option value="term1">Term 1</option>
                <option value="term2">Term 2</option>
                <option value="term3">Term 3</option>
              </select>
              <button onClick={saveResults} disabled={saving} className="px-4 py-2 bg-white text-black rounded text-sm">{saving? 'Saving...':'Save'}</button>
            </div>
            <textarea rows={5} className="w-full bg-black/60 border border-white/15 rounded px-3 py-2 text-white text-sm" value={gradesText} onChange={e=>setGradesText(e.target.value)} />
            <table className="w-full text-sm mt-4">
              <thead><tr className="text-white/70"><th className="py-1 text-left">Subject</th><th className="py-1 text-left">Grade</th></tr></thead>
              <tbody className="divide-y divide-white/5">
                {results?.subjects?.length ? results.subjects.map((r:any)=> <tr key={r.name}><td className="py-1">{r.name}</td><td className="py-1">{r.grade}</td></tr>) : <tr><td colSpan={2} className="py-3 text-white/40">No results.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
