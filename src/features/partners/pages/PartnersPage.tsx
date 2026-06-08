import React, { useState } from 'react';
import { DateRangeWidget } from '../../dashboard/components/widgets/resort-type/DateRangeWidget';
import {
  HandShake,
  UsersGroupTwoRounded,
  AltArrowDown,
  Calendar,
  Heart,
  Globus,
  Widget2,
  Checklist
} from '@solar-icons/react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

function SparklesIcon({ size = 14, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" fill="currentColor" />
    </svg>
  );
}

// Shared Moments images
import privateDinnerImg from '../../../assets/contents/private_dinner_alpine.png';
import wellnessRetreatImg from '../../../assets/contents/wellness_retreat.png';
import productWorkshopImg from '../../../assets/contents/product_workshop.png';
import sunsetCruiseImg from '../../../assets/contents/sunset_cruise.png';

interface PartnerData {
  id: string;
  name: string;
  guests: string;
  guestsTrend: string;
  roomNights: string;
  roomNightsTrend: string;
  revenue: string;
  revenueTrend: string;
  adr: string;
  adrTrend: string;
  avgNights: string;
  avgNightsTrend: string;
  repeatRatio: string;
  repeatRatioTrend: string;
  type: string;
  tier: string;
  strengths: string[];
  destinations: {
    alpine: 'level4' | 'level3' | 'level2' | 'level1';
    ocean: 'level4' | 'level3' | 'level2' | 'level1';
    forest: 'level4' | 'level3' | 'level2' | 'level1';
    desert: 'level4' | 'level3' | 'level2' | 'level1';
    city: 'level4' | 'level3' | 'level2' | 'level1';
    countryside: 'level4' | 'level3' | 'level2' | 'level1';
  };
}

const PARTNERS_DATA: PartnerData[] = [
  {
    id: 'virtuoso',
    name: 'Virtuoso',
    guests: '1,024',
    guestsTrend: '↑ 15%',
    roomNights: '6,842',
    roomNightsTrend: '↑ 18%',
    revenue: '$9.6M',
    revenueTrend: '↑ 16%',
    adr: '$1,403',
    adrTrend: '↑ 17%',
    avgNights: '6.8',
    avgNightsTrend: '↑ 0.4',
    repeatRatio: '78%',
    repeatRatioTrend: '↑ 7pp',
    type: 'Strategic Partner',
    tier: 'TIER 1',
    strengths: ['Family Travel', 'Wellness', 'Multi-Property', 'Long Stays'],
    destinations: {
      alpine: 'level4',
      ocean: 'level4',
      forest: 'level3',
      desert: 'level1',
      city: 'level1',
      countryside: 'level1'
    }
  },
  {
    id: 'serandipians',
    name: 'Serandipians',
    guests: '642',
    guestsTrend: '↑ 10%',
    roomNights: '3,921',
    roomNightsTrend: '↑ 12%',
    revenue: '$5.1M',
    revenueTrend: '↑ 9%',
    adr: '$1,300',
    adrTrend: '↑ 10%',
    avgNights: '6.1',
    avgNightsTrend: '↑ 0.2',
    repeatRatio: '72%',
    repeatRatioTrend: '↑ 5pp',
    type: 'Preferred Partner',
    tier: 'TIER 1',
    strengths: ['Wellness', 'Family Travel', 'Villas', 'Eco-Luxury'],
    destinations: {
      alpine: 'level4',
      ocean: 'level4',
      forest: 'level2',
      desert: 'level1',
      city: 'level1',
      countryside: 'level1'
    }
  },
  {
    id: 'travel-edge',
    name: 'Travel Edge',
    guests: '428',
    guestsTrend: '↑ 8%',
    roomNights: '2,713',
    roomNightsTrend: '↑ 9%',
    revenue: '$3.2M',
    revenueTrend: '↑ 7%',
    adr: '$1,180',
    adrTrend: '↑ 8%',
    avgNights: '6.3',
    avgNightsTrend: '↑ 0.3',
    repeatRatio: '68%',
    repeatRatioTrend: '↑ 4pp',
    type: 'Leisure Partner',
    tier: 'TIER 2',
    strengths: ['Multi-Property', 'Wellness', 'Weekend Escapes'],
    destinations: {
      alpine: 'level4',
      ocean: 'level4',
      forest: 'level1',
      desert: 'level1',
      city: 'level1',
      countryside: 'level1'
    }
  },
  {
    id: 'remote-lands',
    name: 'Remote Lands',
    guests: '315',
    guestsTrend: '↑ 12%',
    roomNights: '2,104',
    roomNightsTrend: '↑ 10%',
    revenue: '$2.4M',
    revenueTrend: '↑ 11%',
    adr: '$1,140',
    adrTrend: '↑ 11%',
    avgNights: '6.7',
    avgNightsTrend: '↑ 0.5',
    repeatRatio: '75%',
    repeatRatioTrend: '↑ 6pp',
    type: 'Boutique Partner',
    tier: 'TIER 2',
    strengths: ['Custom Itineraries', 'Adventure', 'Long Stays'],
    destinations: {
      alpine: 'level4',
      ocean: 'level1',
      forest: 'level1',
      desert: 'level1',
      city: 'level1',
      countryside: 'level1'
    }
  },
  {
    id: 'global-escapes',
    name: 'Global Escapes',
    guests: '213',
    guestsTrend: '↑ 5%',
    roomNights: '1,234',
    roomNightsTrend: '↑ 6%',
    revenue: '$1.6M',
    revenueTrend: '↑ 9%',
    adr: '$1,296',
    adrTrend: '↑ 5%',
    avgNights: '5.8',
    avgNightsTrend: '↑ 0.1',
    repeatRatio: '60%',
    repeatRatioTrend: '↑ 2pp',
    type: 'Emerging Partner',
    tier: 'TIER 3',
    strengths: ['Family Travel', 'Beachfront', 'Summer Vibe'],
    destinations: {
      alpine: 'level4',
      ocean: 'level1',
      forest: 'level1',
      desert: 'level1',
      city: 'level1',
      countryside: 'level1'
    }
  }
];

const CONTRIBUTION_DATA = [
  { name: 'Virtuoso', value: 33, color: '#4d6961' },
  { name: 'Serandipians', value: 22, color: '#C8A050' },
  { name: 'Travel Edge', value: 15, color: '#C3A481' },
  { name: 'Remote Lands', value: 12, color: '#947b66' },
  { name: 'Global Escapes', value: 8, color: '#668094' },
  { name: 'Other Partners', value: 10, color: '#7d6b5e' },
];

