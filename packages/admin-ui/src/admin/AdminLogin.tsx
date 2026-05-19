import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import type { Nullable } from '../types';
import { useAuthContext } from '../context/AuthContext';
import { useAdminRoutes } from '../context/AdminConfigContext';
import { isLocalDevMode } from '../lib/devMode';
import { PageTransition } from '../components/PageTransition';

function LoginIconWrap({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-saffron/15 ring-1 ring-brand-saffron/40">
      {children}
    </div>
  );
}

export function AdminLogin(): JSX.Element {
  const routes = useAdminRoutes();
  const { login, isLoggedIn, profile, loading } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Nullable<string>>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isLoggedIn) {
    if (profile?.mustChangePassword) {
      return <Navigate to={routes.CHANGE_PASSWORD} replace />;
    }
    return <Navigate to={routes.DASHBOARD} replace />;
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
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
            <LoginIconWrap>
              <Lock className="h-6 w-6 text-brand-saffron" aria-hidden />
            </LoginIconWrap>
            <h1 className="font-display text-2xl uppercase tracking-wide text-white md:text-3xl lg:text-4xl">
              Admin sign in
            </h1>
            <p className="mt-2 break-words text-sm text-gray-400">
              {isLocalDevMode ? (
                <>
                  Local demo mode (no Supabase). Use{' '}
                  <span className="text-white">super@agency.com</span> for superadmin,{' '}
                  <span className="text-white">owner@prwatches.example</span> for the watches store, or any
                  other email for <span className="text-white">client-1</span>. Add{' '}
                  <span className="text-white">firstlogin</span> in the email to test password change.
                </>
              ) : (
                <>
                  Sign in with your Supabase account. Store admins manage their storefront; superadmins manage
                  all clients.
                </>
              )}
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
                  placeholder={isLocalDevMode ? 'super@agency.com' : 'owner@prwatches.example'}
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
