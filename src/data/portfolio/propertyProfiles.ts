import type { RegionId } from '@/constants/regions';

/**
 * PROPERTY PROFILES - the ONLY place where per-property operating assumptions live.
 * Rooms, base occupancy (MTD) and base ADR (MTD) come from MASTER_PROPERTIES (constants/categories.ts).
 * Everything else a dashboard shows (revenue, covers, attendees, sessions, ...) is DERIVED from these inputs
 * in engine.ts, so every dashboard and every period (Today / MTD / YTD / Forward) stays consistent.
 */

export interface PropertyProfile {
  id: string;
  regionId: RegionId;

  /** Guests staying per occupied room. */
  guestsPerRoom: number;
  /** Average length of stay (nights). */
  avgLosNights: number;

  /** Occupancy delta (percentage points) vs MTD base for a Saturday (Today). */
  occTodayDelta: number;
  /** Occupancy delta (pts) vs MTD base for the YTD average. */
  occYtdDelta: number;
  /** Expected final occupancy delta (pts) vs MTD base across the forward window (season shift). */
  occForecastDelta: number;

  /** ADR index vs MTD ADR. */
  adrTodayIdx: number;
  adrYtdIdx: number;
  adrForecastIdx: number;

  /** Ancillary revenue as a share of ROOM revenue. */
  fnbPct: number;
  spaPct: number;
  expPct: number;

  /** Year-over-year performance (LFL). Budget / Forecast gaps are derived from these in the engine. */
  yoyOccPts: number;
  yoyAdrPct: number;
  yoyFnbPct: number;
  yoySpaPct: number;
  yoyExpPct: number;
  /** Forward OTB room nights vs same time last year (pace), %. */
  paceVsLyPct: number;

  fnb: {
    outlets: number;
    /** % of in-house guest-nights that dine in a resort outlet. */
    captureRatePct: number;
    /** Beverage share of F&B revenue, %. */
    bevSharePct: number;
    coversPerGuestNight: number;
    seatsPerRoom: number;
  };

  spa: {
    avgTreatmentUsd: number;
  };

  exp: {
    programs: number;
    /** Unique participating guests / eligible in-house guests, %. */
    participationPct: number;
    /** Activities per participating guest-stay. */
    activitiesPerStay: number;
    /** % of attendances that are complimentary (stay-enriching, no revenue). */
    compSharePct: number;
    capacityUtilPct: number;
    demandFulfillmentPct: number;
    qualityPct: number;
    readinessPct: number;
    avgSessionCapacity: number;
  };
}

