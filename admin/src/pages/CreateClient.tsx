import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { Client } from '../mock/clients';
import { useAdminData } from '../context/AdminDataContext';
import { showToast } from '../utils/showToast';
import { PageTransition } from '../components/PageTransition';

const TEMPLATES = ['mobile-store-v1', 'mobile-store-v2', 'salon-v1', 'restaurant-v1'] as const;

type CreateClientForm = {
  storeName: string;
  template: string;
  whatsapp: string;
  address: string;
  primaryColor: string;
  adminEmail: string;
};

function generateTempPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const num = '23456789';
  const sym = '!#@$%';
  const pick = (s: string): string => s[Math.floor(Math.random() * s.length)] ?? 'x';
  const parts = [
    pick(upper),
    pick(upper),
    pick(lower),
    pick(lower),
    pick(lower),
    pick(num),
    pick(num),
    pick(sym),
  ];
  for (let i = parts.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [parts[i], parts[j]] = [parts[j], parts[i]];
  }
  return parts.join('');
}

function slugFromStoreName(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'store'
  );
}

export function CreateClient(): JSX.Element {
  const navigate = useNavigate();
  const { setClients } = useAdminData();
  const generatedPassword = React.useMemo(() => generateTempPassword(), []);

  const { register, handleSubmit, watch, setValue } = useForm<CreateClientForm>({
    defaultValues: {
      storeName: '',
      template: TEMPLATES[0],
      whatsapp: '',
      address: '',
      primaryColor: '#FF6B00',
      adminEmail: '',
    },
    mode: 'onSubmit',
  });

  const primaryColor = watch('primaryColor');

  const onSubmit = useCallback(
    (data: CreateClientForm): void => {
      const id = `client-${Date.now()}`;
      const slug = slugFromStoreName(data.storeName);
      const trialEnd = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
      const nextDue = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
      const next: Client = {
        id,
        storeName: data.storeName.trim(),
        status: 'trial',
        monthlyFee: 299,
        template: data.template,
        liveUrl: `https://${slug}.example.com`,
        whatsapp: data.whatsapp.trim(),
        address: data.address.trim(),
        primaryColor: data.primaryColor,
        adminEmail: data.adminEmail.trim(),
        adminTempPassword: generatedPassword,
        adminLastLoginAt: null,
        productsCount: 0,
        productsLastUpdatedAt: new Date().toISOString(),
        accessoriesLastUpdatedAt: new Date().toISOString(),
        siteActive: true,
        billing: {
          planMonthlyInr: 299,
          paidUntil: trialEnd,
          nextDue,
          amount: 299,
          paymentHistory: [],
        },
        instagram: '',
        facebook: '',
        timings: 'Mon–Sat 10:00–20:00',
      };
      setClients((prev) => [...prev, next]);
      showToast('Client created successfully', 'success');
      navigate('/clients', { replace: false });
    },
    [generatedPassword, setClients, navigate],
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="admin-page-heading">Create client</h1>
          <p className="admin-page-subtitle mt-2">
            Onboard a new store and owner in one step (mock — saved in session).
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="admin-card grid grid-cols-1 gap-5 p-6 md:grid-cols-2"
        >
          <label className="block text-sm md:col-span-2">
            <span className="admin-label">Store name</span>
            <input required className="admin-input" {...register('storeName', { required: true })} />
          </label>

          <label className="block text-sm md:col-span-2">
            <span className="admin-label">Template</span>
            <select className="admin-input" {...register('template', { required: true })}>
              {TEMPLATES.map((t) => (
                <option key={t} value={t} className="bg-brand-bg text-white">
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm md:col-span-2">
            <span className="admin-label">Primary color</span>
            <div className="mt-1 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <input
                type="color"
                className="h-11 min-h-[44px] w-full max-w-[4.5rem] cursor-pointer rounded-xl border border-white/10 bg-brand-bg sm:h-10 sm:min-h-0 sm:w-14"
                value={primaryColor}
                onChange={(e) => setValue('primaryColor', e.target.value, { shouldDirty: true })}
              />
              <input
                required
                className="admin-input !mt-0 flex-1 font-mono text-sm"
                {...register('primaryColor', { required: true })}
              />
            </div>
          </label>

          <label className="block text-sm md:col-span-2">
            <span className="admin-label">WhatsApp number</span>
            <input
              required
              className="admin-input"
              placeholder="+91 …"
              {...register('whatsapp', { required: true })}
            />
          </label>

          <label className="block text-sm md:col-span-2">
            <span className="admin-label">Address</span>
            <textarea
              required
              rows={3}
              className="admin-input min-h-[5rem]"
              {...register('address', { required: true })}
            />
          </label>

          <label className="block text-sm md:col-span-2">
            <span className="admin-label">Admin login email</span>
            <input type="email" required className="admin-input" {...register('adminEmail', { required: true })} />
          </label>

          <div className="rounded-xl border border-white/10 bg-brand-bg/80 px-4 py-3 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-saffron">
              Auto-generated temp password
            </p>
            <p className="mt-2 break-all font-mono text-base text-white md:text-lg">{generatedPassword}</p>
            <p className="mt-1 text-xs text-gray-400">
              Share this once with the owner; they should change it after first login.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end md:col-span-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-admin-secondary w-full sm:w-auto"
            >
              Cancel
            </button>
            <button type="submit" className="btn-admin-primary w-full sm:w-auto">
              Create client
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
