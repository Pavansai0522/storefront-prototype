export const formatInr = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatEmi = (emi: number): string =>
  emi > 0 ? `${formatInr(emi)}/mo` : 'No EMI';
