'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { deals as dealsApi, claims as claimsApi } from '@/lib/api';
import type { Deal } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import PageTransition from '@/components/PageTransition';
import DealDetailSkeleton from '@/components/DealDetailSkeleton';

const POLL_INTERVAL = 5000; // Poll every 5 seconds

export default function DealDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    setLoading(true);
    setDeal(null);
    setClaimed(false);
    setClaimError('');

    const fetchDeal = async () => {
      try {
        const data = await dealsApi.get(slug);
        setDeal(data);
      } catch {
        setDeal(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();

    // Set up polling interval
    const interval = setInterval(fetchDeal, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [slug]);

  const isLocked = deal?.accessLevel === 'locked';
  const canClaim = user && (deal?.accessLevel === 'public' || (deal?.accessLevel === 'locked' && user.isVerified));
  const needsLogin = !user;
  const needsVerification = user && isLocked && !user.isVerified;

  const handleClaim = async () => {
    if (!deal || !user || !canClaim) return;
    setClaiming(true);
    setClaimError('');
    try {
      await claimsApi.create(deal._id);
      setClaimed(true);
    } catch (e) {
      setClaimError(e instanceof Error ? e.message : 'Failed to claim');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <DealDetailSkeleton />
      </PageTransition>
    );
  }

  if (!deal) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <p className="text-slate-600">Deal not found.</p>
          <Link href="/deals" className="mt-4 inline-block text-brand-600 hover:underline">
            Back to Deals
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/deals"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-600 transition hover:text-brand-600"
        >
          ← Back to Deals
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {deal.category}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{deal.title}</h1>
          <p className="mt-4 text-slate-600">{deal.description}</p>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <h2 className="font-semibold text-slate-900">Partner</h2>
            <p className="mt-1 text-slate-600">
              {deal.partnerName}
              {deal.partnerUrl && (
                <a
                  href={deal.partnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-brand-600 hover:underline"
                >
                  Visit →
                </a>
              )}
            </p>
          </div>

          <div className="mt-4">
            <h2 className="font-semibold text-slate-900">Eligibility</h2>
            <p className="mt-1 text-slate-600">{deal.eligibility}</p>
          </div>

          {isLocked && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-800">
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-sm font-medium">Verification required to claim this deal.</span>
            </div>
          )}

          <div className="mt-8">
            {claimed ? (
              <div className="rounded-lg bg-green-50 p-4 text-green-800">
                <p className="font-medium">Claim submitted.</p>
                <p className="mt-1 text-sm">Check your dashboard for status.</p>
                <Link href="/dashboard" className="mt-3 inline-block text-sm font-medium text-green-700 hover:underline">
                  Go to Dashboard →
                </Link>
              </div>
            ) : needsLogin ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-slate-700">Log in or sign up to claim this deal.</p>
                <div className="mt-3 flex gap-3">
                  <Link
                    href={`/login?redirect=/deals/${slug}`}
                    className="btn-interactive rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                  >
                    Log in
                  </Link>
                  <Link
                    href={`/register?redirect=/deals/${slug}`}
                    className="btn-interactive rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            ) : needsVerification ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
                <p className="font-medium">Verification required</p>
                <p className="mt-1 text-sm">Complete verification to claim this locked deal.</p>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 active:scale-[0.98]"
                >
                  {claiming ? 'Claiming...' : 'Claim this deal'}
                </button>
                {claimError && (
                  <p className="mt-2 text-sm text-red-600">{claimError}</p>
                )}
              </div>
            )}
          </div>
        </motion.article>
      </div>
    </PageTransition>
  );
}
