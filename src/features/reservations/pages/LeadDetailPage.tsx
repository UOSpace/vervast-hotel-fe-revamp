import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  User,
  AltArrowDown,
  Upload,
  DoubleAltArrowRight,
  Widget,
  UsersGroupTwoRounded,
  Buildings,
  Compass,
  Notes,
  Star,
  Letter,
  Phone
} from '@solar-icons/react';
import { useToast } from '../../../components/ui/toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type TabType = 'All' | 'Contacts' | 'Companies' | 'Itineraries' | 'Sales Activities' | 'Marcom Activities' | 'Emails' | 'Calls';

// Mock Lead Data
const initialLeads = {
  'LD-001': {
    id: 'LD-001',
    leadName: 'Grand Hyatt Corporate Retreat',
    leadStatus: 'Proposal Sent',
    totalValue: '45000.00',
    currency: 'USD',
    expectedClose: new Date('2026-07-15'),
    owner: 'Sarah Jenkins',
    createdAt: '2026-06-10 14:32',
    source: 'Corporate',
    sourceDetails: 'TechCorp Annual Request',
    crsNo: 'CRS-90812',
    leadScore: '85.00',
    confidenceLevel: 'High',
    qualified: 'Yes',
    conversionProbability: '80%',
    lostReason: 'N/A',
    stage: 'Completed' // Active stage in the progress tracker
  },
  'LD-002': {
    id: 'LD-002',
    leadName: 'Smith Family Reunion Block',
    leadStatus: 'Negotiation',
    totalValue: '12500.00',
    currency: 'USD',
    expectedClose: new Date('2026-08-01'),
    owner: 'David Miller',
    createdAt: '2026-06-12 09:15',
    source: 'Direct',
    sourceDetails: 'Website Query Form',
    crsNo: 'CRS-90815',
    leadScore: '72.00',
    confidenceLevel: 'Medium',
    qualified: 'Yes',
    conversionProbability: '60%',
    lostReason: 'N/A',
    stage: 'Ongoing'
  },
  'LD-003': {
    id: 'LD-003',
    leadName: 'Luxury Travel VIP Group',
    leadStatus: 'Closed Won',
    totalValue: '68000.00',
    currency: 'USD',
    expectedClose: new Date('2026-06-20'),
    owner: 'Sarah Jenkins',
    createdAt: '2026-06-01 11:00',
    source: 'Travel Agent',
    sourceDetails: 'Virtuoso Consortium',
    crsNo: 'CRS-89211',
    leadScore: '95.00',
    confidenceLevel: 'High',
    qualified: 'Yes',
    conversionProbability: '100%',
    lostReason: 'N/A',
    stage: 'Completed'
  },
  'LD-004': {
    id: 'LD-004',
    leadName: 'Asia Wedding Expo Lead',
    leadStatus: 'Closed Lost',
    totalValue: '32000.00',
    currency: 'USD',
    expectedClose: new Date('2026-06-15'),
    owner: 'Emma Watson',
    createdAt: '2026-05-24 16:45',
    source: 'OTA',
    sourceDetails: 'Expedia Event Referral',
    crsNo: 'CRS-77312',
    leadScore: '40.00',
    confidenceLevel: 'Low',
    qualified: 'No',
    conversionProbability: '0%',
    lostReason: 'Budget constraints',
    stage: 'Canceled'
  },
  'LD-005': {
    id: 'LD-005',
    leadName: 'Executive Team Board Meeting',
    leadStatus: 'New',
    totalValue: '18000.00',
    currency: 'USD',
    expectedClose: new Date('2026-07-28'),
    owner: 'David Miller',
    createdAt: '2026-06-22 10:20',
    source: 'Corporate',
    sourceDetails: 'Global Finance Inc.',
    crsNo: 'CRS-91100',
    leadScore: '65.00',
    confidenceLevel: 'Medium',
    qualified: 'Yes',
    conversionProbability: '50%',
    lostReason: 'N/A',
    stage: 'Draft'
  },
  'LD-006': {
    id: 'LD-006',
    leadName: 'Weekend Wellness Retreat Group',
    leadStatus: 'Contacted',
    totalValue: '21500.00',
    currency: 'USD',
    expectedClose: new Date('2026-08-10'),
    owner: 'Emma Watson',
    createdAt: '2026-06-18 13:50',
    source: 'Direct',
    sourceDetails: 'Instagram Campaign',
    crsNo: 'N/A',
    leadScore: '58.00',
    confidenceLevel: 'Medium',
    qualified: 'Yes',
    conversionProbability: '40%',
    lostReason: 'N/A',
    stage: 'Ongoing'
  }
};

