# Millenium School Portal

A dedicated Next.js portal application for the Millenium school management system, featuring role-based dashboards for administrators, teachers, and parents.

## Features

- **Admin Dashboard**: Manage students, teachers, subjects, and system records
- **Teacher Dashboard**: Record attendance, results, and fee confirmations
- **Parent Portal**: View child's profile, attendance, and academic progress
- **Public Student ID Cards**: QR code-enabled student identification
- **Firebase Integration**: Authentication and real-time data storage
- **ImgBB Photo Hosting**: Student photo management with compression
- **Role-based Access Control**: Secure routing and data access

## Design System

This portal matches the main E-learning project's design system:
- **Colors**: Primary (#6556ff), Secondary (#1a21bc), Success (#43c639)
- **Background**: Slate gray (#f6faff) with white cards
- **Typography**: Midnight text (#222c44) with proper contrast
- **Components**: Tailwind-based with consistent spacing and styling

## Quick Start

1. **Install Dependencies**
   ```bash
   cd portal-app
   npm install
   ```

2. **Environment Setup**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_IMGBB_KEY=your_imgbb_api_key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Portals**
   - Landing: `http://localhost:3000`
   - Admin: `http://localhost:3000/login?role=admin`
   - Teacher: `http://localhost:3000/login?role=teacher`
   - Parent: `http://localhost:3000/login?role=parent`

## Login Credentials

### Demo Admin Override
- Email: `abbasabdulkadir526@gmail.com`
- Password: `eatmyass`

### Teacher Login
Teachers must be created by administrators through the Admin Dashboard.

### Parent Access
Parents log in using their child's Student ID as the password.

## Project Structure

```
portal-app/
├── src/
│   ├── app/                 # Next.js 13+ App Router
│   │   ├── admin/          # Admin dashboard
│   │   ├── teacher/        # Teacher dashboard
│   │   ├── parent/         # Parent dashboard
│   │   ├── login/          # Authentication page
│   │   └── id/[studentId]/ # Public student cards
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts (AuthContext)
│   ├── lib/               # Firebase, data layer, utilities
│   └── types/             # TypeScript type definitions
├── tailwind.config.ts     # Tailwind configuration
└── package.json
```

## API Integration

### Firebase Services
- **Authentication**: Email/password for staff, student ID for parents
- **Firestore**: Student records, attendance, results, fee status
- **Storage**: Not used (ImgBB handles images)

### ImgBB Integration
- Student photos uploaded to ImgBB for reliable hosting
- Automatic image compression (250KB max, 600px max dimension)
- Public URLs stored in Firestore student records

## Data Models

### Student Record
```typescript
interface StudentRecord {
  id: string;                    // Generated: CLASS-YEAR-RAND4
  firstName: string;
  lastName: string;
  classLevel: string;
  parentEmail?: string;
  subjects?: string[];
  photoUrl?: string;             // ImgBB hosted URL
  feeStatus: {
    term1: boolean;
    term2: boolean;
    term3: boolean;
  };
  createdAt: number;
  deleted?: boolean;             // Soft delete flag
}
```

### Attendance
- Path: `students/{id}/attendance/{YYYY-MM}`
- Structure: `{ days: { 'YYYY-MM-DD': boolean } }`

### Results
- Path: `students/{id}/results/{term}`
- Structure: `{ subjects: [{ name, grade }], updatedAt }`

## Security Notes

⚠️ **Development Only Features**:
- Hardcoded admin override credentials
- Client-side role validation only
- No Firestore security rules included

For production deployment:
1. Remove admin override functionality
2. Implement proper Firestore security rules
3. Add server-side role validation
4. Use environment-specific Firebase configs

## Development

The portal uses the same Firebase project and data as the main E-learning application, enabling seamless data sharing while providing a focused interface for school management tasks.

## License

Private school management system - All rights reserved.