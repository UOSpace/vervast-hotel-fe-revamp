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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const navigate = useNavigate();

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const pagedBookings = filteredBookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
          <h1 className="text-2xl font-bold text-zinc-900 tracking-wide mb-0.5">
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
        <TableContainer style={{ animationDelay: '0.1s' }}>
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
          <TableScrollArea>
            <Table>
              <TableHeader>
                <TableRow clickable={false}>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Booking Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>CRS Number</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead align="right">Revenue</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedBookings.length > 0 ? (
                  pagedBookings.map(bk => (
                    <TableRow
                      key={bk.id}
                      onClick={() => handlePreview(bk.id)}
                    >
                      <TableCell className="font-mono text-[10.5px] text-zinc-500 group-hover:text-zinc-900 transition-colors">{bk.id}</TableCell>
                      <TableCell className="font-medium text-zinc-900 group-hover:text-zinc-900 transition-colors">{bk.bookingName}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${getStatusColor(bk.bookingStatus)}`}>
                          {bk.bookingStatus}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-zinc-500">{bk.crsNo}</TableCell>
                      <TableCell className="text-zinc-600 text-[10px]">{bk.companies}</TableCell>
                      <TableCell className="text-zinc-500 text-[10px]">{bk.arrivalDate}</TableCell>
                      <TableCell className="text-zinc-500 text-[10px]">{bk.departureDate}</TableCell>
                      <TableCell align="right" className="font-medium text-zinc-900">{bk.revenue}</TableCell>
                      <TableCell align="right" onClick={e => e.stopPropagation()}>
                        <TableActionMenu
                          items={[
                            {
                              label: 'View Detail',
                              icon: <Eye size={13} className="text-zinc-500" />,
                              onClick: () => handlePreview(bk.id),
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
                  <TableEmpty colSpan={9} message="No bookings found matching your criteria." />
                )}
              </TableBody>
            </Table>
          </TableScrollArea>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBookings.length}
            itemsPerPage={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="bookings"
          />
        </TableContainer>
      </div>
    </div>
  );
}
