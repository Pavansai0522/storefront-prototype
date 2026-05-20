import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useAdminData } from '../context/AdminDataContext';
import { showToast } from '../utils/showToast';
import { useProfile } from '../hooks/useProfile';
import { PageTransition } from '../components/PageTransition';
import { RequireStoreBanner } from '../components/RequireStoreBanner';
import { useAuthContext } from '../context/AuthContext';
import { isLiquorStoreTemplate } from '../constants/templates';
import { findClientById } from '../utils/clientLookup';
import { joinStoreTimings, parseStoreTimings } from '../utils/storeTimings';

type StoreInfoForm = {
  whatsapp: string;
  storePhone: string;
  address: string;
  timingsWeekdays: string;
  timingsSunday: string;
  instagram: string;
  facebook: string;
  ageVerificationEnabled: boolean;
};

export function StoreInfo(): JSX.Element {
  const { isSuperadmin } = useAuthContext();
  const { effectiveClientId: clientId } = useProfile();
  const { clients, updateClient } = useAdminData();

  const client = useMemo(() => findClientById(clients, clientId), [clients, clientId]);
  const isLiquor = isLiquorStoreTemplate(client?.template);

  const { register, handleSubmit, reset } = useForm<StoreInfoForm>({
    defaultValues: {
      whatsapp: '',
      storePhone: '',
      address: '',
      timingsWeekdays: '',
      timingsSunday: '',
      instagram: '',
      facebook: '',
      ageVerificationEnabled: false,
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (!client) {
      return;
    }
    const { weekdays, sunday } = parseStoreTimings(client.timings);
    reset({
      whatsapp: client.whatsappNumber,
      storePhone: client.storePhone,
      address: client.address,
      timingsWeekdays: weekdays,
      timingsSunday: sunday,
      instagram: client.instagram,
      facebook: client.facebook,
      ageVerificationEnabled: client.ageVerificationEnabled,
    });
  }, [client, reset]);

  if (!clientId || !client) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-6">
          <RequireStoreBanner />
          <div className="admin-card-static p-8 text-center">
            <p className="text-white">No store selected</p>
            <p className="mt-2 text-sm text-gray-400">
              {isSuperadmin
                ? 'Use Clients → Manage as store on PR Watches to edit store info.'
                : 'Sign in as a store admin linked to this account.'}
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const onSubmit = async (data: StoreInfoForm): Promise<void> => {
    const timings = joinStoreTimings(data.timingsWeekdays, data.timingsSunday).trim();
    if (!timings) {
      showToast('Please enter at least one hours line (Monday–Saturday and/or Sunday).', 'error');
      return;
    }
    await updateClient(client.id, {
      whatsappNumber: isLiquor ? client.whatsappNumber : data.whatsapp.trim(),
      storePhone: isLiquor ? data.storePhone.trim() : client.storePhone,
      address: data.address.trim(),
      timings,
      instagram: data.instagram.trim(),
      facebook: data.facebook.trim(),
      ageVerificationEnabled: isLiquor ? data.ageVerificationEnabled : client.ageVerificationEnabled,
    });
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="admin-page-heading">Store info</h1>
          <p className="admin-page-subtitle mt-2">
            Update public details for <span className="text-white">{client.storeName}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="admin-card grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
          {isLiquor ? (
            <label className="block text-sm md:col-span-2">
              <span className="admin-label">Phone number</span>
              <input required className="admin-input" {...register('storePhone', { required: true })} />
            </label>
          ) : (
            <label className="block text-sm md:col-span-2">
              <span className="admin-label">WhatsApp number</span>
              <input required className="admin-input" {...register('whatsapp', { required: true })} />
            </label>
          )}

          <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
            <label className="block text-sm">
              <span className="admin-label">Monday–Saturday hours</span>
              <input
                className="admin-input"
                placeholder="e.g. Mon–Sat 10:00 AM – 10:00 PM"
                aria-label="Monday through Saturday opening hours"
                {...register('timingsWeekdays')}
              />
            </label>
            <label className="block text-sm">
              <span className="admin-label">Sunday hours</span>
              <input
                className="admin-input"
                placeholder="e.g. Sun 10:00 AM – 9:00 PM"
                aria-label="Sunday opening hours"
                {...register('timingsSunday')}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 md:col-span-2">
            Enter at least one line. If both are filled, they are combined for your storefront.
          </p>

          <label className="block text-sm md:col-span-2">
            <span className="admin-label">Address</span>
            <textarea
              required
              rows={3}
              className="admin-input min-h-[5rem]"
              {...register('address', { required: true })}
            />
          </label>

          <label className="block text-sm">
            <span className="admin-label">Instagram</span>
            <input className="admin-input" placeholder="@handle" {...register('instagram')} />
          </label>

          <label className="block text-sm">
            <span className="admin-label">Facebook</span>
            <input className="admin-input" placeholder="Page URL" {...register('facebook')} />
          </label>

          {isLiquor ? (
            <>
              <div className="md:col-span-2">
                <p className="admin-label mb-2">Compliance</p>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-brand-bg/40 px-4 py-3 text-sm text-white">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20 accent-brand-saffron" {...register('ageVerificationEnabled')} />
                  <span>Require age verification on the storefront</span>
                </label>
              </div>
            </>
          ) : null}

          <div className="flex justify-end pt-2 md:col-span-2">
            <button type="submit" className="btn-admin-primary w-full sm:w-auto">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}

