import { useState, useEffect } from 'react';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { CloseCircle, RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import dashboardData from '../../../data/dashboardData.json';

const contactData = [
  { name: 'John Doe', country: 'United States', email: 'john.doe@example.com', phone: '+1 (555) 019-2834' },
  { name: 'Jane Smith', country: 'United States', email: 'jane.smith@example.com', phone: '+1 (555) 014-4921' },
  { name: 'Robert Johnson', country: 'United States', email: 'robert.j@example.com', phone: '+1 (555) 017-8833' },
  { name: 'Emily Davis', country: 'United Kingdom', email: 'emily.d@example.co.uk', phone: '+44 20 7946 0958' },
  { name: 'Oliver Wilson', country: 'United Kingdom', email: 'oliver.w@example.co.uk', phone: '+44 20 7946 0912' },
  { name: 'Hans Müller', country: 'Germany', email: 'hans.mueller@example.de', phone: '+49 30 123456' },
  { name: 'Anna Schmidt', country: 'Germany', email: 'anna.s@example.de', phone: '+49 40 654321' },
  { name: 'Aarav Patel', country: 'India', email: 'aarav.patel@example.in', phone: '+91 22 2789 4567' },
  { name: 'Priya Sharma', country: 'India', email: 'priya.sharma@example.in', phone: '+91 11 4123 5678' },
  { name: 'Lachlan Munro', country: 'Australia', email: 'lachlan.m@example.com.au', phone: '+61 2 9876 5432' },
  { name: 'Sarah Jenkins', country: 'Australia', email: 'sarah.j@example.com.au', phone: '+61 3 8765 4321' },
  { name: 'Michael Brown', country: 'United States', email: 'michael.b@example.com', phone: '+1 (555) 012-3456' },
  { name: 'Sophia Evans', country: 'United Kingdom', email: 'sophia.e@example.co.uk', phone: '+44 20 7946 0111' },
  { name: 'Lukas Fischer', country: 'Germany', email: 'lukas.f@example.de', phone: '+49 89 987654' },
  { name: 'Aditya Rao', country: 'India', email: 'aditya.rao@example.in', phone: '+91 80 5555 1234' }
];

const propertiesPerformanceData = [
  {
    id: 'alpine',
    name: 'Sosei Alpine',
    location: 'Switzerland',
    occ: '76%',
    adr: '$2,700',
    revenue: '$2.10M',
    revpar: '$2,010',
    children: [
      { name: 'Sosei Nocturne', location: 'Switzerland', occ: '78%', adr: '$2,800', revenue: '$1.10M', revpar: '$2,080' },
      { name: 'Sosei Aurora', location: 'Finland', occ: '74%', adr: '$2,600', revenue: '$1.00M', revpar: '$1,940' }
    ]
  },
  {
    id: 'ocean',
    name: 'Sosei Ocean',
    location: 'Maldives',
    occ: '72%',
    adr: '$2,200',
    revenue: '$1.30M',
    revpar: '$1,550',
    children: [
      { name: 'Sosei Maréa', location: 'Maldives', occ: '74%', adr: '$2,300', revenue: '$0.70M', revpar: '$1,620' },
      { name: 'Sosei Pelagia', location: 'Indonesia', occ: '70%', adr: '$2,100', revenue: '$0.60M', revpar: '$1,480' }
    ]
  },
  {
    id: 'city',
    name: 'Sosei City',
    location: 'New York, USA',
    occ: '68%',
    adr: '$2,500',
    revenue: '$0.60M',
    revpar: '$1,680',
    children: [
      { name: 'Sosei Verper', location: 'New York, USA', occ: '70%', adr: '$2,600', revenue: '$0.35M', revpar: '$1,750' },
      { name: 'Sosei Élan', location: 'New York, USA', occ: '66%', adr: '$2,400', revenue: '$0.25M', revpar: '$1,610' }
    ]
  },
  {
    id: 'forest',
    name: 'Sosei Forest',
    location: 'Tokyo, Japan',
    occ: '60%',
    adr: '$1,600',
    revenue: '$0.70M',
    revpar: '$950',
    children: [
      { name: 'Sosei Sylvan', location: 'Kyoto', occ: '62%', adr: '$1,700', revenue: '$0.40M', revpar: '$1,020' },
      { name: 'Sosei Verdant', location: 'Thailand', occ: '58%', adr: '$1,500', revenue: '$0.30M', revpar: '$880' }
    ]
  },
  {
    id: 'countryside',
    name: 'Sosei Countryside',
    location: 'Melbourne, Australia',
    occ: '72%',
    adr: '$1,800',
    revenue: '$1.00M',
    revpar: '$1,290',
    children: [
      { name: 'Sosei Hearth', location: 'Tuscany, Italy', occ: '74%', adr: '$1,900', revenue: '$0.55M', revpar: '$1,360' },
      { name: 'Sosei Pastoral', location: 'Provence, France', occ: '70%', adr: '$1,700', revenue: '$0.45M', revpar: '$1,220' }
    ]
  },
  {
    id: 'desert',
    name: 'Sosei Desert',
    location: 'Cairo, Egypt',
    occ: '60%',
    adr: '$1,800',
    revenue: '$0.20M',
    revpar: '$1,088',
    children: [
      { name: 'Sosei Mirage', location: 'Egypt', occ: '62%', adr: '$1,900', revenue: '$0.12M', revpar: '$1,148' },
      { name: 'Sosei Solstice', location: 'Oman', occ: '58%', adr: '$1,700', revenue: '$0.08M', revpar: '$1,028' }
    ]
  }
];

export function DashboardDrawer() {
  const { isOpen, config, closeDrawer, openDrawer } = useDashboardDrawer();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setActive(true), 20);
      return () => clearTimeout(timer);
    } else {
      setActive(false);
    }
  }, [isOpen]);

  if (!config) return null;

  const renderContent = () => {
    if (!config) return null;

    switch (config.type) {
      case 'LIVE_OVERVIEW':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xs text-[#7d6b5e]">Global real-time property status.</p>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Sosei Alpine', time: '14:30 CET', occ: '92%', status: 'High Activity' },
                { name: 'Sosei Ocean', time: '08:30 EST', occ: '85%', status: 'Moderate' },
                { name: 'Sosei City', time: '09:30 EDT', occ: '88%', status: 'High Activity' },
                { name: 'Sosei Forest', time: '22:30 JST', occ: '65%', status: 'Low' },
                { name: 'Sosei Desert', time: '17:30 GST', occ: '40%', status: 'Limited' },
              ].map((resort) => (
                <div key={resort.name} className="p-3 border border-[#d4c4b7] rounded-lg bg-[#f3eae1]/50 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#4a3c31] text-sm">{resort.name}</div>
                    <div className="text-[10px] text-[#7d6b5e]">Local Time: {resort.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#657454]">{resort.occ}</div>
                    <div className="text-[10px] text-[#7d6b5e]">{resort.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'METRIC':
        {
          const parseCardValue = () => {
            if (!config.data) return null;
            const str = String(config.data);
            const cleaned = str.replace(/[^0-9.]/g, '');
            return parseFloat(cleaned) || null;
          };

          const cardVal = parseCardValue();

          const getMetricDetails = () => {
            const t = config.title.toUpperCase();
            if (t.includes('OCCUPANCY')) {
              const base = cardVal !== null ? cardVal : 68;
              return {
                data: [
                  { day: 'Mon', value: Math.min(100, Math.max(0, Math.round(base - 8))) },
                  { day: 'Tue', value: Math.min(100, Math.max(0, Math.round(base - 4))) },
                  { day: 'Wed', value: Math.min(100, Math.max(0, Math.round(base - 1))) },
                  { day: 'Thu', value: Math.min(100, Math.max(0, Math.round(base + 3))) },
                  { day: 'Fri', value: Math.min(100, Math.max(0, Math.round(base + 7))) },
                  { day: 'Sat', value: Math.min(100, Math.max(0, Math.round(base + 10))) },
                  { day: 'Sun', value: Math.min(100, Math.max(0, Math.round(base + 12))) },
                ],
                prefix: '',
                suffix: '%',
                drivers: [
                  'High occupancy driven by weekend leisure travelers.',
                  'Increased conference group check-ins on Thursday.',
                  'Seasonal promotional packages boost weekday occupancy.'
                ]
              };
            } else if (t.includes('REVENUE')) {
              const base = cardVal !== null ? cardVal : 10.21;
              const revMon = parseFloat((base * 0.08).toFixed(2));
              const revTue = parseFloat((base * 0.09).toFixed(2));
              const revWed = parseFloat((base * 0.10).toFixed(2));
              const revThu = parseFloat((base * 0.11).toFixed(2));
              const revFri = parseFloat((base * 0.12).toFixed(2));
              const revSat = parseFloat((base * 0.13).toFixed(2));
              const revSun = parseFloat((base - (revMon + revTue + revWed + revThu + revFri + revSat)).toFixed(2));
              return {
                data: [
                  { day: 'Mon', value: revMon },
                  { day: 'Tue', value: revTue },
                  { day: 'Wed', value: revWed },
                  { day: 'Thu', value: revThu },
                  { day: 'Fri', value: revFri },
                  { day: 'Sat', value: revSat },
                  { day: 'Sun', value: revSun },
                ],
                prefix: '$',
                suffix: 'M',
                drivers: [
                  'F&B banquet revenue up due to private weddings.',
                  'Room revenue remains main driver at 65% of total mix.',
                  'Spa sales increase by 12% following new wellness package launch.'
                ]
              };
            } else if (t.includes('REVPAR')) {
              const base = cardVal !== null ? cardVal : 895;
              return {
                data: [
                  { day: 'Mon', value: Math.round(base * 0.85) },
                  { day: 'Tue', value: Math.round(base * 0.88) },
                  { day: 'Wed', value: Math.round(base * 0.92) },
                  { day: 'Thu', value: Math.round(base * 0.96) },
                  { day: 'Fri', value: Math.round(base * 1.02) },
                  { day: 'Sat', value: Math.round(base * 1.08) },
                  { day: 'Sun', value: Math.round(base * 1.15) },
                ],
                prefix: '$',
                suffix: '',
                drivers: [
                  'Strong room yield optimization via dynamic pricing.',
                  'High-value suite upgrades contribute to RevPAR increase.',
                  'RevPAR growth matches occupancy peak on weekends.'
                ]
              };
            } else if (t.includes('ADR')) {
              const base = cardVal !== null ? cardVal : 1316;
              return {
                data: [
                  { day: 'Mon', value: Math.round(base * 0.85) },
                  { day: 'Tue', value: Math.round(base * 0.88) },
                  { day: 'Wed', value: Math.round(base * 0.92) },
                  { day: 'Thu', value: Math.round(base * 0.96) },
                  { day: 'Fri', value: Math.round(base * 1.02) },
                  { day: 'Sat', value: Math.round(base * 1.08) },
                  { day: 'Sun', value: Math.round(base * 1.15) },
                ],
                prefix: '$',
                suffix: '',
                drivers: [
                  'Premium villa bookings raise the average daily rate.',
                  'Minimal corporate discount usage over weekends.',
                  'Direct booking rate parity matches travel agent ADR.'
                ]
              };
            } else if (t.includes('NIGHTS')) {
              const base = cardVal !== null ? cardVal : 7757;
              const mon = Math.round(base * 0.08);
              const tue = Math.round(base * 0.09);
              const wed = Math.round(base * 0.10);
              const thu = Math.round(base * 0.11);
              const fri = Math.round(base * 0.12);
              const sat = Math.round(base * 0.13);
              const sun = base - (mon + tue + wed + thu + fri + sat);

              return {
                data: [
                  { day: 'Mon', value: mon },
                  { day: 'Tue', value: tue },
                  { day: 'Wed', value: wed },
                  { day: 'Thu', value: thu },
                  { day: 'Fri', value: fri },
                  { day: 'Sat', value: sat },
                  { day: 'Sun', value: sun },
                ],
                prefix: '',
                suffix: ' nights',
                drivers: [
                  'Longer average length of stay (LOS) in beach properties.',
                  'Group bookings for retreat event secure 400 room nights.',
                  'High repeat guest ratio contributes to stable booking volume.'
                ]
              };
            } else {
              const base = cardVal !== null ? cardVal : 400;
              return {
                data: [
                  { day: 'Mon', value: Math.round(base * 0.85) },
                  { day: 'Tue', value: Math.round(base * 0.88) },
                  { day: 'Wed', value: Math.round(base * 0.92) },
                  { day: 'Thu', value: Math.round(base * 0.96) },
                  { day: 'Fri', value: Math.round(base * 1.02) },
                  { day: 'Sat', value: Math.round(base * 1.08) },
                  { day: 'Sun', value: Math.round(base * 1.15) },
                ],
                prefix: '',
                suffix: '',
                drivers: [
                  'Strong demand for the weekend.',
                  'Group bookings up 15% across all properties.',
                  'Corporate market segment increased by 10% across all properties.'
                ]
              };
            }
          };

          const { data: metricData, prefix, suffix, drivers } = getMetricDetails();

          return (
            <div className="space-y-6 animate-fade-in">
              <p className="text-xs text-[#7d6b5e]">Daily {config.title}{config.title.toLocaleLowerCase() == 'number of guests' ? ' checked in' : ''}.</p>
              <div className="h-[200px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metricData} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d4c4b7" opacity={0.3} />
                    <Line type="monotone" dataKey="value" stroke="#C8A050" strokeWidth={3} dot={{ r: 4, fill: '#C8A050' }} />
                    <Tooltip
                      formatter={(value: any) => [`${prefix}${value.toLocaleString()}${suffix}`, 'Value']}
                      contentStyle={{ backgroundColor: '#f3eae1', border: '1px solid #d4c4b7', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7d6b5e' }} dy={10} interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7d6b5e' }} tickFormatter={(v: number) => `${prefix}${v.toLocaleString()}${suffix}`} width={60} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 border-t border-[#d4c4b7] pt-4">
                <div className="font-bold text-sm text-[#4a3c31] mb-2">Key Drivers</div>
                <ul className="text-xs text-[#6A5848] space-y-2 list-disc pl-4">
                  {drivers.map((driver, idx) => (
                    <li key={idx}>{driver}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        }

      case 'ALERTS':
        // If data is provided, show specific alert detail
        if (config.data) {
          const alert = config.data;
          const priorityColorMap: Record<string, string> = {
            High: '#a65e52',
            Medium: '#C8A050',
            Low: '#657454',
          };
          const priorityColor = priorityColorMap[alert.priority] || '#7d6b5e';

          return (
            <div className="space-y-6 animate-fade-in text-[#4a3c31]">
              <button
                onClick={() => openDrawer({ type: 'ALERTS', title: 'Global Alerts & Insights' })}
                className="text-[10px] text-[#7d6b5e] hover:text-[#4a3c31] flex items-center gap-1 mb-2 outline-none cursor-pointer"
              >
                ← Back to all alerts
              </button>

              <div className="border border-[#d4c4b7] rounded-lg p-5 bg-[#f3eae1]/0 ">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded border" style={{ borderColor: `${priorityColor}50`, color: priorityColor, backgroundColor: `${priorityColor}10` }}>
                    {alert.priority} Priority
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold mb-2 leading-snug">{alert.title}</h3>
                <p className="text-xs font-semibold mb-4 text-[#7d6b5e]">{alert.text}</p>

                <div className="border-t border-[#d4c4b7] pt-4 mt-4">
                  <h4 className="text-[10px] font-bold tracking-wider uppercase text-[#7d6b5e] mb-2">Detailed Report</h4>
                  <p className="text-xs leading-relaxed text-[#6A5848] font-serif italic">
                    {alert.detail}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={closeDrawer}
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#a65e52] rounded hover:bg-[#8f5045] transition-colors cursor-pointer"
                >
                  Acknowledge Alert
                </button>
              </div>
            </div>
          );
        }

        // Otherwise, show list of all alerts
        return (
          <div className="space-y-4 animate-fade-in">
            <p className="text-xs text-[#7d6b5e] mb-2">Actionable insights requiring attention across all properties.</p>
            <div className="flex flex-col gap-3">
              {dashboardData.globalAlerts.map((alert: any) => {
                const priorityColorMap: Record<string, string> = {
                  High: '#a65e52',
                  Medium: '#C8A050',
                  Low: '#657454',
                };
                const borderLeftColor = priorityColorMap[alert.priority] || '#d4c4b7';

                return (
                  <div
                    key={alert.id}
                    className="p-4 border-l-4 rounded-r-lg bg-[#f3eae1]/50 border-t border-r border-b border-[#d4c4b7]/50 flex flex-col justify-between"
                    style={{ borderLeftColor }}
                  >
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-sm" style={{ color: borderLeftColor }}>{alert.title}</span>
                        <span className="text-[8px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border" style={{ borderColor: `${borderLeftColor}40`, color: borderLeftColor, backgroundColor: `${borderLeftColor}08` }}>
                          {alert.priority}
                        </span>
                      </div>
                      <p className="text-xs text-[#4a3c31] mt-1">{alert.text}</p>
                    </div>
                    <button
                      onClick={() => openDrawer({ type: 'ALERTS', title: 'Alert Details', data: alert })}
                      className="text-[9px] text-[#a65e52] font-semibold border-b border-transparent hover:border-[#a65e52] self-start transition-colors outline-none focus:outline-none cursor-pointer mt-3"
                    >
                      See details →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'GUEST_MOVEMENT':
        const movementData = [
          { name: 'Alpine', arr: 120, in: 450, dep: 80 },
          { name: 'Ocean', arr: 90, in: 300, dep: 110 },
          { name: 'City', arr: 200, in: 600, dep: 180 },
        ];
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xs text-[#7d6b5e]">Arrivals, In-house, and Departures breakdown.</p>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={movementData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#4a3c31' }} width={50} />
                  <Tooltip cursor={{ fill: '#E3CCB2', opacity: 0.2 }} contentStyle={{ backgroundColor: '#f3eae1', border: '1px solid #d4c4b7', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="arr" name="Arrivals" stackId="a" fill="#C8A050" />
                  <Bar dataKey="in" name="In-House" stackId="a" fill="#d4c4b7" />
                  <Bar dataKey="dep" name="Departures" stackId="a" fill="#a65e52" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'PORTFOLIO_PERFORMANCE':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xs text-[#7d6b5e]">Portfolio performance by properties type MTD.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-[#4a3c31]">
                <thead>
                  <tr className="border-b border-[#d4c4b7] text-left">
                    <th className="pb-2 font-bold">Property Type</th>
                    <th className="pb-2 font-bold text-right">Occupancy</th>
                    <th className="pb-2 font-bold text-right">ADR</th>
                    <th className="pb-2 font-bold text-right">Revenue</th>
                    <th className="pb-2 font-bold text-right">RevPAR</th>
                  </tr>
                </thead>
                <tbody>
                  {propertiesPerformanceData.map((prop) => {
                    const isExpanded = !!expandedRows[prop.id];
                    return (
                      <>
                        <tr
                          key={prop.id}
                          className="border-b border-[#d4c4b7]/50 hover:bg-[#f3eae1]/30 cursor-pointer transition-colors"
                          onClick={() => setExpandedRows(prev => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                        >
                          <td className="py-3 font-semibold flex items-center gap-1.5">
                            {isExpanded ? (
                              <RoundAltArrowDown size={14} className="text-[#7d6b5e] shrink-0" />
                            ) : (
                              <RoundAltArrowRight size={14} className="text-[#7d6b5e] shrink-0" />
                            )}
                            {prop.name}
                          </td>
                          <td className="py-3 text-right">{prop.occ}</td>
                          <td className="py-3 text-right">{prop.adr}</td>
                          <td className="py-3 text-right font-bold text-[#a65e52]">{prop.revenue}</td>
                          <td className="py-3 text-right font-semibold">{prop.revpar}</td>
                        </tr>
                        {isExpanded && prop.children.map((child, cIdx) => (
                          <tr key={`${prop.id}-child-${cIdx}`} className="border-b border-[#d4c4b7]/30 bg-[#f3eae1]/10 text-[#7d6b5e]">
                            <td className="py-2.5 pl-7 italic font-medium">{child.name}</td>
                            <td className="py-2.5 text-right">{child.occ}</td>
                            <td className="py-2.5 text-right">{child.adr}</td>
                            <td className="py-2.5 text-right font-semibold text-[#a65e52]/80">{child.revenue}</td>
                            <td className="py-2.5 text-right">{child.revpar}</td>
                          </tr>
                        ))}
                      </>
                    );
                  })}
                  <tr className="font-bold border-t-2 border-[#d4c4b7] bg-[#f3eae1]/30">
                    <td className="py-3">Total / Average</td>
                    <td className="py-3 text-right">68%</td>
                    <td className="py-3 text-right">$2,100</td>
                    <td className="py-3 text-right text-[#a65e52]">$5.9M</td>
                    <td className="py-3 text-right">$1,428</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'WORLD_MAP':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xs text-[#7d6b5e]">Geographic distribution and properties status details.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-[#4a3c31]">
                <thead>
                  <tr className="border-b border-[#d4c4b7] text-left">
                    <th className="pb-2 font-bold">Property Type</th>
                    <th className="pb-2 font-bold">Region/Location</th>
                    <th className="pb-2 font-bold text-right">Occupancy</th>
                    <th className="pb-2 font-bold text-right">ADR</th>
                    <th className="pb-2 font-bold text-right">Revenue</th>
                    <th className="pb-2 font-bold text-right">RevPAR</th>
                  </tr>
                </thead>
                <tbody>
                  {propertiesPerformanceData.map((prop) => {
                    const isExpanded = !!expandedRows[prop.id];
                    return (
                      <>
                        <tr
                          key={prop.id}
                          className="border-b border-[#d4c4b7]/50 hover:bg-[#f3eae1]/30 cursor-pointer transition-colors"
                          onClick={() => setExpandedRows(prev => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                        >
                          <td className="py-3 font-semibold flex items-center gap-1.5">
                            {isExpanded ? (
                              <RoundAltArrowDown size={14} className="text-[#7d6b5e] shrink-0" />
                            ) : (
                              <RoundAltArrowRight size={14} className="text-[#7d6b5e] shrink-0" />
                            )}
                            {prop.name}
                          </td>
                          <td className="py-3 text-[#7d6b5e]"></td>
                          <td className="py-3 text-right">{prop.occ}</td>
                          <td className="py-3 text-right">{prop.adr}</td>
                          <td className="py-3 text-right font-bold text-[#a65e52]">{prop.revenue}</td>
                          <td className="py-3 text-right font-semibold">{prop.revpar}</td>
                        </tr>
                        {isExpanded && prop.children.map((child, cIdx) => (
                          <tr key={`${prop.id}-child-${cIdx}`} className="border-b border-[#d4c4b7]/30 bg-[#f3eae1]/10 text-[#7d6b5e]">
                            <td className="py-2.5 pl-7 italic font-medium">{child.name}</td>
                            <td className="py-2.5 text-[#7d6b5e]/70">{child.location}</td>
                            <td className="py-2.5 text-right">{child.occ}</td>
                            <td className="py-2.5 text-right">{child.adr}</td>
                            <td className="py-2.5 text-right font-semibold text-[#a65e52]/80">{child.revenue}</td>
                            <td className="py-2.5 text-right">{child.revpar}</td>
                          </tr>
                        ))}
                      </>
                    );
                  })}
                  <tr className="font-bold border-t-2 border-[#d4c4b7] bg-[#f3eae1]/30">
                    <td className="py-3">Total / Average</td>
                    <td className="py-3"></td>
                    <td className="py-3 text-right">68%</td>
                    <td className="py-3 text-right">$2,100</td>
                    <td className="py-3 text-right text-[#a65e52]">$5.9M</td>
                    <td className="py-3 text-right">$1,428</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'TOP_NATIONALITIES':
        {
          const countries = ['All', 'United States', 'United Kingdom', 'Germany', 'India', 'Australia'];
          const filtered = selectedCountry === 'All'
            ? contactData
            : contactData.filter(c => c.country === selectedCountry);

          const itemsPerPage = 5;
          const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

          const activePage = Math.min(currentPage, totalPages);
          const startIndex = (activePage - 1) * itemsPerPage;
          const currentContacts = filtered.slice(startIndex, startIndex + itemsPerPage);

          return (
            <div className="space-y-4 animate-fade-in text-[#4a3c31]">
              <p className="text-xs text-[#7d6b5e]">In-house guest contact registry by nationality.</p>

              {/* Country Filter Tab buttons */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {countries.map(country => (
                  <button
                    key={country}
                    onClick={() => {
                      setSelectedCountry(country);
                      setCurrentPage(1);
                    }}
                    className={`text-[8px] font-sans font-semibold tracking-wider px-2 py-1 rounded border transition-all cursor-pointer ${selectedCountry === country
                      ? 'bg-[#a65e52] text-white border-[#a65e52]'
                      : 'bg-[#f3eae1]/50 text-[#7d6b5e] border-[#d4c4b7]/50 hover:bg-[#e5d8cb]/30'
                      }`}
                  >
                    {country === 'All' ? 'All' : country.replace('United States', 'USA').replace('United Kingdom', 'UK')}
                  </button>
                ))}
              </div>

              {/* Contacts Table */}
              <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                <table className="w-full text-[10px] text-[#4a3c31]">
                  <thead>
                    <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/0  text-left font-bold">
                      <th className="p-2.5">Guest Name</th>
                      <th className="p-2.5">Nationality</th>
                      <th className="p-2.5">Contact Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentContacts.map((contact, idx) => (
                      <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                        <td className="p-2.5 font-bold">{contact.name}</td>
                        <td className="p-2.5 text-[#7d6b5e]">{contact.country}</td>
                        <td className="p-2.5 text-[9px] leading-relaxed">
                          <div className="text-[#a65e52] font-semibold">{contact.email}</div>
                          <div className="text-[#9B8272]">{contact.phone}</div>
                        </td>
                      </tr>
                    ))}
                    {currentContacts.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-[#7d6b5e] italic">
                          No guest contacts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-[#d4c4b7]/40 mt-4 text-[9px]">
                <button
                  disabled={activePage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-2.5 py-1.5 rounded border border-[#d4c4b7] text-[#4a3c31] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f3eae1]/50 transition-colors cursor-pointer font-bold"
                >
                  Prev
                </button>
                <span className="text-[#7d6b5e] font-sans">
                  Page <strong className="text-[#4a3c31]">{activePage}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                  disabled={activePage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-2.5 py-1.5 rounded border border-[#d4c4b7] text-[#4a3c31] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f3eae1]/50 transition-colors cursor-pointer font-bold"
                >
                  Next
                </button>
              </div>
            </div>
          );
        }

      case 'SENTIMENT_SCORE':
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xs text-[#7d6b5e]">Score breakdown and recent qualitative feedback.</p>
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex justify-between text-xs text-[#4a3c31]">
                <span>Cleanliness</span><span className="font-bold">4.9/5</span>
              </div>
              <div className="w-full bg-[#d4c4b7] h-1.5 rounded-full"><div className="bg-[#C8A050] h-1.5 rounded-full w-[98%]"></div></div>

              <div className="flex justify-between text-xs text-[#4a3c31] mt-2">
                <span>Service</span><span className="font-bold">4.8/5</span>
              </div>
              <div className="w-full bg-[#d4c4b7] h-1.5 rounded-full"><div className="bg-[#C8A050] h-1.5 rounded-full w-[96%]"></div></div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white/40 rounded-lg border border-[#d4c4b7]">
                <div className="text-xs italic text-[#4a3c31]">"Absolutely stunning resort. The spa at Alpine was world-class."</div>
                <div className="text-[10px] font-bold text-[#C8A050] mt-2">- J. Smith (US)</div>
              </div>
              <div className="p-3 bg-white/40 rounded-lg border border-[#d4c4b7]">
                <div className="text-xs italic text-[#4a3c31]">"Impeccable service, though the dining options were somewhat limited at night."</div>
                <div className="text-[10px] font-bold text-[#C8A050] mt-2">- M. Weber (DE)</div>
              </div>
            </div>
          </div>
        );

      case 'GUEST_ARRIVALS':
        return (
          <div className="space-y-6 animate-fade-in text-[#4a3c31]">
            <p className="text-xs text-[#7d6b5e]">VVIP Arrivals schedule and service requests today.</p>
            <div className="flex flex-col gap-3">
              {dashboardData.guestArrivals.filter(g => g.vip).map((guest: any) => (
                <div key={guest.id} className="p-4 border border-[#d4c4b7] rounded-lg bg-[#f3eae1]/0 ">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-[#a65e52]">{guest.name}</span>
                    <span className="text-[8px] border border-[#a65e52] text-[#a65e52] bg-[#a65e52]/5 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">VVIP</span>
                  </div>
                  <div className="text-[10px] text-[#7d6b5e] space-y-1 mt-2">
                    <div><strong>Sanctuary:</strong> {guest.property}</div>
                    <div><strong>ETA:</strong> {guest.time}</div>
                    <div><strong>Room Request:</strong> High floor, non-smoking</div>
                    <div><strong>Preference:</strong> Zen tea ceremony booking</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'GUEST_NEEDS':
        return (
          <div className="space-y-6 animate-fade-in text-[#4a3c31]">
            <p className="text-xs text-[#7d6b5e]">Top guest inquiries and amenity requests today.</p>
            <div className="flex flex-col gap-4">
              {dashboardData.topGuestNeeds.map((need: any, idx: number) => (
                <div key={idx} className="p-4 border border-[#d4c4b7] rounded-lg bg-[#f3eae1]/0 ">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-[#4a3c31]">{need.label}</span>
                    <span className="text-sm font-bold text-[#a65e52]">{need.percentage}</span>
                  </div>
                  <div className="w-full bg-[#d4c4b7] h-1.5 rounded-full">
                    <div className="bg-[#a65e52] h-1.5 rounded-full" style={{ width: need.percentage }}></div>
                  </div>
                  <p className="text-[9px] text-[#7d6b5e] mt-2">Currently being serviced by resort experience team.</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'NOTES_YESTERDAY':
        return (
          <div className="space-y-6 animate-fade-in text-[#4a3c31]">
            <p className="text-xs text-[#7d6b5e]">Operator field notes and feedback diary.</p>
            <div className="p-5 border border-[#d4c4b7] rounded-lg bg-[#fdfaf7] relative font-serif italic text-xs leading-relaxed">
              <span className="text-[#a65e52] text-3xl absolute top-2 left-2 leading-none">"</span>
              <div className="pl-6 pt-2">
                {dashboardData.notesFromYesterday.text}
                <div className="text-right text-[10px] font-sans font-bold uppercase tracking-wider text-[#a65e52] mt-4">— {dashboardData.notesFromYesterday.author}</div>
              </div>
            </div>
            <div className="border-t border-[#d4c4b7] pt-4">
              <h4 className="text-[10px] font-bold tracking-wider uppercase text-[#7d6b5e] mb-3">Department Breakdown</h4>
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between border-b border-[#d4c4b7]/30 pb-1.5">
                  <span className="font-bold">Front Office</span><span className="text-[#657454]">Checked-in 100% on time</span>
                </div>
                <div className="flex justify-between border-b border-[#d4c4b7]/30 pb-1.5">
                  <span className="font-bold">F&B Experience</span><span className="text-[#C8A050]">Fondue event high praise</span>
                </div>
                <div className="flex justify-between border-b border-[#d4c4b7]/30 pb-1.5">
                  <span className="font-bold">Housekeeping</span><span className="text-[#657454]">Room turnaround under 25m</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'JOURNEY_TIMELINE':
        return (
          <div className="space-y-6 animate-fade-in text-[#4a3c31]">
            <p className="text-xs text-[#7d6b5e]">The expansion history of Sosei sanctuaries.</p>
            <div className="relative border-l border-[#d4c4b7] ml-3 pl-6 space-y-6">
              {dashboardData.journeyTimeline.map((item: any, idx: number) => (
                <div key={idx} className="relative">
                  {/* Dot on the vertical line */}
                  <span className="absolute -left-[30px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#a65e52] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a65e52]"></span>
                  </span>
                  <div className="text-[9px] font-bold text-[#a65e52] tracking-wider uppercase">{item.date}</div>
                  <h4 className="font-serif text-sm font-bold mt-0.5">{item.name}</h4>
                  <p className="text-[9px] text-[#7d6b5e]">{item.location}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'SPEND_OVERTIME':
        {
          const spendBreakdown = [
            { year: '2021', avg: 1865, room: 11190, fnb: 3730, spa: 1865, exc: 1865, total: 18650 },
            { year: '2022', avg: 1970, room: 14184, fnb: 4728, spa: 2364, exc: 2364, total: 23640 },
            { year: '2023', avg: 1990, room: 17910, fnb: 5970, spa: 2985, exc: 2985, total: 29850 },
            { year: '2024 YTD', avg: 2140, room: 3852, fnb: 1284, spa: 642, exc: 642, total: 6420 }
          ];

          return (
            <div className="space-y-6 animate-fade-in text-[#4a3c31]">
              <p className="text-xs text-[#7d6b5e]">Detailed annual guest spending breakdown and average spend per booking (USD).</p>
              <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                <table className="w-full text-[10px] text-[#4a3c31]">
                  <thead>
                    <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/0  text-left font-bold">
                      <th className="p-2.5">Year</th>
                      <th className="p-2.5 text-right">Avg/Booking</th>
                      <th className="p-2.5 text-right">Room</th>
                      <th className="p-2.5 text-right">F&B</th>
                      <th className="p-2.5 text-right">Spa</th>
                      <th className="p-2.5 text-right">Excursion</th>
                      <th className="p-2.5 text-right">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spendBreakdown.map((item, idx) => (
                      <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                        <td className="p-2.5 font-bold">{item.year}</td>
                        <td className="p-2.5 text-right font-semibold text-[#657454]">${item.avg.toLocaleString()}</td>
                        <td className="p-2.5 text-right text-[#7d6b5e]">${item.room.toLocaleString()}</td>
                        <td className="p-2.5 text-right text-[#7d6b5e]">${item.fnb.toLocaleString()}</td>
                        <td className="p-2.5 text-right text-[#7d6b5e]">${item.spa.toLocaleString()}</td>
                        <td className="p-2.5 text-right text-[#7d6b5e]">${item.exc.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-bold text-[#a65e52]">${item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'GEO_MARKET':
        {
          const rawTableData = Array.isArray(config.data) ? config.data : [
            { region: 'Asia Pacific', rnights: '32.5%', adr: '$274', revenue: '$3.43M' },
            { region: 'Europe', rnights: '20.4%', adr: '$312', revenue: '$2.94M' },
            { region: 'America', rnights: '22.7%', adr: '$245', revenue: '$2.31M' },
            { region: 'Middle East', rnights: '9.6%', adr: '$221', revenue: '$1.05M' },
            { region: 'Africa', rnights: '6.6%', adr: '$195', revenue: '$0.45M' },
          ];

          const countriesMap: Record<string, string> = {
            'Asia Pacific': 'China, Japan, Australia',
            'Europe': 'UK, Germany, France',
            'America': 'USA, Canada, Brazil',
            'Middle East': 'UAE, Saudi Arabia, Oman',
            'Africa': 'South Africa, Egypt, Kenya',
          };

          const geoTableData = rawTableData
            .filter((item: any) => !item.isTotal)
            .map((item: any) => ({
              region: item.region || item.name || '',
              rnights: item.rnights || (item.value ? `${item.value}%` : ''),
              adr: item.adr || '-',
              revenue: item.revenue || '-',
              countries: item.countries || countriesMap[item.region || item.name] || 'Local markets',
            }));

          return (
            <div className="space-y-6 animate-fade-in text-[#4a3c31]">
              <p className="text-xs text-[#7d6b5e]">Detailed regional room night and revenue contribution.</p>
              <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                <table className="w-full text-[10px] text-[#4a3c31]">
                  <thead>
                    <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/0 text-left font-bold">
                      <th className="p-2.5">Region</th>
                      <th className="p-2.5 text-right">% Rnights</th>
                      <th className="p-2.5 text-right">ADR (USD)</th>
                      <th className="p-2.5 text-right">Room Revenue (USD)</th>
                      <th className="p-2.5">Top Markets</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geoTableData.map((row, idx) => (
                      <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                        <td className="p-2.5 font-bold">{row.region}</td>
                        <td className="p-2.5 text-right text-[#657454] font-semibold">{row.rnights}</td>
                        <td className="p-2.5 text-right text-[#7d6b5e]">{row.adr}</td>
                        <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.revenue}</td>
                        <td className="p-2.5 text-[#7d6b5e] text-[9.5px] italic">{row.countries}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'MARKET_SEGMENT':
        {
          const rawSegmentData = Array.isArray(config.data) ? config.data : [
            { segment: 'Leisure', rnights: '56.2%', adr: '$262', revenue: '$3.43M' },
            { segment: 'Business', rnights: '23.1%', adr: '$312', revenue: '$2.94M' },
            { segment: 'Social', rnights: '10.4%', adr: '$195', revenue: '$2.31M' },
            { segment: 'MICE', rnights: '7.6%', adr: '$278', revenue: '$1.55M' },
            { segment: 'Others', rnights: '2.7%', adr: '$175', revenue: '$0.48M' },
          ];

          const descMap: Record<string, string> = {
            'Leisure': 'Individual tourists, holiday packages',
            'Business': 'Corporate negotiated, corporate accounts',
            'Social': 'Weddings, local community events',
            'MICE': 'Meetings, incentives, conferences',
            'Others': 'Government, educational groups',
            'Direct': 'Direct hotel bookings, phone reservations',
            'Corporate': 'Negotiated corporate traveler rates',
            'Group': 'Tour packages and event blocks',
          };

          const segmentTableData = rawSegmentData
            .filter((item: any) => !item.isTotal)
            .map((item: any) => ({
              segment: item.segment || item.name || '',
              rnights: item.rnights || (item.value ? `${item.value}%` : ''),
              adr: item.adr || '-',
              revenue: item.revenue || '-',
              desc: item.desc || descMap[item.segment || item.name] || 'General guest segment',
            }));

          return (
            <div className="space-y-6 animate-fade-in text-[#4a3c31]">
              <p className="text-xs text-[#7d6b5e]">Performance breakdown by customer market segment.</p>
              <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                <table className="w-full text-[10px] text-[#4a3c31]">
                  <thead>
                    <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/0 text-left font-bold">
                      <th className="p-2.5">Segment</th>
                      <th className="p-2.5 text-right">% Rnights</th>
                      <th className="p-2.5 text-right">ADR (USD)</th>
                      <th className="p-2.5 text-right">Room Revenue (USD)</th>
                      <th className="p-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segmentTableData.map((row, idx) => (
                      <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                        <td className="p-2.5 font-bold">{row.segment}</td>
                        <td className="p-2.5 text-right text-[#657454] font-semibold">{row.rnights}</td>
                        <td className="p-2.5 text-right text-[#7d6b5e]">{row.adr}</td>
                        <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.revenue}</td>
                        <td className="p-2.5 text-[#7d6b5e] text-[9.5px]">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'CHANNEL_DISTRIBUTION':
        {
          const rawChannelData = Array.isArray(config.data) ? config.data : [
            { channel: 'Direct', rnights: '32.6%', adr: '$312', revenue: '$3.68M' },
            { channel: 'OTA', rnights: '27.8%', adr: '$226', revenue: '$2.54M' },
            { channel: 'Consortia', rnights: '15.2%', adr: '$244', revenue: '$1.05M' },
            { channel: 'Own Web', rnights: '11.3%', adr: '$298', revenue: '$1.19M' },
            { channel: 'TO', rnights: '7.5%', adr: '$205', revenue: '$0.78M' },
            { channel: 'Trade', rnights: '5.6%', adr: '$194', revenue: '$0.46M' },
          ];

          const feeMap: Record<string, string> = {
            'Direct': '0% commission, own booking engine',
            'OTA': '15-20% fee, Expedia/Booking',
            'Consortia': 'Corporate consortia rate networks',
            'Own Web': 'Official brand website portal',
            'TO': 'Tour operators, wholesale blocks',
            'Trade': 'Global travel agencies networks',
            'Travel Agent': 'Retail travel agent networks',
            'Corporate': 'Negotiated corporate booking channels',
          };

          const channelTableData = rawChannelData
            .filter((item: any) => !item.isTotal)
            .map((item: any) => ({
              channel: item.channel || item.name || '',
              rnights: item.rnights || item.pct || (item.value ? `${item.value}%` : ''),
              adr: item.adr || '-',
              revenue: item.revenue || '-',
              fee: item.fee || feeMap[item.channel || item.name] || 'General booking source info',
            }));

          return (
            <div className="space-y-6 animate-fade-in text-[#4a3c31]">
              <p className="text-xs text-[#7d6b5e]">Booking source performance and channel mix.</p>
              <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                <table className="w-full text-[10px] text-[#4a3c31]">
                  <thead>
                    <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/0 text-left font-bold">
                      <th className="p-2.5">Channel</th>
                      <th className="p-2.5 text-right">% Rnights</th>
                      <th className="p-2.5 text-right">ADR (USD)</th>
                      <th className="p-2.5 text-right">Room Revenue (USD)</th>
                      <th className="p-2.5">Channel Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channelTableData.map((row, idx) => (
                      <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                        <td className="p-2.5 font-bold">{row.channel}</td>
                        <td className="p-2.5 text-right text-[#657454] font-semibold">{row.rnights}</td>
                        <td className="p-2.5 text-right text-[#7d6b5e]">{row.adr}</td>
                        <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.revenue}</td>
                        <td className="p-2.5 text-[#7d6b5e] text-[9.5px]">{row.fee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      default:
        return null;
    }
  };

  const getDrawerWidth = () => {
    if (!config) return 'w-[420px] sm:w-[480px]';
    switch (config.type) {
      case 'SPEND_OVERTIME':
      case 'WORLD_MAP':
        return 'w-[95vw] sm:w-[750px]'; // Extra wide for more columns
      case 'TOP_NATIONALITIES':
      case 'PORTFOLIO_PERFORMANCE':
      case 'GEO_MARKET':
      case 'MARKET_SEGMENT':
      case 'CHANNEL_DISTRIBUTION':
        return 'w-[90vw] sm:w-[620px]';
      default:
        return 'w-[420px] sm:w-[480px]';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDrawer}
      />

      {/* Centered Modal Panel */}
      <div
        className={`fixed top-1/2 left-1/2 z-[70] max-h-[85vh] ${getDrawerWidth()} bg-[#fdfaf7] shadow-2xl rounded-2xl border border-[#d4c4b7] flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform -translate-x-1/2 ${active ? 'opacity-100 scale-100 -translate-y-1/2' : 'opacity-0 scale-50 -translate-y-[20%] pointer-events-none'}`}
      >
        <div className="shrink-0 p-6 flex justify-between items-center border-b border-[#d4c4b7]/50 bg-gradient-to-b from-[#f3eae1]/50 to-transparent">
          <h2 className="font-serif text-2xl text-[#4a3c31]">{config?.title || 'Details'}</h2>
          <button
            onClick={closeDrawer}
            className="p-2 rounded-full hover:bg-[#e5d8cb] text-[#6A5848] transition-colors"
          >
            <CloseCircle size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {renderContent()}
        </div>
      </div>
    </>
  );
}
