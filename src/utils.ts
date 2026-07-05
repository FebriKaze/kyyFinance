export function formatIDR(amount: number): string {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(absVal);
  return `${isNegative ? '-' : ''}Rp${formatted}`;
}

export function formatUSD(amount: number): string {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(absVal);
  return `${isNegative ? '-' : ''}$${formatted}`;
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal'
  }).format(amount);
}
