import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  UsersGroupTwoRounded,
} from '@solar-icons/react';
import { useToast } from '../../../components/ui/toast';

interface LeadDetail {
  id: string;
  leadName: string;
  leadStatus: string;
  totalValue: string;
  currency: string;
  expectedClose: string;
  owner: string;
  createdAt: string;
  source: string;
  sourceDetails: string;
  crsNo: string;
  leadScore: string;
  confidenceLevel: string;
  qualified: string;
  conversionProbability: string;
}

const initialLeads: Record<string, LeadDetail> = {
  'LD-001': {
    id: 'LD-001',
    leadName: 'Grand Hyatt Corporate Retreat',
    leadStatus: 'Proposal Sent',
    totalValue: '$45,000',
    currency: 'USD',
    expectedClose: 'Jul 15, 2026',
    owner: 'Sarah Jenkins',
    createdAt: 'Jun 10, 2026',
    source: 'Corporate',
    sourceDetails: 'TechCorp Annual Request',
    crsNo: 'CRS-90812',
    leadScore: '85/100',
    confidenceLevel: 'High',
    qualified: 'Yes',
    conversionProbability: '80%',
  },
  'LD-002': {
    id: 'LD-002',
    leadName: 'Smith Family Reunion Block',
    leadStatus: 'Negotiation',
    totalValue: '$12,500',
    currency: 'USD',
    expectedClose: 'Aug 01, 2026',
    owner: 'David Miller',
    createdAt: 'Jun 12, 2026',
    source: 'Direct',
    sourceDetails: 'Website Query Form',
    crsNo: 'CRS-90815',
    leadScore: '72/100',
    confidenceLevel: 'Medium',
    qualified: 'Yes',
    conversionProbability: '60%',
  }
};

export function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  useToast();

  const lead = (id && initialLeads[id]) || initialLeads['LD-001'];
  const [activeTab, setActiveTab] = useState<'details' | 'activities' | 'contacts'>('details');

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 animate-card-enter">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-wide">{lead.leadName}</h2>
            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {lead.leadStatus}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-zinc-500 text-[10px]">
            <span className="font-semibold text-zinc-900">Lead Score: {lead.leadScore}</span>
            <span className="mx-0.5">•</span>
            <span>Created {lead.createdAt}</span>
            <span className="mx-0.5">•</span>
            <span className="font-mono text-zinc-400">{lead.id}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard/reservations/leads')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-xs font-normal pb-0.5 cursor-pointer"
        >
          <span>&larr;</span> Back to Leads
        </button>
      </div>

      {/* Grid Layout */}
      <div className="flex flex-col gap-6 text-[10px]">

        {/* ROW 1: Lead Information (4 cols) + Financial Overview (4 cols) + Source & Qualification (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-card-enter -mx-3" style={{ animationDelay: '0.1s' }}>
          
          {/* Lead Information (col-span-4) */}
          <div className="col-span-1 lg:col-span-4 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Lead Details</h3>
            </div>

            <div className="flex flex-col gap-2 flex-1 justify-between py-1">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Owner</span>
                <span className="text-zinc-900 font-medium text-[10px]">{lead.owner}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">CRS Reference</span>
                <span className="text-zinc-900 font-mono text-[10px]">{lead.crsNo}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Expected Close</span>
                <span className="text-zinc-900 font-medium text-[10px]">{lead.expectedClose}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Confidence</span>
                <span className="text-emerald-700 font-bold text-[10px]">{lead.confidenceLevel}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Probability</span>
                <span className="text-zinc-900 font-bold text-[10px]">{lead.conversionProbability}</span>
              </div>
            </div>
          </div>

          {/* Financial Overview (col-span-4) */}
          <div className="col-span-1 lg:col-span-4 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Pipeline Value</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center flex-1 py-1 items-center border-y border-zinc-100">
              <div className="flex flex-col">
                <span className="text-[22px] font-normal text-zinc-900 leading-none mb-1">{lead.totalValue}</span>
                <span className="text-[9px] text-zinc-500 font-medium">Estimated Value</span>
              </div>
              <div className="flex flex-col border-l border-zinc-100 pl-2">
                <span className="text-[22px] font-normal text-emerald-700 leading-none mb-1">{lead.conversionProbability}</span>
                <span className="text-[9px] text-zinc-500 font-medium">Win Probability</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] pt-2">
              <span className="text-zinc-500 font-medium">Currency</span>
              <span className="text-zinc-900 font-bold">{lead.currency}</span>
            </div>
          </div>

          {/* Source & Qualification (col-span-4) */}
          <div className="col-span-1 lg:col-span-4 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Source & Intake</h3>
            </div>

            <div className="flex flex-col gap-2 flex-1 justify-between py-1">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Source Channel</span>
                <span className="text-zinc-900 font-semibold text-[10px]">{lead.source}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Source Notes</span>
                <span className="text-zinc-900 font-medium text-[10px]">{lead.sourceDetails}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Qualified Lead</span>
                <span className="text-emerald-700 font-bold text-[10px]">{lead.qualified}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Intake Date</span>
                <span className="text-zinc-900 font-medium text-[10px]">{lead.createdAt}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 2: Activity & Engagement Tabs (col-12) */}
        <div className="rounded-[12px] bg-white/70 backdrop-blur-xs border border-zinc-200/80 p-4 shadow-xs flex flex-col animate-card-enter -mx-3" style={{ animationDelay: '0.2s' }}>
          {/* Tab Selector */}
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3 mb-4">
            <div className="flex gap-2">
              {[
                { key: 'details', label: 'Opportunity Overview' },
                { key: 'activities', label: 'Recent Engagement (3)' },
                { key: 'contacts', label: 'Key Stakeholders (2)' },
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
          </div>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="flex flex-col gap-3 py-2 text-xs text-zinc-700">
              <p className="leading-relaxed font-normal">
                Corporate group inquiry for 40 luxury rooms across 4 nights. Requirements include private dining buyouts, executive wellness sessions, and yacht transfers.
              </p>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 mt-2">
                <span className="font-semibold text-zinc-900 block mb-1">Next Action Required:</span>
                <span className="text-zinc-600">
                  Follow up with executive committee to review finalized banquet and meeting room proposal.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-3 py-2">
              {[
                { action: 'Proposal Sent', desc: 'Sent customized banquet proposal with 15% corporate rate.', date: 'Jun 14, 2026', user: 'Sarah Jenkins' },
                { action: 'Site Visit Completed', desc: 'Hosted lead event coordinator for on-site villa tour.', date: 'Jun 12, 2026', user: 'David Miller' },
                { action: 'Inquiry Created', desc: 'Captured inbound RFP from website enterprise portal.', date: 'Jun 10, 2026', user: 'System' },
              ].map((act, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-zinc-100 bg-zinc-50/50 flex justify-between items-start">
                  <div>
                    <span className="font-bold text-xs text-zinc-900">{act.action}</span>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{act.desc}</p>
                    <span className="text-[9px] text-zinc-400 font-medium">Logged by {act.user}</span>
                  </div>
                  <span className="text-[9.5px] text-zinc-500 font-medium">{act.date}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
              {[
                { name: 'Marcus Vance', role: 'VP Corporate Relations', email: 'm.vance@techcorp.com', phone: '+1 (415) 555-8910' },
                { name: 'Elena Rostova', role: 'Executive Event Planner', email: 'e.rostova@techcorp.com', phone: '+1 (415) 555-8912' },
              ].map((contact, idx) => (
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
