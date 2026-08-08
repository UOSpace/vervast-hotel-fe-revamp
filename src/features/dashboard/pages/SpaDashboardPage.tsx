import { useState } from 'react';
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Wallet, Bag, Bed, Sunrise, Heart, Settings, UsersGroupTwoRounded, Star } from '@solar-icons/react';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { UnderDevelopmentModal } from '../../../components/ui/UnderDevelopmentModal';

// Custom icons
const LotusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#C8A050]">
    <path d="M12 22s-8-5-8-10A8 8 0 0 1 12 4a8 8 0 0 1 8 8c0 5-8 10-8 10z" />
    <path d="M12 8a4 4 0 0 0-4 4" />
  </svg>
);

const HourGlassIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#586981]">
    <path d="M5 2h14v4L14 11v2l5 5v4H5v-4l5-5v-2L5 6V2z" />
    <path d="M10 6h4M10 18h4" />
  </svg>
);


// Colors
const COLORS_SPA_AREA = ['#657454', '#4a3c31', '#C8A050', '#947b66'];

// Mock Data
const utilizationOverTime = [
  { name: 'May 1', value: 65 },
  { name: 'May 8', value: 72 },
  { name: 'May 15', value: 68 },
  { name: 'May 22', value: 74 },
  { name: 'May 29', value: 70 },
  { name: 'May 31', value: 71 }
];

const utilizationByArea = [
  { name: 'Treatment Rooms', value: 78 },
  { name: 'Hydro Facilities', value: 65 },
  { name: 'Relaxation Lounge', value: 62 },
  { name: 'Movement Studio', value: 48 }
];

const scheduleOverview = [
  { name: 'Completed', value: 32, total: 68 },
  { name: 'In Progress', value: 14, total: 68 },
  { name: 'Scheduled', value: 22, total: 68 },
  { name: 'Cancelled / No Show', value: 0, total: 68 }
];

const topTreatments = [
  { name: 'Deep Tissue Massage', count: 312 },
  { name: 'Aromatherapy Massage', count: 248 },
  { name: 'Facial Signature', count: 196 },
  { name: 'Hot Stone Therapy', count: 154 },
  { name: 'Detox Body Wrap', count: 98 }
];

const revenueByCategory = [
  { name: 'Massages', value: 54 },
  { name: 'Facials', value: 22 },
  { name: 'Body Treatments', value: 14 },
  { name: 'Wellness Rituals', value: 7 },
  { name: 'Other', value: 3 }
];

const therapistPerformance = [
  { name: 'Ananda', treatments: 152, revenue: 36480, utilization: 82 },
  { name: 'Maya', treatments: 148, revenue: 34120, utilization: 78 },
  { name: 'Suri', treatments: 137, revenue: 31750, utilization: 75 },
  { name: 'Lina', treatments: 130, revenue: 28910, utilization: 72 },
  { name: 'Pema', treatments: 124, revenue: 27560, utilization: 68 }
];

const upcomingPeakTimes = [
  { day: 'May 31 (Fri)', time: '3:00 PM - 6:00 PM', level: 'High' },
  { day: 'Jun 1 (Sat)', time: '10:00 AM - 1:00 PM', level: 'High' },
  { day: 'Jun 2 (Sun)', time: '11:00 AM - 2:00 PM', level: 'Medium' },
  { day: 'Jun 8 (Sat)', time: '2:00 PM - 5:00 PM', level: 'Medium' }
];

const retailTopSellers = [
  { name: 'Sosei Signature Oil', revenue: 9420 },
  { name: 'Calm & Restore Balm', revenue: 6210 },
  { name: 'Mineral Soak', revenue: 4860 },
  { name: 'Sosei Silk Eye Pillow', revenue: 3980 }
];

const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const heatmapData = [
  [1, 2, 3, 2, 4, 3], // Mon
  [2, 3, 3, 2, 4, 4], // Tue
  [1, 2, 4, 3, 4, 4], // Wed
  [2, 3, 4, 3, 5, 5], // Thu
  [3, 4, 5, 4, 5, 5], // Fri
  [4, 5, 5, 5, 5, 5], // Sat
  [3, 4, 4, 4, 4, 3]  // Sun
];

