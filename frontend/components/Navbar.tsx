'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href={user ? "/dashboard" : "/"} className="link-interactive text-xl font-semibold text-slate-800">
          Startup Benefits
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/deals"
            className={`link-interactive rounded-lg px-3 py-2 text-sm font-medium ${
              pathname === '/deals' ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Deals
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`link-interactive rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === '/dashboard' ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="btn-interactive rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="link-interactive rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="btn-interactive rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
