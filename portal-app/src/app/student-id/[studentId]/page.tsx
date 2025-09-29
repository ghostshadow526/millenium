'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Student } from '@/types';
import Library from '@/components/Library';
import { useParams } from 'next/navigation';

export default function StudentIDPage() {
  const params = useParams();
  const studentId = params?.studentId as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) {
        setError('Invalid student ID');
        setLoading(false);
        return;
      }

      try {
        const studentDoc = await getDoc(doc(db, 'students', studentId));
        if (studentDoc.exists()) {
          const data = studentDoc.data();
          setStudent({
            ...data,
            id: studentDoc.id,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Student);
        } else {
          setError('Student not found');
        }
      } catch (err) {
        setError('Failed to load student information');
        console.error('Error fetching student:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slateGray flex items-center justify-center">
        <div className="card p-8 text-center">
          <i className="fas fa-spinner fa-spin text-primary text-2xl mb-4"></i>
          <p className="text-midnight_text">Loading student information...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-slateGray flex items-center justify-center">
        <div className="card p-8 text-center max-w-md">
          <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
          <h2 className="text-xl font-semibold text-midnight_text mb-2">Student Not Found</h2>
          <p className="text-grey mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            <i className="fas fa-arrow-left"></i>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Millenium School</h1>
          <p className="text-lg text-midnight_text">Official Student ID Card</p>
        </div>

        {/* Main ID Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-primary/20">
          <div className="bg-gradient-to-r from-primary to-secondary px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold">Student ID Card</h2>
                <p className="opacity-90">Academic Year 2024-2025</p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm opacity-90">Roll Number</p>
                  <p className="text-xl font-bold">{student.rollNumber}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Student Photo - Left Side (Large) */}
              <div className="md:col-span-1">
                <div className="relative">
                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt={student.name}
                      className="w-full aspect-square rounded-2xl object-cover border-4 border-primary/20 shadow-lg"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-4 border-gray-200 shadow-lg">
                      <i className="fas fa-user text-gray-400 text-6xl"></i>
                    </div>
                  )}
                  
                  {/* School Logo Overlay */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-primary">
                    <i className="fas fa-graduation-cap text-primary text-lg"></i>
                  </div>
                </div>
              </div>

              {/* Student Information - Right Side */}
              <div className="md:col-span-2 space-y-6">
                {/* Name and Basic Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-3xl font-bold text-midnight_text mb-2">{student.name}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-primary mb-1">
                          <i className="fas fa-graduation-cap"></i>
                          <span className="text-sm font-medium">Class</span>
                        </div>
                        <p className="text-lg font-semibold text-midnight_text">{student.class}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-primary mb-1">
                          <i className="fas fa-birthday-cake"></i>
                          <span className="text-sm font-medium">Age</span>
                        </div>
                        <p className="text-lg font-semibold text-midnight_text">{student.age} years</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parent Contact Information */}
                {(student.parentPhone || student.parentEmail) && (
                  <div className="bg-primary/5 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-midnight_text mb-3 flex items-center gap-2">
                      <i className="fas fa-users text-primary"></i>
                      Parent Contact
                    </h4>
                    <div className="grid gap-2">
                      {student.parentPhone && (
                        <div className="flex items-center gap-3">
                          <i className="fas fa-phone text-success w-4"></i>
                          <span className="text-midnight_text">{student.parentPhone}</span>
                        </div>
                      )}
                      {student.parentEmail && (
                        <div className="flex items-center gap-3">
                          <i className="fas fa-envelope text-success w-4"></i>
                          <span className="text-midnight_text">{student.parentEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* QR Code Section */}
                {student.qrCode && (
                  <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
                    <div>
                      <h4 className="font-semibold text-midnight_text mb-1">Digital Verification</h4>
                      <p className="text-sm text-grey">Scan QR code to verify student identity</p>
                    </div>
                    <img
                      src={student.qrCode}
                      alt="Student QR Code"
                      className="w-16 h-16 border border-primary/20 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-grey">
                <div>
                  <p>Issued on: {student.createdAt.toLocaleDateString()}</p>
                  <p>Registered by: {student.registeredBy.charAt(0).toUpperCase() + student.registeredBy.slice(1)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">Millenium School Portal</p>
                  <p>Official Student Record</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-x-4">
          <button
            onClick={() => window.print()}
            className="btn btn-primary"
          >
            <i className="fas fa-print"></i>
            Print ID Card
          </button>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline"
          >
            <i className="fas fa-arrow-left"></i>
            Go Back
          </button>
          <a href="/parent/library" className="btn outline">
            <i className="fas fa-book-open"></i>
            Digital Library
          </a>
        </div>

        {/* Embedded Library Preview */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold text-midnight_text mb-4 flex items-center gap-2">
            <i className="fas fa-book text-primary" />
            Explore Our Digital Library
          </h2>
          <p className="text-sm text-grey mb-6">Boost knowledge with free public domain books. Search and read instantly below or open the full library.</p>
          <div className="border border-primary/10 rounded-xl bg-white/60 backdrop-blur-sm p-4">
            <Library />
          </div>
        </div>
      </div>
    </div>
  );
}