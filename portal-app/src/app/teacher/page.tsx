'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Student } from '@/types';
import { searchStudentsByName, getStudentsByClass, markAttendance } from '@/lib/data';
import StudentRegistration from '@/components/StudentRegistration';
import StudentCard from '@/components/StudentCard';
import Protected from '@/components/Protected';
import toast from 'react-hot-toast';

export default function TeacherPage() {
  return (
    <Protected allowed={['teacher', 'admin']}>
      <TeacherDashboard />
    </Protected>
  );
}

function TeacherDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'register' | 'students' | 'attendance'>('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);

  const classes = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Form 1', 'Form 2', 'Form 3'];

  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    }
  }, [activeTab, selectedClass, searchTerm]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let fetchedStudents: Student[] = [];
      
      if (searchTerm.trim()) {
        fetchedStudents = await searchStudentsByName(searchTerm.trim());
      } else if (selectedClass) {
        fetchedStudents = await getStudentsByClass(selectedClass);
      } else {
        fetchedStudents = await searchStudentsByName('');
      }
      
      setStudents(fetchedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentRegistered = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    setActiveTab('students');
  };

  const handleMarkAttendance = async (student: Student) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await markAttendance(student.id, today, 'present', user?.uid || '');
      toast.success(`Marked ${student.name} as present`);
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    }
  };

  const handleUpdateStudent = (student: Student) => {
    console.log('Update student:', student);
    // TODO: Implement student update functionality
  };

  return (
    <div className="min-h-screen bg-slateGray py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-midnight_text">Teacher Dashboard</h1>
          <p className="text-grey mt-2">Welcome back, {user?.email}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: 'fas fa-tachometer-alt' },
              { id: 'register', label: 'Register Student', icon: 'fas fa-user-plus' },
              { id: 'students', label: 'Students', icon: 'fas fa-users' },
              { id: 'attendance', label: 'Attendance', icon: 'fas fa-check-circle' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-grey hover:text-midnight_text hover:border-gray-300'
                }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-grey">Total Students</p>
                  <p className="text-2xl font-bold text-midnight_text">{students.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <i className="fas fa-users text-primary text-xl"></i>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-grey">Present Today</p>
                  <p className="text-2xl font-bold text-midnight_text">--</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <i className="fas fa-check-circle text-success text-xl"></i>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-grey">QR Students</p>
                  <p className="text-2xl font-bold text-midnight_text">
                    {students.filter(s => s.qrCode).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <i className="fas fa-qrcode text-secondary text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'register' && (
          <StudentRegistration onStudentRegistered={handleStudentRegistered} />
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="card p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search students by name or roll number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-grey"></i>
                  </div>
                </div>
                
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>

                <button
                  onClick={fetchStudents}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Loading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-refresh"></i>
                      Refresh
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Students List */}
            {loading ? (
              <div className="card p-8 text-center">
                <i className="fas fa-spinner fa-spin text-primary text-2xl mb-4"></i>
                <p className="text-grey">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="card p-8 text-center">
                <i className="fas fa-users text-grey text-3xl mb-4"></i>
                <h3 className="text-lg font-semibold text-midnight_text mb-2">No Students Found</h3>
                <p className="text-grey mb-4">
                  {searchTerm || selectedClass 
                    ? 'No students match your current filters.' 
                    : 'Get started by registering your first student.'}
                </p>
                <button
                  onClick={() => setActiveTab('register')}
                  className="btn btn-primary"
                >
                  <i className="fas fa-user-plus"></i>
                  Register Student
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {students.map(student => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onAttendanceClick={() => handleMarkAttendance(student)}
                    onUpdateClick={() => handleUpdateStudent(student)}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-midnight_text mb-4">Attendance Management</h2>
            <p className="text-grey">Attendance tracking functionality coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}