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

/** Jan 1 -> Oct 17, 2026 = 31+28+31+30+31+30+31+31+30+17 */
export const YTD_DAYS = 290;
/** Oct 1 -> Oct 17, 2026 */
export const MTD_DAYS = 17;
/** Forward business window (Oct 18, 2026 -> Jan 15, 2027). */
export const FORWARD_DEFAULT_DAYS = 90;

export const PERIOD_DEFS: Record<PeriodId, PeriodDef> = {
  today: {
    id: 'today',
    label: 'Today',
    days: 1,
    periodLabel: 'Today (October 17, 2026)',
    description: 'Single operating day (Saturday, October 17, 2026).',
    isForward: false,
  },
  mtd: {
    id: 'mtd',
    label: 'MTD',
    days: MTD_DAYS,
    periodLabel: 'MTD (October 1\u201317, 2026)',
    description: 'Month-to-date: October 1 through today (17 days).',
    isForward: false,
  },
  ytd: {
    id: 'ytd',
    label: 'YTD',
    days: YTD_DAYS,
    periodLabel: 'YTD (January 1 \u2013 October 17, 2026)',
    description: 'Year-to-date: January 1 through today (290 days).',
    isForward: false,
  },
  forward: {
    id: 'forward',
    label: 'Forward Business',
    days: FORWARD_DEFAULT_DAYS,
    periodLabel: 'Forward Business (Next 90 Days OTB)',
    description: 'On-the-books business for the next 90 days (October 18, 2026 \u2013 January 15, 2027).',
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
