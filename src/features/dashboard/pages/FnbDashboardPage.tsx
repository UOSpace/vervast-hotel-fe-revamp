import { useState } from 'react';
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Sunrise, Heart, WineglassTriangle, Cup } from '@solar-icons/react';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';

// Custom icons
const MountainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#C8A050]">
    <path d="M12 3L2 21h20L12 3z" />
    <path d="M12 3l5 9H7l5-9z" />
  </svg>
);

const SpoonForkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#657454]">
    <path d="M18 2v13M18 20h.01M6 2v6a4 4 0 0 0 4 4v10" />
    <path d="M10 2v6M14 2v6a4 4 0 0 1-4 4" />
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#586981]">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CompassIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#9d7c67]">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const LoopIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#C8A050]">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.73" />
  </svg>
);

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? "#C8A050" : "none"} stroke="#C8A050" strokeWidth="1.5" className="inline-block mr-0.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Charts Colors
const COLORS_EXPERIENCE = ['#657454', '#4a3c31', '#C8A050', '#947b66', '#7d6b5e', '#e5d8cb'];
const COLORS_FNB_MIX = ['#4a3c31', '#C8A050', '#947b66', '#e5d8cb'];

// Mock Data matching Screenshot 1 exactly
const experienceBookingsOverTime = [
  { name: 'May 1', value: 380 },
  { name: 'May 8', value: 530 },
  { name: 'May 15', value: 410 },
  { name: 'May 22', value: 680 },
  { name: 'May 29', value: 610 },
  { name: 'May 31', value: 892 }
];

const experiencesByCategory = [
  { name: 'Water & Marine', value: 32 },
  { name: 'Nature & Adventure', value: 24 },
  { name: 'Cultural & Local', value: 17 },
  { name: 'Wellness & Mindfulness', value: 15 },
  { name: 'Private & Bespoke', value: 8 },
  { name: 'Other', value: 4 }
];

const topExperiences = [
  { name: 'Sunset Cruise', category: 'Ocean', count: 312 },
  { name: 'Private Island Picnic', category: 'Ocean', count: 278 },
  { name: 'Guided Forest Hike', category: 'Alpine', count: 246 },
  { name: 'Wellness Journey', category: 'Sanctuary', count: 212 },
  { name: 'Cultural Village Visit', category: 'Desert', count: 184 }
];

const experienceRevenueByProperty = [
  { name: 'SOSEI Ocean', value: 78620 },
  { name: 'SOSEI Alpine', value: 54310 },
  { name: 'SOSEI Forest', value: 31400 },
  { name: 'SOSEI Desert', value: 15230 },
  { name: 'SOSEI City', value: 9680 }
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
  { name: 'Seascape Restaurant', value: 186420 },
  { name: 'Terra Pavilion', value: 112380 },
  { name: 'Alpine Grill', value: 84760 },
  { name: 'The Tea Lounge', value: 61240 },
  { name: 'In-Villa Dining', value: 46810 },
  { name: 'Poolside Bar', value: 20840 }
];

const topPerformingOutlets = [
  { name: 'Seascape Restaurant', value: 245 },
  { name: 'Terra Pavilion', value: 198 },
  { name: 'Alpine Grill', value: 176 },
  { name: 'The Tea Lounge', value: 142 },
  { name: 'Poolside Bar', value: 118 }
];

