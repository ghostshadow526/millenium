import './globals.css';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Link from 'next/link';

export const metadata = { title: 'Millenium Portal' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-Avb2QiuDEEvB4bZJYdft2mNjVShBftLdPG8FJ0V7irTLQ8Uo0qcPxh4Plq7G5tGm0rU+1SPhVotteLpBERwTkw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-screen bg-slateGray">
        <AuthProvider>
          <main>{children}</main>
          <footer className="bg-white border-t border-gray-200 mt-20 py-10">
            <div className="portal-container text-center text-sm text-grey">
              © {new Date().getFullYear()} Millenium School Portal. All rights reserved.
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
