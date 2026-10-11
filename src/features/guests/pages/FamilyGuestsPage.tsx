import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Magnifer, Filter, Eye, TrashBinTrash } from '@solar-icons/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useToast } from '../../../components/ui/toast';

interface FamilyContactGuest {
  id: string;
  contact: string;
  initials: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
}

// Mock data for families matching CRM directory structure
const mockGuests: FamilyContactGuest[] = [
  {
    id: 'GST-001',
    contact: 'John Anderson (The Anderson Family)',
    initials: 'AF',
    createdAt: '2021-05-14',
    firstName: 'John',
    lastName: 'Anderson',
    email: 'anderson.family@vervast.com',
    phone: '+1 (212) 555-7842',
    streetAddress: '742 Park Avenue, Apt 4B',
    city: 'New York',
    state: 'NY',
    country: 'United States',
  },
  {
    id: 'GST-002',
    contact: 'Theodore Laurence (The Laurence Family)',
    initials: 'LF',
    createdAt: '2022-01-10',
    firstName: 'Theodore',
    lastName: 'Laurence',
    email: 'laurence.family@laurence.org',
    phone: '+1 (617) 555-0143',
    streetAddress: '12 Commonwealth Avenue',
    city: 'Boston',
    state: 'MA',
    country: 'United States',
  },
  {
    id: 'GST-003',
    contact: 'Josephine March (The March Family)',
    initials: 'MF',
    createdAt: '2022-03-22',
    firstName: 'Josephine',
    lastName: 'March',
    email: 'march.family@plumfield.edu',
    phone: '+1 (617) 555-0188',
    streetAddress: '45 Orchard House Lane',
    city: 'Concord',
    state: 'MA',
    country: 'United States',
  },
  {
    id: 'GST-004',
    contact: 'Amy Curtis (The Curtis Family)',
    initials: 'CF',
    createdAt: '2022-08-05',
    firstName: 'Amy',
    lastName: 'Curtis',
    email: 'curtis.family@atelier-paris.fr',
    phone: '+33 1 42 68 55 00',
    streetAddress: '18 Rue de Rivoli',
    city: 'Paris',
    state: 'Île-de-France',
    country: 'France',
  },
  {
    id: 'GST-005',
    contact: 'John Brooke (The Brooke Family)',
    initials: 'BF',
    createdAt: '2022-11-12',
    firstName: 'John',
    lastName: 'Brooke',
    email: 'brooke.family@megandjohn.com',
    phone: '+1 (617) 555-0199',
    streetAddress: '24 Dovecote Path',
    city: 'Concord',
    state: 'MA',
    country: 'United States',
  },
  {
    id: 'GST-006',
    contact: 'Margaret March (The March-Vane Family)',
    initials: 'MV',
    createdAt: '2022-12-03',
    firstName: 'Margaret',
    lastName: 'March',
    email: 'march.vane@manor-estate.co.uk',
    phone: '+44 20 7946 0912',
    streetAddress: '8 Kensington High St',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
  },
  {
    id: 'GST-007',
    contact: 'Arthur Pendennis (The Pendennis Family)',
    initials: 'PF',
    createdAt: '2023-02-18',
    firstName: 'Arthur',
    lastName: 'Pendennis',
    email: 'pendennis.estate@fairoaks.co.uk',
    phone: '+44 18 6549 6001',
    streetAddress: '14 St. James Square',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
  },
  {
    id: 'GST-008',
    contact: 'Marian Halcombe (The Halcombe Family)',
    initials: 'HF',
    createdAt: '2023-04-29',
    firstName: 'Marian',
    lastName: 'Halcombe',
    email: 'halcombe.family@limmeridge.co.uk',
    phone: '+44 12 2855 0122',
    streetAddress: '5 Limmeridge House',
    city: 'Cumberland',
    state: 'Cumbria',
    country: 'United Kingdom',
  },
  {
    id: 'GST-009',
    contact: 'Walter Hartright (The Hartright Family)',
    initials: 'WH',
    createdAt: '2023-07-14',
    firstName: 'Walter',
    lastName: 'Hartright',
    email: 'hartright.family@drawing-academy.org',
    phone: '+44 20 7946 0885',
    streetAddress: '7 Clement’s Inn',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
  },
  {
    id: 'GST-010',
    contact: 'Laura Fairlie (The Fairlie Family)',
    initials: 'LF',
    createdAt: '2023-09-02',
    firstName: 'Laura',
    lastName: 'Fairlie',
    email: 'fairlie.estate@limmeridge.co.uk',
    phone: '+44 12 2855 0144',
    streetAddress: '6 Limmeridge House',
    city: 'Cumberland',
    state: 'Cumbria',
    country: 'United Kingdom',
  },
  {
    id: 'GST-011',
    contact: 'Gabriel Betteredge (The Betteredge Family)',
    initials: 'GB',
    createdAt: '2023-10-18',
    firstName: 'Gabriel',
    lastName: 'Betteredge',
    email: 'betteredge.family@vervast-vip.org',
    phone: '+44 19 8221 4401',
    streetAddress: '12 Cobblestone Walk',
    city: 'Yorkshire',
    state: 'North Yorkshire',
    country: 'United Kingdom',
  },
  {
    id: 'GST-012',
    contact: 'Rachel Verinder (The Verinder Family)',
    initials: 'RV',
    createdAt: '2023-11-05',
    firstName: 'Rachel',
    lastName: 'Verinder',
    email: 'verinder.family@moonstone.co.uk',
    phone: '+44 20 7946 0773',
    streetAddress: '42 Belgrave Square',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
  },
];

