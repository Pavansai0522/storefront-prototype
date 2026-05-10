import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MIN_PASSWORD_LENGTH } from '../constants';
import type { JwtPayload, Nullable } from '../types';
import { createMockJwt, decodeJwtPayload, getStoredToken, setStoredToken } from '../utils/jwt';
import { showToast } from '../utils/showToast';
import { PageTransition } from '../components/PageTransition';

type ChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function ChangePassword(): JSX.Element {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onSubmit',
  });

  const onSubmit = (_data: ChangePasswordForm): void => {
    const token = getStoredToken();
    const prev: Nullable<JwtPayload> = token ? decodeJwtPayload(token) : null;
    if (!prev || prev.role !== 'admin') {
      setError('root', { message: 'Unable to update password for this session.' });
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      const nextPayload: JwtPayload = {
        ...prev,
        firstLogin: false,
      };
      setStoredToken(createMockJwt(nextPayload));
      const wasFirstLogin = prev.firstLogin === true;
      if (wasFirstLogin) {
        showToast('Welcome! Password updated.', 'success');
        navigate('/dashboard', { replace: true });
      } else {
        showToast('Password changed successfully', 'success');
        navigate('/dashboard', { replace: true });
      }
      setSubmitting(false);
    }, 400);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="font-display text-2xl uppercase tracking-wide text-white md:text-3xl">
          Change Password
        </h1>
        <div className="admin-card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label className="block text-sm">
              <span className="admin-label">Current password</span>
              <input
                type="password"
                autoComplete="current-password"
                className="admin-input mt-1"
                {...register('currentPassword', { required: 'All fields are required.' })}
              />
            </label>
            <label className="block text-sm">
              <span className="admin-label">New password</span>
              <input
                type="password"
                autoComplete="new-password"
                className="admin-input mt-1"
                {...register('newPassword', {
                  required: 'All fields are required.',
                  minLength: {
                    value: MIN_PASSWORD_LENGTH,
                    message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
                  },
                  validate: (v) =>
                    v === getValues('currentPassword') ? 'New password must be different' : true,
                })}
              />
              {errors.newPassword ? (
                <p className="mt-1 text-sm text-red-300" role="alert">
                  {errors.newPassword.message}
                </p>
              ) : null}
            </label>
            <label className="block text-sm">
              <span className="admin-label">Confirm new password</span>
              <input
                type="password"
                autoComplete="new-password"
                className="admin-input mt-1"
                {...register('confirmPassword', {
                  required: 'All fields are required.',
                  validate: (v) => v === getValues('newPassword') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword ? (
                <p className="mt-1 text-sm text-red-300" role="alert">
                  {String(errors.confirmPassword.message)}
                </p>
              ) : null}
            </label>

            {errors.root ? (
              <p className="text-sm text-red-300" role="alert">
                {errors.root.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="btn-admin-primary w-full sm:w-auto"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
