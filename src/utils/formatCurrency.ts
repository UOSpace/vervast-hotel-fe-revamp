/**
 * Format a number as currency (defaults to USD or IDR)
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '$0';
  }

  const num = Number(amount);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: num % 1 === 0 ? 0 : 2,
  }).format(num);
}

/**
 * Format compact numbers (e.g. $1.2M, $45.2K)
 */
export function formatCompactCurrency(
  amount: number | null | undefined,
  currency: string = '$'
): string {
  if (amount === null || amount === undefined || isNaN(amount)) return `${currency}0`;
  if (amount >= 1_000_000) {
    return `${currency}${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${currency}${(amount / 1_000).toFixed(1)}K`;
  }
  return `${currency}${amount.toLocaleString()}`;
}
