import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    phone: '-',
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
    email: '-',
    phone: '-',
    category: 'Logistics',
    source: '-',
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
];

export function CorporatePage() {
  const navigate = useNavigate();
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

  const handleRowClick = (id: string) => {
    navigate(`/dashboard/partners/corporate/${id}`);
  };

  const filteredCorporates = mockCorporates.filter(corp => {
    const matchesSearch =
      corp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      corp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      corp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || corp.category === categoryFilter;
    const matchesSource = sourceFilter === 'All' || corp.source === sourceFilter;
    return matchesSearch && matchesCategory && matchesSource;
  });

  useEffect(() => { setCurrentPage(1); }, [searchTerm, categoryFilter, sourceFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCorporates.length / PAGE_SIZE));
  const pagedData = filteredCorporates.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-start mb-5 animate-card-enter">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 leading-tight mb-0.5">
            Corporate Accounts
          </h1>
          <p className="text-zinc-500 text-xs font-normal">
            Manage and view enterprise accounts, retreat clients, and corporate partners
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openDevModal('Add Corporate Account')}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-xs cursor-pointer">
            <Buildings size={14} />
            Add Corporate Account
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
                placeholder="Search by company name, email, or ID…"
                className="pl-9 h-8.5 bg-white border-zinc-200 text-zinc-900 focus-visible:ring-zinc-400 rounded-lg text-xs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 relative">
              <span className="text-xs text-zinc-500 mr-1">
                <span className="font-medium text-zinc-900">{filteredCorporates.length}</span> companies
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
                    <label className="block text-[9.5px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-zinc-50 border border-zinc-200 rounded px-2.5 text-zinc-800 outline-none cursor-pointer">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Categories</SelectItem>
                          <SelectItem value="Financial Services">Financial Services</SelectItem>
                          <SelectItem value="Consulting">Consulting</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Energy">Energy</SelectItem>
                          <SelectItem value="Media & Entertainment">Media & Entertainment</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
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
                          <SelectItem value="Email Marketing">Email Marketing</SelectItem>
                          <SelectItem value="Referral">Referral</SelectItem>
                          <SelectItem value="Social Media">Social Media</SelectItem>
                          <SelectItem value="Trade Show">Trade Show</SelectItem>
                          <SelectItem value="Direct">Direct</SelectItem>
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
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Account ID</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Company Name</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Email Address</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Phone</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Category</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Source</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Owner</th>
                  <th className="px-5 py-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
                {pagedData.length > 0 ? (
                  pagedData.map(corp => (
                    <tr
                      key={corp.id}
                      onClick={() => handleRowClick(corp.id)}
                      className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3 font-mono text-[10.5px] text-zinc-500 group-hover:text-zinc-900 transition-colors">{corp.id}</td>
                      <td className="px-5 py-3 font-medium text-zinc-900 group-hover:text-zinc-900 transition-colors">{corp.name}</td>
                      <td className="px-5 py-3 text-zinc-600 text-[10px]">{corp.email}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{corp.phone}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {corp.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{corp.source}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{corp.owner}</td>
                      <td className="px-5 py-3 text-right relative" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={e => toggleDropdown(corp.id, e)}
                          className="p-1 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors"
                        >
                          <MenuDots size={16} />
                        </button>

                        {openDropdownId === corp.id && (
                          <div className="absolute right-5 top-9 z-50 w-32 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={() => handleRowClick(corp.id)}
                              className="w-full px-3 py-1.5 text-left text-xs text-zinc-800 hover:bg-zinc-50 flex items-center gap-2 transition-colors"
                            >
                              <Eye size={13} className="text-zinc-500" /> Detail
                            </button>
                            <button
                              onClick={() => { setOpenDropdownId(null); openDevModal('Delete Corporate Account'); }}
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
                      No corporate accounts found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-zinc-100 flex justify-between items-center bg-zinc-50/50 text-[10px] text-zinc-500">
            <span>
              Showing <span className="font-medium text-zinc-900">{pagedData.length}</span> of <span className="font-medium text-zinc-900">{filteredCorporates.length}</span> companies
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
