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
  // ── Europe (3 Properties: Courchevel, Amalfi, Geneva) ────────────────────
  'sosei-courchevel': {
    id: 'sosei-courchevel', regionId: 'europe',
    guestsPerRoom: 2.2, avgLosNights: 4.6,
    occTodayDelta: 4.0, occYtdDelta: -2.8, occForecastDelta: 8.5,
    adrTodayIdx: 1.03, adrYtdIdx: 0.95, adrForecastIdx: 1.18,
    fnbPct: 0.205, spaPct: 0.06, expPct: 0.048,
    yoyOccPts: 4.4, yoyAdrPct: 7.2, yoyFnbPct: 11.8, yoySpaPct: 8.5, yoyExpPct: 16.2, paceVsLyPct: 13.2,
    fnb: { outlets: 4, captureRatePct: 79.0, bevSharePct: 34.0, coversPerGuestNight: 2.0, seatsPerRoom: 2.3 },
    spa: { avgTreatmentUsd: 380 },
    exp: { programs: 15, participationPct: 69.8, activitiesPerStay: 2.1, compSharePct: 50, capacityUtilPct: 85.1, demandFulfillmentPct: 87.4, qualityPct: 97.0, readinessPct: 99.0, avgSessionCapacity: 11 },
  },
  'sosei-amalfi': {
    id: 'sosei-amalfi', regionId: 'europe',
    guestsPerRoom: 1.9, avgLosNights: 4.2,
    occTodayDelta: 5.5, occYtdDelta: 2.4, occForecastDelta: 4.0,
    adrTodayIdx: 1.04, adrYtdIdx: 0.96, adrForecastIdx: 1.08,
    fnbPct: 0.22, spaPct: 0.07, expPct: 0.045,
    yoyOccPts: 3.5, yoyAdrPct: 5.8, yoyFnbPct: 12.6, yoySpaPct: 9.5, yoyExpPct: 13.4, paceVsLyPct: 10.8,
    fnb: { outlets: 3, captureRatePct: 83.0, bevSharePct: 38.0, coversPerGuestNight: 2.1, seatsPerRoom: 2.4 },
    spa: { avgTreatmentUsd: 340 },
    exp: { programs: 14, participationPct: 66.0, activitiesPerStay: 2.0, compSharePct: 58, capacityUtilPct: 80.4, demandFulfillmentPct: 91.0, qualityPct: 97.4, readinessPct: 98.6, avgSessionCapacity: 10 },
  },
  'sosei-geneva': {
    id: 'sosei-geneva', regionId: 'europe',
    guestsPerRoom: 1.7, avgLosNights: 2.9,
    occTodayDelta: 9.0, occYtdDelta: 4.3, occForecastDelta: 3.0,
    adrTodayIdx: 1.04, adrYtdIdx: 0.96, adrForecastIdx: 1.07,
    fnbPct: 0.215, spaPct: 0.045, expPct: 0.028,
    yoyOccPts: 3.6, yoyAdrPct: 6.4, yoyFnbPct: 13.8, yoySpaPct: 8.0, yoyExpPct: 10.5, paceVsLyPct: 9.5,
    fnb: { outlets: 4, captureRatePct: 66.0, bevSharePct: 36.5, coversPerGuestNight: 1.9, seatsPerRoom: 2.4 },
    spa: { avgTreatmentUsd: 320 },
    exp: { programs: 12, participationPct: 51.2, activitiesPerStay: 1.7, compSharePct: 58, capacityUtilPct: 74.8, demandFulfillmentPct: 90.6, qualityPct: 95.2, readinessPct: 97.0, avgSessionCapacity: 11 },
  },

  // ── Asia Pacific (3 Properties: Kyoto, Niseko, Sumba) ────────────────────
  'sosei-kyoto': {
    id: 'sosei-kyoto', regionId: 'asia-pacific',
    guestsPerRoom: 2.0, avgLosNights: 5.2,
    occTodayDelta: 5.0, occYtdDelta: 3.5, occForecastDelta: 4.5,
    adrTodayIdx: 1.03, adrYtdIdx: 0.95, adrForecastIdx: 1.11,
    fnbPct: 0.185, spaPct: 0.115, expPct: 0.048,
    yoyOccPts: 4.1, yoyAdrPct: 6.9, yoyFnbPct: 12.4, yoySpaPct: 14.0, yoyExpPct: 15.1, paceVsLyPct: 12.6,
    fnb: { outlets: 4, captureRatePct: 78.0, bevSharePct: 32.0, coversPerGuestNight: 2.1, seatsPerRoom: 2.4 },
    spa: { avgTreatmentUsd: 390 },
    exp: { programs: 16, participationPct: 73.5, activitiesPerStay: 2.3, compSharePct: 60, capacityUtilPct: 84.0, demandFulfillmentPct: 89.2, qualityPct: 96.8, readinessPct: 98.0, avgSessionCapacity: 11 },
  },
  'sosei-niseko': {
    id: 'sosei-niseko', regionId: 'asia-pacific',
    guestsPerRoom: 2.1, avgLosNights: 4.8,
    occTodayDelta: 4.5, occYtdDelta: -1.8, occForecastDelta: 7.5,
    adrTodayIdx: 1.03, adrYtdIdx: 0.95, adrForecastIdx: 1.16,
    fnbPct: 0.21, spaPct: 0.08, expPct: 0.052,
    yoyOccPts: 4.3, yoyAdrPct: 7.0, yoyFnbPct: 13.5, yoySpaPct: 11.2, yoyExpPct: 16.5, paceVsLyPct: 14.1,
    fnb: { outlets: 4, captureRatePct: 81.0, bevSharePct: 33.5, coversPerGuestNight: 2.0, seatsPerRoom: 2.3 },
    spa: { avgTreatmentUsd: 370 },
    exp: { programs: 15, participationPct: 72.0, activitiesPerStay: 2.2, compSharePct: 52, capacityUtilPct: 85.6, demandFulfillmentPct: 88.0, qualityPct: 97.2, readinessPct: 98.8, avgSessionCapacity: 11 },
  },
  'sosei-sumba': {
    id: 'sosei-sumba', regionId: 'asia-pacific',
    guestsPerRoom: 2.0, avgLosNights: 5.5,
    occTodayDelta: 4.8, occYtdDelta: 2.6, occForecastDelta: 5.2,
    adrTodayIdx: 1.03, adrYtdIdx: 0.96, adrForecastIdx: 1.12,
    fnbPct: 0.19, spaPct: 0.095, expPct: 0.058,
    yoyOccPts: 4.5, yoyAdrPct: 7.4, yoyFnbPct: 13.0, yoySpaPct: 12.8, yoyExpPct: 18.2, paceVsLyPct: 13.9,
    fnb: { outlets: 3, captureRatePct: 84.0, bevSharePct: 31.0, coversPerGuestNight: 2.1, seatsPerRoom: 2.4 },
    spa: { avgTreatmentUsd: 360 },
    exp: { programs: 16, participationPct: 76.5, activitiesPerStay: 2.4, compSharePct: 54, capacityUtilPct: 86.0, demandFulfillmentPct: 87.8, qualityPct: 97.5, readinessPct: 98.4, avgSessionCapacity: 11 },
  },

  // ── America (3 Properties: Aspen, Patagonia, Los Cabos) ──────────────────
  'sosei-aspen': {
    id: 'sosei-aspen', regionId: 'america',
    guestsPerRoom: 2.1, avgLosNights: 4.4,
    occTodayDelta: 4.2, occYtdDelta: -2.0, occForecastDelta: 8.0,
    adrTodayIdx: 1.04, adrYtdIdx: 0.96, adrForecastIdx: 1.17,
    fnbPct: 0.215, spaPct: 0.068, expPct: 0.05,
    yoyOccPts: 4.0, yoyAdrPct: 6.8, yoyFnbPct: 12.2, yoySpaPct: 9.4, yoyExpPct: 15.4, paceVsLyPct: 12.8,
    fnb: { outlets: 4, captureRatePct: 77.5, bevSharePct: 35.5, coversPerGuestNight: 2.0, seatsPerRoom: 2.3 },
    spa: { avgTreatmentUsd: 395 },
    exp: { programs: 15, participationPct: 70.4, activitiesPerStay: 2.1, compSharePct: 51, capacityUtilPct: 84.8, demandFulfillmentPct: 88.2, qualityPct: 96.9, readinessPct: 98.6, avgSessionCapacity: 11 },
  },
  'sosei-patagonia': {
    id: 'sosei-patagonia', regionId: 'america',
    guestsPerRoom: 2.1, avgLosNights: 4.3,
    occTodayDelta: 4.5, occYtdDelta: -1.5, occForecastDelta: 2.5,
    adrTodayIdx: 1.04, adrYtdIdx: 0.96, adrForecastIdx: 1.07,
    fnbPct: 0.165, spaPct: 0.055, expPct: 0.06,
    yoyOccPts: 3.1, yoyAdrPct: 5.4, yoyFnbPct: 9.6, yoySpaPct: 7.0, yoyExpPct: 17.8, paceVsLyPct: 9.4,
    fnb: { outlets: 3, captureRatePct: 58.0, bevSharePct: 31.0, coversPerGuestNight: 1.9, seatsPerRoom: 2.4 },
    spa: { avgTreatmentUsd: 300 },
    exp: { programs: 16, participationPct: 76.2, activitiesPerStay: 2.4, compSharePct: 56, capacityUtilPct: 86.4, demandFulfillmentPct: 85.5, qualityPct: 97.4, readinessPct: 97.8, avgSessionCapacity: 11 },
  },
  'sosei-los-cabos': {
    id: 'sosei-los-cabos', regionId: 'america',
    guestsPerRoom: 2.0, avgLosNights: 4.5,
    occTodayDelta: 5.0, occYtdDelta: 2.8, occForecastDelta: 5.5,
    adrTodayIdx: 1.03, adrYtdIdx: 0.96, adrForecastIdx: 1.10,
    fnbPct: 0.195, spaPct: 0.075, expPct: 0.052,
    yoyOccPts: 4.2, yoyAdrPct: 6.8, yoyFnbPct: 13.2, yoySpaPct: 11.4, yoyExpPct: 16.8, paceVsLyPct: 13.8,
    fnb: { outlets: 3, captureRatePct: 76.0, bevSharePct: 36.0, coversPerGuestNight: 2.1, seatsPerRoom: 2.4 },
    spa: { avgTreatmentUsd: 360 },
    exp: { programs: 15, participationPct: 72.8, activitiesPerStay: 2.2, compSharePct: 55, capacityUtilPct: 84.5, demandFulfillmentPct: 88.8, qualityPct: 97.2, readinessPct: 98.2, avgSessionCapacity: 11 },
  },

  // ── Middle East (2 Properties: AlUla, Muscat) ────────────────────────────
  'sosei-alula': {
    id: 'sosei-alula', regionId: 'middle-east',
    guestsPerRoom: 2.0, avgLosNights: 4.8,
    occTodayDelta: 4.5, occYtdDelta: 2.2, occForecastDelta: 7.0,
    adrTodayIdx: 1.03, adrYtdIdx: 0.95, adrForecastIdx: 1.14,
    fnbPct: 0.21, spaPct: 0.085, expPct: 0.05,
    yoyOccPts: 4.8, yoyAdrPct: 7.6, yoyFnbPct: 14.6, yoySpaPct: 13.0, yoyExpPct: 19.4, paceVsLyPct: 15.8,
    fnb: { outlets: 4, captureRatePct: 82.0, bevSharePct: 35.0, coversPerGuestNight: 2.1, seatsPerRoom: 2.3 },
    spa: { avgTreatmentUsd: 410 },
    exp: { programs: 16, participationPct: 74.2, activitiesPerStay: 2.3, compSharePct: 54, capacityUtilPct: 86.2, demandFulfillmentPct: 88.5, qualityPct: 97.6, readinessPct: 98.5, avgSessionCapacity: 12 },
  },
  'sosei-muscat': {
    id: 'sosei-muscat', regionId: 'middle-east',
    guestsPerRoom: 2.0, avgLosNights: 4.7,
    occTodayDelta: 4.5, occYtdDelta: 3.0, occForecastDelta: 5.0,
    adrTodayIdx: 1.03, adrYtdIdx: 0.95, adrForecastIdx: 1.11,
    fnbPct: 0.20, spaPct: 0.072, expPct: 0.05,
    yoyOccPts: 4.0, yoyAdrPct: 6.5, yoyFnbPct: 13.0, yoySpaPct: 10.8, yoyExpPct: 15.6, paceVsLyPct: 12.4,
    fnb: { outlets: 3, captureRatePct: 77.0, bevSharePct: 36.5, coversPerGuestNight: 2.1, seatsPerRoom: 2.3 },
    spa: { avgTreatmentUsd: 350 },
    exp: { programs: 15, participationPct: 71.0, activitiesPerStay: 2.2, compSharePct: 56, capacityUtilPct: 83.2, demandFulfillmentPct: 89.4, qualityPct: 96.9, readinessPct: 98.0, avgSessionCapacity: 11 },
  },

  // ── Africa (3 Properties: Marrakech, Serengeti, Seychelles) ──────────────
  'sosei-marrakech': {
    id: 'sosei-marrakech', regionId: 'africa',
    guestsPerRoom: 1.9, avgLosNights: 5.4,
    occTodayDelta: 2.5, occYtdDelta: -1.0, occForecastDelta: 8.0,
    adrTodayIdx: 1.02, adrYtdIdx: 0.95, adrForecastIdx: 1.12,
    fnbPct: 0.16, spaPct: 0.085, expPct: 0.045,
    yoyOccPts: -1.4, yoyAdrPct: 0.6, yoyFnbPct: -2.2, yoySpaPct: -1.0, yoyExpPct: -1.8, paceVsLyPct: -1.2,
    fnb: { outlets: 3, captureRatePct: 81.0, bevSharePct: 30.0, coversPerGuestNight: 1.9, seatsPerRoom: 2.2 },
    spa: { avgTreatmentUsd: 390 },
    exp: { programs: 14, participationPct: 58.4, activitiesPerStay: 2.0, compSharePct: 62, capacityUtilPct: 71.5, demandFulfillmentPct: 86.0, qualityPct: 94.2, readinessPct: 92.5, avgSessionCapacity: 10 },
  },
  'sosei-serengeti': {
    id: 'sosei-serengeti', regionId: 'africa',
    guestsPerRoom: 2.0, avgLosNights: 4.9,
    occTodayDelta: 3.8, occYtdDelta: 1.4, occForecastDelta: 4.8,
    adrTodayIdx: 1.03, adrYtdIdx: 0.96, adrForecastIdx: 1.09,
    fnbPct: 0.18, spaPct: 0.065, expPct: 0.065,
    yoyOccPts: 3.4, yoyAdrPct: 6.1, yoyFnbPct: 11.0, yoySpaPct: 8.8, yoyExpPct: 17.2, paceVsLyPct: 11.5,
    fnb: { outlets: 3, captureRatePct: 85.0, bevSharePct: 32.0, coversPerGuestNight: 2.1, seatsPerRoom: 2.3 },
    spa: { avgTreatmentUsd: 340 },
    exp: { programs: 16, participationPct: 78.0, activitiesPerStay: 2.5, compSharePct: 53, capacityUtilPct: 86.8, demandFulfillmentPct: 87.2, qualityPct: 97.6, readinessPct: 98.2, avgSessionCapacity: 10 },
  },
  'sosei-seychelles': {
    id: 'sosei-seychelles', regionId: 'africa',
    guestsPerRoom: 2.0, avgLosNights: 5.6,
    occTodayDelta: 4.6, occYtdDelta: 2.5, occForecastDelta: 6.0,
    adrTodayIdx: 1.03, adrYtdIdx: 0.95, adrForecastIdx: 1.13,
    fnbPct: 0.195, spaPct: 0.09, expPct: 0.055,
    yoyOccPts: 4.2, yoyAdrPct: 7.1, yoyFnbPct: 13.4, yoySpaPct: 12.2, yoyExpPct: 16.9, paceVsLyPct: 13.6,
    fnb: { outlets: 4, captureRatePct: 82.5, bevSharePct: 34.5, coversPerGuestNight: 2.1, seatsPerRoom: 2.4 },
    spa: { avgTreatmentUsd: 385 },
    exp: { programs: 15, participationPct: 74.8, activitiesPerStay: 2.3, compSharePct: 55, capacityUtilPct: 85.2, demandFulfillmentPct: 88.6, qualityPct: 97.3, readinessPct: 98.5, avgSessionCapacity: 11 },
  },
};
