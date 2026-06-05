import { useState, useMemo } from 'react';
import { ResortPickerWidget } from '../components/widgets/resort-type/ResortPickerWidget';
import { DateRangeWidget } from '../components/widgets/resort-type/DateRangeWidget';
import { ResortKPIWidget } from '../components/widgets/resort-type/ResortKPIWidget';
import { ResortGeoMarketWidget } from '../components/widgets/resort-type/ResortGeoMarketWidget';
import { ResortMarketSegmentWidget } from '../components/widgets/resort-type/ResortMarketSegmentWidget';
import { ResortChannelStatsWidget } from '../components/widgets/resort-type/ResortChannelStatsWidget';

const geoData = [
  { region: 'Asia Pacific',  rnights: '32.5%', adr: '$274', revenue: '$3.43M' },
  { region: 'Europe',        rnights: '20.4%', adr: '$312', revenue: '$2.94M' },
  { region: 'America',       rnights: '22.7%', adr: '$245', revenue: '$2.31M' },
  { region: 'Middle East',   rnights: '9.6%',  adr: '$221', revenue: '$1.05M' },
  { region: 'Africa',        rnights: '6.6%',  adr: '$195', revenue: '$0.45M' },
  { region: 'Total',         rnights: '100%',  adr: '$286', revenue: '$10.21M', isTotal: true },
];

const segmentData = [
  { name: 'Leisure',  value: 56.2, color: '#C8A050' },
  { name: 'Business', value: 23.1, color: '#947b66' },
  { name: 'Social',   value: 10.4, color: '#7d6b5e' },
  { name: 'MICE',     value: 7.6,  color: '#d4c4b7' },
  { name: 'Others',   value: 2.7,  color: '#e5d8cb' },
];
const segmentTable = [
  { segment: 'Leisure',  rnights: '56.2%', adr: '$262', revenue: '$3.43M' },
  { segment: 'Business', rnights: '23.1%', adr: '$312', revenue: '$2.94M' },
  { segment: 'Social',   rnights: '10.4%', adr: '$195', revenue: '$2.31M' },
  { segment: 'MICE',     rnights: '7.6%',  adr: '$278', revenue: '$1.55M' },
  { segment: 'Others',   rnights: '2.7%',  adr: '$175', revenue: '$0.48M' },
  { segment: 'Total',    rnights: '100%',  adr: '$286', revenue: '$10.21M', isTotal: true },
];

const channelData = [
  { name: 'Direct',    value: 32.6, color: '#C8A050' },
  { name: 'OTA',       value: 27.8, color: '#947b66' },
  { name: 'Consortia', value: 15.2, color: '#7d6b5e' },
  { name: 'Own Web',   value: 11.3, color: '#d4c4b7' },
  { name: 'TO',        value: 7.5,  color: '#b8a899' },
  { name: 'Trade',     value: 5.6,  color: '#e5d8cb' },
];
const channelTable = [
  { channel: 'Direct',    rnights: '32.6%', adr: '$312', revenue: '$3.68M' },
  { channel: 'OTA',       rnights: '27.8%', adr: '$226', revenue: '$2.54M' },
  { channel: 'Consortia', rnights: '15.2%', adr: '$244', revenue: '$1.05M' },
  { channel: 'Own Web',   rnights: '11.3%', adr: '$298', revenue: '$1.19M' },
  { channel: 'TO',        rnights: '7.5%',  adr: '$205', revenue: '$0.78M' },
  { channel: 'Trade',     rnights: '5.6%',  adr: '$194', revenue: '$0.46M' },
  { channel: 'Total',     rnights: '100%',  adr: '$280', revenue: '$10.21M', isTotal: true },
];


