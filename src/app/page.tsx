import React from "react";
import Hero from "@/components/Home/Hero";
import Companies from "@/components/Home/Companies";
import Courses from "@/components/Home/Courses";
import Mentor from "@/components/Home/Mentor";
import Testimonial from "@/components/Home/Testimonials";
import Newsletter from "@/components/Home/Newsletter";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "eLearning",
};

export default function Home() {
  return (
    <main>
      <Hero />
      {/* Portal Quick Access Section */}
      <section className="py-16 px-6 bg-black/40 border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">School Portal Access</h2>
          <p className="text-white/60 mb-8 max-w-2xl">Administrators, teachers, and parents can access the Millenium portal directly below. Use the appropriate entry point; parents only need a valid Student ID.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { role: 'admin', title: 'Admin Portal', desc: 'Manage students, teachers, subjects and system records.', accent: 'from-purple-500 to-pink-500' },
              { role: 'teacher', title: 'Teacher Portal', desc: 'Record attendance, results and fee confirmations.', accent: 'from-blue-500 to-cyan-500' },
              { role: 'parent', title: 'Parent Portal', desc: 'View your child\'s profile, attendance and results.', accent: 'from-emerald-500 to-lime-500' }
            ].map(card => (
              <a key={card.role} href={`/auth/login?role=${card.role}`} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-6 flex flex-col">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition bg-gradient-to-br ${card.accent}`} />
                <h3 className="text-white text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-white/60 text-sm flex-1">{card.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/80 group-hover:text-white">Enter Portal <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></span>
              </a>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/40">Demo override: Use the documented admin demo credentials to bypass role lookup (development only).</p>
        </div>
      </section>
      <Companies />
      <Courses />
      <Mentor />
      <Testimonial />
      <Newsletter />
    </main>
  );
}