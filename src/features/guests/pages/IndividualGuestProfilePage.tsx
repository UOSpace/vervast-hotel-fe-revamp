import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AddSquare,
  AltArrowDown,
  Magnifer,
  Calendar,
  UsersGroupTwoRounded,
  Wallet,
  Widget,
  Notes,
  Letter,
  Phone,
  Buildings,
  Star,
  User
} from '@solar-icons/react';
import { useToast } from '../../../components/ui/toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type TabType = 'details' | 'companies' | 'events' | 'all' | 'sales_activities' | 'things_to_do' | 'marcom_activities' | 'emails' | 'attachments' | 'email_marketing' | 'calls' | 'notes';

// Detailed mock data for CRM Leads
const mockLeadsData = [
  { id: 'LD-501', name: 'Luxury Wellness Retreat Lead', stage: 'Prospecting', value: '$12,500', created: '2026-05-12', ref: 'REF-7721' },
  { id: 'LD-502', name: 'Family Summer Reunion Stay', stage: 'Proposal Sent', value: '$24,800', created: '2026-05-20', ref: 'REF-9912' },
  { id: 'LD-503', name: 'Corporate Executive Weekend', stage: 'Negotiation', value: '$8,200', created: '2026-06-02', ref: 'REF-4012' },
  { id: 'LD-504', name: 'Private Yacht Charter Inquiry', stage: 'New Inquiry', value: '$15,000', created: '2026-06-08', ref: 'REF-3091' },
];

// Detailed mock data for CRM Bookings
const mockBookingsData = [
  { id: 'BK-901', name: 'SOSEI Mizu Stay', stage: 'Confirmed', value: '$78,460', created: '2026-05-24', ref: 'CFM-902341' },
  { id: 'BK-902', name: 'SOSEI Alpine Winter Vacation', stage: 'Confirmed', value: '$18,400', created: '2026-06-01', ref: 'CFM-882103' },
  { id: 'BK-903', name: 'SOSEI Desert Suite Booking', stage: 'Departed', value: '$12,150', created: '2026-02-12', ref: 'CFM-712894' },
  { id: 'BK-904', name: 'SOSEI City Weekend Escapade', stage: 'Cancelled', value: '$3,200', created: '2026-04-18', ref: 'CFM-609102' },
];

// ─── Detail Modal ────────────────────────────────────────────────────────────
interface ModalContent { title: string; subtitle?: string; body: React.ReactNode; }