export function ResortTypeDashboard() {
  const [activeResorts, setActiveResorts] = useState<string[]>(['city']);
  
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const prevMonthToday = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  const firstDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const [startDate, setStartDate] = useState<Date | null>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [compStartDate, setCompStartDate] = useState<Date | null>(firstDayOfPrevMonth);
  const [compEndDate, setCompEndDate] = useState<Date | null>(prevMonthToday);

  // Resort profiles mapping weights and average values for logical aggregations
  const resortWeightsProfile = useMemo(() => ({
    desert: { weight: 0.13, occupancy: 58, adr: 250 },
    ocean: { weight: 0.20, occupancy: 72, adr: 290 },
    city: { weight: 0.32, occupancy: 55, adr: 510 },
    alpine: { weight: 0.18, occupancy: 65, adr: 285 },
    countryside: { weight: 0.11, occupancy: 60, adr: 200 },
    forest: { weight: 0.06, occupancy: 50, adr: 162 },
  } as Record<string, { weight: number, occupancy: number, adr: number }>), []);

  const dateFactor = useMemo(() => {
    if (!startDate || !endDate) return 1.0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    // Stable factor based on number of days (fluctuates slightly between 0.9 and 1.1)
    return 0.9 + ((days % 20) / 100);
  }, [startDate, endDate]);

  const { sumWeights, avgOcc, avgAdr, avgRevpar } = useMemo(() => {
    const activeList = activeResorts.length > 0 ? activeResorts : ['city'];
    let totalW = 0;
    let weightedOcc = 0;
    let weightedAdr = 0;

    activeList.forEach(r => {
      const profile = resortWeightsProfile[r] || resortWeightsProfile['city'];
      totalW += profile.weight;
      weightedOcc += profile.occupancy * profile.weight;
      weightedAdr += profile.adr * profile.weight;
    });

    const o = Math.min(100, Math.max(10, Math.round((weightedOcc / totalW) * dateFactor)));
    const a = Math.round((weightedAdr / totalW) * dateFactor);
    const r = Math.round((o * a) / 100);

    return {
      sumWeights: totalW,
      avgOcc: o,
      avgAdr: a,
      avgRevpar: r
    };
  }, [activeResorts, dateFactor, resortWeightsProfile]);

  const dynamicTotal = useMemo(() => {
    const totalNights = Math.round(7757 * sumWeights * dateFactor);
    return totalNights.toLocaleString();
  }, [sumWeights, dateFactor]);

  const dynamicKpis = useMemo(() => {
    const totalRev = 10.21 * sumWeights * dateFactor;
    const totalNights = Math.round(7757 * sumWeights * dateFactor);

    return [
      { label: 'OCCUPANCY',         value: `${avgOcc}%`,     trend: '↑ 2.4pp', up: true,  color: '#947b66' },
      { label: 'REVENUE (USD)',     value: `$${totalRev.toFixed(2)}M`, trend: '↑ 8.8%',  up: true,  color: '#586981' },
      { label: 'RevPAR (USD)',      value: `$${avgRevpar}`,    trend: '↑ 6.4%',  up: true,  color: '#657454' },
      { label: 'ADR (USD)',         value: `$${avgAdr.toLocaleString()}`,  trend: '↑ 3.7%',  up: true,  color: '#8b6b7a' },
      { label: 'TOTAL ROOM NIGHTS', value: totalNights.toLocaleString(),   trend: '↑ 4.8%',  up: true,  color: '#a67138' },
    ];
  }, [sumWeights, dateFactor, avgOcc, avgAdr, avgRevpar]);

  const dynamicGeoData = useMemo(() => {
    let sum = 0;
    const randomized = geoData.filter(g => !g.isTotal).map(g => {
      // Deterministic but natural-looking distribution
      const hash = g.region.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const v = parseFloat(g.rnights) * (0.8 + (hash % 5) / 10);
      sum += v;
      return { ...g, raw: v };
    });
    const normalized = randomized.map(g => ({
      ...g,
      rnights: `${((g.raw / sum) * 100).toFixed(1)}%`,
      revenue: `$${(parseFloat(g.revenue.replace(/[^0-9.]/g, '')) * sumWeights * dateFactor).toFixed(2)}M`
    }));
    return [...normalized, { ...geoData.find(g => g.isTotal), rnights: '100%', revenue: `$${(10.21 * sumWeights * dateFactor).toFixed(2)}M` }];
  }, [sumWeights, dateFactor]);

  const dynamicSegmentData = useMemo(() => {
    let sum = 0;
    const randomized = segmentData.map(s => {
      const hash = s.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const v = s.value * (0.8 + (hash % 5) / 10);
      sum += v;
      return { ...s, raw: v };
    });
    return randomized.map(s => ({
      ...s,
      value: Number(((s.raw / sum) * 100).toFixed(1))
    }));
  }, []);

  const dynamicChannelData = useMemo(() => {
    let sum = 0;
    const randomized = channelData.map(c => {
      const hash = c.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const v = c.value * (0.8 + (hash % 5) / 10);
      sum += v;
      return { ...c, raw: v };
    });
    return randomized.map(c => ({
      ...c,
      value: Number(((c.raw / sum) * 100).toFixed(1))
    }));
  }, []);

  const dynamicSegmentTable = useMemo(() => segmentTable.map((s, idx) => {
    if (s.isTotal) return { ...s, revenue: `$${(10.21 * sumWeights * dateFactor).toFixed(2)}M` };
    const newValue = dynamicSegmentData[idx]?.value || 0;
    return {
      ...s,
      rnights: `${newValue}%`,
      revenue: `$${(parseFloat(s.revenue.replace(/[^0-9.]/g, '')) * sumWeights * dateFactor).toFixed(2)}M`
    };
  }), [dynamicSegmentData, sumWeights, dateFactor]);

  const dynamicChannelTable = useMemo(() => channelTable.map((c, idx) => {
    if (c.isTotal) return { ...c, revenue: `$${(10.21 * sumWeights * dateFactor).toFixed(2)}M` };
    const newValue = dynamicChannelData[idx]?.value || 0;
    return {
      ...c,
      rnights: `${newValue}%`,
      revenue: `$${(parseFloat(c.revenue.replace(/[^0-9.]/g, '')) * sumWeights * dateFactor).toFixed(2)}M`
    };
  }), [dynamicChannelData, sumWeights, dateFactor]);

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 text-[10px]">
      {/* Welcome Card inside the scrollable container */}
      <div className="w-full py-6 px-1 flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#d4c4b7]/40 animate-card-enter animate-delay-75">
        <div className="flex gap-4 items-start">
          {/* Traditional red stamp accent */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#a65e52] mt-2 shrink-0 opacity-80" />
          <div>
            <p className="text-[10px] font-sans text-[#a65e52] tracking-widest uppercase mb-0.5 font-semibold">Welcome back, Curator</p>
            <h2 className="text-2xl font-serif text-[#4a3c31] tracking-wide mb-1.5 flex items-center gap-2">
              <span>Resort & Destination Analytics</span>
              <span className="text-[10px] font-sans text-[#7d6b5e]/60 tracking-wider font-light">| 分析</span>
            </h2>
            <p className="text-[#7d6b5e] text-xs font-serif italic max-w-2xl leading-relaxed">
              Observing the unique flow of our sanctuaries, from mountain winds to ocean breeze.
            </p>
          </div>
        </div>
        <div className="shrink-0 text-[9px] text-[#a65e52] font-semibold tracking-widest uppercase border border-[#a65e52]/30 px-3 py-1 rounded-sm bg-[#a65e52]/5">
          Resort Analytics
        </div>
      </div>

      <ResortPickerWidget activeResorts={activeResorts} setActiveResorts={setActiveResorts} />
      
      <DateRangeWidget 
        startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}
        compStartDate={compStartDate} setCompStartDate={setCompStartDate} compEndDate={compEndDate} setCompEndDate={setCompEndDate}
      />
      
      <ResortKPIWidget kpis={dynamicKpis} />
      
      <div className="grid grid-cols-3 gap-4 flex-1">
        <ResortGeoMarketWidget geoData={dynamicGeoData} />
        <ResortMarketSegmentWidget segmentData={dynamicSegmentData} segmentTable={dynamicSegmentTable} totalRnights={dynamicTotal} />
        <ResortChannelStatsWidget channelData={dynamicChannelData} channelTable={dynamicChannelTable} totalRnights={dynamicTotal} />
      </div>
    </div>
  );
}
