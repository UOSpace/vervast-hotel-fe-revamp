import { useState, type ComponentType, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, AltArrowDown, ChefHat } from '@solar-icons/react';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { UnderDevelopmentModal } from '../../../../../components/ui/UnderDevelopmentModal';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';

/* ───────────────────────── Single source of truth (May 2026) ───────────────────────── */

export interface NameValue { name: string; value: number; color?: string }

// Experiences — total revenue $189,320 · 1,864 bookings
export const experienceBookingsOverTime = [
  { name: 'May 1', value: 380 },
  { name: 'May 8', value: 530 },
  { name: 'May 15', value: 410 },
  { name: 'May 22', value: 680 },
  { name: 'May 29', value: 610 },
  { name: 'May 31', value: 892 },
];

export const experiencesByCategory = [
  { name: 'Water & Marine', value: 32, color: '#18181b' },
  { name: 'Nature & Adventure', value: 24, color: '#3f3f46' },
  { name: 'Cultural & Local', value: 17, color: '#52525b' },
  { name: 'Wellness & Mindfulness', value: 15, color: '#71717a' },
  { name: 'Private & Bespoke', value: 8, color: '#a1a1aa' },
  { name: 'Other', value: 4, color: '#d4d4d8' },
];

export const topExperiences = [
  { name: 'Sunset Cruise', category: 'Ocean', count: 312 },
  { name: 'Private Island Picnic', category: 'Ocean', count: 278 },
  { name: 'Guided Forest Hike', category: 'Alpine', count: 246 },
  { name: 'Wellness Journey', category: 'Sanctuary', count: 212 },
  { name: 'Cultural Village Visit', category: 'Desert', count: 184 },
];

// Sums to $189,320 (matches the Experience Revenue KPI)
export const experienceRevenueByProperty = [
  { name: 'SOSEI Beach Resort', value: 77620, pct: 41 },
  { name: 'SOSEI Ski', value: 53010, pct: 28 },
  { name: 'SOSEI Wellness', value: 34080, pct: 18 },
  { name: 'SOSEI Nature', value: 15145, pct: 8 },
  { name: 'SOSEI Urban', value: 9465, pct: 5 },
];

export const experienceTypePerformance = [
  { name: 'Water & Marine', rating: 4.8 },
  { name: 'Nature & Adventure', rating: 4.7 },
  { name: 'Cultural & Local', rating: 4.6 },
  { name: 'Wellness & Mindfulness', rating: 4.8 },
  { name: 'Private & Bespoke', rating: 4.9 },
];

export const upcomingHighlights = [
  { title: 'Full Moon Dinner', date: 'Jun 2, 7:00 PM', count: '24 Reservations' },
  { title: 'Sunrise Yoga Experience', date: 'Jun 4, 6:30 AM', count: '18 Reservations' },
  { title: "Chef's Table Experience", date: 'Jun 7, 7:00 PM', count: '12 Reservations' },
  { title: 'Whale Watching Cruise', date: 'Jun 9, 8:00 AM', count: '20 Reservations' },
];

// F&B — total revenue $512,450 · 4,450 covers
export const fnbRevenueOverTime = [
  { name: 'May 1', value: 10.2 },
  { name: 'May 8', value: 12.8 },
  { name: 'May 15', value: 9.5 },
  { name: 'May 22', value: 14.1 },
  { name: 'May 29', value: 11.8 },
  { name: 'May 31', value: 16.4 },
];

// Sums to $512,450 (matches the Total F&B Revenue KPI); covers sum to 4,450
export const revenueByOutlet = [
  { name: 'Seascape Restaurant', value: 186420, covers: '1,420', trend: '+14% YoY' },
  { name: 'Terra Pavilion', value: 112380, covers: '980', trend: '+18% YoY' },
  { name: 'Alpine Grill', value: 84760, covers: '740', trend: '+9% YoY' },
  { name: 'The Tea Lounge', value: 61240, covers: '620', trend: '+12% YoY' },
  { name: 'In-Villa Dining', value: 46810, covers: '380', trend: '+6% YoY' },
  { name: 'Poolside Bar', value: 20840, covers: '310', trend: '+22% YoY' },
];

export const topPerformingOutlets = [
  { name: 'Seascape Restaurant', value: 245, total: 300 },
  { name: 'Terra Pavilion', value: 198, total: 300 },
  { name: 'Alpine Grill', value: 176, total: 300 },
  { name: 'The Tea Lounge', value: 142, total: 300 },
  { name: 'Poolside Bar', value: 118, total: 300 },
];

