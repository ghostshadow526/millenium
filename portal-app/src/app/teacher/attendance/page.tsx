'use client';
import { useEffect, useMemo, useState } from 'react';
import Protected from '@/components/Protected';
import { searchStudentsByName, getAttendanceMonth, setAttendance as setAttendanceDay } from '@/lib/data';
import type { Student } from '@/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function AttendanceWrapper(){
  return <Protected allowed={['teacher','admin']}><AttendancePage/></Protected>;
}

function AttendancePage(){
  const [students, setStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState('');
  const [monthDate, setMonthDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<Record<string, Record<string, boolean>>>({}); // studentId -> { iso: bool }

  const ym = useMemo(()=> format(monthDate,'yyyy-MM'), [monthDate]);

  useEffect(()=>{ (async()=>{ setLoading(true); const list = await searchStudentsByName(query); setStudents(list); // load attendance maps
    const maps: Record<string, Record<string, boolean>> = {};
    for(const s of list){ maps[s.id] = await getAttendanceMonth(s.id, monthDate.getFullYear(), monthDate.getMonth()+1); }
    setAttendance(maps); setLoading(false); })(); }, [query, ym]);

  const days = useMemo(()=>{ const start = startOfMonth(monthDate); const end = endOfMonth(monthDate); return eachDayOfInterval({ start, end }); }, [ym]);

  async function toggle(studentId: string, iso: string){
    const current = !!attendance[studentId]?.[iso];
    try {
      await setAttendanceDay(studentId, iso, !current);
      setAttendance(prev=> ({ ...prev, [studentId]: { ...(prev[studentId]||{}), [iso]: !current } }));
    } catch(e){
      console.error('Attendance update failed', e);
    }
  }

  function exportCsv(){ const header = ['Student ID','Name', ...days.map(d=> format(d,'dd'))]; const rows = students.map(s=> { const map = attendance[s.id]||{}; return [s.id, s.name, ...days.map(d=> map[format(d,'yyyy-MM-dd')]? 'P':'A')]; }); const csv = [header, ...rows].map(r=> r.join(',')).join('\n'); const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `attendance-${ym}.csv`; a.click(); URL.revokeObjectURL(url); }

  return (
    <div className="min-h-screen bg-slateGray py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-wrap gap-4 items-center">
          <h1 className="text-2xl font-semibold text-midnight_text">Attendance - {format(monthDate,'MMMM yyyy')}</h1>
          <div className="flex gap-2 ml-auto items-center">
            <button onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()-1, 1))} className="px-3 py-1 border rounded">Prev</button>
            <button onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()+1, 1))} className="px-3 py-1 border rounded">Next</button>
            <input value={query} onChange={e=> setQuery(e.target.value)} placeholder="Search" className="px-3 py-1 border rounded" />
            <button onClick={exportCsv} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Export CSV</button>
          </div>
        </div>
        <div className="overflow-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-600 sticky left-0 bg-gray-50 z-10">Student</th>
                {days.map(d=> <th key={d.toISOString()} className="px-1 py-1 text-center font-medium text-gray-500 w-8">{format(d,'dd')}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading && (<tr><td colSpan={days.length+1} className="px-3 py-6 text-center text-gray-500">Loading...</td></tr>)}
              {!loading && students.length === 0 && (<tr><td colSpan={days.length+1} className="px-3 py-6 text-center text-gray-400">No students</td></tr>)}
              {!loading && students.map(s=> {
                const map = attendance[s.id] || {}; return (
                  <tr key={s.id} className="border-t">
                    <td className="px-3 py-2 whitespace-nowrap sticky left-0 bg-white z-10 font-medium text-gray-700">{s.name}<div className="text-[10px] text-gray-400">{s.class}</div></td>
                    {days.map(d=> { const iso = format(d,'yyyy-MM-dd'); const present = !!map[iso]; return (
                      <td key={iso} className="px-0.5 py-0.5 text-center">
                        <button onClick={()=>toggle(s.id, iso)} className={`w-8 h-8 rounded text-[11px] font-semibold border transition ${present? 'bg-green-500 text-black border-green-500':'bg-gray-50 text-gray-400 border-gray-300 hover:bg-gray-100'}`}>{present? 'P':'A'}</button>
                      </td>
                    ); })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
