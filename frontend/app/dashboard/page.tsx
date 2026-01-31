'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { claims as claimsApi, Claim } from '@/lib/api';
import PageTransition from '@/components/PageTransition';
import DealCard from '@/components/DealCard';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const POLL_INTERVAL = 5000; // Poll every 5 seconds

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.replace('/login?redirect=/dashboard');
      return;
    }

    const fetchClaims = async () => {
      setLoading(true);
      try {
        const res = await claimsApi.list();
        setClaims(res.claims);
      } catch {
        setClaims([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();

    // Set up polling interval
    const interval = setInterval(fetchClaims, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 h-32 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-900"
        >
          Dashboard
        </motion.h1>

        {/* Profile */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-8"
        >
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white p-6 shadow-md">
            <div className="flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 text-white">
                <span className="text-xl font-semibold">{user.name?.split(' ').map(n=>n[0]).slice(0,2).join('') || 'U'}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-500">{user.email}</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <a href="/deals" className="ml-2 inline-block rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600 hover:bg-brand-100">Browse deals</a>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Claims</div>
                  <div className="text-lg font-semibold text-slate-900">{claims.length}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Claimed deals */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <h2 className="font-semibold text-slate-900">Your claimed offers</h2>
          {loading ? (
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : claims.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center text-slate-600">
              <p>You haven&apos;t claimed any deals yet.</p>
              <Link href="/deals" className="mt-3 inline-block text-brand-600 hover:underline">
                Browse deals →
              </Link>
            </div>
            ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {claims.filter((c) => c.deal).map((c, i) => (
                <DealCard key={c.id} deal={c.deal!} index={i} />
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </PageTransition>
  );
}
