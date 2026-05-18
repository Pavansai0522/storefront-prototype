import type { CountryCode } from '../constants/countryCurrency';
import type { TemplateId } from '../constants/templates';
import type { ID, ISODateString, Nullable } from './utils.types';

export type ClientStatus = 'active' | 'suspended' | 'trial';

export interface ClientNote {
  id: ID;
  text: string;
  createdAt: ISODateString;
}

export interface PaymentHistory {
  date: ISODateString;
  amount: number;
  status: 'paid' | 'failed' | 'pending';
  reference: string;
}

export interface ClientBilling {
  planMonthlyInr: number;
  paidUntil: ISODateString;
  nextDue: ISODateString;
  paymentHistory: PaymentHistory[];
  /** Present on mock clients for legacy billing summaries */
  amount?: number;
  lastPaid?: ISODateString;
}

export interface Client {
  id: ID;
  storeName: string;
  slug: string;
  /** ISO 3166-1 alpha-2 — drives catalog and billing currency. */
  country: CountryCode;
  template: TemplateId;
  primaryColor: string;
  whatsappNumber: string;
  /** Contact phone for liquor-store templates (mobile stores use WhatsApp). */
  storePhone: string;
  address: string;
  timings: string;
  instagram: string;
  facebook: string;
  ageVerificationEnabled: boolean;
  deliveryAvailable: boolean;
  deliveryRadiusMiles: number;
  minimumOrderAmountUsd: number;
  logo: string;
  liveUrl: string;
  siteActive: boolean;
  adminEmail: string;
  adminLastLoginAt: Nullable<ISODateString>;
  productsLastUpdatedAt: Nullable<ISODateString>;
  accessoriesLastUpdatedAt: Nullable<ISODateString>;
  billing: ClientBilling;
  notes: ClientNote[];
  status: ClientStatus;
  monthlyFee: number;
  adminTempPassword: string;
  productsCount: number;
}
