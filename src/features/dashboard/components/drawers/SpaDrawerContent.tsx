import { MASTER_CATEGORIES } from '@/constants/categories';
import {
  PERIOD_DEFS,
  fmtInt,
  fmtPct,
  fmtSignedPct,
  fmtUsd,
  fmtUsdFull,
  getPropertyIdsByCategory,
  type PeriodId,
} from '@/data/portfolio';
import { getSpaDashboardData } from '@/data/portfolio/spaMix';

interface SpaDrawerContentProps {
  config: {
    title?: string;
    data?: any;
  };
}

export function SpaDrawerContent({ config }: SpaDrawerContentProps) {
  const detailKey = typeof config.data === 'string' ? config.data : config.data?.key || '';
  const horizon: PeriodId = config.data?.horizon || config.data?.period || 'mtd';
  const propertyIds: string[] | undefined = config.data?.propertyIds;
  const spa = getSpaDashboardData(propertyIds, horizon);
  const periodShort = PERIOD_DEFS[horizon].label;

  const collections = MASTER_CATEGORIES.map((cat) => {
    const ids = getPropertyIdsByCategory([cat.id]);
    const props = spa.properties.filter((p) => ids.includes(p.propertyId));
    const treatments = props.reduce((a, p) => a + p.treatments, 0);
    const revenue = props.reduce((a, p) => a + p.revenue, 0);
    const hours = props.reduce((a, p) => a + p.hours, 0);
    const capacityHours = props.reduce((a, p) => a + p.capacityHours, 0);
    const therapists = props.reduce((a, p) => a + p.therapists, 0);
    const avgTreatment = treatments > 0 ? revenue / treatments : 0;
    const sharePct = spa.revenue > 0 ? (revenue / spa.revenue) * 100 : 0;
    const utilisationPct = capacityHours > 0 ? (hours / capacityHours) * 100 : 0;
    const cities = props.map((p) => p.location.split(',')[0].trim()).join(' & ');
    return {
      id: cat.id,
      name: `${cat.name} Collection`,
      cities,
      treatments,
      revenue,
      hours,
      capacityHours,
      therapists,
      avgTreatment,
      sharePct,
      utilisationPct,
    };
  }).filter((c) => c.treatments > 0 || c.revenue > 0);

  if (detailKey === 'TOTAL_TREATMENTS') {
    const serviceRevenue = spa.treatmentsRanked.reduce((a, t) => a + t.revenue, 0);
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Distribution of completed holistic spa &amp; wellness treatments ({spa.periodLabel}).
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            {fmtInt(spa.treatments)} Treatments Conducted ({periodShort})
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Treatment Name</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Category</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Treatments Conducted</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Ticket</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Rating</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Treatment Revenue</th>
              </tr>
            </thead>
            <tbody>
              {spa.treatmentsRanked.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-zinc-500">{row.categoryName}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">
                    {fmtInt(row.treatments)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                    {fmtUsdFull(row.avgTicket)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                    {row.rating.toFixed(2)} / 5.0
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                    {fmtUsd(row.revenue)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold">
                <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-100" colSpan={2}>
                  Total Treatments ({periodShort})
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400">
                  {fmtInt(spa.treatments)}
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                  {fmtUsdFull(spa.treatments > 0 ? serviceRevenue / spa.treatments : 0)}
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                  {spa.experience.score.toFixed(2)} / 5.0
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                  {fmtUsd(serviceRevenue)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'TREATMENT_REVENUE' || detailKey === 'PERFORMANCE_BY_PROPERTY') {
    const sortedProps = [...spa.properties].sort((a, b) => b.revenue - a.revenue);
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Spa &amp; wellness revenue contribution across all collections and sanctuaries ({spa.periodLabel}).
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Total Wellness Revenue: {fmtUsd(spa.revenue)} (Spa {fmtUsd(spa.spaPillarRevenue)} + Wellness {fmtUsd(spa.wellnessRevenue)})
          </span>
        </div>

        {/* Collection Summary */}
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Sanctuary Collection</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Treatments Conducted</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Average Session Rate</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">% Share</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Wellness Revenue</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    {row.name} ({row.cities})
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">
                    {fmtInt(row.treatments)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                    {fmtUsdFull(row.avgTreatment)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                    {fmtPct(row.sharePct, 1)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                    {fmtUsd(row.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 10-Property Breakdown */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-2">
            Performance by Property ({spa.propertyCount} Sanctuaries)
          </h4>
          <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Property</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Location</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Treatments</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Rate</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">YoY</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">% Share</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Wellness Revenue</th>
                </tr>
              </thead>
              <tbody>
                {sortedProps.map((p) => (
                  <tr
                    key={p.propertyId}
                    className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{p.name}</td>
                    <td className="py-2.5 px-3 text-zinc-500">{p.location}</td>
                    <td className="py-2.5 px-3 text-right text-zinc-700 dark:text-zinc-300 font-medium">
                      {fmtInt(p.treatments)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                      {fmtUsdFull(p.avgTreatment)}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-medium ${
                        p.vsLyPct >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'
                      }`}
                    >
                      {fmtSignedPct(p.vsLyPct)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                      {fmtPct(p.sharePct, 1)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                      {fmtUsd(p.revenue)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold">
                  <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-100" colSpan={2}>
                    Total Portfolio ({periodShort})
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                    {fmtInt(spa.treatments)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                    {fmtUsdFull(spa.avgRevenuePerTreatment)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400">
                    {fmtSignedPct(spa.vsLyPct)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">100.0%</td>
                  <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                    {fmtUsd(spa.revenue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (detailKey === 'AVERAGE_REVENUE' || detailKey === 'AVG_REVENUE') {
    const sortedCollections = [...collections].sort((a, b) => b.avgTreatment - a.avgTreatment);
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Average realized revenue per spa treatment session by collection ({spa.periodLabel}).
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Average Realized: {fmtUsdFull(spa.avgRevenuePerTreatment)}
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Collection</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Treatments</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Standard Off-Peak</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Weekend Peak</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Average Realized Rate</th>
              </tr>
            </thead>
            <tbody>
              {sortedCollections.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{fmtInt(row.treatments)}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{fmtUsdFull(row.avgTreatment * 0.92)}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                    {fmtUsdFull(row.avgTreatment * 1.1)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                    {fmtUsdFull(row.avgTreatment)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold">
                <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-100">Portfolio Average ({periodShort})</td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">{fmtInt(spa.treatments)}</td>
                <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                  {fmtUsdFull(spa.avgRevenuePerTreatment * 0.92)}
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                  {fmtUsdFull(spa.avgRevenuePerTreatment * 1.1)}
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400">
                  {fmtUsdFull(spa.avgRevenuePerTreatment)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (
    detailKey === 'SPA_UTILIZATION' ||
    detailKey === 'UTILIZATION_BY_TIME' ||
    detailKey === 'UTILIZATION_OVER_TIME'
  ) {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Utilization capacity rates across specialized sanctuary spa zones and operating blocks ({spa.periodLabel}).
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Portfolio Avg: {fmtPct(spa.utilisationPct, 1)} ({fmtInt(spa.hours)} / {fmtInt(spa.capacityHours)} hrs)
          </span>
        </div>

        {/* Spa Zone Table */}
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Spa Zone</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Capacity (Hours/Day)</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">
                  Total Capacity ({periodShort})
                </th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">
                  Utilized Hours ({periodShort})
                </th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Utilization Rate</th>
              </tr>
            </thead>
            <tbody>
              {spa.areas.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{fmtInt(row.capacityPerDay)} hrs/day</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{fmtInt(row.capacityHours)} hrs</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                    {fmtInt(row.utilisedHours)} hrs
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                    {fmtPct(row.utilisationPct, 0)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold">
                <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-100">Total Spa Capacity</td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                  {fmtInt(spa.areas.reduce((a, r) => a + r.capacityPerDay, 0))} hrs/day
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                  {fmtInt(spa.capacityHours)} hrs
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">{fmtInt(spa.hours)} hrs</td>
                <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400">
                  {fmtPct(spa.utilisationPct, 1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Operating Block Distribution */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-2">
            Operating Time-of-Day Demand Distribution
          </h4>
          <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Operating Block</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Treatments ({periodShort})</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Volume Share</th>
                </tr>
              </thead>
              <tbody>
                {spa.heatmap.blocks.map((b) => (
                  <tr
                    key={b.label}
                    className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{b.window}</td>
                    <td className="py-2.5 px-3 text-right text-zinc-700 dark:text-zinc-300">
                      {fmtInt(Math.round((spa.treatments * b.sharePct) / 100))}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                      {fmtPct(b.sharePct, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (detailKey === 'THERAPIST_HOURS') {
    const sortedByHours = [...spa.properties].sort((a, b) => b.hours - a.hours);
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Therapist master roster efficiency, billable hours, and revenue generation ({spa.periodLabel}).
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            {spa.therapists} Roster Therapists · {fmtInt(spa.hours)} Billable Hours ({fmtPct(spa.utilisationPct, 1)})
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Sanctuary Property</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Therapist Roster</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Treatments</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Hours Clocked / Cap</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Utilization</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Wellness Revenue</th>
              </tr>
            </thead>
            <tbody>
              {sortedByHours.map((row) => (
                <tr
                  key={row.propertyId}
                  className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.therapists} Masters</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">
                    {fmtInt(row.treatments)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">
                    {fmtInt(row.hours)}h / {fmtInt(row.capacityHours)}h
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                    {fmtPct(row.utilisationPct, 1)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                    {fmtUsd(row.revenue)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold">
                <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-100">Total Portfolio ({periodShort})</td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">{spa.therapists} Masters</td>
                <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400">
                  {fmtInt(spa.treatments)}
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                  {fmtInt(spa.hours)}h / {fmtInt(spa.capacityHours)}h
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400">
                  {fmtPct(spa.utilisationPct, 1)}
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">{fmtUsd(spa.revenue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'RETAIL_REVENUE') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Wellness retail boutique performance and signature product turnover ({spa.periodLabel}).
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Total Retail Rev: {fmtUsd(spa.retail.revenue)} ({fmtPct(spa.retail.sharePct, 1)} of Spa &amp; Wellness)
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Signature Product</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Units Sold</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">% Share</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Retail Revenue</th>
              </tr>
            </thead>
            <tbody>
              {spa.retail.products.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">
                    {fmtInt(row.units)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">${row.unitPrice.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                    {fmtPct(row.sharePct, 1)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                    {fmtUsd(row.revenue)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold">
                <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-100">Total Retail Boutique ({periodShort})</td>
                <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400">
                  {fmtInt(spa.retail.units)}
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-500">—</td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">100.0%</td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                  {fmtUsd(spa.retail.revenue)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'MEMBERSHIP_REPORT') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Wellness membership and sanctuary retreat packages sales analysis ({spa.periodLabel}).
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            {fmtUsd(spa.packages.revenue)} Total Package Sales · {fmtInt(spa.packages.activeMembers)} Active Members
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Membership Tier &amp; Package</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Bundled Sessions</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Active Patrons</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">
                  {periodShort} Packages Sold
                </th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Package Price</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Wellness Revenue</th>
              </tr>
            </thead>
            <tbody>
              {spa.packages.tiers.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.sessions} Sessions</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                    {fmtInt(row.activeMembers)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">
                    +{fmtInt(row.sold)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{fmtUsdFull(row.price)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                    {fmtUsd(row.revenue)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold">
                <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-100" colSpan={2}>
                  Total Membership &amp; Packages ({periodShort})
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                  {fmtInt(spa.packages.activeMembers)}
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400">
                  +{fmtInt(spa.packages.sold)}
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-500">—</td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                  {fmtUsd(spa.packages.revenue)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'TOP_TREATMENTS_DETAIL' || detailKey === 'TOP_TREATMENTS') {
    const top10 = spa.treatmentsRanked.slice(0, 10);
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Top performing spa &amp; wellness treatments ranked by volume and total yield ({spa.periodLabel}).
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Top {top10.length} Rankings ({fmtInt(spa.treatments)} Total Sessions)
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Rank</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Treatment Name</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Category</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Sessions</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Rating</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Ticket</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Wellness Revenue</th>
              </tr>
            </thead>
            <tbody>
              {top10.map((row, idx) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-bold text-zinc-400">#{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-zinc-500">{row.categoryName}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">
                    {fmtInt(row.treatments)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                    {row.rating.toFixed(2)} / 5
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{fmtUsdFull(row.avgTicket)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                    {fmtUsd(row.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'REVENUE_BY_CATEGORY') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Spa &amp; wellness revenue breakdown by category ({spa.periodLabel}).
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Total Wellness Revenue: {fmtUsd(spa.revenue)}
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Wellness Category</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Sessions / Units</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Therapist Hours</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Wellness Revenue Share</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Ticket</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Wellness Revenue</th>
              </tr>
            </thead>
            <tbody>
              {spa.categories.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">
                    {row.kind === 'retail' ? `${fmtInt(spa.retail.units)} units` : fmtInt(row.treatments)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">
                    {row.kind === 'retail' ? '—' : `${fmtInt(row.hours)}h`}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                    {fmtPct(row.revenueSharePct, 1)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">
                    {row.kind === 'retail' ? '—' : fmtUsdFull(row.avgTicket)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                    {fmtUsd(row.revenue)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold">
                <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-100">Total Spa &amp; Wellness ({periodShort})</td>
                <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400">
                  {fmtInt(spa.treatments)}
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">{fmtInt(spa.hours)}h</td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">100.0%</td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                  {fmtUsdFull(spa.avgRevenuePerTreatment)}
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">{fmtUsd(spa.revenue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'SCHEDULE_OVERVIEW') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Appointment pipeline and fulfillment status across all sanctuaries ({spa.periodLabel}).
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            {fmtInt(spa.pipeline.total)} Total Appointments ({periodShort})
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Pipeline Stage</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Appointments</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">% of Booked</th>
              </tr>
            </thead>
            <tbody>
              {spa.pipeline.rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{r.name}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                    {fmtInt(r.value)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                    {fmtPct((r.value / Math.max(1, spa.pipeline.total)) * 100, 1)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold">
                <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-100">Total Booked Appointments</td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">
                  {fmtInt(spa.pipeline.total)}
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">100.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'UPCOMING_PEAK_TIMES') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Forecasted high-demand wellness periods with therapist master availability.
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Booking Forecast · {spa.therapists} Roster Therapists
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Date</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Peak Window</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Demand Level</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Projected Util</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Therapists Required</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Pre-Booked</th>
              </tr>
            </thead>
            <tbody>
              {spa.peaks.map((row) => (
                <tr
                  key={row.dateLabel}
                  className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.dateLabel}</td>
                  <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-300">{row.window}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        row.level === 'HIGH'
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                      }`}
                    >
                      {row.level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-700 dark:text-zinc-300 font-medium">
                    {fmtPct(row.projectedUtilisationPct, 0)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">
                    {row.therapistsRequired} / {row.roster}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                    {fmtPct(row.preBookedPct, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'GUEST_WELLNESS_INSIGHTS' || detailKey === 'WELLNESS_EXPERIENCE_INDEX') {
    return (
      <div className="space-y-5 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Spa &amp; wellness guest attachment, satisfaction index, and 90-day forward coverage ({spa.periodLabel}).
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Experience Score: {spa.experience.score.toFixed(2)} / 5.0
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Resort Stay Attachment</div>
            <div className="text-lg font-bold text-zinc-900 mt-1">{fmtPct(spa.attachmentPct, 1)}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              {fmtInt(spa.spaGuests)} spa guests / {fmtInt(spa.stays)} stays
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Treatments / 100 RN</div>
            <div className="text-lg font-bold text-zinc-900 mt-1">{spa.treatmentsPer100RoomNights.toFixed(1)}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              {fmtUsdFull(spa.revenuePerRoomNight)} Spa Rev / RN
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Peak Operating Window</div>
            <div className="text-lg font-bold text-zinc-900 mt-1">{spa.heatmap.peakBlockLabel}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              {spa.heatmap.peakBlockWindow} ({fmtPct(spa.heatmap.peakBlockSharePct, 0)} volume)
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">90D Forward OTB</div>
            <div className="text-lg font-bold text-zinc-900 mt-1">{fmtUsd(spa.forwardCoverage.otbRevenue)}</div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
              {fmtPct(spa.forwardCoverage.coveragePct, 1)} of {fmtUsd(spa.forwardCoverage.forecastRevenue)} forecast
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Experience Dimension</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Guest Rating</th>
              </tr>
            </thead>
            <tbody>
              {spa.experience.subs.map((sub) => (
                <tr key={sub.id} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{sub.label}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                    {sub.value.toFixed(2)} / 5.0
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'WELLNESS_REVENUE_BY_REGION') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Spa &amp; wellness revenue, treatment volume, and YoY growth across global regions ({spa.periodLabel}).
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Total Wellness Revenue: {fmtUsd(spa.revenue)} ({fmtSignedPct(spa.vsLyPct, 1)} vs LY)
          </span>
        </div>

        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Region</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Properties</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Treatments</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Wellness Revenue</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Share</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">YoY Growth</th>
              </tr>
            </thead>
            <tbody>
              {spa.regions.map((reg) => (
                <tr
                  key={reg.id}
                  className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{reg.name}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{reg.propertyCount}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-700 dark:text-zinc-300 font-medium">
                    {fmtInt(reg.treatments)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                    {fmtUsd(reg.revenue)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">
                    {fmtPct(reg.sharePct, 1)}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-right font-medium ${
                      reg.vsLyPct >= 0 ? 'text-[#14532d]' : 'text-[#800020]'
                    }`}
                  >
                    {fmtSignedPct(reg.vsLyPct, 1)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold">
                <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-100">Total Portfolio ({periodShort})</td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">{spa.propertyCount}</td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">{fmtInt(spa.treatments)}</td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">{fmtUsd(spa.revenue)}</td>
                <td className="py-2.5 px-3 text-right text-zinc-900 dark:text-zinc-100">100.0%</td>
                <td className="py-2.5 px-3 text-right text-[#14532d]">{fmtSignedPct(spa.vsLyPct, 1)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="text-xs text-zinc-500 italic p-4 text-center">
      Detailed statistics and operational metrics available for {config.title || 'Wellness & Spa'}.
    </div>
  );
}
