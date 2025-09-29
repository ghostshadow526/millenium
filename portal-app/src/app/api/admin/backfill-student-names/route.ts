import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

// WARNING: one-off maintenance endpoint. Protect via environment variable or remove after running.
export async function GET(){
  try {
    const col = collection(db,'students');
    const snap = await getDocs(col);
    const batch = writeBatch(db);
    let updates = 0;
    snap.forEach(d => {
      const data:any = d.data();
      if(!data.name){
        const name = [data.firstName, data.lastName].filter(Boolean).join(' ').trim();
        if(name){
          batch.update(doc(db,'students', d.id), { name, class: data.class || data.classLevel || '', updatedAt: new Date() });
          updates++;
        }
      }
    });
    if(updates>0) await batch.commit();
    return NextResponse.json({ status:'ok', updated: updates });
  } catch(e:any){
    console.error(e);
    return NextResponse.json({ status:'error', message: e.message }, { status:500 });
  }
}