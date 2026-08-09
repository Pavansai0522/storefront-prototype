import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { isLiquorStoreTemplate, isRestaurantStoreTemplate, isWatchesStoreTemplate } from '../constants/templates';
import {
  countAccessoriesForClient,
  countProductsForClient,
  supportsAccessoriesCatalog,
} from '../utils/catalogAccessories';
import type { Client } from '../types';
import { useProfile } from '../hooks/useProfile';
import { useAdminRoutes } from '../context/AdminConfigContext';
import { findClientById } from '../utils/clientLookup';

const STORE_INFO_FIELDS = 5;

function storeInfoCompleteness(client: Client | undefined, isLiquor: boolean): {
  filled: number;
  total: number;
  percent: number;
} {
  if (!client) {
    return { filled: 0, total: STORE_INFO_FIELDS, percent: 0 };
  }
  const primaryContact = isLiquor ? client.storePhone : client.whatsappNumber;
  const filled = [
    primaryContact.trim(),
    client.address.trim(),
    client.timings.trim(),
    client.instagram.trim(),
    client.facebook.trim(),
  ].filter(Boolean).length;
  const total = STORE_INFO_FIELDS;
  return { filled, total, percent: Math.round((filled / total) * 100) };
}

export function StoreAdminDashboard(): JSX.Element {
  const routes = useAdminRoutes();
  const { role, effectiveClientId: clientId } = useProfile();
  const { clients, products, accessories } = useAdminData();

  const myClient = useMemo(
    () => findClientById(clients, clientId),
    [clients, clientId],
  );

  const template = myClient?.template ?? null;
  const isLiquor = isLiquorStoreTemplate(template);
  const isWatches = isWatchesStoreTemplate(template);
  const isRestaurant = isRestaurantStoreTemplate(template);
  const showAccessories = supportsAccessoriesCatalog(template);

  const productCountForStore = useMemo(
    () =>
      clientId
        ? countProductsForClient(products, accessories, clientId, template)
        : products.length,
    [products, accessories, clientId, template],
  );

  const accessoryCountForStore = useMemo(
    () =>
      clientId
        ? countAccessoriesForClient(products, accessories, clientId, template)
        : accessories.length,
    [products, accessories, clientId, template],
  );

  const completeness = useMemo(
    () => storeInfoCompleteness(myClient, isLiquor),
    [myClient, isLiquor],
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="admin-page-heading">Dashboard</h1>
        <p className="admin-page-subtitle mt-2">
          Signed in as <span className="text-white">{role}</span>
          {clientId ? (
            <>
              {' '}
              · Store <span className="text-white">{clientId}</span>
            </>
          ) : null}
        </p>
      </div>
      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
          showAccessories ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
        }`}
      >
        <div className="admin-card p-5">
          <p className="text-xs uppercase tracking-wide text-brand-saffron">
            {isRestaurant ? 'Menu items (your store)' : 'Products (your store)'}
          </p>
          <p className="mt-2 font-display text-5xl text-white">{productCountForStore}</p>
          {isWatches ? (
            <p className="mt-1 text-xs text-gray-400">Watches &amp; toys (Products page)</p>
          ) : isRestaurant ? (
            <p className="mt-1 text-xs text-gray-400">Dishes on your food menu</p>
          ) : null}
        </div>
        {showAccessories ? (
          <div className="admin-card p-5">
            <p className="text-xs uppercase tracking-wide text-brand-saffron">Accessories (your store)</p>
            <p className="mt-2 font-display text-5xl text-white">{accessoryCountForStore}</p>
            <p className="mt-1 text-xs text-gray-400">
              {isWatches
                ? 'Cables, headphones, phone accessories & gadgets'
                : 'Cases, chargers, cables & more'}
            </p>
          </div>
        ) : null}
        <div className={`admin-card p-5 sm:col-span-2 ${showAccessories ? 'lg:col-span-1' : ''}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-saffron">Store info</p>
              <p className="mt-2 font-display text-5xl text-white">{completeness.percent}%</p>
              <p className="mt-1 text-sm text-gray-400">
                {completeness.filled}/{completeness.total} fields on{' '}
                <span className="text-white">Store Info</span>
              </p>
            </div>
            <Link
              to={routes.STORE_INFO}
              className="inline-flex min-h-[44px] shrink-0 items-center text-xs font-semibold text-brand-saffron hover:text-brand-saffronHover hover:underline"
            >
              Edit
            </Link>
          </div>
          <div
            className="mt-4 h-2 overflow-hidden rounded-full bg-brand-bg"
            role="progressbar"
            aria-valuenow={completeness.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Store profile completeness"
          >
            <div
              className="h-full rounded-full bg-brand-saffron shadow-[0_0_12px_rgba(255,107,0,0.5)] transition-[width]"
              style={{ width: `${completeness.percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {isLiquor
              ? 'Phone, address, timings, Instagram, and Facebook.'
              : 'WhatsApp, address, timings, Instagram, and Facebook.'}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-400">
        Use the sidebar to manage your store catalog and settings.
      </p>
    </div>
  );
}
