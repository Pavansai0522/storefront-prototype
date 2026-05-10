import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import {
  createMockJwt,
  decodeJwtPayload,
  getJwtPayloadFromStorage,
  getStoredToken,
  setStoredToken,
  type JwtPayload,
} from '../utils/jwt';
import { PageTransition } from '../components/PageTransition';

async function mockLoginRequest(email: string, password: string): Promise<string> {
  // Simulates POST /api/auth/login — replace with real fetch when API is ready.
  await new Promise((r) => setTimeout(r, 450));
  if (!email.trim() || !password) {
    throw new Error('Email and password are required.');
  }
  const normalized = email.trim().toLowerCase();
  const isSuperadmin =
    normalized.startsWith('superadmin') || normalized === 'super@agency.com';
  const payload: JwtPayload = isSuperadmin
    ? { role: 'superadmin', email: email.trim(), iat: Date.now() }
    : {
        role: 'admin',
        clientId: 'client-1',
        email: email.trim(),
        iat: Date.now(),
        firstLogin: normalized.includes('firstlogin'),
      };
  return createMockJwt(payload);
}

export function Login(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (getStoredToken()) {
    const existing = getJwtPayloadFromStorage();
    if (existing?.role === 'admin' && existing.firstLogin === true) {
      return <Navigate to="/change-password" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const token = await mockLoginRequest(email, password);
      setStoredToken(token);
      const decoded = decodeJwtPayload(token);
      if (decoded?.role === 'admin' && decoded.firstLogin === true) {
        navigate('/change-password', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <PageTransition>
      <div className="admin-card mx-auto w-full max-w-sm p-8 shadow-2xl shadow-black/50">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-saffron/15 ring-1 ring-brand-saffron/40">
            <Lock className="h-6 w-6 text-brand-saffron" aria-hidden />
          </div>
          <h1 className="font-display text-2xl uppercase tracking-wide text-white md:text-3xl lg:text-4xl">
            Admin sign in
          </h1>
          <p className="mt-2 break-words text-sm text-gray-400">
            Use an email starting with <span className="text-white">superadmin</span> for full
            access, or any other email for a store admin (demo uses{' '}
            <span className="text-white">client-1</span>). Include{' '}
            <span className="text-white">firstlogin</span> in your email to test the forced
            password-change flow.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm">
            <span className="admin-label">Email</span>
            <div className="relative mt-1">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                aria-hidden
              />
              <input
                type="email"
                autoComplete="email"
                required
                className="admin-input !mt-0 py-2.5 pl-10"
                placeholder="superadmin@agency.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>
          <label className="block text-sm">
            <span className="admin-label">Password</span>
            <div className="relative mt-1">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                aria-hidden
              />
              <input
                type="password"
                autoComplete="current-password"
                required
                className="admin-input !mt-0 py-2.5 pl-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>

          {error ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={submitting} className="btn-admin-primary flex w-full justify-center">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
      </PageTransition>
    </div>
  );
}
