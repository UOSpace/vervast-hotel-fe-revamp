import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCompactCurrency } from '@/utils/formatCurrency';
import { LEADS } from '../data/leads';
import { BOOKINGS } from '../data/bookings';
import { parseMoney, matchHotel, SANCTUARY_HOTELS } from '../utils/reservationEvents';
import {
  ReservationDashboardHeader,
  ReservationKpiStrip,
  type KpiItem,
} from '../components/ReservationDashboardShared';
import { PipelineSalesTrendChart } from '../components/charts/PipelineSalesTrendChart';
import { RevenueBreakdownPinChart } from '../components/charts/RevenueBreakdownPinChart';
import { LeadSourceDonutChart } from '../components/charts/LeadSourceDonutChart';

const CARD = 'relative py-2 flex flex-col justify-between h-full animate-card-enter';
const TITLE = 'text-[10px] font-bold uppercase tracking-widest text-zinc-900 h-4 mb-3';
const TH = 'py-2 font-medium text-[9.5px] text-zinc-400';

const OPEN_STAGES = [
  { id: 'prospect', label: 'Prospect' },
  { id: 'verbal-definite', label: 'Verbal Definite' },
  { id: 'tentative', label: 'Tentative' },
  { id: 'definite', label: 'Definite' },
];
const LOST_STAGES = ['turned-down', 'cancelled', 'postponed'];

const probability = (raw: string) => (parseFloat(raw) || 0) / 100;

