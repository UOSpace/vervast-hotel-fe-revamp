import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/ui/toast';

const mockBookingsList = [
  {
    id: 'BK-001',
    bookingName: 'Sal Zanjabila Stay',
    bookingStatus: 'Confirmed',
    crsNo: 'CRS-1112552',
    revenue: '$5,000.00',
    companies: 'Sal Industry',
    bookingOwner: 'Alpha',
    arrivalDate: 'Jun 25, 2026',
    departureDate: 'Jun 29, 2026',
    nights: 4,
    roomType: 'Sunset Ocean Pavilion',
    guests: '2 Adults',
    contacts: 'Sal Zanjabila',
    email: 'sal.zanjabila@salindustry.com',
    phone: '+62 812 3456 7890',
    notes: 'Late check-in requested at 9:00 PM. High-floor preferred.'
  },
  {
    id: 'BK-002',
    bookingName: 'Martin Fuentes Luxury Retreat',
    bookingStatus: 'In House',
    crsNo: 'CRS-350971494',
    revenue: '$6,846.77',
    companies: 'Skyline Tours',
    bookingOwner: 'vervast',
    arrivalDate: 'Oct 18, 2025',
    departureDate: 'Oct 24, 2025',
    nights: 6,
    roomType: 'Alpine Panoramic Suite',
    guests: '2 Adults, 1 Child',
    contacts: 'Martin Fuentes',
    email: 'm.fuentes@skylinetours.com',
    phone: '+34 91 555 1234',
    notes: 'VIP guest from Virtuoso. Champagne and fruit basket setup upon arrival.'
  }
];

