import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LiveOverviewMap } from '../components/widgets/LiveOverviewMap';
import { MetricWidget } from '../components/widgets/MetricWidget';
import { GlobalAlertsWidget } from '../components/widgets/GlobalAlertsWidget';
import { GuestMovementWidget } from '../components/widgets/GuestMovementWidget';
import { RoomTierOccupancyWidget } from '../components/widgets/RoomTierOccupancyWidget';
import { TopNationalitiesWidget } from '../components/widgets/TopNationalitiesWidget';
import { SentimentScoreWidget } from '../components/widgets/SentimentScoreWidget';
import { GuestArrivalsWidget } from '../components/widgets/GuestArrivalsWidget';
import { UsersGroupTwoRounded, Bed, TagPrice, Heart, Snowflake, Plain, RoundAltArrowRight } from '@solar-icons/react';
import { getDashboardComputedData } from '../../../data/pms';
import dashboardData from '../../../data/dashboardData.json';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ResortTypeDashboard } from './ResortTypeDashboard';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { InfoTooltip } from '../../common/components/InfoTooltip';

import alpineImg from '@/assets/property_types/alpine.png';
import oceanImg from '@/assets/property_types/ocean.png';
import cityImg from '@/assets/property_types/city.png';
import forestImg from '@/assets/property_types/forest.png';
import desertImg from '@/assets/property_types/desert.png';
import countryImg from '@/assets/property_types/country.png';

const imageMap: Record<string, string> = {
  alpine: alpineImg,
  ocean: oceanImg,
  city: cityImg,
  forest: forestImg,
  desert: desertImg,
  country: countryImg,
};

const getNeedIcon = (label: string, iconSize = 18) => {
  switch (label.toLowerCase()) {
    case 'wellness': return <Heart size={iconSize} />;
    case 'family': return <UsersGroupTwoRounded size={iconSize} />;
    case 'dining': return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    );
    case 'ski': return <Snowflake size={iconSize} />;
    case 'transport': return <Plain size={iconSize} />;
    default: return <span>{label.charAt(0)}</span>;
  }
};

