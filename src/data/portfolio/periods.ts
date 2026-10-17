/**
 * PORTFOLIO PERIODS - single definition of Today / MTD / YTD / Forward used by EVERY dashboard
 * (Hospitality, F&B, Experiences, Spa). Never hard-code day counts or period factors in a page.
 *
 * System date: Saturday, October 17, 2026.
 */

export type PeriodId = 'today' | 'mtd' | 'ytd' | 'forward';

export interface PeriodDef {
  id: PeriodId;
  label: string;
  /** Number of calendar days the period spans (Forward = window length in days). */
  days: number;
  /** Header text such as "MTD (October 1-17, 2026)". */
  periodLabel: string;
  /** Short description used in tooltips. */
  description: string;
  isForward: boolean;
}

export const SYSTEM_DATE_ISO = '2026-10-17';
export const SYSTEM_DATE_LABEL = 'October 17, 2026';

/** Jan 1 -> Oct 16, 2026 = 31+28+31+30+31+30+31+31+30+16 */
export const YTD_DAYS = 289;
/** Oct 1 -> Oct 16, 2026 (as of yesterday close) */
export const MTD_DAYS = 16;
/** Forward business window (Oct 17, 2026 -> Jan 14, 2027). */
export const FORWARD_DEFAULT_DAYS = 90;

export const PERIOD_DEFS: Record<PeriodId, PeriodDef> = {
  today: {
    id: 'today',
    label: 'Yesterday',
    days: 1,
    periodLabel: 'October 16, 2026',
    description: 'Operating actuals as of yesterday close (October 16, 2026).',
    isForward: false,
  },
  mtd: {
    id: 'mtd',
    label: 'MTD',
    days: MTD_DAYS,
    periodLabel: 'October 16, 2026',
    description: 'Month-to-date as of yesterday close (October 16, 2026).',
    isForward: false,
  },
  ytd: {
    id: 'ytd',
    label: 'YTD',
    days: YTD_DAYS,
    periodLabel: 'October 16, 2026',
    description: 'Year-to-date as of yesterday close (October 16, 2026).',
    isForward: false,
  },
  forward: {
    id: 'forward',
    label: 'Forward Business',
    days: FORWARD_DEFAULT_DAYS,
    periodLabel: 'October 16, 2026',
    description: 'On-the-books business for the next 90 days as of October 16, 2026.',
    isForward: true,
  },
};

export const PERIOD_IDS: PeriodId[] = ['today', 'mtd', 'ytd', 'forward'];
export const PERIOD_ORDER: PeriodId[] = PERIOD_IDS;
/** Periods that are actually recognised revenue (excludes Forward OTB). */
export const ACTUAL_PERIOD_IDS: PeriodId[] = ['today', 'mtd', 'ytd'];

export function getPeriodDef(id: PeriodId): PeriodDef {
  return PERIOD_DEFS[id];
}