export function PartnersPage() {
  const [selectedPartner, setSelectedPartner] = useState<PartnerData>(PARTNERS_DATA[0]);

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const prevMonthToday = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  const firstDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const [startDate, setStartDate] = useState<Date | null>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [compStartDate, setCompStartDate] = useState<Date | null>(firstDayOfPrevMonth);
  const [compEndDate, setCompEndDate] = useState<Date | null>(prevMonthToday);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<{
    title: string;
    description: string;
    children: React.ReactNode;
  } | null>(null);

  const openDrawer = (title: string, description: string, children: React.ReactNode) => {
    setDrawerContent({ title, description, children });
    setDrawerOpen(true);
  };

  const renderPerformanceDrawer = () => (
    <div className="space-y-6">
      <div className="bg-[#f3eae1]/50 border border-[#d4c4b7] rounded-lg p-4">
        <h4 className="font-serif text-base text-[#4a3c31] mb-2">Q1 Performance Summary</h4>
        <p className="text-[11px] text-[#7d6b5e] leading-relaxed">
          Overall partner contributions grew by 14.2% year-over-year. Average Daily Rate (ADR) across all consortia channels reached $1,280, with a guest repeat ratio of 71%.
        </p>
      </div>

      <div className="space-y-3">
        <h5 className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider">Detailed Partner Metrics</h5>
        <div className="border border-[#d4c4b7] rounded-lg overflow-hidden bg-white">
          <table className="w-full text-left border-collapse text-[10px]">
            <thead>
              <tr className="bg-[#f3eae1]/40 border-b border-[#d4c4b7] text-[#7d6b5e] font-semibold">
                <th className="p-2.5">Partner</th>
                <th className="p-2.5 text-right">Guests</th>
                <th className="p-2.5 text-right">Rev (USD)</th>
                <th className="p-2.5 text-right">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4c4b7]/30 text-[#4a3c31]">
              {PARTNERS_DATA.map((p) => (
                <tr key={p.id} className="hover:bg-[#e5d8cb]/10">
                  <td className="p-2.5 font-medium">{p.name}</td>
                  <td className="p-2.5 text-right">{p.guests}</td>
                  <td className="p-2.5 text-right">{p.revenue}</td>
                  <td className="p-2.5 text-right text-emerald-700 font-semibold">{p.guestsTrend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDestinationsDrawer = () => (
    <div className="space-y-6">
      <div className="bg-[#f3eae1]/50 border border-[#d4c4b7] rounded-lg p-4">
        <h4 className="font-serif text-base text-[#4a3c31] mb-2">Destination Preferences Analysis</h4>
        <p className="text-[11px] text-[#7d6b5e] leading-relaxed">
          Alpine and Ocean destinations represent our top performing categories, driven heavily by Virtuoso and Serandipians luxury bookings. Forest wellness excursions are showing an emerging trend.
        </p>
      </div>

      <div className="space-y-4">
        <h5 className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider">Market Dynamics</h5>
        <div className="space-y-3">
          {[
            { name: 'Alpine Resorts', share: '42%', desc: 'Strong performance during winter ski and wellness retreats.', growth: '+18% YoY' },
            { name: 'Ocean Escapes', share: '31%', desc: 'Premium villa bookings and private charters.', growth: '+12% YoY' },
            { name: 'Forest Retreats', share: '15%', desc: 'Wellness focus with high repeat guest interest.', growth: '+24% YoY' },
            { name: 'Desert & Countryside', share: '12%', desc: 'Seasonal escapes showing moderate growth.', growth: '+5% YoY' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 border border-[#d4c4b7]/50 rounded-lg bg-white">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-xs text-[#4a3c31]">{item.name}</span>
                <span className="text-[10px] text-emerald-700 font-bold">{item.growth}</span>
              </div>
              <p className="text-[10px] text-[#7d6b5e] mb-1">{item.desc}</p>
              <div className="text-[9px] text-[#7d6b5e]/70 font-semibold uppercase">Share of bookings: {item.share}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPartnerProfileDrawer = () => (
    <div className="space-y-6">
      <div className="flex gap-4 items-center bg-[#f3eae1]/50 border border-[#d4c4b7] rounded-lg p-4">
        <div className="w-14 h-14 rounded-full border border-[#d4c4b7] flex items-center justify-center bg-white shrink-0 text-[#7d6b5e] text-2xl font-serif">
          {selectedPartner.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-serif text-lg text-[#4a3c31]">{selectedPartner.name}</h4>
          <p className="text-[10px] text-[#7d6b5e] font-semibold tracking-wider uppercase">{selectedPartner.type}</p>
          <span className="inline-block px-1.5 py-0.5 mt-1 rounded bg-[#C8A050]/20 text-[#C8A050] text-[8px] font-bold">
            {selectedPartner.tier}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h5 className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider">Key Partner Strengths</h5>
        <div className="flex flex-wrap gap-2">
          {selectedPartner.strengths.map((s, idx) => (
            <span key={idx} className="px-3 py-1 rounded-full bg-white border border-[#d4c4b7] text-[#4a3c31] text-[10px] font-semibold">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h5 className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider">Recent Achievements</h5>
        <ul className="space-y-2.5 text-[11px] text-[#7d6b5e]">
          <li className="flex gap-2">
            <span className="text-emerald-700 font-bold">✓</span>
            <span>Completed integration of priority booking API with our property management system.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-700 font-bold">✓</span>
            <span>Delivered 35% higher booking volume for SOSEI Alpine compared to previous periods.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-700 font-bold">✓</span>
            <span>Successfully hosted Wellness Retreat co-branded customer event.</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderContributionDrawer = () => (
    <div className="space-y-6">
      <div className="bg-[#f3eae1]/50 border border-[#d4c4b7] rounded-lg p-4">
        <h4 className="font-serif text-base text-[#4a3c31] mb-2">Contribution Mix Overview</h4>
        <p className="text-[11px] text-[#7d6b5e] leading-relaxed">
          How individual agency partners and consortia channels contribute to overall revenue. Virtuoso continues to lead with a 33% total share.
        </p>
      </div>

      <div className="space-y-3">
        <h5 className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider">Revenue Breakdown</h5>
        <div className="space-y-2">
          {CONTRIBUTION_DATA.map((item, idx) => (
            <div key={idx} className="flex flex-col bg-white p-3 border border-[#d4c4b7]/50 rounded-lg">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-xs text-[#4a3c31]">{item.name}</span>
                </div>
                <span className="font-bold text-xs text-[#4a3c31]">{item.value}%</span>
              </div>
              <div className="w-full bg-[#f6ebdc] h-2 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCorporateAccountsDrawer = () => (
    <div className="space-y-6">
      <div className="bg-[#f3eae1]/50 border border-[#d4c4b7] rounded-lg p-4">
        <h4 className="font-serif text-base text-[#4a3c31] mb-2">Corporate Client Strategy</h4>
        <p className="text-[11px] text-[#7d6b5e] leading-relaxed">
          These accounts represent corporate group retreats, wellness programs, and incentive travels. Managed relations show a 93% satisfaction score.
        </p>
      </div>

      <div className="space-y-4">
        <h5 className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider">Managed Accounts</h5>
        <div className="space-y-3">
          {[
            { name: 'Global Executive Retreats', type: 'Leadership & Incentive', since: '2022', events: 12, rev: '$2.1M' },
            { name: 'Wellness Collective Inc.', type: 'Corporate Wellness Programs', since: '2023', events: 8, rev: '$1.4M' },
            { name: 'Summit Group Int.', type: 'Corporate Meetings & AGM', since: '2024', events: 6, rev: '$0.9M' },
            { name: 'Oceanic Ventures Ltd.', type: 'VIP Client Events', since: '2025', events: 4, rev: '$0.5M' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 border border-[#d4c4b7]/50 rounded-lg bg-white">
              <h6 className="font-semibold text-xs text-[#4a3c31] mb-0.5">{item.name}</h6>
              <p className="text-[10px] text-[#7d6b5e] italic mb-2">{item.type}</p>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-center border-t border-[#d4c4b7]/30 pt-2 mt-1">
                <div>
                  <span className="block font-bold">{item.events}</span>
                  <span className="text-[8px] uppercase text-[#7d6b5e]">Events</span>
                </div>
                <div className="border-x border-[#d4c4b7]/30">
                  <span className="block font-bold">{item.rev}</span>
                  <span className="text-[8px] uppercase text-[#7d6b5e]">Revenue</span>
                </div>
                <div>
                  <span className="block font-bold">{item.since}</span>
                  <span className="text-[8px] uppercase text-[#7d6b5e]">Client Since</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInsightsDrawer = () => (
    <div className="space-y-6">
      <div className="bg-[#f3eae1]/50 border border-[#d4c4b7] rounded-lg p-4">
        <h4 className="font-serif text-base text-[#4a3c31] mb-2">Relationship Intelligence Report</h4>
        <p className="text-[11px] text-[#7d6b5e] leading-relaxed">
          AI-generated relationship insight analysis to maximize partner engagement and program co-creation.
        </p>
      </div>

      <div className="space-y-4">
        <h5 className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider">Detailed Insights</h5>
        <div className="space-y-3">
          {[
            { title: 'High Engagement, Strong Potential', desc: 'Partners in Tier 1 have seen an 18% increase in client satisfaction when co-creating customized wellness itineraries.' },
            { title: 'Wellness is a Shared Strength', desc: '68% of our top agency partners state that our wellness retreat programs are the primary reason their guests choose our resort over competitors.' },
            { title: 'API Integration Drive', desc: 'Connecting PMS platforms through direct integration drives an average bookings bump of 12.5%.' },
            { title: 'VIP Amenities Upgrades', desc: 'Custom welcome hampers and personal curator contact cards have improved repeat booking ratio by 6pp.' },
          ].map((insight, idx) => (
            <div key={idx} className="p-3 border border-[#d4c4b7]/50 rounded-lg bg-white">
              <h6 className="font-semibold text-xs text-[#4a3c31] mb-1">{insight.title}</h6>
              <p className="text-[10.5px] text-[#7d6b5e] leading-relaxed">{insight.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOpportunitiesDrawer = () => (
    <div className="space-y-6">
      <div className="bg-[#f3eae1]/50 border border-[#d4c4b7] rounded-lg p-4">
        <h4 className="font-serif text-base text-[#4a3c31] mb-2">Growth & Partnership Roadmap</h4>
        <p className="text-[11px] text-[#7d6b5e] leading-relaxed">
          Identified opportunities to co-create exclusive initiatives and programs with our strategic agency partners.
        </p>
      </div>

      <div className="space-y-4">
        <h5 className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider">Roadmap Actions</h5>
        <div className="space-y-3">
          {[
            { name: 'Expand Alpine portfolio with Virtuoso', impact: 'High Impact', plan: 'Launch SOSEI Alpine exclusive winter package. Target high-net-worth family wellness travellers.' },
            { name: 'Co-brand summer campaign with Serandipians', impact: 'High Impact', plan: 'Co-create customized family packages featuring private kid retreats and wilderness workshops.' },
            { name: 'Develop exclusive itineraries with Remote Lands', impact: 'Medium Impact', plan: 'Introduce private jet itinerary with custom mountain lodge transitions.' },
            { name: 'Develop sweet getaway with Global Escapes', impact: 'High Impact', plan: 'Create limited summer weekend escape programs.' },
          ].map((op, idx) => (
            <div key={idx} className="p-3 border border-[#d4c4b7]/50 rounded-lg bg-white">
              <div className="flex justify-between items-center mb-1.5">
                <h6 className="font-semibold text-xs text-[#4a3c31] truncate max-w-[250px]">{op.name}</h6>
                <span className="shrink-0 px-2 py-0.5 text-[8px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-200">
                  {op.impact}
                </span>
              </div>
              <p className="text-[10.5px] text-[#7d6b5e] leading-relaxed">{op.plan}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTouchpointsDrawer = () => (
    <div className="space-y-6">
      <div className="bg-[#f3eae1]/50 border border-[#d4c4b7] rounded-lg p-4">
        <h4 className="font-serif text-base text-[#4a3c31] mb-2">Upcoming Touchpoints Agenda</h4>
        <p className="text-[11px] text-[#7d6b5e] leading-relaxed">
          Upcoming business review meetings and strategy syncs with partners.
        </p>
      </div>

      <div className="space-y-4">
        <h5 className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider">Scheduled Meetings</h5>
        <div className="space-y-3">
          {[
            { partner: 'Virtuoso', date: 'May 6', type: 'Quarterly Review', agenda: 'Discuss Q1 performance, API status update, and coordinate SOSEI Alpine promotions.' },
            { partner: 'Serandipians', date: 'May 9', type: 'Strategy Call', agenda: 'Review summer campaign co-branding checklist and family package customization.' },
            { partner: 'Travel Edge', date: 'May 12', type: 'Product Update', agenda: 'Update partner agents on new villa expansion and booking procedures.' },
            { partner: 'Remote Lands', date: 'May 15', type: 'Co-marketing Plan', agenda: 'Review custom itinerary drafts and plan launch dates.' },
            { partner: 'Global Escapes', date: 'May 20', type: 'Performance Review', agenda: 'Review conversion rates and marketing spend efficiency.' },
          ].map((tp, idx) => (
            <div key={idx} className="p-3 border border-[#d4c4b7]/50 rounded-lg bg-white">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-[#4a3c31]">{tp.partner}</span>
                <span className="text-[9px] font-bold text-[#C8A050] bg-[#C8A050]/10 px-2 py-0.5 rounded">{tp.date}</span>
              </div>
              <div className="text-[10px] text-[#7d6b5e] font-semibold uppercase mb-1.5">{tp.type}</div>
              <p className="text-[10px] text-[#7d6b5e] leading-relaxed">{tp.agenda}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMomentsDrawer = () => (
    <div className="space-y-6">
      <div className="bg-[#f3eae1]/50 border border-[#d4c4b7] rounded-lg p-4">
        <h4 className="font-serif text-base text-[#4a3c31] mb-2">Memory Book Log</h4>
        <p className="text-[11px] text-[#7d6b5e] leading-relaxed">
          Historical record of shared moments, co-branded guest events, and agency workshops.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { img: privateDinnerImg, title: 'Private Dinner at SOSEI Alpine', date: 'Feb 12, 2026', desc: 'Hosted 12 top-performing Virtuoso agents for an exclusive fireside dinner.' },
          { img: wellnessRetreatImg, title: 'Wellness Retreat Experience', date: 'Mar 5, 2026', desc: 'A 3-day immersive nature walk and spa retreat with Serandipians.' },
          { img: productWorkshopImg, title: 'Product Workshop Session', date: 'Mar 26, 2026', desc: 'Coordinated agency workshop to discuss luxury hospitality trends.' },
          { img: sunsetCruiseImg, title: 'Sunset Cruise with Guests', date: 'Apr 18, 2024', desc: 'Enjoyable yacht cruise event co-sponsored with Travel Edge.' },
        ].map((item, idx) => (
          <div key={idx} className="border border-[#d4c4b7]/50 rounded-lg bg-white overflow-hidden flex flex-col">
            <div className="w-full aspect-[4/3] bg-[#3b2f2f]">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h6 className="font-bold text-[10px] text-[#4a3c31] leading-tight mb-1">{item.title}</h6>
                <p className="text-[9.5px] text-[#7d6b5e] leading-relaxed mb-2">{item.desc}</p>
              </div>
              <span className="text-[8px] text-[#7d6b5e] font-semibold">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActionsDrawer = () => (
    <div className="space-y-6">
      <div className="bg-[#f3eae1]/50 border border-[#d4c4b7] rounded-lg p-4">
        <h4 className="font-serif text-base text-[#4a3c31] mb-2">Operational Action Tracker</h4>
        <p className="text-[11px] text-[#7d6b5e] leading-relaxed">
          Immediate tasks to execute, prioritize, and monitor to optimize partner relations.
        </p>
      </div>

      <div className="space-y-4">
        <h5 className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider">Action Items</h5>
        <div className="space-y-3">
          {[
            { action: 'Reconnect with Serandipians', priority: 'High', due: 'May 6', task: 'Follow up on family wellness campaign proposal. Share draft brochures and pricing.' },
            { action: 'Follow up with Travel Edge', priority: 'High', due: 'May 8', task: 'Coordinate agency training dates. Share PMS integration guidelines.' },
            { action: 'Thank Virtuoso', priority: 'Medium', due: 'May 10', task: 'Send appreciation letters and custom local gifts to top booking agents.' },
            { action: 'Explore new initiative', priority: 'High', due: 'May 14', task: 'Reach out to local wellness partners to discuss Q3 retreat offerings.' },
          ].map((act, idx) => (
            <div key={idx} className="p-3 border border-[#d4c4b7]/50 rounded-lg bg-white">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-[#4a3c31]">{act.action}</span>
                <span className="text-[8.5px] font-bold text-[#7d6b5e]">Due {act.due}</span>
              </div>
              <div className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 inline-block mb-2">
                {act.priority} Priority
              </div>
              <p className="text-[10px] text-[#7d6b5e] leading-relaxed">{act.task}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getHeatmapColor = (level: 'level4' | 'level3' | 'level2' | 'level1') => {
    if (level === 'level4') return 'bg-[#d2a373]';
    if (level === 'level3') return 'bg-[#dfb587]';
    if (level === 'level2') return 'bg-[#eed5b3]';
    return 'bg-[#f6ebdc]';
  };

  const getHeatmapTooltip = (partnerName: string, destination: string, level: 'level4' | 'level3' | 'level2' | 'level1') => {
    const levelLabel = level === 'level4' ? 'High Volume' : level === 'level3' ? 'Medium-High' : level === 'level2' ? 'Medium' : 'Low Volume';
    return `${partnerName} - ${destination}: ${levelLabel}`;
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden overflow-y-auto custom-scrollbar px-4 lg:px-6 pb-8 text-[10px] relative">
      {/* Header Container */}
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 z-10 animate-card-enter">
        <div>
          <h1 className="text-4xl font-serif text-[#4a3c31] leading-tight mb-1">
            Relationship Intelligence
          </h1>
          <p className="text-[#7d6b5e] text-xs font-serif italic">
            Deep understanding. Stronger connections. Shared success.
          </p>
        </div>

        {/* Filters/Export Actions */}
        <div className="flex items-center gap-4">
          <DateRangeWidget
            startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}
            compStartDate={compStartDate} setCompStartDate={setCompStartDate} compEndDate={compEndDate} setCompEndDate={setCompEndDate}
            showComparison={false}
          />

          <button className="h-9 border border-[#d4c4b7] text-[#4a3c31] hover:bg-[#e5d8cb] rounded-[8px] text-[10px] px-4 font-semibold flex items-center gap-2 bg-[#f3eae1]/50 backdrop-blur-sm transition-all shadow-sm self-end mb-1">
            <AltArrowDown size={14} className="rotate-180 text-[#947b66]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-[40fr_30fr_30fr] gap-4 mb-4 z-10">

        {/* PARTNER PERFORMANCE Table */}
        <div
          onClick={() => openDrawer('Partner Performance', 'consortia & luxury travel agencies', renderPerformanceDrawer())}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm shadow-sm animate-card-enter cursor-pointer hover:border-[#947b66]/80 hover:shadow-md transition-all"
          style={{ animationDelay: '0.05s' }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-0">PARTNER PERFORMANCE</h3>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#d4c4b7]/70">
                    <th className="pb-2 text-[9px] font-bold uppercase tracking-wider text-[#7d6b5e] w-[28%]">PARTNER</th>
                    <th className="pb-2 text-[9px] font-bold uppercase tracking-wider text-[#7d6b5e] text-right">GUESTS</th>
                    <th className="pb-2 text-[9px] font-bold uppercase tracking-wider text-[#7d6b5e] text-right">ROOM NIGHTS</th>
                    <th className="pb-2 text-[9px] font-bold uppercase tracking-wider text-[#7d6b5e] text-right">Room Revenue (USD)</th>
                    <th className="pb-2 text-[9px] font-bold uppercase tracking-wider text-[#7d6b5e] text-right">ADR (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4c4b7]/40 text-[#4a3c31] text-[10px]">
                  {PARTNERS_DATA.map((partner) => {
                    const isSelected = selectedPartner.id === partner.id;
                    return (
                      <tr
                        key={partner.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPartner(partner);
                        }}
                        className={`cursor-pointer hover:bg-[#e5d8cb]/30 transition-colors ${isSelected ? 'bg-[#e5d8cb]/60 font-semibold' : ''}`}
                      >
                        <td className="py-2 font-medium">{partner.name}</td>
                        <td className="py-2 text-right">
                          <div>{partner.guests}</div>
                          <div className="text-[8px] text-emerald-700 font-semibold">{partner.guestsTrend}</div>
                        </td>
                        <td className="py-2 text-right">
                          <div>{partner.roomNights}</div>
                          <div className="text-[8px] text-emerald-700 font-semibold">{partner.roomNightsTrend}</div>
                        </td>
                        <td className="py-2 text-right">
                          <div>{partner.revenue}</div>
                          <div className="text-[8px] text-emerald-700 font-semibold">{partner.revenueTrend}</div>
                        </td>
                        <td className="py-2 text-right">
                          <div>{partner.adr}</div>
                          <div className="text-[8px] text-emerald-700 font-semibold">{partner.adrTrend}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <span className="text-[9px] text-[#947b66] hover:underline cursor-pointer mt-4 inline-block font-semibold">
            View all partners →
          </span>
        </div>

        {/* TOP DESTINATIONS BY PARTNER */}
        <div
          onClick={() => openDrawer('Top Destinations by Partner', 'performance heatmap analysis', renderDestinationsDrawer())}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm shadow-sm animate-card-enter cursor-pointer hover:border-[#947b66]/80 hover:shadow-md transition-all"
          style={{ animationDelay: '0.1s' }}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-0">TOP DESTINATIONS BY PARTNER</h3>
              <div className="flex items-center gap-1 text-[8px] text-[#7d6b5e] font-semibold">
                <span>High</span>
                <span className="w-4 h-3.5 rounded-[3px] bg-[#d2a373]"></span>
                <span className="w-4 h-3.5 rounded-[3px] bg-[#dfb587]"></span>
                <span className="w-4 h-3.5 rounded-[3px] bg-[#eed5b3]"></span>
                <span className="w-4 h-3.5 rounded-[3px] bg-[#f6ebdc]"></span>
                <span>Low</span>
              </div>
            </div>

            <div className="overflow-x-auto min-w-[240px] pt-2">
              <div className="grid grid-cols-[30fr_11fr_11fr_11fr_11fr_11fr_11fr] gap-y-3.5 items-center">
                {/* Header column labels */}
                <div className="text-[8px] font-bold text-[#7d6b5e] pb-2"></div>
                <div className="text-[7.5px] font-bold text-[#7d6b5e] text-center tracking-tight uppercase pb-2">ALPINE</div>
                <div className="text-[7.5px] font-bold text-[#7d6b5e] text-center tracking-tight uppercase pb-2">OCEAN</div>
                <div className="text-[7.5px] font-bold text-[#7d6b5e] text-center tracking-tight uppercase pb-2">FOREST</div>
                <div className="text-[7.5px] font-bold text-[#7d6b5e] text-center tracking-tight uppercase pb-2">DESERT</div>
                <div className="text-[7.5px] font-bold text-[#7d6b5e] text-center tracking-tight uppercase pb-2">CITY</div>
                <div className="text-[7.5px] font-bold text-[#7d6b5e] text-center tracking-tight uppercase pb-2">COUNTRYSIDE</div>

                {/* Rows */}
                {PARTNERS_DATA.map((partner) => {
                  const isFirst = partner.id === 'virtuoso';
                  return (
                    <React.Fragment key={partner.id}>
                      <div className={`text-[9px] font-semibold text-[#4a3c31] ${selectedPartner.id === partner.id ? 'text-[#C8A050]' : ''}`}>
                        {partner.name}
                      </div>

                      {/* Alpine */}
                      <div className="flex justify-center ml-1 relative group">
                        <span className={`w-11 h-6 rounded-[5px] transition-all cursor-pointer hover:scale-105 ${getHeatmapColor(partner.destinations.alpine)}`}></span>
                        <div className={`absolute ${isFirst ? 'top-full mt-1.5' : 'bottom-full mb-1.5'} hidden group-hover:flex flex-col items-center z-20 pointer-events-none`}>
                          {isFirst && <div className="w-1.5 h-1.5 bg-[#4a3c31] rotate-45 -mb-1 border-l border-t border-[#d4c4b7]/30 z-30"></div>}
                          <div className="bg-[#4a3c31] text-[#fdfaf7] text-[8.5px] font-semibold rounded-[4px] px-2 py-0.5 shadow-md whitespace-nowrap border border-[#d4c4b7]/30">
                            {getHeatmapTooltip(partner.name, 'Alpine', partner.destinations.alpine)}
                          </div>
                          {!isFirst && <div className="w-1.5 h-1.5 bg-[#4a3c31] rotate-45 -mt-1 border-r border-b border-[#d4c4b7]/30"></div>}
                        </div>
                      </div>

                      {/* Ocean */}
                      <div className="flex justify-center ml-1 relative group">
                        <span className={`w-11 h-6 rounded-[5px] transition-all cursor-pointer hover:scale-105 ${getHeatmapColor(partner.destinations.ocean)}`}></span>
                        <div className={`absolute ${isFirst ? 'top-full mt-1.5' : 'bottom-full mb-1.5'} hidden group-hover:flex flex-col items-center z-20 pointer-events-none`}>
                          {isFirst && <div className="w-1.5 h-1.5 bg-[#4a3c31] rotate-45 -mb-1 border-l border-t border-[#d4c4b7]/30 z-30"></div>}
                          <div className="bg-[#4a3c31] text-[#fdfaf7] text-[8.5px] font-semibold rounded-[4px] px-2 py-0.5 shadow-md whitespace-nowrap border border-[#d4c4b7]/30">
                            {getHeatmapTooltip(partner.name, 'Ocean', partner.destinations.ocean)}
                          </div>
                          {!isFirst && <div className="w-1.5 h-1.5 bg-[#4a3c31] rotate-45 -mt-1 border-r border-b border-[#d4c4b7]/30"></div>}
                        </div>
                      </div>

                      {/* Forest */}
                      <div className="flex justify-center ml-1 relative group">
                        <span className={`w-11 h-6 rounded-[5px] transition-all cursor-pointer hover:scale-105 ${getHeatmapColor(partner.destinations.forest)}`}></span>
                        <div className={`absolute ${isFirst ? 'top-full mt-1.5' : 'bottom-full mb-1.5'} hidden group-hover:flex flex-col items-center z-20 pointer-events-none`}>
                          {isFirst && <div className="w-1.5 h-1.5 bg-[#4a3c31] rotate-45 -mb-1 border-l border-t border-[#d4c4b7]/30 z-30"></div>}
                          <div className="bg-[#4a3c31] text-[#fdfaf7] text-[8.5px] font-semibold rounded-[4px] px-2 py-0.5 shadow-md whitespace-nowrap border border-[#d4c4b7]/30">
                            {getHeatmapTooltip(partner.name, 'Forest', partner.destinations.forest)}
                          </div>
                          {!isFirst && <div className="w-1.5 h-1.5 bg-[#4a3c31] rotate-45 -mt-1 border-r border-b border-[#d4c4b7]/30"></div>}
                        </div>
                      </div>

                      {/* Desert */}
                      <div className="flex justify-center ml-1 relative group">
                        <span className={`w-11 h-6 rounded-[5px] transition-all cursor-pointer hover:scale-105 ${getHeatmapColor(partner.destinations.desert)}`}></span>
                        <div className={`absolute ${isFirst ? 'top-full mt-1.5' : 'bottom-full mb-1.5'} hidden group-hover:flex flex-col items-center z-20 pointer-events-none`}>
                          {isFirst && <div className="w-1.5 h-1.5 bg-[#4a3c31] rotate-45 -mb-1 border-l border-t border-[#d4c4b7]/30 z-30"></div>}
                          <div className="bg-[#4a3c31] text-[#fdfaf7] text-[8.5px] font-semibold rounded-[4px] px-2 py-0.5 shadow-md whitespace-nowrap border border-[#d4c4b7]/30">
                            {getHeatmapTooltip(partner.name, 'Desert', partner.destinations.desert)}
                          </div>
                          {!isFirst && <div className="w-1.5 h-1.5 bg-[#4a3c31] rotate-45 -mt-1 border-r border-b border-[#d4c4b7]/30"></div>}
                        </div>
                      </div>

                      {/* City */}
                      <div className="flex justify-center ml-1 relative group">
                        <span className={`w-11 h-6 rounded-[5px] transition-all cursor-pointer hover:scale-105 ${getHeatmapColor(partner.destinations.city)}`}></span>
                        <div className={`absolute ${isFirst ? 'top-full mt-1.5' : 'bottom-full mb-1.5'} hidden group-hover:flex flex-col items-center z-20 pointer-events-none`}>
                          {isFirst && <div className="w-1.5 h-1.5 bg-[#4a3c31] rotate-45 -mb-1 border-l border-t border-[#d4c4b7]/30 z-30"></div>}
                          <div className="bg-[#4a3c31] text-[#fdfaf7] text-[8.5px] font-semibold rounded-[4px] px-2 py-0.5 shadow-md whitespace-nowrap border border-[#d4c4b7]/30">
                            {getHeatmapTooltip(partner.name, 'City', partner.destinations.city)}
                          </div>
                          {!isFirst && <div className="w-1.5 h-1.5 bg-[#4a3c31] rotate-45 -mt-1 border-r border-b border-[#d4c4b7]/30"></div>}
                        </div>
                      </div>

                      {/* Countryside */}
                      <div className="flex justify-center ml-1 relative group">
                        <span className={`w-11 h-6 rounded-[5px] transition-all cursor-pointer hover:scale-105 ${getHeatmapColor(partner.destinations.countryside)}`}></span>
                        <div className={`absolute ${isFirst ? 'top-full mt-1.5' : 'bottom-full mb-1.5'} hidden group-hover:flex flex-col items-center z-20 pointer-events-none`}>
                          {isFirst && <div className="w-1.5 h-1.5 bg-[#4a3c31] rotate-45 -mb-1 border-l border-t border-[#d4c4b7]/30 z-30"></div>}
                          <div className="bg-[#4a3c31] text-[#fdfaf7] text-[8.5px] font-semibold rounded-[4px] px-2 py-0.5 shadow-md whitespace-nowrap border border-[#d4c4b7]/30">
                            {getHeatmapTooltip(partner.name, 'Countryside', partner.destinations.countryside)}
                          </div>
                          {!isFirst && <div className="w-1.5 h-1.5 bg-[#4a3c31] rotate-45 -mt-1 border-r border-b border-[#d4c4b7]/30"></div>}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          <span className="text-[9px] text-[#947b66] hover:underline cursor-pointer mt-4 inline-block font-semibold">
            View destinations insights →
          </span>
        </div>

        {/* Selected Partner Details Widget */}
        <div
          onClick={() => openDrawer(selectedPartner.name + ' Profile', 'agency partner deep-dive', renderPartnerProfileDrawer())}
          className="border border-[#d4c4b7] rounded-[12px] p-5 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm shadow-sm animate-card-enter relative cursor-pointer hover:border-[#947b66]/80 hover:shadow-md transition-all"
          style={{ animationDelay: '0.15s' }}
        >
          <div>
            {/* Header Row */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-[#d4c4b7] flex items-center justify-center bg-[#fdfaf7]/40 shrink-0 text-[#7d6b5e]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="opacity-85">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
                    <path d="M12 6c-2.5 0-4.5 2-4.5 4.5S12 17 12 17s4.5-4 4.5-6.5S14.5 6 12 6z" />
                    <circle cx="12" cy="10.5" r="1.5" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-serif text-[#4a3c31] leading-tight mb-0.5">
                    {selectedPartner.name}
                  </h2>
                  <p className="text-[10px] text-[#7d6b5e] font-semibold tracking-wider uppercase">
                    {selectedPartner.type}
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded bg-[#947b66]/10 border border-[#947b66]/30 text-[#4a3c31] text-[8px] font-bold tracking-wider">
                {selectedPartner.tier}
              </span>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-4 gap-2 border-y border-[#d4c4b7]/50 py-3.5 mb-4">
              <div className="flex flex-col text-center">
                <span className="text-2xl font-serif text-[#4a3c31] leading-none mb-1.5">
                  {selectedPartner.guests}
                </span>
                <span className="text-[8.5px] text-[#7d6b5e] font-semibold uppercase tracking-wide">Guests</span>
                <span className="text-[8px] text-[#508a6b] font-semibold mt-1">{selectedPartner.guestsTrend}</span>
              </div>
              <div className="flex flex-col text-center border-l border-[#d4c4b7]/30">
                <span className="text-2xl font-serif text-[#4a3c31] leading-none mb-1.5">
                  {selectedPartner.avgNights}
                </span>
                <span className="text-[8.5px] text-[#7d6b5e] font-semibold uppercase tracking-wide">Avg. Nights</span>
                <span className="text-[8px] text-[#508a6b] font-semibold mt-1">{selectedPartner.avgNightsTrend}</span>
              </div>
              <div className="flex flex-col text-center border-l border-[#d4c4b7]/30">
                <span className="text-2xl font-serif text-[#4a3c31] leading-none mb-1.5">
                  {selectedPartner.repeatRatio}
                </span>
                <span className="text-[8.5px] text-[#7d6b5e] font-semibold uppercase tracking-wide">Repeat Ratio</span>
                <span className="text-[8px] text-[#508a6b] font-semibold mt-1">{selectedPartner.repeatRatioTrend}</span>
              </div>
              <div className="flex flex-col text-center border-l border-[#d4c4b7]/30">
                <span className="text-2xl font-serif text-[#4a3c31] leading-none mb-1.5">
                  {selectedPartner.revenue}
                </span>
                <span className="text-[8.5px] text-[#7d6b5e] font-semibold uppercase tracking-wide">Revenue</span>
                <span className="text-[8px] text-[#508a6b] font-semibold mt-1">{selectedPartner.revenueTrend}</span>
              </div>
            </div>

            {/* Top Strengths */}
            <div className="mb-4">
              <h4 className="text-[8.5px] font-bold text-[#7d6b5e] uppercase tracking-wider mb-2">TOP STRENGTHS</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedPartner.strengths.map((str, idx) => (
                  <span key={idx} className="px-3.5 py-1 rounded-full bg-white border border-[#d4c4b7] text-[#4a3c31] text-[9px] font-semibold shadow-sm">
                    {str}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <span className="text-[9px] text-[#947b66] hover:underline cursor-pointer mt-auto pt-2 inline-block font-semibold">
            View partner profile →
          </span>
        </div>

      </div>

      {/* Grid: Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[28fr_24fr_22fr_26fr] gap-4 mb-4 z-10">

        {/* PARTNER CONTRIBUTION MIX */}
        <div
          onClick={() => openDrawer('Partner Contribution Mix', 'revenue & share breakdown', renderContributionDrawer())}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 backdrop-blur-sm shadow-sm animate-card-enter cursor-pointer hover:border-[#947b66]/80 hover:shadow-md transition-all"
          style={{ animationDelay: '0.2s' }}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-0.5">PARTNER CONTRIBUTION MIX</h3>
          <p className="text-[9px] text-[#7d6b5e] mb-3">How partners contribute to our business.</p>

          <div className="flex items-center justify-between flex-1 gap-2">
            {/* Donut Chart */}
            <div className="relative w-[110px] h-[110px] shrink-0">
              <PieChart width={110} height={110}>
                <Pie
                  data={CONTRIBUTION_DATA}
                  cx={55}
                  cy={55}
                  innerRadius={36}
                  outerRadius={52}
                  dataKey="value"
                  strokeWidth={0}
                  isAnimationActive={false}
                >
                  {CONTRIBUTION_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  position={{ x: 112, y: 35 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#4a3c31] text-[#fdfaf7] text-[8.5px] font-semibold px-2 py-1 rounded shadow-md border border-[#d4c4b7]/30 pointer-events-none z-[999] whitespace-nowrap">
                          {payload[0].name}: {payload[0].value}%
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-sm font-bold font-serif text-[#4a3c31] leading-none mb-0.5">$18.7M</div>
                <div className="text-[7.5px] text-[#7d6b5e] font-semibold uppercase">Total Revenue</div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-1 text-[9px] pl-2 font-medium">
              {CONTRIBUTION_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-[#7d6b5e] truncate max-w-[75px]">{item.name}</span>
                  </div>
                  <span className="text-[#4a3c31] font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <span className="text-[9px] text-[#947b66] hover:underline cursor-pointer mt-4 inline-block font-semibold">
            View contribution breakdown →
          </span>
        </div>

        {/* CORPORATE ACCOUNTS */}
        <div
          onClick={() => openDrawer('Corporate Accounts', 'incentive travel & group retreats', renderCorporateAccountsDrawer())}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 backdrop-blur-sm shadow-sm animate-card-enter cursor-pointer hover:border-[#947b66]/80 hover:shadow-md transition-all"
          style={{ animationDelay: '0.25s' }}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-3">CORPORATE ACCOUNTS</h3>

          <div className="flex-1 flex flex-col gap-3">
            {/* Account 1 */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#e5d8cb] flex items-center justify-center shrink-0 border border-[#d4c4b7] text-[#947b66]">
                <UsersGroupTwoRounded size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-bold text-[#4a3c31] truncate leading-tight">Global Executive Retreats</h4>
                <p className="text-[9px] text-[#7d6b5e] italic leading-tight">Leadership retreats and incentive travel</p>
                <p className="text-[8px] text-[#7d6b5e]/70 leading-normal mb-1">Account since 2022</p>

                <div className="flex gap-4 text-center mt-1">
                  <div>
                    <div className="font-bold text-[10px]">12</div>
                    <div className="text-[7.5px] text-[#7d6b5e] uppercase font-semibold">Events YTD</div>
                  </div>
                  <div className="border-l border-[#d4c4b7]/30 pl-3">
                    <div className="font-bold text-[10px]">482</div>
                    <div className="text-[7.5px] text-[#7d6b5e] uppercase font-semibold">Room Nights</div>
                  </div>
                  <div className="border-l border-[#d4c4b7]/30 pl-3">
                    <div className="font-bold text-[10px]">$2.1M</div>
                    <div className="text-[7.5px] text-[#7d6b5e] uppercase font-semibold">Revenue</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account 2 */}
            <div className="flex items-start gap-2.5 border-t border-[#d4c4b7]/30 pt-3">
              <div className="w-8 h-8 rounded-full bg-[#e5d8cb] flex items-center justify-center shrink-0 border border-[#d4c4b7] text-[#947b66]">
                <Widget2 size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-bold text-[#4a3c31] truncate leading-tight">Wellness Collective Inc.</h4>
                <p className="text-[9px] text-[#7d6b5e] italic leading-tight">Wellness-focused group programs</p>
                <p className="text-[8px] text-[#7d6b5e]/70 leading-normal mb-1">Account since 2023</p>

                <div className="flex gap-4 text-center mt-1">
                  <div>
                    <div className="font-bold text-[10px]">8</div>
                    <div className="text-[7.5px] text-[#7d6b5e] uppercase font-semibold">Events YTD</div>
                  </div>
                  <div className="border-l border-[#d4c4b7]/30 pl-3">
                    <div className="font-bold text-[10px]">316</div>
                    <div className="text-[7.5px] text-[#7d6b5e] uppercase font-semibold">Room Nights</div>
                  </div>
                  <div className="border-l border-[#d4c4b7]/30 pl-3">
                    <div className="font-bold text-[10px]">$1.4M</div>
                    <div className="text-[7.5px] text-[#7d6b5e] uppercase font-semibold">Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <span className="text-[9px] text-[#947b66] hover:underline cursor-pointer mt-4 inline-block font-semibold">
            View corporate accounts →
          </span>
        </div>

        {/* KEY RELATIONSHIP INSIGHTS */}
        <div
          onClick={() => openDrawer('Key Relationship Insights', 'ai-generated intelligence reports', renderInsightsDrawer())}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 backdrop-blur-sm shadow-sm animate-card-enter cursor-pointer hover:border-[#947b66]/80 hover:shadow-md transition-all"
          style={{ animationDelay: '0.3s' }}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-3">KEY RELATIONSHIP INSIGHTS</h3>

          <div className="flex-1 flex flex-col gap-3.5 justify-center">
            <div className="flex gap-2.5 items-start">
              <UsersGroupTwoRounded size={16} className="text-[#947b66] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-bold text-[#4a3c31] leading-tight">High Engagement, Strong Potential</h4>
                <p className="text-[9px] text-[#7d6b5e] leading-snug">
                  Partners in this engagement show 18% higher revenue growth and stronger loyalty.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <Heart size={16} className="text-[#947b66] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-bold text-[#4a3c31] leading-tight">Wellness is a Shared Strength</h4>
                <p className="text-[9px] text-[#7d6b5e] leading-snug">
                  68% of our top partners co-create wellness-focused experiences.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <Globus size={16} className="text-[#947b66] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-bold text-[#4a3c31] leading-tight">Global Reach, Local Impact</h4>
                <p className="text-[9px] text-[#7d6b5e] leading-snug">
                  Our partners help us deliver localized experiences in key markets.
                </p>
              </div>
            </div>
          </div>

          <span className="text-[9px] text-[#947b66] hover:underline cursor-pointer mt-4 inline-block font-semibold">
            View all insights →
          </span>
        </div>

        {/* GROWTH OPPORTUNITIES */}
        <div
          onClick={() => openDrawer('Growth Opportunities', 'partnership roadmaps & expansion', renderOpportunitiesDrawer())}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 backdrop-blur-sm shadow-sm animate-card-enter cursor-pointer hover:border-[#947b66]/80 hover:shadow-md transition-all"
          style={{ animationDelay: '0.35s' }}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-0.5">GROWTH OPPORTUNITIES</h3>
          <p className="text-[8.5px] text-[#7d6b5e] mb-3">AI-identified opportunities to strengthen partnerships.</p>

          <div className="flex-1 flex flex-col gap-2.5 justify-center">
            {/* Op 1 */}
            <div className="flex items-center justify-between gap-1.5 border-b border-[#d4c4b7]/20 pb-2">
              <div className="min-w-0">
                <h4 className="text-[9.5px] font-bold text-[#4a3c31] leading-tight truncate">Expand Alpine portfolio with Virtuoso</h4>
                <p className="text-[8.5px] text-[#7d6b5e] truncate leading-tight">High demand for winter wellness experiences.</p>
              </div>
              <span className="shrink-0 px-1.5 py-0.5 text-[7px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-200">
                High Impact
              </span>
            </div>

            {/* Op 2 */}
            <div className="flex items-center justify-between gap-1.5 border-b border-[#d4c4b7]/20 pb-2">
              <div className="min-w-0">
                <h4 className="text-[9.5px] font-bold text-[#4a3c31] leading-tight truncate">Co-brand summer campaign with Serandipians</h4>
                <p className="text-[8.5px] text-[#7d6b5e] truncate leading-tight">Strong alignment with family travel segment.</p>
              </div>
              <span className="shrink-0 px-1.5 py-0.5 text-[7px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-200">
                High Impact
              </span>
            </div>

            {/* Op 3 */}
            <div className="flex items-center justify-between gap-1.5 border-b border-[#d4c4b7]/20 pb-2">
              <div className="min-w-0">
                <h4 className="text-[9.5px] font-bold text-[#4a3c31] leading-tight truncate">Develop exclusive itineraries with Remote Lands</h4>
                <p className="text-[8.5px] text-[#7d6b5e] truncate leading-tight">Opportunity for off-the-beaten-path experiences.</p>
              </div>
              <span className="shrink-0 px-1.5 py-0.5 text-[7px] font-bold text-amber-800 bg-amber-50 rounded border border-amber-200">
                Medium Impact
              </span>
            </div>

            {/* Op 4 */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="min-w-0">
                <h4 className="text-[9.5px] font-bold text-[#4a3c31] leading-tight truncate">Develop sweet getaway with Global Escapes</h4>
                <p className="text-[8.5px] text-[#7d6b5e] truncate leading-tight">Uprising demand for summer escape plan.</p>
              </div>
              <span className="shrink-0 px-1.5 py-0.5 text-[7px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-200">
                High Impact
              </span>
            </div>
          </div>

          <span className="text-[9px] text-[#947b66] hover:underline cursor-pointer mt-4 inline-block font-semibold">
            View all opportunities →
          </span>
        </div>

      </div>

      {/* Grid: Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-[25fr_50fr_25fr] gap-4 z-10">

        {/* UPCOMING TOUCHPOINTS */}
        <div
          onClick={() => openDrawer('Upcoming Touchpoints', 'strategy calls & reviews schedule', renderTouchpointsDrawer())}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 backdrop-blur-sm shadow-sm animate-card-enter cursor-pointer hover:border-[#947b66]/80 hover:shadow-md transition-all"
          style={{ animationDelay: '0.4s' }}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-3">UPCOMING TOUCHPOINTS</h3>

          <div className="flex-1 flex flex-col gap-2 justify-center">
            <div className="flex items-center justify-between border-b border-[#d4c4b7]/20 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#4d6961]/20 flex items-center justify-center text-[#4d6961] shrink-0">
                  <HandShake size={12} />
                </div>
                <div>
                  <h4 className="text-[9.5px] font-bold text-[#4a3c31]">Virtuoso</h4>
                  <p className="text-[8.5px] text-[#7d6b5e]">Quarterly Review</p>
                </div>
              </div>
              <span className="text-[9px] text-[#4a3c31] font-semibold">May 6</span>
            </div>

            <div className="flex items-center justify-between border-b border-[#d4c4b7]/20 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#C8A050]/20 flex items-center justify-center text-[#C8A050] shrink-0">
                  <HandShake size={12} />
                </div>
                <div>
                  <h4 className="text-[9.5px] font-bold text-[#4a3c31]">Serandipians</h4>
                  <p className="text-[8.5px] text-[#7d6b5e]">Strategy Call</p>
                </div>
              </div>
              <span className="text-[9px] text-[#4a3c31] font-semibold">May 9</span>
            </div>

            <div className="flex items-center justify-between border-b border-[#d4c4b7]/20 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#C3A481]/20 flex items-center justify-center text-[#C3A481] shrink-0">
                  <HandShake size={12} />
                </div>
                <div>
                  <h4 className="text-[9.5px] font-bold text-[#4a3c31]">Travel Edge</h4>
                  <p className="text-[8.5px] text-[#7d6b5e]">Product Update</p>
                </div>
              </div>
              <span className="text-[9px] text-[#4a3c31] font-semibold">May 12</span>
            </div>

            <div className="flex items-center justify-between border-b border-[#d4c4b7]/20 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#947b66]/20 flex items-center justify-center text-[#947b66] shrink-0">
                  <HandShake size={12} />
                </div>
                <div>
                  <h4 className="text-[9.5px] font-bold text-[#4a3c31]">Remote Lands</h4>
                  <p className="text-[8.5px] text-[#7d6b5e]">Co-marketing Plan</p>
                </div>
              </div>
              <span className="text-[9px] text-[#4a3c31] font-semibold">May 15</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#668094]/20 flex items-center justify-center text-[#668094] shrink-0">
                  <HandShake size={12} />
                </div>
                <div>
                  <h4 className="text-[9.5px] font-bold text-[#4a3c31]">Global Escapes</h4>
                  <p className="text-[8.5px] text-[#7d6b5e]">Performance Review</p>
                </div>
              </div>
              <span className="text-[9px] text-[#4a3c31] font-semibold">May 20</span>
            </div>
          </div>

          <span className="text-[9px] text-[#947b66] hover:underline cursor-pointer mt-4 inline-block font-semibold">
            View all →
          </span>
        </div>

        {/* SHARED MOMENTS THAT MATTER */}
        <div
          onClick={() => openDrawer('Shared Moments That Matter', 'event history log & gallery', renderMomentsDrawer())}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 backdrop-blur-sm shadow-sm animate-card-enter cursor-pointer hover:border-[#947b66]/80 hover:shadow-md transition-all"
          style={{ animationDelay: '0.45s' }}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-3">SHARED MOMENTS THAT MATTER</h3>

          <div className="flex-1 grid grid-cols-4 gap-4 pb-2">
            {/* Moment 1 */}
            <div className="flex flex-col w-full">
              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#d4c4b7] mb-2 bg-[#3b2f2f]">
                <img src={privateDinnerImg} alt="Private Dinner" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-[9px] font-bold text-[#4a3c31] leading-tight">Private Dinner at SOSEI Alpine</h4>
              <span className="text-[7.5px] text-[#7d6b5e]">Feb 12, 2026</span>
            </div>

            {/* Moment 2 */}
            <div className="flex flex-col w-full">
              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#d4c4b7] mb-2 bg-[#3b2f2f]">
                <img src={wellnessRetreatImg} alt="Wellness Retreat" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-[9px] font-bold text-[#4a3c31] leading-tight">Wellness Retreat Experience</h4>
              <span className="text-[7.5px] text-[#7d6b5e]">Mar 5, 2026</span>
            </div>

            {/* Moment 3 */}
            <div className="flex flex-col w-full">
              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#d4c4b7] mb-2 bg-[#3b2f2f]">
                <img src={productWorkshopImg} alt="Product Workshop" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-[9px] font-bold text-[#4a3c31] leading-tight">Product Workshop Session</h4>
              <span className="text-[7.5px] text-[#7d6b5e]">Mar 26, 2026</span>
            </div>

            {/* Moment 4 */}
            <div className="flex flex-col w-full">
              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#d4c4b7] mb-2 bg-[#3b2f2f]">
                <img src={sunsetCruiseImg} alt="Sunset Cruise" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-[9px] font-bold text-[#4a3c31] leading-tight">Sunset Cruise with Guests</h4>
              <span className="text-[7.5px] text-[#7d6b5e]">Apr 18, 2024</span>
            </div>
          </div>

          <span className="text-[9px] text-[#947b66] hover:underline cursor-pointer mt-4 inline-block font-semibold">
            View all memories →
          </span>
        </div>

        {/* NEXT BEST ACTIONS */}
        <div
          onClick={() => openDrawer('Next Best Actions', 'relationship task checklist', renderActionsDrawer())}
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 backdrop-blur-sm shadow-sm animate-card-enter cursor-pointer hover:border-[#947b66]/80 hover:shadow-md transition-all"
          style={{ animationDelay: '0.5s' }}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-3">NEXT BEST ACTIONS</h3>

          <div className="flex-1 flex flex-col gap-2.5 justify-center">
            {/* Action 1 */}
            <div className="flex items-start justify-between gap-1 border-b border-[#d4c4b7]/25 pb-2">
              <div className="flex gap-2 items-start min-w-0">
                <UsersGroupTwoRounded size={14} className="text-[#947b66] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="text-[9.5px] font-bold text-[#4a3c31] leading-tight truncate">Reconnect with Serandipians</h4>
                  <p className="text-[8.5px] text-[#7d6b5e] truncate leading-tight">Share new summer campaign proposal.</p>
                </div>
              </div>
              <span className="text-[8.5px] font-semibold text-[#7d6b5e] shrink-0">May 6</span>
            </div>

            {/* Action 2 */}
            <div className="flex items-start justify-between gap-1 border-b border-[#d4c4b7]/25 pb-2">
              <div className="flex gap-2 items-start min-w-0">
                <Calendar size={14} className="text-[#947b66] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="text-[9.5px] font-bold text-[#4a3c31] leading-tight truncate">Follow up with Travel Edge</h4>
                  <p className="text-[8.5px] text-[#7d6b5e] truncate leading-tight">Align on upcoming product enhancements.</p>
                </div>
              </div>
              <span className="text-[8.5px] font-semibold text-[#7d6b5e] shrink-0">May 8</span>
            </div>

            {/* Action 3 */}
            <div className="flex items-start justify-between gap-1 border-b border-[#d4c4b7]/25 pb-2">
              <div className="flex gap-2 items-start min-w-0">
                <Checklist size={14} className="text-[#947b66] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="text-[9.5px] font-bold text-[#4a3c31] leading-tight truncate">Thank Virtuoso</h4>
                  <p className="text-[8.5px] text-[#7d6b5e] truncate leading-tight">Send appreciation for Q1 collaboration.</p>
                </div>
              </div>
              <span className="text-[8.5px] font-semibold text-[#7d6b5e] shrink-0">May 10</span>
            </div>

            {/* Action 4 */}
            <div className="flex items-start justify-between gap-1">
              <div className="flex gap-2 items-start min-w-0">
                <SparklesIcon size={14} className="text-[#947b66] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="text-[9.5px] font-bold text-[#4a3c31] leading-tight truncate">Explore new initiative</h4>
                  <p className="text-[8.5px] text-[#7d6b5e] truncate leading-tight">Wellness co-creation opportunity for Q3.</p>
                </div>
              </div>
              <span className="text-[8.5px] font-semibold text-[#7d6b5e] shrink-0">May 14</span>
            </div>
          </div>

          <span className="text-[9px] text-[#947b66] hover:underline cursor-pointer mt-4 inline-block font-semibold">
            View all →
          </span>
        </div>

      </div>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#fdfaf7] border-l border-[#d4c4b7] shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {drawerContent && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-[#d4c4b7] flex justify-between items-start bg-[#f3eae1]/50">
              <div>
                <h3 className="text-xl font-serif text-[#4a3c31] mb-1">{drawerContent.title}</h3>
                <p className="text-[10px] text-[#7d6b5e] uppercase tracking-wider font-semibold">{drawerContent.description}</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full border border-[#d4c4b7] flex items-center justify-center text-[#4a3c31] hover:bg-[#e5d8cb] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-[#4a3c31]">
              {drawerContent.children}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