export function SpaDashboardPage() {
  const [startDate, setStartDate] = useState<Date | null>(new Date('2024-05-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2024-05-31'));
  const { openDrawer } = useDashboardDrawer();
  const [showDevModal, setShowDevModal] = useState(false);
  const [devFeatureName, setDevFeatureName] = useState<string | undefined>(undefined);

  const openDevModal = (name?: string) => {
    setDevFeatureName(name);
    setShowDevModal(true);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 text-[10px]">
      
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#d4c4b7]/40 pb-4 mt-2 gap-4">
        <div>
          <span className="text-[9px] font-bold tracking-widest text-[#947b66] uppercase">Sanctuary Wellness</span>
          <h1 className="text-2xl text-[#4a3c31] font-bold mt-0.5">Sanctuary Wellness Dashboard</h1>
          <p className="text-[10px] text-[#7d6b5e] mt-1">Delivering balance. Enhancing wellbeing. Elevating every stay.</p>
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
          <button
            onClick={() => openDevModal('Export Report')}
            className="bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] px-4 py-2 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export
          </button>
        </div>
      </div>

      {/* Row 1: KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-2">
        {/* Card 1 */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Total Treatments', data: { key: 'TOTAL_TREATMENTS' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm min-h-[110px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Total Treatments</span>
            <div className="w-8 h-8 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center">
              <LotusIcon />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-normal text-[#4a3c31]">1,248</div>
            <div className="text-[9px] text-[#15803d] font-bold mt-0.5">+12% vs Apr 1 - Apr 30</div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Treatment Revenue (USD)', data: { key: 'TREATMENT_REVENUE' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm min-h-[110px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Treatment Revenue (USD)</span>
            <div className="w-8 h-8 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center">
              <Wallet size={16} className="text-[#657454]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-normal text-[#4a3c31]">$286,450</div>
            <div className="text-[9px] text-[#15803d] font-bold mt-0.5">+18% vs Apr 1 - Apr 30</div>
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Average Revenue Per Treatment', data: { key: 'AVERAGE_REVENUE' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm min-h-[110px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Average Revenue Per Treatment</span>
            <div className="w-8 h-8 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#586981]"><circle cx="8" cy="8" r="6"/><circle cx="16" cy="16" r="6"/></svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-normal text-[#4a3c31]">$229</div>
            <div className="text-[9px] text-[#15803d] font-bold mt-0.5">+5% vs Apr 1 - Apr 30</div>
          </div>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Spa Utilization', data: { key: 'SPA_UTILIZATION' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm min-h-[110px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Spa Utilization</span>
            <div className="w-8 h-8 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-r-0 border-[#657454]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-normal text-[#4a3c31]">71%</div>
            <div className="text-[9px] text-[#15803d] font-bold mt-0.5">+6pp vs Apr 1 - Apr 30</div>
          </div>
        </div>

        {/* Card 5 */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Total Therapist Hours', data: { key: 'THERAPIST_HOURS' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm min-h-[110px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Total Therapist Hours</span>
            <div className="w-8 h-8 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center">
              <HourGlassIcon />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-normal text-[#4a3c31]">2,840</div>
            <div className="text-[9px] text-[#15803d] font-bold mt-0.5">+10% vs Apr 1 - Apr 30</div>
          </div>
        </div>

        {/* Card 6 */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Retail Revenue', data: { key: 'RETAIL_REVENUE' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm min-h-[110px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Retail Revenue</span>
            <div className="w-8 h-8 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center">
              <Bag size={16} className="text-[#a65e52]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-normal text-[#4a3c31]">$42,180</div>
            <div className="text-[9px] text-[#15803d] font-bold mt-0.5">+14% vs Apr 1 - Apr 30</div>
          </div>
        </div>
      </div>

      {/* Row 2: Spa Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {/* 1. Utilization Over Time */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Utilization Over Time', data: { key: 'UTILIZATION_OVER_TIME' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e]">Utilization Over Time</span>
            <span className="text-[8px] font-mono text-[#4a3c31] bg-[#efe7d5] px-1.5 py-0.5 rounded">May 31: 71%</span>
          </div>
          <div className="flex-1 w-full h-[140px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilizationOverTime}>
                <XAxis dataKey="name" stroke="#7d6b5e" fontSize={8} tickLine={false} />
                <YAxis stroke="#7d6b5e" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#657454" strokeWidth={2} dot={{ r: 3, fill: '#657454' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Utilization By Time of Day */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Utilization By Time of Day', data: { key: 'UTILIZATION_TIME_OF_DAY' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Utilization By Time of Day</span>
          <div className="flex-1 flex flex-col justify-between overflow-x-auto text-[7.5px]">
            {/* Headers */}
            <div className="grid grid-cols-[30px_repeat(6,1fr)] gap-1 text-center font-bold text-[#7d6b5e] pb-1 border-b border-[#d4c4b7]/30">
              <span className="text-left">Day</span>
              <span>6 AM</span>
              <span>9 AM</span>
              <span>12 PM</span>
              <span>3 PM</span>
              <span>6 PM</span>
              <span>9 PM</span>
            </div>
            {/* Grid rows */}
            {heatmapDays.map((day, idx) => (
              <div key={idx} className="grid grid-cols-[30px_repeat(6,1fr)] gap-1 py-1 items-center">
                <span className="font-medium text-[#4a3c31] truncate text-left">{day}</span>
                {heatmapData[idx].map((val, vidx) => {
                  let opacityClass = 'bg-[#657454]/10';
                  if (val === 2) opacityClass = 'bg-[#657454]/30';
                  if (val === 3) opacityClass = 'bg-[#657454]/50';
                  if (val === 4) opacityClass = 'bg-[#657454]/75';
                  if (val === 5) opacityClass = 'bg-[#657454]';
                  return (
                    <div
                      key={vidx}
                      className={`h-4 rounded-sm flex items-center justify-center transition-all ${opacityClass}`}
                    />
                  );
                })}
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center justify-end gap-1.5 mt-1 text-[7px] text-[#7d6b5e]">
              <span>Low Utilization</span>
              <div className="w-16 h-1.5 bg-gradient-to-r from-[#657454]/10 to-[#657454] rounded-full" />
              <span>High Utilization</span>
            </div>
          </div>
        </div>

        {/* 3. Utilization By Area */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Utilization By Area', data: { key: 'UTILIZATION_BY_AREA' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Utilization By Area</span>
          <div className="flex items-center justify-between flex-1">
            <div className="w-[110px] h-[110px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={utilizationByArea}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {utilizationByArea.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_SPA_AREA[index % COLORS_SPA_AREA.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] font-bold text-[#4a3c31] leading-none">71%</span>
                <span className="text-[6.5px] text-[#7d6b5e] scale-90">Overall Util</span>
              </div>
            </div>
            <div className="flex-1 pl-4 flex flex-col gap-1.5 text-[8px] text-[#7d6b5e]">
              {utilizationByArea.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 truncate max-w-[80px]">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS_SPA_AREA[idx % COLORS_SPA_AREA.length] }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-[#4a3c31]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Today's Schedule Overview */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: "Today's Schedule Overview", data: { key: 'SCHEDULE_OVERVIEW' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Today's Schedule Overview <span className="text-[8px] not-italic text-[#7d6b5e]/70">Based on future bookings</span></span>
          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="flex justify-between items-center text-[9px] text-[#7d6b5e] font-bold border-b border-[#d4c4b7]/30 pb-1 mb-1">
              <span>Total Appointments</span>
              <span className="font-mono text-[#4a3c31]">68</span>
            </div>
            {scheduleOverview.slice(0).map((row, idx) => {
              const maxVal = row.total;
              const pct = (row.value / maxVal) * 100;
              return (
                <div key={idx} className="flex items-center justify-between text-[9px] gap-2">
                  <span className="w-[85px] font-semibold text-[#4a3c31] truncate">{row.name}</span>
                  <div className="flex-1 h-1.5 bg-[#e5d8cb]/50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#657454] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="font-mono font-bold text-[#4a3c31]">{row.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Spa Details & Therapist performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {/* 1. Top Treatments */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Top Treatments', data: { key: 'TOP_TREATMENTS_DETAIL' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Top Treatments <span className="text-[8px] not-italic text-[#7d6b5e]/70">By number of treatments</span></span>
          <div className="flex-1 flex flex-col justify-between">
            {topTreatments.map((tr, idx) => (
              <div key={idx} className="flex justify-between items-center py-1.5 border-b border-[#d4c4b7]/25 last:border-0">
                <span className="font-bold text-[#4a3c31] text-[10px]">{tr.name}</span>
                <span className="font-mono font-bold text-[#4a3c31] text-[11px]">{tr.count}</span>
              </div>
            ))}
          </div>
          <button onClick={() => openDevModal('All Treatments')} className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View all treatments →</button>
        </div>

        {/* 2. Revenue By Category */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Revenue By Category', data: { key: 'REVENUE_BY_CATEGORY' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Revenue By Category <span className="text-[8px] not-italic text-[#7d6b5e]/70">Share of total treatment revenue</span></span>
          <div className="flex-1 flex flex-col justify-between py-1">
            {revenueByCategory.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-[9px] gap-2">
                <span className="w-[80px] font-semibold text-[#4a3c31] truncate">{cat.name}</span>
                <div className="flex-1 h-1.5 bg-[#e5d8cb]/50 rounded-full overflow-hidden">
                  <div className="h-full bg-[#657454] rounded-full" style={{ width: `${cat.value}%` }} />
                </div>
                <span className="font-mono font-bold text-[#4a3c31]">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Therapist Performance */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Total Therapist Hours', data: { key: 'THERAPIST_HOURS' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Therapist Performance</span>
          <div className="flex-1 flex flex-col justify-between overflow-x-auto">
            <div className="grid grid-cols-[60px_repeat(3,1fr)] gap-1 text-[8.5px] font-bold text-[#7d6b5e] border-b border-[#d4c4b7]/30 pb-1 mb-1 text-right">
              <span className="text-left">Therapist</span>
              <span>Treatments</span>
              <span>Rev</span>
              <span>Util</span>
            </div>
            {therapistPerformance.map((tp, idx) => (
              <div key={idx} className="grid grid-cols-[60px_repeat(3,1fr)] gap-1 py-1.5 border-b border-[#d4c4b7]/15 last:border-0 text-[8.5px] text-[#4a3c31] text-right items-center">
                <span className="text-left font-bold">{tp.name}</span>
                <span className="font-mono">{tp.treatments}</span>
                <span className="font-mono">${(tp.revenue / 1000).toFixed(1)}k</span>
                <span className="font-mono">{tp.utilization}%</span>
              </div>
            ))}
          </div>
          <button onClick={() => openDevModal('Therapist Profiles')} className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View all therapists →</button>
        </div>

        {/* 4. Upcoming Peak Times */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Upcoming Peak Times', data: { key: 'UPCOMING_PEAK_TIMES' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Upcoming Peak Times</span>
          <div className="flex-1 flex flex-col justify-between">
            {upcomingPeakTimes.map((pt, idx) => (
              <div key={idx} className="flex justify-between items-center py-1.5 border-b border-[#d4c4b7]/25 last:border-0">
                <div className="flex flex-col">
                  <span className="font-bold text-[#4a3c31] text-[9.5px]">{pt.day}</span>
                  <span className="text-[8px] text-[#7d6b5e]">{pt.time}</span>
                </div>
                <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded ${
                  pt.level === 'High' ? 'bg-[#a65e52]/15 text-[#61271f] border border-[#a65e52]/20' : 'bg-[#C8A050]/15 text-[#7a5e2a] border border-[#C8A050]/20'
                }`}>{pt.level}</span>
              </div>
            ))}
          </div>
          <button onClick={() => openDevModal('Demand Forecast')} className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View full forecast →</button>
        </div>
      </div>

      {/* Row 4: Memberships, Insights, Retail, Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {/* 1. Membership & Packages */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Membership & Packages', data: { key: 'MEMBERSHIP_REPORT' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col justify-between min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Membership & Packages</span>
          <div className="flex-1 flex flex-col justify-between py-1 text-[9.5px]">
            <div className="flex justify-between items-center"><span className="text-[#7d6b5e]">Active Members</span><span className="font-bold text-[#4a3c31]">328 <span className="text-[8px] text-[#15803d] font-bold ml-1">+9%</span></span></div>
            <div className="flex justify-between items-center"><span className="text-[#7d6b5e]">Packages Sold</span><span className="font-bold text-[#4a3c31]">72 <span className="text-[8px] text-[#15803d] font-bold ml-1">+15%</span></span></div>
            <div className="flex justify-between items-center"><span className="text-[#7d6b5e]">Package Revenue</span><span className="font-bold text-[#4a3c31]">$86,240 <span className="text-[8px] text-[#15803d] font-bold ml-1">+21%</span></span></div>
          </div>
          <button onClick={() => openDevModal('Membership Report')} className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View membership report →</button>
        </div>

        {/* 2. Guest Wellness Insights */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Guest Wellness Insights', data: { key: 'GUEST_WELLNESS_INSIGHTS' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col justify-between min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Guest Wellness Insights</span>
          <div className="flex-1 flex flex-col justify-between py-1 text-[9px] text-[#4a3c31] gap-2.5 leading-snug mt-1.5">
            <div className="flex items-start gap-2"><Heart size={14} className="text-[#657454] shrink-0 mt-0.5" /> <span>Wellness seekers represent <strong>38%</strong> of total guests this month.</span></div>
            <div className="flex items-start gap-2"><Bed size={14} className="text-[#947b66] shrink-0 mt-0.5" /> <span>Guests staying <strong>3+ nights</strong> are <strong>2.3x</strong> more likely to book a spa treatment.</span></div>
            <div className="flex items-start gap-2"><Sunrise size={14} className="text-[#C8A050] shrink-0 mt-0.5" /> <span>Sunset hours (4 - 7 PM) are the most popular for spa bookings.</span></div>
          </div>
          <button onClick={() => openDevModal('Guest Wellness Insights')} className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View full insights →</button>
        </div>

        {/* 3. Retail Top Sellers */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Retail Top Sellers', data: { key: 'RETAIL_SELLERS_INSIGHTS' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col justify-between min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Retail Top Sellers <span className="text-[8px] not-italic text-[#7d6b5e]/70">By revenue</span></span>
          <div className="flex-1 flex flex-col justify-between">
            {retailTopSellers.map((seller, idx) => (
              <div key={idx} className="flex justify-between items-center py-1.5 border-b border-[#d4c4b7]/25 last:border-0">
                <span className="font-bold text-[#4a3c31] text-[9.5px]">{seller.name}</span>
                <span className="font-mono font-bold text-[#4a3c31]">${seller.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <button onClick={() => openDevModal('Retail Products')} className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View all products →</button>
        </div>

        {/* 4. Wellness Experience Index */}
        <div
          onClick={() => openDrawer({ type: 'SPA_DETAIL', title: 'Wellness Experience Index', data: { key: 'WELLNESS_FEEDBACK_INSIGHTS' } })}
          className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col justify-between min-h-[220px] hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
        >
          <span className="uppercase tracking-widest text-[9px] font-bold text-[#7d6b5e] mb-2">Wellness Experience Index <span className="text-[8px] not-italic text-[#7d6b5e]/70">Overall guest wellness satisfaction</span></span>
          <div className="flex items-center justify-between flex-1 py-1">
            <div className="w-[75px] h-[75px] rounded-full border-4 border-[#657454] flex flex-col items-center justify-center bg-white/20">
              <span className="text-sm font-bold text-[#4a3c31] leading-none">4.8</span>
              <span className="text-[7px] text-[#7d6b5e] mt-0.5">/ 5</span>
              <span className="text-[6px] text-[#657454] font-bold uppercase tracking-wider">Excellent</span>
            </div>
            <div className="flex-1 pl-4 flex flex-col gap-1 text-[8.5px] text-[#7d6b5e]">
              <div className="flex justify-between"><span>Treatment Quality</span><span className="font-bold text-[#4a3c31]">4.9</span></div>
              <div className="flex justify-between"><span>Therapist Experience</span><span className="font-bold text-[#4a3c31]">4.8</span></div>
              <div className="flex justify-between"><span>Facilities & Ambience</span><span className="font-bold text-[#4a3c31]">4.7</span></div>
              <div className="flex justify-between"><span>Booking Experience</span><span className="font-bold text-[#4a3c31]">4.8</span></div>
            </div>
          </div>
          <button onClick={() => openDevModal('Guest Feedback')} className="text-[#947b66] hover:text-[#4a3c31] font-bold text-[8px] uppercase tracking-wider mt-2 self-start">View full feedback →</button>
        </div>
      </div>

      {/* Row 5: Insights Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
        {[
          { text: 'Optimize utilization.', icon: <Settings size={18} className="text-[#657454]" />, key: 'SPA_UTILIZATION', title: 'Spa Utilization' },
          { text: 'Maximize therapist performance.', icon: <UsersGroupTwoRounded size={18} className="text-[#C8A050]" />, key: 'THERAPIST_HOURS', title: 'Total Therapist Hours' },
          { text: 'Enhance guest wellbeing.', icon: <Heart size={18} className="text-[#947b66]" />, key: 'GUEST_WELLNESS_INSIGHTS', title: 'Guest Wellness Insights' },
          { text: 'Drive retail & membership growth.', icon: <Bag size={18} className="text-[#586981]" />, key: 'MEMBERSHIP_REPORT', title: 'Membership & Packages' },
          { text: 'Deliver exceptional experiences.', icon: <Star size={18} className="text-[#a65e52]" />, key: 'WELLNESS_FEEDBACK_INSIGHTS', title: 'Wellness Experience Index' }
        ].map((insight, idx) => (
          <div
            key={idx}
            onClick={() => openDrawer({ type: 'SPA_DETAIL', title: insight.title, data: { key: insight.key } })}
            className="border border-[#d4c4b7]/80 rounded-[12px] p-3.5 bg-[#f3eae1]/20 backdrop-blur-xs flex items-start gap-2.5 hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
          >
            <span className="shrink-0 leading-none mt-0.5">{insight.icon}</span>
            <span className="text-[9px] text-[#4a3c31] leading-relaxed">{insight.text}</span>
          </div>
        ))}
      </div>

      <UnderDevelopmentModal
        open={showDevModal}
        onClose={() => setShowDevModal(false)}
        featureName={devFeatureName}
      />
    </div>
  );
}
