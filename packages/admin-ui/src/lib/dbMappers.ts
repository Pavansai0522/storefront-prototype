import type { CountryCode, CurrencyCode } from '../constants/countryCurrency';
import {
  catalogPriceFromDb,
  catalogPriceToDb,
  defaultCountryForTemplate,
} from '../constants/countryCurrency';
import { isLiquorStoreTemplate } from '../constants/templates';
import type { Client, PaymentHistory, Product } from '../types';
import type { ClientBilling, ClientNote } from '../types/client.types';
import type { DbClient, DbProduct } from './supabaseTypes';

function parseBilling(raw: Record<string, unknown>): ClientBilling {
  const history = Array.isArray(raw.paymentHistory)
    ? (raw.paymentHistory as PaymentHistory[])
    : [];
  return {
    planMonthlyInr: Number(raw.planMonthlyInr ?? 0),
    paidUntil: String(raw.paidUntil ?? ''),
    nextDue: String(raw.nextDue ?? ''),
    paymentHistory: history,
    amount: raw.amount != null ? Number(raw.amount) : undefined,
    lastPaid: raw.lastPaid != null ? String(raw.lastPaid) : undefined,
  };
}

function parseCountry(row: DbClient): CountryCode {
  if (isLiquorStoreTemplate(row.template)) {
    return 'US';
  }
  const raw = row.country;
  if (raw === 'IN' || raw === 'US' || raw === 'GB' || raw === 'AE') {
    return raw;
  }
  return defaultCountryForTemplate(row.template);
}

export function dbClientToClient(row: DbClient): Client {
  return {
    id: row.id,
    storeName: row.store_name,
    slug: row.slug,
    country: parseCountry(row),
    template: row.template as Client['template'],
    primaryColor: row.primary_color,
    whatsappNumber: row.whatsapp_number,
    storePhone: row.store_phone,
    address: row.address,
    timings: row.timings,
    instagram: row.instagram,
    facebook: row.facebook,
    ageVerificationEnabled: row.age_verification_enabled,
    deliveryAvailable: row.delivery_available,
    deliveryRadiusMiles: row.delivery_radius_miles,
    minimumOrderAmountUsd: row.minimum_order_amount_usd,
    logo: row.logo_url,
    liveUrl: row.live_url,
    siteActive: row.site_active,
    adminEmail: row.admin_email,
    adminLastLoginAt: row.admin_last_login_at,
    productsLastUpdatedAt: row.products_last_updated_at,
    accessoriesLastUpdatedAt: row.accessories_last_updated_at,
    billing: parseBilling(row.billing as Record<string, unknown>),
    notes: (row.notes as ClientNote[]) ?? [],
    status: row.status,
    monthlyFee: Number(row.monthly_fee),
    adminTempPassword: row.admin_temp_password,
    productsCount: row.products_count,
  };
}

export function clientToDbClient(client: Client): DbClient {
  const country = isLiquorStoreTemplate(client.template) ? 'US' : client.country;
  return {
    id: client.id,
    slug: client.slug,
    country,
    template: client.template,
    store_name: client.storeName,
    status: client.status,
    monthly_fee: client.monthlyFee,
    live_url: client.liveUrl,
    whatsapp_number: client.whatsappNumber,
    store_phone: client.storePhone,
    address: client.address,
    primary_color: client.primaryColor,
    logo_url: client.logo,
    admin_email: client.adminEmail,
    admin_temp_password: client.adminTempPassword,
    admin_last_login_at: client.adminLastLoginAt,
    products_count: client.productsCount,
    products_last_updated_at: client.productsLastUpdatedAt,
    accessories_last_updated_at: client.accessoriesLastUpdatedAt,
    site_active: client.siteActive,
    billing: client.billing as unknown as Record<string, unknown>,
    instagram: client.instagram,
    facebook: client.facebook,
    timings: client.timings,
    age_verification_enabled: client.ageVerificationEnabled,
    delivery_available: client.deliveryAvailable,
    delivery_radius_miles: client.deliveryRadiusMiles,
    minimum_order_amount_usd: client.minimumOrderAmountUsd,
    notes: client.notes,
    public_config: {},
  };
}

export function dbProductToProduct(row: DbProduct, currency: CurrencyCode = 'INR'): Product {
  const subcategory = row.subcategory ?? null;
  const categoryValue = subcategory || row.category || 'Other';
  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    brand: row.brand,
    price: catalogPriceFromDb(row.price_inr, currency),
    emiPrice: catalogPriceFromDb(row.emi_price_inr ?? 0, currency),
    image: row.image_url,
    inStock: row.in_stock,
    category: categoryValue as Product['category'],
    isAccessory: row.is_accessory,
    subcategory,
    featuredGroup: row.featured_group,
    featuredSort: row.featured_sort,
  };
}

export function productToDbInsert(
  product: Omit<Product, 'id'> & { id?: string },
  currency: CurrencyCode = 'INR',
): Record<string, unknown> {
  const subcategory = product.subcategory ?? null;
  return {
    id: product.id,
    client_id: product.clientId,
    name: product.name,
    brand: product.brand,
    price_inr: catalogPriceToDb(product.price, currency),
    emi_price_inr: catalogPriceToDb(product.emiPrice, currency),
    image_url: product.image,
    in_stock: product.inStock,
    category: subcategory ?? product.category,
    subcategory,
    is_accessory: product.isAccessory,
    featured_group: product.featuredGroup ?? null,
    featured_sort: product.featuredSort ?? null,
    sort_order: 0,
  };
}

export function productToDbUpdate(
  product: Partial<Product>,
  currency: CurrencyCode = 'INR',
): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  if (product.name != null) patch.name = product.name;
  if (product.brand != null) patch.brand = product.brand;
  if (product.price != null) patch.price_inr = catalogPriceToDb(product.price, currency);
  if (product.emiPrice != null) patch.emi_price_inr = catalogPriceToDb(product.emiPrice, currency);
  if (product.image !== undefined) patch.image_url = product.image;
  if (product.inStock != null) patch.in_stock = product.inStock;
  if (product.category != null || product.subcategory != null) {
    const sub = product.subcategory ?? product.category;
    patch.subcategory = sub ?? null;
    patch.category = sub ?? product.category;
  }
  if (product.isAccessory != null) patch.is_accessory = product.isAccessory;
  if (product.featuredGroup !== undefined) patch.featured_group = product.featuredGroup;
  if (product.featuredSort !== undefined) patch.featured_sort = product.featuredSort;
  return patch;
}
