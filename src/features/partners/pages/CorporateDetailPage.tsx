import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AddSquare,
  AltArrowDown,
  Magnifer,
  Calendar,
  UsersGroupTwoRounded,
  Wallet,
  Letter,
  Phone as PhoneIcon,
  Upload
} from '@solar-icons/react';
import { useToast } from '../../../components/ui/toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type TabType = 'details' | 'contacts' | 'all' | 'things_to_do' | 'contracts' | 'emails' | 'hierarchy' | 'attachments' | 'calls' | 'notes';

interface Lead {
  id: string;
  name: string;
  stage: string;
  value: string;
  created: string;
  ref: string;
}

interface Booking {
  id: string;
  name: string;
  stage: string;
  value: string;
  created: string;
  ref: string;
}

interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface CorporatePartner {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  source: string;
  owner: string;
  taxId: string;
  contractStart: string;
  discountLevel: string;
  domain: string;
  type: string;
  parentCompany: string;
  website: string;
  address: string;
  city: string;
  zipCode: string;
  stateRegion: string;
  country: string;
  cityTag: string;
  createdByPms: string;
  companyIdCode: string;
  travelAgentId: string;
  outstandingBalance: string;
  iataNumber: string;
  description: string;
  paymentTerms: string;
  currency: string;
  preferredPayment: string;
  companySize: string;
  sourceType: string;
  lastContacted: string;
  leads: Lead[];
  bookings: Booking[];
  contacts: Contact[];
}

const mockCorporatesList: CorporatePartner[] = [
  {
    id: 'CP-001',
    name: 'Vantage Capital Group',
    email: 'partnerships@vantagecg.com',
    phone: '+1 212 555 0142',
    category: 'Financial Services',
    source: 'Email Marketing',
    owner: 'Sarah Jenkins',
    taxId: 'TX-990-210',
    contractStart: 'Jan 15, 2024',
    discountLevel: 'Gold Rate (15% off)',
    domain: 'vantagecg.com',
    type: 'Enterprise',
    parentCompany: 'Ryanuno Company',
    website: 'https://vantagecg.com',
    address: '55 Broad Street, 24th Floor',
    city: 'New York',
    zipCode: '10004',
    stateRegion: 'NY',
    country: 'United States',
    cityTag: 'NEW YORK',
    createdByPms: 'PMS-Sync',
    companyIdCode: 'Company-1325',
    travelAgentId: 'TravelAgent-1223',
    outstandingBalance: '$0.00',
    iataNumber: 'JFK',
    description: 'Vantage Capital Group is a leading private equity firm focusing on technology and hospitality sector investments globally.',
    paymentTerms: 'Net 30',
    currency: 'USD',
    preferredPayment: 'Corporate Credit Card',
    companySize: '500-1000 employees',
    sourceType: 'Inbound Referral',
    lastContacted: 'June 20, 2026',
    leads: [
      { id: 'LD-7721', name: 'Luxury Executive Retreat', stage: 'Proposal Sent', value: '$12,500', created: 'June 10, 2026', ref: 'REF-7721' },
      { id: 'LD-4812', name: 'Annual Board Meeting Stay', stage: 'Negotiation', value: '$8,200', created: 'June 15, 2026', ref: 'REF-4812' }
    ],
    bookings: [
      { id: 'BK-9912', name: 'Vantage Q2 Partners Summit', stage: 'Confirmed', value: '$24,800', created: 'May 12, 2026', ref: 'REF-9912' },
      { id: 'BK-1891', name: 'Private Yacht Charter VIP Dinner', stage: 'Confirmed', value: '$15,000', created: 'June 20, 2026', ref: 'REF-1891' }
    ],
    contacts: [
      { name: 'Ryan Uno', role: 'General Manager', email: 'ryanunoyop2@yopmail.com', phone: '123456789103' },
      { name: 'Sarah Miller', role: 'Executive Assistant', email: 's.miller@vantagecg.com', phone: '+1 (212) 555-0145' }
    ]
  },
  {
    id: 'CP-002',
    name: 'Meridian Global Solutions',
    email: 'travel@meridianglobal.net',
    phone: '+44 20 7946 0831',
    category: 'Consulting',
    source: 'Referral',
    owner: 'Alpha',
    taxId: 'TX-724-118',
    contractStart: 'Mar 10, 2025',
    discountLevel: 'Standard Corporate (10% off)',
    domain: 'meridianglobal.net',
    type: 'Enterprise',
    parentCompany: 'None',
    website: 'https://meridianglobal.net',
    address: '10 Lower Thames St',
    city: 'London',
    zipCode: 'EC3R 6EN',
    stateRegion: 'Greater London',
    country: 'United Kingdom',
    cityTag: 'LONDON',
    createdByPms: 'Manual',
    companyIdCode: 'Company-2094',
    travelAgentId: 'TravelAgent-0098',
    outstandingBalance: '$1,500.00',
    iataNumber: 'LHR',
    description: 'Global management consulting firm providing strategy, consulting, digital, technology and operations services.',
    paymentTerms: 'Net 15',
    currency: 'GBP',
    preferredPayment: 'Bank Transfer',
    companySize: '1000+ employees',
    sourceType: 'RFP Campaign',
    lastContacted: 'June 18, 2026',
    leads: [
      { id: 'LD-3321', name: 'Strategic Planning Summit', stage: 'New Inquiry', value: '$9,500', created: 'June 22, 2026', ref: 'REF-3321' }
    ],
    bookings: [
      { id: 'BK-4412', name: 'Leadership Alignment Workshop', stage: 'Completed', value: '$11,400', created: 'April 05, 2026', ref: 'REF-4412' }
    ],
    contacts: [
      { name: 'David Miller', role: 'Global Travel Partner Manager', email: 'travel@meridianglobal.net', phone: '+44 20 7946 0831' }
    ]
  }
];

