import type { Client } from '../types';

export function isNextDueOverdue(nextDue: string): boolean {
  const end = new Date(nextDue);
  end.setHours(23, 59, 59, 999);
  return end < new Date();
}

export function isClientPaymentOverdue(client: Client): boolean {
  return client.status !== 'suspended' && isNextDueOverdue(client.billing.nextDue);
}
