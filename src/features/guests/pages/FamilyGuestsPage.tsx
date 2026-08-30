import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Magnifer, Filter, MenuDots, Eye, TrashBinTrash } from '@solar-icons/react';
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
import { useToast } from '../../../components/ui/toast';

// Mock data for families
const mockGuests = [
  { id: 'GST-001', name: 'John Anderson (The Anderson Family)', status: 'Confirmed', room: 'TBD', type: 'Gold', arrival: '2027-05-24', departure: '2027-05-30', spend: '$78,460' },
  { id: 'GST-002', name: 'Theodore Laurence', status: 'Arriving', room: '201', type: 'Member', arrival: '2023-10-26', departure: '2023-10-30', spend: '$800' },
  { id: 'GST-003', name: 'Josephine March', status: 'Departed', room: '305', type: 'Standard', arrival: '2023-10-20', departure: '2023-10-25', spend: '$450' },
  { id: 'GST-004', name: 'Amy Curtis', status: 'In House', room: '412', type: 'VIP', arrival: '2023-10-25', departure: '2023-11-02', spend: '$3,100' },
  { id: 'GST-005', name: 'John Brooke', status: 'Arriving', room: '108', type: 'Standard', arrival: '2023-10-27', departure: '2023-10-29', spend: '$300' },
  { id: 'GST-006', name: 'Margaret March', status: 'In House', room: '220', type: 'Member', arrival: '2023-10-22', departure: '2023-10-27', spend: '$920' },
  { id: 'GST-007', name: 'Arthur Pendennis', status: 'Departed', room: '501', type: 'VIP', arrival: '2023-10-18', departure: '2023-10-21', spend: '$2,400' },
  { id: 'GST-008', name: 'Marian Halcombe', status: 'In House', room: '315', type: 'Standard', arrival: '2023-10-25', departure: '2023-10-31', spend: '$1,050' },
  { id: 'GST-009', name: 'Walter Hartright', status: 'Arriving', room: '402', type: 'Member', arrival: '2023-10-28', departure: '2023-11-05', spend: '$1,800' },
  { id: 'GST-010', name: 'Laura Fairlie', status: 'In House', room: '110', type: 'VIP', arrival: '2023-10-20', departure: '2023-10-26', spend: '$2,100' },
];

export function FamilyGuestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const navigate = useNavigate();
  const toast = useToast();

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handlePreview = (id: string) => {
    if (id === 'GST-001') {
      navigate(`/dashboard/guests/family/${id}`);
    } else {
      toast.error(
        'Data Not Found',
        `Detail data for guest ${id} cannot be displayed because the profile data is not yet available in the system.`,
        4000
      );
    }
  };

  const formatGuestName = (name: string) => {
    if (name.includes('Family')) {
      return name;
    }
    const parts = name.split(' ');
    const lastName = parts[parts.length - 1];
    return `${name} (The ${lastName} Family)`;
  };

  const filteredGuests = mockGuests.filter(guest => {
    const displayName = formatGuestName(guest.name);
    const matchesSearch = displayName.toLowerCase().includes(searchTerm.toLowerCase()) || guest.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || guest.status === statusFilter;
    const matchesType = typeFilter === 'All' || guest.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In House': return 'bg-zinc-100 text-zinc-900 border-zinc-200';
      case 'Arriving': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Departed': return 'bg-zinc-100 text-zinc-500 border-zinc-200';
      case 'Confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-start mb-5 animate-card-enter">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 leading-tight mb-0.5">
            Family Directory
          </h1>
          <p className="text-zinc-500 text-xs font-normal">
            Manage and view all registered guest family profiles
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col">
        {/* Table Container Card */}
        <div className="flex-1 flex flex-col rounded-[12px] bg-white/70 backdrop-blur-xs border border-zinc-200/80 shadow-xs overflow-hidden animate-card-enter" style={{ animationDelay: '0.1s' }}>
          {/* Toolbar */}
          <div className="p-3.5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <div className="relative w-72">
              <Magnifer size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search families by name or ID..."
                className="pl-9 h-8.5 bg-white border-zinc-200 text-zinc-900 focus-visible:ring-zinc-400 rounded-lg text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 relative">
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
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Arriving">Arriving</SelectItem>
                          <SelectItem value="In House">In House</SelectItem>
                          <SelectItem value="Departed">Departed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-zinc-50 border border-zinc-200 rounded px-2.5 text-zinc-800 outline-none cursor-pointer">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Types</SelectItem>
                          <SelectItem value="VIP">VIP</SelectItem>
                          <SelectItem value="Gold">Gold</SelectItem>
                          <SelectItem value="Member">Member</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
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
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Guest ID</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Name</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Status</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Room</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Type</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Arrival</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Departure</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400 text-right">Spend YTD</th>
                  <th className="px-5 py-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
                {filteredGuests.length > 0 ? (
                  filteredGuests.map((guest) => (
                    <tr
                      key={guest.id}
                      onClick={() => handlePreview(guest.id)}
                      className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3 font-mono text-[10.5px] text-zinc-500 group-hover:text-zinc-900 transition-colors">{guest.id}</td>
                      <td className="px-5 py-3 font-medium text-zinc-900 group-hover:text-zinc-900 transition-colors">{formatGuestName(guest.name)}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${getStatusColor(guest.status)}`}>
                          {guest.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-700">{guest.room}</td>
                      <td className="px-5 py-3">
                        <span className="text-[10px] text-zinc-500 font-medium">{guest.type}</span>
                      </td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{guest.arrival}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{guest.departure}</td>
                      <td className="px-5 py-3 text-right font-medium text-zinc-900">{guest.spend}</td>
                      <td className="px-5 py-3 text-right relative">
                        <button
                          onClick={(e) => toggleDropdown(guest.id, e)}
                          className="p-1 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors"
                        >
                          <MenuDots size={16} />
                        </button>

                        {openDropdownId === guest.id && (
                          <div className="absolute right-5 top-9 z-50 w-32 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            <button onClick={() => handlePreview(guest.id)} className="w-full px-3 py-1.5 text-left text-xs text-zinc-800 hover:bg-zinc-50 flex items-center gap-2 transition-colors">
                              <Eye size={13} className="text-zinc-500" /> Preview
                            </button>
                            <button className="w-full px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors">
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
                      No guests found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-3 border-t border-zinc-100 flex justify-between items-center bg-zinc-50/50 text-[10px] text-zinc-500">
            <span>Showing <span className="font-medium text-zinc-900">{filteredGuests.length}</span> of <span className="font-medium text-zinc-900">{mockGuests.length}</span> families</span>
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