export function DashboardPage() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') === 'by_property_type' ? 'by_property_type' : 'all';
  const [portfolioPeriod, setPortfolioPeriod] = useState<'YTD' | 'MTD'>('YTD');

  const { openDrawer } = useDashboardDrawer();
  const pmsData = getDashboardComputedData();
  const spendChartData = pmsData.spendOverTime;

  const journeyTimelineData = pmsData.journeyTimeline.map((j) => ({
    ...j,
    img: imageMap[j.imgKey] || alpineImg,
  }));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Ohayō Alfonso!';
    if (hour >= 12 && hour < 18) return 'Konnichiwa Alfonso!';
    return 'Konbanwa Alfonso!';
  };

  const getFormattedDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return { date, time, tz };
  };

  const { date, time, tz } = getFormattedDateTime();

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col pt-4 lg:pt-6">
      {/* Header */}
      <header className="shrink-0 flex flex-col mb-4 px-4 lg:px-6">
        {/* Welcome Card */}
        {view === 'all' && (
          <div className="w-full py-3 border-b border-zinc-200/80 animate-fade-in bg-transparent flex justify-between items-end" style={{ animationDelay: '0.05s' }}>
            <div>
              <p className="text-[10px] font-sans text-zinc-500 tracking-widest uppercase mb-0.5 font-semibold">{getGreeting()}</p>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-wide flex items-center gap-2">
                <span>Welcome To SOSEI Hospitality</span>
              </h2>
            </div>
            <div className="text-right shrink-0 ml-4 pt-0.5 pb-0.5">
              <p className="text-[10px] text-zinc-900 font-semibold">{date}</p>
              <p className="text-[9px] text-zinc-500">{time} · {tz}</p>
            </div>
          </div>
        )}

      </header>

      {/* Conditional View Rendering */}
      {view === 'by_property_type' ? (
        <div key="resort" className="flex-1 flex flex-col">
          <ResortTypeDashboard />
        </div>
      ) : (
        <div key="all" className="grid grid-cols-12 auto-rows-max gap-4 pb-6 px-4 lg:px-6 text-[10px]">

          {/* ROW 1-2: Large Map (60%) + 4 KPI Cards (40%) */}
          <div className="col-span-12 flex flex-col lg:flex-row gap-4 items-start">
            {/* Map — Large 60% */}
            <div className="w-full lg:w-[60%] shrink-0 flex flex-col gap-2.5">
              <div className="px-1 flex justify-between items-end shrink-0">
                <div>
                  <InfoTooltip text="Interactive world map showing property, occupancy, ADR, and RevPAR (MTD).">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-0 cursor-help">WORLD MAP</h3>
                  </InfoTooltip>
                  <div
                    className="text-[10px] font-normal uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:underline cursor-pointer mb-0 flex items-center gap-1 transition-colors"
                    onClick={() => openDrawer({ type: 'WORLD_MAP', title: 'World Map Details' })}
                  >
                    SEE DETAILS <RoundAltArrowRight size={10} />
                  </div>
                </div>
              </div>
              <div
                className="w-full rounded-[12px] p-2 flex flex-col relative animate-card-enter bg-zinc-50/50 backdrop-blur-sm transition-all z-10 hover:z-30 h-[215px]"
                style={{ animationDelay: '0.1s' }}
              >
                <LiveOverviewMap />
              </div>
            </div>

            {/* Right Column — 40% (4 KPI Cards) */}
            <div className="w-full lg:w-[40%] flex flex-col gap-2.5">
              <div className="px-1 flex flex-col justify-end">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-0">Portfolio Performance</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="relative inline-flex items-center">
                    <select
                      value={portfolioPeriod}
                      onChange={(e) => setPortfolioPeriod(e.target.value as 'YTD' | 'MTD')}
                      className="bg-transparent text-zinc-500 hover:text-zinc-900 border-none text-[10px] font-normal uppercase tracking-widest pl-0 pr-3 py-0 leading-none outline-none cursor-pointer appearance-none transition-colors"
                    >
                      <option value="YTD">YTD</option>
                      <option value="MTD">MTD</option>
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 flex items-center justify-center">
                      <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                  <InfoTooltip text={portfolioPeriod === 'YTD' ? "vs same period last year" : "vs same period last month"}>
                    <span className="text-[10px] font-normal uppercase tracking-widest text-zinc-500 cursor-help flex items-center leading-none">
                      ({portfolioPeriod === 'YTD' ? "VS LAST YEAR" : "VS LAST MONTH"})
                    </span>
                  </InfoTooltip>
                </div>
              </div>
              {/* 4 KPI Cards 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2 h-[215px]">
                {/* Occupancy */}
                <div
                  className="relative rounded-[12px] p-3 flex flex-col justify-between animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all h-full"
                  style={{ animationDelay: '0.2s' }}
                  onClick={() => openDrawer({ type: 'METRIC', title: pmsData.kpis.occupancy.title, data: portfolioPeriod === 'YTD' ? pmsData.kpis.occupancy.ytdValue : pmsData.kpis.occupancy.mtdValue })}
                >
                  <MetricWidget
                    title={pmsData.kpis.occupancy.title}
                    value={portfolioPeriod === 'YTD' ? pmsData.kpis.occupancy.ytdValue : pmsData.kpis.occupancy.mtdValue}
                    trendText={portfolioPeriod === 'YTD' ? '6%' : '4%'}
                    trendUp={pmsData.kpis.occupancy.trendUp}
                    icon={<Bed size={14} />}
                    data={pmsData.kpis.occupancy.data}
                    color={pmsData.kpis.occupancy.color}
                  />
                </div>
                {/* ADR */}
                <div
                  className="relative rounded-[12px] p-3 flex flex-col justify-between animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all h-full"
                  style={{ animationDelay: '0.25s' }}
                  onClick={() => openDrawer({ type: 'METRIC', title: pmsData.kpis.adr.title, data: portfolioPeriod === 'YTD' ? pmsData.kpis.adr.ytdValue : pmsData.kpis.adr.mtdValue })}
                >
                  <MetricWidget
                    title={pmsData.kpis.adr.title}
                    value={portfolioPeriod === 'YTD' ? pmsData.kpis.adr.ytdValue : pmsData.kpis.adr.mtdValue}
                    trendText={portfolioPeriod === 'YTD' ? '8%' : '5%'}
                    trendUp={pmsData.kpis.adr.trendUp}
                    icon={<TagPrice size={14} />}
                    data={pmsData.kpis.adr.data}
                    color={pmsData.kpis.adr.color}
                  />
                </div>
                {/* Revenue */}
                <div
                  className="relative rounded-[12px] p-3 flex flex-col justify-between animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all h-full"
                  style={{ animationDelay: '0.3s' }}
                  onClick={() => openDrawer({ type: 'METRIC', title: pmsData.kpis.revenue.title, data: portfolioPeriod === 'YTD' ? pmsData.kpis.revenue.ytdValue : pmsData.kpis.revenue.mtdValue })}
                >
                  <MetricWidget
                    title={pmsData.kpis.revenue.title}
                    value={portfolioPeriod === 'YTD' ? pmsData.kpis.revenue.ytdValue : pmsData.kpis.revenue.mtdValue}
                    trendText={portfolioPeriod === 'YTD' ? '14%' : '8%'}
                    trendUp={pmsData.kpis.revenue.trendUp}
                    icon={<TagPrice size={14} />}
                    data={pmsData.kpis.revenue.data}
                    color={pmsData.kpis.revenue.color}
                  />
                </div>
                {/* RevPAR */}
                <div
                  className="relative rounded-[12px] p-3 flex flex-col justify-between animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all h-full"
                  style={{ animationDelay: '0.35s' }}
                  onClick={() => openDrawer({ type: 'METRIC', title: pmsData.kpis.revPar.title, data: portfolioPeriod === 'YTD' ? pmsData.kpis.revPar.ytdValue : pmsData.kpis.revPar.mtdValue })}
                >
                  <MetricWidget
                    title={pmsData.kpis.revPar.title}
                    value={portfolioPeriod === 'YTD' ? pmsData.kpis.revPar.ytdValue : pmsData.kpis.revPar.mtdValue}
                    trendText={portfolioPeriod === 'YTD' ? '14%' : '9%'}
                    trendUp={pmsData.kpis.revPar.trendUp}
                    icon={<TagPrice size={14} />}
                    data={pmsData.kpis.revPar.data}
                    color={pmsData.kpis.revPar.color}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3 — 60% (Number of Guests & Room Tier Occupancy) & 40% (Top Nationalities & Sentiment Score) */}
          <div className="col-span-12 flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Left Column — 60% (Number of Guests: col-6, Room Tier Occupancy: col-6) */}
            <div className="w-full lg:w-[60%] shrink-0 grid grid-cols-12 gap-2 items-stretch">
              {/* Number of Guests — col-span-6 */}
              <div
                className="col-span-12 lg:col-span-6 relative rounded-[12px] p-4 flex flex-col animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
                style={{ animationDelay: '0.4s' }}
                onClick={() => openDrawer({ type: 'GUEST_MOVEMENT', title: 'Daily number of guests checked in' })}
              >
                <GuestMovementWidget />
              </div>

              {/* Room Tier & Suite Occupancy — col-span-6 */}
              <div
                className="col-span-12 lg:col-span-6 relative rounded-[12px] p-4 flex flex-col justify-between animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
                style={{ animationDelay: '0.45s' }}
                onClick={() => openDrawer({ type: 'ROOM_TIER_OCCUPANCY', title: 'Room Tier & Suite Occupancy Performance' })}
              >
                <RoomTierOccupancyWidget />
              </div>
            </div>

            {/* Right Column — 40% (Top Nationalities / Sentiment Score) */}
            <div className="w-full lg:w-[40%] grid grid-cols-12 gap-2 items-stretch">
              {/* Top Nationalities — col-span-7 */}
              <div
                className="col-span-12 lg:col-span-7 relative rounded-[12px] p-4 flex flex-col animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
                style={{ animationDelay: '0.5s' }}
                onClick={() => openDrawer({ type: 'TOP_NATIONALITIES', title: 'Top Nationalities' })}
              >
                <TopNationalitiesWidget />
              </div>
              {/* Sentiment Score — col-span-5 */}
              <div
                className="col-span-12 lg:col-span-5 relative rounded-[12px] p-4 flex flex-col animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
                style={{ animationDelay: '0.55s' }}
                onClick={() => openDrawer({ type: 'SENTIMENT_SCORE', title: 'Sentiment Score' })}
              >
                <SentimentScoreWidget />
              </div>
            </div>
          </div>

          {/* ROW 4 — 60% VVIP Arrivals & Top Guest Needs & 40% Notes From Yesterday */}
          <div className="col-span-12 flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Left Column — 60% */}
            <div className="w-full lg:w-[60%] shrink-0 grid grid-cols-12 gap-2 items-stretch">
              {/* VVIP Arrivals — col-span-6 */}
              <div
                className="col-span-12 lg:col-span-6 relative rounded-[12px] p-3 flex flex-col cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm"
                style={{ animationDelay: '0.6s' }}
                onClick={() => openDrawer({ type: 'GUEST_ARRIVALS', title: 'VVIP Arrivals' })}
              >
                <GuestArrivalsWidget />
              </div>

              {/* Top Guest Needs — col-span-6 */}
              <div
                className="col-span-12 lg:col-span-6 relative rounded-[12px] p-3 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm"
                style={{ animationDelay: '0.65s' }}
                onClick={() => openDrawer({ type: 'GUEST_NEEDS', title: 'Top Guest Needs' })}
              >
                <div className="mb-2">
                  <InfoTooltip text="Top requested guest activities, amenities and services logged MTD.">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Top Guest Needs</h3>
                      <p className="text-[10px] text-zinc-500 font-medium">BASED ON IN-HOUSE GUESTS</p>
                    </div>
                  </InfoTooltip>
                </div>
                <div className="flex-1 flex flex-col justify-around py-0.5">
                  {pmsData.topGuestNeeds.map((need, idx) => {
                    const zincShades = ['#18181b', '#3f3f46', '#52525b', '#71717a', '#a1a1aa'];
                    const pctVal = parseInt(need.percentage) || 50;
                    return (
                      <div key={idx} className="flex flex-col">
                        {idx > 0 && <hr className="border-t border-zinc-100 my-1" />}
                        <div className="flex items-center py-0.5 hover:bg-zinc-100/80 px-1 rounded transition-all cursor-pointer group/need">
                          <div className="w-0 opacity-0 group-hover/need:w-6 group-hover/need:opacity-100 group-hover/need:mr-2.5 rounded-full bg-zinc-200/60 flex items-center justify-center text-zinc-700 shrink-0 h-6 overflow-hidden transition-all duration-300 ease-out">
                            {getNeedIcon(need.label, 12)}
                          </div>
                          <div className="flex-1 flex flex-col justify-center min-w-0">
                            <div className="flex justify-between items-center text-[10px] mb-0.5">
                              <span className="font-medium text-zinc-700 truncate">{need.label}</span>
                              <span className="font-bold text-zinc-900 shrink-0">{need.percentage}</span>
                            </div>
                            <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${pctVal}%`,
                                  backgroundColor: zincShades[idx % zincShades.length],
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column — 40% (Notes From Yesterday) */}
            <div
              className="group w-full lg:w-[40%] relative rounded-[12px] p-3 grid grid-cols-12 gap-3 items-stretch cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm"
              style={{ animationDelay: '0.7s' }}
              onClick={() => openDrawer({ type: 'NOTES_YESTERDAY', title: 'Notes From Yesterday' })}
            >
              <div className="col-span-12 sm:col-span-7 flex flex-col justify-between overflow-hidden">
                <div className="mb-2">
                  <InfoTooltip text="Diary log entries and comments submitted by resort general managers.">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Notes From Yesterday</h3>
                      <p className="text-[10px] text-zinc-500 font-medium">DAILY GM HIGHLIGHTS</p>
                    </div>
                  </InfoTooltip>
                </div>
                <div className="flex gap-2 items-start my-auto py-1">
                  <span className="text-zinc-400 text-xl font-serif leading-none shrink-0 mt-0.5 select-none">&ldquo;</span>
                  <p className="text-[11px] text-zinc-700 italic leading-relaxed text-left">
                    {dashboardData.notesFromYesterday.text}
                  </p>
                </div>
                <p className="text-[9px] text-zinc-500 text-right font-medium">— {dashboardData.notesFromYesterday.author}</p>
              </div>
              <div className="col-span-12 sm:col-span-5 relative h-full min-h-[110px] overflow-hidden rounded-lg">
                <img
                  src={cityImg}
                  alt="Candlelight dinner"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg filter grayscale contrast-110 group-hover:grayscale-0 hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* ROW 5 — 60% Global Alerts & Spend Over Time / 40% Journey Timeline */}
          <div className="col-span-12 flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Left Column — 60% (Global Alerts: col-span-6, Spend Over Time: col-span-6 — aligned with VVIP Arrivals) */}
            <div className="w-full lg:w-[60%] shrink-0 grid grid-cols-12 gap-2 items-stretch lg:h-[185px]">
              {/* Global Alerts & Insights — col-span-6 (Aligend with VVIP Arrivals above) */}
              <div
                className="col-span-12 lg:col-span-6 relative rounded-[12px] p-3.5 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm h-full lg:h-[185px]"
                style={{ animationDelay: '0.75s' }}
              >
                <GlobalAlertsWidget />
              </div>

              {/* Spend Over Time — col-span-6 (Aligned with Top Guest Needs above) */}
              <div
                className="col-span-12 lg:col-span-6 relative rounded-[12px] p-3.5 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm h-full lg:h-[185px]"
                style={{ animationDelay: '0.8s' }}
                onClick={() => openDrawer({ type: 'SPEND_OVERTIME', title: 'Spend Over Time' })}
              >
                <div className="flex justify-between items-baseline mb-4">
                  <InfoTooltip text="Annual guest expenditure trends compared side-by-side (YTD).">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Spend Over Time</h3>
                      <p className="text-[10px] text-zinc-500 font-medium">ANNUAL EXPENDITURE (USD)</p>
                    </div>
                  </InfoTooltip>
                </div>
                <div className="flex-1 min-h-[90px] w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={spendChartData} margin={{ top: 10, right: 10, left: 0, bottom: -5 }}>
                      <defs>
                        <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#18181b" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#18181b" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fill: '#71717a' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        width={38}
                        tick={{ fontSize: 8, fill: '#71717a' }}
                        tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#e4e4e7',
                          borderRadius: '8px',
                          fontSize: '10px',
                          color: '#18181b',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          padding: '4px 8px',
                        }}
                        formatter={(value: any) => [`$${(Number(value) / 1000000).toFixed(1)}M`, 'Spend']}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#18181b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#spendGradient)"
                        dot={{ r: 3, fill: '#18181b', stroke: '#ffffff', strokeWidth: 1.5 }}
                        activeDot={{ r: 5, fill: '#15803d' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Column — 40% Journey Timeline */}
            <div
              className="w-full lg:w-[40%] relative rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm h-full lg:h-[185px]"
              style={{ animationDelay: '0.85s' }}
              onClick={() => openDrawer({ type: 'JOURNEY_TIMELINE', title: 'Journey Timeline' })}
            >
              <div className="flex justify-between mb-1">
                <InfoTooltip text="Historical milestone timeline tracking the launch of each SOSEI sanctuary.">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Journey Timeline</h3>
                    <p className="text-[10px] text-zinc-500 font-medium">SANCTUARY MILESTONES</p>
                  </div>
                </InfoTooltip>
              </div>
              <div className="flex justify-between items-center mt-1 px-1 overflow-x-auto custom-scrollbar gap-3 md:gap-0 pb-1 md:pb-0 flex-1">
                {journeyTimelineData.slice(0, 6).map((j, i) => (
                  <div key={i} className="group/jitem flex flex-col items-center shrink-0 min-w-[55px] md:min-w-0 cursor-pointer">
                    <img
                      src={j.img}
                      alt={j.name}
                      className="w-[38px] h-[38px] md:w-[40px] md:h-[40px] rounded-full border-2 border-zinc-200 object-cover mb-1 shadow-xs filter grayscale contrast-110 group-hover/jitem:grayscale-0 hover:grayscale-0 transition-all duration-500 ease-in-out group-hover/jitem:scale-105"
                    />
                    <div className="text-[9px] font-semibold text-zinc-900 text-center leading-tight">{j.date}</div>
                    <div className="text-[8px] text-zinc-700 text-center leading-tight mt-0.5 truncate max-w-[68px]">{j.name}</div>
                    <div className="text-[7.5px] text-zinc-400 text-center italic mt-0.5 leading-tight truncate max-w-[68px]">{j.location}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
