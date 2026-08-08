import { useSearchParams } from 'react-router-dom';
import { LiveOverviewMap } from '../components/widgets/LiveOverviewMap';
import { MetricWidget } from '../components/widgets/MetricWidget';
import { GlobalAlertsWidget } from '../components/widgets/GlobalAlertsWidget';
import { GuestMovementWidget } from '../components/widgets/GuestMovementWidget';
import { PortfolioPerformanceWidget } from '../components/widgets/PortfolioPerformanceWidget';
import { TopNationalitiesWidget } from '../components/widgets/TopNationalitiesWidget';
import { SentimentScoreWidget } from '../components/widgets/SentimentScoreWidget';
import { GuestArrivalsWidget } from '../components/widgets/GuestArrivalsWidget';
import { UsersGroupTwoRounded, Bed, TagPrice, Heart, Snowflake, Plain, RoundAltArrowRight } from '@solar-icons/react';
import dashboardData from '../../../data/dashboardData.json';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ResortTypeDashboard } from './ResortTypeDashboard';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { InfoTooltip } from '../../common/components/InfoTooltip';

import alpineImg from '../../../assets/contents/alpine.png';
import oceanImg from '../../../assets/contents/ocean.png';
import cityImg from '../../../assets/contents/city.png';
import forestImg from '../../../assets/contents/forest.png';
import desertImg from '../../../assets/contents/desert.png';
import countryImg from '../../../assets/contents/country.png';

const spendChartData = dashboardData.spendOverTime;

const imageMap: Record<string, string> = {
  alpine: alpineImg,
  ocean: oceanImg,
  city: cityImg,
  forest: forestImg,
  desert: desertImg,
  country: countryImg,
};

