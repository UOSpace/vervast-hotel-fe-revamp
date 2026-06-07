import { useSearchParams } from 'react-router-dom';
import { LiveOverviewMap } from '../components/widgets/LiveOverviewMap';
import { MetricWidget } from '../components/widgets/MetricWidget';
import { GlobalAlertsWidget } from '../components/widgets/GlobalAlertsWidget';
import { GuestMovementWidget } from '../components/widgets/GuestMovementWidget';
import { PortfolioPerformanceWidget } from '../components/widgets/PortfolioPerformanceWidget';
import { TopNationalitiesWidget } from '../components/widgets/TopNationalitiesWidget';
import { SentimentScoreWidget } from '../components/widgets/SentimentScoreWidget';
import { GuestArrivalsWidget } from '../components/widgets/GuestArrivalsWidget';
import { UsersGroupTwoRounded, Bed, TagPrice, Heart, Plate, Snowflake, Bus } from '@solar-icons/react';
import dashboardData from '../../../data/dashboardData.json';
import { LineChart, Line, ResponsiveContainer, XAxis, CartesianGrid, BarChart, Bar, YAxis, Cell, LabelList } from 'recharts';
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

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block ml-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
      <span className="cursor-help text-[#7d6b5e]/60 hover:text-[#C8A050] transition-colors text-[9px] border border-[#7d6b5e]/30 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center font-bold font-sans">
        ?
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-[#4a3c31] text-[#fdfaf7] text-[9.5px] rounded p-2 shadow-xl z-[90] pointer-events-none leading-normal font-normal normal-case tracking-normal text-left">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#4a3c31]" />
      </div>
    </div>
  );
}

import alpineImg from '../../../assets/contents/alpine.png';
import oceanImg from '../../../assets/contents/ocean.png';
import cityImg from '../../../assets/contents/city.png';
import forestImg from '../../../assets/contents/forest.png';
import desertImg from '../../../assets/contents/desert.png';
import countryImg from '../../../assets/contents/country.png';

const sentimentChartData = dashboardData.sentimentChartData;
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

const getNeedIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case 'wellness': return <Heart size={16} />;
    case 'family': return <UsersGroupTwoRounded size={16} />;
    case 'dining': return <Plate size={16} />;
    case 'ski': return <Snowflake size={16} />;
    case 'transport': return <Bus size={16} />;
    default: return <span>{label.charAt(0)}</span>;
  }
};

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') === 'by_resort_type' ? 'by_resort_type' : 'all';

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

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden">
      {/* Header */}
      <header className="shrink-0 flex flex-col mb-4 px-4 lg:px-6">
        {/* Welcome Card */}
        {view === 'all' && (
          <div className="w-full py-4 border-b border-[#d4c4b7]/40 animate-card-enter" style={{ animationDelay: '0.05s' }}>
            <p className="text-[10px] font-sans text-[#a65e52] tracking-widest uppercase mb-0.5 font-semibold">{getGreeting()}</p>
            <h2 className="text-2xl font-serif text-[#4a3c31] tracking-wide mb-1.5 flex items-center gap-2">
              <span>Welcome to SOSEI Galaxy</span>
            </h2>
            <p className="text-[#7d6b5e] text-xs font-serif italic max-w-2xl leading-relaxed">
              Crafting moments of serene hospitality, balancing seasonal rhythms, and welcoming the world with gentle grace.
            </p>
          </div>
        )}
        {view === 'by_resort_type' && (
          <div className="w-full py-4 border-b border-[#d4c4b7]/40 animate-card-enter" style={{ animationDelay: '0.05s' }}>
            <p className="text-[10px] font-sans text-[#a65e52] tracking-widest uppercase mb-0.5 font-semibold">{getGreeting()}</p>
            <h2 className="text-2xl font-serif text-[#4a3c31] tracking-wide mb-1.5 flex items-center gap-2">
              <span>Resort & Destination Analytics</span>
            </h2>
            <p className="text-[#7d6b5e] text-xs font-serif italic max-w-2xl leading-relaxed">
              Observing the unique flow of our sanctuaries, from mountain winds to ocean breeze.
            </p>
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
              <SelectItem value="by_resort_type" className="focus:bg-[#e5d8cb] focus:text-[#4a3c31] cursor-pointer">Global Snapshot by Resort Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Sakura transition overlay */}
      <SakuraTransition isActive={isTransitioning} phase={phase} />

      {/* Conditional View Rendering */}
      {view === 'by_resort_type' ? (
        <div key="resort" className="flex-1 min-h-0 flex flex-col">
          <ResortTypeDashboard />
        </div>
      ) : (
        <div key="all" className="flex-1 min-h-0 grid grid-cols-12 auto-rows-max gap-4 overflow-y-auto pb-6 px-4 lg:px-6 text-[10px] custom-scrollbar">

          {/* ROW 1-2: Map (45.83%) + Right Column (54.17%) — using flex for precise 10% adjustment */}
          <div className="col-span-12 flex gap-4">
            {/* Map — 45.83% */}
            <div
              className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col relative animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
              style={{ animationDelay: '0.1s', flex: '0 0 45.83%' }}
              onClick={() => openDrawer({ type: 'WORLD_MAP', title: 'World Map Details' })}
            >
              <div className="absolute top-4 left-4 z-10 flex items-center justify-between uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e] w-[calc(100%-4rem)]">
                <span>WORLD MAP</span>
                <InfoTooltip text="Interactive world map showing property, occupancy, ADR, and RevPAR." />
              </div>
              <span className="absolute top-4 right-4 z-10 text-[8px] font-sans text-[#a65e52] tracking-widest font-semibold uppercase bg-[#e5d8cb]/30 px-2 py-0.5 rounded border border-[#d4c4b7]/50">YTD</span>
              <LiveOverviewMap />
            </div>

            {/* Right Column — 54.17% */}
            <div className="flex flex-col gap-4" style={{ flex: '0 0 54.17%' }}>
              {/* Metrics Row */}
              <div className="grid grid-cols-5 gap-2">
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
            className="relative col-span-5 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
            style={{ animationDelay: '0.4s' }}
            onClick={() => openDrawer({ type: 'GUEST_MOVEMENT', title: 'Daily number of guests checked in' })}
          >
            <GuestMovementWidget />
          </div>
          <div
            className="relative col-span-3 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
            style={{ animationDelay: '0.45s' }}
            onClick={() => openDrawer({ type: 'PORTFOLIO_PERFORMANCE', title: 'Portfolio Performance' })}
          >
            <PortfolioPerformanceWidget />
          </div>
          <div
            className="relative col-span-2 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
            style={{ animationDelay: '0.5s' }}
            onClick={() => openDrawer({ type: 'TOP_NATIONALITIES', title: 'Top Nationalities' })}
          >
            <TopNationalitiesWidget />
          </div>
          <div
            className="relative col-span-2 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all"
            style={{ animationDelay: '0.55s' }}
            onClick={() => openDrawer({ type: 'SENTIMENT_SCORE', title: 'Sentiment Score' })}
          >
            <SentimentScoreWidget />
          </div>

          {/* ROW 4 */}
          <div
            className="relative col-span-3 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
            style={{ animationDelay: '0.6s' }}
            onClick={() => openDrawer({ type: 'GUEST_ARRIVALS', title: 'VVIP Arrivals' })}
          >
            <GuestArrivalsWidget />
          </div>

          {/* Top Guest Needs */}
          <div
            className="relative col-span-3 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
            style={{ animationDelay: '0.65s' }}
            onClick={() => openDrawer({ type: 'GUEST_NEEDS', title: 'Top Guest Needs' })}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31] mb-0">Top Guest Needs</h3>
              <InfoTooltip text="Top requested guest activities, amenities and services logged MTD." />
            </div>
            <div className="flex justify-between items-end px-2">
              {dashboardData.topGuestNeeds.map((need, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-[#947b66] mb-1 flex justify-center">{getNeedIcon(need.label)}</div>
                  <div className="font-bold">{need.percentage}</div>
                  <div className="text-[9px]">{need.label}</div>
                </div>
              ))}
            </div>
            <p className="text-[8px] text-[#7d6b5e] mt-2">Based on in-house guests</p>
          </div>

          {/* Notes From Yesterday & Image */}
          <div
            className="relative col-span-6 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex space-x-4 cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
            style={{ animationDelay: '0.7s' }}
            onClick={() => openDrawer({ type: 'NOTES_YESTERDAY', title: 'Notes From Yesterday' })}
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31] mb-0">Notes From Yesterday</h3>
                <InfoTooltip text="Diary log entries and comments submitted by resort general managers." />
              </div>
              <div className="text-[#947b66] text-xl font-serif leading-none">"</div>
              <p className="text-[10px] text-[#4a3c31] italic px-2">
                {dashboardData.notesFromYesterday.text}
              </p>
              <p className="text-[9px] text-[#947b66] text-right mt-1">— {dashboardData.notesFromYesterday.author}</p>
            </div>
            <div className="w-[180px] h-full rounded-lg bg-[#3b2f2f] overflow-hidden flex items-center justify-center">
              {/* Candlelight dinner image placeholder */}
              <div className="text-[#d4c4b7] text-[10px]">Candlelight Photo</div>
            </div>
          </div>

          {/* Journey Timeline */}
          <div
            className="relative col-span-5 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
            style={{ animationDelay: '0.75s' }}
            onClick={() => openDrawer({ type: 'JOURNEY_TIMELINE', title: 'Journey Timeline' })}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31] mb-0">Journey Timeline</h3>
              <InfoTooltip text="Historical milestone timeline tracking the launch of each SOSEI sanctuary." />
            </div>
            <div className="flex justify-between items-start mt-2 px-1">
              {[...journeyTimelineData1, ...journeyTimelineData2].map((j, i) => (
                <div key={i} className="flex flex-col items-center">
                  <img src={j.img} alt={j.name} className="w-10 h-10 rounded-full border-2 border-[#f3eae1] object-cover mb-2 shadow-sm" />
                  <div className="text-[8px] font-bold text-[#4a3c31] text-center">{j.date}</div>
                  <div className="text-[7px] text-[#7d6b5e] text-center">{j.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative col-span-4 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
            style={{ animationDelay: '0.8s' }}
            onClick={() => openDrawer({ type: 'SENTIMENT_SCORE', title: 'Sentiment Score' })}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31]">Sentiment Over Time</h3>
                <p className="text-[9px] text-[#7d6b5e] mb-0">Last 8 stays</p>
              </div>
              <InfoTooltip text="Visual trend rating of customer feedback logs over the past eight guest stays." />
            </div>

            <div className="flex justify-between items-center flex-1 my-2">
              <div className="text-[8px] text-[#947b66] space-y-1.5 shrink-0">
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#d4c4b7]"></span>Excellent</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#d4c4b7]"></span>Very Good</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#947b66]"></span>Good</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#d4c4b7]"></span>Fair</div>
              </div>

              <div className="flex-1 min-w-[120px] h-full mx-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentChartData} margin={{ top: 10, right: 10, left: 0, bottom: -5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d4c4b7" opacity={0.3} />
                    <Line type="natural" dataKey="value" stroke="#947b66" strokeWidth={1.5} dot={{ r: 3, fill: '#d4c4b7', stroke: '#947b66', strokeWidth: 1.5 }} activeDot={{ r: 4 }} isAnimationActive={false} />
                    <XAxis dataKey="name" axisLine={{ stroke: '#4a3c31' }} tickLine={false} tick={{ fontSize: 7, fill: '#7d6b5e' }} dy={5} interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 7, fill: '#7d6b5e' }} domain={[0, 5]} width={20} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col items-center justify-center shrink-0 w-14 h-14 rounded-full border-[3px] border-[#d4c4b7] relative shadow-inner bg-gradient-to-br from-[#f3eae1] to-[#e5d8cb]">
                <div className="absolute inset-0 rounded-full border-[3px] border-[#a67138] border-t-transparent border-l-transparent rotate-45"></div>
                <div className="text-lg font-bold text-[#4a3c31] leading-none mt-1">4.8<span className="text-[8px]">/5</span></div>
                <div className="text-[6px] text-[#4a3c31]">Excellent</div>
              </div>
            </div>

            <div className="text-[9px] text-[#947b66] cursor-pointer mt-1">View feedback history →</div>
          </div>

          <div
            className="relative col-span-3 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all animate-card-enter bg-[#f3eae1]/30 backdrop-blur-sm"
            style={{ animationDelay: '0.85s' }}
            onClick={() => openDrawer({ type: 'SPEND_OVERTIME', title: 'Spend Over Time' })}
          >
            <div className="flex justify-between items-baseline mb-4">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31] mb-0">Spend Over Time <span className="text-[#947b66]">(USD)</span></h3>
                <InfoTooltip text="Annual guest expenditure trends compared side-by-side (MTD)." />
              </div>
              <span className="text-[8px] text-[#4a3c31]">Year to date</span>
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
            <div className="text-[9px] text-[#947b66] cursor-pointer mt-2">View spending analytics →</div>
          </div>
        </div>
      )}
    </div>
  );
}
