import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Magnifer, Filter, Eye, TrashBinTrash, AddSquare } from '@solar-icons/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/pagination';
import {
  TableContainer,
  TableScrollArea,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableEmpty,
} from '@/components/ui/table';
import { TableActionMenu } from '@/components/ui/dropdown-menu';
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const navigate = useNavigate();

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sourceFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const pagedLeads = filteredLeads.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
          <h1 className="text-2xl font-bold text-zinc-900 tracking-wide mb-0.5">
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
        <TableContainer style={{ animationDelay: '0.1s' }}>
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
          <TableScrollArea>
            <Table>
              <TableHeader>
                <TableRow clickable={false}>
                  <TableHead>Lead ID</TableHead>
                  <TableHead>Lead Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Expected Close</TableHead>
                  <TableHead align="right">Total Value</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedLeads.length > 0 ? (
                  pagedLeads.map(lead => (
                    <TableRow
                      key={lead.id}
                      onClick={() => handlePreview(lead.id)}
                    >
                      <TableCell className="font-mono text-[10.5px] text-zinc-500 group-hover:text-zinc-900 transition-colors">{lead.id}</TableCell>
                      <TableCell className="font-medium text-zinc-900 group-hover:text-zinc-900 transition-colors">{lead.leadName}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${getStatusColor(lead.leadStatus)}`}>
                          {lead.leadStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-500 text-[10px]">{lead.source}</TableCell>
                      <TableCell className="text-zinc-500 text-[10px]">{lead.owner}</TableCell>
                      <TableCell className="text-zinc-500 text-[10px]">{lead.expectedClose}</TableCell>
                      <TableCell align="right" className="font-medium text-zinc-900">{lead.totalValue}</TableCell>
                      <TableCell align="right" onClick={e => e.stopPropagation()}>
                        <TableActionMenu
                          items={[
                            {
                              label: 'View Detail',
                              icon: <Eye size={13} className="text-zinc-500" />,
                              onClick: () => handlePreview(lead.id),
                            },
                            {
                              label: 'Delete',
                              icon: <TrashBinTrash size={13} className="text-rose-500" />,
                              variant: 'danger',
                              onClick: () => {},
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableEmpty colSpan={8} message="No leads found matching your criteria." />
                )}
              </TableBody>
            </Table>
          </TableScrollArea>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLeads.length}
            itemsPerPage={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="leads"
          />
        </TableContainer>
      </div>
    </div>
  );
}
