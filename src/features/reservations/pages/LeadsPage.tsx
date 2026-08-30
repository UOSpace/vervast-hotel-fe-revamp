import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Magnifer, Filter, MenuDots, Eye, TrashBinTrash, AddSquare } from '@solar-icons/react';
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

// Mock data for Reservations Leads
const mockLeads = [
  {
    id: 'LD-001',
    leadName: 'Grand Hyatt Corporate Retreat',
    leadStatus: 'Ongoing',
    totalValue: '$45,000',
    expectedClose: 'Jul 15, 2026',
    owner: 'Sarah Jenkins',
    createdAt: 'Jun 10, 2026',
    source: 'Corporate',
    sourceDetails: 'TechCorp Annual Request',
    crsNo: 'CRS-90812',
    confidenceLevel: 'High',
  },
  {
    id: 'LD-002',
    leadName: 'Smith Family Reunion Block',
    leadStatus: 'Ongoing',
    totalValue: '$12,500',
    expectedClose: 'Aug 01, 2026',
    owner: 'David Miller',
    createdAt: 'Jun 12, 2026',
    source: 'Direct',
    sourceDetails: 'Website Query Form',
    crsNo: 'CRS-90815',
    confidenceLevel: 'Medium',
  },
  {
    id: 'LD-003',
    leadName: 'Luxury Travel VIP Group',
    leadStatus: 'Completed',
    totalValue: '$68,000',
    expectedClose: 'Jun 20, 2026',
    owner: 'Sarah Jenkins',
    createdAt: 'Jun 01, 2026',
    source: 'Travel Agent',
    sourceDetails: 'Virtuoso Consortium',
    crsNo: 'CRS-89211',
    confidenceLevel: 'High',
  },
  {
    id: 'LD-004',
    leadName: 'Asia Wedding Expo Lead',
    leadStatus: 'Canceled',
    totalValue: '$32,000',
    expectedClose: 'Jun 15, 2026',
    owner: 'Emma Watson',
    createdAt: 'May 24, 2026',
    source: 'OTA',
    sourceDetails: 'Expedia Event Referral',
    crsNo: 'CRS-77312',
    confidenceLevel: 'Low',
  },
  {
    id: 'LD-005',
    leadName: 'Executive Team Board Meeting',
    leadStatus: 'Draft',
    totalValue: '$18,000',
    expectedClose: 'Jul 28, 2026',
    owner: 'David Miller',
    createdAt: 'Jun 22, 2026',
    source: 'Corporate',
    sourceDetails: 'Global Finance Inc.',
    crsNo: 'CRS-91100',
    confidenceLevel: 'Medium',
  },
  {
    id: 'LD-006',
    leadName: 'Weekend Wellness Retreat Group',
    leadStatus: 'Ongoing',
    totalValue: '$21,500',
    expectedClose: 'Aug 10, 2026',
    owner: 'Emma Watson',
    createdAt: 'Jun 18, 2026',
    source: 'Direct',
    sourceDetails: 'Instagram Campaign',
    crsNo: 'N/A',
    confidenceLevel: 'Medium',
  },
];

export function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const navigate = useNavigate();

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handlePreview = (id: string) => {
    navigate(`/dashboard/reservations/leads/${id}`);
  };

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch =
      lead.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.crsNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || lead.leadStatus === statusFilter;
    const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ongoing': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Canceled': return 'bg-rose-50 text-rose-700 border-rose-200';
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
            Reservation Leads
          </h1>
          <p className="text-zinc-500 text-xs font-normal">
            Track inquiries, corporate group leads, and proposal stages
          </p>
        </div>
        <button
          onClick={() => handlePreview('LD-001')}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-xs cursor-pointer">
          <AddSquare size={14} />
          Create New Lead
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
                placeholder="Search leads by name, owner, or CRS…"
                className="pl-9 h-8.5 bg-white border-zinc-200 text-zinc-900 focus-visible:ring-zinc-400 rounded-lg text-xs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 relative">
              <span className="text-xs text-zinc-500 mr-1">
                <span className="font-medium text-zinc-900">{filteredLeads.length}</span> leads
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
                  <div className="mb-3">
                    <label className="block text-[9.5px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-zinc-50 border border-zinc-200 rounded px-2.5 text-zinc-800 outline-none cursor-pointer">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Statuses</SelectItem>
                          <SelectItem value="Ongoing">Ongoing</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Canceled">Canceled</SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Source</label>
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-zinc-50 border border-zinc-200 rounded px-2.5 text-zinc-800 outline-none cursor-pointer">
                        <SelectValue placeholder="All Sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Sources</SelectItem>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                          <SelectItem value="Direct">Direct</SelectItem>
                          <SelectItem value="Travel Agent">Travel Agent</SelectItem>
                          <SelectItem value="OTA">OTA</SelectItem>
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
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Lead ID</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Lead Name</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Status</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Source</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Owner</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Expected Close</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400 text-right">Total Value</th>
                  <th className="px-5 py-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map(lead => (
                    <tr
                      key={lead.id}
                      onClick={() => handlePreview(lead.id)}
                      className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3 font-mono text-[10.5px] text-zinc-500 group-hover:text-zinc-900 transition-colors">{lead.id}</td>
                      <td className="px-5 py-3 font-medium text-zinc-900 group-hover:text-zinc-900 transition-colors">{lead.leadName}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${getStatusColor(lead.leadStatus)}`}>
                          {lead.leadStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{lead.source}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{lead.owner}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{lead.expectedClose}</td>
                      <td className="px-5 py-3 text-right font-medium text-zinc-900">{lead.totalValue}</td>
                      <td className="px-5 py-3 text-right relative" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={e => toggleDropdown(lead.id, e)}
                          className="p-1 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors"
                        >
                          <MenuDots size={16} />
                        </button>

                        {openDropdownId === lead.id && (
                          <div className="absolute right-5 top-9 z-50 w-32 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={() => handlePreview(lead.id)}
                              className="w-full px-3 py-1.5 text-left text-xs text-zinc-800 hover:bg-zinc-50 flex items-center gap-2 transition-colors"
                            >
                              <Eye size={13} className="text-zinc-500" /> View Detail
                            </button>
                            <button
                              onClick={() => setOpenDropdownId(null)}
                              className="w-full px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                            >
                              <TrashBinTrash size={13} className="text-rose-500" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-zinc-400 text-xs italic">
                      No leads found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-zinc-100 flex justify-between items-center bg-zinc-50/50 text-[10px] text-zinc-500">
            <span>Showing <span className="font-medium text-zinc-900">{filteredLeads.length}</span> of <span className="font-medium text-zinc-900">{mockLeads.length}</span> leads</span>
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
