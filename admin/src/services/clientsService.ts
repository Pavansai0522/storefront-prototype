import { clientToDbClient, dbClientToClient } from '../lib/dbMappers';
import { isLocalDevMode } from '../lib/devMode';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { MOCK_CLIENTS } from '../mock/clients';
import type { DbClient } from '../lib/supabaseTypes';
import type { Client } from '../types';

export async function fetchAllClients(): Promise<Client[]> {
  if (isLocalDevMode) {
    return [...MOCK_CLIENTS];
  }
  if (!isSupabaseConfigured) {
    return [];
  }
  const { data, error } = await supabase.from('clients').select('*').order('store_name');
  if (error) {
    throw new Error(error.message);
  }
  return (data as DbClient[]).map(dbClientToClient);
}

export async function updateClientFields(clientId: string, fields: Partial<Client>): Promise<Client> {
  const patch: Record<string, unknown> = {};
  if (fields.storeName != null) patch.store_name = fields.storeName;
  if (fields.country != null) patch.country = fields.country;
  if (fields.slug != null) patch.slug = fields.slug;
  if (fields.template != null) patch.template = fields.template;
  if (fields.status != null) patch.status = fields.status;
  if (fields.monthlyFee != null) patch.monthly_fee = fields.monthlyFee;
  if (fields.liveUrl != null) patch.live_url = fields.liveUrl;
  if (fields.whatsappNumber != null) patch.whatsapp_number = fields.whatsappNumber;
  if (fields.storePhone != null) patch.store_phone = fields.storePhone;
  if (fields.address != null) patch.address = fields.address;
  if (fields.timings != null) patch.timings = fields.timings;
  if (fields.instagram != null) patch.instagram = fields.instagram;
  if (fields.facebook != null) patch.facebook = fields.facebook;
  if (fields.ageVerificationEnabled != null) {
    patch.age_verification_enabled = fields.ageVerificationEnabled;
  }
  if (fields.deliveryAvailable != null) patch.delivery_available = fields.deliveryAvailable;
  if (fields.deliveryRadiusMiles != null) patch.delivery_radius_miles = fields.deliveryRadiusMiles;
  if (fields.minimumOrderAmountUsd != null) {
    patch.minimum_order_amount_usd = fields.minimumOrderAmountUsd;
  }
  if (fields.siteActive != null) patch.site_active = fields.siteActive;
  if (fields.billing != null) patch.billing = fields.billing;
  if (fields.notes != null) patch.notes = fields.notes;
  if (fields.logo != null) patch.logo_url = fields.logo;
  if (fields.primaryColor != null) patch.primary_color = fields.primaryColor;
  if (fields.adminEmail != null) patch.admin_email = fields.adminEmail;
  if (fields.adminTempPassword != null) patch.admin_temp_password = fields.adminTempPassword;

  const { data, error } = await supabase
    .from('clients')
    .update(patch)
    .eq('id', clientId)
    .select('*')
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return dbClientToClient(data as DbClient);
}

export async function upsertClient(client: Client): Promise<Client> {
  const row = clientToDbClient(client);
  const { data, error } = await supabase.from('clients').upsert(row).select('*').single();
  if (error) {
    throw new Error(error.message);
  }
  return dbClientToClient(data as DbClient);
}

export async function deleteClient(clientId: string): Promise<void> {
  const { error } = await supabase.from('clients').delete().eq('id', clientId);
  if (error) {
    throw new Error(error.message);
  }
}
