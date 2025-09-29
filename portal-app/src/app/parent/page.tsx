"use client";
import Protected from '@/components/Protected';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { getStudentById, getAttendanceMonth, getResults } from '@/lib/data';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function ParentPage(){ return <Protected allowed={['parent','admin']}><ParentDash/></Protected>; }

function ParentDash(){
  const { roleInfo } = useAuth();
  const [studentId,setStudentId] = useState<string | undefined>(roleInfo?.studentId);
  const [info,setInfo] = useState<any|null>(null);
  const [monthDate,setMonthDate] = useState(new Date());
  const [attendanceMap,setAttendanceMap] = useState<Record<string,boolean>>({});
  const [term,setTerm] = useState('term1');
  const [results,setResultsState] = useState<any|null>(null);
  // Library preview states
  const [librarySearch,setLibrarySearch] = useState('');
  const [recommended,setRecommended] = useState<any[]>([]);
  const [libraryLoading,setLibraryLoading] = useState(false);
  const [libraryError,setLibraryError] = useState<string | null>(null);

  // Update when roleInfo changes
  useEffect(()=>{ (async()=>{
    if(roleInfo?.studentId){ setStudentId(roleInfo.studentId); return; }
    if(roleInfo?.role==='parent'){
      // Use authenticated user email directly
      const email = (useAuth().user?.email)||null;
      if(email){
        try{
          const qs = await getDocs(query(collection(db,'students'), where('parentEmail','==', email), limit(1)));
          if(!qs.empty){ setStudentId(qs.docs[0].id); }
        }catch{/* ignore */}
      }
    }
  })(); }, [roleInfo]);

  useEffect(()=>{ (async()=>{ if(!studentId) return; const s = await getStudentById(studentId); setInfo(s); })(); }, [studentId]);
  useEffect(()=>{ (async()=>{ if(!studentId) return; const yr=monthDate.getFullYear(); const m=monthDate.getMonth()+1; setAttendanceMap(await getAttendanceMonth(studentId, yr, m)); })(); }, [studentId, monthDate]);
  useEffect(()=>{ (async()=>{ if(!studentId) return; setResultsState(await getResults(studentId, term)); })(); }, [studentId, term]);
  // Initial recommended books fetch (first page popular)
  useEffect(()=>{ fetchRecommended(); },[]);

  async function fetchRecommended(query?:string){
    try{
      setLibraryLoading(true); setLibraryError(null);
      const url = query && query.trim().length>0 ? `https://gutendex.com/books/?search=${encodeURIComponent(query.trim())}` : 'https://gutendex.com/books/?page=1';
      const res = await fetch(url);
      if(!res.ok) throw new Error('Failed to load books');
      const data = await res.json();
      setRecommended((data.results || []).slice(0,4));
    }catch(err:any){
      setLibraryError(err.message || 'Error fetching books');
    }finally{ setLibraryLoading(false); }
  }

  function handleLibrarySearch(){ fetchRecommended(librarySearch); }
  function daysInView(){ const start = startOfMonth(monthDate); const end = endOfMonth(monthDate); return eachDayOfInterval({ start, end }); }
  if(!studentId) return <p className="text-center py-20">No student linked.</p>;
  if(!info) return <p className="text-center py-20">Loading...</p>;
  if(info && !info.name && !info.firstName) return <div className="max-w-md mx-auto text-center py-20 space-y-4"><p className="text-lg font-medium">Student record not found.</p><p className="text-sm text-white/60">Please contact the school to verify the linked student ID.</p></div>;
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="card flex gap-6 items-center">
        {info.photoUrl && <img src={info.photoUrl} className="w-24 h-24 object-cover rounded" />}
        <div>
          <h2 className="text-xl font-semibold">{info.name || [info.firstName, info.lastName].filter(Boolean).join(' ')}</h2>
          <p className="text-white/60 text-sm">Class: {info.class || info.classLevel || '—'}</p>
          <p className="text-white/40 text-xs">ID: {studentId}</p>
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
      {/* Library Preview Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Digital Library</h3>
          <a href="/parent/library" className="btn primary">Open Library</a>
        </div>
        <p className="text-xs text-white/60 mb-3">Boost your child's learning. Search and read free classic books.</p>
        <div className="flex gap-2 mb-4">
          <input
            value={librarySearch}
            onChange={e=>setLibrarySearch(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter') handleLibrarySearch(); }}
            placeholder="Search books (e.g. science, math, history)"
            className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none"
          />
            <button onClick={handleLibrarySearch} className="btn outline">Search</button>
        </div>
        {libraryError && <p className="text-red-400 text-sm mb-2">{libraryError}</p>}
        {libraryLoading && <p className="text-sm text-white/60">Loading books...</p>}
        {!libraryLoading && !libraryError && (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {recommended.map(b=>{
              const cover = b.formats?.['image/jpeg'];
              return (
                <div key={b.id} className="bg-white/5 rounded p-2 flex flex-col gap-2">
                  {cover && <img src={cover} alt={b.title} className="h-32 w-full object-cover rounded" />}
                  <div className="flex-1">
                    <p className="text-xs font-medium line-clamp-2 leading-snug">{b.title}</p>
                    <p className="text-[10px] text-white/50 line-clamp-1">{(b.authors||[]).map((a:any)=>a.name).join(', ')||'Unknown'}</p>
                  </div>
                  <a href={`/parent/library?open=${b.id}`} className="text-[10px] underline text-blue-300">Read</a>
                </div>
              );
            })}
            {recommended.length===0 && <p className="text-sm col-span-full text-white/60">No books found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
