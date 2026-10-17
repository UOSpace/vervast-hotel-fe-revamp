import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import type { ExperienceKpiData } from '@/data/portfolio/experienceMix';
import type { PeriodId } from '@/data/portfolio';

/** Engine-derived KPI card data (see buildExperienceKpis in data/portfolio/experienceMix.ts). */
export type ExperienceKpi = Omit<ExperienceKpiData, 'tooltip' | 'vsLyPos'> & {
  tooltip?: string;
  vsLyPos?: boolean;
};

/** 5 core headline metrics. Staff readiness is covered by the Staffing, Safety & Weather card. */
export const CORE_EXPERIENCE_KPI_IDS = [
  'participation',
  'utilization',
  'fulfillment',
  'quality',
  'contribution',
];

const CARD_CLASS =
  'relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between';

export function ExperienceKpiRow({
  kpis,
  drawerTitleSuffix,
  period = 'mtd',
  propertyIds,
}: {
  kpis: ExperienceKpi[];
  drawerTitleSuffix?: string;
  period?: PeriodId;
  propertyIds?: string[];
}) {
  const { openDrawer } = useDashboardDrawer();
  const coreKpis = kpis.filter((k) => CORE_EXPERIENCE_KPI_IDS.includes(k.id));

  return (
    <div className="-mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-stretch">
      {coreKpis.map((kpi) => (
        <div
          key={kpi.id}
          className={CARD_CLASS}
          onClick={() =>
            openDrawer({
              type: 'EXPERIENCE_DETAIL',
              title: drawerTitleSuffix ? `${kpi.label} — ${drawerTitleSuffix}` : kpi.label,
              data: { key: 'EXP_HEADLINE_KPI', kpiId: kpi.id, horizon: period, propertyIds },
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            {kpi.tooltip ? (
              <InfoTooltip text={kpi.tooltip}>
                <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                  {kpi.label}
                </span>
              </InfoTooltip>
            ) : (
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate">
                {kpi.label}
              </span>
            )}
            <span
              className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                kpi.vsLyPos === false ? 'bg-[#fff1f2] text-[#800020]' : 'bg-[#ecfdf5] text-[#14532d]'
              }`}
            >
              {kpi.vsLy}
            </span>
          </div>

          <div className="text-[22px] font-normal text-zinc-900 leading-tight my-1">{kpi.value}</div>

          <div className="flex items-center gap-1 flex-wrap pt-1">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
              {kpi.sub1}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
