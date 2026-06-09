import { useState, useEffect } from 'react';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { CloseCircle, RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import dashboardData from '../../../data/dashboardData.json';

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
              <div className="h-[200px] mt-4 -mx-2">
                <ResponsiveContainer height="100%">
                  <LineChart data={metricData} margin={{ top: 10, right: 7, left: -5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d4c4b7" opacity={0.3} />
                    <Line type="monotone" dataKey="value" stroke="#C8A050" strokeWidth={3} dot={{ r: 4, fill: '#C8A050' }} />
                    <Tooltip
                      formatter={(value: any) => [`${prefix}${value.toLocaleString()}${suffix}`, 'Value']}
                      contentStyle={{ backgroundColor: '#f3eae1', border: '1px solid #d4c4b7', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#7d6b5e' }} dy={8} interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#7d6b5e' }} tickFormatter={(v: number) => `${prefix}${v.toLocaleString()}${suffix}`} width={45} />
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
                      className="text-[9px] text-[#a65e52] font-semibold hover:underline mt-auto self-end flex items-center gap-1 cursor-pointer"
                    >
                      See details <RoundAltArrowRight size={10} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'GUEST_MOVEMENT':
        const movementData = [
          { name: 'Alpine', arr: 120, in: 450 },
          { name: 'Ocean', arr: 90, in: 300 },
          { name: 'City', arr: 200, in: 600 },
          { name: 'Forest', arr: 65, in: 260 },
          { name: 'Desert', arr: 45, in: 180 },
          { name: 'Countryside', arr: 55, in: 200 },
        ];
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-xs text-[#7d6b5e]">Arrivals & In-house breakdown by property.</p>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={movementData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d4c4b7" opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4a3c31' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7d6b5e' }} width={40} orientation="left" />
                  <Tooltip cursor={{ fill: '#E3CCB2', opacity: 0.2 }} contentStyle={{ backgroundColor: '#f3eae1', border: '1px solid #d4c4b7', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="arr" name="Arrivals" fill="#C8A050" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="in" name="In-House" fill="#d4c4b7" radius={[4, 4, 0, 0]} />
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
                          <td className="py-3 font-semibold flex items-center gap-1">
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
                          <td className="py-3 font-semibold flex items-center gap-1">
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
          const nationalityPerformance = [
            { rank: 1, country: 'United States', pct: '24%', occ: '72%', adr: '$1,240', revenue: '$4.5M', revpar: '$893' },
            { rank: 2, country: 'United Kingdom', pct: '12%', occ: '68%', adr: '$1,180', revenue: '$2.2M', revpar: '$802' },
            { rank: 3, country: 'Germany', pct: '9%', occ: '65%', adr: '$1,050', revenue: '$1.7M', revpar: '$683' },
            { rank: 4, country: 'India', pct: '8%', occ: '70%', adr: '$980', revenue: '$1.5M', revpar: '$686' },
            { rank: 5, country: 'Australia', pct: '7%', occ: '63%', adr: '$1,120', revenue: '$1.3M', revpar: '$706' },
          ];

          return (
            <div className="space-y-4 animate-fade-in text-[#4a3c31]">
              <p className="text-xs text-[#7d6b5e]">Top nationality performance metrics MTD.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-[#4a3c31]">
                  <thead>
                    <tr className="border-b border-[#d4c4b7] text-left">
                      <th className="pb-2 font-bold w-8">#</th>
                      <th className="pb-2 font-bold">Nationality</th>
                      <th className="pb-2 font-bold text-right">Occupancy</th>
                      <th className="pb-2 font-bold text-right">ADR</th>
                      <th className="pb-2 font-bold text-right">Total Revenue</th>
                      <th className="pb-2 font-bold text-right">RevPAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nationalityPerformance.map((item) => (
                      <tr key={item.rank} className="border-b border-[#d4c4b7]/50 hover:bg-[#f3eae1]/30 transition-colors">
                        <td className="py-3 text-[#a65e52] font-bold">{item.rank}</td>
                        <td className="py-3 font-semibold">{item.country}</td>
                        <td className="py-3 text-right">{item.occ}</td>
                        <td className="py-3 text-right">{item.adr}</td>
                        <td className="py-3 text-right font-bold text-[#a65e52]">{item.revenue}</td>
                        <td className="py-3 text-right font-semibold">{item.revpar}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'SENTIMENT_SCORE':
        {
          const sentimentByProperty = [
            {
              id: 'alpine',
              name: 'Sosei Alpine',
              score: '4.8',
              children: [
                { name: 'Location', score: '4.3' },
                { name: 'Rooms', score: '4.2' },
                { name: 'Value', score: '4.5' },
                { name: 'Cleanliness', score: '4.5' },
                { name: 'Service', score: '4.6' },
                { name: 'Sleep Quality', score: '4.5' },
              ],
            },
            {
              id: 'ocean',
              name: 'Sosei Ocean',
              score: '4.6',
              children: [
                { name: 'Location', score: '4.1' },
                { name: 'Rooms', score: '4.0' },
                { name: 'Value', score: '4.3' },
                { name: 'Cleanliness', score: '4.4' },
                { name: 'Service', score: '4.5' },
                { name: 'Sleep Quality', score: '4.2' },
              ],
            },
            {
              id: 'city',
              name: 'Sosei City',
              score: '4.5',
              children: [
                { name: 'Location', score: '4.0' },
                { name: 'Rooms', score: '3.9' },
                { name: 'Value', score: '4.1' },
                { name: 'Cleanliness', score: '4.3' },
                { name: 'Service', score: '4.4' },
                { name: 'Sleep Quality', score: '4.0' },
              ],
            },
            {
              id: 'forest',
              name: 'Sosei Forest',
              score: '4.7',
              children: [
                { name: 'Location', score: '4.2' },
                { name: 'Rooms', score: '4.1' },
                { name: 'Value', score: '4.4' },
                { name: 'Cleanliness', score: '4.6' },
                { name: 'Service', score: '4.5' },
                { name: 'Sleep Quality', score: '4.3' },
              ],
            },
          ];

          return (
            <div className="space-y-6 animate-fade-in">
              <p className="text-xs text-[#7d6b5e]">Sentiment score breakdown by property type and category.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-[#4a3c31]">
                  <thead>
                    <tr className="border-b border-[#d4c4b7] text-left">
                      <th className="pb-2 font-bold">Property Type</th>
                      <th className="pb-2 font-bold text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sentimentByProperty.map((prop) => {
                      const isExpanded = !!expandedRows[prop.id];
                      return (
                        <>
                          <tr
                            key={prop.id}
                            className="border-b border-[#d4c4b7]/50 hover:bg-[#f3eae1]/30 cursor-pointer transition-colors"
                            onClick={() => setExpandedRows(prev => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                          >
                            <td className="py-3 font-semibold flex items-center gap-1">
                              {isExpanded ? (
                                <RoundAltArrowDown size={14} className="text-[#7d6b5e] shrink-0" />
                              ) : (
                                <RoundAltArrowRight size={14} className="text-[#7d6b5e] shrink-0" />
                              )}
                              {prop.name}
                            </td>
                            <td className="py-3 text-right font-bold text-[#a65e52]">{prop.score}</td>
                          </tr>
                          {isExpanded && prop.children.map((child, cIdx) => {
                            const scoreNum = parseFloat(child.score);
                            const barWidth = Math.round((scoreNum / 5) * 100);
                            return (
                              <tr key={`${prop.id}-child-${cIdx}`} className="border-b border-[#d4c4b7]/30 bg-[#f3eae1]/10">
                                <td className="py-2.5 pl-7">
                                  <div className="flex items-center gap-3">
                                    <span className="text-[#7d6b5e] w-20 shrink-0">{child.name}</span>
                                    <div className="flex-1 h-1.5 bg-[#d4c4b7]/40 rounded-full overflow-hidden">
                                      <div className="h-full bg-[#C8A050] rounded-full transition-all" style={{ width: `${barWidth}%` }}></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 text-right font-semibold text-[#7d6b5e] w-12">{child.score}</td>
                              </tr>
                            );
                          })}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'SENTIMENT_OVER_TIME':
        {
          const generateReviews = () => {
            const reviews = [
              { guest: 'Anderson Family', property: 'SOSEI Alpine', score: 4.8, rating: 'Excellent', comment: 'Absolutely stunning resort. The spa at Alpine was world-class.', color: '#657454' },
              { guest: 'James Wilson', property: 'SOSEI Forest', score: 4.6, rating: 'Excellent', comment: 'Impeccable service, though dining options slightly limited at night.', color: '#657454' },
              { guest: 'Maria Schmidt', property: 'SOSEI Ocean', score: 4.5, rating: 'Very Good', comment: 'Beautiful ocean views. The private beach access was a highlight.', color: '#C8A050' },
              { guest: 'Park Family', property: 'SOSEI Desert', score: 4.3, rating: 'Very Good', comment: 'Unique desert experience. Pool area could use more shaded loungers.', color: '#C8A050' },
              { guest: 'Robert Chen', property: 'SOSEI City', score: 4.0, rating: 'Good', comment: 'Great city location. Room was comfortable but street noise noticeable.', color: '#947b66' },
              { guest: 'Emma Watson', property: 'SOSEI Countryside', score: 3.8, rating: 'Good', comment: 'Lovely countryside retreat. Some outdoor activities were unavailable.', color: '#947b66' },
              { guest: 'Hiroshi Tanaka', property: 'SOSEI Forest', score: 4.7, rating: 'Excellent', comment: 'A magical forest sanctuary. The morning meditation was unforgettable.', color: '#657454' },
              { guest: 'Sarah Davis', property: 'SOSEI Alpine', score: 3.5, rating: 'Fair', comment: 'Nice property but room upgrade not available despite request. Good ski access.', color: '#a65e52' },
            ];
            return reviews.map((r, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (7 - i));
              return { ...r, stay: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) };
            });
          };

          const last8Reviews = generateReviews();

          return (
            <div className="space-y-6 animate-fade-in">
              <p className="text-xs text-[#7d6b5e]">Last 8 guest stay reviews across all properties.</p>
              <div className="flex flex-col gap-4">
                {last8Reviews.map((review, idx) => (
                  <div key={idx} className="p-4 border border-[#d4c4b7] rounded-lg bg-[#f3eae1]/0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-sm text-[#4a3c31]">{review.guest}</span>
                        <span className="text-[9px] text-[#7d6b5e] ml-2">{review.property}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: review.color }}>{review.score}</span>
                        <span className="text-[8px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded border" style={{ borderColor: `${review.color}50`, color: review.color, backgroundColor: `${review.color}10` }}>{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#6A5848] italic leading-relaxed">"{review.comment}"</p>
                    <div className="text-[9px] text-[#947b66] mt-2">{review.stay}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

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
        {
          const guestNeedsByProperty = [
            {
              id: 'alpine',
              name: 'Sosei Alpine',
              needs: [
                { label: 'Ski', pct: '33%', pctNum: 33 },
                { label: 'Wellness', pct: '25%', pctNum: 25 },
                { label: 'Dining', pct: '15%', pctNum: 15 },
                { label: 'Transport', pct: '10%', pctNum: 10 },
              ],
            },
            {
              id: 'ocean',
              name: 'Sosei Ocean',
              needs: [
                { label: 'Wellness', pct: '35%', pctNum: 35 },
                { label: 'Family', pct: '25%', pctNum: 25 },
                { label: 'Dining', pct: '20%', pctNum: 20 },
              ],
            },
            {
              id: 'city',
              name: 'Sosei City',
              needs: [
                { label: 'Dining', pct: '30%', pctNum: 30 },
                { label: 'Transport', pct: '20%', pctNum: 20 },
                { label: 'Family', pct: '18%', pctNum: 18 },
              ],
            },
            {
              id: 'forest',
              name: 'Sosei Forest',
              needs: [
                { label: 'Wellness', pct: '28%', pctNum: 28 },
                { label: 'Family', pct: '22%', pctNum: 22 },
              ],
            },
            {
              id: 'desert',
              name: 'Sosei Desert',
              needs: [
                { label: 'Transport', pct: '20%', pctNum: 20 },
                { label: 'Wellness', pct: '15%', pctNum: 15 },
              ],
            },
            {
              id: 'countryside',
              name: 'Sosei Countryside',
              needs: [
                { label: 'Family', pct: '25%', pctNum: 25 },
                { label: 'Dining', pct: '18%', pctNum: 18 },
                { label: 'Transport', pct: '12%', pctNum: 12 },
              ],
            },
          ];

          return (
            <div className="space-y-6 animate-fade-in text-[#4a3c31]">
              <p className="text-xs text-[#7d6b5e]">Top guest needs breakdown by property type.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-[#4a3c31]">
                  <thead>
                    <tr className="border-b border-[#d4c4b7] text-left">
                      <th className="pb-2 font-bold whitespace-nowrap">Property Type</th>
                      <th className="pb-2 font-bold text-right whitespace-nowrap">Top Needs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guestNeedsByProperty.map((prop) => {
                      const isExpanded = !!expandedRows[prop.id];
                      return (
                        <>
                          <tr
                            key={prop.id}
                            className="border-b border-[#d4c4b7]/50 hover:bg-[#f3eae1]/30 cursor-pointer transition-colors"
                            onClick={() => setExpandedRows(prev => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                          >
                            <td className="py-3 font-semibold flex items-center gap-1">
                              {isExpanded ? (
                                <RoundAltArrowDown size={14} className="text-[#7d6b5e] shrink-0" />
                              ) : (
                                <RoundAltArrowRight size={14} className="text-[#7d6b5e] shrink-0" />
                              )}
                              {prop.name}
                            </td>
                            <td className="py-3 text-right text-[#7d6b5e] whitespace-nowrap">{prop.needs.length} categories</td>
                          </tr>
                          {isExpanded && prop.needs.map((need, nIdx) => (
                            <tr key={`${prop.id}-need-${nIdx}`} className="border-b border-[#d4c4b7]/30 bg-[#f3eae1]/10">
                              <td className="py-2.5 pl-7">
                                <div className="flex items-center gap-3">
                                  <span className="text-[#7d6b5e] w-16 shrink-0">{need.label}</span>
                                  <div className="flex-1 h-1.5 bg-[#d4c4b7]/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#C8A050] rounded-full transition-all" style={{ width: `${need.pctNum}%` }}></div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 text-right font-semibold text-[#a65e52] w-12">{need.pct}</td>
                            </tr>
                          ))}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

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
          const spendByProperty = [
            {
              id: 'alpine', name: 'Sosei Alpine', total: '$8.2M', avg: '$2,140', years: [
                { year: '2026 YTD', avg: '$2,140', total: '$8.2M' }, { year: '2025', avg: '$2,080', total: '$7.8M' }, { year: '2024', avg: '$1,950', total: '$6.9M' }, { year: '2023', avg: '$1,820', total: '$5.8M' },
              ], categories: [
                { cat: 'Room', avg2026: '$1,280', avg2025: '$1,240', avg2024: '$1,170', avg2023: '$1,090' },
                { cat: 'F&B', avg2026: '$420', avg2025: '$405', avg2024: '$380', avg2023: '$355' },
                { cat: 'Spa', avg2026: '$255', avg2025: '$248', avg2024: '$230', avg2023: '$215' },
                { cat: 'Excursion', avg2026: '$185', avg2025: '$187', avg2024: '$170', avg2023: '$160' },
              ]
            },
            {
              id: 'ocean', name: 'Sosei Ocean', total: '$7.1M', avg: '$1,980', years: [
                { year: '2026 YTD', avg: '$1,980', total: '$7.1M' }, { year: '2025', avg: '$1,920', total: '$6.8M' }, { year: '2024', avg: '$1,840', total: '$6.1M' }, { year: '2023', avg: '$1,750', total: '$5.2M' },
              ], categories: [
                { cat: 'Room', avg2026: '$1,200', avg2025: '$1,160', avg2024: '$1,110', avg2023: '$1,050' },
                { cat: 'F&B', avg2026: '$390', avg2025: '$378', avg2024: '$360', avg2023: '$340' },
                { cat: 'Spa', avg2026: '$238', avg2025: '$230', avg2024: '$215', avg2023: '$200' },
                { cat: 'Excursion', avg2026: '$152', avg2025: '$152', avg2024: '$155', avg2023: '$160' },
              ]
            },
            {
              id: 'city', name: 'Sosei City', total: '$6.4M', avg: '$1,850', years: [
                { year: '2026 YTD', avg: '$1,850', total: '$6.4M' }, { year: '2025', avg: '$1,790', total: '$6.1M' }, { year: '2024', avg: '$1,720', total: '$5.5M' }, { year: '2023', avg: '$1,650', total: '$4.8M' },
              ], categories: [
                { cat: 'Room', avg2026: '$1,100', avg2025: '$1,060', avg2024: '$1,020', avg2023: '$980' },
                { cat: 'F&B', avg2026: '$435', avg2025: '$420', avg2024: '$405', avg2023: '$385' },
                { cat: 'Spa', avg2026: '$178', avg2025: '$172', avg2024: '$160', avg2023: '$150' },
                { cat: 'Excursion', avg2026: '$137', avg2025: '$138', avg2024: '$135', avg2023: '$135' },
              ]
            },
            {
              id: 'forest', name: 'Sosei Forest', total: '$4.8M', avg: '$1,620', years: [
                { year: '2026 YTD', avg: '$1,620', total: '$4.8M' }, { year: '2025', avg: '$1,570', total: '$4.5M' }, { year: '2024', avg: '$1,490', total: '$4.0M' }, { year: '2023', avg: '$1,420', total: '$3.3M' },
              ], categories: [
                { cat: 'Room', avg2026: '$980', avg2025: '$950', avg2024: '$900', avg2023: '$860' },
                { cat: 'F&B', avg2026: '$320', avg2025: '$310', avg2024: '$295', avg2023: '$280' },
                { cat: 'Spa', avg2026: '$195', avg2025: '$188', avg2024: '$175', avg2023: '$165' },
                { cat: 'Excursion', avg2026: '$125', avg2025: '$122', avg2024: '$120', avg2023: '$115' },
              ]
            },
            {
              id: 'desert', name: 'Sosei Desert', total: '$3.2M', avg: '$1,450', years: [
                { year: '2026 YTD', avg: '$1,450', total: '$3.2M' }, { year: '2025', avg: '$1,400', total: '$3.0M' }, { year: '2024', avg: '$1,330', total: '$2.6M' }, { year: '2023', avg: '$1,260', total: '$2.1M' },
              ], categories: [
                { cat: 'Room', avg2026: '$860', avg2025: '$830', avg2024: '$790', avg2023: '$750' },
                { cat: 'F&B', avg2026: '$290', avg2025: '$280', avg2024: '$265', avg2023: '$250' },
                { cat: 'Spa', avg2026: '$155', avg2025: '$150', avg2024: '$140', avg2023: '$130' },
                { cat: 'Excursion', avg2026: '$145', avg2025: '$140', avg2024: '$135', avg2023: '$130' },
              ]
            },
            {
              id: 'countryside', name: 'Sosei Countryside', total: '$2.3M', avg: '$1,380', years: [
                { year: '2026 YTD', avg: '$1,380', total: '$2.3M' }, { year: '2025', avg: '$1,330', total: '$2.1M' }, { year: '2024', avg: '$1,260', total: '$1.8M' }, { year: '2023', avg: '$1,200', total: '$1.5M' },
              ], categories: [
                { cat: 'Room', avg2026: '$840', avg2025: '$810', avg2024: '$770', avg2023: '$730' },
                { cat: 'F&B', avg2026: '$275', avg2025: '$265', avg2024: '$250', avg2023: '$235' },
                { cat: 'Spa', avg2026: '$138', avg2025: '$133', avg2024: '$125', avg2023: '$118' },
                { cat: 'Excursion', avg2026: '$127', avg2025: '$122', avg2024: '$115', avg2023: '$117' },
              ]
            },
          ];

          const revenueTrend = [
            { year: '2023', Alpine: 5.8, Ocean: 5.2, City: 4.8, Forest: 3.3, Desert: 2.1, Countryside: 1.5 },
            { year: '2024', Alpine: 6.9, Ocean: 6.1, City: 5.5, Forest: 4.0, Desert: 2.6, Countryside: 1.8 },
            { year: '2025', Alpine: 7.8, Ocean: 6.8, City: 6.1, Forest: 4.5, Desert: 3.0, Countryside: 2.1 },
            { year: '2026', Alpine: 8.2, Ocean: 7.1, City: 6.4, Forest: 4.8, Desert: 3.2, Countryside: 2.3 },
          ];

          return (
            <div className="space-y-5 animate-fade-in text-[#4a3c31]">
              <p className="text-xs text-[#7d6b5e]">Total guest spend across all properties, 2023–2026 (USD Millions).</p>

              {/* Revenue Trend Bar Chart */}
              <div className="h-[180px] w-full -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueTrend} margin={{ top: 5, right: 10, left: -5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d4c4b7" opacity={0.3} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7d6b5e' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#7d6b5e' }} tickFormatter={(v) => `$${v}M`} width={40} />
                    <Tooltip formatter={(v: any) => `$${v}M`} contentStyle={{ backgroundColor: '#f3eae1', border: '1px solid #d4c4b7', borderRadius: '8px', fontSize: '11px' }} />
                    <Bar dataKey="Alpine" fill="#a65e52" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Ocean" fill="#947b66" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="City" fill="#657454" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Forest" fill="#C8A050" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Desert" fill="#586981" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Countryside" fill="#8b6b7a" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Simple property table */}
              <div className="border-t border-[#d4c4b7]/40 pt-4">
                <table className="w-full text-xs text-[#4a3c31]">
                  <thead>
                    <tr className="border-b border-[#d4c4b7] text-left">
                      <th className="pb-2 font-bold">Property Type</th>
                      <th className="pb-2 font-bold text-right">2026 Total</th>
                      <th className="pb-2 font-bold text-right">Avg/Booking</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {spendByProperty.map((prop) => (
                      <tr key={prop.id} className="border-b border-[#d4c4b7]/30">
                        <td className="py-2.5 font-semibold">{prop.name}</td>
                        <td className="py-2.5 text-right font-bold text-[#a65e52]">{prop.total}</td>
                        <td className="py-2.5 text-right text-[#657454]">{prop.avg}</td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDrawer({ type: 'SPEND_COMPARISON', title: `${prop.name} — Year Comparison`, data: prop });
                            }}
                            className="text-[9px] text-[#947b66] hover:text-[#4a3c31] underline cursor-pointer whitespace-nowrap"
                          >
                            View comparison →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'SPEND_COMPARISON':
        {
          const prop = config.data;
          if (!prop) return <p className="text-xs text-[#7d6b5e]">No data available.</p>;

          return (
            <div className="space-y-5 animate-fade-in text-[#4a3c31]">
              <p className="text-xs text-[#7d6b5e]">Year-over-year comparison for {prop.name}.</p>

              {/* Year summary cards */}
              <div className="flex gap-4">
                {prop.years.map((yr: any, yIdx: number) => (
                  <div key={yIdx} className="flex-1 border border-[#d4c4b7] rounded-lg p-3 text-center bg-[#f3eae1]/20">
                    <div className="text-[9px] text-[#9B8272] mb-1">{yr.year}</div>
                    <div className="font-bold text-[#a65e52]">{yr.total}</div>
                    <div className="text-[10px] text-[#7d6b5e]">{yr.avg} /booking</div>
                  </div>
                ))}
              </div>

              {/* Category breakdown table */}
              <div className="border-t border-[#d4c4b7]/40 pt-4">
                <div className="text-[9px] font-bold uppercase tracking-wider text-[#7d6b5e] mb-3">Avg Spend Per Category</div>
                <table className="w-full text-[10px] text-[#4a3c31]">
                  <thead>
                    <tr className="border-b border-[#d4c4b7] text-left text-[#9B8272]">
                      <th className="pb-2 font-normal">Category</th>
                      <th className="pb-2 font-normal text-right">2023</th>
                      <th className="pb-2 font-normal text-right">2024</th>
                      <th className="pb-2 font-normal text-right">2025</th>
                      <th className="pb-2 font-normal text-right">2026</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prop.categories.map((cat: any, cIdx: number) => (
                      <tr key={cIdx} className="border-b border-[#d4c4b7]/20">
                        <td className="py-2 text-[#7d6b5e]">{cat.cat}</td>
                        <td className="py-2 text-right text-[#7d6b5e]">{cat.avg2023}</td>
                        <td className="py-2 text-right text-[#7d6b5e]">{cat.avg2024}</td>
                        <td className="py-2 text-right text-[#7d6b5e]">{cat.avg2025}</td>
                        <td className="py-2 text-right text-[#657454] font-semibold">{cat.avg2026}</td>
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

      case 'FNB_DETAIL':
        {
          const detailKey = config.data?.key || '';
          
          if (detailKey === 'EXP_BOOKINGS_OVER_TIME') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Daily trend of experience bookings and guest satisfaction MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5 text-right">Bookings Count</th>
                        <th className="p-2.5 text-right">Completion Rate</th>
                        <th className="p-2.5 text-right">Guest Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: 'May 1', val: 380, pct: '95%', rate: '4.8 / 5' },
                        { date: 'May 8', val: 530, pct: '97%', rate: '4.7 / 5' },
                        { date: 'May 15', val: 410, pct: '94%', rate: '4.8 / 5' },
                        { date: 'May 22', val: 680, pct: '96%', rate: '4.9 / 5' },
                        { date: 'May 29', val: 610, pct: '95%', rate: '4.7 / 5' },
                        { date: 'May 31', val: 892, pct: '98%', rate: '4.9 / 5' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.date}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.val}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.pct}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'EXP_BY_CATEGORY') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Experience categories popularity and revenue share MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-right">Active Items</th>
                        <th className="p-2.5 text-right">Total Bookings</th>
                        <th className="p-2.5 text-right">Revenue Share</th>
                        <th className="p-2.5 text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { cat: 'Water & Marine', items: 8, bookings: 596, share: '32%', rev: '$89,400' },
                        { cat: 'Nature & Adventure', items: 12, bookings: 447, share: '24%', rev: '$37,995' },
                        { cat: 'Cultural & Local', items: 6, bookings: 317, share: '17%', rev: '$31,700' },
                        { cat: 'Wellness & Mindfulness', items: 10, bookings: 280, share: '15%', rev: '$33,600' },
                        { cat: 'Private & Bespoke', items: 4, bookings: 149, share: '8%', rev: '$37,250' },
                        { cat: 'Other', items: 5, bookings: 75, share: '4%', rev: '$4,500' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.cat}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.items}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.bookings}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.share}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'TOP_EXPERIENCES_DETAIL' || detailKey === 'TOTAL_EXPERIENCES') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Top experiences rankings based on booking numbers MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Rank</th>
                        <th className="p-2.5">Experience Name</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-right">Avg Ticket</th>
                        <th className="p-2.5 text-right">Bookings</th>
                        <th className="p-2.5 text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { rank: 1, name: 'Sunset Cruise', cat: 'Water & Marine', ticket: '$150', bookings: 312, rev: '$46,800' },
                        { rank: 2, name: 'Private Island Picnic', cat: 'Water & Marine', ticket: '$150', bookings: 278, rev: '$41,700' },
                        { rank: 3, name: 'Guided Forest Hike', cat: 'Nature & Adventure', ticket: '$50', bookings: 246, rev: '$12,300' },
                        { rank: 4, name: 'Wellness Journey', cat: 'Wellness & Mindfulness', ticket: '$150', bookings: 212, rev: '$31,800' },
                        { rank: 5, name: 'Cultural Village Visit', cat: 'Cultural & Local', ticket: '$100', bookings: 184, rev: '$18,400' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold text-[#7d6b5e]">{row.rank}</td>
                          <td className="p-2.5 font-bold">{row.name}</td>
                          <td className="p-2.5 text-[#7d6b5e]">{row.cat}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.ticket}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.bookings}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'EXP_REVENUE_PROPERTY') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Experiences revenue breakdown across all resort properties.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Property</th>
                        <th className="p-2.5 text-right">Active Items</th>
                        <th className="p-2.5 text-right">MTD Bookings</th>
                        <th className="p-2.5 text-right">Avg Ticket Size</th>
                        <th className="p-2.5 text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { prop: 'SOSEI Ocean', items: 12, bookings: 780, ticket: '$100.79', rev: '$78,620' },
                        { prop: 'SOSEI Alpine', items: 15, bookings: 510, ticket: '$106.49', rev: '$54,310' },
                        { prop: 'SOSEI Forest', items: 8, bookings: 320, ticket: '$98.12', rev: '$31,400' },
                        { prop: 'SOSEI Desert', items: 10, bookings: 180, ticket: '$84.61', rev: '$15,230' },
                        { prop: 'SOSEI City', items: 5, bookings: 110, ticket: '$88.00', rev: '$9,680' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.prop}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.items}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.bookings}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.ticket}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'FNB_REVENUE_OVER_TIME') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">F&B weekly revenue trend and channel breakdown MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Date Period</th>
                        <th className="p-2.5 text-right">Fine Dining</th>
                        <th className="p-2.5 text-right">Casual Dining</th>
                        <th className="p-2.5 text-right">Bars & Lounges</th>
                        <th className="p-2.5 text-right">In-Villa Dining</th>
                        <th className="p-2.5 text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: 'May 1 - May 7', fine: '$35,400', casual: '$22,100', bar: '$18,400', room: '$10,200', total: '$86,100' },
                        { date: 'May 8 - May 14', fine: '$40,200', casual: '$24,500', bar: '$19,200', room: '$11,500', total: '$95,400' },
                        { date: 'May 15 - May 21', fine: '$38,700', casual: '$21,800', bar: '$17,900', room: '$9,800', total: '$88,200' },
                        { date: 'May 22 - May 28', fine: '$45,800', casual: '$28,300', bar: '$22,400', room: '$14,100', total: '$110,600' },
                        { date: 'May 29 - May 31', fine: '$52,100', casual: '$32,400', bar: '$26,800', room: '$20,800', total: '$132,100' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.date}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.fine}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.casual}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.bar}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.room}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'FNB_REVENUE_OUTLET' || detailKey === 'TOTAL_FNB_REVENUE') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">F&B outlet metrics breakdown MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Outlet Name</th>
                        <th className="p-2.5 text-right">Covers</th>
                        <th className="p-2.5 text-right">Average Check</th>
                        <th className="p-2.5 text-right">Beverage Share</th>
                        <th className="p-2.5 text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Seascape Restaurant (SOSEI Ocean)', covers: '3,200', check: '$58.25', share: '35%', rev: '$186,420' },
                        { name: 'Terra Pavilion (SOSEI Alpine)', covers: '2,840', check: '$39.57', share: '20%', rev: '$112,380' },
                        { name: 'Alpine Grill (SOSEI Alpine)', covers: '1,980', check: '$42.80', share: '45%', rev: '$84,760' },
                        { name: 'The Tea Lounge (SOSEI City)', covers: '1,540', check: '$39.76', share: '55%', rev: '$61,240' },
                        { name: 'In-Villa Dining (All Properties)', covers: '980', check: '$47.76', share: '15%', rev: '$46,810' },
                        { name: 'Poolside Bar (SOSEI Ocean)', covers: '1,200', check: '$17.36', share: '70%', rev: '$20,840' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.name}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.covers}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.check}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.share}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'TOP_OUTLETS_PERFORMANCE') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Top performing F&B outlets based on RevPAS (Revenue per Available Seat) MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Outlet Name</th>
                        <th className="p-2.5">Property</th>
                        <th className="p-2.5 text-right">Capacity (Seats)</th>
                        <th className="p-2.5 text-right">RevPAS</th>
                        <th className="p-2.5 text-right">Avg Occupancy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Seascape Restaurant', prop: 'SOSEI Ocean', cap: 80, revpas: '$245', occ: '88%' },
                        { name: 'Terra Pavilion', prop: 'SOSEI Alpine', cap: 120, revpas: '$198', occ: '74%' },
                        { name: 'Alpine Grill', prop: 'SOSEI Alpine', cap: 90, revpas: '$176', occ: '70%' },
                        { name: 'The Tea Lounge', prop: 'SOSEI City', cap: 60, revpas: '$142', occ: '62%' },
                        { name: 'Poolside Bar', prop: 'SOSEI Ocean', cap: 100, revpas: '$118', occ: '65%' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.name}</td>
                          <td className="p-2.5 text-[#7d6b5e]">{row.prop}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.cap}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.revpas}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.occ}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'FNB_MIX_BREAKDOWN_DETAIL') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">F&B product mix contribution breakdown MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-right">Covers</th>
                        <th className="p-2.5 text-right">Average Spend</th>
                        <th className="p-2.5 text-right">Food Rev</th>
                        <th className="p-2.5 text-right">Beverage Rev</th>
                        <th className="p-2.5 text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { cat: 'Food (62%)', covers: '8,400', check: '$37.82', food: '$317,719', bev: '$0', total: '$317,719' },
                        { cat: 'Beverage (23%)', covers: '5,200', check: '$22.66', food: '$0', bev: '$117,863', total: '$117,863' },
                        { cat: 'In-Villa Dining (10%)', covers: '980', check: '$52.30', food: '$41,000', bev: '$10,245', total: '$51,245' },
                        { cat: 'Events & Private Dining (5%)', covers: '320', check: '$80.08', food: '$20,500', bev: '$5,123', total: '$25,623' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.cat}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.covers}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.check}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.food}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.bev}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'PEAK_HOURS_OUTLET') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Average covers serviced during peak hours across outlets.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Outlet Name</th>
                        <th className="p-2.5 text-right">Breakfast Peak</th>
                        <th className="p-2.5 text-right">Lunch Peak</th>
                        <th className="p-2.5 text-right">Dinner Peak</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Seascape Restaurant', bfast: '120 covers (9 AM)', lunch: '280 covers (12 PM)', dinner: '340 covers (7 PM)' },
                        { name: 'Terra Pavilion', bfast: '350 covers (8 AM)', lunch: '410 covers (1 PM)', dinner: '480 covers (7 PM)' },
                        { name: 'Alpine Grill', bfast: 'N/A', lunch: '180 covers (1 PM)', dinner: '320 covers (8 PM)' },
                        { name: 'The Tea Lounge', bfast: '80 covers (9 AM)', lunch: '120 covers (3 PM)', dinner: '150 covers (5 PM)' },
                        { name: 'Poolside Bar', bfast: 'N/A', lunch: '220 covers (1 PM)', dinner: '180 covers (6 PM)' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.name}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.bfast}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.lunch}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.dinner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'EXP_CONVERSION_FUNNEL') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Conversion rates from digital experience previews to bookings.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Conversion Funnel Step</th>
                        <th className="p-2.5 text-right">Volume</th>
                        <th className="p-2.5 text-right">Step Conversion Rate</th>
                        <th className="p-2.5 text-right">Industry Benchmark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { step: 'Experiences Viewed', vol: '3,842 views', conv: '100%', bench: '100% (Baseline)' },
                        { step: 'Added to Wishlist', vol: '1,926 additions', conv: '50%', bench: '45%' },
                        { step: 'Inquiries', vol: '1,102 inquiries', conv: '57%', bench: '48%' },
                        { step: 'Bookings Confirmed', vol: '1,864 bookings', conv: '49%', bench: '40%' },
                        { step: 'Completed & Attended', vol: '1,720 completed', conv: '92%', bench: '95%' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.step}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.vol}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.conv}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.bench}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'EXP_TYPE_PERFORMANCE') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Performance matrix and NPS satisfaction score by category.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Experience Category</th>
                        <th className="p-2.5 text-right">Avg Rating</th>
                        <th className="p-2.5 text-right">Net Promoter Score (NPS)</th>
                        <th className="p-2.5 text-right">Active Guides</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Water & Marine', score: '4.8 / 5.0', nps: '82', guides: 12 },
                        { name: 'Nature & Adventure', score: '4.7 / 5.0', nps: '78', guides: 8 },
                        { name: 'Cultural & Local', score: '4.6 / 5.0', nps: '75', guides: 6 },
                        { name: 'Wellness & Mindfulness', score: '4.8 / 5.0', nps: '84', guides: 10 },
                        { name: 'Private & Bespoke', score: '4.9 / 5.0', nps: '88', guides: 4 },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.name}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.score}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.nps}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.guides}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'UPCOMING_HIGHLIGHTS_DETAIL') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Scheduled high-profile group bookings and special events.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Date & Time</th>
                        <th className="p-2.5">Highlight Event Name</th>
                        <th className="p-2.5">Resort Location</th>
                        <th className="p-2.5 text-right">Confirmed / Capacity</th>
                        <th className="p-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: 'Jun 2, 7:00 PM', name: 'Full Moon Dinner', location: 'SOSEI Ocean', cap: '24 / 24 seats', status: 'SOLD OUT' },
                        { date: 'Jun 4, 6:30 AM', name: 'Sunrise Yoga Experience', location: 'SOSEI Alpine', cap: '18 / 20 seats', status: 'Almost Full' },
                        { date: 'Jun 7, 7:00 PM', name: 'Chef\'s Table Experience', location: 'SOSEI Ocean', cap: '12 / 12 seats', status: 'SOLD OUT' },
                        { date: 'Jun 12, 10:00 AM', name: 'Reef Clean-up Safari', location: 'SOSEI Ocean', cap: '15 / 30 seats', status: 'Open' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 text-[#7d6b5e]">{row.date}</td>
                          <td className="p-2.5 font-bold">{row.name}</td>
                          <td className="p-2.5 text-[#7d6b5e]">{row.location}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.cap}</td>
                          <td className={`p-2.5 text-right font-bold ${row.status === 'SOLD OUT' ? 'text-[#a65e52]' : 'text-[#C8A050]'}`}>{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'AVERAGE_SPEND') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Average spend per guest by property MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Property Name</th>
                        <th className="p-2.5 text-right">F&B Average Spend</th>
                        <th className="p-2.5 text-right">Activities Average Spend</th>
                        <th className="p-2.5 text-right">Combined Average Spend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'SOSEI Ocean', fnb: '$165', act: '$112', combined: '$277' },
                        { name: 'SOSEI Alpine', fnb: '$150', act: '$98', combined: '$248' },
                        { name: 'SOSEI Desert', fnb: '$135', act: '$85', combined: '$220' },
                        { name: 'SOSEI Forest', fnb: '$120', act: '$72', combined: '$192' },
                        { name: 'SOSEI City', fnb: '$110', act: '$48', combined: '$158' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.name}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.fnb}</td>
                          <td className="p-2.5 text-right text-[#9d7c67]">{row.act}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.combined}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'EXPERIENCE_REVENUE') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Experience MTD revenue contribution by category.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-right">% Bookings</th>
                        <th className="p-2.5 text-right">Average Ticket Size</th>
                        <th className="p-2.5 text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { cat: 'Water & Marine', pct: '32%', avg: '$150', rev: '$60,580' },
                        { cat: 'Nature & Adventure', pct: '24%', avg: '$85', rev: '$45,430' },
                        { cat: 'Cultural & Local', pct: '17%', avg: '$100', rev: '$32,180' },
                        { cat: 'Wellness & Mindfulness', pct: '15%', avg: '$120', rev: '$25,440' },
                        { cat: 'Private & Bespoke', pct: '8%', avg: '$250', rev: '$19,890' },
                        { cat: 'Other', pct: '4%', avg: '$60', rev: '$5,800' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.cat}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.pct}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.avg}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'REPEAT_RATE') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Repeat experience booking rate breakdown by loyalty tier.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Loyalty Tier</th>
                        <th className="p-2.5 text-right">Active Members</th>
                        <th className="p-2.5 text-right">Repeat Bookings</th>
                        <th className="p-2.5 text-right">Repeat Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { tier: 'VIP / Platinum', members: 480, bookings: 312, rate: '65%' },
                        { tier: 'Gold', members: 1200, bookings: 540, rate: '45%' },
                        { tier: 'Silver', members: 1800, bookings: 450, rate: '25%' },
                        { tier: 'Member', members: 2400, bookings: 360, rate: '15%' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.tier}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.members}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.bookings}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'SATISFACTION') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Guest experience satisfaction rating breakdown by segment.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Guest Segment</th>
                        <th className="p-2.5 text-right">F&B Rating</th>
                        <th className="p-2.5 text-right">Experiences Rating</th>
                        <th className="p-2.5 text-right">Combined Satisfaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { segment: 'Leisure Couples', fnb: '4.8 / 5', exp: '4.9 / 5', score: '4.85 / 5' },
                        { segment: 'Family Stays', fnb: '4.7 / 5', exp: '4.8 / 5', score: '4.75 / 5' },
                        { segment: 'Solo Travelers', fnb: '4.5 / 5', exp: '4.7 / 5', score: '4.60 / 5' },
                        { segment: 'Wellness Seekers', fnb: '4.6 / 5', exp: '4.9 / 5', score: '4.75 / 5' },
                        { segment: 'Corporate Groups', fnb: '4.4 / 5', exp: '4.2 / 5', score: '4.30 / 5' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.segment}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.fnb}</td>
                          <td className="p-2.5 text-right text-[#9d7c67]">{row.exp}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'SUNSET_INSIGHT') {
            return (
              <div className="space-y-4 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Sunset experiences analysis: Driving 34% of total experience revenue.</p>
                <div className="p-4 border border-[#d4c4b7] rounded-lg bg-[#efe7d5]/10 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#4a3c31]">Sunset Cruise Performance</h4>
                    <p className="text-xs text-[#7d6b5e] mt-1">
                      Sunset cruise continues to be the highest performing single experience item in the Sosei portfolio.
                      Average ticket price of $150 per person with a 92% capacity load factor on weekends.
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          if (detailKey === 'INVILLA_INSIGHT') {
            return (
              <div className="space-y-4 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">In-villa dining analysis: 21% increase vs last month.</p>
                <div className="p-4 border border-[#d4c4b7] rounded-lg bg-[#efe7d5]/10 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#4a3c31]">Growth Drivers</h4>
                    <p className="text-xs text-[#7d6b5e] mt-1">
                      The growth is driven by the introduction of the digital order system in villas and personalized late-night supper options.
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          if (detailKey === 'WELLNESS_INSIGHT') {
            return (
              <div className="space-y-4 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Wellness & nature experiences satisfaction analysis.</p>
                <div className="p-4 border border-[#d4c4b7] rounded-lg bg-[#efe7d5]/10 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#4a3c31]">Satisfaction Highlight</h4>
                    <p className="text-xs text-[#7d6b5e] mt-1">
                      Wellness journeys and forest walks score average ratings of 4.8 and 4.7 respectively. Guest reviews highlight the high expertise level of wellness instructors.
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          if (detailKey === 'ADVANCE_INSIGHT') {
            return (
              <div className="space-y-4 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Booking lead time impact analysis: Advance bookings &gt;14 days.</p>
                <div className="p-4 border border-[#d4c4b7] rounded-lg bg-[#efe7d5]/10 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#4a3c31]">Spend Correlation</h4>
                    <p className="text-xs text-[#7d6b5e] mt-1">
                      Guests booking their experiences more than 14 days in advance show a 28% higher total spend on F&B and retail.
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          if (detailKey === 'WEEKEND_INSIGHT') {
            return (
              <div className="space-y-4 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Weekend dining analysis: Weekend dinners remain the peak.</p>
                <div className="p-4 border border-[#d4c4b7] rounded-lg bg-[#efe7d5]/10 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#4a3c31]">Revenue Contribution</h4>
                    <p className="text-xs text-[#7d6b5e] mt-1">
                      Saturday dinner service contributes 42% of total weekly fine-dining revenue across all resort outlets.
                    </p>
                  </div>
                </div>
              </div>
            );
          }
          
          return (
            <div className="text-xs text-[#7d6b5e] italic">
              Detailed statistics and analytics reports for {config.title}.
            </div>
          );
        }

      case 'SPA_DETAIL':
        {
          const detailKey = config.data?.key || '';
          
          if (detailKey === 'TOTAL_TREATMENTS') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Detailed distribution of spa treatments MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Treatment Name</th>
                        <th className="p-2.5 text-right">Treatments Conducted</th>
                        <th className="p-2.5 text-right">Avg Rating</th>
                        <th className="p-2.5 text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Deep Tissue Massage', count: 312, rating: '4.8 / 5', rev: '$71,448' },
                        { name: 'Aromatherapy Massage', count: 248, rating: '4.7 / 5', rev: '$56,792' },
                        { name: 'Facial Signature', count: 196, rating: '4.9 / 5', rev: '$44,884' },
                        { name: 'Hot Stone Therapy', count: 154, rating: '4.6 / 5', rev: '$35,266' },
                        { name: 'Detox Body Wrap', count: 98, rating: '4.5 / 5', rev: '$22,442' },
                        { name: 'Balinese Healing Ritual', count: 70, rating: '4.9 / 5', rev: '$16,030' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.name}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.count}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.rating}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'TREATMENT_REVENUE') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Treatment MTD revenue contribution breakdown by property.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Property Name</th>
                        <th className="p-2.5 text-right">Treatments</th>
                        <th className="p-2.5 text-right">Average Rate</th>
                        <th className="p-2.5 text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'SOSEI Ocean (Maldives)', count: 480, rate: '$240', rev: '$115,200' },
                        { name: 'SOSEI Alpine (Switzerland)', count: 390, rate: '$235', rev: '$91,650' },
                        { name: 'SOSEI Forest (Kyoto)', count: 180, rate: '$210', rev: '$37,800' },
                        { name: 'SOSEI Desert (Cairo)', count: 110, rate: '$200', rev: '$22,000' },
                        { name: 'SOSEI City (New York)', count: 88, rate: '$225', rev: '$19,800' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.name}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.count}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.rate}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'AVERAGE_REVENUE') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Average revenue per treatment details by property.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Property Name</th>
                        <th className="p-2.5 text-right">Standard Rate</th>
                        <th className="p-2.5 text-right">Peak Rate</th>
                        <th className="p-2.5 text-right">Average Realized Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'SOSEI Ocean', standard: '$220', peak: '$260', realized: '$240' },
                        { name: 'SOSEI Alpine', standard: '$215', peak: '$255', realized: '$235' },
                        { name: 'SOSEI City', standard: '$210', peak: '$245', realized: '$225' },
                        { name: 'SOSEI Forest', standard: '$195', peak: '$230', realized: '$210' },
                        { name: 'SOSEI Desert', standard: '$180', peak: '$220', realized: '$200' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.name}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.standard}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.peak}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.realized}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'SPA_UTILIZATION') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Utilization rates by spa zones MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Spa Zone</th>
                        <th className="p-2.5 text-right">Capacity (Hours/Day)</th>
                        <th className="p-2.5 text-right">Utilized Hours MTD</th>
                        <th className="p-2.5 text-right">Utilization Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { zone: 'Treatment Rooms', capacity: 96, hours: 2246, rate: '78%' },
                        { zone: 'Hydro Facilities', capacity: 48, hours: 936, rate: '65%' },
                        { zone: 'Relaxation Lounge', capacity: 64, hours: 1190, rate: '62%' },
                        { zone: 'Movement Studio', capacity: 32, hours: 460, rate: '48%' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.zone}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.capacity}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.hours}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'THERAPIST_HOURS') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Therapist performance and hour tracking MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Therapist Name</th>
                        <th className="p-2.5 text-right">Treatments</th>
                        <th className="p-2.5 text-right">Hours Clocked</th>
                        <th className="p-2.5 text-right">Utilization</th>
                        <th className="p-2.5 text-right">Revenue Generated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Ananda', count: 152, hours: 180, util: '82%', rev: '$36,480' },
                        { name: 'Maya', count: 148, hours: 190, util: '78%', rev: '$34,120' },
                        { name: 'Suri', count: 137, hours: 182, util: '75%', rev: '$31,750' },
                        { name: 'Lina', count: 130, hours: 180, util: '72%', rev: '$28,910' },
                        { name: 'Pema', count: 124, hours: 182, util: '68%', rev: '$27,560' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.name}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.count}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.hours}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.util}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'RETAIL_REVENUE') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Retail performance breakdown MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Product Name</th>
                        <th className="p-2.5 text-right">Units Sold</th>
                        <th className="p-2.5 text-right">Average Price</th>
                        <th className="p-2.5 text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Sosei Signature Oil', units: 120, price: '$78.50', rev: '$9,420' },
                        { name: 'Calm & Restore Balm', units: 148, price: '$41.95', rev: '$6,210' },
                        { name: 'Mineral Soak', units: 162, price: '$30.00', rev: '$4,860' },
                        { name: 'Sosei Silk Eye Pillow', units: 88, price: '$45.20', rev: '$3,980' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.name}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.units}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.price}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'MEMBERSHIP_REPORT') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Wellness membership and packages sales analysis.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Membership Category</th>
                        <th className="p-2.5 text-right">Active Members</th>
                        <th className="p-2.5 text-right">MTD Sales</th>
                        <th className="p-2.5 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { cat: 'Wellness Elite Club', members: 48, sales: 8, rev: '$32,000' },
                        { cat: 'Signature Package (10 Sessions)', members: 120, sales: 34, rev: '$34,000' },
                        { cat: 'Half-Day Escape Package', members: 160, sales: 30, rev: '$20,240' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.cat}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.members}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.sales}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'GUEST_WELLNESS_INSIGHTS') {
            return (
              <div className="space-y-4 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Wellness seekers represent 38% of total guests this month.</p>
                <div className="p-4 border border-[#d4c4b7] rounded-lg bg-[#efe7d5]/10 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#4a3c31]">Stay Correlation</h4>
                    <p className="text-xs text-[#7d6b5e] mt-1">
                      Wellness guests stay an average of 4.5 nights compared to 2.8 nights for non-wellness guests, resulting in a significantly higher ancillary spend per room.
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          if (detailKey === 'RETAIL_SELLERS_INSIGHTS') {
            return (
              <div className="space-y-4 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Retail Top Sellers Analysis: Sosei Signature Oil leading.</p>
                <div className="p-4 border border-[#d4c4b7] rounded-lg bg-[#efe7d5]/10 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#4a3c31]">Signature Oil Performance</h4>
                    <p className="text-xs text-[#7d6b5e] mt-1">
                      The launch of the smaller 50ml travel bottle of Sosei Signature Oil has boosted retail volumes by 34% this month.
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          if (detailKey === 'WELLNESS_FEEDBACK_INSIGHTS') {
            return (
              <div className="space-y-4 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Wellness Experience Index: 4.8 / 5 stars satisfaction rating.</p>
                <div className="p-4 border border-[#d4c4b7] rounded-lg bg-[#efe7d5]/10 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#4a3c31]">Ambience & Quality</h4>
                    <p className="text-xs text-[#7d6b5e] mt-1">
                      Treatment quality and therapist professionalism continue to rank the highest, scoring 4.9 and 4.8 respectively. Guest survey feedback specifically praises the peaceful layout and temperature control of the treatment rooms.
                    </p>
                  </div>
                </div>
              </div>
            );
          }
          
          if (detailKey === 'UTILIZATION_OVER_TIME') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Weekly spa utilization rate across all treatment rooms, MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Week</th>
                        <th className="p-2.5 text-right">Utilization Rate</th>
                        <th className="p-2.5 text-right">Appointments</th>
                        <th className="p-2.5 text-right">vs Prior Week</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { week: 'May 1 – May 7',   util: '65%', appts: 186, delta: '—' },
                        { week: 'May 8 – May 14',  util: '72%', appts: 214, delta: '+7pp' },
                        { week: 'May 15 – May 21', util: '68%', appts: 198, delta: '-4pp' },
                        { week: 'May 22 – May 28', util: '74%', appts: 232, delta: '+6pp' },
                        { week: 'May 29 – May 31', util: '71%', appts: 418, delta: '-3pp' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.week}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.util}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.appts}</td>
                          <td className={`p-2.5 text-right font-bold ${row.delta.startsWith('+') ? 'text-[#15803d]' : row.delta === '—' ? 'text-[#7d6b5e]' : 'text-[#a65e52]'}`}>{row.delta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'UTILIZATION_TIME_OF_DAY') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Average treatment room occupancy by time slot across weekdays and weekends.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Time Slot</th>
                        <th className="p-2.5 text-right">Mon – Thu</th>
                        <th className="p-2.5 text-right">Fri</th>
                        <th className="p-2.5 text-right">Sat – Sun</th>
                        <th className="p-2.5 text-right">Peak Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { slot: '6:00 AM – 9:00 AM',   wday: '28%', fri: '42%', wend: '55%', peak: 'Low' },
                        { slot: '9:00 AM – 12:00 PM',  wday: '52%', fri: '68%', wend: '82%', peak: 'Medium' },
                        { slot: '12:00 PM – 3:00 PM',  wday: '65%', fri: '74%', wend: '88%', peak: 'High' },
                        { slot: '3:00 PM – 6:00 PM',   wday: '78%', fri: '92%', wend: '95%', peak: 'Peak' },
                        { slot: '6:00 PM – 9:00 PM',   wday: '58%', fri: '80%', wend: '74%', peak: 'High' },
                        { slot: '9:00 PM – 11:00 PM',  wday: '22%', fri: '38%', wend: '40%', peak: 'Low' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.slot}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.wday}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.fri}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.wend}</td>
                          <td className={`p-2.5 text-right font-bold ${row.peak === 'Peak' ? 'text-[#a65e52]' : row.peak === 'High' ? 'text-[#C8A050]' : 'text-[#7d6b5e]'}`}>{row.peak}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'UTILIZATION_BY_AREA') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Treatment room and facility utilization breakdown by area, MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Spa Area</th>
                        <th className="p-2.5 text-right">Capacity (Rooms / Slots)</th>
                        <th className="p-2.5 text-right">MTD Sessions</th>
                        <th className="p-2.5 text-right">Utilization Rate</th>
                        <th className="p-2.5 text-right">vs Apr</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { area: 'Treatment Rooms',    cap: '8 rooms × 10 slots',  sessions: 1248, util: '78%', delta: '+5pp' },
                        { area: 'Hydro Facilities',   cap: '4 pools × 6 slots',   sessions: 312,  util: '65%', delta: '+3pp' },
                        { area: 'Relaxation Lounge',  cap: '20 seats × 8 slots',  sessions: 496,  util: '62%', delta: '+8pp' },
                        { area: 'Movement Studio',    cap: '1 studio × 6 classes', sessions: 144,  util: '48%', delta: '-2pp' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.area}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.cap}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.sessions.toLocaleString()}</td>
                          <td className="p-2.5 text-right font-bold text-[#4a3c31]">{row.util}</td>
                          <td className={`p-2.5 text-right font-bold ${row.delta.startsWith('+') ? 'text-[#15803d]' : 'text-[#a65e52]'}`}>{row.delta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'SCHEDULE_OVERVIEW') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Today's appointment status breakdown across all treatment areas.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5 text-right">Appointments</th>
                        <th className="p-2.5 text-right">% of Total</th>
                        <th className="p-2.5 text-right">Avg Duration</th>
                        <th className="p-2.5 text-right">Revenue Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { status: 'Completed',          count: 32, pct: '47%', dur: '82 min', rev: '$7,232' },
                        { status: 'In Progress',         count: 14, pct: '21%', dur: '72 min', rev: '$3,206' },
                        { status: 'Scheduled',           count: 22, pct: '32%', dur: '75 min', rev: '$5,016' },
                        { status: 'Cancelled / No Show', count: 0,  pct: '0%',  dur: '—',      rev: '$0' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.status}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.count}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.pct}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.dur}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'TOP_TREATMENTS_DETAIL') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Top performing spa treatments by volume and revenue, MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Rank</th>
                        <th className="p-2.5">Treatment Name</th>
                        <th className="p-2.5 text-right">Sessions</th>
                        <th className="p-2.5 text-right">Avg Rating</th>
                        <th className="p-2.5 text-right">Avg Ticket</th>
                        <th className="p-2.5 text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { rank: 1, name: 'Deep Tissue Massage',    count: 312, rating: '4.8', ticket: '$229', rev: '$71,448' },
                        { rank: 2, name: 'Aromatherapy Massage',   count: 248, rating: '4.7', ticket: '$229', rev: '$56,792' },
                        { rank: 3, name: 'Facial Signature',       count: 196, rating: '4.9', ticket: '$199', rev: '$39,004' },
                        { rank: 4, name: 'Hot Stone Therapy',      count: 154, rating: '4.8', ticket: '$259', rev: '$39,886' },
                        { rank: 5, name: 'Detox Body Wrap',        count: 98,  rating: '4.6', ticket: '$249', rev: '$24,402' },
                        { rank: 6, name: 'Couples Retreat',        count: 72,  rating: '4.9', ticket: '$399', rev: '$28,728' },
                        { rank: 7, name: 'Himalayan Salt Scrub',   count: 68,  rating: '4.7', ticket: '$219', rev: '$14,892' },
                        { rank: 8, name: 'Prenatal Massage',       count: 44,  rating: '4.9', ticket: '$219', rev: '$9,636' },
                        { rank: 9, name: 'Sound Healing Session',  count: 36,  rating: '4.8', ticket: '$179', rev: '$6,444' },
                        { rank: 10, name: 'Reflexology',           count: 20,  rating: '4.6', ticket: '$149', rev: '$2,980' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 text-[#7d6b5e] font-bold">{row.rank}</td>
                          <td className="p-2.5 font-bold">{row.name}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.count}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.rating} / 5</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.ticket}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'REVENUE_BY_CATEGORY') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Treatment revenue breakdown by service category, MTD.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-right">Sessions</th>
                        <th className="p-2.5 text-right">Revenue Share</th>
                        <th className="p-2.5 text-right">Avg Ticket</th>
                        <th className="p-2.5 text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { cat: 'Massages',          sessions: 692, share: '54%', ticket: '$224', rev: '$154,808' },
                        { cat: 'Facials',            sessions: 270, share: '22%', ticket: '$192', rev: '$51,840' },
                        { cat: 'Body Treatments',   sessions: 180, share: '14%', ticket: '$238', rev: '$42,840' },
                        { cat: 'Wellness Rituals',  sessions: 82,  share: '7%',  ticket: '$249', rev: '$20,418' },
                        { cat: 'Other',             sessions: 24,  share: '3%',  ticket: '$143', rev: '$3,432' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.cat}</td>
                          <td className="p-2.5 text-right text-[#657454] font-semibold">{row.sessions}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.share}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.ticket}</td>
                          <td className="p-2.5 text-right font-bold text-[#a65e52]">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (detailKey === 'UPCOMING_PEAK_TIMES') {
            return (
              <div className="space-y-6 animate-fade-in text-[#4a3c31]">
                <p className="text-xs text-[#7d6b5e]">Forecasted high-demand periods with therapist availability and pre-booking rate.</p>
                <div className="overflow-x-auto border border-[#d4c4b7]/60 rounded-lg bg-white/40">
                  <table className="w-full text-[10px] text-[#4a3c31]">
                    <thead>
                      <tr className="border-b border-[#d4c4b7] bg-[#f3eae1]/50 text-left font-bold">
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Peak Window</th>
                        <th className="p-2.5 text-right">Demand Level</th>
                        <th className="p-2.5 text-right">Therapists Available</th>
                        <th className="p-2.5 text-right">Pre-Booked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: 'May 31 (Fri)', window: '3:00 PM – 6:00 PM', level: 'High',   avail: '6 / 8', booked: '78%' },
                        { date: 'Jun 1 (Sat)', window: '10:00 AM – 1:00 PM', level: 'High',   avail: '8 / 8', booked: '91%' },
                        { date: 'Jun 2 (Sun)', window: '11:00 AM – 2:00 PM', level: 'Medium', avail: '7 / 8', booked: '62%' },
                        { date: 'Jun 7 (Fri)', window: '4:00 PM – 7:00 PM',  level: 'High',   avail: '6 / 8', booked: '74%' },
                        { date: 'Jun 8 (Sat)', window: '2:00 PM – 5:00 PM',  level: 'Medium', avail: '8 / 8', booked: '55%' },
                        { date: 'Jun 14 (Fri)', window: '3:00 PM – 6:00 PM', level: 'Medium', avail: '7 / 8', booked: '48%' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-[#d4c4b7]/30 last:border-0 hover:bg-[#f3eae1]/20 transition-colors">
                          <td className="p-2.5 font-bold">{row.date}</td>
                          <td className="p-2.5 text-[#7d6b5e]">{row.window}</td>
                          <td className={`p-2.5 text-right font-bold ${row.level === 'High' ? 'text-[#a65e52]' : 'text-[#C8A050]'}`}>{row.level}</td>
                          <td className="p-2.5 text-right text-[#7d6b5e]">{row.avail}</td>
                          <td className="p-2.5 text-right font-bold text-[#657454]">{row.booked}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          return (
            <div className="text-xs text-[#7d6b5e] italic">
              Detailed statistics and analytics reports for {config.title}.
            </div>
          );

        }

      default:
        return null;
    }
  };

  const getDrawerWidth = () => {
    if (!config) return 'w-[92vw] sm:w-[520px]';
    switch (config.type) {
      case 'SPEND_OVERTIME':
      case 'WORLD_MAP':
        return 'w-[95vw] sm:w-[780px]'; // Extra wide for more columns
      case 'TOP_NATIONALITIES':
      case 'PORTFOLIO_PERFORMANCE':
      case 'GEO_MARKET':
      case 'MARKET_SEGMENT':
      case 'CHANNEL_DISTRIBUTION':
      case 'FNB_DETAIL':
      case 'SPA_DETAIL':
        return 'w-[92vw] sm:w-[660px]';
      default:
        return 'w-[92vw] sm:w-[520px]';
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
