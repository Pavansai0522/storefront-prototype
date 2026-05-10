export const formatINR = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatEMI = (emi: number): string =>
  emi > 0 ? `${formatINR(emi)}/mo` : 'No EMI';
