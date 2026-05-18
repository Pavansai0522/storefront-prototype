import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { TEMPLATES } from '../constants';
import type { Client, ClientStatus, Nullable } from '../types';
import { isClientPaymentOverdue } from '../utils/clientBilling';

export type SimpleSelectOption = { value: string; label: string };

const TEMPLATE_OPTIONS: SimpleSelectOption[] = [
  { value: 'all', label: 'All' },
  ...TEMPLATES.map((t) => ({ value: t.value, label: t.value })),
];

const STATUS_OPTIONS: SimpleSelectOption[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'trial', label: 'Trial' },
  { value: 'suspended', label: 'Suspended' },
];

const PAYMENT_OPTIONS: SimpleSelectOption[] = [
  { value: 'all', label: 'All' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
];

export type UseClientsResult = {
  filtered: Client[];
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  template: Nullable<SimpleSelectOption>;
  setTemplate: Dispatch<SetStateAction<Nullable<SimpleSelectOption>>>;
  status: Nullable<SimpleSelectOption>;
  setStatus: Dispatch<SetStateAction<Nullable<SimpleSelectOption>>>;
  payment: Nullable<SimpleSelectOption>;
  setPayment: Dispatch<SetStateAction<Nullable<SimpleSelectOption>>>;
  clearFilters: () => void;
  templateOptions: typeof TEMPLATE_OPTIONS;
  statusOptions: typeof STATUS_OPTIONS;
  paymentOptions: typeof PAYMENT_OPTIONS;
};

export function useClients(clients: Client[]): UseClientsResult {
  const [search, setSearch] = useState('');
  const [template, setTemplate] = useState<Nullable<SimpleSelectOption>>(TEMPLATE_OPTIONS[0]);
  const [status, setStatus] = useState<Nullable<SimpleSelectOption>>(STATUS_OPTIONS[0]);
  const [payment, setPayment] = useState<Nullable<SimpleSelectOption>>(PAYMENT_OPTIONS[0]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      if (!c?.id) {
        return false;
      }
      if (q && !c.storeName.toLowerCase().includes(q)) {
        return false;
      }
      const tpl = template?.value ?? 'all';
      if (tpl !== 'all' && c.template !== tpl) {
        return false;
      }
      const st = status?.value ?? 'all';
      if (st !== 'all' && c.status !== (st as ClientStatus)) {
        return false;
      }
      const pay = payment?.value ?? 'all';
      if (pay === 'overdue' && !isClientPaymentOverdue(c)) {
        return false;
      }
      if (pay === 'paid' && isClientPaymentOverdue(c)) {
        return false;
      }
      return true;
    });
  }, [clients, search, template, status, payment]);

  const clearFilters = (): void => {
    setSearch('');
    setTemplate(TEMPLATE_OPTIONS[0]);
    setStatus(STATUS_OPTIONS[0]);
    setPayment(PAYMENT_OPTIONS[0]);
  };

  return {
    filtered,
    search,
    setSearch,
    template,
    setTemplate,
    status,
    setStatus,
    payment,
    setPayment,
    clearFilters,
    templateOptions: TEMPLATE_OPTIONS,
    statusOptions: STATUS_OPTIONS,
    paymentOptions: PAYMENT_OPTIONS,
  };
}