export function ReservationOverviewPage() {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState('all');

  // Filter leads and bookings with robust matchHotel
  const leads = useMemo(() => LEADS.filter((l) => matchHotel(l.hotel, hotel)), [hotel]);
  const bookings = useMemo(() => BOOKINGS.filter((b) => matchHotel(b.hotel, hotel)), [hotel]);

  const stats = useMemo(() => {
    const val = (l: (typeof LEADS)[number]) => parseMoney(l.totalValue);
    const openLeads = leads.filter((l) => l.stage !== 'definite' && !LOST_STAGES.includes(l.stage));
    const won = leads.filter((l) => l.stage === 'definite');
    const lost = leads.filter((l) => LOST_STAGES.includes(l.stage));
    const pipeline = openLeads.reduce((s, l) => s + val(l), 0);
    const weighted = openLeads.reduce((s, l) => s + val(l) * probability(l.conversionProbability), 0);
    const closed = won.length + lost.length;
    const winRate = closed ? Math.round((won.length / closed) * 100) : 0;
    const live = bookings.filter((b) => b.bookingStatus !== 'Cancelled');
    const bookingRevenue = live.reduce((s, b) => s + parseMoney(b.revenue), 0);

    const stages = OPEN_STAGES.map((s) => {
      const list = leads.filter((l) => l.stage === s.id);
      return { ...s, count: list.length, value: list.reduce((a, l) => a + val(l), 0) };
    });
    const lostList = leads.filter((l) => LOST_STAGES.includes(l.stage));
    const lostSummary = { count: lostList.length, value: lostList.reduce((a, l) => a + val(l), 0) };

    const statuses = (['Confirmed', 'In House', 'Departed', 'Cancelled'] as const).map((s) => {
      const list = bookings.filter((b) => b.bookingStatus === s);
      return {
        name: s,
        count: list.length,
        revenue: list.reduce((a, b) => a + parseMoney(b.revenue), 0),
        nights: list.reduce((a, b) => a + b.nights, 0),
      };
    });

    const owners = Array.from(new Set([...leads.map((l) => l.owner), ...bookings.map((b) => b.bookingOwner)]))
      .map((name) => {
        const ol = leads.filter((l) => l.owner === name);
        const ob = bookings.filter((b) => b.bookingOwner === name && b.bookingStatus !== 'Cancelled');
        return {
          name,
          leads: ol.length,
          pipeline: ol
            .filter((l) => l.stage !== 'definite' && !LOST_STAGES.includes(l.stage))
            .reduce((a, l) => a + val(l), 0),
          bookings: ob.length,
          revenue: ob.reduce((a, b) => a + parseMoney(b.revenue), 0),
        };
      })
      .sort((a, b) => b.pipeline + b.revenue - (a.pipeline + a.revenue));

    const closing = [...openLeads]
      .sort((a, b) => new Date(a.expectedClose).getTime() - new Date(b.expectedClose).getTime())
      .slice(0, 5);

    return {
      openLeads,
      won,
      lost,
      pipeline,
      weighted,
      winRate,
      live,
      bookingRevenue,
      stages,
      lostSummary,
      statuses,
      owners,
      closing,
    };
  }, [leads, bookings]);

  const kpis: KpiItem[] = [
    {
      label: 'Open Pipeline',
      value: formatCompactCurrency(stats.pipeline),
      hint: `${stats.openLeads.length} active leads across pipeline`,
      tone: 'positive',
    },
    {
      label: 'Weighted Forecast',
      value: formatCompactCurrency(stats.weighted),
      hint: 'Value adjusted by close probability',
    },
    {
      label: 'Win Rate',
      value: `${stats.winRate}%`,
      hint: `${stats.won.length} won vs ${stats.lost.length} lost`,
      tone: stats.winRate >= 40 ? 'positive' : 'negative',
    },
    {
      label: 'Active Bookings',
      value: String(stats.live.length),
      hint: `${stats.live.reduce((s, b) => s + b.nights, 0)} total room nights OTB`,
    },
    {
      label: 'Booking Revenue',
      value: formatCompactCurrency(stats.bookingRevenue),
      hint: 'Confirmed, in house & completed',
      tone: 'positive',
    },
  ];

  // Property level comparison rows
  const propertyRows = useMemo(() => {
    return SANCTUARY_HOTELS.map((hotelName) => {
      const pl = LEADS.filter((l) => matchHotel(l.hotel, hotelName));
      const pb = BOOKINGS.filter((b) => matchHotel(b.hotel, hotelName) && b.bookingStatus !== 'Cancelled');
      return {
        name: hotelName,
        leads: pl.length,
        pipeline: pl
          .filter((l) => l.stage !== 'definite' && !LOST_STAGES.includes(l.stage))
          .reduce((s, l) => s + parseMoney(l.totalValue), 0),
        bookings: pb.length,
        nights: pb.reduce((s, b) => s + b.nights, 0),
        revenue: pb.reduce((s, b) => s + parseMoney(b.revenue), 0),
      };
    });
  }, []);

  const maxRevenue = Math.max(1, ...propertyRows.map((r) => r.revenue));

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col pt-4 lg:pt-6 pb-8">
      {/* Top Header with Property Filter */}
      <ReservationDashboardHeader
        title="Reservation Overview"
        subtitle="Real-time pipeline analytics from leads and bookings"
        hotel={hotel}
        onHotelChange={setHotel}
      />

      <div className="flex flex-col gap-8 lg:gap-10">
        {/* KPI Strip */}
        <section aria-label="Key Performance Indicators">
          <ReservationKpiStrip items={kpis} />
        </section>

        {/* Row 1: Sales Trend + Revenue Breakdown + Lead Source & Channel Mix (SEJAJAR SATU BARIS 4-4-4) */}
        <section aria-label="Sales and Revenue Analytics" className="grid grid-cols-12 gap-6 px-4 lg:px-6 items-stretch">
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <PipelineSalesTrendChart leads={leads} bookings={bookings} hotel={hotel} />
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <RevenueBreakdownPinChart leads={leads} bookings={bookings} />
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <LeadSourceDonutChart leads={leads} />
          </div>
        </section>

        {/* Row 2: Upcoming Closing Opportunities + Booking Portfolio Status + Reservation Team Performance (SEJAJAR 4 COLS MASING-MASING) */}
        <section aria-label="Operational Pipelines and Status" className="grid grid-cols-12 gap-6 px-4 lg:px-6 items-stretch">
          {/* 1. Upcoming Closing Opportunities (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <div className={CARD}>
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className={TITLE}>Upcoming Closing</h3>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/reservations/leads')}
                  className="text-[9.5px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
                >
                  View All →
                </button>
              </div>

              <div className="overflow-x-auto flex-1 flex flex-col justify-between">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      <th className={TH}>Lead</th>
                      <th className={TH}>Stage</th>
                      <th className={`${TH} text-right`}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.closing.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-[10px] text-zinc-400">
                          No open leads pending close
                        </td>
                      </tr>
                    ) : (
                      stats.closing.slice(0, 5).map((l) => (
                        <tr
                          key={l.id}
                          onClick={() => navigate(`/dashboard/reservations/leads/${l.id}`)}
                          className="border-b border-zinc-50 last:border-b-0 hover:bg-zinc-50/80 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5 pr-2 text-[10px] font-medium text-zinc-800 max-w-[120px] truncate" title={l.leadName}>
                            {l.leadName}
                          </td>
                          <td className="py-2.5 pr-2">
                            <span className="text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 capitalize whitespace-nowrap">
                              {l.stage.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="py-2.5 text-[10px] font-medium text-zinc-900 text-right whitespace-nowrap">
                            {l.totalValue}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 2. Booking Portfolio Status (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <div className={CARD}>
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className={TITLE}>Booking Portfolio Status</h3>
                <span className="text-[9.5px] font-medium text-zinc-400">{bookings.length} total</span>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1 items-stretch">
                {stats.statuses.map((s) => {
                  const isLost = s.name === 'Cancelled';
                  return (
                    <div
                      key={s.name}
                      onClick={() => navigate('/dashboard/reservations/bookings')}
                      className="py-1.5 px-0.5 transition-colors cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-700">
                          {s.name}
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${isLost ? 'bg-[#800020]' : 'bg-zinc-900'}`} />
                      </div>
                      <div className="my-1">
                        <span className="text-[16px] font-normal text-zinc-900 leading-tight">
                          {formatCompactCurrency(s.revenue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[8.5px] text-zinc-400">
                        <span>{s.count} bkg</span>
                        <span>{s.nights} nts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Reservation Team Performance (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <div className={CARD}>
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className={TITLE}>Reservation Team</h3>
                <span className="text-[9.5px] font-medium text-zinc-400">Pipeline & Rev</span>
              </div>

              <div className="overflow-x-auto flex-1 flex flex-col justify-between">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      <th className={TH}>Owner</th>
                      <th className={`${TH} text-right`}>Leads</th>
                      <th className={`${TH} text-right`}>Pipeline</th>
                      <th className={`${TH} text-right`}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.owners.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-[10px] text-zinc-400">
                          No owner records
                        </td>
                      </tr>
                    ) : (
                      stats.owners.slice(0, 5).map((o) => (
                        <tr key={o.name} className="border-b border-zinc-50 last:border-b-0 hover:bg-zinc-50/60 transition-colors">
                          <td className="py-2.5 text-[10px] font-medium text-zinc-700 truncate max-w-[85px]" title={o.name}>
                            {o.name}
                          </td>
                          <td className="py-2.5 text-[10px] font-medium text-zinc-900 text-right">{o.leads}</td>
                          <td className="py-2.5 text-[10px] font-medium text-zinc-900 text-right">
                            {formatCompactCurrency(o.pipeline)}
                          </td>
                          <td className="py-2.5 text-[10px] font-medium text-zinc-900 text-right">
                            {formatCompactCurrency(o.revenue)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Row 4: Property Level Overview (When viewing all properties) */}
        {hotel === 'all' && (
          <section aria-label="Property Level Overview" className="px-4 lg:px-6 pt-2 pb-6">
            <div className={CARD}>
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div>
                  <h3 className={TITLE}>Property Level Overview</h3>
                  <p className="text-[9.5px] text-zinc-500 font-medium -mt-2">
                    Click any property to focus on its leads, pipeline and booking performance
                  </p>
                </div>
                <span className="text-[9.5px] font-medium text-zinc-400">9 Luxury Properties</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      <th className={TH}>Property</th>
                      <th className={`${TH} text-right`}>Leads</th>
                      <th className={`${TH} text-right`}>Open Pipeline</th>
                      <th className={`${TH} text-right`}>Bookings</th>
                      <th className={`${TH} text-right`}>Room Nights</th>
                      <th className={`${TH} pl-4 w-[28%]`}>Booking Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyRows.map((r) => (
                      <tr
                        key={r.name}
                        onClick={() => setHotel(r.name)}
                        className="border-b border-zinc-50 last:border-b-0 hover:bg-zinc-50/80 cursor-pointer transition-colors group"
                      >
                        <td className="py-2.5 text-[10px] font-medium text-zinc-800 group-hover:text-zinc-950 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-zinc-900 transition-colors" />
                          <span>{r.name}</span>
                        </td>
                        <td className="py-2.5 text-[10px] font-medium text-zinc-900 text-right">{r.leads}</td>
                        <td className="py-2.5 text-[10px] font-medium text-zinc-900 text-right">
                          {formatCompactCurrency(r.pipeline)}
                        </td>
                        <td className="py-2.5 text-[10px] font-medium text-zinc-900 text-right">{r.bookings}</td>
                        <td className="py-2.5 text-[10px] font-medium text-zinc-900 text-right">{r.nights}</td>
                        <td className="py-2.5 pl-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-zinc-800 rounded-full transition-all duration-500"
                                style={{ width: `${(r.revenue / maxRevenue) * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-medium text-zinc-900 w-14 text-right">
                              {formatCompactCurrency(r.revenue)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
