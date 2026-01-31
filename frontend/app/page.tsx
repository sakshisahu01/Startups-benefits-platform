'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), { ssr: false });

const VISITED_KEY = 'startup-benefits-visited';

export default function LandingPage() {
  const [showHighlight, setShowHighlight] = useState(false);

  useEffect(() => {
    const visited = typeof window !== 'undefined' && localStorage.getItem(VISITED_KEY);
    if (!visited) {
      setShowHighlight(true);
      const t = setTimeout(() => {
        setShowHighlight(false);
        if (typeof window !== 'undefined') localStorage.setItem(VISITED_KEY, '1');
      }, 3500);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[420px] px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <HeroCanvas />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Discounted SaaS for{' '}
            <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">
              founders, teams & indie hackers
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-600"
          >
            Cloud services, marketing software, analytics tools, and productivity apps at startup-friendly prices.
            Public deals for everyone; locked deals require verification.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <motion.span
              className="relative inline-block"
              animate={showHighlight ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 1.5, repeat: showHighlight ? 2 : 0, ease: 'easeInOut' }}
            >
              {showHighlight && (
                <motion.span
                  className="absolute -inset-2 rounded-2xl border-2 border-brand-400 bg-brand-400/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: 2 }}
                />
              )}
              <Link
                href="/deals"
                className="btn-interactive relative inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-700 hover:shadow-brand-500/40"
              >
                Explore Deals
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.span>
          </motion.div>
        </div>
      </section>

      {/* How it works - scroll storytelling */}
      <section className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center text-2xl font-semibold text-slate-800 sm:text-3xl"
          >
            How it works
          </motion.h2>
          <div className="mt-14 space-y-16 sm:space-y-24">
            {[
              { step: 1, title: 'Browse deals', desc: 'Filter by category and access level. Search for the tools you need. Public and locked deals are clearly marked.', icon: '🔍' },
              { step: 2, title: 'Claim eligible offers', desc: 'Log in to claim. Public deals are open to everyone; locked deals require verification. One claim per deal.', icon: '✓' },
              { step: 3, title: 'Track in dashboard', desc: 'See all your claimed deals and their status—pending, approved, or rejected—in one place.', icon: '📋' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-xl font-bold text-brand-700">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-slate-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-t border-slate-200 bg-slate-50/50 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-2xl font-semibold text-slate-800 sm:text-3xl"
          >
            Why use Startup Benefits?
          </motion.h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { title: 'Curated SaaS deals', desc: 'Cloud services, marketing software, analytics tools, and productivity apps from trusted partners.' },
              { title: 'Public & locked offers', desc: 'Public deals for everyone; locked deals require verification so you know what to expect.' },
              { title: 'Track claim status', desc: 'Dashboard shows your claimed deals and status (pending / approved) so you stay on top.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-2xl rounded-2xl bg-brand-600 px-6 py-12 text-center text-white shadow-xl"
        >
          <h2 className="text-2xl font-semibold">Ready to save on SaaS?</h2>
          <p className="mt-2 text-brand-100">Browse deals and claim the ones you qualify for.</p>
          <Link
            href="/deals"
            className="btn-interactive mt-6 inline-block rounded-lg bg-white px-5 py-2.5 font-medium text-brand-700 hover:bg-brand-50"
          >
            Explore Deals
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
