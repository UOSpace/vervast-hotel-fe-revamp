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
import { LineChart, Line, ResponsiveContainer, XAxis, BarChart, Bar, YAxis, Cell, LabelList, PieChart, Pie, Tooltip } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { ResortTypeDashboard } from './ResortTypeDashboard';
import { SakuraTransition, useSakuraTransition } from '../components/SakuraTransition';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { InfoTooltip } from '../../common/components/InfoTooltip';

import alpineImg from '../../../assets/contents/alpine.png';
import oceanImg from '../../../assets/contents/ocean.png';
import cityImg from '../../../assets/contents/city.png';
import forestImg from '../../../assets/contents/forest.png';
import desertImg from '../../../assets/contents/desert.png';
import countryImg from '../../../assets/contents/country.png';

const spendChartData = dashboardData.spendOverTime;

// Generate last 8 days for Sentiment Over Time (today + 7 days back)
const generateLast8Days = () => {
  const days: { name: string; value: number }[] = [];
  const values = [3.5, 4.7, 3.8, 4.0, 4.3, 4.5, 4.6, 4.8];
  for (let i = 7; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: values[7 - i],
    });
  }
  return days;
};

const last8DaysChartData = generateLast8Days();

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

const getNeedIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case 'wellness': return <Heart size={28} />;
    case 'family': return <UsersGroupTwoRounded size={28} />;
    case 'dining': return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    );
    case 'ski': return <Snowflake size={28} />;
    case 'transport': return <Plain size={28} />;
    default: return <span>{label.charAt(0)}</span>;
  }
};

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') === 'by_property_type' ? 'by_property_type' : 'all';

  const { phase, trigger } = useSakuraTransition();
  const { openDrawer } = useDashboardDrawer();

  const handleViewChange = (newView: string) => {
    if (newView === view) return;
    trigger(() => {
      setSearchParams({ view: newView }, { replace: true });
    });
  };

  const isTransitioning = phase !== 'idle';

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
          <div className="w-full py-4 border-b border-[#d4c4b7]/40 animate-card-enter flex justify-between items-end" style={{ animationDelay: '0.05s' }}>
            <div>
              <p className="text-[10px] font-sans text-[#a65e52] tracking-widest uppercase mb-0.5 font-semibold">{getGreeting()}</p>
              <h2 className="text-2xl font-serif text-[#4a3c31] tracking-wide mb-1.5 flex items-center gap-2">
                <span>Welcome to SOSEI Galaxy</span>
              </h2>
              <p className="text-[#7d6b5e] text-xs font-serif italic max-w-2xl leading-relaxed">
                Crafting moments of serene hospitality, balancing seasonal rhythms, and welcoming the world with gentle grace.
              </p>
            </div>
            <div className="text-right shrink-0 ml-4 pt-0.5 pb-0.5">
              <p className="text-[10px] text-[#4a3c31] font-semibold">{date}</p>
              <p className="text-[9px] text-[#947b66]">{time} · {tz}</p>
            </div>
          </div>
        )}
        {view === 'by_property_type' && (
          <div className="w-full py-4 border-b border-[#d4c4b7]/40 animate-card-enter flex justify-between items-end" style={{ animationDelay: '0.05s' }}>
            <div>
              <p className="text-[10px] font-sans text-[#a65e52] tracking-widest uppercase mb-0.5 font-semibold">{getGreeting()}</p>
              <h2 className="text-2xl font-serif text-[#4a3c31] tracking-wide mb-1.5 flex items-center gap-2">
                <span>Resort & Destination Analytics</span>
              </h2>
              <p className="text-[#7d6b5e] text-xs font-serif italic max-w-2xl leading-relaxed">
                Observing the unique flow of our sanctuaries, from mountain winds to ocean breeze.
              </p>
            </div>
            <div className="text-right shrink-0 ml-4 pt-0.5 pb-0.5">
              <p className="text-[10px] text-[#4a3c31] font-semibold">{date}</p>
              <p className="text-[9px] text-[#947b66]">{time} · {tz}</p>
            </div>
          </div>
        )}

        {/* Dropdown Filter */}
        <div className="flex items-center">
          <Select value={view} onValueChange={handleViewChange} disabled={isTransitioning}>
            <SelectTrigger className="w-[260px] bg-[#f3eae1]/90 backdrop-blur-sm border-[#d4c4b7] text-[#4a3c31] focus:ring-[#947b66] h-10 rounded-[8px] font-medium shadow-sm">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent className="bg-[#f3eae1] border-[#d4c4b7] text-[#4a3c31]">
              <SelectItem value="all" className="focus:bg-[#e5d8cb] focus:text-[#4a3c31] cursor-pointer">Global Snapshot All</SelectItem>
              <SelectItem value="by_property_type" className="focus:bg-[#e5d8cb] focus:text-[#4a3c31] cursor-pointer">Global Snapshot by Property Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Sakura transition overlay */}
      <SakuraTransition isActive={isTransitioning} phase={phase} />

      {/* Conditional View Rendering */}
      {view === 'by_property_type' ? (
        <div key="resort" className="flex-1 flex flex-col">
          <ResortTypeDashboard />
        </div>
      ) : (
        <div key="all" className="grid grid-cols-12 auto-rows-max gap-4 pb-6 px-4 lg:px-6 text-[10px]">

          {/* ROW 1-2: Map (45.83%) + Right Column (54.17%) — using flex for precise 10% adjustment */}
          <div className="col-span-12 flex flex-col lg:flex-row gap-4">
            {/* Map — 45.83% */}
            <div
              className="w-full lg:w-[45.83%] shrink-0 border border-[#d4c4b7] rounded-[12px] p-2 flex flex-col relative animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm transition-all z-10 hover:z-30"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e]">WORLD MAP</span>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-sans text-[#947b66]/70 tracking-widest font-semibold uppercase bg-[#e5d8cb]/30 px-1.5 py-0.5 rounded border border-[#d4c4b7]/50 leading-none">YTD</span>
                  <InfoTooltip text="Interactive world map showing property, occupancy, ADR, and RevPAR." />
                </div>
              </div>
              <LiveOverviewMap />
              <div className="text-[9px] text-[#a65e52] font-semibold hover:underline mt-auto self-end flex items-center gap-1 cursor-pointer"
                onClick={() => openDrawer({ type: 'WORLD_MAP', title: 'World Map Details' })}
              >
                See details <RoundAltArrowRight size={10} />
              </div>
            </div>

            {/* Right Column — 54.17% */}
            <div className="w-full lg:w-[54.17%] flex flex-col gap-4">
              {/* Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {/* Number of Guests */}
                <div
                  className="relative border border-[#d4c4b7] rounded-[12px] p-2 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
                  style={{ animationDelay: '0.15s' }}
                  onClick={() => openDrawer({ type: 'METRIC', title: dashboardData.metrics.guestsToday.title, data: dashboardData.metrics.guestsToday.value })}
                >
                  <MetricWidget
                    title={dashboardData.metrics.guestsToday.title} value={dashboardData.metrics.guestsToday.value} trendText={dashboardData.metrics.guestsToday.trendText} trendUp={dashboardData.metrics.guestsToday.trendUp}
                    icon={<UsersGroupTwoRounded size={14} />} data={dashboardData.metrics.guestsToday.data} color={dashboardData.metrics.guestsToday.color}
                  />
                </div>
                {/* Occupancy */}
                <div
                  className="relative border border-[#d4c4b7] rounded-[12px] p-2 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
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
                  className="relative border border-[#d4c4b7] rounded-[12px] p-2 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
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
                  className="relative border border-[#d4c4b7] rounded-[12px] p-2 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
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
                  className="relative border border-[#d4c4b7] rounded-[12px] p-2 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
                  style={{ animationDelay: '0.35s' }}
                  onClick={() => openDrawer({ type: 'METRIC', title: dashboardData.metrics.revPar.title, data: dashboardData.metrics.revPar.value })}
                >
                  <MetricWidget
                    title={dashboardData.metrics.revPar.title} value={dashboardData.metrics.revPar.value} trendText={dashboardData.metrics.revPar.trendText} trendUp={dashboardData.metrics.revPar.trendUp}
                    icon={<TagPrice size={14} />} data={dashboardData.metrics.revPar.data} color={dashboardData.metrics.revPar.color}
                  />
                </div>
              </div>

              {/* Global Alerts */}
              <div
                className="relative border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#a65e52]/50 hover:z-20 transition-all"
                style={{ animationDelay: '0.35s' }}
                onClick={() => openDrawer({ type: 'ALERTS', title: 'Global Alerts & Insights' })}
              >
                <GlobalAlertsWidget />
              </div>
            </div>
          </div>

          {/* ROW 3 */}
          <div
            className="relative col-span-12 lg:col-span-5 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
            style={{ animationDelay: '0.4s' }}
            onClick={() => openDrawer({ type: 'GUEST_MOVEMENT', title: 'Daily number of guests checked in' })}
          >
            <GuestMovementWidget />
          </div>
          <div
            className="relative col-span-12 lg:col-span-3 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
            style={{ animationDelay: '0.45s' }}
            onClick={() => openDrawer({ type: 'PORTFOLIO_PERFORMANCE', title: 'Portfolio Performance' })}
          >
            <PortfolioPerformanceWidget />
          </div>
          <div
            className="relative col-span-12 lg:col-span-2 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
            style={{ animationDelay: '0.5s' }}
            onClick={() => openDrawer({ type: 'TOP_NATIONALITIES', title: 'Top Nationalities' })}
          >
            <TopNationalitiesWidget />
          </div>
          <div
            className="relative col-span-12 lg:col-span-2 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
            style={{ animationDelay: '0.55s' }}
            onClick={() => openDrawer({ type: 'SENTIMENT_SCORE', title: 'Sentiment Score' })}
          >
            <SentimentScoreWidget />
          </div>

          {/* ROW 4 */}
          <div
            className="relative col-span-12 lg:col-span-3 row-span-1 border border-[#d4c4b7] rounded-[12px] p-3 flex flex-col cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
            style={{ animationDelay: '0.6s' }}
            onClick={() => openDrawer({ type: 'GUEST_ARRIVALS', title: 'VVIP Arrivals' })}
          >
            <GuestArrivalsWidget />
          </div>

          {/* Top Guest Needs */}
          <div
            className="relative col-span-12 lg:col-span-4 row-span-1 border border-[#d4c4b7] rounded-[12px] p-3 flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
            style={{ animationDelay: '0.65s' }}
            onClick={() => openDrawer({ type: 'GUEST_NEEDS', title: 'Top Guest Needs' })}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] mb-0">Top Guest Needs</h3>
              <InfoTooltip text="Top requested guest activities, amenities and services logged MTD." />
            </div>
            <div className="flex justify-between items-end px-2">
              {dashboardData.topGuestNeeds.map((need, idx) => (
                <div key={idx} className={`text-center flex-1 border-r border-[#d4c4b7]/40 last:border-r-0 ${idx > 0 ? 'pl-2' : ''}`}>
                  <div className="text-[#947b66] mb-1 flex justify-center">{getNeedIcon(need.label)}</div>
                  <div className="font-bold text-[11px]">{need.percentage}</div>
                  <div className="text-[10px]">{need.label}</div>
                </div>
              ))}
            </div>
            <p className="text-[8px] text-[#7d6b5e]">Based on in-house guests</p>
          </div>

          {/* Notes From Yesterday & Image */}
          <div
            className="relative col-span-12 lg:col-span-5 row-span-1 border border-[#d4c4b7] rounded-[12px] p-3 flex flex-col sm:flex-row gap-3 items-stretch cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
            style={{ animationDelay: '0.7s' }}
            onClick={() => openDrawer({ type: 'NOTES_YESTERDAY', title: 'Notes From Yesterday' })}
          >
            <div className="flex-1 flex flex-col overflow-hidden justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31]">Notes From Yesterday</h3>
                <InfoTooltip text="Diary log entries and comments submitted by resort general managers." />
              </div>
              <p className="text-[13px] text-[#4a3c31] italic leading-relaxed my-auto py-2">
                <span className="text-[#947b66] text-5xl font-serif leading-[0.6] float-left mr-1.5 -mt-0.5 not-italic">&ldquo;</span>
                {dashboardData.notesFromYesterday.text}
              </p>
              <p className="text-[11px] text-[#947b66] text-right">— {dashboardData.notesFromYesterday.author}</p>
            </div>
            <div className="w-[160px] relative shrink-0">
              <img src={cityImg} alt="Candlelight dinner" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
            </div>
          </div>

          {/* Journey Timeline */}
          <div
            className="relative col-span-12 lg:col-span-5 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
            style={{ animationDelay: '0.75s' }}
            onClick={() => openDrawer({ type: 'JOURNEY_TIMELINE', title: 'Journey Timeline' })}
          >
            <div className="flex justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31] mb-0">Journey Timeline</h3>
              <InfoTooltip text="Historical milestone timeline tracking the launch of each SOSEI sanctuary." />
            </div>
            <div className="flex justify-between items-start mt-2 px-1 overflow-x-auto custom-scrollbar gap-4 md:gap-0 pb-2 md:pb-0">
              {[...journeyTimelineData1, ...journeyTimelineData2].map((j, i) => (
                <div key={i} className="flex flex-col items-center shrink-0 min-w-[72px] md:min-w-0">
                  <img src={j.img} alt={j.name} className="w-[50px] h-[50px] md:w-[66px] md:h-[66px] rounded-full border-2 border-[#f3eae1] object-cover mb-2 shadow-sm" />
                  <div className="text-[9px] font-bold text-[#4a3c31] text-center">{j.date}</div>
                  <div className="text-[8px] text-[#7d6b5e] text-center">{j.name}</div>
                  <div className="text-[7px] text-[#947b66] text-center italic mt-0.5">{j.location}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative col-span-12 lg:col-span-4 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
            style={{ animationDelay: '0.8s' }}
            onClick={() => openDrawer({ type: 'SENTIMENT_OVER_TIME', title: 'Sentiment Over Time' })}
          >
            <div className="flex flex-col justify-between mb-2">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31]">Sentiment Over Time</h3>
                  <p className="text-[9px] text-[#7d6b5e] mb-0">Last 8 stays</p>
                </div>
                <InfoTooltip text="Visual trend rating of customer feedback logs over the past eight guest stays." />
              </div>
              <div className="flex flex-col gap-2 flex-1 my-1">
                <div className="flex items-center gap-4 flex-1">
                  {/* Line Chart */}
                  <div className="flex-1 h-[76px] min-w-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={last8DaysChartData} margin={{ top: 5, right: 15, left: 15, bottom: 5 }}>
                        <Tooltip contentStyle={{ backgroundColor: '#f3eae1', border: '1px solid #d4c4b7', borderRadius: '6px', fontSize: '10px' }} />
                        <Line type="natural" dataKey="value" name="Sentiment" stroke="#947b66" strokeWidth={1.5} dot={{ r: 2, fill: '#d4c4b7', stroke: '#947b66', strokeWidth: 1 }} isAnimationActive={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 7, fill: '#7d6b5e' }} dy={8} interval={0} />
                        <YAxis hide domain={[0, 5]} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Donut */}
                  <div className="relative w-[72px] h-[72px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Excellent', value: 3, color: '#657454' },
                            { name: 'Very Good', value: 2, color: '#C8A050' },
                            { name: 'Good', value: 2, color: '#947b66' },
                            { name: 'Fair', value: 1, color: '#a65e52' },
                          ]}
                          cx="50%" cy="50%" innerRadius={24} outerRadius={30} paddingAngle={2}
                          dataKey="value" stroke="none"
                        >
                          <Cell fill="#657454" />
                          <Cell fill="#C8A050" />
                          <Cell fill="#947b66" />
                          <Cell fill="#a65e52" />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#f3eae1', border: '1px solid #d4c4b7', borderRadius: '6px', fontSize: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-sm font-bold text-[#4a3c31] leading-none">4.8</span>
                      <span className="text-[7px] text-[#7d6b5e]">/5</span>
                    </div>
                  </div>
                </div>

                {/* Legend with values below the chart */}
                <div className="flex justify-center gap-3 text-[8px] whitespace-nowrap border-t border-[#d4c4b7]/30 pt-1.5 mt-1">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#657454]"></span>
                    <span className="text-[#4a3c31]">Excellent <span className="text-[#947b66]">(3)</span></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8A050]"></span>
                    <span className="text-[#4a3c31]">Very Good <span className="text-[#947b66]">(2)</span></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#947b66]"></span>
                    <span className="text-[#4a3c31]">Good <span className="text-[#947b66]">(2)</span></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a65e52]"></span>
                    <span className="text-[#4a3c31]">Fair <span className="text-[#947b66]">(1)</span></span>
                  </div>
                </div>
              </div>       </div>
          </div>

          <div
            className="relative col-span-12 lg:col-span-3 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
            style={{ animationDelay: '0.85s' }}
            onClick={() => openDrawer({ type: 'SPEND_OVERTIME', title: 'Spend Over Time' })}
          >
            <div className="flex justify-between items-baseline mb-4">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31] mb-0">Spend Over Time <span className="text-[#947b66]">(USD)</span></h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-sans text-[#947b66]/70 tracking-widest font-semibold uppercase bg-[#e5d8cb]/30 px-1.5 py-0.5 rounded border border-[#d4c4b7]/50">YTD</span>
                <InfoTooltip text="Annual guest expenditure trends compared side-by-side (YTD)." />
              </div>
            </div>
            <div className="flex-1 min-h-[90px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendChartData} layout="vertical" margin={{ top: 0, right: 35, left: -10, bottom: 0 }} barSize={7}>
                  <XAxis type="number" hide={true} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#4a3c31' }} width={50} />
                  <Bar dataKey="value" radius={[10, 10, 10, 10]} isAnimationActive={false}>
                    <LabelList dataKey="value" position="right" formatter={(val: any) => `$${Number(val).toLocaleString()}`} fill="#4a3c31" fontSize={9} />
                    {spendChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
