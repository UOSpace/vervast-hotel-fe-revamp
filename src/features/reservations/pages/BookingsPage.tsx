import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Magnifer, Filter } from '@solar-icons/react';
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

// Mock data for Reservations Bookings
const mockBookings = [
  {
    id: 'BK-001',
    bookingName: 'BK-Sal Zanjabila-SEA-21062026',
    bookingStatus: 'Fully Paid',
    crsNo: '1112552',
    revenue: '$5,000.00',
    companies: 'Sal Industry',
    totalCompanies: 1,
    status: 'Open',
    bookingOwner: 'Alpha',
    arrivalDate: 'June 25, 2026',
    arrival: 'June 25, 2026',
    departureDate: 'June 29, 2026',
    departure: 'June 29, 2026',
    totalContacts: 1,
    contacts: 'Sal Zanjabila'
  },
  {
    id: 'BK-002',
    bookingName: 'Martin Fuentes-2024-07-31-2024-08-08-Hotel A',
    bookingStatus: 'C/I',
    crsNo: '350971494',
    revenue: '$6,846.77',
    companies: 'Skyline Tours',
    totalCompanies: 1,
    status: 'Open',
    bookingOwner: 'vervast',
    arrivalDate: 'October 18, 2025',
    arrival: 'October 18, 2025',
    departureDate: 'October 24, 2025',
    departure: 'October 24, 2025',
    totalContacts: 1,
    contacts: 'Martin Fuentes'
  },
  {
    id: 'BK-003',
    bookingName: 'Elizabeth Hall-2024-07-12-2024-07-22-Hotel A',
    bookingStatus: 'C/I',
    crsNo: '350971494',
    revenue: '$4,612.49',
    companies: 'Skyline Tours',
    totalCompanies: 1,
    status: 'Open',
    bookingOwner: 'vervast',
    arrivalDate: 'October 17, 2025',
    arrival: 'October 17, 2025',
    departureDate: 'October 20, 2025',
    departure: 'October 20, 2025',
    totalContacts: 1,
    contacts: 'Elizabeth Hall'
  },
  {
    id: 'BK-004',
    bookingName: 'Martin Fuentes-2024-08-08-2024-08-10-Hotel A',
    bookingStatus: 'C/O',
    crsNo: '350971494',
    revenue: '$5,444.60',
    companies: 'N/A',
    totalCompanies: 0,
    status: 'Open',
    bookingOwner: 'vervast',
    arrivalDate: 'October 19, 2025',
    arrival: 'October 19, 2025',
    departureDate: 'October 25, 2025',
    departure: 'October 25, 2025',
    totalContacts: 1,
    contacts: 'Martin Fuentes'
  },
  {
    id: 'BK-005',
    bookingName: 'Thomas Bailey-2024-05-09-2024-05-13-Hotel A',
    bookingStatus: 'C/I',
    crsNo: '351014436',
    revenue: '$870.07',
    companies: 'Voyage Pro, Discovery Travel',
    totalCompanies: 2,
    status: 'Open',
    bookingOwner: 'Gama',
    arrivalDate: 'October 20, 2025',
    arrival: 'October 20, 2025',
    departureDate: 'October 27, 2025',
    departure: 'October 27, 2025',
    totalContacts: 1,
    contacts: 'Thomas Bailey'
  },
  {
    id: 'BK-006',
    bookingName: 'Rosa Rios-2024-04-26-2024-04-29-Hotel A',
    bookingStatus: 'C/I',
    crsNo: '351101834',
    revenue: '$5,084.32',
    companies: 'Route Planners',
    totalCompanies: 1,
    status: 'Open',
    bookingOwner: 'Beta',
    arrivalDate: 'October 21, 2025',
    arrival: 'October 21, 2025',
    departureDate: 'October 28, 2025',
    departure: 'October 28, 2025',
    totalContacts: 1,
    contacts: 'Rosa Rios'
  },
  {
    id: 'BK-007',
    bookingName: 'Elizabeth Johnson-2024-02-05-2024-02-08-Hotel A',
    bookingStatus: 'C/I',
    crsNo: '351147384',
    revenue: '$5,481.93',
    companies: 'Journey Makers',
    totalCompanies: 1,
    status: 'Open',
    bookingOwner: 'Beta',
    arrivalDate: 'October 16, 2025',
    arrival: 'October 16, 2025',
    departureDate: 'October 20, 2025',
    departure: 'October 20, 2025',
    totalContacts: 1,
    contacts: 'Elizabeth Johnson'
  },
  {
    id: 'BK-008',
    bookingName: 'Scott Anderson-2024-05-21-2024-05-25-Hotel A',
    bookingStatus: 'C/I',
    crsNo: '351241132',
    revenue: '$3,775.55',
    companies: 'Travel Genius',
    totalCompanies: 1,
    status: 'Open',
    bookingOwner: 'Gama',
    arrivalDate: 'October 17, 2025',
    arrival: 'October 17, 2025',
    departureDate: 'October 23, 2025',
    departure: 'October 23, 2025',
    totalContacts: 1,
    contacts: 'Scott Anderson'
  },
  {
    id: 'BK-009',
    bookingName: 'Ramon Ortiz-2024-03-29-2024-04-01-Hotel A',
    bookingStatus: 'C/O',
    crsNo: '351239175',
    revenue: '$6,165.68',
    companies: 'N/A',
    totalCompanies: 0,
    status: 'Open',
    bookingOwner: 'Beta',
    arrivalDate: 'October 18, 2025',
    arrival: 'October 18, 2025',
    departureDate: 'October 24, 2025',
    departure: 'October 24, 2025',
    totalContacts: 1,
    contacts: 'Ramon Ortiz'
  },
  {
    id: 'BK-010',
    bookingName: 'Pilar Soto-2024-04-03-2024-04-04-Hotel A',
    bookingStatus: 'C/O',
    crsNo: '9995513',
    revenue: '$3,659.63',
    companies: 'N/A',
    totalCompanies: 0,
    status: 'Open',
    bookingOwner: 'vervast',
    arrivalDate: 'October 19, 2025',
    arrival: 'October 19, 2025',
    departureDate: 'October 23, 2025',
    departure: 'October 23, 2025',
    totalContacts: 1,
    contacts: 'Pilar Soto'
  },
  {
    id: 'BK-011',
    bookingName: 'Pilar Soto-2024-04-03-2024-04-04-Hotel A',
    bookingStatus: 'C/O',
    crsNo: '9995513',
    revenue: '$3,705.81',
    companies: 'N/A',
    totalCompanies: 0,
    status: 'Open',
    bookingOwner: 'vervast',
    arrivalDate: 'October 20, 2025',
    arrival: 'October 20, 2025',
    departureDate: 'October 25, 2025',
    departure: 'October 25, 2025',
    totalContacts: 1,
    contacts: 'Pilar Soto'
  },
  {
    id: 'BK-012',
    bookingName: 'Ramon Ortiz-2024-06-29-2024-07-09-Hotel A',
    bookingStatus: 'C/O',
    crsNo: '351384398',
    revenue: '$8,046.39',
    companies: 'N/A',
    totalCompanies: 0,
    status: 'Open',
    bookingOwner: 'Gama',
    arrivalDate: 'October 21, 2025',
    arrival: 'October 21, 2025',
    departureDate: 'October 26, 2025',
    departure: 'October 26, 2025',
    totalContacts: 1,
    contacts: 'Ramon Ortiz'
  },
  {
    id: 'BK-013',
    bookingName: 'Ramon Ortiz-2024-01-22-2024-01-26-Hotel A',
    bookingStatus: 'C/O',
    crsNo: '351390668',
    revenue: '$8,293.15',
    companies: 'N/A',
    totalCompanies: 0,
    status: 'Open',
    bookingOwner: 'Beta',
    arrivalDate: 'October 16, 2025',
    arrival: 'October 16, 2025',
    departureDate: 'October 23, 2025',
    departure: 'October 23, 2025',
    totalContacts: 1,
    contacts: 'Ramon Ortiz'
  },
  {
    id: 'BK-014',
    bookingName: 'Paula Navarro-2024-01-22-2024-01-25-Hotel A',
    bookingStatus: 'C/I',
    crsNo: '351390668',
    revenue: '$2,605.26',
    companies: 'Skyline Tours, Travel Genius',
    totalCompanies: 2,
    status: 'Open',
    bookingOwner: 'Beta',
    arrivalDate: 'October 17, 2025',
    arrival: 'October 17, 2025',
    departureDate: 'October 23, 2025',
    departure: 'October 23, 2025',
    totalContacts: 1,
    contacts: 'Paula Navarro'
  },
  {
    id: 'BK-015',
    bookingName: 'Sandra Morgan-2024-03-01-2024-03-04-Hotel A',
    bookingStatus: 'C/I',
    crsNo: '351573538',
    revenue: '$6,221.49',
    companies: 'Journey Makers',
    totalCompanies: 1,
    status: 'Open',
    bookingOwner: 'Beta',
    arrivalDate: 'October 19, 2025',
    arrival: 'October 19, 2025',
    departureDate: 'October 22, 2025',
    departure: 'October 22, 2025',
    totalContacts: 1,
    contacts: 'Sandra Morgan'
  },
  {
    id: 'BK-016',
    bookingName: 'Hector Aguilar-2024-04-12-2024-04-19-Hotel A',
    bookingStatus: 'C/I',
    crsNo: '351600245',
    revenue: '$8,647.50',
    companies: 'Expedition World',
    totalCompanies: 1,
    status: 'Open',
    bookingOwner: 'Beta',
    arrivalDate: 'October 20, 2025',
    arrival: 'October 20, 2025',
    departureDate: 'October 25, 2025',
    departure: 'October 25, 2025',
    totalContacts: 1,
    contacts: 'Hector Aguilar'
  },
  {
    id: 'BK-017',
    bookingName: 'Diana Cortez-2024-02-23-2024-03-02-Hotel A',
    bookingStatus: 'C/O',
    crsNo: '351616450',
    revenue: '$2,955.91',
    companies: 'N/A',
    totalCompanies: 0,
    status: 'Open',
    bookingOwner: 'vervast',
    arrivalDate: 'October 21, 2025',
    arrival: 'October 21, 2025',
    departureDate: 'October 26, 2025',
    departure: 'October 26, 2025',
    totalContacts: 1,
    contacts: 'Diana Cortez'
  },
  {
    id: 'BK-018',
    bookingName: 'Hector Aguilar-2024-04-13-2024-04-19-Hotel A',
    bookingStatus: 'C/O',
    crsNo: '351600245',
    revenue: '$1,556.79',
    companies: 'Expedition World',
    totalCompanies: 1,
    status: 'Open',
    bookingOwner: 'Beta',
    arrivalDate: 'October 16, 2025',
    arrival: 'October 16, 2025',
    departureDate: 'October 22, 2025',
    departure: 'October 22, 2025',
    totalContacts: 1,
    contacts: 'Hector Aguilar'
  },
  {
    id: 'BK-019',
    bookingName: 'Victoria Carrillo-2024-04-24-2024-04-30-Hotel A',
    bookingStatus: 'C/O',
    crsNo: '351600245',
    revenue: '$9,496.69',
    companies: 'Travel Genius',
    totalCompanies: 1,
    status: 'Open',
    bookingOwner: 'Beta',
    arrivalDate: 'October 17, 2025',
    arrival: 'October 17, 2025',
    departureDate: 'October 22, 2025',
    departure: 'October 22, 2025',
    totalContacts: 1,
    contacts: 'Victoria Carrillo'
  },
  {
    id: 'BK-020',
    bookingName: 'Hector Aguilar-2024-04-23-2024-04-24-Hotel A',
    bookingStatus: 'C/I',
    crsNo: '351600245',
    revenue: '$2,213.73',
    companies: 'Expedition World',
    totalCompanies: 1,
    status: 'Open',
    bookingOwner: 'Beta',
    arrivalDate: 'October 18, 2025',
    arrival: 'October 18, 2025',
    departureDate: 'October 21, 2025',
    departure: 'October 21, 2025',
    totalContacts: 1,
    contacts: 'Hector Aguilar'
  }
];

