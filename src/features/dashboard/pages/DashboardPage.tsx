import { LiveOverviewMap } from '../components/widgets/LiveOverviewMap';
import { MetricWidget } from '../components/widgets/MetricWidget';
import { GlobalAlertsWidget } from '../components/widgets/GlobalAlertsWidget';
import { GuestMovementWidget } from '../components/widgets/GuestMovementWidget';
import { PortfolioPerformanceWidget } from '../components/widgets/PortfolioPerformanceWidget';
import { TopNationalitiesWidget } from '../components/widgets/TopNationalitiesWidget';
import { SentimentScoreWidget } from '../components/widgets/SentimentScoreWidget';
import { GuestArrivalsWidget } from '../components/widgets/GuestArrivalsWidget';
import { UsersGroupTwoRounded, Bed, TagPrice, ClockCircle, Heart, Plate, Snowflake, Bus } from '@solar-icons/react';
import dashboardData from '../../../data/dashboardData.json';
import { LineChart, Line, ResponsiveContainer, XAxis, BarChart, Bar, YAxis, Cell, LabelList } from 'recharts';

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
  switch(label.toLowerCase()) {
    case 'wellness': return <Heart size={16} />;
    case 'family': return <UsersGroupTwoRounded size={16} />;
    case 'dining': return <Plate size={16} />;
    case 'ski': return <Snowflake size={16} />;
    case 'transport': return <Bus size={16} />;
    default: return <span>{label.charAt(0)}</span>;
  }
};

