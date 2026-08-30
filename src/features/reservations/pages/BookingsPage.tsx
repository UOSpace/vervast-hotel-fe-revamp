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

// Mock data for Bookings
const mockBookings = [
  {
    id: 'BK-001',
    bookingName: 'Sal Zanjabila Stay',
    bookingStatus: 'Confirmed',
    crsNo: 'CRS-1112552',
    revenue: '$5,000.00',
    companies: 'Sal Industry',
    arrivalDate: 'Jun 25, 2026',
    departureDate: 'Jun 29, 2026',
    contacts: 'Sal Zanjabila'
  },
  {
    id: 'BK-002',
    bookingName: 'Martin Fuentes Luxury Retreat',
    bookingStatus: 'In House',
    crsNo: 'CRS-350971494',
    revenue: '$6,846.77',
    companies: 'Skyline Tours',
    arrivalDate: 'Oct 18, 2025',
    departureDate: 'Oct 24, 2025',
    contacts: 'Martin Fuentes'
  },
  {
    id: 'BK-003',
    bookingName: 'Elizabeth Hall Ocean Suite',
    bookingStatus: 'In House',
    crsNo: 'CRS-350971495',
    revenue: '$4,612.49',
    companies: 'Skyline Tours',
    arrivalDate: 'Oct 17, 2025',
    departureDate: 'Oct 20, 2025',
    contacts: 'Elizabeth Hall'
  },
  {
    id: 'BK-004',
    bookingName: 'Martin Fuentes Alpine Stay',
    bookingStatus: 'Departed',
    crsNo: 'CRS-350971496',
    revenue: '$5,444.60',
    companies: 'Direct',
    arrivalDate: 'Oct 19, 2025',
    departureDate: 'Oct 25, 2025',
    contacts: 'Martin Fuentes'
  },
  {
    id: 'BK-005',
    bookingName: 'Thomas Bailey Family Vacation',
    bookingStatus: 'Confirmed',
    crsNo: 'CRS-351014436',
    revenue: '$8,700.00',
    companies: 'Discovery Travel',
    arrivalDate: 'Oct 20, 2025',
    departureDate: 'Oct 27, 2025',
    contacts: 'Thomas Bailey'
  },
  {
    id: 'BK-006',
    bookingName: 'Rosa Rios Wellness Booking',
    bookingStatus: 'In House',
    crsNo: 'CRS-351101834',
    revenue: '$5,084.32',
    companies: 'Route Planners',
    arrivalDate: 'Oct 21, 2025',
    departureDate: 'Oct 28, 2025',
    contacts: 'Rosa Rios'
  },
];

export function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handlePreview = (id: string) => {
    navigate(`/dashboard/reservations/bookings/${id}`);
  };

  const filteredBookings = mockBookings.filter(bk => {
    const matchesSearch =
      bk.bookingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.contacts.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.crsNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || bk.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In House': return 'bg-zinc-100 text-zinc-900 border-zinc-200';
      case 'Departed': return 'bg-zinc-100 text-zinc-500 border-zinc-200';
      case 'Canceled': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-start mb-5 animate-card-enter">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 leading-tight mb-0.5">
            Confirmed Bookings
          </h1>
          <p className="text-zinc-500 text-xs font-normal">
            Manage reservation records, arrival schedules, and folio billing
          </p>
        </div>
        <button
          onClick={() => handlePreview('BK-001')}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-xs cursor-pointer">
          <AddSquare size={14} />
          Create New Booking
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
                placeholder="Search bookings by name, CRS, or guest…"
                className="pl-9 h-8.5 bg-white border-zinc-200 text-zinc-900 focus-visible:ring-zinc-400 rounded-lg text-xs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 relative">
              <span className="text-xs text-zinc-500 mr-1">
                <span className="font-medium text-zinc-900">{filteredBookings.length}</span> bookings
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
                    <label className="block text-[9.5px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-zinc-50 border border-zinc-200 rounded px-2.5 text-zinc-800 outline-none cursor-pointer">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Statuses</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="In House">In House</SelectItem>
                          <SelectItem value="Departed">Departed</SelectItem>
                          <SelectItem value="Canceled">Canceled</SelectItem>
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
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Booking ID</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Booking Name</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Status</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">CRS Number</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Company</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Arrival</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Departure</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400 text-right">Revenue</th>
                  <th className="px-5 py-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map(bk => (
                    <tr
                      key={bk.id}
                      onClick={() => handlePreview(bk.id)}
                      className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3 font-mono text-[10.5px] text-zinc-500 group-hover:text-zinc-900 transition-colors">{bk.id}</td>
                      <td className="px-5 py-3 font-medium text-zinc-900 group-hover:text-zinc-900 transition-colors">{bk.bookingName}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${getStatusColor(bk.bookingStatus)}`}>
                          {bk.bookingStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-[10px] text-zinc-500">{bk.crsNo}</td>
                      <td className="px-5 py-3 text-zinc-600 text-[10px]">{bk.companies}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{bk.arrivalDate}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{bk.departureDate}</td>
                      <td className="px-5 py-3 text-right font-medium text-zinc-900">{bk.revenue}</td>
                      <td className="px-5 py-3 text-right relative" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={e => toggleDropdown(bk.id, e)}
                          className="p-1 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors"
                        >
                          <MenuDots size={16} />
                        </button>

                        {openDropdownId === bk.id && (
                          <div className="absolute right-5 top-9 z-50 w-32 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={() => handlePreview(bk.id)}
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
                    <td colSpan={9} className="px-5 py-10 text-center text-zinc-400 text-xs italic">
                      No bookings found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-zinc-100 flex justify-between items-center bg-zinc-50/50 text-[10px] text-zinc-500">
            <span>Showing <span className="font-medium text-zinc-900">{filteredBookings.length}</span> of <span className="font-medium text-zinc-900">{mockBookings.length}</span> bookings</span>
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
