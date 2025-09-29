"use client";
import { useEffect, useMemo, useState } from 'react';
import Protected from '@/components/portal/Protected';
import { listStudents, getAttendanceMonthMap, setAttendanceDay } from '@/lib/studentService';
import { format } from 'date-fns';

export default function TeacherAttendanceWrapper(){
  return <Protected allowed={['teacher','admin']}> <TeacherAttendancePage /> </Protected>;
}

interface StudentRow { id: string; firstName: string; lastName: string; classLevel?: string; photoUrl?: string; }

function TeacherAttendancePage(){
  const [monthDate, setMonthDate] = useState(new Date());
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, Record<string, boolean>>>({}); // studentId -> { dateIso: present }
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const ym = useMemo(()=> format(monthDate,'yyyy-MM'), [monthDate]);

  useEffect(()=>{ (async()=>{
    setLoading(true);
    const page = await listStudents(200);
    setStudents(page.students as any);
    // load attendance for each student sequentially (could optimize)
    const map: Record<string, Record<string, boolean>> = {};
    for (const s of page.students){
      map[s.id] = await getAttendanceMonthMap(s.id, ym);
    }
    setAttendanceMap(map);
    setLoading(false);
  })(); }, [ym]);

  const daysInMonth = useMemo(()=>{ const days: string[] = []; const year = monthDate.getFullYear(); const m = monthDate.getMonth(); const last = new Date(year, m+1, 0).getDate(); for(let d=1; d<=last; d++){ const iso = `${year}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; days.push(iso); } return days; }, [monthDate]);

  function toggle(studentId: string, iso: string){ const present = !(attendanceMap[studentId]?.[iso]); setAttendanceMap(m=> ({ ...m, [studentId]: { ...(m[studentId]||{}), [iso]: present } })); setAttendanceDay(studentId, iso, present); }

  function exportCsv(){
    const rows: string[][] = [];
    rows.push(['Student ID','Name','Date','Present']);
    for (const s of students){
      for (const day of daysInMonth){
        if (attendanceMap[s.id]?.[day]) rows.push([s.id, `${s.firstName} ${s.lastName}`, day, '1']);
      }
    }
    const csv = rows.map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `attendance-${ym}.csv`; a.click();
  }

  const filtered = filter.trim() ? students.filter(s => {
    const t = filter.toLowerCase();
    return s.id.toLowerCase().includes(t) || `${s.firstName} ${s.lastName}`.toLowerCase().includes(t) || (s.classLevel||'').toLowerCase().includes(t);
  }) : students;

  if (loading) return <div className="p-6 text-white">Loading attendance...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Attendance - {format(monthDate,'MMMM yyyy')}</h1>
        <div className="flex gap-2 items-center">
          <button onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()-1, 1))} className="px-2 py-1 text-white border border-white/10 rounded">{'<'}</button>
          <button onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()+1, 1))} className="px-2 py-1 text-white border border-white/10 rounded">{'>'}</button>
          <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search" className="px-3 py-2 bg-black/40 border border-white/10 rounded text-white" />
          <button onClick={exportCsv} className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded">Export CSV</button>
        </div>
      </div>
      <div className="overflow-auto border border-white/10 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-black/40 text-white/70">
            <tr>
              <th className="px-3 py-2 text-left sticky left-0 bg-black/40 backdrop-blur z-10">Student</th>
              {daysInMonth.map(d => <th key={d} className="px-1 py-1 w-8 text-center">{d.slice(-2)}</th>)}
              <th className="px-3 py-2">% Present</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => { const map = attendanceMap[s.id]||{}; const total = daysInMonth.length; const presentCount = daysInMonth.filter(d => map[d]).length; const pct = total? Math.round(presentCount/total*100):0; return (
              <tr key={s.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-3 py-2 font-medium text-white sticky left-0 bg-black/30 backdrop-blur z-10">
                  <div className="flex items-center gap-2">
                    {s.photoUrl && <img src={s.photoUrl} className="w-6 h-6 rounded object-cover" />}
                    <div>
                      <div className="text-[13px]">{s.firstName} {s.lastName}</div>
                      <div className="text-[11px] text-white/40">{s.id}</div>
                    </div>
                  </div>
                </td>
                {daysInMonth.map(d => { const present = map[d]; return (
                  <td key={d} className="px-0.5 py-0.5 text-center">
                    <button onClick={()=>toggle(s.id, d)} className={`w-6 h-6 rounded text-[10px] font-semibold border transition ${present? 'bg-green-500 text-black border-green-500' : 'bg-black/40 text-white/40 border-white/10 hover:border-white/30'}`}>{d.slice(-2)}</button>
                  </td>
                ); })}
                <td className="px-3 py-2 text-white/80 font-medium">{pct}%</td>
              </tr>
            ); })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