export function DashboardPage() {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-serif text-[#4a3c31] mb-1">Global Snapshot.</h1>
          <p className="text-[#7d6b5e] text-sm italic font-serif">One rhythm across every world.</p>
        </div>
      </header>

      {/* Main Grid: Card-based layout with gaps */}
      <div className="flex-1 min-h-0 grid grid-cols-12 grid-rows-[auto_1fr_1fr_1fr] gap-4 overflow-y-auto pb-6 text-[10px]">

        {/* ROW 1: Map (col 1-7) & Metrics (col 8-12) */}
        <div className="col-span-7 row-span-2 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col  backdrop-blur-sm">
          <LiveOverviewMap />
        </div>

        <div className="col-span-5 row-span-1 grid grid-cols-4 gap-4">
          <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col  backdrop-blur-sm">
            <MetricWidget
              title={dashboardData.metrics.guestsToday.title} value={dashboardData.metrics.guestsToday.value} trendText={dashboardData.metrics.guestsToday.trendText} trendUp={dashboardData.metrics.guestsToday.trendUp}
              icon={<UsersGroupTwoRounded size={16} />} data={dashboardData.metrics.guestsToday.data} color={dashboardData.metrics.guestsToday.color}
            />
          </div>
          <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col  backdrop-blur-sm">
            <MetricWidget
              title={dashboardData.metrics.occupancy.title} value={dashboardData.metrics.occupancy.value} trendText={dashboardData.metrics.occupancy.trendText} trendUp={dashboardData.metrics.occupancy.trendUp}
              icon={<Bed size={16} />} data={dashboardData.metrics.occupancy.data} color={dashboardData.metrics.occupancy.color}
            />
          </div>
          <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col  backdrop-blur-sm">
            <MetricWidget
              title={dashboardData.metrics.revPar.title} value={dashboardData.metrics.revPar.value} trendText={dashboardData.metrics.revPar.trendText} trendUp={dashboardData.metrics.revPar.trendUp}
              icon={<TagPrice size={16} />} data={dashboardData.metrics.revPar.data} color={dashboardData.metrics.revPar.color}
            />
          </div>
          <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col  backdrop-blur-sm">
            <MetricWidget
              title={dashboardData.metrics.avgLengthOfStay.title} value={dashboardData.metrics.avgLengthOfStay.value} trendText={dashboardData.metrics.avgLengthOfStay.trendText} trendUp={dashboardData.metrics.avgLengthOfStay.trendUp}
              icon={<ClockCircle size={16} />} data={dashboardData.metrics.avgLengthOfStay.data} color={dashboardData.metrics.avgLengthOfStay.color}
            />
          </div>
        </div>

        {/* ROW 2 (Part of Right Column): Global Alerts */}
        <div className="col-span-5 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col  backdrop-blur-sm">
          <GlobalAlertsWidget />
        </div>

        {/* ROW 3 */}
        <div className="col-span-5 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col  backdrop-blur-sm">
          <GuestMovementWidget />
        </div>
        <div className="col-span-3 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col  backdrop-blur-sm">
          <PortfolioPerformanceWidget />
        </div>
        <div className="col-span-2 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col  backdrop-blur-sm">
          <TopNationalitiesWidget />
        </div>
        <div className="col-span-2 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col  backdrop-blur-sm">
          <SentimentScoreWidget />
        </div>

        {/* ROW 4 */}
        <div className="col-span-3 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col  backdrop-blur-sm">
          <GuestArrivalsWidget />
        </div>

        {/* Top Guest Needs */}
        <div className="col-span-3 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between  backdrop-blur-sm">
          <div className="mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31]">Top Guest Needs Today</h3>
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
        <div className="col-span-6 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 flex space-x-4  backdrop-blur-sm">
          <div className="flex-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31] mb-2">Notes From Yesterday</h3>
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

        {/* ROW 5 (Final Row) */}
        <div className="col-span-5 row-span-1 flex gap-4">
          <div className="flex-1 border border-[#d4c4b7] rounded-[12px] p-4 backdrop-blur-sm flex flex-col justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31] mb-2">Journey Timeline</h3>
            <div className="flex justify-between items-start mt-2 px-1">
              {journeyTimelineData1.map((j, i) => (
                <div key={i} className="flex flex-col items-center">
                  <img src={j.img} alt={j.name} className="w-10 h-10 rounded-full border-2 border-[#f3eae1] object-cover mb-2 shadow-sm" />
                  <div className="text-[8px] font-bold text-[#4a3c31] text-center">{j.date}</div>
                  <div className="text-[8px] text-[#4a3c31] text-center">{j.name}</div>
                  <div className="text-[7px] text-[#7d6b5e] text-center">{j.location}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 border border-[#d4c4b7] rounded-[12px] p-4 backdrop-blur-sm flex flex-col justify-end">
            <div className="flex justify-between items-start mt-2 px-1">
              {journeyTimelineData2.map((j, i) => (
                <div key={i} className="flex flex-col items-center">
                  <img src={j.img} alt={j.name} className="w-10 h-10 rounded-full border-2 border-[#f3eae1] object-cover mb-2 shadow-sm" />
                  <div className="text-[8px] font-bold text-[#4a3c31] text-center">{j.date}</div>
                  <div className="text-[8px] text-[#4a3c31] text-center">{j.name}</div>
                  <div className="text-[7px] text-[#7d6b5e] text-center">{j.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-4 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31]">Sentiment Over Time</h3>
            <p className="text-[9px] text-[#7d6b5e] mb-2">Last 8 stays</p>
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
                <LineChart data={sentimentChartData} margin={{ top: 10, right: 10, left: 10, bottom: -5 }}>
                  <Line type="natural" dataKey="value" stroke="#947b66" strokeWidth={1.5} dot={{ r: 3, fill: '#d4c4b7', stroke: '#947b66', strokeWidth: 1.5 }} activeDot={{ r: 4 }} isAnimationActive={false} />
                  <XAxis dataKey="name" axisLine={{ stroke: '#4a3c31' }} tickLine={false} tick={{ fontSize: 7, fill: '#7d6b5e' }} dy={5} />
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

        <div className="col-span-3 row-span-1 border border-[#d4c4b7] rounded-[12px] p-4 backdrop-blur-sm flex flex-col justify-between">
          <div className="flex justify-between items-baseline mb-4">
             <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31]">Spend Over Time <span className="text-[#947b66]">(USD)</span></h3>
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
    </div>
  );
}
