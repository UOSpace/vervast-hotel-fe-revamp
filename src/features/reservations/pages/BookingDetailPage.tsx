import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PhoneCalling,
  Buildings2,
  AddCircle,
  Widget,
  Sale,
  Chart,
  Paperclip,
  NotesMinimalistic,
  CalendarMark,
  FileDownload,
  MapPoint,
} from '@solar-icons/react';
import { useToast } from '../../../components/ui/toast';
import { SlidingTabs, useTabDirection, type SlidingTabItem } from '../../../components/ui/SlidingTabs';
import { PipelineStepper, type PipelineStage } from '../../../components/ui/PipelineStepper';
import { BOOKINGS, type BookingRecord } from '../data/bookings';
import { buildBookingItinerary } from '../data/bookingItinerary';

const ACTIVITY_TABS: SlidingTabItem[] = [
  { id: 'all', label: 'All', icon: Widget },
  { id: 'companies', label: 'Companies', icon: Buildings2 },
  { id: 'itinerary', label: 'Itinerary', icon: CalendarMark },
  { id: 'sales', label: 'Sales Activities', icon: Sale },
  { id: 'marcom', label: 'Marcom Activities', icon: Chart },
  { id: 'attachments', label: 'Attachments', icon: Paperclip },
  { id: 'calls', label: 'Calls', icon: PhoneCalling },
  { id: 'notes', label: 'Notes', icon: NotesMinimalistic },
  { id: 'portfolio', label: 'Portfolio', icon: Buildings2 },
];
const ACTIVITY_TAB_IDS = ACTIVITY_TABS.map((t) => t.id);

type ActivityItem = { title: string; desc: string; meta: string; date: string };
const ACTIVITY_DATA: Record<string, ActivityItem[]> = {
  sales: [
    { title: 'Pre-arrival itinerary confirmed', desc: 'Customized villa, wellness regimen, and private experiences approved.', meta: 'Sarah Jenkins', date: 'Oct 13, 2026' },
    { title: 'Airport transfer arranged', desc: 'Twin-engine private helicopter / luxury yacht transfer scheduled.', meta: 'David Miller', date: 'Oct 11, 2026' },
  ],
  marcom: [
    { title: 'Welcome journey guide sent', desc: 'Digital concierge itinerary and bespoke destination lookbook delivered.', meta: 'Marcom Team', date: 'Oct 12, 2026' },
  ],
  attachments: [
    { title: 'Stay_Confirmation_Folio.pdf', desc: 'Official hotel confirmation and inclusive experience vouchers.', meta: '1.4 MB', date: 'Oct 13, 2026' },
    { title: 'Villa_Floorplan_Specs.pdf', desc: 'Suite orientation, private pool, and outdoor pavilion layout.', meta: '920 KB', date: 'Oct 10, 2026' },
  ],
  calls: [
    { title: 'Pre-arrival concierge consultation', desc: 'Confirmed dietary allergies, pillow preferences, and butler schedule.', meta: '18 min', date: 'Oct 09, 2026' },
  ],
  notes: [
    { title: 'Guest preference profile', desc: 'Values absolute privacy, early terrace espresso, and curated wine pairings.', meta: 'Sarah Jenkins', date: 'Oct 12, 2026' },
  ],
  portfolio: [
    { title: 'SOSEI Luxury Collection', desc: 'Confirmed property reservation within the global SOSEI portfolio.', meta: 'Resort', date: 'Oct 13, 2026' },
  ],
};

const ACTIVITY_TYPE_LABEL: Record<string, string> = {
  sales: 'Sales',
  marcom: 'Marcom',
  calls: 'Call',
  notes: 'Note',
  attachments: 'Attachment',
};

const ALL_TIMELINE: (ActivityItem & { type: string })[] = (['sales', 'marcom', 'calls', 'notes', 'attachments'] as const)
  .flatMap((k) => ACTIVITY_DATA[k].map((i) => ({ ...i, type: ACTIVITY_TYPE_LABEL[k] })))
  .sort((a, b) => b.date.localeCompare(a.date));

const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

const BOOKING_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'inquiry', label: 'Inquiry' },
  { id: 'reserved', label: 'Reserved' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'in-house', label: 'In House' },
  { id: 'departed', label: 'Departed' },
  { id: 'cancelled', label: 'Cancelled', terminal: true, tone: 'danger' },
  { id: 'no-show', label: 'No Show', terminal: true, tone: 'danger' },
];