export function CorporateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const company = mockCorporatesList.find(c => c.id === id) || mockCorporatesList[0];

  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [leadTab, setLeadTab] = useState<'leads' | 'bookings'>('leads');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tab attachments
  const [attachmentsList, setAttachmentsList] = useState<string[]>([
    'Corporate_Rates_2026.pdf',
    'Partnership_Agreement_Vantage.pdf'
  ]);

  // Tab internal notes / comments
  const [internalNotesList, setInternalNotesList] = useState<string[]>([
    'High value corporate partner. Always requests quiet corner suites for VIP delegates.',
    'Prefers billing direct to company card.'
  ]);
  const [newNote, setNewNote] = useState('');

  // Tab things to do
  const [tasks, setTasks] = useState<{ text: string; done: boolean }[]>([
    { text: 'Send updated corporate rate contract for 2027', done: false },
    { text: 'Call ryanuno to check on Q3 travel forecast', done: true }
  ]);
  const [newTask, setNewTask] = useState('');

  // Tab contracts
  const [contracts] = useState<{ title: string; status: string; date: string }[]>([
    { title: 'Preferred Hotel Partner Agreement 2026', status: 'Active', date: 'Jan 15, 2026' }
  ]);

  // Tab emails
  const [emails] = useState<{ subject: string; date: string; from: string }[]>([
    { subject: 'RFP Inquiry: Vantage Corporate Event Q4', date: 'June 18, 2026 14:02', from: 'ryanunoyop2@yopmail.com' }
  ]);

  // Tab calls
  const [calls] = useState<{ description: string; date: string; agent: string }[]>([
    { description: 'Outbound follow up call on Q3 rates', date: 'June 14, 2026 09:30', agent: 'Sarah Jenkins' }
  ]);

  // Details State Fields
  const [name] = useState(company.name);
  const [email, setEmail] = useState(company.email);
  const [phone, setPhone] = useState(company.phone);
  const [domain, setDomain] = useState(company.domain);
  const [type, setType] = useState(company.type);
  const [parentCompany, setParentCompany] = useState(company.parentCompany);
  const [category, setCategory] = useState(company.category);
  const [website, setWebsite] = useState(company.website);
  const [address, setAddress] = useState(company.address);
  const [city, setCity] = useState(company.city);
  const [zipCode, setZipCode] = useState(company.zipCode);
  const [stateRegion, setStateRegion] = useState(company.stateRegion);
  const [country, setCountry] = useState(company.country);
  const [cityTag, setCityTag] = useState(company.cityTag);
  const [createdByPms, setCreatedByPms] = useState(company.createdByPms);
  const [companyIdCode, setCompanyIdCode] = useState(company.companyIdCode);
  const [travelAgentId, setTravelAgentId] = useState(company.travelAgentId);
  const [outstandingBalance, setOutstandingBalance] = useState(company.outstandingBalance);
  const [iataNumber, setIATANumber] = useState(company.iataNumber);

  const [description, setDescription] = useState(company.description);
  const [paymentTerms, setPaymentTerms] = useState(company.paymentTerms);
  const [currency, setCurrency] = useState(company.currency);
  const [preferredPayment, setPreferredPayment] = useState(company.preferredPayment);

  const [companySize, setCompanySize] = useState(company.companySize);
  const [sourceType, setSourceType] = useState(company.sourceType);
  const [lastContacted, setLastContacted] = useState<Date | null>(new Date(company.lastContacted));

  // Contacts tab states
  const [contactsList, setContactsList] = useState<Contact[]>(company.contacts);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [showAddContactForm, setShowAddContactForm] = useState(false);

  const itemsList = leadTab === 'leads' ? company.leads : company.bookings;
  const filteredItems = itemsList.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = company.bookings.reduce((acc, curr) => {
    const val = parseInt(curr.value.replace(/[^0-9]/g, ''), 10);
    return acc + val;
  }, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Changes Saved', `${name} details have been updated.`, 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setAttachmentsList(prev => [...prev, fileName]);
      toast.success('File Uploaded', `${fileName} has been added.`, 2000);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setInternalNotesList(prev => [newNote, ...prev]);
    setNewNote('');
    toast.success('Note Added', 'Internal note saved.', 2000);
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { text: newTask, done: false }]);
    setNewTask('');
    toast.success('Task Added', 'New task added to list.', 2000);
  };

  const handleAddContact = () => {
    if (!newContactName.trim()) return;
    setContactsList(prev => [...prev, { name: newContactName, role: newContactRole || 'Executive', email: 'corporate@vantagecg.com', phone: '' }]);
    setNewContactName('');
    setNewContactRole('');
    setShowAddContactForm(false);
    toast.success('Contact Added', 'New corporate contact saved.', 2000);
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Back navigation */}
      <div className="flex flex-col mb-4">
        <button
          onClick={() => navigate('/dashboard/partners/corporate')}
          className="flex items-center text-[#7d6b5e] hover:text-[#4a3c31] transition-colors w-fit mb-2 text-sm gap-2 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Corporate Partners
        </button>
      </div>

      <div className="flex flex-col gap-6 text-xs">
        {/* TOP CARD: Company Profile Header */}
        <div className="relative z-20 border border-[#d4c4b7] rounded-[12px] p-5 bg-[#f3eae1]/30 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#947b66]/20 backdrop-blur-sm border-2 border-[#947b66] flex items-center justify-center text-[#4a3c31] text-xl font-serif font-bold shadow-inner">
              {name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-serif text-[#4a3c31] font-bold">{name}</h2>
              <div className="flex items-center gap-2 text-[#7d6b5e] text-[11px]">
                <span className="font-semibold text-[#947b66]">{category}</span>
                <span>•</span>
                <span className="font-mono text-[10px] bg-[#e5d8cb]/50 px-1.5 py-0.5 rounded text-[#4a3c31]">{company.id}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#7d6b5e] text-[10px] mt-1">
                {email && <span className="flex items-center gap-1"><Letter size={12} /> {email}</span>}
                {phone && <span className="flex items-center gap-1"><PhoneIcon size={12} /> {phone}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={() => toast.success('New Booking', 'Booking drawer or selection initialized.', 2000)}
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
                <button onClick={() => toast.info('RFP Request', 'RFP form generated.', 2000)} className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] transition-colors">Request RFP</button>
                <button onClick={() => toast.info('Edit Account', 'Editing enabled.', 2000)} className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] transition-colors">Edit Company</button>
                <button onClick={() => toast.warning('Status Update', 'Corporate partner deactivated.', 2000)} className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 transition-colors">Deactivate</button>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Leads & Bookings Card */}
        <div className="border border-[#d4c4b7] rounded-[12px] overflow-hidden bg-[#f3eae1]/30 backdrop-blur-sm shadow-xs">
          <div className="bg-[#947b66]/10 px-5 py-4 border-b border-[#d4c4b7] flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold font-serif text-[#4a3c31]">Corporate Leads & Bookings</h3>
              <p className="text-[10px] text-[#7d6b5e]">Manage and track all corporate reservations pipeline.</p>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-5">
            <div className="flex border-b border-[#d4c4b7]/60 pb-px gap-6">
              <button
                onClick={() => setLeadTab('leads')}
                className={`pb-2 font-bold uppercase tracking-wider text-[10px] transition-colors relative cursor-pointer ${leadTab === 'leads' ? 'text-[#947b66]' : 'text-[#7d6b5e] hover:text-[#4a3c31]'
                  }`}
              >
                Leads ({company.leads.length})
                {leadTab === 'leads' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#947b66] rounded-full" />
                )}
              </button>
              <button
                onClick={() => setLeadTab('bookings')}
                className={`pb-2 font-bold uppercase tracking-wider text-[10px] transition-colors relative cursor-pointer ${leadTab === 'bookings' ? 'text-[#947b66]' : 'text-[#7d6b5e] hover:text-[#4a3c31]'
                  }`}
              >
                Bookings ({company.bookings.length})
                {leadTab === 'bookings' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#947b66] rounded-full" />
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-[240px]">
                <Magnifer size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#947b66]" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 text-xs bg-white/50 border border-[#d4c4b7] rounded-lg text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] transition-all"
                />
              </div>
            </div>

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
                  <div className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider">Total Corporate Revenue</div>
                  <div className="text-xl font-serif font-bold text-[#4a3c31] mt-0.5">
                    ${totalRevenue.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#d4c4b7]/80 rounded-lg overflow-hidden bg-[#f3eae1]/30 backdrop-blur-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f3eae1]/80 border-b border-[#d4c4b7] text-[9px] font-bold uppercase tracking-widest text-[#7d6b5e]">
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Status/Stage</th>
                    <th className="px-4 py-2.5">Revenue</th>
                    <th className="px-4 py-2.5">Reference #</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, idx) => (
                      <tr
                        key={idx}
                        className="text-[#4a3c31] text-[11px] hover:bg-[#e5d8cb]/30 border-b border-[#d4c4b7]/30 transition-colors cursor-pointer"
                        onClick={() => navigate(leadTab === 'leads' ? `/dashboard/reservations/leads/${item.id}` : `/dashboard/reservations/bookings/${item.id}`)}
                      >
                        <td className="px-4 py-3 font-medium">{item.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${item.stage === 'Confirmed' || item.stage === 'Proposal Sent' ? 'bg-[#657454]/15 text-[#4e5a45] border-[#657454]/20'
                            : item.stage === 'Cancelled' ? 'bg-[#a65e52]/15 text-[#61271f] border-[#a65e52]/20'
                              : 'bg-[#C8A050]/15 text-[#7a5e2a] border-[#C8A050]/20'
                            }`}>{item.stage}</span>
                        </td>
                        <td className="px-4 py-3 font-medium">{item.value}</td>
                        <td className="px-4 py-3 font-mono text-[#947b66] font-semibold">{item.ref}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[#7d6b5e] italic">No associated records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Relations Tab Control */}
        <div className="flex flex-col gap-4">
          {/* Tabs bar */}
          <div className="flex overflow-x-auto border-b border-[#d4c4b7] px-4 pt-2 gap-6 custom-scrollbar">
            {[
              { 
                id: 'details', 
                label: 'Details', 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                )
              },
              { 
                id: 'contacts', 
                label: 'Contacts', 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                )
              },
              { 
                id: 'all', 
                label: 'All', 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="21" y1="10" x2="3" y2="10"/>
                    <line x1="21" y1="6" x2="3" y2="6"/>
                    <line x1="21" y1="14" x2="3" y2="14"/>
                    <line x1="21" y1="18" x2="3" y2="18"/>
                  </svg>
                )
              },
              { 
                id: 'things_to_do', 
                label: 'Things To Do', 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="9" x2="15" y2="9"/>
                    <line x1="9" y1="13" x2="15" y2="13"/>
                    <line x1="9" y1="17" x2="15" y2="17"/>
                  </svg>
                )
              },
              { 
                id: 'contracts', 
                label: 'Contracts', 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="m9 15 2 2 4-4"/>
                  </svg>
                )
              },
              { 
                id: 'emails', 
                label: 'Emails', 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                )
              },
              { 
                id: 'hierarchy', 
                label: 'Hierarchy', 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9"/>
                    <rect x="14" y="3" width="7" height="5"/>
                    <rect x="14" y="12" width="7" height="9"/>
                    <path d="M10 8h4"/>
                    <path d="M10 15h4"/>
                    <path d="M7 12v3"/>
                  </svg>
                )
              },
              { 
                id: 'attachments', 
                label: 'Attachments', 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                )
              },
              { 
                id: 'calls', 
                label: 'Calls', 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                )
              },
              { 
                id: 'notes', 
                label: 'Notes', 
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                )
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-1.5 pb-3 px-1 text-[11px] font-semibold transition-all duration-150 cursor-pointer border-b-2 whitespace-nowrap ${activeTab === tab.id
                  ? 'border-[#947b66] text-[#4a3c31]'
                  : 'border-transparent text-[#7d6b5e] hover:text-[#4a3c31]'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents Panel */}
          <div className="border border-[#d4c4b7] rounded-[12px] bg-[#f3eae1]/30 backdrop-blur-sm p-6 relative shadow-xs min-h-[220px]">
            {activeTab === 'details' && (
              <form onSubmit={handleSave} className="flex flex-col gap-6">
                {/* Header Controls */}
                <div className="flex justify-between items-center border-b border-[#d4c4b7]/50 pb-4">
                  <h3 className="text-sm font-bold font-serif text-[#4a3c31]">Details</h3>
                  <div className="flex items-center gap-3 text-[#947b66]">
                    <button type="button" className="hover:text-[#4a3c31] cursor-pointer">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
                    </button>
                    <button type="button" className="hover:text-[#4a3c31] cursor-pointer">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* COLUMN 1: Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#4a3c31] uppercase tracking-wider">Basic Information</h4>
                    
                    <div className="flex items-center gap-3 py-1">
                      <button
                        type="button"
                        onClick={() => toast.success('Upload picture initialized.', '', 2000)}
                        className="px-3 py-1 border border-[#d4c4b7] rounded-full text-[10px] font-bold text-[#4a3c31] bg-white/20 transition-all hover:bg-[#efe7d5]/50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-[11px]">✦</span> Upload Picture
                      </button>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">E-Mail Address</label>
                      <div className="relative flex items-center">
                        <Letter size={14} className="absolute left-3 text-[#947b66] pointer-events-none" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-9 pl-9 pr-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">Phone</label>
                      <div className="flex items-center gap-1.5 w-full">
                        <div className="relative flex-1 flex items-center">
                          <PhoneIcon size={14} className="absolute left-3 text-[#947b66] pointer-events-none" />
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-9 pl-9 pr-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                          />
                        </div>
                        <select className="h-9 px-2 bg-white/20 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-none cursor-pointer">
                          <option value="Mobile">Mobile</option>
                          <option value="Work">Work</option>
                          <option value="Landline">Landline</option>
                        </select>
                        <button type="button" className="text-[#7d6b5e] hover:text-[#4a3c31] font-bold px-1 select-none cursor-pointer">✕</button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[#947b66] text-[10px] font-semibold cursor-pointer hover:underline">+ Add Another</span>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">Company Domain Name</label>
                      <div className="relative flex items-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 text-[#947b66] pointer-events-none">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        <input
                          type="text"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          className="w-full h-9 pl-9 pr-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold flex items-center">
                        Company Type
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-sans text-[#7d6b5e] border border-[#d4c4b7] rounded-full cursor-help hover:bg-[#efe7d5]/55 hover:text-[#4a3c31] ml-1 select-none" title="Type of business entity">?</span>
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-none focus:ring-1 focus:ring-[#947b66] cursor-pointer"
                      >
                        <option value="Enterprise">Enterprise</option>
                        <option value="Agency">Agency</option>
                        <option value="Corporate">Corporate</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">Parent Company</label>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-[#efe7d5]/40 border border-[#d4c4b7] rounded-lg text-xs w-fit">
                        <span className="text-[#4a3c31] font-medium">{parentCompany}</span>
                        <button type="button" onClick={() => setParentCompany('None')} className="text-[#7d6b5e] hover:text-red-500 font-bold ml-1 cursor-pointer">✕</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">Categories</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-none focus:ring-1 focus:ring-[#947b66] cursor-pointer"
                      >
                        <option value="Financial Services">Financial Services</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold flex items-center">
                        Website URL
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-sans text-[#7d6b5e] border border-[#d4c4b7] rounded-full cursor-help hover:bg-[#efe7d5]/55 hover:text-[#4a3c31] ml-1 select-none" title="Company website URL">?</span>
                      </label>
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold flex items-center">
                        Street Address
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-sans text-[#7d6b5e] border border-[#d4c4b7] rounded-full cursor-help hover:bg-[#efe7d5]/55 hover:text-[#4a3c31] ml-1 select-none" title="Physical address street name and number">?</span>
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">Zip Code</label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">State/Region</label>
                      <input
                        type="text"
                        value={stateRegion}
                        onChange={(e) => setStateRegion(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-none focus:ring-1 focus:ring-[#947b66] cursor-pointer"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Singapore">Singapore</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">City</label>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-[#efe7d5]/40 border border-[#d4c4b7] rounded-lg text-xs w-fit">
                        <span className="text-[#4a3c31] font-semibold">{cityTag}</span>
                        <button type="button" onClick={() => setCityTag('None')} className="text-[#7d6b5e] hover:text-red-500 font-bold ml-1 cursor-pointer">✕</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">Create By (PMS)</label>
                      <input
                        type="text"
                        value={createdByPms}
                        onChange={(e) => setCreatedByPms(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">Company ID</label>
                      <input
                        type="text"
                        value={companyIdCode}
                        onChange={(e) => setCompanyIdCode(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">Travel Agent ID</label>
                      <input
                        type="text"
                        value={travelAgentId}
                        onChange={(e) => setTravelAgentId(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">Outstanding Balance</label>
                      <input
                        type="text"
                        value={outstandingBalance}
                        onChange={(e) => setOutstandingBalance(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                    </div>

                    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                      <label className="text-[#7d6b5e] text-xs font-semibold">IATA Number</label>
                      <input
                        type="text"
                        value={iataNumber}
                        onChange={(e) => setIATANumber(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                    </div>
                  </div>

                  {/* COLUMN 2: Professional Information */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#4a3c31] uppercase tracking-wider">Professional Information</h4>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#7d6b5e] font-semibold flex items-center">
                        Company Description
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-sans text-[#7d6b5e] border border-[#d4c4b7] rounded-full cursor-help hover:bg-[#efe7d5]/55 hover:text-[#4a3c31] ml-1 select-none" title="Brief description of partner business">?</span>
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full p-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#7d6b5e] font-semibold flex items-center">
                        Payment Terms
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-sans text-[#7d6b5e] border border-[#d4c4b7] rounded-full cursor-help hover:bg-[#efe7d5]/55 hover:text-[#4a3c31] ml-1 select-none" title="Agreed invoice payment terms">?</span>
                      </label>
                      <input
                        type="text"
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#7d6b5e] font-semibold flex items-center">
                        Currency
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-sans text-[#7d6b5e] border border-[#d4c4b7] rounded-full cursor-help hover:bg-[#efe7d5]/55 hover:text-[#4a3c31] ml-1 select-none" title="Billing currency">?</span>
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-none focus:ring-1 focus:ring-[#947b66] cursor-pointer"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="IDR">IDR</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#7d6b5e] font-semibold flex items-center">
                        Preferred Payment Method
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-sans text-[#7d6b5e] border border-[#d4c4b7] rounded-full cursor-help hover:bg-[#efe7d5]/55 hover:text-[#4a3c31] ml-1 select-none" title="Primary method for settling invoices">?</span>
                      </label>
                      <select
                        value={preferredPayment}
                        onChange={(e) => setPreferredPayment(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-none focus:ring-1 focus:ring-[#947b66] cursor-pointer"
                      >
                        <option value="Corporate Credit Card">Corporate Credit Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Direct Billing">Direct Billing</option>
                      </select>
                    </div>
                  </div>

                  {/* COLUMN 3: Other */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#4a3c31] uppercase tracking-wider">Other</h4>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#7d6b5e] font-semibold flex items-center">
                        Company Size
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-sans text-[#7d6b5e] border border-[#d4c4b7] rounded-full cursor-help hover:bg-[#efe7d5]/55 hover:text-[#4a3c31] ml-1 select-none" title="Total number of company employees">?</span>
                      </label>
                      <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-none focus:ring-1 focus:ring-[#947b66] cursor-pointer"
                      >
                        <option value="1-50 employees">1-50 employees</option>
                        <option value="50-200 employees">50-200 employees</option>
                        <option value="200-500 employees">200-500 employees</option>
                        <option value="500-1000 employees">500-1000 employees</option>
                        <option value="1000+ employees">1000+ employees</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#7d6b5e] font-semibold flex items-center">
                        Internal Notes / Comments
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-sans text-[#7d6b5e] border border-[#d4c4b7] rounded-full cursor-help hover:bg-[#efe7d5]/55 hover:text-[#4a3c31] ml-1 select-none" title="Staff annotations and guidelines">?</span>
                      </label>
                      <textarea
                        value={internalNotesList[0] || ''}
                        onChange={(e) => {
                          const updated = [...internalNotesList];
                          updated[0] = e.target.value;
                          setInternalNotesList(updated);
                        }}
                        rows={5}
                        className="w-full p-3 bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#7d6b5e] font-semibold">Source</label>
                      <select
                        value={sourceType}
                        onChange={(e) => setSourceType(e.target.value)}
                        className="w-full h-9 px-3 bg-white/20 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-none focus:ring-1 focus:ring-[#947b66] cursor-pointer"
                      >
                        <option value="Inbound Referral">Inbound Referral</option>
                        <option value="RFP Campaign">RFP Campaign</option>
                        <option value="Direct Outreach">Direct Outreach</option>
                        <option value="Trade Show">Trade Show</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#7d6b5e] font-semibold flex items-center">
                        Last Contacted Date
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-sans text-[#7d6b5e] border border-[#d4c4b7] rounded-full cursor-help hover:bg-[#efe7d5]/55 hover:text-[#4a3c31] ml-1 select-none" title="Date of most recent partner interaction">?</span>
                      </label>
                      <div className="relative flex items-center">
                        <DatePicker
                          selected={lastContacted}
                          onChange={(date: Date | null) => setLastContacted(date)}
                          dateFormat="MMM d, yyyy"
                          className="w-full h-9 pl-3 pr-8 text-xs bg-white/20 backdrop-blur-xs border border-[#d4c4b7] rounded-lg text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] cursor-pointer"
                        />
                        <Calendar size={14} className="absolute right-3 text-[#947b66] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[#d4c4b7]/50">
                  <button
                    type="submit"
                    className="bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] px-6 py-2 rounded-lg text-xs font-semibold transition-all active:scale-97 cursor-pointer"
                  >
                    Save Details
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'contacts' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#d4c4b7]/50 pb-3">
                  <h4 className="text-xs font-bold text-[#4a3c31]">Contacts ({contactsList.length})</h4>
                </div>
                
                <div className="divide-y divide-[#d4c4b7]/30">
                  {contactsList.map((contact, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-4">
                      <div className="w-10 h-10 rounded-full bg-[#947b66]/20 border border-[#947b66] flex items-center justify-center text-[#4a3c31] font-semibold text-xs shadow-inner">
                        {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-[#4a3c31]">{contact.name}</h4>
                        <p className="text-[#7d6b5e] text-xs mt-0.5">{contact.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {showAddContactForm ? (
                  <div className="p-4 border border-[#d4c4b7] rounded-xl bg-[#f3eae1]/10 space-y-3 max-w-md">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold uppercase text-[#7d6b5e]">Name</label>
                      <input
                        type="text"
                        value={newContactName}
                        onChange={(e) => setNewContactName(e.target.value)}
                        className="h-8 px-3 bg-white/20 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold uppercase text-[#7d6b5e]">Role</label>
                      <input
                        type="text"
                        value={newContactRole}
                        onChange={(e) => setNewContactRole(e.target.value)}
                        className="h-8 px-3 bg-white/20 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66]"
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button onClick={() => setShowAddContactForm(false)} className="px-3 py-1 text-xs text-[#7d6b5e] hover:text-[#4a3c31]">Cancel</button>
                      <button onClick={handleAddContact} className="bg-[#947b66] text-[#efe7d5] px-3 py-1 rounded-lg text-xs font-semibold">Save Contact</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddContactForm(true)}
                    className="w-full py-2.5 border border-dashed border-[#d4c4b7] rounded-lg text-[#947b66] hover:text-[#4a3c31] font-semibold text-xs text-center hover:bg-[#e5d8cb]/30 transition-all cursor-pointer"
                  >
                    Add Contact
                  </button>
                )}
              </div>
            )}

            {activeTab === 'all' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs border-b border-[#d4c4b7]/50 pb-3">
                  <span className="text-[#7d6b5e]">Filter by</span>
                  <select className="bg-transparent border-none py-0 pl-1 pr-6 font-semibold text-[#4a3c31] outline-hidden cursor-pointer focus:ring-0">
                    <option value="All">All</option>
                    <option value="System">System</option>
                    <option value="User">User</option>
                  </select>
                </div>

                <div className="relative pl-6 border-l border-[#d4c4b7]/60 space-y-6 ml-3">
                  <div className="relative group">
                    <span className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-[#fdfaf7] border border-[#d4c4b7] flex items-center justify-center text-[#947b66] shadow-2xs">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </span>
                    <div className="flex justify-between items-center text-xs text-[#4a3c31]">
                      <div>
                        The record has been updated by <span className="font-semibold text-[#4a3c31]">Alpha</span>
                        <span className="text-[10px] text-[#7d6b5e] ml-2">- March 20, 2026 14:10</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#947b66] hover:text-[#4a3c31] cursor-pointer">Pin on top</span>
                    </div>
                    <div className="text-[10px] text-[#947b66] mt-1 cursor-pointer hover:underline">View Updated Fields (2)</div>
                  </div>

                  <div className="relative group">
                    <span className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-[#fdfaf7] border border-[#d4c4b7] flex items-center justify-center text-[#947b66] shadow-2xs">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </span>
                    <div className="flex justify-between items-center text-xs text-[#4a3c31]">
                      <div>
                        The record has been created by <span className="font-semibold text-[#4a3c31]">Alpha</span>
                        <span className="text-[10px] text-[#7d6b5e] ml-2">- March 20, 2026 01:34</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#947b66] hover:text-[#4a3c31] cursor-pointer">Pin on top</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'things_to_do' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 h-9 px-3 bg-white/20 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] focus:ring-1 focus:ring-[#947b66]"
                  />
                  <button onClick={handleAddTask} className="bg-[#947b66] text-[#efe7d5] px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all">Add Task</button>
                </div>
                <div className="space-y-2">
                  {tasks.map((task, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-[#f3eae1]/20 border border-[#d4c4b7]/50 rounded-lg text-xs">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => {
                          const updated = [...tasks];
                          updated[idx].done = !updated[idx].done;
                          setTasks(updated);
                        }}
                        className="w-4 h-4 accent-[#947b66] cursor-pointer"
                      />
                      <span className={`text-[#4a3c31] ${task.done ? 'line-through opacity-50' : ''}`}>{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contracts' && (
              <div className="space-y-3">
                {contracts.map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 border border-[#d4c4b7]/50 rounded-xl bg-[#f3eae1]/20">
                    <div>
                      <h4 className="text-sm font-bold text-[#4a3c31]">{c.title}</h4>
                      <p className="text-[10px] text-[#7d6b5e] mt-1">Signed on {c.date}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#657454]/15 text-[#4e5a45] border border-[#657454]/20">{c.status}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'emails' && (
              <div className="space-y-3">
                {emails.map((e, idx) => (
                  <div key={idx} className="p-4 border border-[#d4c4b7]/50 rounded-xl bg-[#f3eae1]/20">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-[#4a3c31]">{e.subject}</h4>
                      <span className="text-[9px] text-[#7d6b5e]">{e.date}</span>
                    </div>
                    <p className="text-[#947b66] text-[10px]">From: {e.from}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'hierarchy' && (
              <div className="p-4 border border-[#d4c4b7]/50 rounded-xl bg-[#f3eae1]/20 text-xs text-[#4a3c31]">
                <h4 className="text-sm font-bold text-[#4a3c31] border-b border-[#d4c4b7]/40 pb-2 mb-3">Corporate Hierarchy</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-[#947b66]">HQ:</span> Vantage Capital Group (Parent)
                </div>
                <div className="pl-6 border-l border-[#d4c4b7] space-y-2">
                  <div>• Vantage Capital NY Office</div>
                  <div>• Vantage Capital Singapore Branch</div>
                </div>
              </div>
            )}

            {activeTab === 'attachments' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {attachmentsList.map((file, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-[#f3eae1]/20 border border-[#d4c4b7]/50 rounded-lg text-xs">
                      <span className="font-medium text-[#4a3c31] truncate max-w-[280px]">{file}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAttachmentsList(prev => prev.filter((_, i) => i !== idx));
                          toast.warning('Attachment Deleted', `${file} has been removed.`, 2000);
                        }}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <label className="bg-[#efe7d5]/80 hover:bg-[#e5d8cb] border border-[#d4c4b7] text-[#4a3c31] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer w-fit">
                  <Upload size={14} className="text-[#947b66]" />
                  Upload Document
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            )}

            {activeTab === 'calls' && (
              <div className="space-y-3">
                {calls.map((c, idx) => (
                  <div key={idx} className="p-4 border border-[#d4c4b7]/50 rounded-xl bg-[#f3eae1]/20 text-xs text-[#4a3c31]">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold text-[#4a3c31]">{c.description}</h4>
                      <span className="text-[9px] text-[#7d6b5e]">{c.date}</span>
                    </div>
                    <p className="text-[10px] text-[#7d6b5e]">Agent: {c.agent}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type an internal corporate note..."
                    className="flex-1 h-9 px-3 bg-white/20 border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                  />
                  <button
                    onClick={handleAddNote}
                    className="bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                  >
                    Add Note
                  </button>
                </div>
                <div className="space-y-2">
                  {internalNotesList.map((note, idx) => (
                    <div key={idx} className="p-3 bg-[#f3eae1]/20 border border-[#d4c4b7]/50 rounded-lg text-xs text-[#4a3c31]">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
