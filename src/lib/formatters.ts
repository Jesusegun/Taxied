// Format a number as Nigerian Naira
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format an integer pair like { month: 3, year: 2026 } into "March 2026"
export function formatMonthYear(month: string | number, year: number): string {
  const monthInt = typeof month === 'string' ? parseInt(month, 10) : month;
  
  // Date takes month index 0-11
  const date = new Date(year, monthInt - 1, 1);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}
