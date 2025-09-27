"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addStudent, fetchStudent, fetchStudentsPage, searchStudents, updateFeeStatus, setResults, getResults, setAttendance, getAttendanceMonth } from '@/lib/data';
import { uploadStudentPhoto } from '@/lib/data';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface StudentRow { id:string; firstName:string; lastName:string; classLevel:string; photoUrl?:string; feeStatus?:any; }

export default function AdminDashboardPage(){
  const { roleInfo } = useAuth();
  if(!roleInfo || roleInfo.role !== 'admin') return <div className="p-10 text-center text-white/60">Admin access required.</div>;
  return <AdminDashboard/>;
}

function AdminDashboard(){
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [classLevel, setClassLevel] = useState('JSS1');
  const [subjects, setSubjects] = useState('Mathematics, English');
  const [parentEmail, setParentEmail] = useState('');
  const [photoFile, setPhotoFile] = useState<File | undefined>();
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<string| null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [search, setSearch] = useState('');
  const [term, setTerm] = useState('term1');
  const [results, setResultsState] = useState<any|null>(null);
  const [attendanceMonth, setAttendanceMonth] = useState(new Date());
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(()=>{ if(selectedId) loadResults(); }, [selectedId, term]);
  useEffect(()=>{ if(selectedId) loadAttendance(); }, [selectedId, attendanceMonth]);

  async function handleCreate(e:React.FormEvent){
    e.preventDefault(); setCreating(true); setMessage(null);
    try {
      let photoUrl: string | undefined;
      if(photoFile){
        // reuse upload logic in addStudent (already compresses) - but here we simulate direct usage
        photoUrl = undefined; // data layer handles inside addStudent
      }
      const res = await addStudent({ firstName, lastName, classLevel, parentEmail: parentEmail||undefined, subjects: subjects.split(',').map(s=>s.trim()).filter(Boolean), photoFile });
      setMessage(`Student created: ${res.student.id}`);
      setFirstName(''); setLastName(''); setParentEmail(''); setSubjects('Mathematics, English'); setPhotoFile(undefined);
    } catch(err:any){ setMessage(err.message || 'Failed'); }
    finally{ setCreating(false);}    
  }

  async function doSearch(){
    if(!search.trim()){ setStudents([]); return; }
    const res = await searchStudents(search.trim());
    setStudents(res as any);
  }

  async function loadResults(){
    if(!selectedId) return; const r = await getResults(selectedId, term); setResultsState(r); }

  async function saveResultsForm(e:React.FormEvent){
    e.preventDefault(); if(!selectedId) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const text = formData.get('grades') as string;
    const subjectsParsed = text.split(',').map(p=>{ const [n,g]=p.split(':').map(s=>s.trim()); return { name:n, grade:g}; }).filter(x=>x.name && x.grade);
    await setResults(selectedId, term, subjectsParsed);
    loadResults();
  }

  async function toggleFee(t:'term1'|'term2'|'term3', paid:boolean){
    if(!selectedId) return; await updateFeeStatus(selectedId, t, paid); const st = await fetchStudent(selectedId); if(st){ setStudents(prev=> prev.map(p=> p.id===st.id ? st as any : p)); }
  }

  function daysInView(){ const start = startOfMonth(attendanceMonth); const end = endOfMonth(attendanceMonth); return eachDayOfInterval({ start, end }); }
  async function loadAttendance(){ if(!selectedId) return; const yr = attendanceMonth.getFullYear(); const m = attendanceMonth.getMonth()+1; const map = await getAttendanceMonth(selectedId, yr, m); setAttendanceMap(map); }
  async function toggleAttendance(dateIso:string){ if(!selectedId) return; const present = !attendanceMap[dateIso]; await setAttendance(selectedId, dateIso, present); setAttendanceMap(prev=>({...prev,[dateIso]:present})); }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <section className="bg-black/50 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Add New Student</h2>
        <form onSubmit={handleCreate} className="grid md:grid-cols-3 gap-4">
          <input placeholder="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)} className="bg-black/60 border border-white/15 rounded px-3 py-2 text-white" required />
          <input placeholder="Last Name" value={lastName} onChange={e=>setLastName(e.target.value)} className="bg-black/60 border border-white/15 rounded px-3 py-2 text-white" required />
          <input placeholder="Class Level" value={classLevel} onChange={e=>setClassLevel(e.target.value)} className="bg-black/60 border border-white/15 rounded px-3 py-2 text-white" required />
          <input placeholder="Parent Email (optional)" value={parentEmail} onChange={e=>setParentEmail(e.target.value)} className="bg-black/60 border border-white/15 rounded px-3 py-2 text-white md:col-span-2" />
          <input placeholder="Subjects (comma)" value={subjects} onChange={e=>setSubjects(e.target.value)} className="bg-black/60 border border-white/15 rounded px-3 py-2 text-white md:col-span-1" />
          <input type="file" onChange={e=>setPhotoFile(e.target.files?.[0])} className="text-white text-sm" />
          <div className="md:col-span-3 flex gap-4 items-center">
            <button type="submit" disabled={creating} className="px-5 py-2 bg-white text-black rounded font-medium">{creating? 'Saving...':'Create Student'}</button>
            {message && <p className="text-sm text-white/70">{message}</p>}
          </div>
        </form>
      </section>

      <section className="bg-black/50 border border-white/10 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold text-white">Manage Students</h2>
            <div className="flex gap-2">
              <input placeholder="Search by name or ID" value={search} onChange={e=>setSearch(e.target.value)} className="bg-black/60 border border-white/15 rounded px-3 py-2 text-white" />
              <button onClick={doSearch} className="px-4 py-2 bg-white text-black rounded">Search</button>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-white/80">
            <thead className="text-white">
              <tr>
                <th className="py-2 text-left">Photo</th>
                <th className="py-2 text-left">Name</th>
                <th className="py-2 text-left">ID</th>
                <th className="py-2 text-left">Class</th>
                <th className="py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map(s => (
                <tr key={s.id} className={selectedId===s.id ? 'bg-white/5' : ''}>
                  <td className="py-2">{s.photoUrl ? <img src={s.photoUrl} className="w-10 h-10 rounded object-cover" /> : <span className="text-white/30">No Photo</span>}</td>
                  <td className="py-2">{s.firstName} {s.lastName}</td>
                  <td className="py-2">{s.id}</td>
                  <td className="py-2">{s.classLevel}</td>
                  <td className="py-2 flex flex-wrap gap-2">
                    <button onClick={()=>setSelectedId(s.id)} className="px-2 py-1 text-xs bg-white text-black rounded">Select</button>
                  </td>
                </tr>
              ))}
              {!students.length && <tr><td colSpan={5} className="py-6 text-center text-white/40">No results</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {selectedId && (
        <section className="grid lg:grid-cols-2 gap-6">
          <div className="bg-black/50 border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-medium mb-4">Results Entry</h3>
            <form onSubmit={saveResultsForm} className="space-y-3">
              <div className="flex gap-3 items-center">
                <select value={term} onChange={e=>setTerm(e.target.value)} className="bg-black/60 border border-white/15 rounded px-3 py-2 text-white">
                  <option value="term1">Term 1</option>
                  <option value="term2">Term 2</option>
                  <option value="term3">Term 3</option>
                </select>
                <input name="grades" placeholder="Mathematics:A, English:B" className="flex-1 bg-black/60 border border-white/15 rounded px-3 py-2 text-white" />
                <button type="submit" className="px-4 py-2 bg-white text-black rounded">Save</button>
              </div>
            </form>
            <div className="mt-4">
              <table className="w-full text-sm">
                <thead><tr className="text-white/70"><th className="py-1 text-left">Subject</th><th className="py-1 text-left">Grade</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {results?.subjects?.length ? results.subjects.map((r:any)=> <tr key={r.name}><td className="py-1">{r.name}</td><td className="py-1">{r.grade}</td></tr>) : <tr><td colSpan={2} className="py-3 text-white/40">No results.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-black/50 border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-medium mb-4">Attendance</h3>
            <div className="flex items-center gap-2 mb-3">
              <button onClick={()=>setAttendanceMonth(d=> new Date(d.getFullYear(), d.getMonth()-1, 1))} className="px-2 py-1 border border-white/20 rounded text-white">Prev</button>
              <span className="text-white/70 text-sm">{format(attendanceMonth,'MMMM yyyy')}</span>
              <button onClick={()=>setAttendanceMonth(d=> new Date(d.getFullYear(), d.getMonth()+1, 1))} className="px-2 py-1 border border-white/20 rounded text-white">Next</button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {daysInView().map(day => {
                const iso = format(day,'yyyy-MM-dd');
                const present = attendanceMap[iso];
                return (
                  <button key={iso} type="button" onClick={()=>toggleAttendance(iso)} className={`aspect-square text-xs rounded flex items-center justify-center border ${present? 'bg-green-500 text-black border-green-600':'border-white/15 text-white/60 hover:text-white'}`}>{format(day,'dd')}</button>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
