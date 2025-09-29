"use client";
import React, { useEffect, useState } from 'react';

interface GutendexFormatMap {
  [key: string]: string | undefined;
  "image/jpeg"?: string;
  "text/html"?: string;
  "application/pdf"?: string;
  "application/epub+zip"?: string;
}

interface GutendexBook {
  id: number;
  title: string;
  authors: { name: string }[];
  formats: GutendexFormatMap;
  subjects?: string[];
}

interface GutendexResponse {
  results: GutendexBook[];
}

const SUBJECT_PRESETS = ["Mathematics","English","Science","History"];

export default function Library() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<GutendexBook[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [readingBook, setReadingBook] = useState<GutendexBook | null>(null);

  const fetchBooks = async (q: string) => {
    setLoading(true); setError(null);
    try {
      const url = `https://gutendex.com/books/?search=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      if(!res.ok) throw new Error('Failed to fetch books');
      const data: GutendexResponse = await res.json();
      setBooks(data.results || []);
    } catch (e:any){
      setError(e.message || 'Unknown error');
    } finally { setLoading(false); }
  };

  const fetchSubject = async (subject: string) => {
    setLoading(true); setError(null);
    try {
      // Gutendex doesn't have direct topic param, reuse search for now.
      const url = `https://gutendex.com/books/?search=${encodeURIComponent(subject)}`;
      const res = await fetch(url);
      if(!res.ok) throw new Error('Failed to fetch subject books');
      const data: GutendexResponse = await res.json();
      setBooks(data.results || []);
      setActiveSubject(subject);
    } catch(e:any){ setError(e.message); } finally { setLoading(false);} }

  const onSearch = (e: React.FormEvent) => { e.preventDefault(); if(!query.trim()) return; setActiveSubject(null); fetchBooks(query.trim()); };

  const openBook = (b: GutendexBook) => { setReadingBook(b); };
  const closeReader = () => setReadingBook(null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={onSearch} className="flex w-full max-w-lg gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search title, author, subject..." className="flex-1 px-4 py-2 rounded border border-gray-300 text-sm" />
          <button className="btn" type="submit" disabled={!query.trim() || loading}>Search</button>
        </form>
        <div className="flex flex-wrap gap-2">
          {SUBJECT_PRESETS.map(sub => (
            <button key={sub} type="button" onClick={()=>fetchSubject(sub)} className={`px-3 py-1 rounded text-xs border ${activeSubject===sub? 'bg-primary text-white border-primary':'border-gray-300 text-gray-600 hover:bg-gray-100'}`}>{sub}</button>
          ))}
          {activeSubject && <button type="button" onClick={()=>{ setActiveSubject(null); setBooks([]); }} className="text-xs underline text-gray-500">Clear</button>}
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && <div className="text-sm text-gray-500">Loading books...</div>}
      {!loading && books.length===0 && !error && <div className="text-sm text-gray-500">No books yet. Try searching or pick a subject.</div>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map(book => {
          const img = book.formats["image/jpeg"]; 
          const htmlUrl = book.formats["text/html"]; 
          const epub = book.formats["application/epub+zip"]; 
          const pdf = book.formats["application/pdf"]; 
          const author = book.authors?.[0]?.name || 'Unknown Author';
          return (
            <div key={book.id} className="rounded-lg border border-gray-200 bg-white flex flex-col overflow-hidden shadow-sm">
              {img ? <img src={img} alt={book.title} className="h-40 w-full object-cover" /> : <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Cover</div>}
              <div className="flex flex-col flex-1 p-4 gap-2">
                <h3 className="font-semibold text-sm line-clamp-2 leading-snug">{book.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{author}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {htmlUrl && <button type="button" onClick={()=>openBook(book)} className="btn outline text-xs">Read Online</button>}
                  {(epub || pdf) && (
                    <a href={(epub || pdf)!} target="_blank" rel="noopener noreferrer" className="btn outline text-xs">Download</a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {readingBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{readingBook.title}</span>
                <span className="text-xs text-gray-500">{readingBook.authors?.[0]?.name || 'Unknown Author'}</span>
              </div>
              <button onClick={closeReader} className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">Close</button>
            </div>
            <div className="flex-1 overflow-auto">
              {readingBook.formats["text/html"] ? (
                <iframe src={readingBook.formats["text/html"]} title={readingBook.title} className="w-full h-[70vh]" />
              ) : (
                <div className="p-6 text-sm">No embeddable HTML version available for this title.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
