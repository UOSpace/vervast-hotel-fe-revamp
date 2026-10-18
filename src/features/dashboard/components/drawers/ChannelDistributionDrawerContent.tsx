import { useState, useEffect } from 'react';
import { useDashboardDrawer } from '../../context/DashboardDrawerContext';
import {
  getPortfolioMetrics,
  PERIOD_DEFS,
  fmtUsd,
  fmtSignedPct,
  type PeriodId,
} from '@/data/portfolio';
import { splitMarkets, type MarketDef } from '@/data/portfolio/hospitalityMix';

interface ChannelRow {
  channel: string;
  rnights: string;
  adr: string;
  revenue: string;
  isTotal?: boolean;
}

const CHANNEL_DEFS: MarketDef[] = [
  { id: 'direct', name: 'Direct', rnShare: 38, adrIndex: 1.05, yoyOffsetPts: 1.4 },
  { id: 'own-web', name: 'Own Web', rnShare: 24, adrIndex: 1.02, yoyOffsetPts: 3.6 },
  { id: 'consortia', name: 'Consortia', rnShare: 20, adrIndex: 1.08, yoyOffsetPts: 0.4 },
  { id: 'ota', name: 'OTA', rnShare: 14, adrIndex: 0.88, yoyOffsetPts: -4.2 },
  { id: 'others', name: 'Others', rnShare: 4, adrIndex: 0.78, yoyOffsetPts: -6.0 },
];

const channelMeta: Record<string, { yoy: string; fee: string; profile: string }> = {
  Direct: {
    yoy: '↑ +15%',
    fee: '0% commission',
    profile: 'High-touch private concierge & phone bookings with maximum net profit margin',
  },
  OTA: {
    yoy: '↑ +6%',
    fee: '15–18% standard fee',
    profile: 'Broad global reach and filler demand via Booking.com & Expedia luxury tiers',
  },
  Consortia: {
    yoy: '↑ +11%',
    fee: '10% elite amenity fee',
    profile: 'Virtuoso, American Express FHR & luxury travel agency partnerships',
  },
  'Own Web': {
    yoy: '↑ +18%',
    fee: '0% commission',
    profile: 'Official brand portal & proprietary mobile app bookings with direct guest relationship',
  },
  Others: {
    yoy: '↑ +4%',
    fee: 'Contracted rates',
    profile: 'Specialty wholesale contracts, partner buyouts & seasonal allocations',
  },
};

interface ChannelDistributionDrawerContentProps {
  config?: {
    title?: string;
    data?: any;
  };
}

