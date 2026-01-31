'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Deal } from '@/lib/api';
import TiltCard from './TiltCard';

interface DealCardProps {
  deal: Deal;
  index?: number;
}

export default function DealCard({ deal, index = 0 }: DealCardProps) {
  const isLocked = deal.accessLevel === 'locked';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="h-full"
    >
      <TiltCard
        className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
        maxTilt={5}
        scaleOnHover={1.01}
      >
        <Link href={`/deals/${deal.slug}`} className="block h-full p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset focus-visible:rounded-2xl">
          <div className="flex items-start justify-between gap-4">
            <div className={`min-w-0 flex-1 ${isLocked ? 'blur-[2px] select-none' : ''}`}>
              <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {deal.category}
              </span>
              <h3 className="mt-2 font-semibold text-slate-900">{deal.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{deal.description}</p>
            </div>
            {isLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="rounded-full bg-amber-100 p-3">
                  <svg
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-700">Verification required</p>
                <p className="mt-0.5 text-xs text-slate-500">Complete verification to unlock</p>
              </div>
            )}
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
}