export function BookingsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch =
      booking.bookingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contacts.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.crsNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || booking.bookingStatus === statusFilter;
    const matchesOwner = ownerFilter === 'All' || booking.bookingOwner === ownerFilter;
    
    return matchesSearch && matchesStatus && matchesOwner;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'Fully Paid': return 'bg-green-500/10 text-green-800 border-green-500/20';
      case 'C/I': return 'bg-blue-500/10 text-blue-800 border-blue-500/20';
      case 'C/O': return 'bg-gray-500/10 text-gray-800 border-gray-500/20';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-start mb-6 px-4 lg:px-6 animate-card-enter">
        <div>
          <h1 className="text-4xl font-serif text-[#4a3c31] mb-1 flex items-center gap-3">
            <Calendar size={36} className="text-[#947b66]" />
            Reservations Bookings.
          </h1>
          <p className="text-[#7d6b5e] text-sm italic font-serif">Manage and track reservations bookings records.</p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col px-4 lg:px-6 pb-6">

        {/* Table Container */}
        <div className="flex-1 flex flex-col border border-[#d4c4b7] rounded-[12px] bg-[#f3eae1]/30 backdrop-blur-sm overflow-hidden animate-card-enter" style={{ animationDelay: '0.1s' }}>

          {/* Toolbar */}
          <div className="p-4 border-b border-[#d4c4b7] flex justify-between items-center bg-[#f3eae1]/50">
            <div className="relative w-80">
              <Magnifer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#947b66]" />
              <Input
                placeholder="Search bookings by name, contact, or CRS..."
                className="pl-9 h-9 bg-white/50 border-[#d4c4b7] text-[#4a3c31] focus-visible:ring-[#947b66] rounded-[8px] text-xs"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
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
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-1">Booking Status</label>
                    <Select value={statusFilter} onValueChange={(val) => {
                      setStatusFilter(val);
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-full h-8 text-xs bg-white/50 border border-[#d4c4b7] rounded px-3 text-[#4a3c31] outline-none cursor-pointer">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Statuses</SelectItem>
                          <SelectItem value="Fully Paid">Fully Paid</SelectItem>
                          <SelectItem value="C/I">C/I</SelectItem>
                          <SelectItem value="C/O">C/O</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-1">Booking Owner</label>
                    <Select value={ownerFilter} onValueChange={(val) => {
                      setOwnerFilter(val);
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-full h-8 text-xs bg-white/50 border border-[#d4c4b7] rounded px-3 text-[#4a3c31] outline-none cursor-pointer">
                        <SelectValue placeholder="All Owners" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Owners</SelectItem>
                          <SelectItem value="vervast">vervast</SelectItem>
                          <SelectItem value="Alpha">Alpha</SelectItem>
                          <SelectItem value="Beta">Beta</SelectItem>
                          <SelectItem value="Gama">Gama</SelectItem>
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
            <table className="w-full text-left border-collapse min-w-[1750px]">
              <thead className="sticky top-0 bg-[#f3eae1] border-b border-[#d4c4b7] z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-center w-12">#</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Booking Name</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-center">Booking Status</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">CRS No.</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-right">Final Total Revenue</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Companies</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-center">Total Companies</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-center">Status</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Booking Owner</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Arrival Date</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Arrival</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Departure Date</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Departure</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-center">Total Contacts</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Contacts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4c4b7]/50 text-xs text-[#4a3c31]">
                {paginatedBookings.length > 0 ? (
                  paginatedBookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      onClick={() => navigate(`/dashboard/reservations/bookings/${booking.id}`)}
                      className="hover:bg-[#e5d8cb]/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-4 text-center font-medium text-[#7d6b5e] whitespace-nowrap">{startIndex + index + 1}</td>
                      <td className="px-4 py-4 font-medium group-hover:text-[#947b66] transition-colors whitespace-nowrap">{booking.bookingName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border whitespace-nowrap inline-flex items-center justify-center ${getBookingStatusColor(booking.bookingStatus)}`}>
                          {booking.bookingStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono text-[11px] whitespace-nowrap">{booking.crsNo}</td>
                      <td className="px-4 py-4 text-right font-medium whitespace-nowrap">{booking.revenue}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-[#7d6b5e]">{booking.companies}</td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">{booking.totalCompanies}</td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium border border-blue-200/50 bg-blue-50 text-blue-800 whitespace-nowrap inline-flex items-center justify-center">
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">{booking.bookingOwner}</td>
                      <td className="px-4 py-4 text-[#7d6b5e] whitespace-nowrap">{booking.arrivalDate}</td>
                      <td className="px-4 py-4 text-[#7d6b5e] whitespace-nowrap">{booking.arrival}</td>
                      <td className="px-4 py-4 text-[#7d6b5e] whitespace-nowrap">{booking.departureDate}</td>
                      <td className="px-4 py-4 text-[#7d6b5e] whitespace-nowrap">{booking.departure}</td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">{booking.totalContacts}</td>
                      <td className="px-4 py-4 font-medium whitespace-nowrap">{booking.contacts}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={15} className="px-4 py-12 text-center text-[#7d6b5e] text-sm italic">
                      No bookings found matching your criteria.
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
              <span className="font-medium text-[#4a3c31]">
                {filteredBookings.length === 0 ? 0 : startIndex + 1}
              </span>{' '}
              -{' '}
              <span className="font-medium text-[#4a3c31]">
                {Math.min(startIndex + itemsPerPage, filteredBookings.length)}
              </span>{' '}
              of <span className="font-medium text-[#4a3c31]">{filteredBookings.length}</span> bookings
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 text-[#4a3c31] hover:bg-[#d4c4b7]/30 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-7 w-7 p-0 text-xs rounded-full ${
                    currentPage === pageNum
                      ? 'bg-[#947b66] text-white hover:bg-[#7d6b5e]'
                      : 'text-[#4a3c31] hover:bg-[#d4c4b7]/30'
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 text-[#4a3c31] hover:bg-[#d4c4b7]/30 ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

