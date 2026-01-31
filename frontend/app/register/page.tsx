'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { auth } from '@/lib/api';
import PageTransition from '@/components/PageTransition';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuth();
  const [redirect, setRedirect] = useState('/dashboard');
  const [isReady, setIsReady] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRedirect(searchParams.get('redirect') || '/dashboard');
    setIsReady(true);
  }, [searchParams]);

  if (!isReady) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await auth.register(email, password, name);
      setAuth(res.user, res.token);
      router.push(redirect);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <h1 className="text-2xl font-bold text-slate-900">Sign up</h1>
          <p className="mt-1 text-slate-600">Create an account to claim deals.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-focus mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-focus mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password (min 6 characters)
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-focus mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-interactive w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-60 disabled:transform-none"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-brand-600 hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
