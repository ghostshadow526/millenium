'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Protected from '@/components/Protected';
import { getStudentById, updateStudent, getAttendanceMonth, setAttendance, getResults, setResults, updateFeeStatus } from '@/lib/data';
import QRCode from 'qrcode';
import { useAuth } from '@/contexts/AuthContext';
import type { Student } from '@/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import toast from 'react-hot-toast';

export default function StudentDetailWrapper(){
  return <Protected allowed={['teacher','admin']}><StudentDetailPage/></Protected>;
}

function StudentDetailPage(){
  const { studentId } = useParams<{ studentId: string }>();
  const { roleInfo } = useAuth();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [edit, setEdit] = useState<Partial<Student>>({});
  const [monthDate, setMonthDate] = useState(new Date());
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [term, setTerm] = useState<'term1'|'term2'|'term3'>('term1');
  const [subjects, setSubjects] = useState<{ name:string; grade:string }[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [loading, setLoading] = useState(true);

  const ym = useMemo(()=> format(monthDate,'yyyy-MM'), [monthDate]);

  useEffect(()=>{ (async()=>{ if(!studentId) return; setLoading(true); const s = await getStudentById(studentId); if(!s){ setLoading(false); return; } setStudent(s); setEdit({ name: s.name, class: s.class, rollNumber: s.rollNumber, parentEmail: s.parentEmail, parentPhone: s.parentPhone }); const map = await getAttendanceMonth(studentId, monthDate.getFullYear(), monthDate.getMonth()+1); setAttendanceMap(map); setLoading(false); })(); }, [studentId, ym]);
  useEffect(()=>{ (async()=>{ if(!studentId) return; setResultsLoading(true); const r:any = await getResults(studentId, term); setSubjects(r?.subjects || []); setResultsLoading(false); })(); }, [studentId, term]);

  function daysInView(){ const start = startOfMonth(monthDate); const end = endOfMonth(monthDate); return eachDayOfInterval({ start, end }); }

  async function save(){ if(!studentId) return; setSaving(true); try { await updateStudent(studentId, { name: edit.name||'', class: edit.class||'', rollNumber: edit.rollNumber||'', parentEmail: edit.parentEmail, parentPhone: edit.parentPhone }); toast.success('Student updated'); } catch(e){ toast.error('Update failed'); } finally { setSaving(false); } }
  async function toggleDay(iso: string){ if(!studentId) return; const current = !!attendanceMap[iso]; try { await setAttendance(studentId, iso, !current); setAttendanceMap(m=> ({ ...m, [iso]: !current })); } catch(e){ toast.error('Attendance update failed'); } }
  function updateSubject(idx:number, field:'name'|'grade', value:string){ setSubjects(list => list.map((s,i)=> i===idx? { ...s, [field]: value }: s)); }
  function addSubject(){ setSubjects(l => [...l, { name:'', grade:'' }]); }
  function removeSubject(i:number){ setSubjects(l => l.filter((_,idx)=> idx!==i)); }
  async function saveResults(){ if(!studentId) return; await setResults(studentId, term, subjects); toast.success('Results saved'); }
  async function toggleFee(termKey:'term1'|'term2'|'term3'){ if(!student || !studentId) return; const current = !!student.feeStatus?.[termKey]; await updateFeeStatus(studentId, termKey, !current); setStudent(s=> s? { ...s, feeStatus:{ ...(s.feeStatus||{term1:false,term2:false,term3:false}), [termKey]: !current } }: s); }
  async function generateQr(){
    if(!studentId) return; if(!roleInfo || roleInfo.role!=='admin') return;
    try {
      setGeneratingQR(true);
      const qrUrl = `${window.location.origin}/student-id/${studentId}`;
      const dataUrl = await QRCode.toDataURL(qrUrl, { width:200, margin:2, color:{ dark:'#6556ff', light:'#ffffff' }});
      const now = new Date();
  const actor = (roleInfo as any)?.uid || student?.registeredByUid || 'admin';
  const historyEntry = { generatedAt: now, generatedBy: actor } as any;
  await updateStudent(studentId, { qrCode: dataUrl, qrGeneratedAt: now, qrGeneratedBy: actor, qrHistory: [...(student?.qrHistory||[]), historyEntry] });
  setStudent(s=> s? { ...s, qrCode: dataUrl, qrGeneratedAt: now, qrGeneratedBy: actor, qrHistory:[...(s.qrHistory||[]), historyEntry] }: s);
      toast.success('QR generated');
    } catch(e){
      toast.error('QR generation failed');
    } finally { setGeneratingQR(false); }
  }

  if(loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if(!student) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><p className="text-sm">Student not found.</p><button onClick={()=>router.push('/teacher/students')} className="btn btn-primary">Back</button></div>;

  return (
    <div className="min-h-screen bg-slateGray py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex flex-wrap gap-4 items-start justify-between">
          <div className="flex items-center gap-4">
            {student.photoUrl && <img src={student.photoUrl} className="w-24 h-24 rounded object-cover" />}
            <div>
              <h1 className="text-2xl font-semibold text-midnight_text">{student.name}</h1>
              <p className="text-grey text-sm">ID: {student.id}</p>
              <p className="text-grey text-sm">Class: {student.class}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>router.push('/teacher/students')} className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50 text-sm">Back</button>
            <button onClick={save} disabled={saving} className="btn btn-primary text-sm">{saving? 'Saving...' : 'Save'}</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-midnight_text">Edit Profile</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-grey block mb-1">Name</label>
                  <input value={edit.name||''} onChange={e=>setEdit(p=>({...p, name: e.target.value}))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs font-medium text-grey block mb-1">Class</label>
                  <input value={edit.class||''} onChange={e=>setEdit(p=>({...p, class: e.target.value}))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs font-medium text-grey block mb-1">Roll Number</label>
                  <input value={edit.rollNumber||''} onChange={e=>setEdit(p=>({...p, rollNumber: e.target.value}))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs font-medium text-grey block mb-1">Parent Email</label>
                  <input value={edit.parentEmail||''} onChange={e=>setEdit(p=>({...p, parentEmail: e.target.value}))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs font-medium text-grey block mb-1">Parent Phone</label>
                  <input value={edit.parentPhone||''} onChange={e=>setEdit(p=>({...p, parentPhone: e.target.value}))} className="w-full px-3 py-2 border rounded" />
                </div>
              </div>
            </section>
            <section className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-semibold text-midnight_text">Attendance - {format(monthDate,'MMMM yyyy')}</h2>
                <div className="ml-auto flex gap-2">
                  <button onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()-1, 1))} className="px-2 py-1 border rounded">{'<'}</button>
                  <button onClick={()=>setMonthDate(d=> new Date(d.getFullYear(), d.getMonth()+1, 1))} className="px-2 py-1 border rounded">{'>'}</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {daysInView().map(day => { const iso = format(day,'yyyy-MM-dd'); const present = attendanceMap[iso]; return (
                  <button type="button" key={iso} onClick={()=>toggleDay(iso)} className={`h-12 rounded border text-sm font-medium transition ${present? 'bg-green-500 text-black border-green-500' : 'bg-gray-50 hover:bg-gray-100 text-gray-500 border-gray-300'}`}>{format(day,'dd')}</button>
                ); })}
              </div>
            </section>
            <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-midnight_text">Results</h2>
                <select value={term} onChange={e=>setTerm(e.target.value as any)} className="ml-auto px-3 py-2 border rounded text-sm">
                  <option value="term1">Term 1</option>
                  <option value="term2">Term 2</option>
                  <option value="term3">Term 3</option>
                </select>
                <button onClick={addSubject} className="px-3 py-2 border rounded text-sm">Add Subject</button>
                <button onClick={saveResults} className="btn btn-primary text-sm">Save Results</button>
              </div>
              {resultsLoading? <p className="text-sm text-grey">Loading results...</p> : (
                <div className="space-y-3">
                  {subjects.length===0 && <p className="text-xs text-grey">No subjects yet. Add one.</p>}
                  {subjects.map((sub, idx)=>(
                    <div key={idx} className="flex gap-2">
                      <input value={sub.name} onChange={e=>updateSubject(idx,'name', e.target.value)} placeholder="Subject" className="flex-1 px-3 py-2 border rounded text-sm" />
                      <input value={sub.grade} onChange={e=>updateSubject(idx,'grade', e.target.value)} placeholder="Grade" className="w-28 px-3 py-2 border rounded text-sm" />
                      <button onClick={()=>removeSubject(idx)} className="px-2 py-2 border rounded text-xs">×</button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
          <div className="space-y-6">
            <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
              <h2 className="font-semibold text-midnight_text">QR / Meta</h2>
              {student.qrCode ? <img src={student.qrCode} className="w-40 h-40 object-contain" /> : <p className="text-xs text-grey">No QR generated.</p>}
              {!student.qrCode && roleInfo?.role==='admin' && <button disabled={generatingQR} onClick={generateQr} className="px-3 py-2 border rounded text-xs w-fit">{generatingQR? 'Generating...' : 'Generate QR'}</button>}
              <p className="text-xs text-grey">Created: {student.createdAt.toLocaleDateString()}</p>
              <p className="text-xs text-grey">Updated: {student.updatedAt.toLocaleDateString()}</p>
              {student.qrGeneratedAt && <p className="text-xs text-grey">QR Last Gen: {student.qrGeneratedAt.toLocaleDateString()} by {student.qrGeneratedBy}</p>}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[11px] text-grey">Parent Login Passcode / Student ID:</p>
                <p className="font-mono text-xs text-midnight_text bg-gray-50 px-2 py-1 rounded border w-fit mt-1">{student.id}</p>
              </div>
            </section>
            <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
              <h2 className="font-semibold text-midnight_text">Fee Status</h2>
              {(['term1','term2','term3'] as const).map(t => { const paid = !!student.feeStatus?.[t]; return (
                <div key={t} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{t}</span>
                  <button onClick={()=>toggleFee(t)} className={`px-3 py-1 rounded border text-xs font-medium ${paid? 'bg-green-500 text-black border-green-500':'bg-gray-100 text-gray-600 border-gray-300'}`}>{paid? 'Paid':'Unpaid'}</button>
                </div>
              ); })}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
