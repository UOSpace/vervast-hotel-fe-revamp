import { useState } from 'react';
import { TagPrice, Magnifer, Filter, CloseCircle, Letter, Upload, TrashBinTrash, Pen } from '@solar-icons/react';
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

// Interface definitions
interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
}

interface Attachment {
  name: string;
  size: string;
  date: string;
}

interface EmailCampaign {
  id: string;
  title: string;
  owner: string;
  type: string;
  startDate: string;
  startTime: string;
  createdAt: string;
  description: string;
  attachments: Attachment[];
  comments: Comment[];
  completed: boolean;
}

// Initial mock data populated with full details
const initialCampaigns: EmailCampaign[] = [
  {
    id: 'EM-001',
    title: 'Corporate Meeting Longue Discount',
    owner: 'Alpha',
    type: 'Email Marketing',
    startDate: '2026-07-01',
    startTime: '09:00',
    createdAt: 'June 21, 2026 09:00',
    description: 'Corporate campaign targeting meeting room bookings with a lounge discount.',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'EM-002',
    title: 'New Year Bali Staycation',
    owner: 'vervast',
    type: 'Email Marketing',
    startDate: '2026-06-28',
    startTime: '06:39',
    createdAt: 'June 21, 2026 06:39',
    description: 'Promo campaign for Bali staycation vouchers during the New Year period.',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'EM-003',
    title: 'Summer Discount for Zeynep Sal',
    owner: 'vervast',
    type: 'Email Marketing',
    startDate: '2026-06-25',
    startTime: '06:32',
    createdAt: 'June 21, 2026 06:32',
    description: 'Special summer loyalty discount email campaign.',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'EM-004',
    title: 'MA-MadiaLestari-300520249',
    owner: 'Alpha',
    type: 'Email Marketing',
    startDate: '2026-05-30',
    startTime: '09:00',
    createdAt: 'May 30, 2026 03:48',
    description: 'Marketing campaign for Madia Lestari group package promotion.',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'EM-005',
    title: 'MA-Fox Travel-16052026',
    owner: 'Alpha',
    type: 'Email Marketing',
    startDate: '2026-05-02',
    startTime: '01:00',
    createdAt: 'May 16, 2026 15:02',
    description: 'Fox Travel B2B partnership newsletter campaign.',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'EM-006',
    title: 'Markom Fam 100',
    owner: 'vervast',
    type: 'Email Marketing',
    startDate: '2026-05-15',
    startTime: '13:30',
    createdAt: 'May 15, 2026 08:01',
    description: 'Promotional blast for Markom Fam 100 VIP packages.',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'EM-007',
    title: 'MA-Alan Wake-120520261120',
    owner: 'Alpha',
    type: 'Email Marketing',
    startDate: '2026-05-14',
    startTime: '10:00',
    createdAt: 'May 12, 2026 12:21',
    description: 'Alan Wake corporate booking announcement campaign.',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'EM-008',
    title: 'MA-Ryan Uno-05052027',
    owner: 'Alpha',
    type: 'Email Marketing',
    startDate: '2026-05-02',
    startTime: '07:00',
    createdAt: 'May 10, 2026 19:23',
    description: 'Ryan Uno seasonal discount follow-up.',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'EM-009',
    title: 'MA-Grafik-09052026',
    owner: 'Alpha',
    type: 'Email Marketing',
    startDate: '2026-05-09',
    startTime: '11:30',
    createdAt: 'May 9, 2026 09:42',
    description: 'Graphics and design portal discount mail.',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'EM-010',
    title: 'MA-Alan-10052026',
    owner: 'vervast',
    type: 'Email Marketing',
    startDate: '2026-05-10',
    startTime: '08:00',
    createdAt: 'May 9, 2026 08:43',
    description: 'Alan B2B promotional update campaign.',
    attachments: [],
    comments: [],
    completed: false
  },
];

