import { useState } from 'react';
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Calendar,
  AltArrowDown,
  Heart,
  Settings,
  Star,
  Cup,
  WineglassTriangle
} from '@solar-icons/react';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { UnderDevelopmentModal } from '../../../components/ui/UnderDevelopmentModal';
import { InfoTooltip } from '../../common/components/InfoTooltip';

// Mock Data
const experienceBookingsOverTime = [
  { name: 'May 1', value: 380 },
  { name: 'May 8', value: 530 },
  { name: 'May 15', value: 410 },
  { name: 'May 22', value: 680 },
  { name: 'May 29', value: 610 },
  { name: 'May 31', value: 892 }
];

const experiencesByCategory = [
  { name: 'Water & Marine', value: 32, color: '#18181b' },
  { name: 'Nature & Adventure', value: 24, color: '#3f3f46' },
  { name: 'Cultural & Local', value: 17, color: '#52525b' },
  { name: 'Wellness & Mindfulness', value: 15, color: '#71717a' },
  { name: 'Private & Bespoke', value: 8, color: '#a1a1aa' },
  { name: 'Other', value: 4, color: '#d4d4d8' }
];

const topExperiences = [
  { name: 'Sunset Cruise', category: 'Ocean', count: 312 },
  { name: 'Private Island Picnic', category: 'Ocean', count: 278 },
  { name: 'Guided Forest Hike', category: 'Alpine', count: 246 },
  { name: 'Wellness Journey', category: 'Sanctuary', count: 212 },
  { name: 'Cultural Village Visit', category: 'Desert', count: 184 }
];

const experienceRevenueByProperty = [
  { name: 'SOSEI Ocean', value: 78620, pct: 41 },
  { name: 'SOSEI Alpine', value: 54310, pct: 28 },
  { name: 'SOSEI Forest', value: 31400, pct: 16 },
  { name: 'SOSEI Desert', value: 15230, pct: 8 },
  { name: 'SOSEI City', value: 9680, pct: 5 }
];

const fnbRevenueOverTime = [
  { name: 'May 1', value: 10.2 },
  { name: 'May 8', value: 12.8 },
  { name: 'May 15', value: 9.5 },
  { name: 'May 22', value: 14.1 },
  { name: 'May 29', value: 11.8 },
  { name: 'May 31', value: 16.4 }
];

const revenueByOutlet = [
  { name: 'Seascape Restaurant', value: 186420, covers: '1,420', trend: '+14% YoY' },
  { name: 'Terra Pavilion', value: 112380, covers: '980', trend: '+18% YoY' },
  { name: 'Alpine Grill', value: 84760, covers: '740', trend: '+9% YoY' },
  { name: 'The Tea Lounge', value: 61240, covers: '620', trend: '+12% YoY' },
  { name: 'In-Villa Dining', value: 46810, covers: '380', trend: '+6% YoY' },
  { name: 'Poolside Bar', value: 20840, covers: '310', trend: '+22% YoY' }
];

const topPerformingOutlets = [
  { name: 'Seascape Restaurant', value: 245, total: 300 },
  { name: 'Terra Pavilion', value: 198, total: 300 },
  { name: 'Alpine Grill', value: 176, total: 300 },
  { name: 'The Tea Lounge', value: 142, total: 300 },
  { name: 'Poolside Bar', value: 118, total: 300 }
];

const fnbMixBreakdown = [
  { name: 'Food', value: 62, color: '#18181b' },
  { name: 'Beverage', value: 23, color: '#3f3f46' },
  { name: 'In-Villa Dining', value: 10, color: '#71717a' },
  { name: 'Events & Private Dining', value: 5, color: '#a1a1aa' }
];

const experienceTypePerformance = [
  { name: 'Water & Marine', rating: 4.8 },
  { name: 'Nature & Adventure', rating: 4.7 },
  { name: 'Cultural & Local', rating: 4.6 },
  { name: 'Wellness & Mindfulness', rating: 4.8 },
  { name: 'Private & Bespoke', rating: 4.9 }
];

const upcomingHighlights = [
  { title: 'Full Moon Dinner', date: 'Jun 2, 7:00 PM', count: '24 Reservations' },
  { title: 'Sunrise Yoga Experience', date: 'Jun 4, 6:30 AM', count: '18 Reservations' },
  { title: 'Chef\'s Table Experience', date: 'Jun 7, 7:00 PM', count: '12 Reservations' },
  { title: 'Whale Watching Cruise', date: 'Jun 9, 8:00 AM', count: '20 Reservations' }
];