function DetailModal({ content, onClose }: { content: ModalContent; onClose: () => void }) {
  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-200"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 z-[9999] w-[92vw] max-w-[520px] max-h-[85vh] bg-[#fdfaf7] shadow-2xl rounded-2xl border border-[#d4c4b7] flex flex-col overflow-hidden -translate-x-1/2 -translate-y-1/2 animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-[#d4c4b7]/50 bg-gradient-to-b from-[#f3eae1]/60 to-transparent flex justify-between items-start">
          <div>
            <h3 className="font-serif text-xl text-[#4a3c31]">{content.title}</h3>
            {content.subtitle && <p className="text-[10px] text-[#947b66] uppercase tracking-wider font-semibold mt-0.5">{content.subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#e5d8cb] text-[#6A5848] transition-colors shrink-0">✕</button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 text-[#4a3c31] text-xs">
          {content.body}
        </div>
      </div>
    </>,
    document.body
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────
export function IndividualGuestProfilePage() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Detail modal state
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const closeModal = () => setModalContent(null);

  // State for active tab in "Leads & Bookings"
  const [leadTab, setLeadTab] = useState<'leads' | 'bookings'>('leads');

  // State for bottom relation tabs
  const [activeTab, setActiveTab] = useState<TabType>('details');

  // Filter states
  const [searchLeadQuery, setSearchLeadQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Form states for Details Tab
  const [formData, setFormData] = useState({
    firstName: 'Jennifer',
    lastName: 'Green',
    email: 'jennifer@yahoo.com',
    otherEmail: '',
    phone: '+1 (212) 555-7842',
    phoneType: 'Mobile',
    streetAddress: 'Dk. Baung No. 347',
    city: 'Dumai',
    state: 'Jawa Timur',
    country: 'Indonesia',
    zipCode: '92353',
    airportCode: '',
    linkedin: '',
    regionsOfOperation: '',
    contactTagging: '',
    cityDropdown: '',
    countryOfResidence: '',
    dob: '',
    passportNumber: '',
    workEmail: '',
    instagram: '',
    loyaltyTier: 'Gold',
    // Associations
    houseAgency: '',
    icAgency: '',
    consortia: '',
    houseAgencyConsortia: '',
    eventCity: '',
    owner: 'vervast',
    events: 'Seasonal Holiday',
    // Professional
    jobTitle: 'Kondektur',
    roleDesignation: '',
    countriesOfExpertise: '',
    specialCategories: '',
    recognition: '',
    agentTier: '',
    followUp: '',
    followUpDate: '',
    topBookings: '',
    contactTags: '',
    notes: 'John Anderson values highly personalized touches, private transport arrangements, and early morning activities.'
  });

  // Also define a helper for displayName
  const displayName = `${formData.firstName} ${formData.lastName}`;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile Saved', 'Guest profile details updated successfully.', 3000);
  };

  // Actions
  const handleAddBooking = () => {
    toast.warning('Not Available', 'The booking engine is currently undergoing maintenance.', 3500);
  };

  const handleActionClick = (action: string) => {
    toast.info('Action Executed', `${action} flow triggered for guest ${displayName} (${uuid}).`, 3000);
  };

  // Filter Leads & Bookings
  const currentItems = leadTab === 'leads' ? mockLeadsData : mockBookingsData;
  const filteredItems = currentItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchLeadQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchLeadQuery.toLowerCase()) ||
      item.ref.toLowerCase().includes(searchLeadQuery.toLowerCase());

    if (startDate && endDate) {
      const itemDate = new Date(item.created);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return matchesSearch && itemDate >= start && itemDate <= end;
    }

    return matchesSearch;
  });

  const totalRevenue = filteredItems.reduce((acc, curr) => {
    if (curr.stage === 'Cancelled') return acc;
    const numericVal = parseInt(curr.value.replace(/[^0-9]/g, ''), 10);
    return acc + numericVal;
  }, 0);

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">

      {/* Back navigation */}
      <div className="flex flex-col mb-4 animate-card-enter">
        <button
          onClick={() => navigate('/dashboard/guests/individual')}
          className="flex items-center text-[#7d6b5e] hover:text-[#4a3c31] transition-colors w-fit mb-2 text-sm gap-2"
        >
          <ArrowLeft size={16} /> Back to Individual Guests
        </button>
      </div>

      <div className="flex flex-col gap-6 text-xs animate-card-enter" style={{ animationDelay: '0.1s' }}>

        {/* 1. TOP CARD: Profile Summary */}
        <div className="relative z-20 border border-[#d4c4b7] rounded-[12px] p-5 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            {/* Avatar Circle */}
            <div className="w-16 h-16 rounded-full bg-[#947b66]/20 backdrop-blur-sm border-2 border-[#947b66] flex items-center justify-center text-[#4a3c31] text-xl font-serif font-bold shadow-inner">
              JA
            </div>

            {/* Guest Info */}
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-serif text-[#4a3c31] font-bold">{displayName}</h2>
              <div className="flex items-center gap-2 text-[#7d6b5e] text-[11px]">
                <span className="font-semibold text-[#947b66]">Primary Member</span>
                <span>•</span>
                <span className="flex items-center gap-0.5"><Star size={12} className="text-[#C8A050] fill-[#C8A050]" /> {formData.loyaltyTier || 'Gold'} Loyalty</span>
                <span>•</span>
                <span className="font-mono text-[10px] bg-[#e5d8cb]/50 px-1.5 py-0.5 rounded text-[#4a3c31]">GST-001</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#7d6b5e] text-[10px] mt-1">
                <span className="flex items-center gap-1"><Letter size={12} /> {formData.email}</span>
                <span className="flex items-center gap-1"><Phone size={12} /> {formData.phone}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={handleAddBooking}
              className="bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-97 cursor-pointer"
            >
              <AddSquare size={16} /> Add Booking
            </button>
            <div className="relative group">
              <button
                className="bg-[#efe7d5]/80 hover:bg-[#e5d8cb] border border-[#d4c4b7] text-[#4a3c31] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                Actions <AltArrowDown size={14} />
              </button>
              <div className="absolute right-0 top-9 hidden group-hover:block z-50 w-36 bg-[#f3eae1] border border-[#d4c4b7] rounded-xl shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                <button onClick={() => handleActionClick('Send Email')} className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] transition-colors">Send Email</button>
                <button onClick={() => handleActionClick('Edit Profile')} className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] transition-colors">Edit Profile</button>
                <button onClick={() => handleActionClick('Print Details')} className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] transition-colors">Print Details</button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MIDDLE SECTION: Leads & Bookings Card */}
        <div className="border border-[#d4c4b7] rounded-[12px] overflow-hidden bg-[#f3eae1]/30 backdrop-blur-sm shadow-xs">
          {/* Header */}
          <div className="bg-[#947b66]/10 backdrop-blur-sm px-5 py-4 border-b border-[#d4c4b7] flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold font-serif text-[#4a3c31]">Leads & Bookings</h3>
              <p className="text-[10px] text-[#7d6b5e]">View and track all leads and booking records generated for this contact.</p>
            </div>
            <div className="w-5 h-5 rounded-full hover:bg-black/5 flex items-center justify-center text-[#7d6b5e] cursor-pointer">
              <AltArrowDown size={16} />
            </div>
          </div>

          <div className="p-5 flex flex-col gap-5">
            {/* Inner Tabs switcher */}
            <div className="flex border-b border-[#d4c4b7]/60 pb-px gap-6">
              <button
                onClick={() => setLeadTab('leads')}
                className={`pb-2 font-bold uppercase tracking-wider text-[10px] transition-colors relative cursor-pointer ${leadTab === 'leads' ? 'text-[#947b66]' : 'text-[#7d6b5e] hover:text-[#4a3c31]'
                  }`}
              >
                Leads
                {leadTab === 'leads' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#947b66] rounded-full" />
                )}
              </button>
              <button
                onClick={() => setLeadTab('bookings')}
                className={`pb-2 font-bold uppercase tracking-wider text-[10px] transition-colors relative cursor-pointer ${leadTab === 'bookings' ? 'text-[#947b66]' : 'text-[#7d6b5e] hover:text-[#4a3c31]'
                  }`}
              >
                Bookings
                {leadTab === 'bookings' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#947b66] rounded-full" />
                )}
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-[240px]">
                <Magnifer size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#947b66]" />
                <input
                  type="text"
                  placeholder="Search leads/bookings by name or ID..."
                  value={searchLeadQuery}
                  onChange={(e) => setSearchLeadQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 text-xs bg-white/50 border border-[#d4c4b7] rounded-lg text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] transition-all"
                />
              </div>
              <div className="flex items-center gap-2 text-[#7d6b5e]">
                <span className="text-[10px] font-bold uppercase tracking-wider">Created Date</span>
                <div className="relative flex items-center">
                  <DatePicker
                    portalId="datepicker-portal"
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update: [Date | null, Date | null]) => {
                      setStartDate(update[0]);
                      setEndDate(update[1]);
                    }}
                    dateFormat="MMM d, yyyy"
                    placeholderText="Select Date Range"
                    className="bg-[#f3eae1]/60 border border-[#d4c4b7] text-[#4a3c31] text-[10px] rounded-md pl-3 pr-8 py-1.5 w-[180px] focus:outline-none focus:ring-1 focus:ring-[#947b66] font-medium cursor-pointer"
                  />
                  <Calendar size={12} className="absolute right-2 text-[#947b66] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Two stats boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex items-center gap-4 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-[#947b66]/10 backdrop-blur-sm flex items-center justify-center text-[#947b66]">
                  <UsersGroupTwoRounded size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider">Total {leadTab === 'leads' ? 'Leads' : 'Bookings'}</div>
                  <div className="text-xl font-serif font-bold text-[#4a3c31] mt-0.5">{filteredItems.length}</div>
                </div>
              </div>

              <div className="border border-[#d4c4b7] rounded-[12px] p-4 bg-[#f3eae1]/30 backdrop-blur-sm flex items-center gap-4 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-[#657454]/10 flex items-center justify-center text-[#657454]">
                  <Wallet size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider">Total Revenue</div>
                  <div className="text-xl font-serif font-bold text-[#4a3c31] mt-0.5">
                    ${totalRevenue.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Table Area */}
            <div className="border border-[#d4c4b7]/80 rounded-lg overflow-hidden bg-white/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f3eae1]/80 border-b border-[#d4c4b7] text-[9px] font-bold uppercase tracking-widest text-[#7d6b5e]">
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Status/Stage</th>
                    <th className="px-4 py-2.5">Revenue</th>
                    <th className="px-4 py-2.5">Reference / Confirmation #</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, idx) => (
                      <tr
                        key={idx}
                        className="text-[#4a3c31] text-[11px] hover:bg-[#e5d8cb]/30 border-b border-[#d4c4b7]/30 transition-colors cursor-pointer"
                        onClick={() => setModalContent({
                          title: item.name,
                          subtitle: leadTab === 'leads' ? `Lead · ${item.stage}` : `Booking · ${item.stage}`,
                          body: (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">{leadTab === 'leads' ? 'Lead ID' : 'Booking ID'}</div>
                                  <div className="font-mono font-bold text-[#4a3c31]">{item.id}</div>
                                </div>
                                <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">Revenue</div>
                                  <div className="font-bold text-[#4a3c31] text-base font-serif">{item.value}</div>
                                </div>
                                <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">Status</div>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${item.stage === 'Confirmed' || item.stage === 'Proposal Sent' ? 'bg-[#657454]/15 text-[#4e5a45] border-[#657454]/20'
                                    : item.stage === 'Cancelled' ? 'bg-[#a65e52]/15 text-[#61271f] border-[#a65e52]/20'
                                      : 'bg-[#C8A050]/15 text-[#7a5e2a] border-[#C8A050]/20'
                                    }`}>{item.stage}</span>
                                </div>
                                <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">Created Date</div>
                                  <div className="text-[#4a3c31]">{item.created}</div>
                                </div>
                              </div>
                              <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">Reference / Confirmation #</div>
                                <div className="font-mono text-[#947b66] font-semibold">{item.ref}</div>
                              </div>
                              <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-2">Guest</div>
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-[#947b66]/20 backdrop-blur-sm border border-[#947b66] flex items-center justify-center text-[#4a3c31] text-xs font-bold">JG</div>
                                  <div>
                                    <div className="font-bold">Jennifer Green</div>
                                    <div className="text-[10px] text-[#7d6b5e]">jennifer@yahoo.com · GST-001</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      >
                        <td className="px-4 py-3 font-medium">{item.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${item.stage === 'Confirmed' || item.stage === 'Proposal Sent'
                            ? 'bg-[#657454]/15 text-[#4e5a45] border-[#657454]/20'
                            : item.stage === 'Cancelled'
                              ? 'bg-[#a65e52]/15 text-[#61271f] border-[#a65e52]/20'
                              : 'bg-[#C8A050]/15 text-[#7a5e2a] border-[#C8A050]/20'
                            }`}>
                            {item.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold">{item.value}</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-[#947b66]">{item.ref}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-[#7d6b5e] italic">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Widget size={24} className="text-[#947b66]/50" />
                          <div>No records found</div>
                          <span className="text-[10px] not-italic text-[#7d6b5e]/70">Try adjusting your filters or search query</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* 3. BOTTOM SECTION: Relations Tab Control */}
        <div className="border border-[#d4c4b7] rounded-[12px] overflow-hidden bg-[#f3eae1]/30 backdrop-blur-sm shadow-xs">
          {/* Tabs bar */}
          <div className="flex overflow-x-auto custom-scrollbar border-b border-[#d4c4b7] bg-[#f3eae1]/60 p-1">
            {[
              { id: 'details', label: 'Details', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg> },
              { id: 'companies', label: 'Companies', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="9" y1="22" x2="9" y2="16" /><line x1="15" y1="22" x2="15" y2="16" /><line x1="9" y1="16" x2="15" y2="16" /></svg> },
              { id: 'events', label: 'Events', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
              { id: 'all', label: 'All', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="8" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="8" y2="18" /></svg> },
              { id: 'sales_activities', label: 'Sales Activities', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="m9 16 2 2 4-4" /></svg> },
              { id: 'things_to_do', label: 'Things To Do', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="m9 14 2 2 4-4" /></svg> },
              { id: 'marcom_activities', label: 'Marcom Activities', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg> },
              { id: 'emails', label: 'Emails', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> },
              { id: 'attachments', label: 'Attachments', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg> },
              { id: 'email_marketing', label: 'Email Marketing', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polygon points="12 2 2 7 12 12 22 7" /></svg> },
              { id: 'calls', label: 'Calls', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg> },
              { id: 'notes', label: 'Notes', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id
                  ? 'bg-[#947b66] text-[#efe7d5] shadow-xs'
                  : 'text-[#7d6b5e] hover:bg-[#e5d8cb]/50 hover:text-[#4a3c31]'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="p-5 min-h-[220px]">

            {/* DETAILS TAB - COMPLETED FORM */}
            {activeTab === 'details' && (
              <form onSubmit={handleSaveForm} className="space-y-6 animate-in fade-in duration-200 text-[#4a3c31]">
                <div className="flex justify-between items-center border-b border-[#d4c4b7] pb-2">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#7d6b5e] font-serif">
                    Details
                  </div>
                  <div className="flex items-center gap-2 text-[#7d6b5e]">
                    <button type="button" className="p-1 rounded-sm hover:bg-black/5 cursor-pointer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6" /></svg>
                    </button>
                    <button type="button" className="p-1 rounded-sm hover:bg-black/5 cursor-pointer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-[11px]">

                  {/* Column 1: Other Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 font-bold text-[#7d6b5e] pb-1 border-b border-[#d4c4b7]/50 text-xs">
                      <User size={14} /> Other Information
                    </div>

                    {/* Avatar upload */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <div />
                      <div>
                        <button type="button" className="flex items-center gap-1 px-3 py-1 rounded-full border border-sky-200 bg-sky-50/50 hover:bg-sky-50 text-sky-700 text-[10px] font-semibold transition-colors cursor-pointer">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" /><path d="M12 10V6" /><path d="M12 14v4" /><path d="M10 12h4" /></svg>
                          Upload Avatar
                        </button>
                      </div>
                    </div>

                    {/* First Name */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        <span className="text-red-500 font-bold">*</span> First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                    {/* Email */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Email</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7d6b5e]">
                          <Letter size={12} />
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          className="h-8 pl-8 pr-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                        />
                      </div>
                    </div>

                    {/* Other Email Addresses */}
                    <div className="grid grid-cols-[110px_1fr] items-start gap-2">
                      <label className="font-medium text-[#7d6b5e] pt-2">Other Email Addresses</label>
                      <div className="space-y-1">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7d6b5e]">
                            <Letter size={12} />
                          </span>
                          <input
                            type="email"
                            name="otherEmail"
                            value={formData.otherEmail}
                            onChange={handleFormChange}
                            className="h-8 pl-8 pr-8 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                          />
                          <button type="button" onClick={() => setFormData(p => ({ ...p, otherEmail: '' }))} className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-[#4a3c31] text-[#7d6b5e] p-0.5">
                            <span className="text-sm">×</span>
                          </button>
                        </div>
                        <button type="button" className="text-[#947b66] hover:text-[#4a3c31] font-semibold text-[9px] flex items-center justify-end w-full gap-0.5">
                          <span>+ Add Another</span>
                        </button>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="grid grid-cols-[110px_1fr] items-start gap-2">
                      <label className="font-medium text-[#7d6b5e] pt-2">Phone</label>
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7d6b5e]">
                              <Phone size={12} />
                            </span>
                            <input
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleFormChange}
                              className="h-8 pl-8 pr-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                            />
                          </div>
                          <select
                            name="phoneType"
                            value={formData.phoneType}
                            onChange={handleFormChange}
                            className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] outline-none"
                          >
                            <option value="Mobile">Mobile</option>
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                          </select>
                          <button type="button" onClick={() => setFormData(p => ({ ...p, phone: '' }))} className="hover:bg-black/5 rounded-md px-2 border border-[#d4c4b7] hover:text-[#4a3c31] text-[#7d6b5e]">
                            <span>×</span>
                          </button>
                        </div>
                        <button type="button" className="text-[#947b66] hover:text-[#4a3c31] font-semibold text-[9px] flex items-center justify-end w-full gap-0.5">
                          <span>+ Add Another</span>
                        </button>
                      </div>
                    </div>

                    {/* Street Address */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Street Address</label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                    {/* City */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                    {/* State */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                    {/* Country */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        Country <span className="text-[#7d6b5e]/60" title="Help information">ⓘ</span>
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Select country...</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="United States">United States</option>
                        <option value="Japan">Japan</option>
                        <option value="Singapore">Singapore</option>
                      </select>
                    </div>

                    {/* Zip Code */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                    {/* Airport Code */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        Airport Code <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <input
                        type="text"
                        name="airportCode"
                        value={formData.airportCode}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                    {/* LinkedIn Profile */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        LinkedIn Profile <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                    {/* Regions of Operation */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        Regions of Operation <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <select
                        name="regionsOfOperation"
                        value={formData.regionsOfOperation}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Select regions...</option>
                        <option value="Asia Pacific">Asia Pacific</option>
                        <option value="North America">North America</option>
                        <option value="Europe">Europe</option>
                      </select>
                    </div>

                    {/* Contact Tagging */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Contact Tagging</label>
                      <select
                        name="contactTagging"
                        value={formData.contactTagging}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Select tag...</option>
                        <option value="VIP">VIP</option>
                        <option value="Regular">Regular</option>
                      </select>
                    </div>

                    {/* City Dropdown */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">City</label>
                      <select
                        name="cityDropdown"
                        value={formData.cityDropdown}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Select city...</option>
                        <option value="Dumai">Dumai</option>
                        <option value="Surabaya">Surabaya</option>
                        <option value="Jakarta">Jakarta</option>
                      </select>
                    </div>

                    {/* Country Of Residence */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Country Of Residence</label>
                      <input
                        type="text"
                        name="countryOfResidence"
                        value={formData.countryOfResidence}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Date of Birth</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7d6b5e]">
                          <Calendar size={12} />
                        </span>
                        <input
                          type="text"
                          name="dob"
                          placeholder="Select date..."
                          value={formData.dob}
                          onChange={handleFormChange}
                          className="h-8 pl-8 pr-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                        />
                      </div>
                    </div>

                    {/* Passport Number */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Passport Number</label>
                      <input
                        type="text"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                    {/* Work Email */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Work Email</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7d6b5e]">
                          <Letter size={12} />
                        </span>
                        <input
                          type="email"
                          name="workEmail"
                          value={formData.workEmail}
                          onChange={handleFormChange}
                          className="h-8 pl-8 pr-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                        />
                      </div>
                    </div>

                    {/* Instagram */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Instagram</label>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                  </div>

                  {/* Column 2: Associations */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 font-bold text-[#7d6b5e] pb-1 border-b border-[#d4c4b7]/50 text-xs">
                      <Buildings size={14} /> Associations
                    </div>

                    {/* House Agency */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        House Agency <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <select
                        name="houseAgency"
                        value={formData.houseAgency}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Type to search...</option>
                        <option value="Vervast Agency">Vervast Agency</option>
                      </select>
                    </div>

                    {/* IC Agency */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        IC Agency <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <select
                        name="icAgency"
                        value={formData.icAgency}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Type to search...</option>
                      </select>
                    </div>

                    {/* Consortia */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        Consortia <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <select
                        name="consortia"
                        value={formData.consortia}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Type to search...</option>
                      </select>
                    </div>

                    {/* House Agency Consortia */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        House Agency Consortia <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <select
                        name="houseAgencyConsortia"
                        value={formData.houseAgencyConsortia}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Type to search...</option>
                      </select>
                    </div>

                    {/* Event City */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        Event City <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <input
                        type="text"
                        name="eventCity"
                        value={formData.eventCity}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                    {/* Owner */}
                    <div className="grid grid-cols-[110px_1fr] items-start gap-2">
                      <label className="font-medium text-[#7d6b5e] pt-1.5">Owner</label>
                      <div className="min-h-8 flex flex-wrap gap-1 p-1 items-center rounded-lg border border-[#d4c4b7] bg-white/45 w-full">
                        {formData.owner && (
                          <span className="flex items-center gap-1 bg-gray-200/80 px-2 py-0.5 rounded-md text-[10px] font-bold text-[#4a3c31]">
                            {formData.owner}
                            <button type="button" onClick={() => setFormData(p => ({ ...p, owner: '' }))} className="hover:text-red-500 font-bold ml-0.5">×</button>
                          </span>
                        )}
                        {!formData.owner && (
                          <span className="text-[10px] text-[#7d6b5e]/60 pl-2">Select owner...</span>
                        )}
                      </div>
                    </div>

                    {/* Events */}
                    <div className="grid grid-cols-[110px_1fr] items-start gap-2">
                      <label className="font-medium text-[#7d6b5e] pt-1.5">Events</label>
                      <div className="min-h-8 flex flex-wrap gap-1 p-1 items-center rounded-lg border border-[#d4c4b7] bg-white/45 w-full">
                        {formData.events && (
                          <span className="flex items-center gap-1 bg-gray-200/80 px-2 py-0.5 rounded-md text-[10px] font-bold text-[#4a3c31]">
                            {formData.events}
                            <button type="button" onClick={() => setFormData(p => ({ ...p, events: '' }))} className="hover:text-red-500 font-bold ml-0.5">×</button>
                          </span>
                        )}
                        {!formData.events && (
                          <span className="text-[10px] text-[#7d6b5e]/60 pl-2">Select events...</span>
                        )}
                      </div>
                    </div>

                    {/* Marketing list membership */}
                    <div className="grid grid-cols-[110px_1fr] items-start gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        Marketing list membership <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <div className="text-[10px] text-[#7d6b5e] leading-snug pt-1">
                        <div>This contact is not on any marketing list.</div>
                        <button type="button" className="text-sky-600 hover:text-sky-700 font-bold mt-1.5 underline underline-offset-2">
                          Open Marketing Lists
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Column 3: Professional */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 font-bold text-[#7d6b5e] pb-1 border-b border-[#d4c4b7]/50 text-xs">
                      <Notes size={14} /> Professional
                    </div>

                    {/* Job Title */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Job Title</label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                    {/* Role Designation */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        Role Designation <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <input
                        type="text"
                        name="roleDesignation"
                        value={formData.roleDesignation}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                    {/* Countries of Expertise */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        Countries of Expertise <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <select
                        name="countriesOfExpertise"
                        value={formData.countriesOfExpertise}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Select country...</option>
                      </select>
                    </div>

                    {/* Special Categories */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Special Categories</label>
                      <select
                        name="specialCategories"
                        value={formData.specialCategories}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Select category...</option>
                      </select>
                    </div>

                    {/* Recognition */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Recognition</label>
                      <input
                        type="text"
                        name="recognition"
                        value={formData.recognition}
                        onChange={handleFormChange}
                        className="h-8 px-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      />
                    </div>

                    {/* Agent Tier */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Agent Tier</label>
                      <select
                        name="agentTier"
                        value={formData.agentTier}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Select tier...</option>
                      </select>
                    </div>

                    {/* Follow Up */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Follow Up</label>
                      <select
                        name="followUp"
                        value={formData.followUp}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Select options...</option>
                      </select>
                    </div>

                    {/* Follow Up Date */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        Follow Up Date <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7d6b5e]">
                          <Calendar size={12} />
                        </span>
                        <input
                          type="text"
                          name="followUpDate"
                          placeholder="Select date..."
                          value={formData.followUpDate}
                          onChange={handleFormChange}
                          className="h-8 pl-8 pr-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                        />
                      </div>
                    </div>

                    {/* Top Bookings */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e]">Top Bookings</label>
                      <select
                        name="topBookings"
                        value={formData.topBookings}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Select bookings...</option>
                      </select>
                    </div>

                    {/* Contact Tags */}
                    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                      <label className="font-medium text-[#7d6b5e] flex items-center gap-0.5">
                        Contact Tags <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <select
                        name="contactTags"
                        value={formData.contactTags}
                        onChange={handleFormChange}
                        className="h-8 px-2 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full"
                      >
                        <option value="">Select tags...</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div className="grid grid-cols-[110px_1fr] items-start gap-2">
                      <label className="font-medium text-[#7d6b5e] pt-1.5 flex items-center gap-0.5">
                        Notes <span className="text-[#7d6b5e]/60">ⓘ</span>
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleFormChange}
                        rows={4}
                        className="p-3 rounded-lg border border-[#d4c4b7] bg-white/45 text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66] outline-none w-full resize-y"
                      />
                    </div>

                  </div>

                </div>

                <div className="flex justify-end pt-4 border-t border-[#d4c4b7]/40">
                  <button
                    type="submit"
                    className="text-[10px] text-[#efe7d5] bg-[#947b66] hover:bg-[#836a56] font-bold uppercase tracking-wider px-4 py-2 rounded-md transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* COMPANIES TAB - 3 items with beautiful premium BLUE/SLATE cards */}
            {activeTab === 'companies' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] border-b border-[#d4c4b7] pb-1.5 font-serif mb-2">
                  Associated Corporate Companies (3)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { name: 'Virtuoso Travel Advisor', type: 'Luxury Booking Agency', ref: 'VIR-8910', status: 'Primary' },
                    { name: 'American Express FHR', type: 'Credit Card Concierge Program', ref: 'AMX-4421', status: 'Active' },
                    { name: 'Black Card Concierge', type: 'Lifestyle & Travel Advisory', ref: 'BLK-0982', status: 'Secondary' },
                  ].map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-[#d4c4b7] rounded-[12px] bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col justify-between shadow-2xs hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
                      onClick={() => setModalContent({
                        title: comp.name,
                        subtitle: comp.type,
                        body: (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">Reference Code</div>
                                <div className="font-mono font-bold text-[#4a3c31]">{comp.ref}</div>
                              </div>
                              <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">Status</div>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#947b66]/15 text-[#4a3c31] border border-[#947b66]/20">{comp.status}</span>
                              </div>
                            </div>
                            <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">Company Type</div>
                              <div className="text-[#4a3c31]">{comp.type}</div>
                            </div>
                            <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-2">Associated Guest</div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#947b66]/20 backdrop-blur-sm border border-[#947b66] flex items-center justify-center text-[#4a3c31] text-xs font-bold">JG</div>
                                <div>
                                  <div className="font-bold">Jennifer Green</div>
                                  <div className="text-[10px] text-[#7d6b5e]">Gold Loyalty · GST-001</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-[#4a3c31] text-xs leading-tight">{comp.name}</h4>
                          <span className="text-[8px] font-bold uppercase bg-[#947b66]/15 text-[#4a3c31] px-1.5 py-0.5 rounded-sm">{comp.status}</span>
                        </div>
                        <p className="text-[10px] text-[#7d6b5e]">{comp.type}</p>
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#d4c4b7]/40 text-[9px] text-[#7d6b5e]">
                        <span>Code: <strong className="font-mono text-[#4a3c31]">{comp.ref}</strong></span>
                        <span className="text-[#947b66] font-bold">View Details →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EVENTS TAB - 4 items with beautiful premium BLUE/SLATE cards */}
            {activeTab === 'events' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] border-b border-[#d4c4b7] pb-1.5 font-serif mb-2">
                  Upcoming & Past Events (4)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { name: 'Private Snorkeling Tour', date: 'May 28, 2027', location: 'Maldives Mizu', type: 'Active' },
                    { name: 'Anniversary Dining Event', date: 'May 26, 2027', location: 'Undersea Resto', type: 'Active' },
                    { name: 'Spa & Wellness Treatment', date: 'May 25, 2027', location: 'Soothing Spa', type: 'Completed' },
                    { name: 'Sunrise Photography Walk', date: 'May 24, 2027', location: 'Resort Beach', type: 'Completed' },
                  ].map((evt, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-[#d4c4b7] rounded-[12px] bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col justify-between shadow-2xs hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
                      onClick={() => setModalContent({
                        title: evt.name,
                        subtitle: `Event · ${evt.type}`,
                        body: (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">Date</div>
                                <div className="font-bold text-[#4a3c31] flex items-center gap-1"><Calendar size={12} className="text-[#947b66]" /> {evt.date}</div>
                              </div>
                              <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">Status</div>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${evt.type === 'Active' ? 'bg-[#657454]/15 text-[#35432c] border-[#657454]/20' : 'bg-[#947b66]/15 text-[#4a3c31] border-[#947b66]/20'
                                  }`}>{evt.type}</span>
                              </div>
                            </div>
                            <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">Location / Venue</div>
                              <div className="text-[#4a3c31]">{evt.location}</div>
                            </div>
                            <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-2">Participant</div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#947b66]/20 backdrop-blur-sm border border-[#947b66] flex items-center justify-center text-[#4a3c31] text-xs font-bold">JG</div>
                                <div>
                                  <div className="font-bold">Jennifer Green</div>
                                  <div className="text-[10px] text-[#7d6b5e]">Gold Loyalty · GST-001</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <h4 className="font-bold text-[#4a3c31] text-xs leading-tight">{evt.name}</h4>
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${evt.type === 'Active' ? 'bg-[#657454]/15 text-[#35432c]' : 'bg-[#947b66]/15 text-[#efe7d5]'
                            }`}>{evt.type}</span>
                        </div>
                        <p className="text-[10px] text-[#7d6b5e] flex items-center gap-1"><Calendar size={12} /> {evt.date}</p>
                        <p className="text-[9px] text-[#7d6b5e]/80 mt-1 italic">{evt.location}</p>
                      </div>
                      <div className="flex justify-end mt-3 pt-2 border-t border-[#d4c4b7]/40 text-[9px]">
                        <span className="text-[#947b66] font-bold">View Details →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ALL (Audit Log / Timeline) TAB */}
            {activeTab === 'all' && (
              <div className="space-y-6 animate-in fade-in duration-200 text-[#4a3c31]">
                {/* Filter Section */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#7d6b5e]">Filter by</span>
                  <div className="relative flex items-center">
                    <select className="bg-transparent hover:bg-[#e5d8cb]/30 border-none text-[10px] font-bold text-[#4a3c31] py-0.5 pl-1 pr-4 focus:outline-none cursor-pointer appearance-none">
                      <option value="all">All</option>
                      <option value="trash">Trash</option>
                      <option value="updates">Updates</option>
                      <option value="creation">Creation</option>
                    </select>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute right-0 text-[#7d6b5e] pointer-events-none"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                </div>

                {/* Timeline List */}
                <div className="relative pl-7 space-y-6">
                  {/* Vertical Line */}
                  <div className="absolute left-[13px] top-1.5 bottom-1.5 w-px bg-[#d4c4b7]" />

                  {/* Timeline Item 1 */}
                  <div className="relative flex justify-between items-start">
                    <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center text-[#7d6b5e]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </div>
                    <div className="text-[11px] leading-relaxed pt-0.5">
                      The associated <span className="font-semibold text-[#4a3c31]">Acquisition Bandung 2025</span> record has been moved to trash by <span className="font-semibold text-[#4a3c31]">vervast</span> <span className="text-[#7d6b5e]">— October 9, 2025 03:38</span>
                    </div>
                    <button className="text-[10px] text-[#7d6b5e] hover:text-[#4a3c31] font-semibold whitespace-nowrap ml-4">
                      Pin on top
                    </button>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="relative flex justify-between items-start">
                    <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center text-[#7d6b5e]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </div>
                    <div className="text-[11px] leading-relaxed pt-0.5">
                      The associated <span className="font-semibold text-[#4a3c31]">Villa Surabaya 2023</span> record has been moved to trash by <span className="font-semibold text-[#4a3c31]">vervast</span> <span className="text-[#7d6b5e]">— October 9, 2025 03:38</span>
                    </div>
                    <button className="text-[10px] text-[#7d6b5e] hover:text-[#4a3c31] font-semibold whitespace-nowrap ml-4">
                      Pin on top
                    </button>
                  </div>

                  {/* Timeline Item 3 */}
                  <div className="relative flex justify-between items-start">
                    <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center text-[#7d6b5e]">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </div>
                    <div className="text-[11px] leading-relaxed pt-0.5">
                      The record has been updated by <span className="text-[#7d6b5e]">— October 8, 2025 23:21</span>
                      <button className="text-[10px] text-[#947b66] hover:text-[#4a3c31] font-bold mt-1 block">
                        View Updated Fields (8)
                      </button>
                    </div>
                    <button className="text-[10px] text-[#7d6b5e] hover:text-[#4a3c31] font-semibold whitespace-nowrap ml-4">
                      Pin on top
                    </button>
                  </div>

                  {/* Timeline Item 4 */}
                  <div className="relative flex justify-between items-start">
                    <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-[#f3eae1] border border-[#d4c4b7] flex items-center justify-center text-[#7d6b5e]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    <div className="text-[11px] leading-relaxed pt-0.5">
                      The record has been created by <span className="font-semibold text-[#4a3c31]">vervast</span> <span className="text-[#7d6b5e]">— October 8, 2025 01:06</span>
                    </div>
                    <button className="text-[10px] text-[#7d6b5e] hover:text-[#4a3c31] font-semibold whitespace-nowrap ml-4">
                      Pin on top
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SALES ACTIVITIES TAB */}
            {activeTab === 'sales_activities' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] border-b border-[#d4c4b7] pb-1.5 font-serif mb-2">
                  Recent CRM Sales Activities (4)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { action: 'Welcome Gift Delivered', desc: 'Sake & premium fruit basket arranged in room.', date: 'May 24, 2026', agent: 'Maria B. (Butler)' },
                    { action: 'Room Upgrade Offered', desc: 'Upgraded to Pavilion Suite upon check-in.', date: 'May 24, 2026', agent: 'Lars O. (Front Desk)' },
                    { action: 'Email Newsletter Opened', desc: 'Customer viewed Vervast Summer Newsletter.', date: 'May 18, 2026', agent: 'System Auto' },
                    { action: 'Pre-arrival Check Call', desc: 'Discussed transfer logistics and allergy options.', date: 'May 15, 2026', agent: 'Lisa M. (PA)' },
                  ].map((act, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-[#d4c4b7] rounded-[12px] bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col justify-between shadow-2xs hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
                      onClick={() => setModalContent({
                        title: act.action,
                        subtitle: 'CRM Sales Activity',
                        body: (
                          <div className="space-y-3">
                            <div className="bg-[#f3eae1]/50 rounded-xl p-4 border border-[#d4c4b7]/50">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-2">Activity Description</div>
                              <p className="text-[#4a3c31] leading-relaxed">{act.desc}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">Date</div>
                                <div className="font-bold text-[#4a3c31] flex items-center gap-1"><Calendar size={12} className="text-[#947b66]" /> {act.date}</div>
                              </div>
                              <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">Performed By</div>
                                <div className="text-[#4a3c31] italic">{act.agent}</div>
                              </div>
                            </div>
                            <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-2">Guest Profile</div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#947b66]/20 backdrop-blur-sm border border-[#947b66] flex items-center justify-center text-[#4a3c31] text-xs font-bold">JG</div>
                                <div>
                                  <div className="font-bold">Jennifer Green</div>
                                  <div className="text-[10px] text-[#7d6b5e]">Gold Loyalty · GST-001</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    >
                      <div>
                        <h4 className="font-bold text-[#4a3c31] text-xs mb-1 leading-tight">{act.action}</h4>
                        <p className="text-[10px] text-[#7d6b5e] leading-snug mb-2">{act.desc}</p>
                      </div>
                      <div className="flex flex-col gap-0.5 mt-2 pt-2 border-t border-[#d4c4b7]/40 text-[9px] text-[#7d6b5e]/80">
                        <div className="flex justify-between">
                          <span>Date: <strong className="text-[#4a3c31] font-mono">{act.date}</strong></span>
                        </div>
                        <span className="italic mt-0.5">By: {act.agent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* THINGS TO DO, MARCOM, EMAILS, ATTACHMENTS, EMAIL MARKETING, CALLS TABS */}
            {['things_to_do', 'marcom_activities', 'emails', 'attachments', 'email_marketing', 'calls'].includes(activeTab) && (
              <div className="text-center py-10 text-[#7d6b5e] italic animate-in fade-in duration-200">
                <div className="text-xs font-bold uppercase tracking-wider not-italic text-[#4a3c31] mb-1">
                  {activeTab.replace('_', ' ')} Records
                </div>
                <div>No records or files associated with this guest.</div>
              </div>
            )}

            {/* NOTES TAB - 4 items with beautiful premium BLUE/SLATE cards */}
            {activeTab === 'notes' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] border-b border-[#d4c4b7] pb-1.5 font-serif mb-2">
                  Special Staf Relationship Notes (4)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { title: 'VIP Butler Request', note: 'John strictly requests Butler Maria for all island activities.', source: 'Concierge Desk' },
                    { title: 'F&B Food Allergies', note: 'Shellfish allergy. Double check all seafood dishes.', source: 'F&B Kitchen' },
                    { title: 'Pillow Preferences', note: 'Prefers firm feather pillows and lavender room scent.', source: 'Housekeeping' },
                    { title: 'Newspaper Delivery', note: 'Deliver New York Times printed copy daily by 7 AM.', source: 'Front Desk' },
                  ].map((note, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-[#d4c4b7] rounded-[12px] bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col justify-between shadow-2xs hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer"
                      onClick={() => setModalContent({
                        title: note.title,
                        subtitle: `Staff Note · ${note.source}`,
                        body: (
                          <div className="space-y-3">
                            <div className="bg-[#f3eae1]/50 rounded-xl p-4 border border-[#d4c4b7]/50">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-2">Note Content</div>
                              <blockquote className="italic text-[#4a3c31] leading-relaxed border-l-2 border-[#C8A050] pl-3">
                                "{note.note}"
                              </blockquote>
                            </div>
                            <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-1">Source Department</div>
                              <div className="font-bold text-[#4a3c31]">{note.source}</div>
                            </div>
                            <div className="bg-[#f3eae1]/50 rounded-xl p-3 border border-[#d4c4b7]/50">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-[#947b66] mb-2">Regarding Guest</div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#947b66]/20 backdrop-blur-sm border border-[#947b66] flex items-center justify-center text-[#4a3c31] text-xs font-bold">JG</div>
                                <div>
                                  <div className="font-bold">Jennifer Green</div>
                                  <div className="text-[10px] text-[#7d6b5e]">Gold Loyalty · GST-001</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    >
                      <div>
                        <h4 className="font-bold text-[#4a3c31] text-xs mb-1 leading-tight">{note.title}</h4>
                        <blockquote className="italic text-[#7d6b5e] text-[10px] leading-snug">
                          "{note.note}"
                        </blockquote>
                      </div>
                      <div className="text-right mt-3 pt-2 border-t border-[#d4c4b7]/40 text-[8px] font-bold uppercase tracking-wider text-[#947b66]">
                        — {note.source}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Detail Modal */}
      {modalContent && <DetailModal content={modalContent} onClose={closeModal} />}
    </div>
  );
}
