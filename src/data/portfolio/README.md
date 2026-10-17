# Portfolio Data Layer (`src/data/portfolio`)

Single source of truth for **every** dashboard (Hospitality, F&B, Experiences, Spa).
Nothing about revenue, occupancy, covers, attendees, sessions or treatments may be typed in by hand inside a page or a drawer.
Import only from the barrel:

```ts
import {
  getPortfolioMetrics, getPropertyMetrics, getPropertyMetricsList, getForwardWindowMetrics,
  getPropertyIdsByCategory, getPropertyIdsByRegion, PORTFOLIO_PROPERTY_IDS,
  PERIOD_DEFS, PERIOD_IDS, type PeriodId,
  fmtUsd, fmtUsdFull, fmtInt, fmtCompactInt, fmtPct, fmtSignedPct, fmtSignedPts, fmtSignedUsd,
  splitByShares, getHospitalityRevenuePillars,
  FNB_REVENUE_CENTRE_SHARES, FNB_CUISINE_SHARES, FNB_DEMAND_SOURCE_SHARES,
  EXPERIENCE_CATEGORY_SHARES, EXPERIENCE_CATEGORY_REVENUE_SHARES, EXPERIENCE_PAID_MODEL_REVENUE_SHARES,
} from '@/data/portfolio';
```

## Model (system date: Saturday 17 Oct 2026)

| Period | id | days |
|---|---|---|
| Today | `today` | 1 |
| MTD (Oct 1-17) | `mtd` | 17 |
| YTD (Jan 1 - Oct 17) | `ytd` | 290 |
| Forward OTB (next 90 days) | `forward` | 90 |

```
rooms sold   = rooms x days x occupancy        (occupancy / ADR per period come from propertyProfiles.ts + MASTER_PROPERTIES)
room revenue = rooms sold x ADR
F&B / Spa / Experiences revenue = room revenue x per-property ratio
guest nights = rooms sold x guests per room    -> covers, stays, participants, attendances, sessions, treatments
```

* Money / counts are **additive**: portfolio = sum of properties; category = sum of its properties; region = sum of its properties.
* Occupancy, ADR, RevPAR, average check, participation %, utilisation %, ... are **re-derived from the sums** (never averaged).
* `Today < MTD < YTD` always holds for every additive number.
* Forward = on-the-books only (rooms OTB, partially pre-booked ancillaries). `getForwardWindowMetrics(ids, 90)` equals `getPortfolioMetrics(ids, 'forward')`.
* `vsLy`, `vsBudget`, `vsForecast` (and their `ly` / `budget` / `forecast` snapshots) are derived in the engine. Occupancy variance is in **percentage points**.

## Identities every dashboard must satisfy (same property selection + same period)

1. `Hospitality total = rooms + F&B + spa + activities` (`m.totalRevenue`).
2. Hospitality **F&B revenue** === F&B dashboard **F&B revenue** === `m.fnbRevenue`.
3. Hospitality **Activities revenue** === Experiences **paid revenue** === `m.experienceRevenue`.
4. Hospitality **Spa & Wellness revenue** === Spa dashboard revenue === `m.spaRevenue`.
5. Room revenue, occupancy, ADR, RevPAR are identical on every Hospitality view and on the KPI cards.
6. Category tables (revenue centres, cuisines, activity categories, segments, origin markets) are produced with `splitByShares(total, shares)` so they always add up to the headline number.
7. Property tables list `getPropertyMetricsList(ids, period)`; their sums must equal the headline above them.

## Rules for pages / widgets / drawers

* The period always comes from the page state (`PeriodId`); labels come from `PERIOD_DEFS[period].periodLabel`. Never hard-code "MTD", "October 1-31", factors like `1/17` or `11.75`.
* Drawers must receive the period (and property selection) through the drawer config `data` and recompute from the engine; do not hard-code numbers inside drawers.
* No absolute number (revenue, covers, attendees, rooms, guests, sessions ...) may be typed into JSX or in a data constant. Percentages that are *properties of the model* belong in `propertyProfiles.ts` / `mix.ts`. Narrative strings must be template strings built from engine values.
* Format with the shared formatters (`fmtUsd`, `fmtInt`, `fmtPct`, ...).
* Keep the design rules of `AGENTS.md` (monochrome, no emoji, borderless cards, ...).
* Sanity check: `node _check_portfolio.mjs` (prints Today / MTD / YTD / Forward totals and asserts sums and ordering).