// Activities Mock Data
const initialActivities = [
  {
    id: 'act-1',
    user: 'vervast',
    action: 'associated',
    target: 'Travelodia',
    timestamp: 'May 27, 2026 10:16',
    type: 'Contacts',
    iconType: 'plus'
  },
  {
    id: 'act-2',
    user: 'vervast',
    action: 'updated',
    details: 'The record has been updated by vervast',
    timestamp: 'December 22, 2025 14:53',
    type: 'Sales Activities',
    iconType: 'edit',
    updatedFields: ['Expected Close Date', 'Total Lead Value']
  },
  {
    id: 'act-3',
    user: 'vervast',
    action: 'updated',
    details: 'The record has been updated by vervast',
    timestamp: 'December 17, 2025 22:55',
    type: 'Sales Activities',
    iconType: 'edit',
    updatedFields: ['Owner']
  },
  {
    id: 'act-4',
    user: 'vervast',
    action: 'moved',
    details: 'moved lead from Follow Up to Lead Qualification stage',
    timestamp: 'December 17, 2025 22:55',
    type: 'Sales Activities',
    iconType: 'stage'
  },
  {
    id: 'act-5',
    user: 'vervast',
    action: 'moved',
    details: 'moved lead from Booking Request to Follow Up stage',
    timestamp: 'December 17, 2025 22:55',
    type: 'Sales Activities',
    iconType: 'stage'
  },
  {
    id: 'act-6',
    user: 'vervast',
    action: 'moved',
    details: 'moved lead from Proposal Sent to Booking Request stage',
    timestamp: 'December 17, 2025 22:55',
    type: 'Sales Activities',
    iconType: 'stage'
  },
  {
    id: 'act-7',
    user: 'vervast',
    action: 'associated',
    target: 'Travel Genius',
    timestamp: 'December 17, 2025 14:50',
    type: 'Contacts',
    iconType: 'plus'
  },
  {
    id: 'act-8',
    user: 'vervast',
    action: 'associated',
    target: 'Grafik Yusva',
    timestamp: 'December 17, 2025 14:49',
    type: 'Companies',
    iconType: 'plus'
  },
  {
    id: 'act-9',
    user: 'vervast',
    action: 'created',
    details: 'The record has been created by vervast',
    timestamp: 'October 14, 2025 22:31',
    type: 'All',
    iconType: 'create'
  }
];

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const leadKey = (id && id in initialLeads) ? (id as keyof typeof initialLeads) : 'LD-001';
  const leadData = initialLeads[leadKey];

  // Form State
  const leadName = leadData.leadName;
  const [totalValue, setTotalValue] = useState(leadData.totalValue);
  const [currency, setCurrency] = useState(leadData.currency);
  const [expectedClose, setExpectedClose] = useState<Date | null>(leadData.expectedClose);
  const [owner, setOwner] = useState(leadData.owner);
  const [source, setSource] = useState(leadData.source);
  const [sourceDetails, setSourceDetails] = useState(leadData.sourceDetails);
  const [crsNo, setCrsNo] = useState(leadData.crsNo);
  const [leadScore, setLeadScore] = useState(leadData.leadScore);
  const [confidenceLevel, setConfidenceLevel] = useState(leadData.confidenceLevel);
  const mapStatusToStage = (status: string) => {
    switch (status) {
      case 'New':
      case 'Contacted':
        return 'Draft';
      case 'Proposal Sent':
      case 'Negotiation':
        return 'Ongoing';
      case 'Closed Won':
        return 'Completed';
      case 'Closed Lost':
        return 'Canceled';
      default:
        return 'Draft';
    }
  };

  const [activeStage, setActiveStage] = useState(mapStatusToStage(leadData.leadStatus));

  React.useEffect(() => {
    setActiveStage(mapStatusToStage(leadData.leadStatus));
  }, [id, leadData.leadStatus]);

  const [activeTimelineTab, setActiveTimelineTab] = useState<TabType>('All');
  
  // Expanded timelines for field changes view
  const [expandedTimelineId, setExpandedTimelineId] = useState<string | null>(null);

  // Attachment state
  const [attachments, setAttachments] = useState<string[]>([]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Lead Saved', 'Lead details updated successfully.', 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      setAttachments(prev => [...prev, fileName]);
      toast.success('File Uploaded', `${fileName} uploaded successfully.`, 3000);
    }
  };

  const handleAction = (action: string) => {
    toast.info('Action Executed', `${action} flow triggered for lead ${leadName}.`, 3000);
  };

  // Filtered timeline entries
  const filteredActivities = initialActivities.filter(act => {
    if (activeTimelineTab === 'All') return true;
    return act.type === activeTimelineTab;
  });

  const stages = ['Draft', 'Ongoing', 'Completed', 'Canceled'];

  const getStageStyle = (stage: string) => {
    const activeIndex = stages.indexOf(activeStage);
    const stageIndex = stages.indexOf(stage);
    const isCanceledActive = activeStage === 'Canceled';

    if (stage === 'Canceled') {
      return isCanceledActive
        ? 'bg-[#5f2e27] text-white border-[#4d1f19] shadow-sm'
        : 'bg-[#efe7d5]/45 text-[#7d6b5e]/60 border-[#d4c4b7]/50';
    }

    if (isCanceledActive) {
      return stageIndex < 3 
        ? 'bg-[#2b3c4d]/85 text-[#efe7d5]/90 border-[#202e3b]/80 shadow-xs' 
        : 'bg-[#efe7d5]/40 text-[#7d6b5e] border-[#d4c4b7]/30';
    }

    if (stageIndex <= activeIndex) {
      return 'bg-[#2f4256] text-white border-[#243546] shadow-xs';
    }

    return 'bg-[#efe7d5]/40 text-[#6a5848] border-[#d4c4b7]/70';
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Back navigation */}
      <div className="flex flex-col mb-4 animate-card-enter">
        <button
          onClick={() => navigate('/dashboard/reservations/leads')}
          className="flex items-center text-[#7d6b5e] hover:text-[#4a3c31] transition-colors w-fit mb-2 text-sm gap-2 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Reservations Leads
        </button>
      </div>

      <div className="flex flex-col gap-6 text-xs animate-card-enter" style={{ animationDelay: '0.1s' }}>
        
        {/* Profile / Details Summary Header */}
        <div className="relative z-20 border border-[#d4c4b7] rounded-[12px] p-5 glass-panel flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#947b66]/20 border-2 border-[#947b66] flex items-center justify-center text-[#4a3c31] text-xl font-serif font-bold shadow-inner">
              {leadName.substring(0, 2).toUpperCase()}
            </div>
            
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-serif text-[#4a3c31] font-bold">{leadName}</h2>
              <div className="flex items-center gap-2 text-[#7d6b5e] text-[11px]">
                <span className="font-mono text-[10px] bg-[#e5d8cb]/50 px-1.5 py-0.5 rounded text-[#4a3c31]">{id}</span>
                <span>•</span>
                <span className="text-[#7d6b5e]">Created on {leadData.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#efe7d5]/80 border border-[#d4c4b7] text-[#4a3c31]">
              <User size={14} className="text-[#947b66]" />
              <span className="font-semibold text-[10px]">{owner}</span>
            </div>

            <div className="relative group">
              <button className="bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-97 cursor-pointer">
                Actions <AltArrowDown size={14} />
              </button>
              <div className="absolute right-0 top-9 hidden group-hover:block z-50 w-36 bg-[#f3eae1] border border-[#d4c4b7] rounded-xl shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                <button type="button" onClick={() => handleAction('Qualify Lead')} className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] transition-colors">Qualify Lead</button>
                <button type="button" onClick={() => handleAction('Clone Lead')} className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] transition-colors">Clone Lead</button>
                <button type="button" onClick={() => handleAction('Convert')} className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] transition-colors">Convert to Booking</button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracker (Chevron Stage Timeline) */}
        <div className="w-full border border-[#d4c4b7] rounded-[12px] glass-panel p-3 overflow-x-auto shadow-xs">
          <div className="flex items-center min-w-[600px] w-full">
            {stages.map((stage, idx) => {
              const isCanceledActive = activeStage === 'Canceled';
              const activeIndex = stages.indexOf(activeStage);
              const isCompleted = idx <= activeIndex && !isCanceledActive;
              
              // Circle style
              let circleClass = '';
              let circleContent: React.ReactNode = idx + 1;
              
              if (stage === 'Completed' && isCompleted) {
                circleContent = '✔';
              } else if (stage === 'Canceled' && isCanceledActive) {
                circleContent = '✕';
              }

              if (stage === 'Canceled') {
                circleClass = isCanceledActive
                  ? 'bg-white text-[#5f2e27] border-white'
                  : 'bg-transparent text-[#7d6b5e]/60 border-[#d4c4b7]/50';
              } else if (isCompleted) {
                circleClass = 'bg-white text-[#2f4256] border-white';
              } else {
                circleClass = 'bg-transparent text-[#6a5848] border-[#d4c4b7]/70';
              }
              
              return (
                <button
                  key={stage}
                  onClick={() => setActiveStage(stage)}
                  className={`flex-1 flex items-center justify-between px-4 py-2.5 text-xs font-bold border rounded-lg mx-1.5 transition-all duration-150 cursor-pointer ${getStageStyle(stage)}`}
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

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
          
          {/* LEFT COLUMN: Details Card & Attachments */}
          <div className="space-y-6">
            
            {/* Details Card */}
            <div className="border border-[#d4c4b7] rounded-[12px] glass-panel shadow-xs overflow-hidden">
              <div className="bg-[#947b66]/10 px-5 py-4 border-b border-[#d4c4b7] flex justify-between items-center">
                <h3 className="text-sm font-bold font-serif text-[#4a3c31]">Details</h3>
                <div className="flex gap-2">
                  <button type="button" className="p-1 hover:bg-black/5 rounded text-[#7d6b5e] transition-colors"><DoubleAltArrowRight size={14} /></button>
                </div>
              </div>

              <form onSubmit={handleSave} className="p-5 space-y-4">
                {/* Total Lead Value */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Total Lead Value</label>
                  <div className="flex rounded-lg border border-[#d4c4b7] overflow-hidden glass-input focus-within:ring-1 focus-within:ring-[#947b66]">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-3 border-r border-[#d4c4b7] bg-[#efe7d5]/50 text-xs text-[#4a3c31] outline-hidden cursor-pointer"
                    >
                      <option value="USD">USD</option>
                      <option value="IDR">IDR</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <input
                      type="text"
                      value={totalValue}
                      onChange={(e) => setTotalValue(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs text-[#4a3c31] outline-hidden"
                    />
                  </div>
                </div>

                {/* Expected Close Date */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Expected Close Date</label>
                  <div className="relative flex items-center">
                    <DatePicker
                      selected={expectedClose}
                      onChange={(date: Date | null) => setExpectedClose(date)}
                      dateFormat="MMMM d, yyyy"
                      className="w-full h-9 pl-3 pr-8 text-xs glass-input border border-[#d4c4b7] rounded-lg text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                    />
                    <Calendar size={14} className="absolute right-3 text-[#947b66] pointer-events-none" />
                  </div>
                </div>

                {/* Owner */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Owner</label>
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="h-9 px-3 glass-input border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] cursor-pointer"
                  >
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                    <option value="David Miller">David Miller</option>
                    <option value="Emma Watson">Emma Watson</option>
                  </select>
                </div>

                {/* Source */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Source</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="h-9 px-3 glass-input border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                  />
                </div>

                {/* Source Details */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Source Details</label>
                  <input
                    type="text"
                    value={sourceDetails}
                    onChange={(e) => setSourceDetails(e.target.value)}
                    className="h-9 px-3 glass-input border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                  />
                </div>

                {/* CRS No */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">CRS No</label>
                  <input
                    type="text"
                    value={crsNo}
                    onChange={(e) => setCrsNo(e.target.value)}
                    className="h-9 px-3 glass-input border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                  />
                </div>

                {/* Lead Score */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Lead Score</label>
                  <input
                    type="text"
                    value={leadScore}
                    onChange={(e) => setLeadScore(e.target.value)}
                    className="h-9 px-3 glass-input border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66]"
                  />
                </div>

                {/* Confidence Level */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Confidence Level</label>
                  <select
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(e.target.value)}
                    className="h-9 px-3 glass-input border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] py-2 rounded-lg text-xs font-semibold transition-all active:scale-97 cursor-pointer"
                >
                  Save Changes
                </button>
              </form>
            </div>

            {/* Attachments Card */}
            <div className="border border-[#d4c4b7] rounded-[12px] glass-panel shadow-xs overflow-hidden">
              <div className="bg-[#947b66]/10 px-5 py-4 border-b border-[#d4c4b7]">
                <h3 className="text-sm font-bold font-serif text-[#4a3c31]">Attachments</h3>
              </div>
              <div className="p-5 flex flex-col items-center justify-center gap-3">
                {attachments.length === 0 ? (
                  <p className="text-[#7d6b5e] text-xs italic text-center">There are no attachments uploaded.</p>
                ) : (
                  <div className="w-full space-y-2">
                    {attachments.map((file, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-white/50 border border-[#d4c4b7]/50 rounded-lg text-xs">
                        <span className="font-medium text-[#4a3c31] truncate max-w-[200px]">{file}</span>
                        <button
                          type="button"
                          onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <label className="bg-[#efe7d5]/80 hover:bg-[#e5d8cb] border border-[#d4c4b7] text-[#4a3c31] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
                  <Upload size={14} className="text-[#947b66]" />
                  Select File
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Timeline Tabs & Activities Feed */}
          <div className="border border-[#d4c4b7] rounded-[12px] overflow-hidden glass-panel shadow-xs flex flex-col">
            
            {/* Timeline Tabs */}
            <div className="flex overflow-x-auto custom-scrollbar border-b border-[#d4c4b7] bg-[#f3eae1]/60 p-1">
              {([
                { name: 'All', icon: <Widget size={13} /> },
                { name: 'Contacts', icon: <UsersGroupTwoRounded size={13} /> },
                { name: 'Companies', icon: <Buildings size={13} /> },
                { name: 'Itineraries', icon: <Compass size={13} /> },
                { name: 'Sales Activities', icon: <Notes size={13} /> },
                { name: 'Marcom Activities', icon: <Star size={13} /> },
                { name: 'Emails', icon: <Letter size={13} /> },
                { name: 'Calls', icon: <Phone size={13} /> }
              ] as { name: TabType; icon: React.ReactNode }[]).map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTimelineTab(tab.name)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    activeTimelineTab === tab.name
                      ? 'bg-[#947b66] text-[#efe7d5] shadow-xs'
                      : 'text-[#7d6b5e] hover:bg-[#e5d8cb]/50 hover:text-[#4a3c31]'
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Activities Timeline Feed */}
            <div className="p-5 flex-1 min-h-[300px]">
              <div className="relative pl-6 border-l border-[#d4c4b7]/60 space-y-6">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((act) => {
                    const isExpanded = expandedTimelineId === act.id;
                    return (
                      <div key={act.id} className="relative group">
                        
                        {/* Timeline Bullet Icon */}
                        <span className="absolute -left-[35px] top-0 w-[18px] h-[18px] rounded-full bg-[#fdfaf7] border border-[#d4c4b7] flex items-center justify-center text-[#947b66] shadow-2xs">
                          {act.iconType === 'plus' && <span className="text-[11px] font-bold">+</span>}
                          {act.iconType === 'edit' && <span className="text-[9px]">✎</span>}
                          {act.iconType === 'stage' && <span className="text-[9px]">⇾</span>}
                          {act.iconType === 'create' && <span className="text-[9px]">★</span>}
                        </span>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
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
                            
                            {/* Expandable Field Updates */}
                            {act.iconType === 'edit' && act.updatedFields && (
                              <div className="mt-1">
                                <button
                                  type="button"
                                  onClick={() => setExpandedTimelineId(isExpanded ? null : act.id)}
                                  className="text-[#947b66] hover:text-[#4a3c31] font-semibold text-[9px] cursor-pointer"
                                >
                                  {isExpanded ? 'Hide Updated Fields' : `View Updated Fields (${act.updatedFields.length})`}
                                </button>
                                {isExpanded && (
                                  <ul className="mt-1 pl-4 list-disc list-inside text-[10px] text-[#7d6b5e] bg-white/40 p-2 rounded-lg border border-[#d4c4b7]/30">
                                    {act.updatedFields.map((field) => (
                                      <li key={field}>{field} updated</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => toast.success('Pinned', 'Activity pinned to top.', 3000)}
                            className="text-[10px] font-semibold text-[#947b66] hover:text-[#4a3c31] self-start sm:self-auto cursor-pointer"
                          >
                            Pin on top
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[#7d6b5e] text-xs italic">No activity logs matching this filter.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
