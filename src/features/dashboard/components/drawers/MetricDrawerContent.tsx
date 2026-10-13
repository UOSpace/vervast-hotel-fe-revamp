import React, { useState, useEffect } from 'react';
import { RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

import { simulatedCategoryPerformance, type PropertyPerformanceCategory } from '../../services/propertySimulation';

export type TimeHorizon = 'today' | 'mtd' | 'ytd';
export type PropertyPerformanceItem = PropertyPerformanceCategory;
export const accuratePropertiesData: PropertyPerformanceCategory[] = simulatedCategoryPerformance;

interface MetricDrawerContentProps {
  config: {
    title: string;
    data?: any;
  };
  theme?: string;
}

const PILLAR_COLORS = ['#0f172a', '#334155', '#64748b', '#cbd5e1'];
const PILLAR_NAMES: Record<string, string> = { Rooms: 'Rooms', 'F&B': 'F&B', Spa: 'Spa', Act: 'Activities' };

/** Parses "Rooms $118M · F&B $22M · ..." into pillar entries; returns null for other formats. */
function parsePillars(text: string): { name: string; value: string; amount: number }[] | null {
  if (!/^Rooms \$/.test(text)) return null;
  const items = text.split(' · ').map((part) => {
    const idx = part.lastIndexOf(' ');
    const key = part.slice(0, idx);
    const value = part.slice(idx + 1);
    const num = parseFloat(value.replace(/[$,]/g, ''));
    const mult = /B$/.test(value) ? 1e9 : /M$/.test(value) ? 1e6 : /K$/.test(value) ? 1e3 : 1;
    return { name: PILLAR_NAMES[key] ?? key, value, amount: (isNaN(num) ? 0 : num) * mult };
  });
  return items.length > 1 && items.every((i) => i.amount > 0) ? items : null;
}

function getDynamicPeriodLabel(h: TimeHorizon): string {
  const now = new Date();
  const monthLong = now.toLocaleString('en-US', { month: 'long' });
  const monthShort = now.toLocaleString('en-US', { month: 'short' });
  const day = now.getDate();
  const year = now.getFullYear();

  if (h === 'today') return `Today, ${monthLong} ${day}, ${year}`;
  if (h === 'mtd') return `${monthLong} 1–${day}, ${year}`;
  if (h === 'ytd') return `Jan 1 – ${monthShort} ${day}, ${year}`;
  return '';
}

export function MetricDrawerContent({ config, theme }: MetricDrawerContentProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const initialHorizon: TimeHorizon =
    (config.data && typeof config.data === 'object' && config.data.horizon) || 'mtd';
  const [horizon, setHorizon] = useState<TimeHorizon>(initialHorizon);

  useEffect(() => {
    if (config.data && typeof config.data === 'object' && config.data.horizon) {
      setHorizon(config.data.horizon);
    }
  }, [config.data?.horizon]);

  const t = config.title.toUpperCase();
  const propName = config.data?.propertyName;

  const isOcc = t.includes('OCCUPANCY');
  const isAdr = t.includes('ADR');
  const isRevPar = t.includes('REVPAR');
  const isTotalHotelRev = t.includes('TOTAL HOTEL REVENUE') || t.includes('TOTAL REVENUE');
  const isRoomRev = t.includes('ROOM REVENUE') || (!isTotalHotelRev && t.includes('REVENUE'));
  const isLos = t.includes('STAY') || t.includes('LOS') || t.includes('LENGTH');
  const isRev = isTotalHotelRev || isRoomRev;

  const activePeriodLabel = getDynamicPeriodLabel(horizon);

  const getMetricConfig = () => {
    if (isOcc) {
      if (horizon === 'today') {
        return {
          title: 'Occupancy Rate Performance',
          subtitle: 'Real-time realized occupancy vs budget and forecast across luxury sanctuaries (Today Actuals)',
          heroValue: '76.8%',
          heroTrend: '+5.2 pts vs LY',
          heroTrendUp: true,
          targetValue: '73.8%',
          varianceText: '+3.0 pts vs Budget · +1.4 pts vs Forecast',
          contextLabel: 'Rooms Occupied Today',
          contextValue: '952 / 1,240 Rooms',
          yAxisSuffix: '%',
          chartTitle: "Today's Intraday Occupancy Progression",
          chartData: [
            { date: '08:00', value: 68.4, target: 73.8 },
            { date: '10:00', value: 71.2, target: 73.8 },
            { date: '12:00', value: 73.5, target: 73.8 },
            { date: '14:00', value: 75.1, target: 73.8 },
            { date: '16:00', value: 76.2, target: 73.8 },
            { date: '18:00', value: 76.8, target: 73.8 },
            { date: '20:00', value: 77.0, target: 73.8 },
            { date: '22:00', value: 76.8, target: 73.8 },
          ],
          targetLine: 73.8,
          drivers: [
            'Today occupancy reached 76.8%, outperforming LY by +5.2 pts and budget by +3.0 pts.',
            'Early check-ins across SOSEI Ski (80.5%) and SOSEI Beach Resort (77.8%) accelerated midday room utilization.',
            'Minimal same-day cancellations (<0.8%) recorded across all 10 luxury properties.',
            'Corporate retreat buyouts in SOSEI Barcelona lifted urban room occupancy to 72.0% today.'
          ]
        };
      } else if (horizon === 'ytd') {
        return {
          title: 'Occupancy Rate Performance',
          subtitle: 'Cumulative realized occupancy vs budget and forecast across luxury sanctuaries (YTD Actuals)',
          heroValue: '75.4%',
          heroTrend: '+5.6 pts vs LY',
          heroTrendUp: true,
          targetValue: '72.6%',
          varianceText: '+2.8 pts vs Budget · +1.5 pts vs Forecast',
          contextLabel: 'Average Rooms Occupied',
          contextValue: '935 / 1,240 Avg Rooms',
          yAxisSuffix: '%',
          chartTitle: 'Monthly Occupancy Cadence (Jan – Oct)',
          chartData: [
            { date: 'Jan', value: 73.2, target: 72.6 },
            { date: 'Feb', value: 76.4, target: 72.6 },
            { date: 'Mar', value: 77.8, target: 72.6 },
            { date: 'Apr', value: 74.1, target: 72.6 },
            { date: 'May', value: 73.5, target: 72.6 },
            { date: 'Jun', value: 75.8, target: 72.6 },
            { date: 'Jul', value: 78.2, target: 72.6 },
            { date: 'Aug', value: 79.0, target: 72.6 },
            { date: 'Sep', value: 75.1, target: 72.6 },
            { date: 'Oct', value: 75.4, target: 72.6 },
          ],
          targetLine: 72.6,
          drivers: [
            'Cumulative YTD occupancy maintained at 75.4%, +5.6 pts higher than the same period last year.',
            'Consistent peak summer yields and early winter bookings sustained steady momentum across quarters.',
            'Direct bookings via SOSEI Concierge accounted for 44% of cumulative room nights.',
            'Group and luxury consortia commitments locked in high baseline occupancies across all 5 collections.'
          ]
        };
      } else {
        // MTD
        return {
          title: 'Occupancy Rate Performance',
          subtitle: 'Daily realized occupancy vs budget and forecast across luxury sanctuaries (MTD Actuals)',
          heroValue: '74.2%',
          heroTrend: '+4.8 pts vs LY',
          heroTrendUp: true,
          targetValue: '72.1%',
          varianceText: '+2.1 pts vs Budget · +1.2 pts vs Forecast',
          contextLabel: 'Rooms Occupied MTD',
          contextValue: '920 / 1,240 Rooms',
          yAxisSuffix: '%',
          chartTitle: 'Past 14 Days Realized Daily Trend vs Target',
          chartData: [
            { date: 'Sep 23', value: 71.8, target: 72.1 },
            { date: 'Sep 24', value: 72.4, target: 72.1 },
            { date: 'Sep 25', value: 73.1, target: 72.1 },
            { date: 'Sep 26', value: 74.5, target: 72.1 },
            { date: 'Sep 27', value: 77.4, target: 72.1 },
            { date: 'Sep 28', value: 78.8, target: 72.1 },
            { date: 'Sep 29', value: 76.2, target: 72.1 },
            { date: 'Sep 30', value: 73.5, target: 72.1 },
            { date: 'Oct 01', value: 72.9, target: 72.1 },
            { date: 'Oct 02', value: 73.8, target: 72.1 },
            { date: 'Oct 03', value: 74.9, target: 72.1 },
            { date: 'Oct 04', value: 77.1, target: 72.1 },
            { date: 'Oct 05', value: 78.0, target: 72.1 },
            { date: 'Oct 06', value: 74.2, target: 72.1 },
          ],
          targetLine: 72.1,
          drivers: [
            'Strong leisure demand at SOSEI Ski (77.5%) & Beach Resort (75.2%) driving sustained peak performance.',
            'Occupancy outperforming LY by +4.8 pts, budget targets by +2.1 pts, and latest forecast by +1.2 pts.',
            'Direct bookings via SOSEI Privilege Concierge accounted for 42% of total room nights with minimal cancellations.',
            'Corporate retreat buyouts in SOSEI Barcelona (78.0%) lifted urban midweek room occupancy by 12%.'
          ]
        };
      }
    } else if (isAdr) {
      if (horizon === 'today') {
        return {
          title: 'Average Daily Rate (ADR) Performance',
          subtitle: 'Realized daily rate yield vs budget and forecast across luxury room tiers (Today Actuals)',
          heroValue: '$1,465',
          heroTrend: '+$97 vs LY (+7.1%)',
          heroTrendUp: true,
          targetValue: '$1,406',
          varianceText: '+$59 vs Budget (+4.2%) · +$24 vs Forecast (+1.7%)',
          contextLabel: 'Top Performing Today',
          contextValue: 'SOSEI Ski ($2,760)',
          yAxisSuffix: '',
          chartTitle: "Today's Room Tier Realized ADR Cadence",
          chartData: [
            { date: '08:00', value: 1420, target: 1406 },
            { date: '10:00', value: 1445, target: 1406 },
            { date: '12:00', value: 1460, target: 1406 },
            { date: '14:00', value: 1475, target: 1406 },
            { date: '16:00', value: 1480, target: 1406 },
            { date: '18:00', value: 1470, target: 1406 },
            { date: '20:00', value: 1465, target: 1406 },
            { date: '22:00', value: 1465, target: 1406 },
          ],
          targetLine: 1406,
          drivers: [
            'ADR for active stays today reached $1,465, up +$97 vs LY (+7.1%) and +$59 vs Budget.',
            'High-tier villa check-ins in Switzerland and Maldives secured nightly rates above $3,200.',
            'Dynamic rate adjustments captured strong last-minute autumn getaway demand.',
            'Direct booking rate integrity protected pricing power without third-party discounting.'
          ]
        };
      } else if (horizon === 'ytd') {
        return {
          title: 'Average Daily Rate (ADR) Performance',
          subtitle: 'Cumulative realized daily rate yield vs budget and forecast across luxury room tiers (YTD Actuals)',
          heroValue: '$1,440',
          heroTrend: '+$106 vs LY (+8.0%)',
          heroTrendUp: true,
          targetValue: '$1,386',
          varianceText: '+$54 vs Budget (+3.9%) · +$26 vs Forecast (+1.8%)',
          contextLabel: 'Top Performing Collection',
          contextValue: 'SOSEI Ski ($2,730)',
          yAxisSuffix: '',
          chartTitle: 'Monthly ADR Cadence (Jan – Oct)',
          chartData: [
            { date: 'Jan', value: 1480, target: 1386 },
            { date: 'Feb', value: 1495, target: 1386 },
            { date: 'Mar', value: 1460, target: 1386 },
            { date: 'Apr', value: 1410, target: 1386 },
            { date: 'May', value: 1395, target: 1386 },
            { date: 'Jun', value: 1425, target: 1386 },
            { date: 'Jul', value: 1470, target: 1386 },
            { date: 'Aug', value: 1485, target: 1386 },
            { date: 'Sep', value: 1435, target: 1386 },
            { date: 'Oct', value: 1440, target: 1386 },
          ],
          targetLine: 1386,
          drivers: [
            'Cumulative YTD ADR expanded to $1,440, delivering +$106 vs LY (+8.0%) sustainable premium pricing.',
            'Consistent suite and villa upsells delivered premium yield across all 10 sanctuaries.',
            'Presidential and Mountain Chalet bookings contributed disproportionate ADR expansion.',
            'Rate yield management strategy protected minimum nightly thresholds across seasons.'
          ]
        };
      } else {
        // MTD
        return {
          title: 'Average Daily Rate (ADR) Performance',
          subtitle: 'Realized daily rate yield vs budget and forecast across luxury room tiers (MTD Actuals)',
          heroValue: '$1,420',
          heroTrend: '+$85 vs LY (+6.0%)',
          heroTrendUp: true,
          targetValue: '$1,378',
          varianceText: '+$42 vs Budget (+3.2%) · +$18 vs Forecast (+1.3%)',
          contextLabel: 'Top Performing Collection',
          contextValue: 'SOSEI Ski ($2,709)',
          yAxisSuffix: '',
          chartTitle: 'Past 14 Days Realized Daily Trend vs Target',
          chartData: [
            { date: 'Sep 23', value: 1390, target: 1378 },
            { date: 'Sep 24', value: 1405, target: 1378 },
            { date: 'Sep 25', value: 1415, target: 1378 },
            { date: 'Sep 26', value: 1430, target: 1378 },
            { date: 'Sep 27', value: 1475, target: 1378 },
            { date: 'Sep 28', value: 1495, target: 1378 },
            { date: 'Sep 29', value: 1460, target: 1378 },
            { date: 'Sep 30', value: 1410, target: 1378 },
            { date: 'Oct 01', value: 1400, target: 1378 },
            { date: 'Oct 02', value: 1415, target: 1378 },
            { date: 'Oct 03', value: 1435, target: 1378 },
            { date: 'Oct 04', value: 1480, target: 1378 },
            { date: 'Oct 05', value: 1495, target: 1378 },
            { date: 'Oct 06', value: 1420, target: 1378 },
          ],
          targetLine: 1378,
          drivers: [
            'ADR expanded to $1,420 MTD, delivering a +$85 vs LY (+6.0%) rate increase across destinations.',
            'Outperforming budget benchmark by +$42 (+3.2%) and latest forecast by +$18 (+1.3%) driven by suite yields.',
            'Presidential and Royal Villa upgrades maintained an average nightly rate of $3,450 across destinations.',
            'Direct booking rate integrity ensured zero OTA discounting across luxury sanctuaries.'
          ]
        };
      }
    } else if (isRevPar) {
      if (horizon === 'today') {
        return {
          title: 'Revenue Per Available Room (RevPAR) Performance',
          subtitle: 'Yield efficiency benchmark combining occupancy volume and ADR pricing power (Today Actuals)',
          heroValue: '$1,125',
          heroTrend: '+$104 vs LY (+10.2%)',
          heroTrendUp: true,
          targetValue: '$1,067',
          varianceText: '+$58 vs Budget (+5.5%) · +$28 vs Forecast (+2.6%)',
          contextLabel: 'Today Portfolio TrevPAR',
          contextValue: '$1,410 (Total Rev/Room)',
          yAxisSuffix: '',
          chartTitle: "Today's Intraday RevPAR Cadence",
          chartData: [
            { date: '08:00', value: 971, target: 1067 },
            { date: '10:00', value: 1028, target: 1067 },
            { date: '12:00', value: 1073, target: 1067 },
            { date: '14:00', value: 1107, target: 1067 },
            { date: '16:00', value: 1127, target: 1067 },
            { date: '18:00', value: 1131, target: 1067 },
            { date: '20:00', value: 1128, target: 1067 },
            { date: '22:00', value: 1125, target: 1067 },
          ],
          targetLine: 1067,
          drivers: [
            'RevPAR reached $1,125 today, up +$104 vs LY (+10.2%) and +$58 vs Budget (+5.5%).',
            'Synchronized lift in both today occupancy (76.8%) and ADR ($1,465) optimized yield efficiency.',
            'SOSEI Ski generated peak daily yield with $2,222 RevPAR.',
            'High suite utilization minimized vacant inventory penalty across luxury properties.'
          ]
        };
      } else if (horizon === 'ytd') {
        return {
          title: 'Revenue Per Available Room (RevPAR) Performance',
          subtitle: 'Cumulative yield efficiency benchmark combining occupancy volume and ADR pricing power (YTD Actuals)',
          heroValue: '$1,085',
          heroTrend: '+$112 vs LY (+11.5%)',
          heroTrendUp: true,
          targetValue: '$1,033',
          varianceText: '+$52 vs Budget (+5.0%) · +$29 vs Forecast (+2.7%)',
          contextLabel: 'YTD Portfolio TrevPAR',
          contextValue: '$1,390 (Total Rev/Room)',
          yAxisSuffix: '',
          chartTitle: 'Monthly RevPAR Cadence (Jan – Oct)',
          chartData: [
            { date: 'Jan', value: 1083, target: 1033 },
            { date: 'Feb', value: 1142, target: 1033 },
            { date: 'Mar', value: 1135, target: 1033 },
            { date: 'Apr', value: 1044, target: 1033 },
            { date: 'May', value: 1025, target: 1033 },
            { date: 'Jun', value: 1080, target: 1033 },
            { date: 'Jul', value: 1149, target: 1033 },
            { date: 'Aug', value: 1173, target: 1033 },
            { date: 'Sep', value: 1077, target: 1033 },
            { date: 'Oct', value: 1085, target: 1033 },
          ],
          targetLine: 1033,
          drivers: [
            'Cumulative YTD RevPAR expanded to $1,085, +$112 vs LY (+11.5%) ahead of prior year.',
            'Strong pricing power combined with disciplined inventory allocation yielded steady month-over-month growth.',
            'SOSEI Ski led portfolio with $2,145 RevPAR across winter and autumn retreat periods.',
            'Minimum stay restrictions on weekends preserved pricing power throughout the year.'
          ]
        };
      } else {
        // MTD
        return {
          title: 'Revenue Per Available Room (RevPAR) Performance',
          subtitle: 'Yield efficiency benchmark combining occupancy volume and ADR pricing power (MTD Actuals)',
          heroValue: '$1,054',
          heroTrend: '+$92 vs LY (+8.5%)',
          heroTrendUp: true,
          targetValue: '$1,006',
          varianceText: '+$48 vs Budget (+4.1%) · +$22 vs Forecast (+2.1%)',
          contextLabel: 'Total Portfolio TrevPAR',
          contextValue: '$1,357 (Total Rev/Room)',
          yAxisSuffix: '',
          chartTitle: 'Past 14 Days Realized Daily Trend vs Target',
          chartData: [
            { date: 'Sep 23', value: 998, target: 1006 },
            { date: 'Sep 24', value: 1017, target: 1006 },
            { date: 'Sep 25', value: 1034, target: 1006 },
            { date: 'Sep 26', value: 1065, target: 1006 },
            { date: 'Sep 27', value: 1142, target: 1006 },
            { date: 'Sep 28', value: 1178, target: 1006 },
            { date: 'Sep 29', value: 1113, target: 1006 },
            { date: 'Sep 30', value: 1036, target: 1006 },
            { date: 'Oct 01', value: 1021, target: 1006 },
            { date: 'Oct 02', value: 1044, target: 1006 },
            { date: 'Oct 03', value: 1075, target: 1006 },
            { date: 'Oct 04', value: 1141, target: 1006 },
            { date: 'Oct 05', value: 1166, target: 1006 },
            { date: 'Oct 06', value: 1054, target: 1006 },
          ],
          targetLine: 1006,
          drivers: [
            'RevPAR reached $1,054, up +$92 vs LY (+8.5%), +$48 vs Budget (+4.1%), and +$22 vs Forecast (+2.1%).',
            'Balanced yield expansion achieved through healthy occupancy (74.2%) and ADR ($1,420).',
            'SOSEI Ski led yield with $2,100 RevPAR, representing top performance across destinations.',
            'Minimum stay restrictions on weekends preserved pricing power and eliminated single-night vacancy drag.'
          ]
        };
      }
    } else if (isTotalHotelRev) {
      if (horizon === 'today') {
        return {
          title: 'Total Hotel Revenue (5 Hospitality Pillars)',
          subtitle: 'Total hotel business revenue across all 5 hospitality pillars (Today Actuals)',
          heroValue: '$5.1M Today',
          heroTrend: '+9.4% vs LY',
          heroTrendUp: true,
          targetValue: '$4.9M Target',
          varianceText: '+$160K (+3.2%) vs Budget · +$75K (+1.5%) vs Forecast',
          contextLabel: '5 Hospitality Pillars (Today)',
          contextValue: 'Rooms $3.9M · F&B $750K · Spa $290K · Act $160K',
          yAxisSuffix: 'M',
          chartTitle: "Today's Intraday Revenue Accumulation",
          chartData: [
            { date: '08:00', value: 1.15, target: 4.90 },
            { date: '10:00', value: 1.95, target: 4.90 },
            { date: '12:00', value: 2.80, target: 4.90 },
            { date: '14:00', value: 3.45, target: 4.90 },
            { date: '16:00', value: 4.10, target: 4.90 },
            { date: '18:00', value: 4.65, target: 4.90 },
            { date: '20:00', value: 4.95, target: 4.90 },
            { date: '22:00', value: 5.10, target: 4.90 },
          ],
          targetLine: 4.90,
          drivers: [
            'Total hotel business revenue generated $5.1M today, outperforming LY (+9.4%) and budget (+3.2%).',
            'Rooms revenue anchored total performance with $3.9M recognized across active checked-in rooms.',
            'Food & Beverage generated steady volume with dinner banqueting and Michelin-starred culinary seatings ($750K).',
            'Thermal Spa and wellness sessions contributed high-margin ancillary revenue ($290K).'
          ]
        };
      } else if (horizon === 'ytd') {
        return {
          title: 'Total Hotel Revenue (5 Hospitality Pillars)',
          subtitle: 'Total hotel business revenue across all 5 hospitality pillars (YTD Actuals)',
          heroValue: '$1.28B YTD',
          heroTrend: '+12.4% vs LY',
          heroTrendUp: true,
          targetValue: '$1.22B Target',
          varianceText: '+$56M (+4.6%) vs Budget · +$27M (+2.2%) vs Forecast',
          contextLabel: '5 Hospitality Pillars (YTD)',
          contextValue: 'Rooms $992M · F&B $186M · Spa $68M · Act $34M',
          yAxisSuffix: 'M',
          chartTitle: 'Monthly Total Hotel Revenue (Jan – Oct in $M)',
          chartData: [
            { date: 'Jan', value: 125, target: 122 },
            { date: 'Feb', value: 132, target: 122 },
            { date: 'Mar', value: 136, target: 122 },
            { date: 'Apr', value: 121, target: 122 },
            { date: 'May', value: 118, target: 122 },
            { date: 'Jun', value: 128, target: 122 },
            { date: 'Jul', value: 139, target: 122 },
            { date: 'Aug', value: 144, target: 122 },
            { date: 'Sep', value: 131, target: 122 },
            { date: 'Oct', value: 152, target: 122 },
          ],
          targetLine: 122,
          drivers: [
            'Total hotel business revenue reached $1.28B YTD, up +12.4% vs LY and +4.6% ahead of budget.',
            'Rooms revenue ($992M) represents 77.5% of the total hospitality portfolio.',
            'Culinary and F&B experiences generated $186M with consistent Michelin-level guest spend.',
            'High-margin Wellness, Thermal Spa, and Curated Expeditions added over $102M in ancillary contribution.'
          ]
        };
      } else {
        // MTD
        return {
          title: 'Total Hotel Revenue (5 Hospitality Pillars)',
          subtitle: 'Total hotel business revenue across all 5 hospitality pillars (MTD Actuals)',
          heroValue: '$152M MTD',
          heroTrend: '+11.0% vs LY',
          heroTrendUp: true,
          targetValue: '$146.2M Target',
          varianceText: '+$5.8M (+4.0%) vs Budget · +$2.9M (+1.9%) vs Forecast',
          contextLabel: '5 Hospitality Pillars (MTD)',
          contextValue: 'Rooms $118M · F&B $22M · Spa $8M · Act $4M',
          yAxisSuffix: 'M',
          chartTitle: 'Past 14 Days Realized Daily Trend vs Target',
          chartData: [
            { date: 'Sep 23', value: 4.65, target: 4.71 },
            { date: 'Sep 24', value: 4.72, target: 4.71 },
            { date: 'Sep 25', value: 4.80, target: 4.71 },
            { date: 'Sep 26', value: 4.95, target: 4.71 },
            { date: 'Sep 27', value: 5.35, target: 4.71 },
            { date: 'Sep 28', value: 5.48, target: 4.71 },
            { date: 'Sep 29', value: 5.20, target: 4.71 },
            { date: 'Sep 30', value: 4.82, target: 4.71 },
            { date: 'Oct 01', value: 4.75, target: 4.71 },
            { date: 'Oct 02', value: 4.86, target: 4.71 },
            { date: 'Oct 03', value: 4.98, target: 4.71 },
            { date: 'Oct 04', value: 5.32, target: 4.71 },
            { date: 'Oct 05', value: 5.40, target: 4.71 },
            { date: 'Oct 06', value: 4.90, target: 4.71 },
          ],
          targetLine: 4.71,
          drivers: [
            'Total hotel business revenue generated strong performance MTD, outperforming LY and Budget.',
            'Rooms revenue anchored total business performance with strong rate yields.',
            'Food & Beverage generated steady volume with Michelin-starred dining buyouts and private banqueting.',
            'Spa & Wellness and Activities contributed high-margin experiences across luxury destinations.'
          ]
        };
      }
    } else if (isRoomRev) {
      if (horizon === 'today') {
        return {
          title: 'Room Revenue Performance',
          subtitle: 'Realized daily room revenue generation (Today Actuals)',
          heroValue: '$3.9M Today',
          heroTrend: '+$442K vs LY (+12.8%)',
          heroTrendUp: true,
          targetValue: '$3.72M Target',
          varianceText: '+$179K (+4.8%) vs Budget · +$86K (+2.3%) vs Forecast',
          contextLabel: 'Share of Hotel Revenue',
          contextValue: '76.5% of Total Hotel Business',
          yAxisSuffix: 'M',
          chartTitle: "Today's Intraday Room Revenue Cadence",
          chartData: [
            { date: '08:00', value: 0.90, target: 3.72 },
            { date: '10:00', value: 1.55, target: 3.72 },
            { date: '12:00', value: 2.20, target: 3.72 },
            { date: '14:00', value: 2.75, target: 3.72 },
            { date: '16:00', value: 3.25, target: 3.72 },
            { date: '18:00', value: 3.60, target: 3.72 },
            { date: '20:00', value: 3.82, target: 3.72 },
            { date: '22:00', value: 3.90, target: 3.72 },
          ],
          targetLine: 3.72,
          drivers: [
            'Daily room revenue generated $3.9M today across all active checked-in rooms.',
            'Strong suite occupancy in SOSEI Ski and Beach Resort accounted for 54% of today room revenue.',
            'Average Daily Rate ($1,465) for stays tonight maintained pricing integrity.',
            'Near-zero room attrition and early arrivals supported full daily revenue capture.'
          ]
        };
      } else if (horizon === 'ytd') {
        return {
          title: 'Room Revenue Performance',
          subtitle: 'Cumulative room revenue generation (YTD Actuals)',
          heroValue: '$992M YTD',
          heroTrend: '+$131M vs LY (+15.2%)',
          heroTrendUp: true,
          targetValue: '$936M Target',
          varianceText: '+$56M (+6.0%) vs Budget · +$24M (+2.5%) vs Forecast',
          contextLabel: 'Share of Hotel Revenue',
          contextValue: '77.5% of Total Hotel Business',
          yAxisSuffix: 'M',
          chartTitle: 'Monthly Room Revenue Cadence (Jan – Oct in $M)',
          chartData: [
            { date: 'Jan', value: 98, target: 93.6 },
            { date: 'Feb', value: 104, target: 93.6 },
            { date: 'Mar', value: 107, target: 93.6 },
            { date: 'Apr', value: 93, target: 93.6 },
            { date: 'May', value: 91, target: 93.6 },
            { date: 'Jun', value: 99, target: 93.6 },
            { date: 'Jul', value: 108, target: 93.6 },
            { date: 'Aug', value: 112, target: 93.6 },
            { date: 'Sep', value: 101, target: 93.6 },
            { date: 'Oct', value: 118, target: 93.6 },
          ],
          targetLine: 93.6,
          drivers: [
            'Room Revenue reached $992M YTD, outperforming LY by +$131M (+15.2%) and budget by +6.0%.',
            'Strong pricing power ($1,440 ADR) combined with healthy 75.4% occupancy drove robust performance.',
            'SOSEI Ski ($289M) and SOSEI Beach Resort ($250M) generated over 54% of portfolio room revenue.',
            'Forward bookings for Q4 project sustained top-line room revenue trajectory.'
          ]
        };
      } else {
        // MTD
        return {
          title: 'Room Revenue Performance',
          subtitle: 'Realized room revenue generation (MTD Actuals)',
          heroValue: '$118M MTD',
          heroTrend: '+$14.5M vs LY (+14.0%)',
          heroTrendUp: true,
          targetValue: '$112.2M Target',
          varianceText: '+$5.8M (+5.2%) vs Budget · +$2.4M (+2.1%) vs Forecast',
          contextLabel: 'Share of Hotel Revenue',
          contextValue: '77.6% of Total Hotel Business',
          yAxisSuffix: 'M',
          chartTitle: 'Past 14 Days Realized Daily Trend vs Target',
          chartData: [
            { date: 'Sep 23', value: 3.58, target: 3.62 },
            { date: 'Sep 24', value: 3.65, target: 3.62 },
            { date: 'Sep 25', value: 3.72, target: 3.62 },
            { date: 'Sep 26', value: 3.84, target: 3.62 },
            { date: 'Sep 27', value: 4.15, target: 3.62 },
            { date: 'Sep 28', value: 4.25, target: 3.62 },
            { date: 'Sep 29', value: 4.02, target: 3.62 },
            { date: 'Sep 30', value: 3.74, target: 3.62 },
            { date: 'Oct 01', value: 3.68, target: 3.62 },
            { date: 'Oct 02', value: 3.77, target: 3.62 },
            { date: 'Oct 03', value: 3.86, target: 3.62 },
            { date: 'Oct 04', value: 4.12, target: 3.62 },
            { date: 'Oct 05', value: 4.18, target: 3.62 },
            { date: 'Oct 06', value: 3.80, target: 3.62 },
          ],
          targetLine: 3.62,
          drivers: [
            'Room Revenue reached $118M MTD, delivering a +$14.5M (+14.0%) increase vs LY, +$5.8M (+5.2%) above budget, and +$2.4M (+2.1%) ahead of latest forecast.',
            'Average Daily Rate ($1,420) and 74.2% occupancy drove strong top-line room yields across all collections.',
            'SOSEI Ski ($34.5M) and SOSEI Beach Resort ($29.8M) generated over 54% of portfolio room revenue.',
            'Strong booking pace for remaining dates in October projected to sustain revenue momentum.'
          ]
        };
      }
    } else if (isLos) {
      const baseLos = horizon === 'today' ? '4.4 Nights' : horizon === 'ytd' ? '4.1 Nights' : '4.2 Nights';
      const losVal = propName && config.data?.los ? `${config.data.los} Nights` : baseLos;
      return {
        title: propName ? `${propName} — Average Length of Stay` : 'Average Length of Stay (ALOS) Performance',
        subtitle: propName ? `Realized guest length of stay across leisure and retreat stays at ${propName}` : `Average guest duration across destinations and stay portfolios (${horizon === 'today' ? 'Today' : horizon.toUpperCase()} Actuals)`,
        heroValue: losVal,
        heroTrend: '+0.3 Nights',
        heroTrendUp: true,
        targetValue: '3.8 Nights',
        varianceText: '+0.4 Nights vs Target Benchmark',
        contextLabel: 'Top Segment by Stay',
        contextValue: 'Leisure & Retreats (5.2 Nights)',
        yAxisSuffix: ' N',
        chartTitle: `Length of Stay Cadence (${horizon === 'today' ? 'Today' : horizon.toUpperCase()})`,
        chartData: [
          { date: 'Sep 23', value: 3.9, target: 3.8 },
          { date: 'Sep 24', value: 4.0, target: 3.8 },
          { date: 'Sep 25', value: 4.1, target: 3.8 },
          { date: 'Sep 26', value: 4.2, target: 3.8 },
          { date: 'Sep 27', value: 4.5, target: 3.8 },
          { date: 'Sep 28', value: 4.6, target: 3.8 },
          { date: 'Sep 29', value: 4.3, target: 3.8 },
          { date: 'Sep 30', value: 4.0, target: 3.8 },
          { date: 'Oct 01', value: 3.9, target: 3.8 },
          { date: 'Oct 02', value: 4.1, target: 3.8 },
          { date: 'Oct 03', value: 4.3, target: 3.8 },
          { date: 'Oct 04', value: 4.4, target: 3.8 },
          { date: 'Oct 05', value: 4.5, target: 3.8 },
          { date: 'Oct 06', value: 4.2, target: 3.8 },
        ],
        targetLine: 3.8,
        drivers: [
          'Strong leisure and wellness retreat bookings generating average stay lengths exceeding 4.5 nights.',
          'Direct bookings through private butler concierge yield 5.2 nights average length of stay.',
          'Zero early departures recorded across multi-bedroom villas and private mountain chalets.',
        ]
      };
    } else {
      return {
        title: 'Total In-House Guests & Activity Volume',
        subtitle: `Daily guest headcount and volume across active properties (${horizon === 'today' ? 'Today' : horizon.toUpperCase()} Actuals)`,
        heroValue: horizon === 'today' ? '2,847 Guests' : horizon === 'ytd' ? '242,000 Guests' : '28,450 Guests',
        heroTrend: '+12.0% YoY',
        heroTrendUp: true,
        targetValue: horizon === 'today' ? '2,600 Budgeted' : horizon === 'ytd' ? '228,000 Budgeted' : '26,500 Budgeted',
        varianceText: '+247 Guests Above Expectation',
        contextLabel: 'Arrivals / Departures',
        contextValue: '480 Arriving · 320 Departing',
        yAxisSuffix: '',
        chartTitle: 'Guest Volume Trend vs Target',
        chartData: [
          { date: 'Sep 23', value: 2680, target: 2600 },
          { date: 'Sep 24', value: 2720, target: 2600 },
          { date: 'Sep 25', value: 2760, target: 2600 },
          { date: 'Sep 26', value: 2810, target: 2600 },
          { date: 'Sep 27', value: 2980, target: 2600 },
          { date: 'Sep 28', value: 3040, target: 2600 },
          { date: 'Sep 29', value: 2910, target: 2600 },
          { date: 'Sep 30', value: 2730, target: 2600 },
          { date: 'Oct 01', value: 2710, target: 2600 },
          { date: 'Oct 02', value: 2750, target: 2600 },
          { date: 'Oct 03', value: 2800, target: 2600 },
          { date: 'Oct 04', value: 2990, target: 2600 },
          { date: 'Oct 05', value: 3020, target: 2600 },
          { date: 'Oct 06', value: 2847, target: 2600 },
        ],
        targetLine: 2600,
        drivers: [
          'High repeat guest ratio (38%) returning for autumn seasonal retreats.',
          'Average length of stay increased to 3.8 nights across all sanctuaries.',
          'Strong multi-generational family bookings during the holiday window.',
          'VIP arrivals scheduled today include 8 high-net-worth delegations.'
        ]
      };
    }
  };

  const m = getMetricConfig();

  // Dynamically scale collection table rows based on active horizon
  const getHorizonPropertiesData = () => {
    return accuratePropertiesData.map((cat) => {
      if (horizon === 'today') {
        const factor = 1 / 30;
        const occNum = Math.min(92, cat.occNum + 2.5);
        const adrNum = Math.round(cat.adrNum * 1.03);
        const revparNum = Math.round((occNum / 100) * adrNum);
        const revK = Math.round(cat.revenueNum * 1000 * factor);

        return {
          ...cat,
          occ: `${occNum.toFixed(2)}%`,
          adr: `$${adrNum.toLocaleString()}`,
          revenue: `$${revK.toLocaleString()}K`,
          revpar: `$${revparNum.toLocaleString()}`,
          status: 'Active Today',
          children: cat.children.map((ch) => {
            const chOcc = Math.min(95, parseFloat(ch.occ) + 2.2);
            const chAdr = Math.round(parseInt(ch.adr.replace(/[^0-9]/g, '')) * 1.03);
            const chRevpar = Math.round((chOcc / 100) * chAdr);
            const chRevM = parseFloat(ch.revenue.replace(/[^0-9.]/g, ''));
            const chRevK = Math.round(chRevM * 1000 * factor);
            return {
              ...ch,
              occ: `${chOcc.toFixed(2)}%`,
              adr: `$${chAdr.toLocaleString()}`,
              revenue: `$${chRevK.toLocaleString()}K`,
              revpar: `$${chRevpar.toLocaleString()}`,
            };
          }),
        };
      } else if (horizon === 'ytd') {
        const factor = 8.4;
        const occNum = Math.min(90, cat.occNum + 1.2);
        const adrNum = Math.round(cat.adrNum * 1.015);
        const revparNum = Math.round((occNum / 100) * adrNum);
        const revM = (cat.revenueNum * factor).toFixed(2);

        return {
          ...cat,
          occ: `${occNum.toFixed(2)}%`,
          adr: `$${adrNum.toLocaleString()}`,
          revenue: `$${revM}M`,
          revpar: `$${revparNum.toLocaleString()}`,
          status: 'Ahead of Target',
          children: cat.children.map((ch) => {
            const chOcc = Math.min(92, parseFloat(ch.occ) + 1.0);
            const chAdr = Math.round(parseInt(ch.adr.replace(/[^0-9]/g, '')) * 1.015);
            const chRevpar = Math.round((chOcc / 100) * chAdr);
            const chRevM = (parseFloat(ch.revenue.replace(/[^0-9.]/g, '')) * factor).toFixed(2);
            return {
              ...ch,
              occ: `${chOcc.toFixed(2)}%`,
              adr: `$${chAdr.toLocaleString()}`,
              revenue: `$${chRevM}M`,
              revpar: `$${chRevpar.toLocaleString()}`,
            };
          }),
        };
      }
      return cat;
    });
  };

  const dynamicPropertiesData = getHorizonPropertiesData();

  // Footer summary values according to active horizon
  const footerSummary = {
    today: {
      occ: '76.80%',
      adr: '$1,465.00',
      revenue: isTotalHotelRev ? '$5.10M' : '$3.90M',
      revpar: '$1,125.00',
    },
    mtd: {
      occ: '74.20%',
      adr: '$1,420.00',
      revenue: isTotalHotelRev ? '$152.00M' : '$118.00M',
      revpar: '$1,054.00',
    },
    ytd: {
      occ: '75.40%',
      adr: '$1,440.00',
      revenue: isTotalHotelRev ? '$1.28B' : '$992.00M',
      revpar: '$1,085.00',
    },
  }[horizon];

  const pillars = parsePillars(m.contextValue);
  const pillarTotal = pillars ? pillars.reduce((s, p) => s + p.amount, 0) : 1;

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* Top Header Filter Bar: Subtitle & Period + Horizon Filter Tabs (Today | MTD | YTD) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <p className="text-xs text-zinc-500 font-normal">{m.subtitle}</p>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
            Active Period: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{activePeriodLabel}</span>
          </p>
        </div>

        {/* Executive Time Horizon Tabs: Today | MTD | YTD */}
        <div className="inline-flex items-center p-0.5 bg-zinc-200/70 dark:bg-zinc-800 rounded-lg shrink-0">
          {(['today', 'mtd', 'ytd'] as const).map((h) => {
            const isActive = horizon === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => setHorizon(h)}
                className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                {h === 'today' ? 'Today' : h.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Hero Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-3">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Realized Performance</span>
          <div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{m.heroValue}</div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-flex items-center gap-1">
              ↑ {m.heroTrend}
            </span>
          </div>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-3">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Budget Benchmark</span>
          <div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{m.targetValue}</div>
            <div className="mt-1 flex flex-col gap-0.5">
              {String(m.varianceText).split(' · ').map((v) => (
                <span key={v} className="text-[10px] text-emerald-700 font-medium block">{v}</span>
              ))}
            </div>
          </div>
        </div>
        {pillars ? (
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-3">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{m.contextLabel}</span>
            <div>
              <div className="flex h-1.5 w-full rounded-full overflow-hidden gap-px">
                {pillars.map((p, i) => (
                  <div key={p.name} style={{ width: `${(p.amount / pillarTotal) * 100}%`, backgroundColor: PILLAR_COLORS[i] }} />
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2.5">
                {pillars.map((p, i) => (
                  <div key={p.name} className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: PILLAR_COLORS[i] }} />
                      <span className="text-[9px] text-zinc-500 font-medium truncate">{p.name}</span>
                    </div>
                    <div className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight mt-0.5">{p.value}</div>
                    <div className="text-[9px] text-zinc-400">{((p.amount / pillarTotal) * 100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-3">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{m.contextLabel}</span>
            <div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{m.contextValue}</div>
              <span className="text-[10px] text-zinc-400 mt-1 block">Portfolio Operational Status</span>
            </div>
          </div>
        )}
      </div>

      {/* Realized Cadence / Trend Chart with ReferenceLine for Target */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            {m.chartTitle}
          </span>
          <div className="flex items-center gap-3 text-[9.5px]">
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
              <span className="w-2.5 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
              <span>Actual Realized</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2.5 h-0.5 border-t border-dashed border-zinc-400" />
              <span>Target ({m.targetValue})</span>
            </div>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={m.chartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
              <defs>
                <linearGradient id="metricDrawerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme === 'dark' ? '#fafafa' : '#18181b'} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={theme === 'dark' ? '#fafafa' : '#18181b'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#27272a' : '#f4f4f5'} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: theme === 'dark' ? '#71717a' : '#a1a1aa' }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: theme === 'dark' ? '#71717a' : '#a1a1aa' }}
                tickFormatter={(v: number) => isRev ? `$${v}M` : isOcc ? `${v}%` : `$${v}`}
                width={45}
              />
              <Tooltip
                formatter={(val: any) => [
                  isRev ? `$${Number(val).toFixed(2)}M` : isOcc ? `${val}%` : `$${Number(val).toLocaleString()}`,
                  'Actual'
                ]}
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                  border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: theme === 'dark' ? '#fafafa' : '#09090b',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              />
              <ReferenceLine y={m.targetLine} stroke="#a1a1aa" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="value"
                stroke={theme === 'dark' ? '#fafafa' : '#18181b'}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#metricDrawerGradient)"
                dot={{ r: 3, fill: theme === 'dark' ? '#fafafa' : '#18181b' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown Table: If property context, show Property Room Tiers. If global, show Collection League */}
      <div>
        <div className="flex justify-between items-center mb-2 px-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            {propName
              ? `${propName} — Room Tier Inventory & Yield (${horizon === 'today' ? 'Today' : horizon.toUpperCase()} Actuals)`
              : `Property Collection Breakdown (${horizon === 'today' ? 'Today' : horizon.toUpperCase()} Actuals)`}
          </h4>
          <span className="text-[9.5px] text-zinc-400">
            {propName ? 'Room categories and realized yields' : 'Click collection row to expand individual sanctuaries'}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          {propName ? (
            <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
              <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-sm">
                <tr className="text-left text-zinc-400">
                  <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Room Category</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap text-right">Inventory</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Occupancy</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">ADR (USD)</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                    Revenue ({horizon === 'today' ? 'Today' : horizon.toUpperCase()})
                  </th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: 'Presidential / Mountain Chalet', keys: '30 Keys', occ: `${Math.min(95, parseInt(config.data?.occ || '76') + 4)}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 1.18).toLocaleString()}`, rev: horizon === 'today' ? '$3.8K' : horizon === 'ytd' ? '$3.8M' : `$${Math.round(parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.40 / 1000)}K`, status: 'Peak Demand' },
                  { type: 'Signature Sanctuary Suite', keys: '25 Keys', occ: `${config.data?.occ || '76'}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 1.04).toLocaleString()}`, rev: horizon === 'today' ? '$2.9K' : horizon === 'ytd' ? '$2.9M' : `$${Math.round(parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.30 / 1000)}K`, status: 'High Yield' },
                  { type: 'Panoramic View Suite', keys: '20 Keys', occ: `${Math.max(50, parseInt(config.data?.occ || '76') - 2)}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 0.92).toLocaleString()}`, rev: horizon === 'today' ? '$1.8K' : horizon === 'ytd' ? '$1.8M' : `$${Math.round(parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.19 / 1000)}K`, status: 'On Plan' },
                  { type: 'Glacier / Deluxe Pavilion', keys: '20 Keys', occ: `${Math.max(45, parseInt(config.data?.occ || '76') - 6)}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 0.81).toLocaleString()}`, rev: horizon === 'today' ? '$1.1K' : horizon === 'ytd' ? '$1.1M' : `$${Math.round(parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.11 / 1000)}K`, status: 'Stable' },
                ].map((tier, idx) => (
                  <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.type}</td>
                    <td className="py-2.5 px-3 text-right text-zinc-500 whitespace-nowrap">{tier.keys}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.occ}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.adr}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.rev}</td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {tier.status}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/80">
                  <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total Property Inventory</td>
                  <td className="py-3 px-3 text-right text-zinc-500">95 Keys</td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-bold">{config.data?.occ || '76'}%</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{config.data?.adr || '$2,700'}</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">
                    {horizon === 'today' ? '$9.6K' : horizon === 'ytd' ? '$9.6M' : (config.data?.rev || '$1.15M')}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-bold">Optimal</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
              <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-sm">
                <tr className="text-left text-zinc-400">
                  <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Property Collection</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Location</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Occupancy</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">ADR (USD)</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                    Revenue ({horizon === 'today' ? 'Today' : horizon.toUpperCase()})
                  </th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">RevPAR (USD)</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {dynamicPropertiesData.map((prop) => {
                  const isExpanded = !!expandedRows[prop.id];
                  return (
                    <React.Fragment key={prop.id}>
                      <tr
                        className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                        onClick={() => setExpandedRows(prev => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                      >
                        <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 whitespace-nowrap">
                          {isExpanded ? (
                            <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                          ) : (
                            <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                          )}
                          {prop.name}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-500 whitespace-nowrap">{prop.location}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.occ}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.adr}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revenue}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revpar}</td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            {prop.status}
                          </span>
                        </td>
                      </tr>
                      {isExpanded && prop.children.map((child, cIdx) => (
                        <tr key={`${prop.id}-child-${cIdx}`} className="border-b border-zinc-100/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-800/20 text-zinc-600 dark:text-zinc-400">
                          <td className="py-2 px-3 pl-8 text-[10.5px] font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{child.name}</td>
                          <td className="py-2 px-3 text-[10px] text-zinc-400 whitespace-nowrap">{child.location}</td>
                          <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.occ}</td>
                          <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.adr}</td>
                          <td className="py-2 px-3 text-right text-[10.5px] font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{child.revenue}</td>
                          <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.revpar}</td>
                          <td className="py-2 px-3 text-right text-[9.5px] text-zinc-400 whitespace-nowrap">Sanctuary Node</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
                <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/80">
                  <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total / Portfolio Average</td>
                  <td className="py-3 px-3 text-zinc-500">Global Portfolio (10 Sanctuaries)</td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-bold">{footerSummary.occ}</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.adr}</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.revenue}</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.revpar}</td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-bold">Above Target</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Actionable Key Drivers & Operational Notes */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
        <div className="font-bold text-[10px] uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-2">Key Operational Drivers</div>
        <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-4">
          {m.drivers.map((driver, idx) => (
            <li key={idx} className="leading-relaxed">{driver}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
