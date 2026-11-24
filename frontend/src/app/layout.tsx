import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'FaunaVault — Modern Animal Platform',
  description: 'High-performance animal catalog powered by NestJS, Neon PostgreSQL, Cloudinary & Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark antialiased">
      <body className="bg-[#030303] text-zinc-100 min-h-screen selection:bg-emerald-500/30 selection:text-emerald-100">
        {/* Animated background mesh */}
        <div className="bg-mesh" />
        {/* Subtle noise overlay */}
        <div className="noise-overlay" />

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3200,
            style: {
              background: 'rgba(24, 24, 27, 0.85)',
              backdropFilter: 'blur(12px)',
              color: '#f4f4f5',
              border: '1px solid rgba(63, 63, 70, 0.4)',
              borderRadius: '1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              padding: '12px 20px',
              boxShadow: '0 20px 40px -12px rgba(0,0,0,0.5)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#030303',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#030303',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
