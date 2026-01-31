'use client';

import { motion } from 'framer-motion';

export default function DealCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-full animate-pulse rounded bg-slate-100" />
      <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
    </motion.div>
  );
}
