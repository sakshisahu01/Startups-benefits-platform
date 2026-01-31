'use client';

import { motion } from 'framer-motion';

export default function DealDetailSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl space-y-6 px-4 py-12"
    >
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
      <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="border-t border-slate-200 pt-6">
        <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-48 animate-pulse rounded bg-slate-100" />
      </div>
      <div>
        <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-full animate-pulse rounded bg-slate-100" />
      </div>
      <div className="h-12 w-40 animate-pulse rounded-xl bg-slate-200" />
    </motion.div>
  );
}
