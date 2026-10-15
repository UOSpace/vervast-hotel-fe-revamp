import { Heart, Settings, Star, Cup, Calendar } from '@solar-icons/react';
import {
  DashboardShell, DashboardHeader, KpiGrid, Row, TrendCard, DonutCard, ListCard, BarListCard, PrinciplesCard,
  experienceBookingsOverTime, experiencesByCategory, topExperiences, experienceRevenueByProperty,
  experienceTypePerformance, upcomingHighlights,
} from '../components/widgets/fnb/FnbExperienceShared';

export function ExperienceDashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        eyebrow="Experience Intelligence"
        title="Welcome to SOSEI Experiences"
        subtitle="Curated experiences. Memorable moments. Measurable impact."
      />

      <KpiGrid
        items={[
          { label: 'TOTAL EXPERIENCES BOOKED', value: '1,864' },
          { label: 'EXPERIENCE REVENUE (USD)', value: '$189,320' },
          { label: 'AVG REVENUE PER BOOKING', value: '$102' },
          { label: 'REPEAT EXPERIENCE RATE', value: '38%' },
          { label: 'TOP CATEGORY', value: 'Water & Marine' },
          { label: 'EXPERIENCE RATING', value: '4.8 / 5' },
        ]}
      />

      <Row cols={4} delay="0.2s">
        <TrendCard title="Experience Bookings Over Time" drawerData="Trend Chart" last="May 31: 892" data={experienceBookingsOverTime} />

        <DonutCard
          title="Experiences by Category"
          drawerData="Category Breakdown"
          info="Distribution of booked guest experiences by activity type."
          data={experiencesByCategory}
          centerValue="1,864"
          centerLabel="Bookings"
        />

        <ListCard
          title="Top Experiences"
          drawerData="Leaderboard"
          rows={topExperiences.map((e) => ({
            key: e.name,
            label: (
              <>
                <span className="text-zinc-700 font-medium">{e.name}</span>
                <span className="text-[8.5px] text-zinc-400 font-normal ml-1">({e.category})</span>
              </>
            ),
            value: e.count,
          }))}
        />

        <BarListCard
          title="Revenue by Property"
          drawerData="Property Breakdown"
          labelWidth="w-24"
          valueWidth="w-12"
          rows={experienceRevenueByProperty.map((p) => ({
            key: p.name,
            label: p.name,
            pct: p.pct,
            value: `$${(p.value / 1000).toFixed(1)}k`,
          }))}
        />
      </Row>

      <Row cols={3} delay="0.3s">
        <ListCard
          title="Experience Ratings"
          drawerData="Ratings"
          minH={200}
          rows={experienceTypePerformance.map((t) => ({
            key: t.name,
            label: <span className="text-zinc-700 font-medium">{t.name}</span>,
            value: `★ ${t.rating}`,
          }))}
        />

        <ListCard
          title="Upcoming Highlights"
          drawerData="Highlights"
          minH={200}
          rows={upcomingHighlights.map((ev) => ({
            key: ev.title,
            label: (
              <>
                <div className="font-bold text-zinc-900 leading-tight truncate">{ev.title}</div>
                <div className="text-[8.5px] text-zinc-400 font-normal">{ev.date}</div>
              </>
            ),
            value: <span className="text-[9px] font-semibold text-zinc-700">{ev.count}</span>,
          }))}
        />

        <PrinciplesCard
        items={[
          { label: 'Deliver bespoke experiences.', icon: Star },
          { label: 'Enhance guest delight.', icon: Heart },
          { label: 'Curate memorable moments.', icon: Calendar },
          { label: 'Elevate local culture.', icon: Cup },
          { label: 'Maximize experience revenue.', icon: Settings },
        ]}
      />
      </Row></DashboardShell>
  );
}

