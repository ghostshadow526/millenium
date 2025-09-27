"use client";
import Protected from '@/components/portal/Protected';
import { useEffect, useState } from 'react';
import { searchStudents, updateFeeStatus, setAttendance, getAttendanceMonth, setResults, fetchStudent } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function Page(){
  return (
    <Protected allowed={["teacher","admin"]}>
      <TeacherDashboard />
    </Protected>
  );
}

function TeacherDashboard(){
  const { roleInfo } = useAuth();
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});
  const [monthDate, setMonthDate] = useState(new Date());
  const [gradesText, setGradesText] = useState<string>('Mathematics:A, English:B');
  const [term, setTerm] = useState('term1');
  const [info, setInfo] = useState<any | null>(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [message, setMessage] = useState('');

  const doSearch = async () => {
    if (query.trim().length === 0) { setStudents([]); return; }
    const res = await searchStudents(query.trim());
    let filtered = res;
    if (roleInfo?.role === 'teacher' && roleInfo.classLevels) {
      const cls = new Set(roleInfo.classLevels);
      filtered = res.filter(r => cls.has(r.classLevel));
    }
    setStudents(filtered);
  };
  useEffect(()=>{ const t = setTimeout(doSearch, 400); return ()=>clearTimeout(t); }, [query]);

  useEffect(()=>{ (async()=>{ if(!selectedId) return; setInfo(await fetchStudent(selectedId)); await loadAttendance(); })(); }, [selectedId, monthDate]);

  async function loadAttendance(){ if(!selectedId) return; setLoadingAttendance(true); const yr = monthDate.getFullYear(); const m = monthDate.getMonth()+1; const data = await getAttendanceMonth(selectedId, yr, m); setAttendanceMap(data); setLoadingAttendance(false); }
  async function toggleAttendance(dateIso: string){ if(!selectedId) return; const present = !attendanceMap[dateIso]; await setAttendance(selectedId, dateIso, present); setAttendanceMap(prev=>({ ...prev, [dateIso]: present })); }
  function daysInView(){ const start = startOfMonth(monthDate); const end = endOfMonth(monthDate); return eachDayOfInterval({ start, end }); }
  async function saveResults(){ if(!selectedId) return; const subjects = gradesText.split(',').map(pair=>{ const [name, grade] = pair.split(':').map(s=>s.trim()); return { name, grade }; }).filter(s=>s.name && s.grade); await setResults(selectedId, term, subjects); setMessage('Results saved.'); setTimeout(()=>setMessage(''), 2000); }
  async function setFee(termKey: 'term1'|'term2'|'term3', paid: boolean){ if(!selectedId) return; await updateFeeStatus(selectedId, termKey, paid); setInfo(await fetchStudent(selectedId)); }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-semibold">Teacher Dashboard</h1>
        <div className="px-2 py-1 rounded border border-white/20 text-white/80">Teacher View</div>
      </div>
      <div className="bg-black/40 border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-white text-lg mb-3">Student Search</h2>
        <input className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" placeholder="Search student by name or ID" value={query} onChange={e=>setQuery(e.target.value)} />
        {students.length>0 && (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-left text-white/90">
              <thead className="text-white">
                <tr><th className="py-2">Name</th><th className="py-2">ID</th><th className="py-2">Class</th><th className="py-2">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map(st => (
                  <tr key={st.id}>
                    <td className="py-2">{st.firstName} {st.lastName}</td>
                    <td className="py-2"><span className="px-2 py-1 rounded border border-white/20 text-white/80 text-xs">{st.id}</span></td>
                    <td className="py-2">{st.classLevel}</td>
                    <td className="py-2"><button className="bg-white text-black px-3 py-1 rounded" onClick={()=>setSelectedId(st.id)}>View Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedId && info && (
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
            {info.photoUrl ? (
              <img src={info.photoUrl} alt={`${info.firstName} ${info.lastName}`} className="w-full h-64 object-cover" />
            ) : (
              <div className="w-full h-64 bg-white/10 flex items-center justify-center text-white/60">No Photo Available</div>
            )}
            <div className="p-4">
              <h3 className="text-white text-lg mb-1">{info.firstName} {info.lastName}</h3>
              <div className="px-2 py-1 rounded border border-white/20 text-white/80 inline-block mb-2">{info.classLevel}</div>
              <p className="text-white/60">ID: {info.id}</p>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-xl p-6">
            <h3 className="text-white text-lg mb-3">Student Records</h3>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <button className="px-2 py-1 rounded border border-white/20 text-white" onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()-1, 1))}>{'<'}</button>
                <strong className="text-white">{format(monthDate,'MMMM yyyy')}</strong>
                <button className="px-2 py-1 rounded border border-white/20 text-white" onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()+1, 1))}>{'>'}</button>
              </div>
              {loadingAttendance ? (
                <div className="p-3 rounded bg-white/5 text-white/80 text-center">Loading attendance data...</div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {daysInView().map(day=>{ const iso = format(day,'yyyy-MM-dd'); const present = attendanceMap[iso]; return (
                    <button key={iso} onClick={()=>toggleAttendance(iso)} className={`h-10 rounded border ${present? 'bg-white text-black border-white' : 'border-white/10 text-white/80 hover:bg-white/5'}`}>{format(day,'dd')}</button>
                  );})}
                </div>
              )}
            </div>
            <div className="mb-6">
              <h4 className="text-white font-medium mb-2">Fee Status</h4>
              <div className="space-y-2">
                {(['term1','term2','term3'] as const).map(t => (
                  <div key={t} className="flex items-center justify-between p-2 rounded bg-white/5">
                    <div><span className="text-white/80">{t.replace('term','Term ')}: </span>{info.feeStatus?.[t]? <span className="text-green-400">Paid</span> : <span className="text-red-400">Unpaid</span>}</div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded bg-white text-black" onClick={()=>setFee(t,true)}>Mark Paid</button>
                      <button className="px-3 py-1 rounded border border-white/20 text-white" onClick={()=>setFee(t,false)}>Mark Unpaid</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Results Entry</h4>
              <div className="mb-2">
                <label className="block text-sm text-white/80 mb-1">Term</label>
                <select className="px-3 py-2 bg-black/60 border border-white/10 rounded text-white" value={term} onChange={e=>setTerm(e.target.value)}>
                  <option value="term1">Term 1</option>
                  <option value="term2">Term 2</option>
                  <option value="term3">Term 3</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm text-white/80 mb-1">Grades (Subject:Grade, ...)</label>
                <textarea className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded text-white" rows={5} placeholder="Mathematics:A, English:B, Science:B+" value={gradesText} onChange={e=>setGradesText(e.target.value)} />
              </div>
              <button className="px-4 py-2 rounded bg-white text-black" onClick={saveResults}>Save Results</button>
              {message && <div className="mt-2 text-green-400">{message}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
