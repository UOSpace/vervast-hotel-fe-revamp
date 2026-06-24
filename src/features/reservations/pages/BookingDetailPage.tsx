import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  User,
  AltArrowDown,
  Compass
} from '@solar-icons/react';
import { useToast } from '../../../components/ui/toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Re-use the exact mock data from BookingsPage to ensure complete data sync
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

const getBookingDetail = (id: string) => {
  const base = mockBookings.find(b => b.id === id) || mockBookings[0];

  if (base.id === 'BK-001') {
    return {
      ...base,
      createdAt: 'June 21, 2026 08:45',
      lead: 'LD-Sal Zanjabila-SEA-21062026',
      hotels: 'Hotel Indonesia',
      travelAgency: 'My Travel Agencies',
      mapLocation: 'Indonesia',
      originOfBooking: 'Traveloka',
      cancelationReason: '',
      country: 'Indonesia',
      emailAddress: 'zanjabila.dev@gmail.com',
      sourceId: '219141',
      sourceName: 'Did Know',
      blockCode: '14444',
      lastModifiedDateTime: '',
      adr: '',
      roomNumber: '52',
      packages: 'Regular',
      marketCode: '14155',
      eta: '25 June 2026',
      preferences: 'No Smoking related place',
      comments: 'Good luck'
    };
  }

  const nameFirstWord = base.contacts.split(' ')[0] || 'Guest';
  return {
    ...base,
    createdAt: 'October 14, 2025 10:24',
    lead: `LD-${nameFirstWord}-SEA-${base.crsNo}`,
    hotels: 'Hotel A',
    travelAgency: base.companies !== 'N/A' ? base.companies : 'Direct Booking',
    mapLocation: 'United States',
    originOfBooking: 'Direct',
    cancelationReason: '',
    country: 'United States',
    emailAddress: `${nameFirstWord.toLowerCase()}@example.com`,
    sourceId: '100201',
    sourceName: 'Website',
    blockCode: '1029',
    lastModifiedDateTime: '',
    adr: '',
    roomNumber: '101',
    packages: 'Standard',
    marketCode: '9000',
    eta: '14:00',
    preferences: 'Quiet room preferred',
    comments: 'VIP Guest'
  };
};

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const bookingKey = id || 'BK-001';
  const initialData = getBookingDetail(bookingKey);

  // States
  const [bookingName, setBookingName] = useState(initialData.bookingName);
  const [lead, setLead] = useState(initialData.lead);
  const [revenue, setRevenue] = useState(initialData.revenue.replace('$', '').replace(',', ''));
  const [bookingOwner, setBookingOwner] = useState(initialData.bookingOwner);
  const [hotels, setHotels] = useState(initialData.hotels);
  const [travelAgency, setTravelAgency] = useState(initialData.travelAgency);
  const [arrivalDate, setArrivalDate] = useState<Date | null>(new Date(initialData.arrivalDate));
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date(initialData.departureDate));
  const [arrival, setArrival] = useState<Date | null>(new Date(initialData.arrival));
  const [departure, setDeparture] = useState<Date | null>(new Date(initialData.departure));
  const [mapLocation, setMapLocation] = useState(initialData.mapLocation);

  const [crsNo, setCrsNo] = useState(initialData.crsNo);
  const [originOfBooking, setOriginOfBooking] = useState(initialData.originOfBooking);
  const [cancelationReason, setCancelationReason] = useState(initialData.cancelationReason);
  const [country, setCountry] = useState(initialData.country);
  const [emailAddress, setEmailAddress] = useState(initialData.emailAddress);
  const [sourceId, setSourceId] = useState(initialData.sourceId);
  const [sourceName, setSourceName] = useState(initialData.sourceName);
  const [blockCode, setBlockCode] = useState(initialData.blockCode);
  const [lastModifiedDateTime, setLastModifiedDateTime] = useState(initialData.lastModifiedDateTime);
  const [adr, setAdr] = useState(initialData.adr);
  const [roomNumber, setRoomNumber] = useState(initialData.roomNumber);
  const [packages, setPackages] = useState(initialData.packages);
  const [marketCode, setMarketCode] = useState(initialData.marketCode);
  const [eta, setEta] = useState(initialData.eta);
  const [preferences, setPreferences] = useState(initialData.preferences);
  const [comments, setComments] = useState(initialData.comments);

  const [bookingStatus, setBookingStatus] = useState(initialData.bookingStatus);
  const [activeTab, setActiveTab] = useState('Details');

  const activities = [
    {
      id: 'act-1',
      user: bookingOwner || 'vervast',
      action: 'updated',
      details: `moved booking to ${bookingStatus} stage`,
      timestamp: initialData.createdAt,
      iconType: 'stage',
      type: 'Sales Activities'
    },
    {
      id: 'act-2',
      user: 'vervast',
      action: 'associated',
      target: travelAgency || 'Direct Booking',
      timestamp: 'June 21, 2026 08:47',
      iconType: 'plus',
      type: 'Companies'
    },
    {
      id: 'act-3',
      user: bookingOwner || 'vervast',
      action: 'associated',
      target: initialData.contacts,
      timestamp: 'June 21, 2026 08:46',
      iconType: 'plus',
      type: 'Contacts'
    },
    {
      id: 'act-4',
      user: bookingOwner || 'vervast',
      action: 'created',
      details: 'The record has been created',
      timestamp: 'June 21, 2026 08:45',
      iconType: 'create',
      type: 'All'
    }
  ];

  // Stages definition
  const stages = ['New Booking', 'Deposit', '50% Payment', 'Fully Paid', 'C/I', 'C/O', 'Cancelled'];

  const getStageStatus = (stage: string) => {
    if (stage === 'Cancelled') {
      return bookingStatus === 'Cancelled' ? 'active' : 'inactive';
    }

    if (bookingStatus === 'Cancelled') {
      return 'inactive';
    }

    const currentStatusIndex = stages.indexOf(bookingStatus);
    const stageIndex = stages.indexOf(stage);

    if (stageIndex <= currentStatusIndex && currentStatusIndex !== -1) {
      return 'completed';
    }

    return 'inactive';
  };

  const getStageStyle = (stage: string) => {
    const status = getStageStatus(stage);

    if (stage === 'Cancelled') {
      return status === 'active'
        ? 'bg-[#5f2e27] text-white border-[#4d1f19] shadow-sm'
        : 'bg-[#efe7d5]/45 text-[#7d6b5e]/60 border-[#d4c4b7]/50';
    }

    if (status === 'completed') {
      return 'bg-[#2f4256] text-white border-[#243546] shadow-xs';
    }

    return 'bg-[#efe7d5]/40 text-[#6a5848] border-[#d4c4b7]/70';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Booking Saved', 'Booking details updated successfully.', 3000);
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Back navigation */}
      <div className="flex flex-col mb-4 animate-card-enter">
        <button
          onClick={() => navigate('/dashboard/reservations/bookings')}
          className="flex items-center text-[#7d6b5e] hover:text-[#4a3c31] transition-colors w-fit mb-2 text-sm gap-2 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Reservations Bookings
        </button>
      </div>

      <div className="flex flex-col gap-6 text-xs" style={{ animationDelay: '0.1s' }}>

        {/* Profile Header */}
        <div className="relative z-20 border border-[#d4c4b7] rounded-[12px] p-5 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#947b66]/20 backdrop-blur-sm border-2 border-[#947b66] flex items-center justify-center text-[#4a3c31] text-xl font-serif font-bold shadow-inner">
              {bookingName.substring(0, 2).toUpperCase()}
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-serif text-[#4a3c31] font-bold">{bookingName}</h2>
              <div className="flex items-center gap-2 text-[#7d6b5e] text-[11px]">
                <span className="font-mono text-[10px] bg-[#e5d8cb]/50 px-1.5 py-0.5 rounded text-[#4a3c31]">{id}</span>
                <span>•</span>
                <span className="text-[#7d6b5e]">Created on {initialData.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#efe7d5]/80 border border-[#d4c4b7] text-[#4a3c31]">
              <User size={14} className="text-[#947b66]" />
              <span className="font-semibold text-[10px]">{bookingOwner}</span>
            </div>

            <div className="relative group">
              <button className="bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-97 cursor-pointer">
                Actions <AltArrowDown size={14} />
              </button>
              <div className="absolute right-0 top-9 hidden group-hover:block z-50 w-36 bg-[#f3eae1] border border-[#d4c4b7] rounded-xl shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                <button type="button" onClick={() => { setBookingStatus('C/I'); toast.info('Status Changed', 'Status updated to Check In.', 2000); }} className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] transition-colors">Check In (C/I)</button>
                <button type="button" onClick={() => { setBookingStatus('C/O'); toast.info('Status Changed', 'Status updated to Check Out.', 2000); }} className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] transition-colors">Check Out (C/O)</button>
                <button type="button" onClick={() => { setBookingStatus('Cancelled'); toast.info('Status Changed', 'Status updated to Cancelled.', 2000); }} className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors">Cancel Booking</button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracker Chevron Timeline */}
        <div className="w-full border border-[#d4c4b7] rounded-[12px] bg-[#f3eae1]/30 backdrop-blur-sm p-3 overflow-x-auto shadow-xs">
          <div className="flex items-center min-w-[750px] w-full">
            {stages.map((stage, idx) => {
              const status = getStageStatus(stage);
              let circleContent: React.ReactNode = idx + 1;

              if (status === 'completed') {
                circleContent = '✔';
              } else if (stage === 'Cancelled' && bookingStatus === 'Cancelled') {
                circleContent = '✕';
              }

              let circleClass = '';
              if (stage === 'Cancelled') {
                circleClass = bookingStatus === 'Cancelled'
                  ? 'bg-white text-[#5f2e27] border-white'
                  : 'bg-transparent text-[#7d6b5e]/60 border-[#d4c4b7]/50';
              } else if (status === 'completed') {
                circleClass = 'bg-white text-[#2f4256] border-white';
              } else {
                circleClass = 'bg-transparent text-[#6a5848] border-[#d4c4b7]/70';
              }

              return (
                <button
                  key={stage}
                  onClick={() => {
                    setBookingStatus(stage);
                    toast.success('Stage Updated', `Booking moved to ${stage} stage.`, 2000);
                  }}
                  className={`flex-1 flex items-center justify-between px-3 py-2 text-xs font-bold border rounded-lg mx-1 transition-all duration-150 cursor-pointer ${getStageStyle(stage)}`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-sans font-bold border ${circleClass}`}>
                      {circleContent}
                    </span>
                    {stage}
                  </span>
                  {idx < stages.length - 1 && (
                    <span className="opacity-55 text-xs font-mono font-bold select-none">&gt;&gt;</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabs Row */}
        <div className="flex border-b border-[#d4c4b7] gap-2 overflow-x-auto pb-px">
          {['Details', 'All', 'Contacts', 'Companies', 'Sales Activities', 'Attachments', 'Marcom Activities', 'Emails', 'Calls', 'Notes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 border-b-2 font-serif text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${activeTab === tab
                  ? 'border-[#947b66] text-[#4a3c31]'
                  : 'border-transparent text-[#7d6b5e] hover:text-[#4a3c31]'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Panel */}
        {activeTab === 'Details' && (
          <form onSubmit={handleSave} className="border border-[#d4c4b7] rounded-[12px] bg-[#f3eae1]/30 backdrop-blur-sm p-6 shadow-xs flex flex-col gap-6 animate-card-enter">
            {/* Top Toolbar inside Details */}
            <div className="flex justify-between items-center border-b border-[#d4c4b7]/50 pb-4">
              <h3 className="text-sm font-bold font-serif text-[#4a3c31] flex items-center gap-2">
                <Compass size={18} className="text-[#947b66]" /> Details
              </h3>
            </div>

            {/* Grid Form Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

              {/* Left Form Section */}
              <div className="space-y-6">

                {/* Booking Information */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#947b66] border-b border-[#d4c4b7]/30 pb-1">Booking Information</h4>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-[#7d6b5e] font-semibold"><span className="text-red-500">*</span> Lead</label>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#efe7d5]/40 border border-[#d4c4b7] rounded-lg text-xs w-fit">
                      <span className="text-[#4a3c31] font-mono">{lead}</span>
                      <button type="button" onClick={() => setLead('')} className="text-[#7d6b5e] hover:text-red-600 font-bold ml-1">✕</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-[#7d6b5e] font-semibold"><span className="text-red-500">*</span> Booking Name</label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input"
                    />
                  </div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-[#7d6b5e] font-semibold">Final Total Revenue</label>
                    <div className="flex rounded-lg border border-[#d4c4b7] overflow-hidden glass-input focus-within:ring-1 focus-within:ring-[#947b66] h-9">
                      <span className="px-3 flex items-center bg-[#efe7d5]/50 border-r border-[#d4c4b7] text-xs text-[#4a3c31]">USD</span>
                      <input
                        type="text"
                        value={revenue}
                        onChange={(e) => setRevenue(e.target.value)}
                        className="flex-1 px-3 text-xs text-[#4a3c31] outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-[#7d6b5e] font-semibold">Booking Owner</label>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#efe7d5]/40 border border-[#d4c4b7] rounded-lg text-xs w-fit">
                      <span className="text-[#4a3c31]">{bookingOwner}</span>
                      <button type="button" onClick={() => setBookingOwner('')} className="text-[#7d6b5e] hover:text-red-600 font-bold ml-1">✕</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-[#7d6b5e] font-semibold">Hotels</label>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#efe7d5]/40 border border-[#d4c4b7] rounded-lg text-xs w-fit">
                      <span className="text-[#4a3c31]">{hotels}</span>
                      <button type="button" onClick={() => setHotels('')} className="text-[#7d6b5e] hover:text-red-600 font-bold ml-1">✕</button>
                    </div>
                  </div>
                </div>

                {/* Associate With Records */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#947b66] border-b border-[#d4c4b7]/30 pb-1">Associate With Records</h4>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-[#7d6b5e] font-semibold"><span className="text-red-500">*</span> Travel Agency</label>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#efe7d5]/40 border border-[#d4c4b7] rounded-lg text-xs w-fit">
                      <span className="text-[#4a3c31]">{travelAgency}</span>
                      <button type="button" onClick={() => setTravelAgency('')} className="text-[#7d6b5e] hover:text-red-600 font-bold ml-1">✕</button>
                    </div>
                  </div>
                </div>

                {/* Stay Dates */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#947b66] border-b border-[#d4c4b7]/30 pb-1">Stay Dates</h4>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-[#7d6b5e] font-semibold">Arrival Date</label>
                    <div className="relative flex items-center w-full max-w-[280px]">
                      <DatePicker
                        selected={arrivalDate}
                        onChange={(date: Date | null) => setArrivalDate(date)}
                        dateFormat="MMMM d, yyyy"
                        className="w-full h-9 pl-3 pr-8 text-xs glass-input border border-[#d4c4b7] rounded-lg text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                      <Calendar size={14} className="absolute right-3 text-[#947b66] pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-[#7d6b5e] font-semibold">Departure Date</label>
                    <div className="relative flex items-center w-full max-w-[280px]">
                      <DatePicker
                        selected={departureDate}
                        onChange={(date: Date | null) => setDepartureDate(date)}
                        dateFormat="MMMM d, yyyy"
                        className="w-full h-9 pl-3 pr-8 text-xs glass-input border border-[#d4c4b7] rounded-lg text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                      <Calendar size={14} className="absolute right-3 text-[#947b66] pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-[#7d6b5e] font-semibold">Arrival</label>
                    <div className="relative flex items-center w-full max-w-[280px]">
                      <DatePicker
                        selected={arrival}
                        onChange={(date: Date | null) => setArrival(date)}
                        dateFormat="MMMM d, yyyy"
                        className="w-full h-9 pl-3 pr-8 text-xs glass-input border border-[#d4c4b7] rounded-lg text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                      <button type="button" onClick={() => setArrival(null)} className="absolute right-8 text-[#7d6b5e] hover:text-[#4a3c31] text-xs">✕</button>
                      <Calendar size={14} className="absolute right-3 text-[#947b66] pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-[#7d6b5e] font-semibold">Departure</label>
                    <div className="relative flex items-center w-full max-w-[280px]">
                      <DatePicker
                        selected={departure}
                        onChange={(date: Date | null) => setDeparture(date)}
                        dateFormat="MMMM d, yyyy"
                        className="w-full h-9 pl-3 pr-8 text-xs glass-input border border-[#d4c4b7] rounded-lg text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                      <button type="button" onClick={() => setDeparture(null)} className="absolute right-8 text-[#7d6b5e] hover:text-[#4a3c31] text-xs">✕</button>
                      <Calendar size={14} className="absolute right-3 text-[#947b66] pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#947b66] border-b border-[#d4c4b7]/30 pb-1">Location</h4>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <label className="text-[#7d6b5e] font-semibold">Map Location</label>
                    <input
                      type="text"
                      value={mapLocation}
                      onChange={(e) => setMapLocation(e.target.value)}
                      className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full max-w-[280px]"
                    />
                  </div>
                </div>

              </div>

              {/* Right Form Section: Vertical input fields */}
              <div className="space-y-4 border-l border-[#d4c4b7]/35 pl-0 lg:pl-8">

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">CRS No.</label>
                  <input
                    type="text"
                    value={crsNo}
                    onChange={(e) => setCrsNo(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">Origin of Booking</label>
                  <input
                    type="text"
                    value={originOfBooking}
                    onChange={(e) => setOriginOfBooking(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">Cancelation Reason</label>
                  <input
                    type="text"
                    value={cancelationReason}
                    onChange={(e) => setCancelationReason(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">Source ID</label>
                  <input
                    type="text"
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">Source Name</label>
                  <input
                    type="text"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">Block Code</label>
                  <input
                    type="text"
                    value={blockCode}
                    onChange={(e) => setBlockCode(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">Last Modified Date Time</label>
                  <input
                    type="text"
                    value={lastModifiedDateTime}
                    onChange={(e) => setLastModifiedDateTime(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                    placeholder="Auto-generated timestamp"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">ADR</label>
                  <input
                    type="text"
                    value={adr}
                    onChange={(e) => setAdr(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">Room Number</label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">Packages</label>
                  <input
                    type="text"
                    value={packages}
                    onChange={(e) => setPackages(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">Market Code</label>
                  <input
                    type="text"
                    value={marketCode}
                    onChange={(e) => setMarketCode(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">ETA</label>
                  <input
                    type="text"
                    value={eta}
                    onChange={(e) => setEta(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">Preferences</label>
                  <input
                    type="text"
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    className="h-9 px-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#7d6b5e] font-semibold">Comments</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="h-16 p-3 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] glass-input w-full resize-none"
                  />
                </div>

              </div>

            </div>

            {/* Bottom Actions Row */}
            <div className="flex justify-end pt-4 border-t border-[#d4c4b7]/50 mt-4">
              <button
                type="submit"
                className="bg-[#2f4256] hover:bg-[#202e3b] text-white px-6 py-2 rounded-lg text-xs font-semibold shadow-xs active:scale-97 cursor-pointer transition-all"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {activeTab === 'Contacts' && (
          <div className="border border-[#d4c4b7] rounded-[12px] bg-[#f3eae1]/30 backdrop-blur-sm p-6 shadow-xs flex flex-col gap-4 animate-card-enter">
            <h3 className="text-sm font-bold font-serif text-[#4a3c31] border-b border-[#d4c4b7]/50 pb-2">Registered Contacts</h3>
            <div className="flex items-center gap-4 p-4 border border-[#d4c4b7]/60 rounded-xl bg-[#f3eae1]/20">
              <div className="w-12 h-12 rounded-full bg-[#947b66]/20 backdrop-blur-sm border border-[#947b66] flex items-center justify-center text-[#4a3c31] font-bold text-sm">
                {initialData.contacts.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-sm font-bold text-[#4a3c31]">{initialData.contacts}</h4>
                <p className="text-[#7d6b5e] text-xs">Primary Guest / Booking Contact</p>
                <div className="flex gap-4 mt-2 text-[#7d6b5e] text-xs">
                  <span>Email: <span className="text-[#4a3c31]">{emailAddress || 'N/A'}</span></span>
                  <span>•</span>
                  <span>CRS No: <span className="text-[#4a3c31] font-mono">{crsNo}</span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'All' || activeTab === 'Sales Activities' || activeTab === 'Marcom Activities' || activeTab === 'Emails' || activeTab === 'Calls') && (
          <div className="border border-[#d4c4b7] rounded-[12px] bg-[#f3eae1]/30 backdrop-blur-sm p-6 shadow-xs flex flex-col gap-4 animate-card-enter">
            <h3 className="text-sm font-bold font-serif text-[#4a3c31] border-b border-[#d4c4b7]/50 pb-2">
              History of Changes & Activities ({activeTab})
            </h3>
            <div className="p-4 flex-1">
              <div className="relative pl-6 border-l border-[#d4c4b7]/60 space-y-6">
                {activities
                  .filter(act => activeTab === 'All' || act.type === activeTab || (activeTab === 'Sales Activities' && act.iconType === 'stage'))
                  .map((act) => (
                    <div key={act.id} className="relative group">
                      {/* Timeline Bullet Icon */}
                      <span className="absolute -left-[35px] top-0 w-[18px] h-[18px] rounded-full bg-[#fdfaf7] border border-[#d4c4b7] flex items-center justify-center text-[#947b66] shadow-2xs">
                        {act.iconType === 'plus' && <span className="text-[11px] font-bold">+</span>}
                        {act.iconType === 'edit' && <span className="text-[9px]">✎</span>}
                        {act.iconType === 'stage' && <span className="text-[9px]">⇾</span>}
                        {act.iconType === 'create' && <span className="text-[9px]">★</span>}
                      </span>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-[#4a3c31]">{act.user}</span>{' '}
                          {act.action === 'associated' ? (
                            <>
                              associated <span className="text-[#947b66] font-medium underline cursor-pointer">{act.target}</span>
                            </>
                          ) : (
                            <span className="text-[#7d6b5e]">{act.details}</span>
                          )}
                          <span className="text-[10px] text-[#7d6b5e] ml-2">• {act.timestamp}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toast.success('Pinned', 'Activity pinned to top.', 2000)}
                          className="text-[10px] font-semibold text-[#947b66] hover:text-[#4a3c31] cursor-pointer"
                        >
                          Pin on top
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Catch-all under construction fallback for other tabs */}
        {!['Details', 'Contacts', 'All', 'Sales Activities', 'Marcom Activities', 'Emails', 'Calls'].includes(activeTab) && (
          <div className="border border-[#d4c4b7] rounded-[12px] bg-[#f3eae1]/30 backdrop-blur-sm p-8 text-center text-[#7d6b5e] font-serif text-sm italic shadow-xs animate-card-enter">
            {activeTab} tab content is currently under construction.
          </div>
        )}

      </div>
    </div>
  );
}