export function ChannelDistributionDrawerContent(
  props: ChannelDistributionDrawerContentProps
) {
  const drawerCtx = useDashboardDrawer();
  const config = props.config ?? drawerCtx.config;

  const initialPeriod: PeriodId =
    (config?.data && !Array.isArray(config.data) && (config.data.period || config.data.horizon)) ||
    'mtd';
  const [period, setPeriod] = useState<PeriodId>(initialPeriod);

  useEffect(() => {
    const nextPeriod =
      config?.data && !Array.isArray(config.data) && (config.data.period || config.data.horizon);
    if (nextPeriod === 'today' || nextPeriod === 'mtd' || nextPeriod === 'ytd') {
      setPeriod(nextPeriod);
    }
  }, [config?.data]);

  const periodDef = PERIOD_DEFS[period];
  const pm = getPortfolioMetrics(undefined, period);
  const splitRows = splitMarkets(pm, CHANNEL_DEFS);
  const defaultChannelData: ChannelRow[] = [
    ...splitRows.map((r) => ({
      channel: r.def.name,
      rnights: `${Math.round(r.roomNightsSharePct)}%`,
      adr: fmtUsd(r.adr),
      revenue: fmtUsd(r.roomRevenue),
    })),
    {
      channel: 'Total',
      rnights: '100%',
      adr: fmtUsd(pm.adr),
      revenue: fmtUsd(pm.roomRevenue),
      isTotal: true,
    },
  ];

  const isCustomArray = Array.isArray(config?.data) && config.data.length > 0;
  const rawData: ChannelRow[] = isCustomArray ? config.data : defaultChannelData;

  const totalRow =
    rawData.find((r) => r.isTotal || r.channel.toLowerCase() === 'total') ||
    rawData[rawData.length - 1];
  const items = rawData.filter((r) => !r.isTotal && r.channel.toLowerCase() !== 'total');

  const sortedByRevenue = [...items].sort((a, b) => {
    const numA = parseFloat(a.revenue.replace(/[^0-9.]/g, '')) || 0;
    const numB = parseFloat(b.revenue.replace(/[^0-9.]/g, '')) || 0;
    return numB - numA;
  });

  const sortedByAdr = [...items].sort((a, b) => {
    const numA = parseFloat(a.adr.replace(/[^0-9.]/g, '')) || 0;
    const numB = parseFloat(b.adr.replace(/[^0-9.]/g, '')) || 0;
    return numB - numA;
  });

  const volumeLeader = sortedByRevenue[0] || items[0];
  const highestAdr = sortedByAdr[0] || items[0];
  const directWeb = items.find((i) => i.channel === 'Own Web') || items[1] || items[0];
  const otaChannel = items.find((i) => i.channel === 'OTA') || items[2] || items[0];

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Distribution Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Channel Economics
            </span>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mt-1">
            Channel Distribution &amp; ({periodDef.label})
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Booking channel volume, net ADR yield, and commission economics across channels · As of:{' '}
            <span className="font-semibold text-zinc-700">{periodDef.periodLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {!isCustomArray && (
            <div className="inline-flex items-center p-0.5 bg-zinc-200/70 rounded-lg shrink-0">
              {(['today', 'mtd', 'ytd'] as const).map((h) => {
                const isActive = period === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setPeriod(h)}
                    className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
                    }`}
                  >
                    {h === 'today' ? 'Yesterday' : h.toUpperCase()}
                  </button>
                );
              })}
            </div>
          )}

          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Total Room Revenue ({periodDef.label})
            </div>
            <div className="text-lg font-bold text-zinc-900">
              {totalRow?.revenue || fmtUsd(pm.roomRevenue)}
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Hero KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            title: 'Top Booking Channel',
            value: volumeLeader.rnights,
            name: volumeLeader.channel,
            sub: `${volumeLeader.revenue} · 0% Commission`,
            tone: 'text-emerald-700',
          },
          {
            title: 'Highest ADR Realization',
            value: highestAdr.adr,
            name: highestAdr.channel,
            sub: `${highestAdr.rnights} Share · Peak Rate`,
            tone: 'text-emerald-700',
          },
          {
            title: 'Proprietary Digital Web',
            value: directWeb.rnights,
            name: directWeb.channel,
            sub: `${directWeb.revenue} · ${directWeb.adr} ADR`,
            tone: 'text-emerald-700',
          },
          {
            title: 'Third-Party OTA Reach',
            value: otaChannel.rnights,
            name: otaChannel.channel,
            sub: `${otaChannel.revenue} · 15–18% Fee`,
            tone: 'text-zinc-600',
          },
        ].map((c) => (
          <div
            key={c.title}
            className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between gap-3"
          >
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
              {c.title}
            </span>
            <div>
              <div className="text-xl font-bold text-zinc-900 leading-tight">{c.value}</div>
              <div className="text-[11px] font-normal text-zinc-600 mt-0.5">{c.name}</div>
              <div className={`text-[10px] font-medium mt-1 ${c.tone}`}>{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Channel Breakdown Table */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/70">
          <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Channel Economics &amp; Pricing Yield Performance ({periodDef.label})
          </h5>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Detailed breakdown of room night contribution, ADR realization, and distribution fees
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Distribution Channel</th>
                <th className="py-2.5 px-4 text-right">Room Nights Share</th>
                <th className="py-2.5 px-4 text-right">ADR (USD)</th>
                <th className="py-2.5 px-4 text-right">Room Revenue</th>
                <th className="py-2.5 px-4 text-right">YoY Pace</th>
                <th className="py-2.5 px-4">Commission &amp; Terms</th>
                <th className="py-2.5 px-4">Channel Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {items.map((row) => {
                const meta = channelMeta[row.channel] || {
                  yoy: '↑ +8%',
                  fee: 'Contracted rates',
                  profile: 'General reservation source',
                };

                return (
                  <tr key={row.channel} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-zinc-900">{row.channel}</td>
                    <td className="py-3 px-4 text-right font-medium text-zinc-700">{row.rnights}</td>
                    <td className="py-3 px-4 text-right font-medium text-zinc-700">{row.adr}</td>
                    <td className="py-3 px-4 text-right font-bold text-zinc-900">{row.revenue}</td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-700">{meta.yoy}</td>
                    <td className="py-3 px-4 text-zinc-600 font-medium text-[11px]">{meta.fee}</td>
                    <td className="py-3 px-4 text-zinc-500 text-[11px] max-w-[240px] truncate">
                      {meta.profile}
                    </td>
                  </tr>
                );
              })}

              {/* Total Row */}
              {totalRow && (
                <tr className="bg-zinc-50 font-bold border-t border-zinc-200">
                  <td className="py-3 px-4 text-zinc-900">Total Portfolio</td>
                  <td className="py-3 px-4 text-right text-zinc-900">{totalRow.rnights}</td>
                  <td className="py-3 px-4 text-right text-zinc-900">{totalRow.adr}</td>
                  <td className="py-3 px-4 text-right text-zinc-900">{totalRow.revenue}</td>
                  <td className="py-3 px-4 text-right text-emerald-700">
                    ↑ {fmtSignedPct(pm.vsLy.roomRevenuePct)}
                  </td>
                  <td className="py-3 px-4 text-zinc-600 text-[11px]" colSpan={2}>
                    Net Realized Portfolio Distribution
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
