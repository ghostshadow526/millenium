'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="py-20 text-center">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-primary mb-4">
            Welcome to the Millenium School Portal
          </h1>
          <p className="text-2xl text-midnight_text mb-8">
            Stay Connected to Your Child's Education
          </p>
          <p className="text-lg text-grey mb-12 max-w-2xl mx-auto">
            Access real-time updates on your child's progress, upcoming events, and important announcements. 
            Stay engaged in their educational journey with our comprehensive parent portal.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-book-open text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-midnight_text mb-3">Academic Progress</h3>
            <p className="text-grey">
              Monitor grades, assignments, and your child's academic performance in real-time.
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-calendar-check text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-midnight_text mb-3">Events & Schedule</h3>
            <p className="text-grey">
              Stay updated with school events, parent-teacher meetings, and important dates.
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-bell text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-midnight_text mb-3">Instant Notifications</h3>
            <p className="text-grey">
              Receive immediate updates about your child's activities and school announcements.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="card p-12 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-midnight_text mb-8">
            Sign in to your parent portal to access all features and stay connected with your child's education.
          </p>
          <Link 
            href="/login" 
            className="btn btn-primary btn-lg inline-flex items-center gap-3 px-8 py-4 text-lg"
          >
            <i className="fas fa-book-open"></i>
            Access Parent Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
