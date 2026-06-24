import React, { useState, useEffect } from 'react';
import { Buildings, Magnifer, Filter, MenuDots, Eye, TrashBinTrash } from '@solar-icons/react';
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
const mockCorporates = [
  {
    id: 'CP-001',
    name: 'Vantage Capital Group',
    email: 'partnerships@vantagecg.com',
    phone: '+1 212 555 0142',
    category: 'Financial Services',
    source: 'Email Marketing',
    owner: 'vervast',
  },
  {
    id: 'CP-002',
    name: 'Meridian Global Solutions',
    email: 'travel@meridianglobal.net',
    phone: '+44 20 7946 0831',
    category: 'Consulting',
    source: 'Referral',
    owner: 'Alpha',
  },
  {
    id: 'CP-003',
    name: 'Axiom Technologies',
    email: 'events@axiomtech.io',
    phone: '+65 6310 4200',
    category: 'Technology',
    source: 'Social Media',
    owner: 'vervast',
  },
  {
    id: 'CP-004',
    name: 'Crestline Pharmaceuticals',
    email: 'corp.travel@crestlinepharma.com',
    phone: '+41 44 550 0390',
    category: 'Healthcare',
    source: 'Trade Show',
    owner: 'Alpha',
  },
  {
    id: 'CP-005',
    name: 'Orion Asset Management',
    email: 'admin@orionassets.co',
    phone: '',
    category: 'Financial Services',
    source: 'Direct',
    owner: 'Alpha',
  },
  {
    id: 'CP-006',
    name: 'Solis Energy International',
    email: 'meetings@solisenergyintl.com',
    phone: '+971 4 381 6000',
    category: 'Energy',
    source: 'Email Marketing',
    owner: 'vervast',
  },
  {
    id: 'CP-007',
    name: 'Beacon Media Group',
    email: 'travel@beaconmedia.com',
    phone: '+1 310 555 0267',
    category: 'Media & Entertainment',
    source: 'Social Media',
    owner: 'Alpha',
  },
  {
    id: 'CP-008',
    name: 'Hallmark Logistics',
    email: '',
    phone: '',
    category: 'Logistics',
    source: '',
    owner: 'Unknown',
  },
  {
    id: 'CP-009',
    name: 'Pinnacle Aerospace',
    email: 'corp@pinnacleaero.com',
    phone: '+33 1 4400 7820',
    category: 'Aerospace & Defense',
    source: 'Referral',
    owner: 'vervast',
  },
  {
    id: 'CP-010',
    name: 'Verdant Retail Holdings',
    email: 'events@verdantretail.co',
    phone: '+62 21 5088 1400',
    category: 'Retail',
    source: 'Direct',
    owner: 'Alpha',
  },
  {
    id: 'CP-011',
    name: 'Harlow Insurance Partners',
    email: '',
    phone: '',
    category: 'Insurance',
    source: '',
    owner: 'Unknown',
  },
  {
    id: 'CP-012',
    name: 'Citadel Architecture Studio',
    email: 'travel@citadelarch.design',
    phone: '+39 02 8735 6100',
    category: 'Architecture & Design',
    source: 'Trade Show',
    owner: 'vervast',
  },
  {
    id: 'CP-013',
    name: 'Pacific Rim Trading Co.',
    email: 'corp@pacificrimtc.com',
    phone: '+852 2100 8830',
    category: 'Trading',
    source: 'Social Media',
    owner: 'Alpha',
  },
  {
    id: 'CP-014',
    name: 'Summit Education Group',
    email: 'admin@summitedugroup.org',
    phone: '+61 2 9310 5500',
    category: 'Education',
    source: 'Email Marketing',
    owner: 'Alpha',
  },
  {
    id: 'CP-015',
    name: 'Quantum Research Institute',
    email: 'travel@quantumri.edu',
    phone: '',
    category: 'Research & Development',
    source: 'Referral',
    owner: 'vervast',
  },
];

const ALL_CATEGORIES = [
  'Financial Services', 'Consulting', 'Technology', 'Healthcare', 'Energy',
  'Media & Entertainment', 'Logistics', 'Aerospace & Defense', 'Retail',
  'Insurance', 'Architecture & Design', 'Trading', 'Education', 'Research & Development',
];

