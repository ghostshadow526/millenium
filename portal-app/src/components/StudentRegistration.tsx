'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import QRCode from 'qrcode';
import compress from 'browser-image-compression';
import toast from 'react-hot-toast';
import { Student } from '@/types';

interface StudentRegistrationProps {
  onStudentRegistered?: (student: Student) => void;
}

export default function StudentRegistration({ onStudentRegistered }: StudentRegistrationProps) {
  const { user, roleInfo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: '',
    rollNumber: '',
    parentPhone: '',
    parentEmail: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const isAdmin = roleInfo?.role === 'admin';

  const uploadToImgBB = async (file: File): Promise<string> => {
    const compressedFile = await compress(file, {
      maxSizeMB: 0.25,
      maxWidthOrHeight: 600,
      useWebWorker: true
    });

    const formData = new FormData();
    formData.append('image', compressedFile);
    formData.append('key', 'a046c5f62a7d8e4e8094df8c88db89a9'); // ImgBB API key

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload image');
    const data = await response.json();
    return data.data.url;
  };

  const generateQRCode = async (studentId: string): Promise<string> => {
    const qrUrl = `${window.location.origin}/student-id/${studentId}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#6556ff',
        light: '#ffffff'
      }
    });
    return qrDataUrl;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // Upload photo if provided
      let photoUrl = '';
      if (photoFile) {
        photoUrl = await uploadToImgBB(photoFile);
      }

      // Create student document
      const studentRef = doc(collection(db, 'students'));
      const studentData: Omit<Student, 'id'> = {
        name: formData.name,
        age: parseInt(formData.age),
        class: formData.class,
        rollNumber: formData.rollNumber,
        parentPhone: formData.parentPhone,
        parentEmail: formData.parentEmail,
        photoUrl,
                registeredBy: roleInfo?.role as 'admin' | 'teacher' || 'teacher',
        registeredByUid: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Generate QR code only if registered by admin
      if (isAdmin) {
        const qrCode = await generateQRCode(studentRef.id);
        studentData.qrCode = qrCode;
      }

      // Save to Firestore
      await setDoc(studentRef, studentData);

      const newStudent: Student = {
        ...studentData,
        id: studentRef.id,
      };

      toast.success(
        isAdmin 
          ? 'Student registered successfully with QR code!' 
          : 'Student registered successfully!'
      );

      // Reset form
      setFormData({
        name: '',
        age: '',
        class: '',
        rollNumber: '',
        parentPhone: '',
        parentEmail: '',
      });
      setPhotoFile(null);
      setPhotoPreview('');

      onStudentRegistered?.(newStudent);

    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <i className="fas fa-user-plus text-primary"></i>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-midnight_text">Register New Student</h2>
          <p className="text-sm text-grey">
            {isAdmin 
              ? 'Admin registration includes QR code generation' 
              : 'Teacher registration (no QR code)'
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-midnight_text mb-2">
            Student Photo
          </label>
          <div className="flex items-center gap-4">
            {photoPreview ? (
              <img 
                src={photoPreview} 
                alt="Preview" 
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="fas fa-camera text-gray-400 text-xl"></i>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="flex-1"
            />
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-midnight_text mb-2">
              Student Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter full name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight_text mb-2">
              Age *
            </label>
            <input
              type="number"
              required
              min="1"
              max="25"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              placeholder="Age"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight_text mb-2">
              Class *
            </label>
            <input
              type="text"
              required
              value={formData.class}
              onChange={(e) => setFormData({...formData, class: e.target.value})}
              placeholder="e.g. Grade 5, Form 1"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight_text mb-2">
              Roll Number *
            </label>
            <input
              type="text"
              required
              value={formData.rollNumber}
              onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
              placeholder="e.g. 2024001"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Parent Contact Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-midnight_text mb-2">
              Parent Phone
            </label>
            <input
              type="tel"
              value={formData.parentPhone}
              onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
              placeholder="+234 xxx xxx xxxx"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight_text mb-2">
              Parent Email
            </label>
            <input
              type="email"
              value={formData.parentEmail}
              onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
              placeholder="parent@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* QR Code Notice */}
        {isAdmin && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-qrcode text-primary text-lg"></i>
              <div>
                <h4 className="font-medium text-primary">QR Code Generation</h4>
                <p className="text-sm text-grey">
                  As an admin, this student will automatically get a QR code for digital ID card access.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary btn-lg justify-center"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Registering Student...
            </>
          ) : (
            <>
              <i className="fas fa-user-plus"></i>
              {isAdmin ? 'Register Student with QR Code' : 'Register Student'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}