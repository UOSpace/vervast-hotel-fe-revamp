import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsersGroupTwoRounded, Magnifer, Filter, MenuDots, Eye, TrashBinTrash } from '@solar-icons/react';
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

// Mock data for guests table
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

export function GuestsPage() {
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
      navigate(`${window.location.pathname}/${id}`);
    } else {
      toast.error(
        'Data Not Found',
        `Detail data for guest ${id} cannot be displayed because the profile data is not yet available in the system.`,
        4000
      );
    }
  };

  const formatGuestName = (name: string) => {
    if (!window.location.pathname.includes('/family')) {
      return name;
    }
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
      case 'In House': return 'bg-[#947b66]/20 backdrop-blur-sm text-[#4a3c31] border-[#947b66]/30';
      case 'Arriving': return 'bg-[#C8A050]/20 text-[#7a5e2a] border-[#C8A050]/30';
      case 'Departed': return 'bg-[#7d6b5e]/20 text-[#4a3c31] border-[#7d6b5e]/30';
      case 'Confirmed': return 'bg-blue-500/10 text-blue-800 border-blue-500/20';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-start mb-6 px-4 lg:px-6 animate-card-enter">
        <div>
          <h1 className="text-4xl font-serif text-[#4a3c31] mb-1 flex items-center gap-3">
            <UsersGroupTwoRounded size={36} className="text-[#947b66]" />
            Guest Directory.
          </h1>
          <p className="text-[#7d6b5e] text-sm italic font-serif">Manage and view all guest interactions.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Additional actions like "New Guest" could go here */}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col px-4 lg:px-6 pb-6">

        {/* Table Container */}
        <div className="flex-1 flex flex-col border border-[#d4c4b7] rounded-[12px] backdrop-blur-sm bg-[#f3eae1]/0  overflow-hidden animate-card-enter" style={{ animationDelay: '0.1s' }}>

          {/* Toolbar */}
          <div className="p-4 border-b border-[#d4c4b7] flex justify-between items-center bg-[#f3eae1]/50">
            <div className="relative w-72">
              <Magnifer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#947b66]" />
              <Input
                placeholder="Search guests by name or ID..."
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
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-1">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-white/50 border border-[#d4c4b7] rounded px-3 text-[#4a3c31] outline-none cursor-pointer">
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
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-1">Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-white/50 border border-[#d4c4b7] rounded px-3 text-[#4a3c31] outline-none cursor-pointer">
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
          <div className="flex-1 overflow-auto custom-scrollbar bg-white/20">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#f3eae1] border-b border-[#d4c4b7] z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Guest ID</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Name</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Room</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Type</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Arrival</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e]">Departure</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] text-right">Spend YTD</th>
                  <th className="px-6 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4c4b7]/50 text-xs text-[#4a3c31]">
                {filteredGuests.length > 0 ? (
                  filteredGuests.map((guest) => (
                    <tr
                      key={guest.id}
                      onClick={() => handlePreview(guest.id)}
                      className="hover:bg-[#e5d8cb]/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-mono text-[11px] text-[#947b66] group-hover:text-[#4a3c31] transition-colors">{guest.id}</td>
                      <td className="px-6 py-4 font-medium group-hover:text-[#947b66] transition-colors">{formatGuestName(guest.name)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium border ${getStatusColor(guest.status)}`}>
                          {guest.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{guest.room}</td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] italic text-[#7d6b5e]">{guest.type}</span>
                      </td>
                      <td className="px-6 py-4 text-[#7d6b5e]">{guest.arrival}</td>
                      <td className="px-6 py-4 text-[#7d6b5e]">{guest.departure}</td>
                      <td className="px-6 py-4 text-right font-medium">{guest.spend}</td>
                      <td className="px-6 py-4 text-right relative">
                        <button
                          onClick={(e) => toggleDropdown(guest.id, e)}
                          className="p-1.5 rounded-full hover:bg-[#d4c4b7]/50 text-[#7d6b5e] hover:text-[#4a3c31] transition-colors"
                        >
                          <MenuDots size={18} />
                        </button>

                        {openDropdownId === guest.id && (
                          <div className="absolute right-6 top-10 z-50 w-36 bg-[#f3eae1] border border-[#d4c4b7] rounded-xl shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            <button onClick={() => handlePreview(guest.id)} className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] flex items-center gap-2 transition-colors">
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
                    <td colSpan={9} className="px-6 py-12 text-center text-[#7d6b5e] text-sm italic">
                      No guests found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-3 border-t border-[#d4c4b7] flex justify-between items-center bg-[#f3eae1]/80 text-xs text-[#7d6b5e]">
            <span>Showing <span className="font-medium text-[#4a3c31]">{filteredGuests.length}</span> of <span className="font-medium text-[#4a3c31]">{mockGuests.length}</span> guests</span>
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
