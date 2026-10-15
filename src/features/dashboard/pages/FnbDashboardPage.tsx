import { Heart, Settings, Star, Cup, WineglassTriangle } from '@solar-icons/react';
import {
  DashboardShell, DashboardHeader, KpiGrid, Row, Card, TrendCard, DonutCard, ListCard, PrinciplesCard,
  fnbRevenueOverTime, revenueByOutlet, topPerformingOutlets, fnbMixBreakdown,
  heatmapOutlets, heatmapTimes, heatmapData,
} from '../components/widgets/fnb/FnbExperienceShared';

const heatBg = (v: number) => {
  if (v === 1) return 'bg-zinc-100';
  if (v === 2) return 'bg-zinc-200';
  if (v === 3) return 'bg-zinc-400';
  if (v === 4) return 'bg-zinc-600';
  return 'bg-zinc-900';
};

export function FnbDashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        eyebrow="F&B Intelligence"
        title="Welcome to SOSEI F&B"
        subtitle="Crafted cuisine. Refined service. Measurable performance."
        showPos
      />

      <KpiGrid
        items={[
          { label: 'TOTAL F&B REVENUE (USD)', value: '$512,450' },
          { label: 'TOTAL COVERS', value: '4,450' },
          { label: 'AVG SPEND PER COVER', value: '$115' },
          { label: 'TOP OUTLET', value: 'Seascape' },
          { label: 'ACTIVE OUTLETS', value: '6' },
          { label: 'GUEST SATISFACTION', value: '4.7 / 5' },
        ]}
      />

      <Row cols={4} delay="0.2s">
        <TrendCard title="F&B Revenue Over Time" drawerData="F&B Trend" last="May 31: $16.4k" data={fnbRevenueOverTime} />

        <ListCard
          title="Revenue by Outlet"
          drawerData="Outlets"
          gap="gap-1.5"
          textSize="text-[9.5px]"
          rows={revenueByOutlet.slice(0, 5).map((o) => ({
            key: o.name,
            label: <span className="text-zinc-700 font-medium">{o.name}</span>,
            value: `$${(o.value / 1000).toFixed(1)}k`,
          }))}
        />

        <Card title="Top Performing Outlets" drawerTitle="Top Performing Outlets" drawerData="Outlet Covers">
          <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
            {topPerformingOutlets.map((o) => (
              <div key={o.name} className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-600 w-28 truncate">{o.name}</span>
                <div className="flex-1 mx-2 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${(o.value / o.total) * 100}%` }} />
                </div>
                <span className="font-bold text-zinc-900 w-8 text-right">{o.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <DonutCard
          title="F&B Mix Breakdown"
          drawerData="Menu Mix"
          data={fnbMixBreakdown}
          centerValue="100%"
          centerLabel="Total Mix"
          centerValueClass="text-base"
        />
      </Row>

      <Row cols={3} delay="0.4s">
        <Card title="Outlet Peak Heatmap" drawerTitle="Outlet Peak Heatmap" drawerData="Heatmap" minH={200}>
          <div className="flex flex-col justify-between flex-1 py-1 gap-2">
            {/* Table Area */}
            <div className="flex flex-col gap-1.5">
              {/* Header row */}
              <div className="grid grid-cols-[84px_1fr_1fr_1fr_1fr_1fr_1fr] gap-1.5 text-[8px] text-zinc-400 font-medium pb-1 border-b border-zinc-100">
                <span className="text-left">Outlet</span>
                {heatmapTimes.map((t) => (
                  <span key={t} className="text-center">{t}</span>
                ))}
              </div>

              {/* Data rows */}
              <div className="flex flex-col gap-1.5">
                {heatmapOutlets.map((outlet, oIdx) => (
                  <div key={outlet} className="grid grid-cols-[84px_1fr_1fr_1fr_1fr_1fr_1fr] gap-1.5 items-center">
                    <span className="text-[8px] font-medium text-zinc-500 truncate" title={outlet}>
                      {outlet}
                    </span>
                    {heatmapData[oIdx].map((val, tIdx) => (
                      <div
                        key={tIdx}
                        className={`h-3 rounded-[2px] ${heatBg(val)} transition-all`}
                        title={`${outlet} @ ${heatmapTimes[tIdx]}: Level ${val}/5`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Intensity Legend */}
            <div className="flex items-center justify-between pt-1.5 border-t border-zinc-100/80 text-[8px] text-zinc-400 font-medium">
              <span>Occupancy Heat</span>
              <div className="flex items-center gap-1">
                <span>Low</span>
                <span className="w-2.5 h-2 rounded-[1.5px] bg-zinc-100 border border-zinc-200/50" />
                <span className="w-2.5 h-2 rounded-[1.5px] bg-zinc-200" />
                <span className="w-2.5 h-2 rounded-[1.5px] bg-zinc-400" />
                <span className="w-2.5 h-2 rounded-[1.5px] bg-zinc-600" />
                <span className="w-2.5 h-2 rounded-[1.5px] bg-zinc-900" />
                <span>Peak</span>
              </div>
            </div>
          </div>
        </Card>

        <Card
          title={<>F&B Experience Index <span className="text-[8px] font-normal text-zinc-400">Overall</span></>}
          drawerTitle="F&B Experience Index"
          drawerData="Satisfaction"
          minH={200}
        >
          <div className="flex flex-col justify-between flex-1 py-1 gap-2.5">
            {/* Top Score Banner */}
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[22px] font-normal text-zinc-900 leading-none">4.7</span>
                <span className="text-[9.5px] text-zinc-400 font-medium">/ 5.0</span>
              </div>
              <span className="text-[9px] font-medium text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 px-2 py-0.5 rounded">
                94% Positive
              </span>
            </div>

            {/* Horizontal Progress Bars */}
            <div className="flex flex-col gap-2 flex-1 justify-center">
              {[
                { label: 'Food Quality', score: 4.8 },
                { label: 'Service Speed', score: 4.6 },
                { label: 'Beverage & Wine', score: 4.7 },
                { label: 'Ambience', score: 4.8 },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[9.5px]">
                    <span className="text-zinc-600 font-medium truncate">{item.label}</span>
                    <span className="font-semibold text-zinc-900">
                      {item.score} <span className="text-[8px] text-zinc-400 font-normal">/ 5.0</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-800 rounded-full transition-all duration-500"
                      style={{ width: `${(item.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <PrinciplesCard
        items={[
          { label: 'Optimize seating capacity.', icon: Settings },
          { label: 'Elevate culinary craft.', icon: Cup },
          { label: 'Enhance guest delight.', icon: Heart },
          { label: 'Maximize beverage sales.', icon: WineglassTriangle },
          { label: 'Deliver refined service.', icon: Star },
        ]}
      />
      </Row></DashboardShell>
  );
}