const heatmapOutlets = [
  'Seascape Restaurant',
  'Terra Pavilion',
  'Alpine Grill',
  'The Tea Lounge',
  'Poolside Bar',
  'In-Villa Dining'
];
const heatmapTimes = ['7 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
const heatmapData = [
  [2, 3, 5, 2, 5, 4],
  [4, 4, 3, 2, 4, 5],
  [1, 2, 4, 2, 5, 5],
  [2, 5, 4, 5, 3, 1],
  [1, 2, 4, 5, 4, 2],
  [4, 3, 3, 2, 4, 5]
];

export function FnbDashboardPage() {
  const [startDate, setStartDate] = useState<Date | null>(new Date('2026-05-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2026-05-31'));
  const { openDrawer } = useDashboardDrawer();
  const [showDevModal, setShowDevModal] = useState(false);
  const [devFeatureName, setDevFeatureName] = useState<string | undefined>(undefined);

  const openDevModal = (name?: string) => {
    setDevFeatureName(name);
    setShowDevModal(true);
  };

  // Pure SVG Donut calculations for Experiences by Category
  const donutSize = 110;
  const donutStrokeWidth = 14;
  const donutRadius = (donutSize - donutStrokeWidth) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let expAccumulated = 0;

  // Pure SVG Donut calculations for F&B Mix
  let fnbAccumulated = 0;

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 text-[10px]">

      {/* Header Widget */}
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 lg:pt-6 animate-card-enter">
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-widest text-zinc-500">Experience Intelligence</span>
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 leading-tight mt-0.5">Experiences & F&B Dashboard</h1>
          <p className="text-[10px] text-zinc-500 font-normal mt-0.5">Curated experiences. Memorable moments. Measurable impact.</p>
        </div>

        {/* DatePicker & Export */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center bg-white border border-zinc-200 rounded-lg px-3 py-1.5 cursor-pointer shadow-xs">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update: [Date | null, Date | null]) => {
                setStartDate(update[0]);
                setEndDate(update[1]);
              }}
              dateFormat="MMM d, yyyy"
              placeholderText="Select Date Range"
              className="bg-transparent border-none text-zinc-900 text-[10px] focus:outline-none font-medium w-[150px] cursor-pointer"
            />
            <Calendar size={13} className="text-zinc-400 ml-1.5" />
          </div>
          <button
            onClick={() => openDevModal('Export Report')}
            className="h-8.5 border border-zinc-200 text-zinc-800 hover:bg-zinc-100 rounded-lg text-[10px] px-3.5 font-medium flex items-center gap-2 bg-white transition-all shadow-xs cursor-pointer"
          >
            <AltArrowDown size={14} className="rotate-180 text-zinc-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Row 1: KPI Grid (6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-card-enter">
        {[
          { label: 'TOTAL EXPERIENCES BOOKED', value: '1,864', key: 'TOTAL_EXPERIENCES' },
          { label: 'TOTAL F&B REVENUE (USD)', value: '$512,450', key: 'TOTAL_FNB_REVENUE' },
          { label: 'AVG SPEND PER PERSON', value: '$142', key: 'AVERAGE_SPEND' },
          { label: 'EXPERIENCE REVENUE (USD)', value: '$189,320', key: 'EXPERIENCE_REVENUE' },
          { label: 'REPEAT EXPERIENCE RATE', value: '38%', key: 'REPEAT_RATE' },
          { label: 'GUEST SATISFACTION', value: '4.7 / 5', key: 'SATISFACTION' },
        ].map((kpi, idx) => (
          <div
            key={kpi.label}
            onClick={() => openDrawer({ type: 'METRIC', title: kpi.label, data: kpi.value })}
            className="relative rounded-[12px] p-4 flex flex-col justify-between transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-[90px]"
            style={{ animationDelay: `${0.05 + idx * 0.03}s` }}
          >
            <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate">
              {kpi.label}
            </span>
            <h3 className="text-[22px] font-normal text-zinc-900 leading-none mt-auto">
              {kpi.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Row 2: 4 Experience Analytics Cards (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-card-enter" style={{ animationDelay: '0.2s' }}>
        
        {/* 1. Experience Bookings Over Time */}
        <div
          onClick={() => openDrawer({ type: 'METRIC', title: 'Experience Bookings Over Time', data: 'Trend Chart' })}
          className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter min-h-[220px] justify-between"
        >
          <div className="flex justify-between items-center mb-1 h-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Experience Bookings Over Time</h3>
            <span className="text-[9.5px] font-medium text-zinc-500">May 31: 892</span>
          </div>

          <div className="flex-1 w-full h-[140px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={experienceBookingsOverTime} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', fontSize: '10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Line type="monotone" dataKey="value" stroke="#18181b" strokeWidth={2} dot={{ r: 3, fill: '#18181b' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Experiences by Category (Pure SVG Donut) */}
        <div
          onClick={() => openDrawer({ type: 'METRIC', title: 'Experiences by Category', data: 'Category Breakdown' })}
          className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter min-h-[220px] justify-between"
        >
          <div className="flex justify-between items-center mb-1 h-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Experiences by Category</h3>
            <InfoTooltip text="Distribution of booked guest experiences by activity type." />
          </div>

          <div className="flex-1 flex items-center justify-between py-1 gap-2">
            <div className="relative shrink-0 flex items-center justify-center" style={{ width: donutSize, height: donutSize }}>
              <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`} className="transform -rotate-90">
                {experiencesByCategory.map((item, index) => {
                  const strokeLength = (item.value / 100) * donutCircumference;
                  const strokeOffset = -(expAccumulated / 100) * donutCircumference;
                  expAccumulated += item.value;

                  return (
                    <circle
                      key={index}
                      cx={donutSize / 2}
                      cy={donutSize / 2}
                      r={donutRadius}
                      fill="none"
                      stroke={item.color}
                      strokeWidth={donutStrokeWidth}
                      strokeDasharray={`${Math.max(0, strokeLength - 1.5)} ${donutCircumference}`}
                      strokeDashoffset={strokeOffset}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-sm font-bold text-zinc-900 leading-none">1,864</span>
                <span className="text-[7.5px] text-zinc-500 font-medium mt-0.5">Bookings</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0 pr-1">
              {experiencesByCategory.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-500 font-medium truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-zinc-900 ml-1">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Top Experiences */}
        <div
          onClick={() => openDrawer({ type: 'METRIC', title: 'Top Experiences', data: 'Leaderboard' })}
          className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter min-h-[220px] justify-between"
        >
          <div className="flex justify-between items-center mb-1 h-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Top Experiences</h3>
          </div>

          <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
            {topExperiences.map(exp => (
              <div key={exp.name} className="flex justify-between items-center text-[10px]">
                <div className="truncate pr-1">
                  <span className="text-zinc-700 font-medium">{exp.name}</span>
                  <span className="text-[8.5px] text-zinc-400 font-normal ml-1">({exp.category})</span>
                </div>
                <span className="font-bold text-zinc-900 shrink-0">{exp.count}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-100 text-[9px] font-medium text-zinc-500">
            View all experiences &rarr;
          </div>
        </div>

        {/* 4. Experience Revenue by Property */}
        <div
          onClick={() => openDrawer({ type: 'METRIC', title: 'Revenue by Property', data: 'Property Breakdown' })}
          className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter min-h-[220px] justify-between"
        >
          <div className="flex justify-between items-center mb-1 h-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Revenue by Property</h3>
          </div>

          <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
            {experienceRevenueByProperty.map(prop => (
              <div key={prop.name} className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-600 w-24 truncate">{prop.name}</span>
                <div className="flex-1 mx-2 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${prop.pct}%` }} />
                </div>
                <span className="font-bold text-zinc-900 w-12 text-right">${(prop.value / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: 4 F&B Operations Cards (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-card-enter" style={{ animationDelay: '0.3s' }}>
        
        {/* 1. F&B Revenue Over Time */}
        <div
          onClick={() => openDrawer({ type: 'METRIC', title: 'F&B Revenue Over Time', data: 'F&B Trend' })}
          className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter min-h-[220px] justify-between"
        >
          <div className="flex justify-between items-center mb-1 h-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">F&B Revenue Over Time</h3>
            <span className="text-[9.5px] font-medium text-zinc-500">May 31: $16.4k</span>
          </div>

          <div className="flex-1 w-full h-[140px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fnbRevenueOverTime} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', fontSize: '10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Line type="monotone" dataKey="value" stroke="#18181b" strokeWidth={2} dot={{ r: 3, fill: '#18181b' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Revenue by Outlet */}
        <div
          onClick={() => openDrawer({ type: 'METRIC', title: 'Revenue by Outlet', data: 'Outlets' })}
          className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter min-h-[220px] justify-between"
        >
          <div className="flex justify-between items-center mb-1 h-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Revenue by Outlet</h3>
          </div>

          <div className="flex flex-col justify-between flex-1 py-1.5 gap-1.5">
            {revenueByOutlet.slice(0, 5).map(outlet => (
              <div key={outlet.name} className="flex justify-between items-center text-[9.5px]">
                <span className="text-zinc-700 font-medium truncate pr-1">{outlet.name}</span>
                <span className="font-bold text-zinc-900 shrink-0">${(outlet.value / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Top Performing Outlets */}
        <div
          onClick={() => openDrawer({ type: 'METRIC', title: 'Top Performing Outlets', data: 'Outlet Covers' })}
          className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter min-h-[220px] justify-between"
        >
          <div className="flex justify-between items-center mb-1 h-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Top Performing Outlets</h3>
          </div>

          <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
            {topPerformingOutlets.map(outlet => (
              <div key={outlet.name} className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-600 w-28 truncate">{outlet.name}</span>
                <div className="flex-1 mx-2 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${(outlet.value / outlet.total) * 100}%` }} />
                </div>
                <span className="font-bold text-zinc-900 w-8 text-right">{outlet.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. F&B Mix Breakdown (Pure SVG Donut) */}
        <div
          onClick={() => openDrawer({ type: 'METRIC', title: 'F&B Mix Breakdown', data: 'Menu Mix' })}
          className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter min-h-[220px] justify-between"
        >
          <div className="flex justify-between items-center mb-1 h-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">F&B Mix Breakdown</h3>
          </div>

          <div className="flex-1 flex items-center justify-between py-1 gap-2">
            <div className="relative shrink-0 flex items-center justify-center" style={{ width: donutSize, height: donutSize }}>
              <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`} className="transform -rotate-90">
                {fnbMixBreakdown.map((item, index) => {
                  const strokeLength = (item.value / 100) * donutCircumference;
                  const strokeOffset = -(fnbAccumulated / 100) * donutCircumference;
                  fnbAccumulated += item.value;

                  return (
                    <circle
                      key={index}
                      cx={donutSize / 2}
                      cy={donutSize / 2}
                      r={donutRadius}
                      fill="none"
                      stroke={item.color}
                      strokeWidth={donutStrokeWidth}
                      strokeDasharray={`${Math.max(0, strokeLength - 1.5)} ${donutCircumference}`}
                      strokeDashoffset={strokeOffset}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-base font-bold text-zinc-900 leading-none">100%</span>
                <span className="text-[7.5px] text-zinc-500 font-medium mt-0.5">Total Mix</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0 pr-1">
              {fnbMixBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-500 font-medium truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-zinc-900 ml-1">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Row 4: 4 Quality & Engagement Cards (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-card-enter" style={{ animationDelay: '0.4s' }}>
        
        {/* 1. Experience Type Performance */}
        <div
          onClick={() => openDrawer({ type: 'METRIC', title: 'Experience Ratings', data: 'Ratings' })}
          className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter min-h-[200px] justify-between"
        >
          <div className="flex justify-between items-center mb-1 h-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Experience Ratings</h3>
          </div>

          <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
            {experienceTypePerformance.map(item => (
              <div key={item.name} className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-700 font-medium truncate pr-1">{item.name}</span>
                <span className="font-bold text-zinc-900 shrink-0">★ {item.rating}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Upcoming Highlights */}
        <div
          onClick={() => openDrawer({ type: 'METRIC', title: 'Upcoming Highlights', data: 'Highlights' })}
          className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter min-h-[200px] justify-between"
        >
          <div className="flex justify-between items-center mb-1 h-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Upcoming Highlights</h3>
          </div>

          <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
            {upcomingHighlights.map(ev => (
              <div key={ev.title} className="flex justify-between items-baseline text-[10px]">
                <div className="truncate pr-1">
                  <div className="font-bold text-zinc-900 leading-tight truncate">{ev.title}</div>
                  <div className="text-[8.5px] text-zinc-400 font-normal">{ev.date}</div>
                </div>
                <span className="text-[9px] font-semibold text-zinc-700 shrink-0">{ev.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Outlet Peak Hours Heatmap */}
        <div
          onClick={() => openDrawer({ type: 'METRIC', title: 'Outlet Peak Heatmap', data: 'Heatmap' })}
          className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter min-h-[200px] justify-between"
        >
          <div className="flex justify-between items-center mb-1 h-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Outlet Peak Heatmap</h3>
          </div>

          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="grid grid-cols-[36px_repeat(6,1fr)] gap-1 text-[7.5px] text-zinc-400 text-center font-medium">
              <span>Outlet</span>
              {heatmapTimes.map(t => <span key={t}>{t}</span>)}
            </div>

            <div className="flex flex-col gap-1 mt-1">
              {heatmapOutlets.map((outlet, oIdx) => (
                <div key={outlet} className="grid grid-cols-[36px_repeat(6,1fr)] gap-1 items-center">
                  <span className="text-[7.5px] font-medium text-zinc-500 truncate">{outlet.split(' ')[0]}</span>
                  {heatmapData[oIdx].map((val, tIdx) => {
                    const getBg = (v: number) => {
                      if (v === 1) return 'bg-zinc-100';
                      if (v === 2) return 'bg-zinc-200';
                      if (v === 3) return 'bg-zinc-400';
                      if (v === 4) return 'bg-zinc-600';
                      return 'bg-zinc-900';
                    };
                    return (
                      <div
                        key={tIdx}
                        className={`h-2.5 rounded-[2px] ${getBg(val)} transition-all`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Guest Experience Satisfaction */}
        <div
          onClick={() => openDrawer({ type: 'METRIC', title: 'F&B Experience Index', data: 'Satisfaction' })}
          className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter min-h-[200px] justify-between"
        >
          <div className="flex justify-between items-center mb-1 h-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
              F&B Experience Index <span className="text-[8px] font-normal text-zinc-400">Overall</span>
            </h3>
          </div>

          <div className="flex items-center justify-between flex-1 py-1 gap-3">
            {/* Pure Vector SVG Donut Score Gauge */}
            <div className="relative shrink-0 flex items-center justify-center" style={{ width: 68, height: 68 }}>
              <svg width={68} height={68} viewBox="0 0 68 68" className="transform -rotate-90">
                <circle
                  cx={34}
                  cy={34}
                  r={28}
                  fill="none"
                  stroke="#f4f4f5"
                  strokeWidth={7}
                />
                <circle
                  cx={34}
                  cy={34}
                  r={28}
                  fill="none"
                  stroke="#18181b"
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeDasharray={`${(4.7 / 5) * (2 * Math.PI * 28)} ${2 * Math.PI * 28}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-bold text-zinc-900 leading-none">4.7</span>
                <span className="text-[8px] text-zinc-400 font-medium mt-0.5">/ 5</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1 text-[9px]">
              <div className="flex justify-between">
                <span className="text-zinc-500 truncate">Food Quality</span>
                <span className="font-bold text-zinc-900">4.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 truncate">Service Speed</span>
                <span className="font-bold text-zinc-900">4.6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 truncate">Beverage & Wine</span>
                <span className="font-bold text-zinc-900">4.7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 truncate">Ambience</span>
                <span className="font-bold text-zinc-900">4.8</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 5: 5 Bottom Action / Guiding Principle Cards (5 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 animate-card-enter" style={{ animationDelay: '0.5s' }}>
        {[
          { label: 'Optimize seating capacity.', icon: Settings },
          { label: 'Elevate culinary craft.', icon: Cup },
          { label: 'Enhance guest delight.', icon: Heart },
          { label: 'Maximize beverage sales.', icon: WineglassTriangle },
          { label: 'Deliver bespoke experiences.', icon: Star },
        ].map((pill, idx) => {
          const Icon = pill.icon;
          return (
            <div
              key={idx}
              className="rounded-xl border border-zinc-200/80 bg-white/60 backdrop-blur-xs p-3 flex items-center gap-2.5 transition-all duration-200 hover:bg-white hover:shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                <Icon size={13} className="text-zinc-600" />
              </div>
              <span className="text-[10px] font-medium text-zinc-700 truncate">{pill.label}</span>
            </div>
          );
        })}
      </div>

      {/* Under Development Modal */}
      <UnderDevelopmentModal
        open={showDevModal}
        onClose={() => setShowDevModal(false)}
        featureName={devFeatureName}
      />

    </div>
  );
}
