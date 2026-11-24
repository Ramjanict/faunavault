import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Animal Vault | Modern Full-Stack Hub',
  description: 'Modern Animal & Category Management powered by NestJS, Neon PostgreSQL, Cloudinary, and Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050505] text-white min-h-screen selection:bg-emerald-500 selection:text-black">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#18181b',
              color: '#fff',
              border: '1px solid #27272a',
              borderRadius: '0.75rem',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
