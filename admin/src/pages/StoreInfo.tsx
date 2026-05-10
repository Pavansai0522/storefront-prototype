import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useAdminData } from '../context/AdminDataContext';
import { showToast } from '../utils/showToast';
import { getJwtPayloadFromStorage } from '../utils/jwt';
import { PageTransition } from '../components/PageTransition';

type StoreInfoForm = {
  whatsapp: string;
  address: string;
  timings: string;
  instagram: string;
  facebook: string;
};

export function StoreInfo(): JSX.Element {
  const payload = getJwtPayloadFromStorage();
  const clientId = payload?.clientId;
  const { clients, setClients } = useAdminData();

  const client = useMemo(() => clients.find((c) => c.id === clientId), [clients, clientId]);

  const { register, handleSubmit, reset } = useForm<StoreInfoForm>({
    defaultValues: {
      whatsapp: '',
      address: '',
      timings: '',
      instagram: '',
      facebook: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (!client) {
      return;
    }
    reset({
      whatsapp: client.whatsappNumber,
      address: client.address,
      timings: client.timings,
      instagram: client.instagram,
      facebook: client.facebook,
    });
  }, [client, reset]);

  if (!clientId || !client) {
    return (
      <PageTransition>
        <div className="admin-card-static p-8 text-center">
          <p className="text-white">No store is linked to this account.</p>
          <p className="mt-2 text-sm text-gray-400">Sign in as an admin with a clientId claim.</p>
        </div>
      </PageTransition>
    );
  }

  const onSubmit = (data: StoreInfoForm): void => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === client.id
          ? {
              ...c,
              whatsappNumber: data.whatsapp.trim(),
              address: data.address.trim(),
              timings: data.timings.trim(),
              instagram: data.instagram.trim(),
              facebook: data.facebook.trim(),
            }
          : c,
      ),
    );
    showToast('Store info saved', 'success');
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
          <label className="block text-sm">
            <span className="admin-label">WhatsApp number</span>
            <input required className="admin-input" {...register('whatsapp', { required: true })} />
          </label>

          <label className="block text-sm">
            <span className="admin-label">Timings</span>
            <input
              required
              className="admin-input"
              placeholder="Mon–Sat 10:00–20:00"
              {...register('timings', { required: true })}
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

          <label className="block text-sm">
            <span className="admin-label">Instagram</span>
            <input className="admin-input" placeholder="@handle" {...register('instagram')} />
          </label>

          <label className="block text-sm">
            <span className="admin-label">Facebook</span>
            <input className="admin-input" placeholder="Page URL" {...register('facebook')} />
          </label>

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