export const fnbMixBreakdown = [
  { name: 'Food', value: 62, color: '#18181b' },
  { name: 'Beverage', value: 23, color: '#3f3f46' },
  { name: 'In-Villa Dining', value: 10, color: '#71717a' },
  { name: 'Events & Private Dining', value: 5, color: '#a1a1aa' },
];

export const heatmapOutlets = [
  'Seascape Restaurant',
  'Terra Pavilion',
  'Alpine Grill',
  'The Tea Lounge',
  'Poolside Bar',
  'In-Villa Dining',
];
export const heatmapTimes = ['7 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
export const heatmapData = [
  [2, 3, 5, 2, 5, 4],
  [4, 4, 3, 2, 4, 5],
  [1, 2, 4, 2, 5, 5],
  [2, 5, 4, 5, 3, 1],
  [1, 2, 4, 5, 4, 2],
  [4, 3, 3, 2, 4, 5],
];

/* ───────────────────────── Building blocks ───────────────────────── */

const CARD_BASE =
  'relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter justify-between';

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 text-[10px]">
      {children}
    </div>
  );
}

/** A grid row. Negative margin cancels the card padding so card content lines up with the header. */
export function Row({ cols, delay, children }: { cols: 2 | 3 | 4 | 5 | 6; delay?: string; children: ReactNode }) {
  const map = {
    2: 'grid-cols-1 md:grid-cols-2 gap-4',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3',
  } as const;
  return (
    <div className={`-mx-4 grid ${map[cols]} animate-card-enter`} style={delay ? { animationDelay: delay } : undefined}>
      {children}
    </div>
  );
}

interface HeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  showPos?: boolean;
}

export function DashboardHeader({ eyebrow, title, subtitle, showPos }: HeaderProps) {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date | null>(new Date('2026-05-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2026-05-31'));
  const [showDevModal, setShowDevModal] = useState(false);

  return (
    <>
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 lg:pt-6 animate-card-enter">
        <div>
          <p className="text-[10px] font-sans text-zinc-500 tracking-widest uppercase mb-0.5 font-semibold">{eyebrow}</p>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-wide">{title}</h1>
          <p className="text-[10px] text-zinc-500 font-normal mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {showPos && (
            <button
              onClick={() => navigate('/dashboard/fnb/pos')}
              className="h-8.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[10px] px-3 font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <ChefHat size={14} className="text-zinc-200" />
              <span>Point of Sale (POS)</span>
            </button>
          )}
          <div className="relative flex items-center bg-white border border-zinc-200 rounded-lg px-3 py-1.5 cursor-pointer shadow-xs">
            <DatePicker
              portalId="datepicker-portal"
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
            <Calendar size={13} className="text-zinc-400 ml-1.5 pointer-events-none" />
          </div>
          <button
            onClick={() => setShowDevModal(true)}
            className="h-8.5 border border-zinc-200 text-zinc-800 hover:bg-zinc-100 rounded-lg text-[10px] px-3.5 font-medium flex items-center gap-2 bg-white transition-all shadow-xs cursor-pointer"
          >
            <AltArrowDown size={14} className="rotate-180 text-zinc-500" />
            <span>Export</span>
          </button>
        </div>
      </div>
      <UnderDevelopmentModal open={showDevModal} onClose={() => setShowDevModal(false)} featureName="Export Report" />
    </>
  );
}

export function KpiGrid({ items }: { items: { label: string; value: string }[] }) {
  const { openDrawer } = useDashboardDrawer();
  return (
    <Row cols={6}>
      {items.map((kpi, idx) => (
        <div
          key={kpi.label}
          onClick={() => openDrawer({ type: 'METRIC', title: kpi.label, data: kpi.value })}
          className={`${CARD_BASE} h-[90px]`}
          style={{ animationDelay: `${0.05 + idx * 0.03}s` }}
        >
          <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate">{kpi.label}</span>
          <h3 className="text-[22px] font-normal text-zinc-900 leading-none mt-auto">{kpi.value}</h3>
        </div>
      ))}
    </Row>
  );
}

interface CardProps {
  title: ReactNode;
  drawerTitle: string;
  drawerData: string;
  right?: ReactNode;
  minH?: number;
  className?: string;
  children: ReactNode;
}