export function FamilyGuestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const navigate = useNavigate();
  const toast = useToast();

  const handlePreview = (id: string) => {
    if (id === 'GST-001') {
      navigate(`/dashboard/guests/family/${id}`);
    } else {
      toast.error(
        'Data Not Found',
        `Detail data for family ${id} cannot be displayed because the profile data is not yet available in the system.`,
        4000
      );
    }
  };

  const filteredGuests = mockGuests.filter((guest) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      guest.contact.toLowerCase().includes(q) ||
      guest.firstName.toLowerCase().includes(q) ||
      guest.lastName.toLowerCase().includes(q) ||
      guest.email.toLowerCase().includes(q) ||
      guest.phone.toLowerCase().includes(q) ||
      guest.streetAddress.toLowerCase().includes(q) ||
      guest.city.toLowerCase().includes(q) ||
      guest.state.toLowerCase().includes(q) ||
      guest.country.toLowerCase().includes(q);
    const matchesCountry = countryFilter === 'All' || guest.country === countryFilter;
    return matchesSearch && matchesCountry;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, countryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / PAGE_SIZE));
  const pagedGuests = filteredGuests.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedIds(pagedGuests.map((g) => g.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, checked: boolean | 'indeterminate') => {
    setSelectedIds((prev) =>
      checked === true ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-start mb-5 animate-card-enter">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-wide mb-0.5">
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
        <TableContainer style={{ animationDelay: '0.1s' }}>
          {/* Toolbar */}
          <div className="p-3.5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <div className="relative w-80">
              <Magnifer size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search families by contact, email, phone, city..."
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
                  <div>
                    <label className="block text-[9.5px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                      Country
                    </label>
                    <Select value={countryFilter} onValueChange={setCountryFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-zinc-50 border border-zinc-200 rounded px-2.5 text-zinc-800 outline-none cursor-pointer">
                        <SelectValue placeholder="All Countries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Countries</SelectItem>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="France">France</SelectItem>
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
            <Table className="min-w-[1100px]">
              <TableHeader>
                <TableRow clickable={false}>
                  <TableHead className="min-w-[220px]">
                    <div className="flex items-center gap-2.5">
                      <Checkbox
                        checked={
                          pagedGuests.length > 0 && selectedIds.length === pagedGuests.length
                            ? true
                            : selectedIds.length > 0
                            ? 'indeterminate'
                            : false
                        }
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all families"
                      />
                      <span>Contact</span>
                    </div>
                  </TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Street Address</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Country</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedGuests.length > 0 ? (
                  pagedGuests.map((guest) => (
                    <TableRow
                      key={guest.id}
                      onClick={() => handlePreview(guest.id)}
                    >
                      <TableCell>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedIds.includes(guest.id)}
                                onCheckedChange={(checked) => handleSelect(guest.id, checked)}
                                aria-label={`Select ${guest.contact}`}
                              />
                            </div>
                            <div className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-800 text-[9.5px] font-semibold flex items-center justify-center border border-zinc-200/80 shrink-0">
                              {guest.initials}
                            </div>
                            <span className="font-medium text-zinc-900 text-[10.5px] whitespace-nowrap">
                              {guest.contact}
                            </span>
                          </div>

                          {/* Action MenuDots using portal to prevent frame clipping */}
                          <TableActionMenu
                            vertical={true}
                            items={[
                              {
                                label: 'Preview',
                                icon: <Eye size={13} className="text-zinc-500" />,
                                onClick: () => handlePreview(guest.id),
                              },
                              {
                                label: 'Delete',
                                icon: <TrashBinTrash size={13} className="text-rose-500" />,
                                variant: 'danger',
                                onClick: () => toast.info('Action', `Delete requested for ${guest.contact}`),
                              },
                            ]}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-[10px] text-zinc-500 whitespace-nowrap">
                        {guest.createdAt}
                      </TableCell>
                      <TableCell className="text-[10px] font-medium text-zinc-700 whitespace-nowrap">
                        {guest.firstName}
                      </TableCell>
                      <TableCell className="text-[10px] font-medium text-zinc-700 whitespace-nowrap">
                        {guest.lastName}
                      </TableCell>
                      <TableCell className="text-[10px] text-zinc-600 font-mono whitespace-nowrap hover:text-zinc-900">
                        {guest.email}
                      </TableCell>
                      <TableCell className="text-[10px] text-zinc-600 font-mono whitespace-nowrap">
                        {guest.phone}
                      </TableCell>
                      <TableCell className="text-[10px] text-zinc-600 whitespace-nowrap truncate max-w-[200px]" title={guest.streetAddress}>
                        {guest.streetAddress}
                      </TableCell>
                      <TableCell className="text-[10px] text-zinc-700 whitespace-nowrap">
                        {guest.city}
                      </TableCell>
                      <TableCell className="text-[10px] text-zinc-700 whitespace-nowrap">
                        {guest.state}
                      </TableCell>
                      <TableCell className="text-[10px] text-zinc-700 whitespace-nowrap">
                        {guest.country}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableEmpty colSpan={10} message="No families found matching your criteria." />
                )}
              </TableBody>
            </Table>
          </TableScrollArea>

          {/* Pagination Footer */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredGuests.length}
            itemsPerPage={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="families"
          />
        </TableContainer>
      </div>
    </div>
  );
}