const INITIAL_STAGE_MAP: Record<string, string> = {
  'Confirmed': 'confirmed',
  'In House': 'in-house',
  'Departed': 'departed',
  'Cancelled': 'cancelled',
};

function getGeoRegion(country: string): string {
  if (['Maldives', 'Indonesia', 'Japan'].includes(country)) return 'APAC';
  if (['Switzerland', 'Spain'].includes(country)) return 'DACH / Western Europe';
  if (['Oman', 'Egypt'].includes(country)) return 'Middle East & North Africa';
  return 'Americas';
}

function calculateEstimatedRoomRevenue(rev: string): string {
  const num = parseFloat(rev.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '$12,000.00';
  return `$${(num * 0.78).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const booking: BookingRecord = BOOKINGS.find((b) => b.id === id) || BOOKINGS[0];
  const companies = [{ name: booking.companies, type: 'Preferred Partner / Luxury Travel Advisor' }];
  const [actTab, setActTab] = useState('all');
  const actDir = useTabDirection(ACTIVITY_TAB_IDS, actTab);
  const itinerary = buildBookingItinerary(booking);

  const detailFields: [string, string][] = [
    ['Booking Owner', booking.bookingOwner],
    ['Date Booking Arrival', booking.arrivalDate],
    ['Date Booking Departure', booking.departureDate],
    ['ID Booking (Client)', booking.crsNo],
    ['Expected Check-in', '15:00 Local Time'],
    ['SOSEI Portfolio', 'SOSEI Collection'],
    ['Date Booking Creation', 'Oct 13, 2026'],
    ['Hotel', booking.hotel],
    ['Destination Country', booking.destinationCountry],
    ['Geo Region', getGeoRegion(booking.destinationCountry)],
  ];

  const competitiveFields: [string, string][] = [
    ['Comments', booking.notes],
    ['Call to Action', 'VIP Pre-Arrival Concierge & Transfer Setup'],
    ['Trace Date', 'Oct 19, 2026'],
    ['Estimated Total Revenue', booking.revenue.replace('$', '')],
    ['Estimated Room Revenue', calculateEstimatedRoomRevenue(booking.revenue)],
    ['Final Total Revenue', booking.revenue],
    ['Final Room Revenue', calculateEstimatedRoomRevenue(booking.revenue)],
    ['Confirmation Number', booking.crsNo],
  ];

  const defaultStage = INITIAL_STAGE_MAP[booking.bookingStatus] ?? 'confirmed';
  const [stage, setStage] = useState(defaultStage);
  const stageLabel = BOOKING_PIPELINE_STAGES.find((s) => s.id === stage)?.label ?? booking.bookingStatus;

  const contactsList = [
    { name: booking.contacts, role: 'Primary Guest', email: booking.email, phone: booking.phone },
    {
      name: booking.bookingOwner,
      role: 'Account Manager',
      email: `${booking.bookingOwner.toLowerCase().replace(/\s+/g, '.')}@sosei.com`,
      phone: '+1 (415) 555-8910',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 animate-card-enter">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-zinc-900 tracking-wide">{booking.bookingName}</h2>
            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/80">
              {stageLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-zinc-500 text-[10px]">
            <span className="font-semibold text-zinc-900">{booking.roomType}</span>
            <span className="mx-0.5">•</span>
            <span>
              {booking.arrivalDate} – {booking.departureDate} ({booking.nights} Nights)
            </span>
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

      {/* Pipeline Stepper */}
      <div className="mb-6 animate-card-enter" style={{ animationDelay: '0.05s' }}>
        <PipelineStepper stages={BOOKING_PIPELINE_STAGES} value={stage} onChange={setStage} />
      </div>

      {/* Grid Layout */}
      <div className="flex flex-col gap-6 text-[10px]">
        {/* ROW 1: Booking Information (4 cols) + Financial Overview (4 cols) + Source & Qualification (4 cols) + Contacts (4 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-card-enter -mx-3" style={{ animationDelay: '0.1s' }}>
          {/* Booking Details (col-span-1) */}
          <div className="col-span-1 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Booking Details</h3>
            </div>

            <div className="flex flex-col gap-2 flex-1 justify-between py-1">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Owner</span>
                <span className="text-zinc-900 font-medium text-[10px]">{booking.bookingOwner}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">CRS Reference</span>
                <span className="text-zinc-900 font-mono text-[10px]">{booking.crsNo}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Accommodation</span>
                <span className="text-zinc-900 font-medium text-[10px] truncate max-w-[150px]">{booking.roomType}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Party</span>
                <span className="text-emerald-700 font-bold text-[10px]">{booking.guests}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Length of Stay</span>
                <span className="text-zinc-900 font-bold text-[10px]">{booking.nights} Nights</span>
              </div>
            </div>
          </div>

          {/* Financial Overview (col-span-1) */}
          <div className="col-span-1 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Folio Overview</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center flex-1 py-1 items-center border-y border-zinc-100">
              <div className="flex flex-col">
                <span className="text-[22px] font-normal text-zinc-900 leading-none mb-1">{booking.revenue}</span>
                <span className="text-[9px] text-zinc-500 font-medium">Total Billed</span>
              </div>
              <div className="flex flex-col border-l border-zinc-100 pl-2">
                <span className="text-[22px] font-normal text-emerald-700 leading-none mb-1">
                  {booking.bookingStatus === 'Departed' ? 'Settled' : 'Paid'}
                </span>
                <span className="text-[9px] text-zinc-500 font-medium">Folio Status</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] pt-2">
              <span className="text-zinc-500 font-medium">Currency</span>
              <span className="text-zinc-900 font-bold">USD</span>
            </div>
          </div>

          {/* Source & Qualification (col-span-1) */}
          <div className="col-span-1 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Source & Intake</h3>
            </div>

            <div className="flex flex-col gap-2 flex-1 justify-between py-1">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Source Channel</span>
                <span className="text-zinc-900 font-semibold text-[10px] truncate max-w-[150px]">{booking.companies}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Source Notes</span>
                <span className="text-zinc-900 font-medium text-[10px]">{booking.propertyType} Signature Stay</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Guaranteed</span>
                <span className="text-emerald-700 font-bold text-[10px]">Yes (Amex FHR)</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium text-[9.5px]">Intake Date</span>
                <span className="text-zinc-900 font-medium text-[10px]">{booking.arrivalDate}</span>
              </div>
            </div>
          </div>

          {/* Contacts (col-span-1) */}
          <div className="col-span-1 rounded-[12px] p-4 transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer flex flex-col h-full justify-between">
            <div className="flex items-center gap-1.5 mb-3 h-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Contacts</h3>
              <span className="text-[10px] font-medium text-zinc-400">({contactsList.length})</span>
            </div>

            <div className="flex flex-col gap-3 py-1 flex-1">
              {contactsList.map((c) => (
                <div key={c.name} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-600 font-medium text-[10px] shrink-0">
                    {initials(c.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-bold text-zinc-900 truncate">{c.name}</div>
                    <div className="text-[9.5px] text-zinc-500 font-normal truncate">{c.role}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => toast.info('Add Contact', 'Contact form is coming soon')}
              className="mt-3 w-full h-8 flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 text-[10px] font-medium text-zinc-700 hover:bg-white hover:border-zinc-300 transition-colors cursor-pointer"
            >
              <AddCircle size={13} />
              Add Contact
            </button>
          </div>
        </div>

        {/* ROW 2: Details (col-4) + Activity tab view (col-8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 animate-card-enter -mx-3" style={{ animationDelay: '0.3s' }}>
          {/* Details & Billing */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-5">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-3 h-4">Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {detailFields.map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <div className="text-[9px] text-zinc-400 font-normal">{label}</div>
                    <div className="text-[10.5px] text-zinc-900 font-medium truncate">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-3 h-4">Stay & Billing Info</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {competitiveFields.map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <div className="text-[9px] text-zinc-400 font-normal">{label}</div>
                    <div className="text-[10.5px] text-zinc-900 font-medium truncate">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity tab view */}
          <div className="col-span-1 lg:col-span-8 min-w-0 flex flex-col">
            <SlidingTabs tabs={ACTIVITY_TABS} value={actTab} onChange={setActTab} />
            <div className="overflow-hidden pt-4 flex-1">
              <div key={actTab} className={actDir === 'right' ? 'animate-tab-from-right' : 'animate-tab-from-left'}>
                {actTab === 'companies' ? (
                  <div className="flex flex-col">
                    {companies.map((co) => (
                      <div key={co.name} className="flex items-center gap-3 py-3 border-b border-zinc-100 last:border-b-0">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-500 shrink-0">
                          <Buildings2 size={15} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10.5px] font-bold text-zinc-900 truncate">{co.name}</div>
                          <div className="text-[9.5px] text-zinc-500 font-normal truncate">{co.type}</div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => toast.info('Add Company', 'Company form is coming soon')}
                      className="mt-3 w-full h-8 flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer"
                    >
                      <AddCircle size={13} />
                      Add Company
                    </button>
                  </div>
                ) : actTab === 'itinerary' ? (
                  <div className="relative before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-px before:bg-zinc-200">
                    <div className="space-y-6">
                      {itinerary.map((item, idx) => (
                        <div key={idx} className="relative flex items-start gap-4 pl-8 group">
                          {/* Dot marker */}
                          <span className="absolute left-[7px] top-1.5 w-[9px] h-[9px] rounded-full bg-white border-2 border-zinc-900 group-hover:scale-125 transition-transform" />

                          <div className="flex-1 bg-white border border-zinc-200/70 rounded-xl p-3.5 sm:p-4 shadow-xs hover:border-zinc-300 transition-all flex flex-col sm:flex-row gap-4">
                            {/* Left: Image if available */}
                            {item.image && (
                              <div className="w-full sm:w-48 md:w-56 shrink-0 rounded-lg overflow-hidden border border-zinc-100 h-36 sm:h-auto min-h-[140px] relative group/img bg-zinc-50">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover object-center filter grayscale-[20%] group-hover/img:grayscale-0 group-hover/img:scale-105 transition-all duration-500"
                                />
                              </div>
                            )}

                            {/* Right: Information */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                {/* Header: Day & Time */}
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-white font-semibold text-[9.5px] uppercase tracking-wider">
                                      {item.day}
                                    </span>
                                    <span className="text-[10px] font-medium text-zinc-500">{item.date}</span>
                                    <span className="text-zinc-300">•</span>
                                    <span className="text-[10px] font-bold text-zinc-900">{item.time}</span>
                                  </div>
                                  <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-semibold">
                                    {item.category}
                                  </span>
                                </div>

                                {/* Title & Location */}
                                <h4 className="text-xs font-bold text-zinc-900 tracking-tight mb-1">{item.title}</h4>
                                <div className="flex items-center gap-1 text-[10px] text-zinc-500 mb-2">
                                  <MapPoint size={12} className="text-zinc-400 shrink-0" />
                                  <span className="truncate">{item.location}</span>
                                </div>

                                {/* Description */}
                                <p className="text-[10.5px] text-zinc-600 leading-relaxed">{item.description}</p>
                              </div>

                              {/* Ticket download card */}
                              {item.ticket && (
                                <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 mt-3">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-md bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
                                      <FileDownload size={14} />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-[10px] font-bold text-zinc-900 truncate">
                                        {item.ticket.label}
                                      </div>
                                      <div className="text-[9px] text-zinc-400 font-mono">
                                        {item.ticket.code} • {item.ticket.fileSize}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toast.success('Download Ticket', `Downloading ${item.ticket?.code} voucher...`)
                                    }
                                    className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-[9.5px] font-medium transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                                  >
                                    <FileDownload size={11} />
                                    Download
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : actTab === 'all' ? (
                  <div className="relative before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-px before:bg-zinc-200">
                    {ALL_TIMELINE.map((a, i) => (
                      <div key={`${a.title}-${i}`} className="relative flex items-start justify-between gap-4 pl-6 py-2.5">
                        <span className="absolute left-0 top-[15px] w-[9px] h-[9px] rounded-full bg-white border border-zinc-400" />
                        <div className="min-w-0">
                          <div className="text-[10.5px] font-medium text-zinc-900">
                            {a.title}
                            <span className="ml-2 text-[9px] font-normal text-zinc-400">{a.type}</span>
                          </div>
                          <div className="text-[10px] text-zinc-500 font-normal">{a.desc}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[9.5px] text-zinc-500 font-normal">{a.date}</div>
                          <div className="text-[9px] text-zinc-400 font-normal">{a.meta}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {(ACTIVITY_DATA[actTab] ?? []).map((a, i) => (
                      <div
                        key={`${a.title}-${i}`}
                        className="flex justify-between items-start gap-4 py-3 border-b border-zinc-100 last:border-b-0"
                      >
                        <div className="min-w-0">
                          <div className="text-[10.5px] font-bold text-zinc-900">{a.title}</div>
                          <p className="text-[10px] text-zinc-600 mt-0.5">{a.desc}</p>
                          <span className="text-[9px] text-zinc-400 font-medium">{a.meta}</span>
                        </div>
                        <span className="text-[9.5px] text-zinc-500 font-medium shrink-0">{a.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