// ─── Component ────────────────────────────────────────────────────────────────
export function CorporatePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
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
    openDevModal('Company Detail');
  };

  const filteredCorporates = mockCorporates.filter(cp => {
    const matchesSearch =
      cp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || cp.category === categoryFilter;
    const matchesSource = sourceFilter === 'All' || cp.source === sourceFilter;
    return matchesSearch && matchesCategory && matchesSource;
  });

  // Reset to page 1 whenever filters/search change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, categoryFilter, sourceFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCorporates.length / PAGE_SIZE));
  const pagedData = filteredCorporates.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="shrink-0 flex justify-between items-start mb-6 px-4 lg:px-6 animate-card-enter">
        <div>
          <h1 className="text-4xl font-serif text-[#4a3c31] mb-1 flex items-center gap-3">
            <Buildings size={36} className="text-[#947b66]" />
            Corporate Partners.
          </h1>
          <p className="text-[#7d6b5e] text-sm italic font-serif">
            Manage and view all registered corporate accounts and company partners.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openDevModal('Add Company')}
            className="flex items-center gap-2 bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] text-xs font-bold px-4 py-2 rounded-[10px] transition-all shadow-sm cursor-pointer">
            <Buildings size={14} />
            Add Company
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
                <span className="font-semibold text-[#4a3c31]">{filteredCorporates.length}</span> companies
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
                <div className="absolute right-0 top-11 z-50 w-56 bg-[#f3eae1] border border-[#d4c4b7] rounded-xl shadow-lg p-3 animate-in fade-in zoom-in-95 duration-100">
                  <div className="mb-3">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-1">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-white/50 border border-[#d4c4b7] rounded px-3 text-[#4a3c31] outline-none cursor-pointer">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Categories</SelectItem>
                          {ALL_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
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
                          <SelectItem value="Direct">Direct</SelectItem>
                          <SelectItem value="Referral">Referral</SelectItem>
                          <SelectItem value="Email Marketing">Email Marketing</SelectItem>
                          <SelectItem value="Social Media">Social Media</SelectItem>
                          <SelectItem value="Trade Show">Trade Show</SelectItem>
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
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Name</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">E-Mail Address</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Phone</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Categories</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Source</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Owner</th>
                  <th className="px-6 py-3 w-10" />
                </tr>
              </thead>

              <tbody className="divide-y divide-[#d4c4b7]/50 text-xs text-[#4a3c31]">
                {pagedData.length > 0 ? (
                  pagedData.map(cp => (
                    <tr
                      key={cp.id}
                      onClick={() => handleDetail()}
                      className="hover:bg-[#e5d8cb]/40 transition-colors cursor-pointer group"
                    >
                      {/* Name */}
                      <td className="px-6 py-4 font-medium group-hover:text-[#947b66] transition-colors min-w-[200px]">
                        {cp.name}
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-[#586981] min-w-[220px]">
                        {cp.email || <span className="text-[#d4c4b7]">—</span>}
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-[#7d6b5e] min-w-[160px]">
                        {cp.phone || <span className="text-[#d4c4b7]">—</span>}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 min-w-[180px]">
                        {cp.category ? (
                          <span className="px-2 py-1 rounded-full text-[10px] font-medium border bg-[#947b66]/10 backdrop-blur-sm text-[#4a3c31] border-[#947b66]/20">
                            {cp.category}
                          </span>
                        ) : (
                          <span className="text-[#d4c4b7]">—</span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="px-6 py-4 text-[#7d6b5e] italic min-w-[140px]">
                        {cp.source || <span className="text-[#d4c4b7] not-italic">—</span>}
                      </td>

                      {/* Owner */}
                      <td className="px-6 py-4 min-w-[110px]">
                        {cp.owner === 'Unknown' ? (
                          <span className="text-[#d4c4b7] text-[11px]">Unknown</span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#947b66]/20 backdrop-blur-sm border border-[#947b66]/30 flex items-center justify-center text-[8px] font-bold text-[#947b66]">
                              {cp.owner.charAt(0).toUpperCase()}
                            </span>
                            <span className="text-[11px] text-[#7d6b5e]">{cp.owner}</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right relative" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={e => toggleDropdown(cp.id, e)}
                          className="p-1.5 rounded-full hover:bg-[#d4c4b7]/50 text-[#7d6b5e] hover:text-[#4a3c31] transition-colors"
                        >
                          <MenuDots size={18} />
                        </button>

                        {openDropdownId === cp.id && (
                          <div className="absolute right-6 top-10 z-50 w-36 bg-[#f3eae1] border border-[#d4c4b7] rounded-xl shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={e => handleDetail(e)}
                              className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] flex items-center gap-2 transition-colors"
                            >
                              <Eye size={14} className="text-[#947b66]" />
                              View Detail
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); setOpenDropdownId(null); openDevModal('Delete Company'); }}
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
                    <td colSpan={7} className="px-6 py-12 text-center text-[#7d6b5e] text-sm italic">
                      No corporate partners found matching your criteria.
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
              <span className="font-medium text-[#4a3c31]">{Math.min(currentPage * PAGE_SIZE, filteredCorporates.length)}</span>
              {' '}of{' '}
              <span className="font-medium text-[#4a3c31]">{filteredCorporates.length}</span> companies
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
