import { useState } from 'react';
import { Magnifer, Filter, AddSquare, TrashBinTrash, Letter } from '@solar-icons/react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

interface EmailCampaign {
  id: string;
  title: string;
  owner: string;
  type: string;
  startDate: string;
  startTime: string;
  createdAt: string;
  openRate: string;
  clickRate: string;
  status: 'Scheduled' | 'Sent' | 'Draft';
}

const initialCampaigns: EmailCampaign[] = [
  {
    id: 'EM-001',
    title: 'Corporate Meeting Lounge Summer Promotion',
    owner: 'Alpha',
    type: 'B2B Newsletter',
    startDate: 'Jul 01, 2026',
    startTime: '09:00 AM',
    createdAt: 'Jun 21, 2026',
    openRate: '42.8%',
    clickRate: '12.4%',
    status: 'Scheduled'
  },
  {
    id: 'EM-002',
    title: 'New Year Alpine Sanctuary Staycation',
    owner: 'vervast',
    type: 'Guest Loyalty Blast',
    startDate: 'Jun 28, 2026',
    startTime: '06:39 AM',
    createdAt: 'Jun 21, 2026',
    openRate: '56.2%',
    clickRate: '18.9%',
    status: 'Scheduled'
  },
  {
    id: 'EM-003',
    title: 'Summer VIP Wellness Package Announcement',
    owner: 'vervast',
    type: 'Exclusive Offer',
    startDate: 'Jun 25, 2026',
    startTime: '06:32 AM',
    createdAt: 'Jun 21, 2026',
    openRate: '61.0%',
    clickRate: '22.5%',
    status: 'Sent'
  },
  {
    id: 'EM-004',
    title: 'Consortia Q3 Seasonal Rates Dispatch',
    owner: 'Alpha',
    type: 'Agency Digest',
    startDate: 'May 30, 2026',
    startTime: '09:00 AM',
    createdAt: 'May 30, 2026',
    openRate: '48.1%',
    clickRate: '14.0%',
    status: 'Sent'
  },
];

export function EmailMarketingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [campaignsList, setCampaignsList] = useState<EmailCampaign[]>(initialCampaigns);

  const filteredCampaigns = campaignsList.filter(camp => {
    const matchesSearch =
      camp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || camp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sent': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Scheduled': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Draft': return 'bg-zinc-100 text-zinc-600 border-zinc-200';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-start mb-5 animate-card-enter">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 leading-tight mb-0.5">
            Email Marketing
          </h1>
          <p className="text-zinc-500 text-xs font-normal">
            Create automated newsletters, VIP promotions, and campaign analytics
          </p>
        </div>
        <button
          onClick={() => {}}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-xs cursor-pointer">
          <AddSquare size={14} />
          Create Campaign
        </button>
      </header>

      {/* Main Table Area */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div
          className="flex-1 flex flex-col rounded-[12px] bg-white/70 backdrop-blur-xs border border-zinc-200/80 shadow-xs overflow-hidden animate-card-enter"
          style={{ animationDelay: '0.1s' }}
        >
          {/* Toolbar */}
          <div className="p-3.5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <div className="relative w-72">
              <Magnifer size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search campaigns by name, owner, or ID…"
                className="pl-9 h-8.5 bg-white border-zinc-200 text-zinc-900 focus-visible:ring-zinc-400 rounded-lg text-xs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 relative">
              <span className="text-xs text-zinc-500 mr-1">
                <span className="font-medium text-zinc-900">{filteredCampaigns.length}</span> campaigns
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8.5 border-zinc-200 text-zinc-700 hover:bg-zinc-100 rounded-lg text-xs flex gap-2 font-medium"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={13} /> Filter Options
              </Button>

              {isFilterOpen && (
                <div className="absolute right-0 top-10 z-50 w-52 bg-white border border-zinc-200 rounded-xl shadow-lg p-3 animate-in fade-in zoom-in-95 duration-100">
                  <div className="mb-1">
                    <label className="block text-[9.5px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Campaign Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-zinc-50 border border-zinc-200 rounded px-2.5 text-zinc-800 outline-none cursor-pointer">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Statuses</SelectItem>
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                          <SelectItem value="Sent">Sent</SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-zinc-50/90 backdrop-blur-xs border-b border-zinc-100 z-10">
                <tr>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Campaign ID</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Campaign Title</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Status</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Type</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Scheduled Date</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Open Rate</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Click Rate</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Owner</th>
                  <th className="px-5 py-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
                {filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map(camp => (
                    <tr
                      key={camp.id}
                      className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3 font-mono text-[10.5px] text-zinc-500 group-hover:text-zinc-900 transition-colors">{camp.id}</td>
                      <td className="px-5 py-3 font-medium text-zinc-900 group-hover:text-zinc-900 transition-colors flex items-center gap-1.5">
                        <Letter size={14} className="text-zinc-400 shrink-0" />
                        {camp.title}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${getStatusBadge(camp.status)}`}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{camp.type}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{camp.startDate}</td>
                      <td className="px-5 py-3 font-medium text-zinc-900 text-[10px]">{camp.openRate}</td>
                      <td className="px-5 py-3 font-medium text-emerald-700 text-[10px]">{camp.clickRate}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{camp.owner}</td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => setCampaignsList(prev => prev.filter(c => c.id !== camp.id))}
                          className="p-1 rounded hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors"
                        >
                          <TrashBinTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-5 py-10 text-center text-zinc-400 text-xs italic">
                      No email campaigns found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-zinc-100 flex justify-between items-center bg-zinc-50/50 text-[10px] text-zinc-500">
            <span>Showing <span className="font-medium text-zinc-900">{filteredCampaigns.length}</span> campaigns</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-6.5 text-[10px] text-zinc-600 hover:bg-zinc-100 opacity-50 cursor-not-allowed">Previous</Button>
              <Button variant="ghost" size="sm" className="h-6.5 text-[10px] text-zinc-600 hover:bg-zinc-100 opacity-50 cursor-not-allowed">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
