'use client';

import { Student } from '@/types';

interface StudentCardProps {
  student: Student;
  onAttendanceClick?: () => void;
  onUpdateClick?: () => void;
  showActions?: boolean;
}

export default function StudentCard({ 
  student, 
  onAttendanceClick, 
  onUpdateClick, 
  showActions = true 
}: StudentCardProps) {
  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex gap-6">
        {/* Student Photo - Left Side */}
        <div className="flex-shrink-0">
          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt={student.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200">
              <i className="fas fa-user text-gray-400 text-2xl"></i>
            </div>
          )}
        </div>

        {/* Student Info - Middle */}
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="text-xl font-semibold text-midnight_text">{student.name}</h3>
            <div className="flex items-center gap-4 text-sm text-grey mt-1">
              <span className="flex items-center gap-1">
                <i className="fas fa-id-badge text-primary"></i>
                Roll: {student.rollNumber}
              </span>
              <span className="flex items-center gap-1">
                <i className="fas fa-graduation-cap text-primary"></i>
                {student.class}
              </span>
              <span className="flex items-center gap-1">
                <i className="fas fa-birthday-cake text-primary"></i>
                {student.age} years
              </span>
            </div>
          </div>

          {/* Parent Contact */}
          {(student.parentPhone || student.parentEmail) && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-midnight_text">Parent Contact:</h4>
              <div className="flex flex-wrap gap-3 text-sm text-grey">
                {student.parentPhone && (
                  <span className="flex items-center gap-1">
                    <i className="fas fa-phone text-success"></i>
                    {student.parentPhone}
                  </span>
                )}
                {student.parentEmail && (
                  <span className="flex items-center gap-1">
                    <i className="fas fa-envelope text-success"></i>
                    {student.parentEmail}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Registration Info */}
          <div className="flex items-center gap-4 text-xs text-grey pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <i className="fas fa-user-shield"></i>
              Registered by {student.registeredBy}
            </span>
            <span className="flex items-center gap-1">
              <i className="fas fa-calendar"></i>
              {student.createdAt.toLocaleDateString()}
            </span>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex gap-3 pt-3">
              <button
                onClick={onAttendanceClick}
                className="btn btn-sm bg-success text-white hover:bg-success/90"
              >
                <i className="fas fa-check-circle"></i>
                Mark Attendance
              </button>
              <button
                onClick={onUpdateClick}
                className="btn btn-sm btn-outline"
              >
                <i className="fas fa-edit"></i>
                Update Info
              </button>
            </div>
          )}
        </div>

        {/* QR Code - Right Side */}
        <div className="flex-shrink-0 text-center">
          {student.qrCode ? (
            <div className="space-y-2">
              <img
                src={student.qrCode}
                alt="Student QR Code"
                className="w-20 h-20 border border-gray-200 rounded-lg"
              />
              <p className="text-xs text-grey">Digital ID</p>
              <button className="text-xs text-primary hover:underline">
                <i className="fas fa-external-link-alt"></i>
                View ID Card
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
              <i className="fas fa-qrcode text-gray-300 text-lg"></i>
              <p className="text-xs text-grey mt-1">No QR Code</p>
              <p className="text-xs text-grey">(Teacher reg.)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}