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

const kpis = [
  { label: 'OCCUPANCY',         value: '68%',     trend: '↑ 2.4pp', up: true,  color: '#947b66' },
  { label: 'REVENUE (USD)',     value: '$10.21M', trend: '↑ 8.8%',  up: true,  color: '#586981' },
  { label: 'RevPAR (USD)',      value: '$895',    trend: '↑ 6.4%',  up: true,  color: '#657454' },
  { label: 'ADR (USD)',         value: '$1,316',  trend: '↑ 3.7%',  up: true,  color: '#8b6b7a' },
  { label: 'TOTAL ROOM NIGHTS', value: '7,757',   trend: '↑ 4.8%',  up: true,  color: '#a67138' },
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

  // Dummy function to simulate data changing when filters change
  const shuffleFactor = useMemo(() => {
    return 0.8 + (Math.random() * 0.4); // Random factor between 0.8 and 1.2
  }, [activeResorts, startDate, endDate, compStartDate, compEndDate]);

  const dynamicTotal = useMemo(() => Math.round(36921 * shuffleFactor).toLocaleString(), [shuffleFactor]);

  const dynamicKpis = useMemo(() => kpis.map(k => ({
    ...k,
    value: k.value.includes('%') 
      ? `${Math.min(100, Math.round(parseInt(k.value) * shuffleFactor))}%`
      : k.value.includes('$') 
        ? `$${(parseFloat(k.value.replace(/[^0-9.]/g, '')) * shuffleFactor).toFixed(k.value.includes('M') ? 2 : 0)}${k.value.includes('M') ? 'M' : ''}`
        : Math.round(parseInt(k.value.replace(/,/g, '')) * shuffleFactor).toLocaleString()
  })), [shuffleFactor]);

  const dynamicGeoData = useMemo(() => {
    let sum = 0;
    const randomized = geoData.filter(g => !g.isTotal).map(g => {
      const v = parseFloat(g.rnights) * (0.6 + Math.random() * 0.8);
      sum += v;
      return { ...g, raw: v };
    });
    const normalized = randomized.map(g => ({
      ...g,
      rnights: `${((g.raw / sum) * 100).toFixed(1)}%`
    }));
    return [...normalized, { ...geoData.find(g => g.isTotal), rnights: '100%' }];
  }, [activeResorts, startDate, endDate, compStartDate, compEndDate]);

  const dynamicSegmentData = useMemo(() => {
    let sum = 0;
    const randomized = segmentData.map(s => {
      const v = s.value * (0.6 + Math.random() * 0.8);
      sum += v;
      return { ...s, raw: v };
    });
    return randomized.map(s => ({
      ...s,
      value: Number(((s.raw / sum) * 100).toFixed(1))
    }));
  }, [activeResorts, startDate, endDate, compStartDate, compEndDate]);

  const dynamicChannelData = useMemo(() => {
    let sum = 0;
    const randomized = channelData.map(c => {
      const v = c.value * (0.6 + Math.random() * 0.8);
      sum += v;
      return { ...c, raw: v };
    });
    return randomized.map(c => ({
      ...c,
      value: Number(((c.raw / sum) * 100).toFixed(1))
    }));
  }, [activeResorts, startDate, endDate, compStartDate, compEndDate]);

  const dynamicSegmentTable = useMemo(() => segmentTable.map((s, idx) => {
    if (s.isTotal) return s;
    const newValue = dynamicSegmentData[idx]?.value || 0;
    return {
      ...s,
      rnights: `${newValue}%`,
      revenue: `$${(parseFloat(s.revenue.replace(/[^0-9.]/g, '')) * shuffleFactor).toFixed(2)}M`
    };
  }), [dynamicSegmentData, shuffleFactor]);

  const dynamicChannelTable = useMemo(() => channelTable.map((c, idx) => {
    if (c.isTotal) return c;
    const newValue = dynamicChannelData[idx]?.value || 0;
    return {
      ...c,
      rnights: `${newValue}%`,
      revenue: `$${(parseFloat(c.revenue.replace(/[^0-9.]/g, '')) * shuffleFactor).toFixed(2)}M`
    };
  }), [dynamicChannelData, shuffleFactor]);

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 pb-8 text-[10px]">
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