const journeyTimelineData1 = dashboardData.journeyTimeline.slice(0, 3).map((j: any) => ({ ...j, img: imageMap[j.imgKey] }));
const journeyTimelineData2 = dashboardData.journeyTimeline.slice(3, 6).map((j: any) => ({ ...j, img: imageMap[j.imgKey] }));

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

  const { openDrawer } = useDashboardDrawer();

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
          <div className="w-full py-3 border-b border-[#d4c4b7]/40 animate-fade-in bg-transparent flex justify-between items-end" style={{ animationDelay: '0.05s' }}>
            <div>
              <p className="text-[10px] font-sans text-[#a65e52] tracking-widest uppercase mb-0.5 font-semibold">{getGreeting()}</p>
              <h2 className="text-2xl font-bold text-[#4a3c31] tracking-wide flex items-center gap-2">
                <span>Welcome to SOSEI Hospitality</span>
              </h2>
            </div>
            <div className="text-right shrink-0 ml-4 pt-0.5 pb-0.5">
              <p className="text-[10px] text-[#4a3c31] font-semibold">{date}</p>
              <p className="text-[9px] text-[#947b66]">{time} · {tz}</p>
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

          {/* ROW 1-2: Map (45.83%) + Right Column (54.17%) — using flex for precise 10% adjustment */}
          <div className="col-span-12 flex flex-col lg:flex-row gap-4 items-start">
            {/* Map — 45.83% */}
            <div className="w-full lg:w-[45.83%] shrink-0 flex flex-col gap-2.5">
              <div className="px-1 flex justify-between items-end shrink-0">
                <div>
                  <InfoTooltip text="Interactive world map showing property, occupancy, ADR, and RevPAR.">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] mb-0 cursor-help">WORLD MAP</h3>
                  </InfoTooltip>
                  <div
                    className="text-[10px] font-normal tracking-widest text-[#4a3c31] hover:underline cursor-pointer mb-0 flex items-center gap-1"
                    onClick={() => openDrawer({ type: 'WORLD_MAP', title: 'World Map Details' })}
                  >
                    See details <RoundAltArrowRight size={10} />
                  </div>
                </div>
              </div>
              <div
                className="w-full rounded-[12px] p-2 flex flex-col relative animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm transition-all z-10 hover:z-30 h-[215px]"
                style={{ animationDelay: '0.1s' }}
              >
                <LiveOverviewMap />
              </div>
            </div>

            {/* Right Column — 54.17% */}
            <div className="w-full lg:w-[54.17%] flex flex-col gap-2.5">
              <div className="grid grid-cols-12 gap-2 px-1">
                <div className="col-span-12 lg:col-span-7">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] mb-0">Portfolio Performance</h3>
                  <h3 className="text-[10px] font-normal uppercase tracking-widest text-[#4a3c31] mb-0">YTD</h3>
                </div>
                <div className="col-span-12 lg:col-span-5 flex items-end justify-between">
                  <InfoTooltip text="vs same period last month">
                    <h3 className="text-[10px] font-normal uppercase tracking-widest text-[#4a3c31] mb-0 cursor-help">MTD</h3>
                  </InfoTooltip>
                </div>
              </div>
              {/* Metrics Row — 2x2 grid spanning col-span-7, Portfolio Performance in col-span-5 */}
              <div className="grid grid-cols-12 gap-2 items-stretch">
                <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-2">
                  {/* Occupancy */}
                  <div
                    className="relative rounded-[12px] p-3 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
                    style={{ animationDelay: '0.2s' }}
                    onClick={() => openDrawer({ type: 'METRIC', title: dashboardData.metrics.occupancy.title, data: dashboardData.metrics.occupancy.value })}
                  >
                    <MetricWidget
                      title={dashboardData.metrics.occupancy.title} value={dashboardData.metrics.occupancy.value} trendText={dashboardData.metrics.occupancy.trendText} trendUp={dashboardData.metrics.occupancy.trendUp}
                      icon={<Bed size={14} />} data={dashboardData.metrics.occupancy.data} color={dashboardData.metrics.occupancy.color}
                    />
                  </div>
                  {/* ADR */}
                  <div
                    className="relative rounded-[12px] p-3 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
                    style={{ animationDelay: '0.25s' }}
                    onClick={() => openDrawer({ type: 'METRIC', title: dashboardData.metrics.adr.title, data: dashboardData.metrics.adr.value })}
                  >
                    <MetricWidget
                      title={dashboardData.metrics.adr.title} value={dashboardData.metrics.adr.value} trendText={dashboardData.metrics.adr.trendText} trendUp={dashboardData.metrics.adr.trendUp}
                      icon={<TagPrice size={14} />} data={dashboardData.metrics.adr.data} color={dashboardData.metrics.adr.color}
                    />
                  </div>
                  {/* Revenue */}
                  <div
                    className="relative rounded-[12px] p-3 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
                    style={{ animationDelay: '0.3s' }}
                    onClick={() => openDrawer({ type: 'METRIC', title: dashboardData.metrics.revenue.title, data: dashboardData.metrics.revenue.value })}
                  >
                    <MetricWidget
                      title={dashboardData.metrics.revenue.title} value={dashboardData.metrics.revenue.value} trendText={dashboardData.metrics.revenue.trendText} trendUp={dashboardData.metrics.revenue.trendUp}
                      icon={<TagPrice size={14} />} data={dashboardData.metrics.revenue.data} color={dashboardData.metrics.revenue.color}
                    />
                  </div>
                  {/* RevPAR */}
                  <div
                    className="relative rounded-[12px] p-3 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
                    style={{ animationDelay: '0.35s' }}
                    onClick={() => openDrawer({ type: 'METRIC', title: dashboardData.metrics.revPar.title, data: dashboardData.metrics.revPar.value })}
                  >
                    <MetricWidget
                      title={dashboardData.metrics.revPar.title} value={dashboardData.metrics.revPar.value} trendText={dashboardData.metrics.revPar.trendText} trendUp={dashboardData.metrics.revPar.trendUp}
                      icon={<TagPrice size={14} />} data={dashboardData.metrics.revPar.data} color={dashboardData.metrics.revPar.color}
                    />
                  </div>
                </div>
                {/* Portfolio Performance — col-span-5 */}
                <div
                  className="col-span-12 lg:col-span-5 relative rounded-[12px] p-3 flex flex-col justify-between animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all h-full"
                  style={{ animationDelay: '0.4s' }}
                  onClick={() => openDrawer({ type: 'PORTFOLIO_PERFORMANCE', title: 'Portfolio Performance' })}
                >
                  <PortfolioPerformanceWidget />
                </div>
              </div>
              {/* Global Alerts (Commented Out) */}
              {/*
              <div
                className="relative rounded-[12px] p-4 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:bg-[#e8dfd5]/60 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
                style={{ animationDelay: '0.35s' }}
                onClick={() => openDrawer({ type: 'ALERTS', title: 'Global Alerts & Insights' })}
              >
                <GlobalAlertsWidget />
              </div>
              */}
            </div>
          </div>

          {/* ROW 3 — 45.83% Number of Guests & 54.17% Top Nationalities / Sentiment Score */}
          <div className="col-span-12 flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Left Column — 45.83% (Matches World Map) */}
            <div
              className="w-full lg:w-[45.83%] shrink-0 relative rounded-[12px] p-4 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
              style={{ animationDelay: '0.4s' }}
              onClick={() => openDrawer({ type: 'GUEST_MOVEMENT', title: 'Daily number of guests checked in' })}
            >
              <GuestMovementWidget />
            </div>

            {/* Right Column — 54.17% (Matches Metrics + Portfolio Performance) */}
            <div className="w-full lg:w-[54.17%] grid grid-cols-12 gap-2 items-stretch">
              {/* Top Nationalities — col-span-7 (Matches Metrics 4 Cards) */}
              <div
                className="col-span-12 lg:col-span-7 relative rounded-[12px] p-4 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
                style={{ animationDelay: '0.5s' }}
                onClick={() => openDrawer({ type: 'TOP_NATIONALITIES', title: 'Top Nationalities' })}
              >
                <TopNationalitiesWidget />
              </div>
              {/* Sentiment Score — col-span-5 (Matches Portfolio Performance) */}
              <div
                className="col-span-12 lg:col-span-5 relative rounded-[12px] p-4 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
                style={{ animationDelay: '0.55s' }}
                onClick={() => openDrawer({ type: 'SENTIMENT_SCORE', title: 'Sentiment Score' })}
              >
                <SentimentScoreWidget />
              </div>
            </div>
          </div>

          {/* ROW 4 — 45.83% VVIP Arrivals & Top Guest Needs & 54.17% Notes From Yesterday */}
          <div className="col-span-12 flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Left Column — 45.83% (Matches Number of Guests & World Map above) */}
            <div className="w-full lg:w-[45.83%] shrink-0 grid grid-cols-12 gap-2 items-stretch">
              {/* VVIP Arrivals — col-span-6 */}
              <div
                className="col-span-12 lg:col-span-6 relative rounded-[12px] p-3 flex flex-col cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
                style={{ animationDelay: '0.6s' }}
                onClick={() => openDrawer({ type: 'GUEST_ARRIVALS', title: 'VVIP Arrivals' })}
              >
                <GuestArrivalsWidget />
              </div>

              {/* Top Guest Needs — col-span-6 */}
              <div
                className="col-span-12 lg:col-span-6 relative rounded-[12px] p-3 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
                style={{ animationDelay: '0.65s' }}
                onClick={() => openDrawer({ type: 'GUEST_NEEDS', title: 'Top Guest Needs' })}
              >
                <div className="mb-2">
                  <InfoTooltip text="Top requested guest activities, amenities and services logged MTD.">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] cursor-help">Top Guest Needs</h3>
                      <p className="text-[10px] text-[#7d6b5e]">BASED ON IN-HOUSE GUESTS</p>
                    </div>
                  </InfoTooltip>
                </div>
                <div className="flex-1 flex flex-col justify-around py-0.5">
                  {dashboardData.topGuestNeeds.map((need, idx) => {
                    const wabiSabiShades = ['#1F1D1C', '#3D3A38', '#5E5A56', '#857E78', '#B2A9A0'];
                    const pctVal = parseInt(need.percentage) || 50;
                    return (
                      <div key={idx} className="flex flex-col">
                        {idx > 0 && <hr className="border-t border-[#d4c4b7]/30 my-1" />}
                        <div className="flex items-center py-0.5 hover:bg-gray-100/80 px-1 rounded transition-all cursor-pointer group/need">
                          <div className="w-0 opacity-0 group-hover/need:w-6 group-hover/need:opacity-100 group-hover/need:mr-2.5 rounded-full bg-gray-200/60 flex items-center justify-center text-gray-600 shrink-0 h-6 overflow-hidden transition-all duration-300 ease-out">
                            {getNeedIcon(need.label, 12)}
                          </div>
                          <div className="flex-1 flex flex-col justify-center min-w-0">
                            <div className="flex justify-between items-center text-[10px] mb-0.5">
                              <span className="font-medium text-[#4a3c31] truncate">{need.label}</span>
                              <span className="font-bold text-[#4a3c31] shrink-0">{need.percentage}</span>
                            </div>
                            <div className="w-full h-1 bg-gray-200/50 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${pctVal}%`,
                                  backgroundColor: wabiSabiShades[idx % wabiSabiShades.length],
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

            {/* Right Column — 54.17% (Notes From Yesterday: Text col-span-7, Image col-span-5 matches Sentiment Score & Portfolio Performance above) */}
            <div
              className="group w-full lg:w-[54.17%] relative rounded-[12px] p-3 grid grid-cols-12 gap-3 items-stretch cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
              style={{ animationDelay: '0.7s' }}
              onClick={() => openDrawer({ type: 'NOTES_YESTERDAY', title: 'Notes From Yesterday' })}
            >
              <div className="col-span-12 sm:col-span-7 flex flex-col justify-between overflow-hidden">
                <div className="mb-2">
                  <InfoTooltip text="Diary log entries and comments submitted by resort general managers.">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] cursor-help">Notes From Yesterday</h3>
                      <p className="text-[10px] text-[#7d6b5e]">DAILY GM HIGHLIGHTS</p>
                    </div>
                  </InfoTooltip>
                </div>
                <div className="flex gap-2 items-start my-auto py-1">
                  <span className="text-[#947b66] text-xl font-serif leading-none shrink-0 mt-0.5 select-none">&ldquo;</span>
                  <p className="text-[11px] text-[#4a3c31] italic leading-relaxed text-left">
                    {dashboardData.notesFromYesterday.text}
                  </p>
                </div>
                <p className="text-[9px] text-[#947b66] text-right font-medium">— {dashboardData.notesFromYesterday.author}</p>
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

          {/* ROW 5 — 45.83% Journey Timeline & 54.17% Sentiment Over Time / Spend Over Time */}
          <div className="col-span-12 flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Left Column — 45.83% (Matches Number of Guests & World Map above) */}
            <div
              className="w-full lg:w-[45.83%] shrink-0 relative rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm h-full lg:h-[165px]"
              style={{ animationDelay: '0.75s' }}
              onClick={() => openDrawer({ type: 'JOURNEY_TIMELINE', title: 'Journey Timeline' })}
            >
              <div className="flex justify-between mb-2">
                <InfoTooltip text="Historical milestone timeline tracking the launch of each SOSEI sanctuary.">
                  <div>
                    <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#4a3c31] cursor-help">Journey Timeline</h3>
                    <p className="text-[10px] text-[#7d6b5e]">SANCTUARY MILESTONES</p>
                  </div>
                </InfoTooltip>
              </div>
              <div className="flex justify-between items-center mt-2 px-1 overflow-x-auto custom-scrollbar gap-4 md:gap-0 pb-2 md:pb-0 flex-1 my-auto">
                {[...journeyTimelineData1, ...journeyTimelineData2].map((j, i) => (
                  <div key={i} className="group/jitem flex flex-col items-center shrink-0 min-w-[72px] md:min-w-0 cursor-pointer">
                    <img
                      src={j.img}
                      alt={j.name}
                      className="w-[48px] h-[48px] md:w-[58px] md:h-[58px] rounded-full border-2 border-[#f3eae1] object-cover mb-1.5 shadow-sm filter grayscale contrast-110 group-hover/jitem:grayscale-0 hover:grayscale-0 transition-all duration-500 ease-in-out group-hover/jitem:scale-105"
                    />
                    <div className="text-[9px] font-medium text-[#4a3c31] text-center">{j.date}</div>
                    <div className="text-[8px] text-[#7d6b5e] text-center">{j.name}</div>
                    <div className="text-[7px] text-[#947b66] text-center italic mt-0.5">{j.location}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column — 54.17% (Global Alerts & Insights: col-span-7, Spend Over Time: col-span-5) */}
            <div className="w-full lg:w-[54.17%] grid grid-cols-12 gap-2 items-stretch lg:h-[165px]">
              {/* Global Alerts & Insights — col-span-7 */}
              <div
                className="col-span-12 lg:col-span-7 relative rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm h-full lg:h-[165px]"
                style={{ animationDelay: '0.8s' }}
              >
                <GlobalAlertsWidget />
              </div>

              {/* Spend Over Time — col-span-5 */}
              <div
                className="col-span-12 lg:col-span-5 relative rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm h-full lg:h-[165px]"
                style={{ animationDelay: '0.85s' }}
                onClick={() => openDrawer({ type: 'SPEND_OVERTIME', title: 'Spend Over Time' })}
              >
                <div className="flex justify-between items-baseline mb-4">
                  <InfoTooltip text="Annual guest expenditure trends compared side-by-side (YTD).">
                    <div>
                      <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#374151] cursor-help">Spend Over Time</h3>
                      <p className="text-[10px] text-[#6B7280]">ANNUAL EXPENDITURE (USD)</p>
                    </div>
                  </InfoTooltip>
                </div>
                <div className="flex-1 min-h-[90px] w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={spendChartData} margin={{ top: 10, right: 10, left: 0, bottom: -5 }}>
                      <defs>
                        <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4B5563" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#4B5563" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fill: '#6B7280' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        width={38}
                        tick={{ fontSize: 8, fill: '#6B7280' }}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#E5E7EB',
                          borderRadius: '8px',
                          fontSize: '10px',
                          color: '#374151',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          padding: '4px 8px',
                        }}
                        formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Spend']}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#4B5563"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#spendGradient)"
                        dot={{ r: 3, fill: '#4B5563', stroke: '#ffffff', strokeWidth: 1.5 }}
                        activeDot={{ r: 5, fill: '#728F69' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
