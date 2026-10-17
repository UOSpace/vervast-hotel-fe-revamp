/**
 * Display formatters shared by every dashboard. Keep all number formatting here so the same amount
 * always renders the same way (e.g. $22.4M) on Hospitality, F&B, Experiences and Spa.
 */

/** Compact USD: $812K, $2.31M, $22.4M, $1.28B. Pass `digits` to force a decimal count for M/B. */
export function fmtUsd(value: number, digits?: number): string {
  const sign = value < 0 ? '-' : '';
  const n = Math.abs(value);
  if (n >= 1_000_000_000) return `${sign}$${(n / 1_000_000_000).toFixed(digits ?? 2)}B`;
  if (n >= 1_000_000) {
    const d = digits ?? (n >= 10_000_000 ? 1 : 2);
    return `${sign}$${(n / 1_000_000).toFixed(d)}M`;
  }
  if (n >= 100_000) return `${sign}$${Math.round(n / 1_000)}K`;
  if (n >= 1_000) return `${sign}$${(n / 1_000).toFixed(digits ?? 1)}K`;
  return `${sign}$${Math.round(n).toLocaleString('en-US')}`;
}

/** Full USD with thousands separator, no cents: $2,450 */
export function fmtUsdFull(value: number): string {
  const sign = value < 0 ? '-' : '';
  return `${sign}$${Math.round(Math.abs(value)).toLocaleString('en-US')}`;
}

/** Integer with thousands separator: 12,450 */
export function fmtInt(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

/** Compact count: 1.2K / 12.5K / 1.20M */
export function fmtCompactInt(value: number): string {
  const n = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (n >= 1_000_000) return `${sign}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 100_000) return `${sign}${Math.round(n / 1_000)}K`;
  if (n >= 1_000) return `${sign}${(n / 1_000).toFixed(1)}K`;
  return `${sign}${Math.round(n)}`;
}

export function fmtPct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

/** +11.0% / -2.4% */
export function fmtSignedPct(value: number, digits = 1): string {
  const rounded = Number(value.toFixed(digits));
  return `${rounded >= 0 ? '+' : '-'}${Math.abs(rounded).toFixed(digits)}%`;
}

/** +4.8 pts / -1.2 pts (percentage-point variance) */
export function fmtSignedPts(value: number, digits = 1): string {
  const rounded = Number(value.toFixed(digits));
  return `${rounded >= 0 ? '+' : '-'}${Math.abs(rounded).toFixed(digits)} pts`;
}

/** +$14.5M / -$85 */
export function fmtSignedUsd(value: number, digits?: number): string {
  return `${value >= 0 ? '+' : '-'}${fmtUsd(Math.abs(value), digits)}`;
}

/** True when a variance should be rendered with the "positive" (green) treatment. */
export const isUp = (value: number): boolean => value >= 0;
