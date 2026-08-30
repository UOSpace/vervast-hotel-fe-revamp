import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Magnifer,
  UsersGroupTwoRounded,
} from '@solar-icons/react';
import { useToast } from '../../../components/ui/toast';
import { Input } from '../../../components/ui/input';

interface Lead {
  id: string;
  name: string;
  stage: string;
  value: string;
  created: string;
  ref: string;
}

interface Booking {
  id: string;
  name: string;
  stage: string;
  value: string;
  created: string;
  ref: string;
}

interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface CorporatePartner {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  source: string;
  owner: string;
  taxId: string;
  contractStart: string;
  discountLevel: string;
  domain: string;
  type: string;
  parentCompany: string;
  website: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  description: string;
  paymentTerms: string;
  currency: string;
  preferredPayment: string;
  companySize: string;
  leads: Lead[];
  bookings: Booking[];
  contacts: Contact[];
}

const mockCorporatesList: CorporatePartner[] = [
  {
    id: 'CP-001',
    name: 'Vantage Capital Group',
    email: 'partnerships@vantagecg.com',
    phone: '+1 212 555 0142',
    category: 'Financial Services',
    source: 'Email Marketing',
    owner: 'Sarah Jenkins',
    taxId: 'TX-990-210',
    contractStart: 'Jan 15, 2024',
    discountLevel: 'Gold Rate (15% off)',
    domain: 'vantagecg.com',
    type: 'Enterprise',
    parentCompany: 'Ryanuno Company',
    website: 'https://vantagecg.com',
    address: '55 Broad Street, 24th Floor',
    city: 'New York',
    zipCode: '10004',
    country: 'United States',
    description: 'Leading private equity firm focusing on technology and hospitality sector investments globally.',
    paymentTerms: 'Net 30',
    currency: 'USD',
    preferredPayment: 'Corporate Credit Card',
    companySize: '500-1000 employees',
    leads: [
      { id: 'LD-7721', name: 'Luxury Executive Retreat', stage: 'Proposal Sent', value: '$12,500', created: 'Jun 10, 2026', ref: 'REF-7721' },
      { id: 'LD-4812', name: 'Annual Board Meeting Stay', stage: 'Negotiation', value: '$8,200', created: 'Jun 15, 2026', ref: 'REF-4812' }
    ],
    bookings: [
      { id: 'BK-9912', name: 'Vantage Q2 Partners Summit', stage: 'Confirmed', value: '$24,800', created: 'May 12, 2026', ref: 'REF-9912' },
      { id: 'BK-1891', name: 'Private Yacht Charter VIP Dinner', stage: 'Confirmed', value: '$15,000', created: 'Jun 20, 2026', ref: 'REF-1891' }
    ],
    contacts: [
      { name: 'Ryan Uno', role: 'General Manager', email: 'ryanunoyop2@yopmail.com', phone: '+1 212 555 0143' },
      { name: 'Sarah Miller', role: 'Executive Assistant', email: 's.miller@vantagecg.com', phone: '+1 212 555 0145' }
    ]
  },
  {
    id: 'CP-002',
    name: 'Meridian Global Solutions',
    email: 'travel@meridianglobal.net',
    phone: '+44 20 7946 0831',
    category: 'Consulting',
    source: 'Referral',
    owner: 'Alpha',
    taxId: 'TX-724-118',
    contractStart: 'Mar 10, 2025',
    discountLevel: 'Standard Corporate (10% off)',
    domain: 'meridianglobal.net',
    type: 'Enterprise',
    parentCompany: 'None',
    website: 'https://meridianglobal.net',
    address: '10 Lower Thames St',
    city: 'London',
    zipCode: 'EC3R 6EN',
    country: 'United Kingdom',
    description: 'International management consulting practice specialized in enterprise digital transformations.',
    paymentTerms: 'Net 15',
    currency: 'GBP',
    preferredPayment: 'Bank Transfer',
    companySize: '1000+ employees',
    leads: [
      { id: 'LD-1021', name: 'Leadership Strategy Offsite', stage: 'Prospecting', value: '$18,000', created: 'Jun 01, 2026', ref: 'REF-1021' }
    ],
    bookings: [
      { id: 'BK-3301', name: 'Executive Team Alpine Retreat', stage: 'Confirmed', value: '$32,000', created: 'May 04, 2026', ref: 'REF-3301' }
    ],
    contacts: [
      { name: 'Emily Watson', role: 'Director of Procurement', email: 'e.watson@meridianglobal.net', phone: '+44 20 7946 0839' }
    ]
  }
];

