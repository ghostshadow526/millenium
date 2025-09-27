# Millenium School Portal

A comprehensive school management system built with Next.js, Firebase, and Tailwind CSS.

## Features

### 🏠 **Main E-learning Website**
- Parent-focused homepage
- Course showcases and educational content
- Responsive design with modern UI

### 🏫 **School Portal System**
- **Multi-role Authentication**: Admin, Teacher, and Parent access
- **Student Management**: Registration, profiles, and QR code generation
- **Attendance Tracking**: Real-time attendance marking
- **Digital ID Cards**: QR code-based student identification
- **Role-based Dashboards**: Customized interfaces for each user type

## Portal Features

### 👨‍🏫 **Teacher Portal**
- Register new students (without QR codes)
- View and manage student lists
- Mark attendance with student cards
- Search and filter students by class/name

### 👨‍💼 **Admin Portal**
- Register students with QR code generation
- Full system management capabilities
- Analytics and reporting
- Teacher and student oversight

### 👨‍👩‍👧‍👦 **Parent Portal**
- View child's profile and progress
- Access grades and attendance records
- Communication with teachers
- Fee payment tracking

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Authentication**: Firebase Auth with role-based access
- **Image Storage**: ImgBB API integration
- **QR Codes**: QRCode.js for student ID generation
- **Icons**: Font Awesome for consistent UI

## Project Structure

```
├── src/                    # Main e-learning website
│   ├── app/               # Next.js app router pages
│   ├── components/        # Reusable UI components
│   └── lib/              # Utilities and data functions
└── portal-app/           # School portal system
    ├── src/
    │   ├── app/          # Portal pages (login, dashboards)
    │   ├── components/   # Portal-specific components
    │   ├── contexts/     # Authentication context
    │   ├── lib/          # Firebase config and data
    │   └── types/        # TypeScript definitions
    └── public/           # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd E-learning-1.0.0
   ```

2. **Install main website dependencies**
   ```bash
   npm install
   ```

3. **Install portal dependencies**
   ```bash
   cd portal-app
   npm install
   ```

4. **Set up environment variables**
   
   Create `.env.local` in both root and portal-app directories:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_IMGBB_KEY=your-imgbb-key
   ```

### Running the Development Servers

1. **Main website**
   ```bash
   npm run dev
   # Runs on http://localhost:3000
   ```

2. **Portal system**
   ```bash
   cd portal-app
   npm run dev
   # Runs on http://localhost:3001
   ```

## Portal Usage

### 🔐 **Login Credentials**
- **Admin**: Use the admin override email/password
- **Teacher**: Register through admin or use Firebase Auth
- **Parent**: Use student ID for access

### 📱 **QR Code Features**
- Admin-registered students get QR codes
- QR codes link to digital ID cards
- Scannable for quick student verification
- Professional ID card layout with student photo and details

### 🎯 **Student Management**
1. Teachers can register students (no QR)
2. Admins can register students (with QR)
3. Student cards show photo, info, and QR status
4. One-click attendance marking
5. Search and filter functionality

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy both main app and portal-app separately
3. Set environment variables in Vercel dashboard

### Manual Deployment
```bash
# Build main website
npm run build
npm start

# Build portal
cd portal-app
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

---

**Millenium School Portal** - Connecting education with technology 🎓