import { dbOrderToOrder } from '../lib/dbMappers';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { DbOrder, DbOrderItem } from '../lib/supabaseTypes';
import type { ID, Order } from '../types';

type DbOrderRow = DbOrder & { order_items: DbOrderItem[] };

export async function fetchOrdersForClient(clientId: ID): Promise<Order[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as DbOrderRow[]).map(dbOrderToOrder);
}
