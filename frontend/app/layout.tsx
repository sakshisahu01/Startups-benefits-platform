import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import PageTransitionWrapper from '@/components/PageTransitionWrapper';

export const metadata: Metadata = {
  title: 'Startup Benefits | Discounted SaaS for Founders & Teams',
  description: 'Discounted cloud, marketing, analytics, and productivity tools for founders, early teams, and indie hackers. Public and locked deals; track claim status.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <Navbar />
          <main>
            <PageTransitionWrapper>{children}</PageTransitionWrapper>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