export const PROPERTY_PROFILES: Record<string, PropertyProfile> = {
  'sosei-barcelona': {
    id: 'sosei-barcelona', regionId: 'europe',
    guestsPerRoom: 1.7, avgLosNights: 2.9,
    occTodayDelta: 9.0, occYtdDelta: 4.3, occForecastDelta: 3.0,
    adrTodayIdx: 1.04, adrYtdIdx: 0.96, adrForecastIdx: 1.07,
    fnbPct: 0.215, spaPct: 0.045, expPct: 0.028,
    yoyOccPts: 3.6, yoyAdrPct: 6.4, yoyFnbPct: 13.8, yoySpaPct: 8.0, yoyExpPct: 10.5, paceVsLyPct: 9.5,
    fnb: { outlets: 4, captureRatePct: 66.0, bevSharePct: 36.5, coversPerGuestNight: 1.9, seatsPerRoom: 2.4 },
    spa: { avgTreatmentUsd: 320 },
    exp: { programs: 12, participationPct: 51.2, activitiesPerStay: 1.7, compSharePct: 58, capacityUtilPct: 74.8, demandFulfillmentPct: 90.6, qualityPct: 95.2, readinessPct: 97.0, avgSessionCapacity: 11 },
  },
  'sosei-tokyo': {
    id: 'sosei-tokyo', regionId: 'asia-pacific',
    guestsPerRoom: 1.6, avgLosNights: 3.1,
    occTodayDelta: 7.5, occYtdDelta: 2.8, occForecastDelta: 2.5,
    adrTodayIdx: 1.04, adrYtdIdx: 0.96, adrForecastIdx: 1.06,
    fnbPct: 0.235, spaPct: 0.05, expPct: 0.03,
    yoyOccPts: 3.2, yoyAdrPct: 5.9, yoyFnbPct: 15.6, yoySpaPct: 9.0, yoyExpPct: 11.8, paceVsLyPct: 11.2,
    fnb: { outlets: 4, captureRatePct: 71.0, bevSharePct: 38.2, coversPerGuestNight: 2.0, seatsPerRoom: 2.3 },
    spa: { avgTreatmentUsd: 340 },
    exp: { programs: 12, participationPct: 48.6, activitiesPerStay: 1.7, compSharePct: 58, capacityUtilPct: 76.2, demandFulfillmentPct: 91.8, qualityPct: 96.5, readinessPct: 99.2, avgSessionCapacity: 10 },
  },
  'sosei-bali': {
    id: 'sosei-bali', regionId: 'asia-pacific',
    guestsPerRoom: 2.0, avgLosNights: 5.0,
    occTodayDelta: 5.0, occYtdDelta: 3.5, occForecastDelta: 3.8,
    adrTodayIdx: 1.03, adrYtdIdx: 0.95, adrForecastIdx: 1.10,
    fnbPct: 0.185, spaPct: 0.08, expPct: 0.045,
    yoyOccPts: 4.1, yoyAdrPct: 6.9, yoyFnbPct: 12.4, yoySpaPct: 12.0, yoyExpPct: 15.1, paceVsLyPct: 12.6,
    fnb: { outlets: 4, captureRatePct: 74.0, bevSharePct: 33.0, coversPerGuestNight: 2.1, seatsPerRoom: 2.4 },
    spa: { avgTreatmentUsd: 360 },
    exp: { programs: 16, participationPct: 71.5, activitiesPerStay: 2.3, compSharePct: 60, capacityUtilPct: 84.0, demandFulfillmentPct: 89.2, qualityPct: 96.8, readinessPct: 98.0, avgSessionCapacity: 11 },
  },
  'sosei-maldives': {
    id: 'sosei-maldives', regionId: 'asia-pacific',
    guestsPerRoom: 2.0, avgLosNights: 5.6,
    occTodayDelta: 3.5, occYtdDelta: 2.6, occForecastDelta: 6.0,
    adrTodayIdx: 1.03, adrYtdIdx: 0.94, adrForecastIdx: 1.14,
    fnbPct: 0.2, spaPct: 0.075, expPct: 0.055,
    yoyOccPts: 4.8, yoyAdrPct: 7.6, yoyFnbPct: 14.6, yoySpaPct: 13.0, yoyExpPct: 19.4, paceVsLyPct: 15.8,
    fnb: { outlets: 4, captureRatePct: 78.0, bevSharePct: 37.0, coversPerGuestNight: 2.2, seatsPerRoom: 2.2 },
    spa: { avgTreatmentUsd: 390 },
    exp: { programs: 18, participationPct: 78.4, activitiesPerStay: 2.4, compSharePct: 52, capacityUtilPct: 88.2, demandFulfillmentPct: 84.0, qualityPct: 98.1, readinessPct: 98.5, avgSessionCapacity: 12 },
  },
  'sosei-switzerland': {
    id: 'sosei-switzerland', regionId: 'europe',
    guestsPerRoom: 2.2, avgLosNights: 4.6,
    occTodayDelta: 4.0, occYtdDelta: -2.8, occForecastDelta: 8.5,
    adrTodayIdx: 1.03, adrYtdIdx: 0.95, adrForecastIdx: 1.18,
    fnbPct: 0.205, spaPct: 0.06, expPct: 0.048,
    yoyOccPts: 4.4, yoyAdrPct: 7.2, yoyFnbPct: 11.8, yoySpaPct: 8.5, yoyExpPct: 16.2, paceVsLyPct: 13.2,
    fnb: { outlets: 4, captureRatePct: 79.0, bevSharePct: 34.0, coversPerGuestNight: 2.0, seatsPerRoom: 2.3 },
    spa: { avgTreatmentUsd: 380 },
    exp: { programs: 15, participationPct: 69.8, activitiesPerStay: 2.1, compSharePct: 50, capacityUtilPct: 85.1, demandFulfillmentPct: 87.4, qualityPct: 97.0, readinessPct: 99.0, avgSessionCapacity: 11 },
  },
  'sosei-canada': {
    id: 'sosei-canada', regionId: 'america',
    guestsPerRoom: 2.2, avgLosNights: 4.4,
    occTodayDelta: 3.0, occYtdDelta: -3.5, occForecastDelta: 7.0,
    adrTodayIdx: 1.03, adrYtdIdx: 0.95, adrForecastIdx: 1.15,
    fnbPct: 0.195, spaPct: 0.058, expPct: 0.042,
    yoyOccPts: 3.8, yoyAdrPct: 6.5, yoyFnbPct: 12.1, yoySpaPct: 7.5, yoyExpPct: 14.0, paceVsLyPct: 10.4,
    fnb: { outlets: 3, captureRatePct: 84.0, bevSharePct: 35.0, coversPerGuestNight: 2.0, seatsPerRoom: 2.3 },
    spa: { avgTreatmentUsd: 350 },
    exp: { programs: 14, participationPct: 67.4, activitiesPerStay: 2.1, compSharePct: 55, capacityUtilPct: 81.6, demandFulfillmentPct: 90.1, qualityPct: 96.2, readinessPct: 97.5, avgSessionCapacity: 10 },
  },
  'sosei-costa-rica': {
    id: 'sosei-costa-rica', regionId: 'america',
    guestsPerRoom: 2.1, avgLosNights: 4.3,
    occTodayDelta: 4.5, occYtdDelta: -1.5, occForecastDelta: 2.5,
    adrTodayIdx: 1.04, adrYtdIdx: 0.96, adrForecastIdx: 1.07,
    fnbPct: 0.165, spaPct: 0.055, expPct: 0.06,
    yoyOccPts: 3.1, yoyAdrPct: 5.4, yoyFnbPct: 9.6, yoySpaPct: 7.0, yoyExpPct: 17.8, paceVsLyPct: 9.4,
    fnb: { outlets: 3, captureRatePct: 58.0, bevSharePct: 31.0, coversPerGuestNight: 1.9, seatsPerRoom: 2.4 },
    spa: { avgTreatmentUsd: 300 },
    exp: { programs: 16, participationPct: 76.2, activitiesPerStay: 2.4, compSharePct: 56, capacityUtilPct: 86.4, demandFulfillmentPct: 85.5, qualityPct: 97.4, readinessPct: 97.8, avgSessionCapacity: 11 },
  },
  'sosei-japan': {
    id: 'sosei-japan', regionId: 'asia-pacific',
    guestsPerRoom: 1.9, avgLosNights: 3.6,
    occTodayDelta: 6.5, occYtdDelta: 3.2, occForecastDelta: 4.5,
    adrTodayIdx: 1.05, adrYtdIdx: 0.96, adrForecastIdx: 1.10,
    fnbPct: 0.19, spaPct: 0.07, expPct: 0.035,
    yoyOccPts: 3.5, yoyAdrPct: 5.8, yoyFnbPct: 10.4, yoySpaPct: 9.5, yoyExpPct: 13.4, paceVsLyPct: 10.8,
    fnb: { outlets: 3, captureRatePct: 82.0, bevSharePct: 34.0, coversPerGuestNight: 2.1, seatsPerRoom: 2.3 },
    spa: { avgTreatmentUsd: 330 },
    exp: { programs: 14, participationPct: 64.0, activitiesPerStay: 1.9, compSharePct: 62, capacityUtilPct: 79.8, demandFulfillmentPct: 91.4, qualityPct: 97.6, readinessPct: 98.8, avgSessionCapacity: 10 },
  },
  'sosei-oman': {
    id: 'sosei-oman', regionId: 'middle-east',
    guestsPerRoom: 1.9, avgLosNights: 5.2,
    occTodayDelta: 3.0, occYtdDelta: -2.0, occForecastDelta: 7.0,
    adrTodayIdx: 1.03, adrYtdIdx: 0.95, adrForecastIdx: 1.14,
    fnbPct: 0.15, spaPct: 0.115, expPct: 0.04,
    yoyOccPts: 3.0, yoyAdrPct: 5.1, yoyFnbPct: 8.2, yoySpaPct: 10.5, yoyExpPct: 12.2, paceVsLyPct: 8.6,
    fnb: { outlets: 3, captureRatePct: 88.0, bevSharePct: 29.0, coversPerGuestNight: 2.0, seatsPerRoom: 2.2 },
    spa: { avgTreatmentUsd: 430 },
    exp: { programs: 13, participationPct: 66.2, activitiesPerStay: 2.2, compSharePct: 64, capacityUtilPct: 78.4, demandFulfillmentPct: 92.0, qualityPct: 95.8, readinessPct: 96.4, avgSessionCapacity: 10 },
  },
  'sosei-egypt': {
    id: 'sosei-egypt', regionId: 'africa',
    guestsPerRoom: 1.8, avgLosNights: 6.0,
    occTodayDelta: 2.5, occYtdDelta: -1.0, occForecastDelta: 8.0,
    adrTodayIdx: 1.02, adrYtdIdx: 0.95, adrForecastIdx: 1.12,
    fnbPct: 0.14, spaPct: 0.105, expPct: 0.038,
    yoyOccPts: -1.4, yoyAdrPct: 0.6, yoyFnbPct: -2.2, yoySpaPct: -1.0, yoyExpPct: -1.8, paceVsLyPct: -1.2,
    fnb: { outlets: 2, captureRatePct: 81.0, bevSharePct: 28.0, coversPerGuestNight: 1.9, seatsPerRoom: 2.2 },
    spa: { avgTreatmentUsd: 410 },
    exp: { programs: 12, participationPct: 54.4, activitiesPerStay: 2.0, compSharePct: 68, capacityUtilPct: 69.5, demandFulfillmentPct: 86.0, qualityPct: 93.4, readinessPct: 91.2, avgSessionCapacity: 10 },
  },
};