export function CorporateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  useToast();

  const partner = mockCorporatesList.find(c => c.id === id) || mockCorporatesList[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'bookings' | 'contacts'>('overview');
  const [leadQuery, setLeadQuery] = useState('');

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 animate-card-enter">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-wide">{partner.name}</h2>
            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
              {partner.category}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-zinc-500 text-[10px]">
            <span className="font-semibold text-zinc-900">{partner.type} Account</span>
            <span className="mx-0.5">•</span>
            <span>Contract since {partner.contractStart}</span>
            <span className="mx-0.5">•</span>
            <span className="font-mono text-zinc-400">{partner.id}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard/partners/corporate')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-xs font-normal pb-0.5 cursor-pointer"
        >
          <span>&larr;</span> Back to Corporate Accounts
        </button>
      </div>

      {/* Grid Layout - 3 Structured Rows */}
      <div className="flex flex-col gap-6 text-[10px]">

        {/* ROW 1: Company Profile (4 cols) + Account Overview (4 cols) + Contract & Terms (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-card-enter -mx-3" style={{ animationDelay: '0.1s' }}>
          
          {/* Company Profile (col-span-4) */}
          <div className="col-span-1 lg:col-span-4 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Company Profile</h3>
            </div>

            <div className="flex flex-col gap-2 flex-1 justify-between py-1">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Website</span>
                <span className="text-zinc-900 font-medium text-[10px]">{partner.website}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Email</span>
                <span className="text-zinc-900 font-medium text-[10px]">{partner.email}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Phone</span>
                <span className="text-zinc-900 font-medium text-[10px]">{partner.phone}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Headquarters</span>
                <span className="text-zinc-900 font-medium text-[10px]">{partner.city}, {partner.country}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Company Size</span>
                <span className="text-zinc-900 font-medium text-[10px]">{partner.companySize}</span>
              </div>
            </div>
          </div>

          {/* Account Overview (col-span-4) */}
          <div className="col-span-1 lg:col-span-4 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Account Overview</h3>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center flex-1 py-1 items-center border-y border-zinc-100">
              <div className="flex flex-col">
                <span className="text-[22px] font-normal text-zinc-900 leading-none mb-1">{partner.bookings.length}</span>
                <span className="text-[9px] text-zinc-500 font-medium">Bookings YTD</span>
              </div>
              <div className="flex flex-col border-l border-zinc-100 pl-2">
                <span className="text-[22px] font-normal text-zinc-900 leading-none mb-1">{partner.leads.length}</span>
                <span className="text-[9px] text-zinc-500 font-medium">Active Leads</span>
              </div>
              <div className="flex flex-col border-l border-zinc-100 pl-2">
                <span className="text-[22px] font-normal text-zinc-900 leading-none mb-1">$39.8K</span>
                <span className="text-[9px] text-zinc-500 font-medium">Total Revenue</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] pt-2">
              <span className="text-zinc-500 font-medium">Account Owner</span>
              <span className="text-zinc-900 font-bold">{partner.owner}</span>
            </div>
          </div>

          {/* Contract & Terms (col-span-4) */}
          <div className="col-span-1 lg:col-span-4 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Contract & Terms</h3>
            </div>

            <div className="flex flex-col gap-2 flex-1 justify-between py-1">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Discount Tier</span>
                <span className="text-zinc-900 font-semibold text-[10px]">{partner.discountLevel}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Payment Terms</span>
                <span className="text-zinc-900 font-medium text-[10px]">{partner.paymentTerms}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Currency</span>
                <span className="text-zinc-900 font-medium text-[10px]">{partner.currency}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Tax ID</span>
                <span className="text-zinc-900 font-mono text-[10px]">{partner.taxId}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Preferred Method</span>
                <span className="text-zinc-900 font-medium text-[10px]">{partner.preferredPayment}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 2: Activity Breakdown Tabs (col-12) */}
        <div className="rounded-[12px] bg-white/70 backdrop-blur-xs border border-zinc-200/80 p-4 shadow-xs flex flex-col animate-card-enter -mx-3" style={{ animationDelay: '0.2s' }}>
          {/* Tab Selector */}
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3 mb-4">
            <div className="flex gap-2">
              {[
                { key: 'overview', label: 'Summary Notes' },
                { key: 'leads', label: `Leads (${partner.leads.length})` },
                { key: 'bookings', label: `Bookings (${partner.bookings.length})` },
                { key: 'contacts', label: `Key Contacts (${partner.contacts.length})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {(activeTab === 'leads' || activeTab === 'bookings') && (
              <div className="relative w-64">
                <Magnifer size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <Input
                  placeholder="Search entries…"
                  className="pl-8.5 h-8 bg-white border-zinc-200 text-xs rounded-lg text-zinc-900"
                  value={leadQuery}
                  onChange={e => setLeadQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Tab Body */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-3 py-2 text-xs text-zinc-700">
              <p className="leading-relaxed font-normal">{partner.description}</p>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 mt-2">
                <span className="font-semibold text-zinc-900 block mb-1">Account Executive Relationship Strategy:</span>
                <span className="text-zinc-600">
                  Focus on expanding Q3 board retreats and offering curated culinary experiences with private chef buyouts.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 font-medium text-[9.5px]">
                    <th className="py-2.5">Lead ID</th>
                    <th className="py-2.5">Opportunity Name</th>
                    <th className="py-2.5">Stage</th>
                    <th className="py-2.5">Created Date</th>
                    <th className="py-2.5 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800 text-xs">
                  {partner.leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-zinc-50/80">
                      <td className="py-3 font-mono text-[10.5px] text-zinc-500">{lead.id}</td>
                      <td className="py-3 font-medium text-zinc-900">{lead.name}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          {lead.stage}
                        </span>
                      </td>
                      <td className="py-3 text-zinc-500 text-[10px]">{lead.created}</td>
                      <td className="py-3 text-right font-medium text-zinc-900">{lead.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 font-medium text-[9.5px]">
                    <th className="py-2.5">Booking ID</th>
                    <th className="py-2.5">Event / Stay Title</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">Confirmed Date</th>
                    <th className="py-2.5 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800 text-xs">
                  {partner.bookings.map(bk => (
                    <tr key={bk.id} className="hover:bg-zinc-50/80">
                      <td className="py-3 font-mono text-[10.5px] text-zinc-500">{bk.id}</td>
                      <td className="py-3 font-medium text-zinc-900">{bk.name}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {bk.stage}
                        </span>
                      </td>
                      <td className="py-3 text-zinc-500 text-[10px]">{bk.created}</td>
                      <td className="py-3 text-right font-medium text-zinc-900">{bk.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
              {partner.contacts.map((contact, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-200/80 flex items-center justify-center text-zinc-600 font-bold text-xs">
                      <UsersGroupTwoRounded size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900 text-xs">{contact.name}</div>
                      <div className="text-[10px] text-zinc-500">{contact.role}</div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-zinc-600">
                    <div>{contact.email}</div>
                    <div className="text-zinc-400 mt-0.5">{contact.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
