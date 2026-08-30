import React, { useState, useEffect } from 'react';
import { Magnifer, Filter, MenuDots, Eye, TrashBinTrash, Buildings } from '@solar-icons/react';
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

// Mock Data
const mockAgencies = [
  {
    id: 'TA-001',
    name: 'Horizon Voyages',
    email: 'partnership@horizonvoyages.co',
    source: 'Referral',
    owner: 'vervast',
    status: 'Active',
    region: 'Europe',
    createdAt: 'Jan 12, 2025',
  },
  {
    id: 'TA-002',
    name: 'Aurora Escapes',
    email: 'hello@auroraescapes.com',
    source: 'Direct',
    owner: 'vervast',
    status: 'Active',
    region: 'North America',
    createdAt: 'Feb 3, 2025',
  },
  {
    id: 'TA-003',
    name: 'Meridian Travel Group',
    email: 'accounts@meridiantg.net',
    source: 'Trade Show',
    owner: 'vervast',
    status: 'Active',
    region: 'Asia Pacific',
    createdAt: 'Feb 20, 2025',
  },
  {
    id: 'TA-004',
    name: 'Celestial Journeys',
    email: 'reservations@celestialjourneys.com',
    source: 'Referral',
    owner: 'Alpha',
    status: 'Active',
    region: 'Middle East',
    createdAt: 'Mar 8, 2025',
  },
  {
    id: 'TA-005',
    name: 'Pinnacle Retreats',
    email: 'info@pinnacleretreats.co',
    source: 'Direct',
    owner: 'Alpha',
    status: 'Inactive',
    region: 'Europe',
    createdAt: 'Mar 16, 2025',
  },
  {
    id: 'TA-006',
    name: 'Solstice Travel Bureau',
    email: 'ops@solsticetb.com',
    source: 'Online',
    owner: 'Alpha',
    status: 'Active',
    region: 'Latin America',
    createdAt: 'Apr 2, 2025',
  },
  {
    id: 'TA-007',
    name: 'Nomadic Luxe',
    email: 'partnerships@nomadicluxe.io',
    source: 'Referral',
    owner: 'vervast',
    status: 'Active',
    region: 'Asia Pacific',
    createdAt: 'Apr 10, 2025',
  },
  {
    id: 'TA-008',
    name: 'The Voyage Co.',
    email: 'contact@thevoyageco.travel',
    source: 'Trade Show',
    owner: 'Alpha',
    status: 'Pending',
    region: 'Africa',
    createdAt: 'Apr 18, 2025',
  },
  {
    id: 'TA-009',
    name: 'Elevate Destinations',
    email: 'hello@elevatedestinations.com',
    source: 'Direct',
    owner: 'vervast',
    status: 'Active',
    region: 'North America',
    createdAt: 'May 5, 2025',
  },
  {
    id: 'TA-010',
    name: 'Grand Circuit Travels',
    email: 'info@grandcircuit.travel',
    source: 'Online',
    owner: 'Alpha',
    status: 'Inactive',
    region: 'Europe',
    createdAt: 'May 22, 2025',
  },
  {
    id: 'TA-011',
    name: 'Luminary Expeditions',
    email: 'luminary@expeditions.co',
    source: 'Referral',
    owner: 'vervast',
    status: 'Active',
    region: 'Asia Pacific',
    createdAt: 'Jun 1, 2025',
  },
  {
    id: 'TA-012',
    name: 'Arcadia Travel Partners',
    email: 'arcadia@travelpartners.net',
    source: 'Trade Show',
    owner: 'Alpha',
    status: 'Pending',
    region: 'Middle East',
    createdAt: 'Jun 7, 2025',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Inactive': return 'bg-zinc-100 text-zinc-500 border-zinc-200';
    case 'Pending': return 'bg-amber-50 text-amber-800 border-amber-200';
    default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
  }
};

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

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, regionFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAgencies.length / PAGE_SIZE));
  const pagedData = filteredAgencies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-start mb-5 animate-card-enter">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 leading-tight mb-0.5">
            Travel Agencies
          </h1>
          <p className="text-zinc-500 text-xs font-normal">
            Manage and view all registered travel agency partnerships
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openDevModal('Add Travel Agency')}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-xs cursor-pointer">
            <Buildings size={14} />
            Add Travel Agency
          </button>
        </div>
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
                placeholder="Search by name, email, or ID…"
                className="pl-9 h-8.5 bg-white border-zinc-200 text-zinc-900 focus-visible:ring-zinc-400 rounded-lg text-xs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 relative">
              <span className="text-xs text-zinc-500 mr-1">
                <span className="font-medium text-zinc-900">{filteredAgencies.length}</span> agencies
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
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Region</label>
                    <Select value={regionFilter} onValueChange={setRegionFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-zinc-50 border border-zinc-200 rounded px-2.5 text-zinc-800 outline-none cursor-pointer">
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
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-zinc-50/90 backdrop-blur-xs border-b border-zinc-100 z-10">
                <tr>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Agency ID</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Agency Name</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Email Address</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Source</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Region</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Owner</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Status</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Created At</th>
                  <th className="px-5 py-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
                {pagedData.length > 0 ? (
                  pagedData.map(agency => (
                    <tr
                      key={agency.id}
                      onClick={() => handleDetail()}
                      className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3 font-mono text-[10.5px] text-zinc-500 group-hover:text-zinc-900 transition-colors">{agency.id}</td>
                      <td className="px-5 py-3 font-medium text-zinc-900 group-hover:text-zinc-900 transition-colors">{agency.name}</td>
                      <td className="px-5 py-3 text-zinc-600 text-[10px]">{agency.email}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{agency.source}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{agency.region}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{agency.owner}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${getStatusColor(agency.status)}`}>
                          {agency.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{agency.createdAt}</td>
                      <td className="px-5 py-3 text-right relative" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={e => toggleDropdown(agency.id, e)}
                          className="p-1 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors"
                        >
                          <MenuDots size={16} />
                        </button>

                        {openDropdownId === agency.id && (
                          <div className="absolute right-5 top-9 z-50 w-32 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={handleDetail}
                              className="w-full px-3 py-1.5 text-left text-xs text-zinc-800 hover:bg-zinc-50 flex items-center gap-2 transition-colors"
                            >
                              <Eye size={13} className="text-zinc-500" /> Detail
                            </button>
                            <button
                              onClick={() => { setOpenDropdownId(null); openDevModal('Delete Agency'); }}
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
                    <td colSpan={9} className="px-5 py-10 text-center text-zinc-400 text-xs italic">
                      No agencies found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-zinc-100 flex justify-between items-center bg-zinc-50/50 text-[10px] text-zinc-500">
            <span>
              Showing <span className="font-medium text-zinc-900">{pagedData.length}</span> of <span className="font-medium text-zinc-900">{filteredAgencies.length}</span> agencies
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6.5 text-[10px] text-zinc-600 hover:bg-zinc-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6.5 text-[10px] text-zinc-600 hover:bg-zinc-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