export function Card({ title, drawerTitle, drawerData, right, minH = 220, className = '', children }: CardProps) {
  const { openDrawer } = useDashboardDrawer();
  return (
    <div
      onClick={() => openDrawer({ type: 'METRIC', title: drawerTitle, data: drawerData })}
      className={`${CARD_BASE} ${className}`}
      style={{ minHeight: minH }}
    >
      <div className="flex justify-between items-center mb-1 h-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

export function TrendCard(props: {
  title: string;
  drawerData: string;
  last: string;
  data: { name: string; value: number }[];
}) {
  return (
    <Card
      title={props.title}
      drawerTitle={props.title}
      drawerData={props.drawerData}
      right={<span className="text-[9.5px] font-medium text-zinc-500">{props.last}</span>}
    >
      <div className="flex-1 w-full h-[140px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={props.data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={8} tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={8} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', fontSize: '10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            />
            <Line type="monotone" dataKey="value" stroke="#18181b" strokeWidth={2} dot={{ r: 3, fill: '#18181b' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

/** Pure SVG donut + legend (size 110, stroke 14 per design system). */
export function DonutCard(props: {
  title: string;
  drawerData: string;
  info?: string;
  data: { name: string; value: number; color: string }[];
  centerValue: string;
  centerLabel: string;
  centerValueClass?: string;
}) {
  const size = 110;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let acc = 0;
  return (
    <Card
      title={props.title}
      drawerTitle={props.title}
      drawerData={props.drawerData}
      right={props.info ? <InfoTooltip text={props.info} /> : undefined}
    >
      <div className="flex-1 flex items-center justify-between py-1 gap-2">
        <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {props.data.map((item, index) => {
              const len = (item.value / 100) * circumference;
              const offset = -(acc / 100) * circumference;
              acc += item.value;
              return (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${Math.max(0, len - 1.5)} ${circumference}`}
                  strokeDashoffset={offset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className={`${props.centerValueClass ?? 'text-sm'} font-bold text-zinc-900 leading-none`}>{props.centerValue}</span>
            <span className="text-[7.5px] text-zinc-500 font-medium mt-0.5">{props.centerLabel}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-0 pr-1">
          {props.data.map((item) => (
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
    </Card>
  );
}

/** Row of label/value pairs. */
export function ListCard(props: {
  title: string;
  drawerData: string;
  minH?: number;
  rows: { key: string; label: ReactNode; value: ReactNode }[];
  gap?: string;
  textSize?: string;
  footer?: ReactNode;
}) {
  return (
    <Card title={props.title} drawerTitle={props.title} drawerData={props.drawerData} minH={props.minH}>
      <div className={`flex flex-col justify-between flex-1 py-1.5 ${props.gap ?? 'gap-2'}`}>
        {props.rows.map((r) => (
          <div key={r.key} className={`flex justify-between items-center ${props.textSize ?? 'text-[10px]'}`}>
            <div className="truncate pr-1">{r.label}</div>
            <span className="font-bold text-zinc-900 shrink-0">{r.value}</span>
          </div>
        ))}
      </div>
      {props.footer}
    </Card>
  );
}

/** Row with label, thin progress bar and value. */
export function BarListCard(props: {
  title: string;
  drawerData: string;
  rows: { key: string; label: string; pct: number; value: string }[];
  labelWidth: string;
  valueWidth: string;
}) {
  return (
    <Card title={props.title} drawerTitle={props.title} drawerData={props.drawerData}>
      <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
        {props.rows.map((r) => (
          <div key={r.key} className="flex items-center justify-between text-[10px]">
            <span className={`text-zinc-600 truncate ${props.labelWidth}`}>{r.label}</span>
            <div className="flex-1 mx-2 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${r.pct}%` }} />
            </div>
            <span className={`font-bold text-zinc-900 text-right ${props.valueWidth}`}>{r.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Guiding principles as a compact list card (icon + label per line). */
export function PrinciplesCard({ items }: { items: { label: string; icon: ComponentType<{ size?: number; className?: string }> }[] }) {
  return (
    <Card title="Guiding Principles" drawerTitle="Guiding Principles" drawerData="Principles" minH={200}>
      <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
        {items.map((pill) => {
          const Icon = pill.icon;
          return (
            <div key={pill.label} className="flex items-center gap-2 text-[10px]">
              <Icon size={13} className="text-zinc-500 shrink-0" />
              <span className="font-medium text-zinc-700 truncate">{pill.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}