import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Magnifer, Filter, MenuDots, Eye, TrashBinTrash } from '@solar-icons/react';
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
    expectedClose: '2026-07-15',
    owner: 'Sarah Jenkins',
    createdAt: '2026-06-10',
    source: 'Corporate',
    sourceDetails: 'TechCorp Annual Request',
    crsNo: 'CRS-90812',
    leadScore: '85/100',
    confidenceLevel: 'High',
    qualified: 'Yes',
    conversionProbability: '80%',
    lostReason: 'N/A',
  },
  {
    id: 'LD-002',
    leadName: 'Smith Family Reunion Block',
    leadStatus: 'Ongoing',
    totalValue: '$12,500',
    expectedClose: '2026-08-01',
    owner: 'David Miller',
    createdAt: '2026-06-12',
    source: 'Direct',
    sourceDetails: 'Website Query Form',
    crsNo: 'CRS-90815',
    leadScore: '72/100',
    confidenceLevel: 'Medium',
    qualified: 'Yes',
    conversionProbability: '60%',
    lostReason: 'N/A',
  },
  {
    id: 'LD-003',
    leadName: 'Luxury Travel VIP Group',
    leadStatus: 'Completed',
    totalValue: '$68,000',
    expectedClose: '2026-06-20',
    owner: 'Sarah Jenkins',
    createdAt: '2026-06-01',
    source: 'Travel Agent',
    sourceDetails: 'Virtuoso Consortium',
    crsNo: 'CRS-89211',
    leadScore: '95/100',
    confidenceLevel: 'High',
    qualified: 'Yes',
    conversionProbability: '100%',
    lostReason: 'N/A',
  },
  {
    id: 'LD-004',
    leadName: 'Asia Wedding Expo Lead',
    leadStatus: 'Canceled',
    totalValue: '$32,000',
    expectedClose: '2026-06-15',
    owner: 'Emma Watson',
    createdAt: '2026-05-24',
    source: 'OTA',
    sourceDetails: 'Expedia Event Referral',
    crsNo: 'CRS-77312',
    leadScore: '40/100',
    confidenceLevel: 'Low',
    qualified: 'No',
    conversionProbability: '0%',
    lostReason: 'Budget constraints',
  },
  {
    id: 'LD-005',
    leadName: 'Executive Team Board Meeting',
    leadStatus: 'Draft',
    totalValue: '$18,000',
    expectedClose: '2026-07-28',
    owner: 'David Miller',
    createdAt: '2026-06-22',
    source: 'Corporate',
    sourceDetails: 'Global Finance Inc.',
    crsNo: 'CRS-91100',
    leadScore: '65/100',
    confidenceLevel: 'Medium',
    qualified: 'Yes',
    conversionProbability: '50%',
    lostReason: 'N/A',
  },
  {
    id: 'LD-006',
    leadName: 'Weekend Wellness Retreat Group',
    leadStatus: 'Ongoing',
    totalValue: '$21,500',
    expectedClose: '2026-08-10',
    owner: 'Emma Watson',
    createdAt: '2026-06-18',
    source: 'Direct',
    sourceDetails: 'Instagram Campaign',
    crsNo: 'N/A',
    leadScore: '58/100',
    confidenceLevel: 'Medium',
    qualified: 'Yes',
    conversionProbability: '40%',
    lostReason: 'N/A',
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
      case 'Draft': return 'bg-blue-500/10 text-blue-800 border-blue-500/20';
      case 'Ongoing': return 'bg-[#C8A050]/20 text-[#7a5e2a] border-[#C8A050]/30';
      case 'Completed': return 'bg-green-500/10 text-green-800 border-green-500/20';
      case 'Canceled': return 'bg-red-500/10 text-red-800 border-red-500/20';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-green-50 text-green-700 border-green-200/50';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200/50';
      case 'Low': return 'bg-red-50 text-red-700 border-red-200/50';
      default: return 'bg-gray-50 text-gray-700 border-gray-200/50';
    }
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-start mb-6 px-4 lg:px-6 animate-card-enter">
        <div>
          <h1 className="text-4xl font-serif text-[#4a3c31] mb-1 flex items-center gap-3">
            <Calendar size={36} className="text-[#947b66]" />
            Reservations Leads.
          </h1>
          <p className="text-[#7d6b5e] text-sm italic font-serif">Manage and track reservations leads pipeline.</p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col px-4 lg:px-6 pb-6">

        {/* Table Container */}
        <div className="flex-1 flex flex-col border border-[#d4c4b7] rounded-[12px] backdrop-blur-sm bg-[#f3eae1]/0 overflow-hidden animate-card-enter" style={{ animationDelay: '0.1s' }}>

          {/* Toolbar */}
          <div className="p-4 border-b border-[#d4c4b7] flex justify-between items-center bg-[#f3eae1]/50">
            <div className="relative w-80">
              <Magnifer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#947b66]" />
              <Input
                placeholder="Search leads by name, owner, or CRS..."
                className="pl-9 h-9 bg-white/50 border-[#d4c4b7] text-[#4a3c31] focus-visible:ring-[#947b66] rounded-[8px] text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 relative">
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-[#d4c4b7] text-[#4a3c31] hover:bg-[#e5d8cb] rounded-[8px] text-xs flex gap-2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={14} /> Filter Options
              </Button>

              {isFilterOpen && (
                <div className="absolute right-0 top-11 z-50 w-48 bg-[#f3eae1] border border-[#d4c4b7] rounded-xl shadow-lg p-3 animate-in fade-in zoom-in-95 duration-100">
                  <div className="mb-3">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-1">Lead Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-white/50 border border-[#d4c4b7] rounded px-3 text-[#4a3c31] outline-none cursor-pointer">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Statuses</SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Ongoing">Ongoing</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Canceled">Canceled</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-1">Source</label>
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-white/50 border border-[#d4c4b7] rounded px-3 text-[#4a3c31] outline-none cursor-pointer">
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
          <div className="flex-1 overflow-auto custom-scrollbar bg-white/20">
            <table className="w-full text-left border-collapse min-w-[1600px]">
              <thead className="sticky top-0 bg-[#f3eae1] border-b border-[#d4c4b7] z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap w-24">ID</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Lead Name</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-center">Lead Status</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-right">Total Lead Value</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Expected Close Date</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Owner</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Created At</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Source</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Source Details</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">CRS No</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Lead Score</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Confidence Level</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-center">Qualified</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-center">Conversion Probability</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Lost Reason</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4c4b7]/50 text-xs text-[#4a3c31]">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => handlePreview(lead.id)}
                      className="hover:bg-[#e5d8cb]/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-4 font-mono text-[11px] text-[#947b66] group-hover:text-[#4a3c31] transition-colors whitespace-nowrap">{lead.id}</td>
                      <td className="px-4 py-4 font-medium group-hover:text-[#947b66] transition-colors whitespace-nowrap">{lead.leadName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border whitespace-nowrap inline-flex items-center justify-center ${getStatusColor(lead.leadStatus)}`}>
                          {lead.leadStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-medium whitespace-nowrap">{lead.totalValue}</td>
                      <td className="px-4 py-4 text-[#7d6b5e] whitespace-nowrap">{lead.expectedClose}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{lead.owner}</td>
                      <td className="px-4 py-4 text-[#7d6b5e] whitespace-nowrap">{lead.createdAt}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[11px] italic text-[#7d6b5e]">{lead.source}</span>
                      </td>
                      <td className="px-4 py-4 text-[#7d6b5e] whitespace-nowrap">{lead.sourceDetails}</td>
                      <td className="px-4 py-4 font-mono text-[11px] whitespace-nowrap">{lead.crsNo}</td>
                      <td className="px-4 py-4 font-mono whitespace-nowrap">{lead.leadScore}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] border whitespace-nowrap inline-flex items-center justify-center ${getConfidenceColor(lead.confidenceLevel)}`}>
                          {lead.confidenceLevel}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        {lead.qualified === 'Yes' ? (
                          <span className="inline-flex items-center text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 whitespace-nowrap">Yes</span>
                        ) : (
                          <span className="inline-flex items-center text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 whitespace-nowrap">No</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center font-medium font-mono whitespace-nowrap">{lead.conversionProbability}</td>
                      <td className="px-4 py-4 text-[#7d6b5e] whitespace-nowrap">{lead.lostReason}</td>
                      <td className="px-4 py-4 text-right relative">
                        <button
                          onClick={(e) => toggleDropdown(lead.id, e)}
                          className="p-1.5 rounded-full hover:bg-[#d4c4b7]/50 text-[#7d6b5e] hover:text-[#4a3c31] transition-colors"
                        >
                          <MenuDots size={18} />
                        </button>

                        {openDropdownId === lead.id && (
                          <div className="absolute right-6 top-10 z-50 w-36 bg-[#f3eae1] border border-[#d4c4b7] rounded-xl shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            <button onClick={() => handlePreview(lead.id)} className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] flex items-center gap-2 transition-colors">
                              <Eye size={14} className="text-[#947b66]" /> Preview
                            </button>
                            <button className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                              <TrashBinTrash size={14} className="text-red-500" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={16} className="px-4 py-12 text-center text-[#7d6b5e] text-sm italic">
                      No leads found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-3 border-t border-[#d4c4b7] flex justify-between items-center bg-[#f3eae1]/80 text-xs text-[#7d6b5e]">
            <span>Showing <span className="font-medium text-[#4a3c31]">{filteredLeads.length}</span> of <span className="font-medium text-[#4a3c31]">{mockLeads.length}</span> leads</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-7 text-[#4a3c31] hover:bg-[#d4c4b7]/30 opacity-50 cursor-not-allowed">Previous</Button>
              <Button variant="ghost" size="sm" className="h-7 text-[#4a3c31] hover:bg-[#d4c4b7]/30 opacity-50 cursor-not-allowed">Next</Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