export function EmailMarketingPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(initialCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected Campaign Detail States
  const [selectedCampId, setSelectedCampId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'details' | 'comments'>('details');
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  // Form Fields Edit State
  const [editTitle, setEditTitle] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAttachments, setEditAttachments] = useState<Attachment[]>([]);
  const [editComments, setEditComments] = useState<Comment[]>([]);

  // New Comment State
  const [newCommentText, setNewCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  const selectedCampaign = campaigns.find(c => c.id === selectedCampId) || null;

  const filteredCampaigns = campaigns.filter((email) => {
    const matchesSearch =
      email.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOwner = ownerFilter === 'All' || email.owner === ownerFilter;

    return matchesSearch && matchesOwner;
  });

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmails = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);

  const handleRowClick = (camp: EmailCampaign) => {
    setSelectedCampId(camp.id);
    setDetailTab('details');
    setIsActionsOpen(false);

    setEditTitle(camp.title);
    setEditOwner(camp.owner);
    setEditStartDate(camp.startDate);
    setEditStartTime(camp.startTime);
    setEditDescription(camp.description);
    setEditAttachments([...camp.attachments]);
    setEditComments([...camp.comments]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampId) return;

    setCampaigns(prev => prev.map(camp => {
      if (camp.id === selectedCampId) {
        return {
          ...camp,
          title: editTitle,
          owner: editOwner,
          startDate: editStartDate,
          startTime: editStartTime,
          description: editDescription,
          attachments: editAttachments,
          comments: editComments,
        };
      }
      return camp;
    }));

    setSelectedCampId(null);
  };

  const handleMarkCompleted = () => {
    if (!selectedCampId) return;
    setCampaigns(prev => prev.map(camp => {
      if (camp.id === selectedCampId) {
        return { ...camp, completed: !camp.completed };
      }
      return camp;
    }));
    setIsActionsOpen(false);
  };

  const handleDeleteCampaign = () => {
    if (!selectedCampId) return;
    setCampaigns(prev => prev.filter(camp => camp.id !== selectedCampId));
    setSelectedCampId(null);
    setIsActionsOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newAttachment: Attachment = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')
      };
      setEditAttachments(prev => [...prev, newAttachment]);
    }
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: 'vervast',
      avatar: 'VE',
      text: newCommentText,
      date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')
    };
    const updatedComments = [...editComments, newComment];
    setEditComments(updatedComments);
    setNewCommentText('');

    setCampaigns(prev => prev.map(camp => {
      if (camp.id === selectedCampId) {
        return { ...camp, comments: updatedComments };
      }
      return camp;
    }));
  };

  const handleUpdateComment = (commentId: string) => {
    if (!editingCommentText.trim()) return;
    const updatedComments = editComments.map(c => {
      if (c.id === commentId) {
        return { ...c, text: editingCommentText };
      }
      return c;
    });
    setEditComments(updatedComments);
    setEditingCommentId(null);
    setEditingCommentText('');

    setCampaigns(prev => prev.map(camp => {
      if (camp.id === selectedCampId) {
        return { ...camp, comments: updatedComments };
      }
      return camp;
    }));
  };

  const handleDeleteComment = (commentId: string) => {
    const updatedComments = editComments.filter(c => c.id !== commentId);
    setEditComments(updatedComments);
    setCampaigns(prev => prev.map(camp => {
      if (camp.id === selectedCampId) {
        return { ...camp, comments: updatedComments };
      }
      return camp;
    }));
  };

  // Convert date format "YYYY-MM-DD" to human readable "Month DD, YYYY" for list view
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    return dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-start mb-6 px-4 lg:px-6 animate-card-enter">
        <div>
          <h1 className="text-4xl font-serif text-[#4a3c31] mb-1 flex items-center gap-3">
            <TagPrice size={36} className="text-[#947b66]" />
            Email Marketing.
          </h1>
          <p className="text-[#7d6b5e] text-sm italic font-serif">Plan, manage, and dispatch email marketing campaigns.</p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex gap-6 px-4 lg:px-6 pb-6 items-stretch relative">

        {/* LEFT COLUMN: Table Container */}
        <div className="flex-1 flex flex-col border border-[#d4c4b7] rounded-[12px] backdrop-blur-sm bg-transparent overflow-hidden animate-card-enter">

          {/* Toolbar */}
          <div className="p-4 border-b border-[#d4c4b7] flex justify-between items-center bg-[#f3eae1]/50">
            <div className="relative w-80">
              <Magnifer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#947b66]" />
              <Input
                placeholder="Search campaigns..."
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
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-1">Owner</label>
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
                          <SelectItem value="Alpha">Alpha</SelectItem>
                          <SelectItem value="vervast">vervast</SelectItem>
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
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="sticky top-0 bg-[#f3eae1] border-b border-[#d4c4b7] z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-center w-12">#</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Title</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Owner</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-center">Marcom Activities Type</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Start Date</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4c4b7]/50 text-xs text-[#4a3c31]">
                {paginatedEmails.length > 0 ? (
                  paginatedEmails.map((email, index) => {
                    const isSelected = selectedCampId === email.id;
                    return (
                      <tr
                        key={email.id}
                        onClick={() => handleRowClick(email)}
                        className={`hover:bg-[#e5d8cb]/40 transition-colors cursor-pointer group ${isSelected ? 'bg-[#947b66]/20 backdrop-blur-sm font-bold' : ''
                          } ${email.completed ? 'opacity-65' : ''}`}
                      >
                        <td className="px-4 py-4 text-center font-medium text-[#7d6b5e] whitespace-nowrap">
                          {email.completed ? '✓' : startIndex + index + 1}
                        </td>
                        <td className={`px-4 py-4 font-medium transition-colors whitespace-nowrap ${isSelected ? 'text-[#947b66]' : 'group-hover:text-[#947b66]'
                          } ${email.completed ? 'line-through text-[#7d6b5e]' : ''}`}>{email.title}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{email.owner}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium border border-sky-500/20 bg-sky-500/10 text-sky-800 whitespace-nowrap inline-flex items-center justify-center">
                            <Letter size={11} className="mr-1 inline" />
                            {email.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">{formatDate(email.startDate)} {email.startTime}</td>
                        <td className="px-4 py-4 text-[#7d6b5e] whitespace-nowrap">{email.createdAt}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-[#7d6b5e] text-sm italic">
                      No campaigns found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-3 border-t border-[#d4c4b7] flex justify-between items-center bg-[#f3eae1]/80 text-xs text-[#7d6b5e] shrink-0">
            <span>
              Showing{' '}
              <span className="font-medium text-[#4a3c31]">
                {filteredCampaigns.length === 0 ? 0 : startIndex + 1}
              </span>{' '}
              -{' '}
              <span className="font-medium text-[#4a3c31]">
                {Math.min(startIndex + itemsPerPage, filteredCampaigns.length)}
              </span>{' '}
              of <span className="font-medium text-[#4a3c31]">{filteredCampaigns.length}</span> campaigns
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
                  className={`h-7 w-7 p-0 text-xs rounded-full ${currentPage === pageNum
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

        {/* RIGHT COLUMN: Slide-out Detail Panel */}
        <div className={`shrink-0 rounded-[12px] bg-[#f3eae1]/30 backdrop-blur-sm shadow-lg flex flex-col overflow-hidden transition-all duration-300 ease-in-out relative z-20 ${selectedCampId
          ? 'w-[450px] opacity-100 translate-x-0 scale-100 ml-4 border border-[#d4c4b7]'
          : 'w-0 opacity-0 translate-x-[100px] scale-95 pointer-events-none ml-0 border-0'
          }`}>

          {/* Detail Header */}
          <div className="bg-[#947b66]/10 backdrop-blur-sm px-5 py-4 border-b border-[#d4c4b7] shrink-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-[13px] font-bold font-serif text-[#4a3c31] truncate pr-4">{selectedCampaign ? selectedCampaign.title : editTitle}</h3>
              <button
                onClick={() => setSelectedCampId(null)}
                className="text-[#7d6b5e] hover:text-[#4a3c31] transition-colors p-0.5 rounded-full hover:bg-black/5"
              >
                <CloseCircle size={18} />
              </button>
            </div>
            <p className="text-[10px] text-[#7d6b5e]">
              Created At: {selectedCampaign ? selectedCampaign.createdAt : ''} {selectedCampaign ? ` - ${selectedCampaign.owner}` : ''}
            </p>
          </div>

          {/* Tabs & Actions */}
          <div className="px-5 border-b border-[#d4c4b7] flex justify-between items-center bg-[#f3eae1]/20 shrink-0 relative">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setDetailTab('details')}
                className={`py-2.5 text-xs font-semibold relative transition-colors ${detailTab === 'details' ? 'text-[#947b66]' : 'text-[#7d6b5e] hover:text-[#4a3c31]'
                  }`}
              >
                Campaign Details
                {detailTab === 'details' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#947b66]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('comments')}
                className={`py-2.5 text-xs font-semibold relative transition-colors ${detailTab === 'comments' ? 'text-[#947b66]' : 'text-[#7d6b5e] hover:text-[#4a3c31]'
                  }`}
              >
                Comments ({editComments.length})
                {detailTab === 'comments' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#947b66]" />
                )}
              </button>
            </div>

            {/* Actions Dropdown */}
            <div className="relative py-2">
              <button
                type="button"
                onClick={() => setIsActionsOpen(!isActionsOpen)}
                className="px-3 py-1 bg-white/40 border border-[#d4c4b7] hover:bg-white/60 rounded-md text-[10px] font-semibold text-[#4a3c31] transition-all flex items-center gap-1 cursor-pointer"
              >
                Actions
                <span className="text-[8px]">▼</span>
              </button>
              {isActionsOpen && (
                <div className="absolute right-0 top-9 z-50 w-36 bg-[#f3eae1] border border-[#d4c4b7] rounded-xl shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={handleMarkCompleted}
                    className="w-full px-3 py-2 text-left text-xs text-[#4a3c31] hover:bg-[#e5d8cb] transition-colors"
                  >
                    {selectedCampaign && selectedCampaign.completed ? 'Mark as active' : 'Mark as completed'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteCampaign}
                    className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Form/Comments Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5">

            {/* TAB 1: DETAILS */}
            {detailTab === 'details' && (
              <form onSubmit={handleSave} className="space-y-4">
                {/* Title */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Title <span className="text-red-500">*</span></label>
                  <Input
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="h-9 px-3 glass-input border-[#d4c4b7] text-xs text-[#4a3c31] rounded-lg focus-visible:ring-[#947b66]"
                  />
                </div>

                {/* Owner */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Owner <span className="text-red-500">*</span></label>
                  <select
                    value={editOwner}
                    onChange={(e) => setEditOwner(e.target.value)}
                    className="h-9 px-3 glass-input border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] cursor-pointer"
                  >
                    <option value="Alpha">Alpha</option>
                    <option value="vervast">vervast</option>
                  </select>
                </div>

                {/* Start Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Start Date <span className="text-red-500">*</span></label>
                    <Input
                      type="date"
                      required
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className="h-9 px-3 glass-input border-[#d4c4b7] text-xs text-[#4a3c31] rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Start Time</label>
                    <Input
                      type="time"
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                      className="h-9 px-3 glass-input border-[#d4c4b7] text-xs text-[#4a3c31] rounded-lg"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Description</label>
                  <div className="border border-[#d4c4b7] rounded-lg overflow-hidden glass-input flex flex-col">
                    {/* Fake Toolbar */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-[#d4c4b7] bg-white/20 text-[10px] text-[#7d6b5e]">
                      <span className="font-semibold px-1 py-0.5 hover:bg-black/5 rounded cursor-pointer">B</span>
                      <span className="italic px-1 py-0.5 hover:bg-black/5 rounded cursor-pointer">I</span>
                      <span className="underline px-1 py-0.5 hover:bg-black/5 rounded cursor-pointer">U</span>
                      <span className="px-1 py-0.5 hover:bg-black/5 rounded cursor-pointer">¶</span>
                      <span className="h-3 w-[1px] bg-[#d4c4b7] mx-1" />
                      <span className="hover:text-[#4a3c31] cursor-pointer">🔗</span>
                      <span className="hover:text-[#4a3c31] cursor-pointer">🖼️</span>
                    </div>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Write campaign description here..."
                      className="p-3 text-xs text-[#4a3c31] bg-transparent outline-hidden w-full h-24 resize-none"
                    />
                  </div>
                </div>

                {/* Attachments */}
                <div className="pt-2 border-t border-[#d4c4b7]/50 space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">
                    Attachments ({editAttachments.length})
                  </h4>
                  {editAttachments.length > 0 && (
                    <div className="space-y-2">
                      {editAttachments.map((file, i) => (
                        <div key={i} className="flex justify-between items-center p-2.5 bg-white/20 border border-[#d4c4b7]/50 rounded-lg text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#947b66]/20 backdrop-blur-sm flex items-center justify-center font-bold text-[9px] text-[#4a3c31] shrink-0">
                              JPG
                            </div>
                            <div className="min-w-0 flex flex-col">
                              <span className="font-medium text-[#4a3c31] truncate text-xs">{file.name}</span>
                              <span className="text-[10px] text-[#7d6b5e]">{file.size} • {file.date}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditAttachments(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-[#7d6b5e] hover:text-red-600 p-1 cursor-pointer transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="w-full bg-white/40 hover:bg-[#e5d8cb] border border-[#d4c4b7] text-[#4a3c31] px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                    <Upload size={14} className="text-[#947b66]" />
                    Select File
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {/* Form Footer Buttons */}
                <div className="pt-4 border-t border-[#d4c4b7] flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCampId(null)}
                    className="flex-1 bg-white/30 hover:bg-white/50 border border-[#d4c4b7] text-[#4a3c31] py-2 rounded-lg text-xs font-bold transition-all active:scale-97 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] py-2 rounded-lg text-xs font-bold transition-all active:scale-97 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: COMMENTS */}
            {detailTab === 'comments' && (
              <div className="space-y-4">
                {/* Add Comment Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 h-9 px-3 glass-input border-[#d4c4b7] text-xs text-[#4a3c31] rounded-lg"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment();
                    }}
                  />
                  <Button
                    onClick={handleAddComment}
                    className="h-9 px-4 bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] text-xs font-bold rounded-lg"
                  >
                    Post
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-3 pt-2">
                  {editComments.length > 0 ? (
                    editComments.map((comment) => (
                      <div key={comment.id} className="p-3 border border-[#d4c4b7]/50 rounded-xl bg-white/25 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#947b66]/20 backdrop-blur-sm border border-[#947b66] flex items-center justify-center text-[9px] font-bold text-[#4a3c31]">
                              {comment.avatar}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-xs text-[#4a3c31]">{comment.author}</span>
                              <span className="text-[9px] text-[#7d6b5e]">{comment.date}</span>
                            </div>
                          </div>

                          {/* Comment options if author is vervast */}
                          {comment.author === 'vervast' && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingCommentText(comment.text);
                                }}
                                className="p-1 text-[#7d6b5e] hover:text-[#947b66] rounded cursor-pointer"
                                title="Edit"
                              >
                                <Pen size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="p-1 text-[#7d6b5e] hover:text-red-600 rounded cursor-pointer"
                                title="Delete"
                              >
                                <TrashBinTrash size={11} />
                              </button>
                            </div>
                          )}
                        </div>

                        {editingCommentId === comment.id ? (
                          <div className="flex gap-2 mt-1">
                            <Input
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              className="flex-1 h-8 px-2 glass-input border-[#d4c4b7] text-xs text-[#4a3c31] rounded-md"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleUpdateComment(comment.id)}
                              className="h-8 px-3 bg-[#947b66] hover:bg-[#836a56] text-[#efe7d5] text-xs font-bold rounded-md"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingCommentId(null)}
                              className="h-8 px-2 text-[#4a3c31] hover:bg-[#d4c4b7]/30 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="bg-[#efe7d5]/40 border border-[#d4c4b7]/40 rounded-lg p-2.5 text-xs text-[#4a3c31] whitespace-pre-wrap">
                            {comment.text}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-[#7d6b5e] text-xs italic py-6">No comments posted yet.</p>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
