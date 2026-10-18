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
  shortLabel: string;
  /** Number of calendar days the period spans (Forward = window length in days). */
  days: number;
  /** Header text such as "MTD (October 1-17, 2026)". */
  periodLabel: string;
  /** Short description used in tooltips. */
  description: string;
  isForward: boolean;
}

const _now = new Date();
const _yesterday = new Date(_now.getFullYear(), _now.getMonth(), _now.getDate() - 1);

export const SYSTEM_DATE_ISO = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}-${String(_now.getDate()).padStart(2, '0')}`;
export const SYSTEM_DATE_LABEL = _now.toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
export const AS_OF_DATE_LABEL = _yesterday.toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
export const AS_OF_DATE_SHORT_LABEL = _yesterday.toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/** Jan 1 -> yesterday close */
export const YTD_DAYS = 289;
/** Month-to-date as of yesterday close */
export const MTD_DAYS = 16;
/** Forward business window (next 90 days). */
export const FORWARD_DEFAULT_DAYS = 90;

export const PERIOD_DEFS: Record<PeriodId, PeriodDef> = {
  today: {
    id: 'today',
    label: 'Yesterday',
    shortLabel: 'Yesterday',
    days: 1,
    periodLabel: AS_OF_DATE_LABEL,
    description: `Operating actuals as of yesterday close (${AS_OF_DATE_LABEL}).`,
    isForward: false,
  },
  mtd: {
    id: 'mtd',
    label: 'MTD',
    shortLabel: 'MTD',
    days: MTD_DAYS,
    periodLabel: AS_OF_DATE_LABEL,
    description: `Month-to-date as of yesterday close (${AS_OF_DATE_LABEL}).`,
    isForward: false,
  },
  ytd: {
    id: 'ytd',
    label: 'YTD',
    shortLabel: 'YTD',
    days: YTD_DAYS,
    periodLabel: AS_OF_DATE_LABEL,
    description: `Year-to-date as of yesterday close (${AS_OF_DATE_LABEL}).`,
    isForward: false,
  },
  forward: {
    id: 'forward',
    label: 'Forward Business',
    shortLabel: 'Forward',
    days: FORWARD_DEFAULT_DAYS,
    periodLabel: AS_OF_DATE_LABEL,
    description: `On-the-books business for the next 90 days as of ${AS_OF_DATE_LABEL}.`,
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