export function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  useToast();

  const booking = mockBookingsList.find(b => b.id === id) || mockBookingsList[0];
  const [activeTab, setActiveTab] = useState<'details' | 'folio' | 'history'>('details');

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 animate-card-enter">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-wide">{booking.bookingName}</h2>
            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {booking.bookingStatus}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-zinc-500 text-[10px]">
            <span className="font-semibold text-zinc-900">{booking.roomType}</span>
            <span className="mx-0.5">•</span>
            <span>{booking.arrivalDate} – {booking.departureDate} ({booking.nights} Nights)</span>
            <span className="mx-0.5">•</span>
            <span className="font-mono text-zinc-400">{booking.id}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard/reservations/bookings')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-xs font-normal pb-0.5 cursor-pointer"
        >
          <span>&larr;</span> Back to Bookings
        </button>
      </div>

      {/* Grid Layout */}
      <div className="flex flex-col gap-6 text-[10px]">

        {/* ROW 1: Stay Details (4 cols) + Revenue & Billing (4 cols) + Primary Guest (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-card-enter -mx-3" style={{ animationDelay: '0.1s' }}>
          
          {/* Stay Details (col-span-4) */}
          <div className="col-span-1 lg:col-span-4 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Stay Details</h3>
            </div>

            <div className="flex flex-col gap-2 flex-1 justify-between py-1">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Accommodation</span>
                <span className="text-zinc-900 font-semibold text-[10px]">{booking.roomType}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Party</span>
                <span className="text-zinc-900 font-medium text-[10px]">{booking.guests}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Check-in</span>
                <span className="text-zinc-900 font-medium text-[10px]">{booking.arrivalDate}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Check-out</span>
                <span className="text-zinc-900 font-medium text-[10px]">{booking.departureDate}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">CRS Confirmation</span>
                <span className="text-zinc-900 font-mono text-[10px]">{booking.crsNo}</span>
              </div>
            </div>
          </div>

          {/* Revenue & Billing (col-span-4) */}
          <div className="col-span-1 lg:col-span-4 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Revenue & Folio</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center flex-1 py-1 items-center border-y border-zinc-100">
              <div className="flex flex-col">
                <span className="text-[22px] font-normal text-zinc-900 leading-none mb-1">{booking.revenue}</span>
                <span className="text-[9px] text-zinc-500 font-medium">Total Billed</span>
              </div>
              <div className="flex flex-col border-l border-zinc-100 pl-2">
                <span className="text-[22px] font-normal text-emerald-700 leading-none mb-1">Paid</span>
                <span className="text-[9px] text-zinc-500 font-medium">Folio Status</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] pt-2">
              <span className="text-zinc-500 font-medium">Distribution Partner</span>
              <span className="text-zinc-900 font-bold">{booking.companies}</span>
            </div>
          </div>

          {/* Primary Guest (col-span-4) */}
          <div className="col-span-1 lg:col-span-4 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Primary Guest</h3>
            </div>

            <div className="flex flex-col gap-2 flex-1 justify-between py-1">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Guest Name</span>
                <span className="text-zinc-900 font-semibold text-[10px]">{booking.contacts}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Email</span>
                <span className="text-zinc-900 font-medium text-[10px]">{booking.email}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Phone</span>
                <span className="text-zinc-900 font-medium text-[10px]">{booking.phone}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Account Handler</span>
                <span className="text-zinc-900 font-medium text-[10px]">{booking.bookingOwner}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ROW 2: Special Notes & History Tabs (col-12) */}
        <div className="rounded-[12px] bg-white/70 backdrop-blur-xs border border-zinc-200/80 p-4 shadow-xs flex flex-col animate-card-enter -mx-3" style={{ animationDelay: '0.2s' }}>
          {/* Tab Selector */}
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3 mb-4">
            <div className="flex gap-2">
              {[
                { key: 'details', label: 'Guest Notes & Preferences' },
                { key: 'folio', label: 'Folio Breakdown' },
                { key: 'history', label: 'Audit Trail' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="flex flex-col gap-3 py-2 text-xs text-zinc-700">
              <p className="leading-relaxed font-normal">{booking.notes}</p>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 mt-2 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-zinc-900 block text-xs">Dedicated Butler Assigned:</span>
                  <span className="text-zinc-500 text-[10px]">Butler Maria has confirmed pre-arrival arrangements.</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 font-medium text-[9.5px]">Confirmed</span>
              </div>
            </div>
          )}

          {activeTab === 'folio' && (
            <div className="space-y-2 py-2">
              <div className="grid grid-cols-[50%_25%_25%] pb-2 border-b border-zinc-100 text-zinc-400 font-medium text-[9.5px]">
                <div>Description</div>
                <div className="text-right">Quantity</div>
                <div className="text-right">Amount</div>
              </div>
              {[
                { desc: 'Sunset Ocean Pavilion Accommodation', qty: `${booking.nights} Nights`, amount: '$4,200.00' },
                { desc: 'Private Yacht Airport Transfer', qty: 'Round-trip', amount: '$500.00' },
                { desc: 'Pre-arrival Welcome Champagne & Hamper', qty: '1 Package', amount: '$300.00' },
              ].map((item, idx) => (
                <div key={idx} className="grid grid-cols-[50%_25%_25%] py-1.5 items-center text-xs text-zinc-800">
                  <div className="font-medium text-zinc-900">{item.desc}</div>
                  <div className="text-right text-zinc-500">{item.qty}</div>
                  <div className="text-right font-medium text-zinc-900">{item.amount}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2.5 py-2">
              {[
                { event: 'Payment Processed', date: 'Jun 20, 2026 11:20 AM', user: 'Finance Portal' },
                { event: 'Room Allocation Confirmed', date: 'Jun 18, 2026 09:45 AM', user: 'Front Office' },
                { event: 'Booking Created via Virtuoso Portal', date: 'Jun 15, 2026 04:12 PM', user: 'Channel Manager' },
              ].map((h, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-zinc-900">{h.event}</span>
                    <span className="text-zinc-400 text-[10px] block mt-0.5">by {h.user}</span>
                  </div>
                  <span className="text-zinc-500 text-[10px]">{h.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
