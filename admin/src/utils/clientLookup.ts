import type { Client } from '../types';

/** Drop null/invalid rows so `.find((c) => c.id …)` never throws. */
export function compactClients(clients: Client[]): Client[] {
  return clients.filter((c): c is Client => Boolean(c?.id));
}

export function findClientById(
  clients: Client[],
  clientId: string | null | undefined,
): Client | undefined {
  if (!clientId) {
    return undefined;
  }
  return clients.find((c) => c?.id === clientId);
}
