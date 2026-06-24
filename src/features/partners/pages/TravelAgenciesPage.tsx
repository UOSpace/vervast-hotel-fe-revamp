import React, { useState, useEffect } from 'react';
import { HandShake, Magnifer, Filter, MenuDots, Eye, TrashBinTrash, Buildings } from '@solar-icons/react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { UnderDevelopmentModal } from '../../../components/ui/UnderDevelopmentModal';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockAgencies = [
  {
    id: 'TA-001',
    name: 'Horizon Voyages',
    email: 'partnership@horizonvoyages.co',
    source: 'Referral',
    owner: 'vervast',
    status: 'Active',
    region: 'Europe',
    createdAt: 'January 12, 2025 09:14',
  },
  {
    id: 'TA-002',
    name: 'Aurora Escapes',
    email: 'hello@auroraescapes.com',
    source: 'Direct',
    owner: 'vervast',
    status: 'Active',
    region: 'North America',
    createdAt: 'February 3, 2025 11:30',
  },
  {
    id: 'TA-003',
    name: 'Meridian Travel Group',
    email: 'accounts@meridiantg.net',
    source: 'Trade Show',
    owner: 'vervast',
    status: 'Active',
    region: 'Asia Pacific',
    createdAt: 'February 20, 2025 14:05',
  },
  {
    id: 'TA-004',
    name: 'Celestial Journeys',
    email: 'reservations@celestialjourneys.com',
    source: 'Referral',
    owner: 'Alpha',
    status: 'Active',
    region: 'Middle East',
    createdAt: 'March 8, 2025 10:22',
  },
  {
    id: 'TA-005',
    name: 'Pinnacle Retreats',
    email: 'info@pinnacleretreats.co',
    source: 'Direct',
    owner: 'Alpha',
    status: 'Inactive',
    region: 'Europe',
    createdAt: 'March 16, 2025 16:48',
  },
  {
    id: 'TA-006',
    name: 'Solstice Travel Bureau',
    email: 'ops@solsticetb.com',
    source: 'Online',
    owner: 'Alpha',
    status: 'Active',
    region: 'Latin America',
    createdAt: 'April 2, 2025 08:55',
  },
  {
    id: 'TA-007',
    name: 'Nomadic Luxe',
    email: 'partnerships@nomadicluxe.io',
    source: 'Referral',
    owner: 'vervast',
    status: 'Active',
    region: 'Asia Pacific',
    createdAt: 'April 10, 2025 13:20',
  },
  {
    id: 'TA-008',
    name: 'The Voyage Co.',
    email: 'contact@thevoyageco.travel',
    source: 'Trade Show',
    owner: 'Alpha',
    status: 'Pending',
    region: 'Africa',
    createdAt: 'April 18, 2025 09:40',
  },
  {
    id: 'TA-009',
    name: 'Elevate Destinations',
    email: 'hello@elevatedestinations.com',
    source: 'Direct',
    owner: 'vervast',
    status: 'Active',
    region: 'North America',
    createdAt: 'May 5, 2025 11:10',
  },
  {
    id: 'TA-010',
    name: 'Grand Circuit Travels',
    email: 'info@grandcircuit.travel',
    source: 'Online',
    owner: 'Alpha',
    status: 'Inactive',
    region: 'Europe',
    createdAt: 'May 22, 2025 14:33',
  },
  {
    id: 'TA-011',
    name: 'Luminary Expeditions',
    email: 'luminary@expeditions.co',
    source: 'Referral',
    owner: 'vervast',
    status: 'Active',
    region: 'Asia Pacific',
    createdAt: 'June 1, 2025 10:00',
  },
  {
    id: 'TA-012',
    name: 'Arcadia Travel Partners',
    email: 'arcadia@travelpartners.net',
    source: 'Trade Show',
    owner: 'Alpha',
    status: 'Pending',
    region: 'Middle East',
    createdAt: 'June 7, 2025 15:45',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-[#657454]/15 text-[#3b4a2e] border-[#657454]/30';
    case 'Inactive': return 'bg-[#7d6b5e]/15 text-[#4a3c31] border-[#7d6b5e]/30';
    case 'Pending': return 'bg-[#C8A050]/15 text-[#7a5e2a] border-[#C8A050]/30';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

// ─── Component ────────────────────────────────────────────────────────────────
export function TravelAgenciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [showDevModal, setShowDevModal] = useState(false);
  const [devFeatureName, setDevFeatureName] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const openDevModal = (name?: string) => {
    setDevFeatureName(name);
    setShowDevModal(true);
  };

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleDetail = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenDropdownId(null);
    openDevModal('Agency Detail');
  };

  const filteredAgencies = mockAgencies.filter(ag => {
    const matchesSearch =
      ag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ag.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ag.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ag.status === statusFilter;
    const matchesRegion = regionFilter === 'All' || ag.region === regionFilter;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  // Reset to page 1 whenever filters/search change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, regionFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAgencies.length / PAGE_SIZE));
  const pagedData = filteredAgencies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="shrink-0 flex justify-between items-start mb-6 px-4 lg:px-6 animate-card-enter">
        <div>
          <h1 className="text-4xl font-serif text-[#4a3c31] mb-1 flex items-center gap-3">
            <HandShake size={36} className="text-[#947b66]" />
            Travel Agencies.
          </h1>
          <p className="text-[#7d6b5e] text-sm italic font-serif">
            Manage and view all registered travel agency partnerships.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openDevModal('Add Travel Agency')}
            className="flex items-center gap-2 bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] text-xs font-bold px-4 py-2 rounded-[10px] transition-all shadow-sm cursor-pointer">
            <Buildings size={14} />
            Add Travel Agency
          </button>
        </div>
      </header>

      {/* ── Main Table Area ─────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col px-4 lg:px-6 pb-6">
        <div
          className="flex-1 flex flex-col border border-[#d4c4b7] rounded-[12px] backdrop-blur-sm bg-[#f3eae1]/0 overflow-hidden animate-card-enter"
          style={{ animationDelay: '0.1s' }}
        >

          {/* Toolbar */}
          <div className="p-4 border-b border-[#d4c4b7] flex justify-between items-center bg-[#f3eae1]/50">
            <div className="relative w-72">
              <Magnifer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#947b66]" />
              <Input
                placeholder="Search by name, email, or ID…"
                className="pl-9 h-9 bg-white/50 border-[#d4c4b7] text-[#4a3c31] focus-visible:ring-[#947b66] rounded-[8px] text-xs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 relative">
              <span className="text-xs text-[#7d6b5e]">
                <span className="font-semibold text-[#4a3c31]">{filteredAgencies.length}</span> agencies
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-[#d4c4b7] text-[#4a3c31] hover:bg-[#e5d8cb] rounded-[8px] text-xs flex gap-2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={14} /> Filter Options
              </Button>

              {isFilterOpen && (
                <div className="absolute right-0 top-11 z-50 w-52 bg-[#f3eae1] border border-[#d4c4b7] rounded-xl shadow-lg p-3 animate-in fade-in zoom-in-95 duration-100">
                  <div className="mb-3">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-1">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-white/50 border border-[#d4c4b7] rounded px-3 text-[#4a3c31] outline-none cursor-pointer">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Statuses</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-1">Region</label>
                    <Select value={regionFilter} onValueChange={setRegionFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-white/50 border border-[#d4c4b7] rounded px-3 text-[#4a3c31] outline-none cursor-pointer">
                        <SelectValue placeholder="All Regions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Regions</SelectItem>
                          <SelectItem value="Europe">Europe</SelectItem>
                          <SelectItem value="North America">North America</SelectItem>
                          <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                          <SelectItem value="Middle East">Middle East</SelectItem>
                          <SelectItem value="Latin America">Latin America</SelectItem>
                          <SelectItem value="Africa">Africa</SelectItem>
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
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#f3eae1] border-b border-[#d4c4b7] z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Agency ID</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Agency Name</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">E-Mail Address</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Source</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Region</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Owner</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Created At</th>
                  <th className="px-6 py-3 w-10" />
                </tr>
              </thead>

              <tbody className="divide-y divide-[#d4c4b7]/50 text-xs text-[#4a3c31]">
                {pagedData.length > 0 ? (
                  pagedData.map(agency => (
                    <tr
                      key={agency.id}
                      onClick={() => handleDetail()}
                      className="hover:bg-[#e5d8cb]/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-mono text-[11px] text-[#947b66] group-hover:text-[#4a3c31] transition-colors">
                        {agency.id}
                      </td>
                      <td className="px-6 py-4 font-medium group-hover:text-[#947b66] transition-colors">
                        {agency.name}
                      </td>
                      <td className="px-6 py-4 text-[#586981]">{agency.email}</td>
                      <td className="px-6 py-4 text-[#7d6b5e] italic">{agency.source}</td>
                      <td className="px-6 py-4 text-[#7d6b5e]">{agency.region}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium border ${getStatusColor(agency.status)}`}>
                          {agency.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#947b66]/20 backdrop-blur-sm border border-[#947b66]/30 flex items-center justify-center text-[8px] font-bold text-[#947b66]">
                            {agency.owner.charAt(0).toUpperCase()}
                          </span>
                          <span className="text-[11px] text-[#7d6b5e]">{agency.owner}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#7d6b5e]">{agency.createdAt}</td>
                      <td className="px-6 py-4 text-right relative" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={e => toggleDropdown(agency.id, e)}
                          className="p-1.5 rounded-full hover:bg-[#d4c4b7]/50 text-[#7d6b5e] hover:text-[#4a3c31] transition-colors"
                        >
                          <MenuDots size={18} />
                        </button>

                        {openDropdownId === agency.id && (
                          <div className="absolute right-6 top-10 z-50 w-36 bg-[#f3eae1] border border-[#d4c4b7] rounded-xl shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={e => handleDetail(e)}
                              className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] flex items-center gap-2 transition-colors"
                            >
                              <Eye size={14} className="text-[#947b66]" />
                              View Detail
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); setOpenDropdownId(null); openDevModal('Delete Agency'); }}
                              className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                              <TrashBinTrash size={14} className="text-red-500" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-[#7d6b5e] text-sm italic">
                      No travel agencies found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-3 border-t border-[#d4c4b7] flex justify-between items-center bg-[#f3eae1]/80 text-xs text-[#7d6b5e]">
            <span>
              Showing{' '}
              <span className="font-medium text-[#4a3c31]">{(currentPage - 1) * PAGE_SIZE + 1}</span>
              {' '}–{' '}
              <span className="font-medium text-[#4a3c31]">{Math.min(currentPage * PAGE_SIZE, filteredAgencies.length)}</span>
              {' '}of{' '}
              <span className="font-medium text-[#4a3c31]">{filteredAgencies.length}</span> agencies
              {totalPages > 1 && (
                <span className="ml-2 text-[#d4c4b7]">· Page {currentPage} of {totalPages}</span>
              )}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost" size="sm"
                className={`h-7 text-[#4a3c31] hover:bg-[#d4c4b7]/30 ${currentPage <= 1 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <Button
                variant="ghost" size="sm"
                className={`h-7 text-[#4a3c31] hover:bg-[#d4c4b7]/30 ${currentPage >= totalPages ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <UnderDevelopmentModal
        open={showDevModal}
        onClose={() => setShowDevModal(false)}
        featureName={devFeatureName}
      />
    </div>
  );
}