const fnbMixBreakdown = [
  { name: 'Food', value: 62 },
  { name: 'Beverage', value: 23 },
  { name: 'In-Villa Dining', value: 10 },
  { name: 'Events & Private Dining', value: 5 }
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

// Heatmap data: columns [7am, 9am, 12pm, 3pm, 6pm, 9pm]
// Rows: Seascape Restaurant, Terra Pavilion, Alpine Grill, The Tea Lounge, Poolside Bar, In-Villa Dining
// Value: 1 (low) to 5 (high)
const heatmapData = [
  { outlet: 'Seascape Restaurant', values: [2, 3, 5, 2, 5, 4] },
  { outlet: 'Terra Pavilion', values: [4, 4, 3, 2, 4, 5] },
  { outlet: 'Alpine Grill', values: [1, 2, 4, 2, 5, 5] },
  { outlet: 'The Tea Lounge', values: [2, 5, 4, 5, 3, 1] },
  { outlet: 'Poolside Bar', values: [1, 2, 4, 5, 4, 2] },
  { outlet: 'In-Villa Dining', values: [4, 3, 3, 2, 4, 5] }
];

export function FnbDashboardPage() {
  const [startDate, setStartDate] = useState<Date | null>(new Date('2024-05-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2024-05-31'));
  const { openDrawer } = useDashboardDrawer();

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 text-[10px]">
      
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#d4c4b7]/40 pb-4 mt-2 gap-4">
        <div>
          <span className="text-[9px] font-bold tracking-widest text-[#947b66] uppercase">Experience Intelligence</span>
          <h1 className="text-2xl font-serif text-[#4a3c31] font-bold mt-0.5">Experiences & F&B Dashboard</h1>
          <p className="text-[10px] text-[#7d6b5e] mt-1">Curated experiences. Memorable moments. Measurable impact.</p>
        </div>
        <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
          <div className="relative flex items-center bg-[#efe7d5]/60 border border-[#d4c4b7] rounded-lg px-3 py-1.5 cursor-pointer">
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
              className="bg-transparent border-none text-[#4a3c31] text-[10px] focus:outline-none font-bold w-[160px] cursor-pointer"
            />
            <Calendar size={12} className="text-[#947b66] ml-1.5" />
          </div>
          <button className="bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] px-4 py-2 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export
          </button>
        </div>
      </div>

      {/* Row 1: KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-2">
        {/* Card 1 */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Total Experiences Booked', data: { key: 'TOTAL_EXPERIENCES' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm min-h-[110px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Total Experiences Booked</span>
            <div className="w-8 h-8 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center">
              <MountainIcon />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-serif font-bold text-[#4a3c31]">1,864</div>
            <div className="text-[9px] text-[#15803d] font-bold mt-0.5">+18% vs Apr 1 - Apr 30</div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Total F&B Revenue', data: { key: 'TOTAL_FNB_REVENUE' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm min-h-[110px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Total F&B Revenue (USD)</span>
            <div className="w-8 h-8 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center">
              <SpoonForkIcon />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-serif font-bold text-[#4a3c31]">$512,450</div>
            <div className="text-[9px] text-[#15803d] font-bold mt-0.5">+16% vs Apr 1 - Apr 30</div>
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Average Spend Per Person', data: { key: 'AVERAGE_SPEND' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm min-h-[110px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Average Spend Per Person</span>
            <div className="w-8 h-8 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center">
              <UserIcon />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-serif font-bold text-[#4a3c31]">$142</div>
            <div className="text-[9px] text-[#15803d] font-bold mt-0.5">+7% vs Apr 1 - Apr 30</div>
          </div>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Experience Revenue (USD)', data: { key: 'EXPERIENCE_REVENUE' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm min-h-[110px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Experience Revenue (USD)</span>
            <div className="w-8 h-8 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center">
              <CompassIcon />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-serif font-bold text-[#4a3c31]">$189,320</div>
            <div className="text-[9px] text-[#15803d] font-bold mt-0.5">+21% vs Apr 1 - Apr 30</div>
          </div>
        </div>

        {/* Card 5 */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Repeat Experience Rate', data: { key: 'REPEAT_RATE' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm min-h-[110px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Repeat Experience Rate</span>
            <div className="w-8 h-8 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center">
              <LoopIcon />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-serif font-bold text-[#4a3c31]">38%</div>
            <div className="text-[9px] text-[#15803d] font-bold mt-0.5">+5pp vs Apr 1 - Apr 30</div>
          </div>
        </div>

        {/* Card 6 */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Guest Satisfaction', data: { key: 'SATISFACTION' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm min-h-[110px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Guest Satisfaction</span>
            <div className="w-8 h-8 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center">
              <span className="text-[#C8A050] font-serif font-bold">★</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-serif font-bold text-[#4a3c31]">4.7 <span className="text-xs text-[#7d6b5e]">/ 5</span></div>
            <div className="text-[9px] text-[#7d6b5e] font-bold mt-0.5">Excellent</div>
          </div>
        </div>
      </div>

      {/* Row 2: Experience Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {/* 1. Experience Bookings Over Time */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Experience Bookings Over Time', data: { key: 'EXP_BOOKINGS_OVER_TIME' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Experience Bookings Over Time</span>
            <span className="text-[8px] font-mono text-[#4a3c31] bg-[#efe7d5] px-1.5 py-0.5 rounded">May 31: 892</span>
          </div>
          <div className="flex-1 w-full h-[140px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={experienceBookingsOverTime}>
                <XAxis dataKey="name" stroke="#7d6b5e" fontSize={8} tickLine={false} />
                <YAxis stroke="#7d6b5e" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#657454" strokeWidth={2} dot={{ r: 3, fill: '#657454' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Experiences By Category */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Experiences By Category', data: { key: 'EXP_BY_CATEGORY' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Experiences By Category</span>
          <div className="flex items-center justify-between flex-1">
            <div className="w-[110px] h-[110px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={experiencesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {experiencesByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_EXPERIENCE[index % COLORS_EXPERIENCE.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] font-bold text-[#4a3c31] leading-none">1,864</span>
                <span className="text-[7px] text-[#7d6b5e] scale-90">Total Booked</span>
              </div>
            </div>
            <div className="flex-1 pl-4 flex flex-col gap-1 text-[8px] text-[#7d6b5e]">
              {experiencesByCategory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 truncate max-w-[85px]">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS_EXPERIENCE[idx % COLORS_EXPERIENCE.length] }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-[#4a3c31]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <button className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View all experiences →</button>
        </div>

        {/* 3. Top Experiences */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Top Experiences', data: { key: 'TOP_EXPERIENCES_DETAIL' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Top Experiences <span className="text-[8px] not-italic text-[#7d6b5e]/70">By bookings</span></span>
          <div className="flex-1 flex flex-col justify-between">
            {topExperiences.map((exp, idx) => (
              <div key={idx} className="flex justify-between items-center py-1.5 border-b border-[#d4c4b7]/25 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#947b66]/10 flex items-center justify-center font-bold text-[9px] text-[#947b66]">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-[#4a3c31] text-[10px] leading-tight">{exp.name}</div>
                    <div className="text-[8px] text-[#7d6b5e]">{exp.category}</div>
                  </div>
                </div>
                <div className="font-mono font-bold text-[#4a3c31] text-[11px]">{exp.count}</div>
              </div>
            ))}
          </div>
          <button className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View all experiences →</button>
        </div>

        {/* 4. Experience Revenue By Property */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Experience Revenue By Property', data: { key: 'EXP_REVENUE_PROPERTY' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Experience Revenue By Property <span className="text-[8px] not-italic text-[#7d6b5e]/70">By revenue (USD)</span></span>
          <div className="flex-1 flex flex-col justify-between py-1">
            {experienceRevenueByProperty.map((prop, idx) => {
              const maxVal = experienceRevenueByProperty[0].value;
              const pct = (prop.value / maxVal) * 100;
              return (
                <div key={idx} className="flex items-center justify-between text-[9px] gap-2">
                  <span className="w-[68px] font-semibold text-[#4a3c31] truncate">{prop.name}</span>
                  <div className="flex-1 h-1.5 bg-[#e5d8cb]/50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#657454] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="font-mono font-bold text-[#4a3c31]">${prop.value.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          <button className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View property insights →</button>
        </div>
      </div>

      {/* Row 3: F&B Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {/* 1. F&B Revenue Over Time */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'F&B Revenue Over Time', data: { key: 'FNB_REVENUE_OVER_TIME' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">F&B Revenue Over Time</span>
            <span className="text-[8px] font-mono text-[#4a3c31] bg-[#efe7d5] px-1.5 py-0.5 rounded">May 31: $16.4K</span>
          </div>
          <div className="flex-1 w-full h-[140px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fnbRevenueOverTime}>
                <XAxis dataKey="name" stroke="#7d6b5e" fontSize={8} tickLine={false} />
                <YAxis stroke="#7d6b5e" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#C8A050" strokeWidth={2} dot={{ r: 3, fill: '#C8A050' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Revenue By Outlet */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Revenue By Outlet', data: { key: 'FNB_REVENUE_OUTLET' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Revenue By Outlet <span className="text-[8px] not-italic text-[#7d6b5e]/70">By revenue (USD)</span></span>
          <div className="flex-1 flex flex-col justify-between py-1">
            {revenueByOutlet.map((outlet, idx) => {
              const maxVal = revenueByOutlet[0].value;
              const pct = (outlet.value / maxVal) * 100;
              return (
                <div key={idx} className="flex items-center justify-between text-[9px] gap-2">
                  <span className="w-[85px] font-semibold text-[#4a3c31] truncate">{outlet.name}</span>
                  <div className="flex-1 h-1.5 bg-[#e5d8cb]/50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#657454] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="font-mono font-bold text-[#4a3c31]">${outlet.value.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          <button className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View all outlets →</button>
        </div>

        {/* 3. Top Performing Outlets */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Top Performing Outlets', data: { key: 'TOP_OUTLETS_PERFORMANCE' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Top Performing Outlets <span className="text-[8px] not-italic text-[#7d6b5e]/70">By revenue per available seat (RevPAS)</span></span>
          <div className="flex-1 flex flex-col justify-between">
            {topPerformingOutlets.map((outlet, idx) => (
              <div key={idx} className="flex justify-between items-center py-1.5 border-b border-[#d4c4b7]/25 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#4a3c31]">{outlet.name}</span>
                </div>
                <div className="font-mono font-bold text-[#657454] text-[11px]">${outlet.value}</div>
              </div>
            ))}
          </div>
          <button className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View outlet performance →</button>
        </div>

        {/* 4. F&B Mix Breakdown */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'F&B Mix Breakdown', data: { key: 'FNB_MIX_BREAKDOWN_DETAIL' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">F&B Mix Breakdown</span>
          <div className="flex items-center justify-between flex-1">
            <div className="w-[110px] h-[110px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fnbMixBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {fnbMixBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_FNB_MIX[index % COLORS_FNB_MIX.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-[#4a3c31] leading-none">$512,450</span>
                <span className="text-[7px] text-[#7d6b5e] scale-90">Total Revenue</span>
              </div>
            </div>
            <div className="flex-1 pl-4 flex flex-col gap-1.5 text-[8px] text-[#7d6b5e]">
              {fnbMixBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 truncate max-w-[80px]">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS_FNB_MIX[idx % COLORS_FNB_MIX.length] }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-[#4a3c31]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <button className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View F&B mix details →</button>
        </div>
      </div>

      {/* Row 4: Performance, Funnel, & Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {/* 1. Peak Hours By Outlet */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Peak Hours By Outlet', data: { key: 'PEAK_HOURS_OUTLET' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Peak Hours By Outlet <span className="text-[8px] not-italic text-[#7d6b5e]/70">Average covers by time of day</span></span>
          <div className="flex-1 flex flex-col justify-between overflow-x-auto text-[8px]">
            {/* Headers */}
            <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-1 text-center font-bold text-[#7d6b5e] pb-1 border-b border-[#d4c4b7]/30">
              <span className="text-left">Outlet</span>
              <span>7 AM</span>
              <span>9 AM</span>
              <span>12 PM</span>
              <span>3 PM</span>
              <span>6 PM</span>
              <span>9 PM</span>
            </div>
            {/* Grid rows */}
            {heatmapData.map((row, idx) => (
              <div key={idx} className="grid grid-cols-[80px_repeat(6,1fr)] gap-1 py-1 items-center">
                <span className="font-medium text-[#4a3c31] truncate text-left leading-tight">{row.outlet}</span>
                {row.values.map((val, vidx) => {
                  let opacityClass = 'bg-[#657454]/10';
                  if (val === 2) opacityClass = 'bg-[#657454]/30';
                  if (val === 3) opacityClass = 'bg-[#657454]/50';
                  if (val === 4) opacityClass = 'bg-[#657454]/75';
                  if (val === 5) opacityClass = 'bg-[#657454]';
                  return (
                    <div
                      key={vidx}
                      className={`h-4.5 rounded-sm flex items-center justify-center transition-all ${opacityClass} ${val >= 4 ? 'text-[#efe7d5]' : 'text-[#4a3c31]'}`}
                    />
                  );
                })}
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center justify-end gap-1.5 mt-2 text-[7px] text-[#7d6b5e]">
              <span>Low</span>
              <div className="w-16 h-1.5 bg-gradient-to-r from-[#657454]/10 to-[#657454] rounded-full" />
              <span>High</span>
            </div>
          </div>
        </div>

        {/* 2. Experience Conversion Funnel */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Experience Conversion Funnel', data: { key: 'EXP_CONVERSION_FUNNEL' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Experience Conversion Funnel <span className="text-[8px] not-italic text-[#7d6b5e]/70">From inquiry to experience</span></span>
          <div className="flex-1 flex flex-col justify-between py-1">
            {[
              { step: 'Experiences Viewed', val: '3,842', pct: 100 },
              { step: 'Added to Wishlist', val: '1,926', pct: 50 },
              { step: 'Inquiries', val: '1,102', pct: 29 },
              { step: 'Bookings', val: '1,864', pct: 49 },
              { step: 'Completed', val: '1,720', pct: 92 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-0.5 text-[9px]">
                <div className="flex justify-between items-center text-[#4a3c31]">
                  <span>{item.step}</span>
                  <span className="font-mono font-bold">{item.val}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-[#e5d8cb]/30 rounded-md overflow-hidden relative">
                    <div className="h-full bg-[#947b66]/30" style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="w-8 font-mono font-bold text-[9px] text-[#7d6b5e] text-right">{item.pct}%</span>
                </div>
              </div>
            ))}
          </div>
          <button className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View conversion details →</button>
        </div>

        {/* 3. Experience Type Performance */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Experience Type Performance', data: { key: 'EXP_TYPE_PERFORMANCE' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Experience Type Performance <span className="text-[8px] not-italic text-[#7d6b5e]/70">By satisfaction score</span></span>
          <div className="flex-1 flex flex-col justify-between">
            {experienceTypePerformance.map((type, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-[#d4c4b7]/25 last:border-0">
                <span className="font-semibold text-[#4a3c31] text-[10px]">{type.name}</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                  </div>
                  <span className="font-mono font-bold text-[#4a3c31] text-[10px]">{type.rating}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View satisfaction details →</button>
        </div>

        {/* 4. Upcoming Highlights */}
        <div
          onClick={() => openDrawer({ type: 'FNB_DETAIL', title: 'Upcoming Highlights', data: { key: 'UPCOMING_HIGHLIGHTS_DETAIL' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Upcoming Highlights <span className="text-[8px] not-italic text-[#7d6b5e]/70">Next 14 days</span></span>
          <div className="flex-1 flex flex-col justify-between">
            {upcomingHighlights.map((hl, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-[#d4c4b7]/25 last:border-0">
                <div className="flex flex-col">
                  <span className="font-bold text-[#4a3c31] text-[9.5px] leading-tight">{hl.title}</span>
                  <span className="text-[8px] text-[#7d6b5e]">{hl.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono font-bold text-[#657454] bg-[#657454]/10 px-1.5 py-0.5 rounded-sm">{hl.count.split(' ')[0]}</span>
                  <div className="text-[6.5px] text-[#7d6b5e] uppercase tracking-wider mt-0.5">Resv</div>
                </div>
              </div>
            ))}
          </div>
          <button className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View full schedule →</button>
        </div>
      </div>

      {/* Row 5: Insights Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
        {[
          { text: 'Sunset experiences are driving 34% of total experience revenue.', icon: <Sunrise size={18} className="text-[#C8A050]" />, key: 'SUNSET_INSIGHT', title: 'Sunset Experiences Analysis' },
          { text: 'In-villa dining revenue increased 21% vs last month.', icon: <Cup size={18} className="text-[#657454]" />, key: 'INVILLA_INSIGHT', title: 'In-Villa Dining Growth Analysis' },
          { text: 'Wellness and nature experiences have the highest satisfaction.', icon: <Heart size={18} className="text-[#947b66]" />, key: 'WELLNESS_INSIGHT', title: 'Wellness Satisfaction Report' },
          { text: 'Advance bookings >14 days lead to 28% higher spend per person.', icon: <Calendar size={18} className="text-[#586981]" />, key: 'ADVANCE_INSIGHT', title: 'Advance Booking Lead Time Analysis' },
          { text: 'Weekend dinners remain the peak for F&B revenue.', icon: <WineglassTriangle size={18} className="text-[#a65e52]" />, key: 'WEEKEND_INSIGHT', title: 'Weekend Dining Analysis' }
        ].map((insight, idx) => (
          <div
            key={idx}
            onClick={() => openDrawer({ type: 'FNB_DETAIL', title: insight.title, data: { key: insight.key } })}
            className="border border-[#d4c4b7]/80 rounded-[12px] p-3.5 bg-[#f3eae1]/20 backdrop-blur-xs flex items-start gap-2.5 hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
          >
            <span className="shrink-0 leading-none mt-0.5">{insight.icon}</span>
            <span className="text-[9px] text-[#4a3c31] leading-relaxed">{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
