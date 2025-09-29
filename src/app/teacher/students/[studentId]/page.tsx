"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Protected from '@/components/portal/Protected';
import { getStudent, updateStudentFields, getAttendanceMonthMap, setAttendanceDay } from '@/lib/studentService';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface EditStudent {
  firstName?: string;
  lastName?: string;
  classLevel?: string;
  parentEmail?: string;
  [k: string]: any;
}

export default function TeacherStudentDetailWrapper(){
  return <Protected allowed={['teacher','admin']}> <TeacherStudentDetail /> </Protected>;
}

function TeacherStudentDetail(){
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<any | null>(null);
  const [edit, setEdit] = useState<EditStudent>({});
  const [monthDate, setMonthDate] = useState(new Date());
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const ym = useMemo(()=> format(monthDate,'yyyy-MM'), [monthDate]);

  useEffect(()=>{ (async()=>{ if(!studentId) return; setLoading(true); const s = await getStudent(studentId); setStudent(s); setEdit(s||{}); const map = await getAttendanceMonthMap(studentId, ym); setAttendanceMap(map); setLoading(false); })(); }, [studentId, ym]);

  function daysInView(){ const start = startOfMonth(monthDate); const end = endOfMonth(monthDate); return eachDayOfInterval({ start, end }); }

  async function save(){ if(!studentId) return; setSaving(true); await updateStudentFields(studentId, { firstName: edit.firstName, lastName: edit.lastName, classLevel: edit.classLevel, parentEmail: edit.parentEmail }); setSaving(false); }
  async function toggleDay(iso: string){ if(!studentId) return; const newVal = !attendanceMap[iso]; setAttendanceMap(m=> ({ ...m, [iso]: newVal })); await setAttendanceDay(studentId, iso, newVal); }

  if(loading) return <div className="p-6 text-white">Loading...</div>;
  if(!student) return <div className="p-6 text-white">Student not found.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 space-y-4">
          <h2 className="text-white font-semibold text-lg">Student Profile</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">First Name</label>
              <input value={edit.firstName||''} onChange={e=>setEdit((p: EditStudent)=>({...p, firstName: e.target.value}))} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Last Name</label>
              <input value={edit.lastName||''} onChange={e=>setEdit((p: EditStudent)=>({...p, lastName: e.target.value}))} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Class Level</label>
              <input value={edit.classLevel||''} onChange={e=>setEdit((p: EditStudent)=>({...p, classLevel: e.target.value}))} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Parent Email</label>
              <input value={edit.parentEmail||''} onChange={e=>setEdit((p: EditStudent)=>({...p, parentEmail: e.target.value}))} className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50">{saving? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>
        <div className="w-full lg:w-80 bg-black/40 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Overview</h3>
          <p className="text-white/70 text-sm">ID: {student.id}</p>
          <p className="text-white/70 text-sm">Class: {student.classLevel}</p>
          <p className="text-white/70 text-sm">Created: {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '-'}</p>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-white font-medium">Attendance - {format(monthDate,'MMMM yyyy')}</h3>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()-1, 1))} className="px-2 py-1 text-white border border-white/10 rounded">{'<'}</button>
            <button onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()+1, 1))} className="px-2 py-1 text-white border border-white/10 rounded">{'>'}</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {daysInView().map(day => { const iso = format(day,'yyyy-MM-dd'); const present = attendanceMap[iso]; return (
            <button type="button" key={iso} onClick={()=>toggleDay(iso)} className={`h-14 rounded text-sm font-medium border transition ${present? 'bg-green-500 text-black border-green-500' : 'bg-black/40 text-white/60 border-white/10 hover:border-white/30'}`}>{format(day,'dd')}</button>
          ); })}
        </div>
      </div>
    </div>
  );
}
