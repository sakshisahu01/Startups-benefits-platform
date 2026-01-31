'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { deals as dealsApi, Deal } from '@/lib/api';
import DealCard from '@/components/DealCard';
import DealCardSkeleton from '@/components/DealCardSkeleton';
import PageTransition from '@/components/PageTransition';

const CATEGORIES = ['All', 'Infrastructure', 'Analytics', 'Marketing', 'Productivity'];
const ACCESS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'public', label: 'Unlocked' },
  { value: 'locked', label: 'Locked' },
];

const POLL_INTERVAL = 5000; // Poll every 5 seconds

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [accessLevel, setAccessLevel] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      const params: { search?: string; category?: string; accessLevel?: string } = {};
      if (search.trim()) params.search = search.trim();
      if (category && category !== 'All') params.category = category;
      if (accessLevel) params.accessLevel = accessLevel;
      try {
        const res = await dealsApi.list(params);
        setDeals(res.deals);
      } catch (error) {
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
    
    // Set up polling interval
    const interval = setInterval(fetchDeals, POLL_INTERVAL);
    
    return () => clearInterval(interval);
  }, [search, category, accessLevel]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-900"
        >
          Deals
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-1 text-slate-600"
        >
          Browse discounted cloud, marketing, analytics, and productivity tools. Claim eligible offers.
        </motion.p>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <form onSubmit={handleSearchSubmit} className="flex-1 sm:max-w-xs">
            <input
              type="search"
              placeholder="Search deals..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-focus w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400"
            />
          </form>
          <div className="flex flex-wrap gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-focus rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-700"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c === 'All' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
              className="input-focus rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-700"
            >
              {ACCESS_OPTIONS.map((o) => (
                <option key={o.value || 'all'} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* List */}
        <div className="mt-8">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <DealCardSkeleton key={i} />
              ))}
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {deals.length === 0 ? (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center text-slate-600"
                >
                  No deals match your filters.
                </motion.p>
              ) : (
                <motion.div
                  key="grid"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ layout: { duration: 0.3, ease: 'easeOut' } }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {deals.map((deal, i) => (
                    <DealCard key={deal._id} deal={deal} index={i} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
