import { useState } from 'react';
import { TagPrice, Magnifer, Filter, CloseCircle, Letter, Phone, Upload, TrashBinTrash, Pen } from '@solar-icons/react';
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

interface Activity {
  id: string;
  title: string;
  type: 'Call' | 'Email';
  dueDate: string;
  dueTime: string;
  endDate: string;
  endTime: string;
  owner: string;
  createdAt: string;
  leads: string;
  reminderValue: number;
  reminderUnit: 'minutes' | 'hours' | 'days';
  description: string;
  company: string;
  attachments: Attachment[];
  comments: Comment[];
  completed: boolean;
}

// Initial mock data populated with full details
const initialActivities: Activity[] = [
  {
    id: 'SA-MadiaLestari-300520260231',
    title: 'SA-MadiaLestari-300520260231',
    type: 'Call',
    dueDate: '2026-05-31',
    dueTime: '11:00',
    endDate: '2026-05-31',
    endTime: '',
    owner: 'Alpha',
    createdAt: 'May 30, 2026 03:32',
    leads: 'Madia Lestari',
    reminderValue: 3,
    reminderUnit: 'hours',
    description: 'This is description',
    company: '',
    attachments: [
      { name: 'Glx4Jo.jpg', size: '256.76 KB', date: 'May 30, 2026 03:34' }
    ],
    comments: [
      {
        id: 'c1',
        author: 'vervast',
        avatar: 'VE',
        text: 'Lorem ipsum dollor is amet\\',
        date: 'June 24, 2026 10:55'
      }
    ],
    completed: false
  },
  {
    id: 'SA-SalesFam100',
    title: 'Sales Fam 100',
    type: 'Email',
    dueDate: '2026-05-15',
    dueTime: '09:30',
    endDate: '2026-05-15',
    endTime: '10:30',
    owner: 'vervast',
    createdAt: 'May 15, 2026 07:59',
    leads: 'Grand Hyatt Corporate',
    reminderValue: 1,
    reminderUnit: 'days',
    description: 'Follow up email regarding the Sales Fam 100 group reservation block.',
    company: 'Travel Agency X',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'SA-AlanWake-120520261112',
    title: 'SA-Alan Wake-120520261112',
    type: 'Call',
    dueDate: '2026-05-16',
    dueTime: '12:00',
    endDate: '2026-05-16',
    endTime: '',
    owner: 'Alpha',
    createdAt: 'May 12, 2026 12:13',
    leads: 'Alan Wake',
    reminderValue: 15,
    reminderUnit: 'minutes',
    description: 'Call to finalize the contract for the corporate stay.',
    company: 'Bright Falls Corp',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'SA-RyanUno-01052026',
    title: 'SA-Ryan Uno-01052026',
    type: 'Email',
    dueDate: '2026-05-01',
    dueTime: '09:00',
    endDate: '2026-05-01',
    endTime: '',
    owner: 'Alpha',
    createdAt: 'May 5, 2026 21:22',
    leads: 'Ryan Uno',
    reminderValue: 1,
    reminderUnit: 'hours',
    description: 'Introductory email detailing rooms catalog and rates sheet.',
    company: '',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'SA-RyanUno-05052026',
    title: 'SA-Ryan Uno-05052026',
    type: 'Call',
    dueDate: '2026-05-07',
    dueTime: '10:00',
    endDate: '2026-05-07',
    endTime: '',
    owner: 'Alpha',
    createdAt: 'May 5, 2026 21:21',
    leads: 'Ryan Uno',
    reminderValue: 30,
    reminderUnit: 'minutes',
    description: 'Quick check-in call to address feedback on rate proposal.',
    company: '',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'SA-Yuhuu',
    title: 'Yuhuu',
    type: 'Call',
    dueDate: '2026-04-11',
    dueTime: '14:00',
    endDate: '2026-04-11',
    endTime: '',
    owner: 'Alpha',
    createdAt: 'April 10, 2026 02:50',
    leads: 'Yuhuu Group',
    reminderValue: 2,
    reminderUnit: 'hours',
    description: 'Negotiation call.',
    company: 'Yuhuu Corp',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'SA-TestThingsToDo',
    title: 'Test Things To Do',
    type: 'Call',
    dueDate: '2026-01-13',
    dueTime: '00:15',
    endDate: '2026-01-13',
    endTime: '',
    owner: 'vervast',
    createdAt: 'January 4, 2026 02:16',
    leads: 'Test Lead',
    reminderValue: 1,
    reminderUnit: 'hours',
    description: 'Testing the creation of activities and assignments.',
    company: '',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'SA-Test',
    title: 'Test',
    type: 'Email',
    dueDate: '2025-12-01',
    dueTime: '12:00',
    endDate: '2025-12-01',
    endTime: '',
    owner: 'vervast',
    createdAt: 'December 22, 2025 22:51',
    leads: 'General Query',
    reminderValue: 3,
    reminderUnit: 'hours',
    description: 'Draft activity for internal review.',
    company: '',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'SA-Call-1',
    title: 'Call',
    type: 'Call',
    dueDate: '2025-12-11',
    dueTime: '10:00',
    endDate: '2025-12-11',
    endTime: '',
    owner: 'vervast',
    createdAt: 'December 22, 2025 21:52',
    leads: 'Inbound Call',
    reminderValue: 10,
    reminderUnit: 'minutes',
    description: 'Call back requested regarding booking availability.',
    company: '',
    attachments: [],
    comments: [],
    completed: false
  },
  {
    id: 'SA-Call-2',
    title: 'Call',
    type: 'Call',
    dueDate: '2025-12-07',
    dueTime: '15:30',
    endDate: '2025-12-07',
    endTime: '',
    owner: 'vervast',
    createdAt: 'December 22, 2025 20:33',
    leads: 'Reservations Team',
    reminderValue: 1,
    reminderUnit: 'hours',
    description: 'Follow up call on pipeline.',
    company: '',
    attachments: [],
    comments: [],
    completed: false
  }
];

export function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected Activity Detail States
  const [selectedActId, setSelectedActId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'details' | 'comments'>('details');

  // Action menu state
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  // Form Fields Edit State (cloned from selected item)
  const [editTitle, setEditTitle] = useState('');
  const [editLeads, setEditLeads] = useState('');
  const [editType, setEditType] = useState<'Call' | 'Email'>('Call');
  const [editDueDate, setEditDueDate] = useState('');
  const [editDueTime, setEditDueTime] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editReminderVal, setEditReminderVal] = useState(3);
  const [editReminderUnit, setEditReminderUnit] = useState<'minutes' | 'hours' | 'days'>('hours');
  const [editOwner, setEditOwner] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editAttachments, setEditAttachments] = useState<Attachment[]>([]);
  const [editComments, setEditComments] = useState<Comment[]>([]);

  // New Comment State
  const [newCommentText, setNewCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  // Selected Activity Object
  const selectedActivity = activities.find(a => a.id === selectedActId) || null;

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'All' || act.type === typeFilter;
    const matchesOwner = ownerFilter === 'All' || act.owner === ownerFilter;

    return matchesSearch && matchesType && matchesOwner;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const handleRowClick = (act: Activity) => {
    setSelectedActId(act.id);
    setDetailTab('details');
    setIsActionsOpen(false);

    // Initialize edit fields
    setEditTitle(act.title);
    setEditLeads(act.leads);
    setEditType(act.type);
    setEditDueDate(act.dueDate);
    setEditDueTime(act.dueTime);
    setEditEndDate(act.endDate);
    setEditEndTime(act.endTime);
    setEditReminderVal(act.reminderValue);
    setEditReminderUnit(act.reminderUnit);
    setEditOwner(act.owner);
    setEditDescription(act.description);
    setEditCompany(act.company);
    setEditAttachments([...act.attachments]);
    setEditComments([...act.comments]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActId) return;

    setActivities(prev => prev.map(act => {
      if (act.id === selectedActId) {
        return {
          ...act,
          title: editTitle,
          leads: editLeads,
          type: editType,
          dueDate: editDueDate,
          dueTime: editDueTime,
          endDate: editEndDate,
          endTime: editEndTime,
          reminderValue: editReminderVal,
          reminderUnit: editReminderUnit,
          owner: editOwner,
          description: editDescription,
          company: editCompany,
          attachments: editAttachments,
          comments: editComments,
        };
      }
      return act;
    }));

    // Close detail panel
    setSelectedActId(null);
  };

  const handleMarkCompleted = () => {
    if (!selectedActId) return;
    setActivities(prev => prev.map(act => {
      if (act.id === selectedActId) {
        return { ...act, completed: !act.completed };
      }
      return act;
    }));
    setIsActionsOpen(false);
  };

  const handleDeleteActivity = () => {
    if (!selectedActId) return;
    setActivities(prev => prev.filter(act => act.id !== selectedActId));
    setSelectedActId(null);
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

    // Save directly to the activity comments state
    setActivities(prev => prev.map(act => {
      if (act.id === selectedActId) {
        return { ...act, comments: updatedComments };
      }
      return act;
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

    setActivities(prev => prev.map(act => {
      if (act.id === selectedActId) {
        return { ...act, comments: updatedComments };
      }
      return act;
    }));
  };

  const handleDeleteComment = (commentId: string) => {
    const updatedComments = editComments.filter(c => c.id !== commentId);
    setEditComments(updatedComments);
    setActivities(prev => prev.map(act => {
      if (act.id === selectedActId) {
        return { ...act, comments: updatedComments };
      }
      return act;
    }));
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Call':
        return 'bg-amber-500/10 text-amber-800 border-amber-500/20';
      case 'Email':
        return 'bg-sky-500/10 text-sky-800 border-sky-500/20';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
            Sales Activities.
          </h1>
          <p className="text-[#7d6b5e] text-sm italic font-serif">Manage and track your sales activities and communications.</p>
        </div>
      </header>

      {/* Main Split Layout Container */}
      <div className="flex-1 min-h-0 flex gap-6 px-4 lg:px-6 pb-6 items-stretch relative">

        {/* LEFT COLUMN: Table List */}
        <div className={`flex-1 flex flex-col border border-[#d4c4b7] rounded-[12px] backdrop-blur-sm bg-transparent overflow-hidden transition-all duration-300 animate-card-enter`}>

          {/* Toolbar */}
          <div className="p-4 border-b border-[#d4c4b7] flex justify-between items-center bg-[#f3eae1]/50">
            <div className="relative w-80">
              <Magnifer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#947b66]" />
              <Input
                placeholder="Search activities..."
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
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] mb-1">Type</label>
                    <Select value={typeFilter} onValueChange={(val) => {
                      setTypeFilter(val);
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-full h-8 text-xs bg-white/50 border border-[#d4c4b7] rounded px-3 text-[#4a3c31] outline-none cursor-pointer">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Types</SelectItem>
                          <SelectItem value="Call">Call</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
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

          {/* Table Area */}
          <div className="flex-1 overflow-auto custom-scrollbar bg-white/20">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="sticky top-0 bg-[#f3eae1] border-b border-[#d4c4b7] z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-center w-12">#</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Title</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap text-center">Sales Activity Type</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Due Date</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Owner</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#7d6b5e] whitespace-nowrap">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4c4b7]/50 text-xs text-[#4a3c31]">
                {paginatedActivities.length > 0 ? (
                  paginatedActivities.map((act, index) => {
                    const isSelected = selectedActId === act.id;
                    return (
                      <tr
                        key={act.id}
                        onClick={() => handleRowClick(act)}
                        className={`hover:bg-[#e5d8cb]/40 transition-colors cursor-pointer group ${isSelected ? 'bg-[#947b66]/20 backdrop-blur-sm font-bold' : ''
                          } ${act.completed ? 'opacity-65' : ''}`}
                      >
                        <td className="px-4 py-4 text-center font-medium text-[#7d6b5e] whitespace-nowrap">
                          {act.completed ? '✓' : startIndex + index + 1}
                        </td>
                        <td className={`px-4 py-4 font-medium transition-colors whitespace-nowrap ${isSelected ? 'text-[#947b66]' : 'group-hover:text-[#947b66]'
                          } ${act.completed ? 'line-through text-[#7d6b5e]' : ''}`}>{act.title}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border whitespace-nowrap inline-flex items-center justify-center ${getTypeStyle(act.type)}`}>
                            {act.type === 'Call' ? <Phone size={11} className="mr-1 inline" /> : <Letter size={11} className="mr-1 inline" />}
                            {act.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">{formatDate(act.dueDate)} {act.dueTime}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{act.owner}</td>
                        <td className="px-4 py-4 text-[#7d6b5e] whitespace-nowrap">{act.createdAt}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-[#7d6b5e] text-sm italic">
                      No activities found matching your criteria.
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
                {filteredActivities.length === 0 ? 0 : startIndex + 1}
              </span>{' '}
              -{' '}
              <span className="font-medium text-[#4a3c31]">
                {Math.min(startIndex + itemsPerPage, filteredActivities.length)}
              </span>{' '}
              of <span className="font-medium text-[#4a3c31]">{filteredActivities.length}</span> activities
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
        <div className={`shrink-0 rounded-[12px] bg-[#f3eae1]/30 backdrop-blur-sm shadow-lg flex flex-col overflow-hidden transition-all duration-300 ease-in-out relative z-20 ${selectedActId
          ? 'w-[450px] opacity-100 translate-x-0 scale-100 ml-4 border border-[#d4c4b7]'
          : 'w-0 opacity-0 translate-x-[100px] scale-95 pointer-events-none ml-0 border-0'
          }`}>

          {/* Detail Header */}
          <div className="bg-[#947b66]/10 backdrop-blur-sm px-5 py-4 border-b border-[#d4c4b7] shrink-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-[13px] font-bold font-serif text-[#4a3c31] truncate pr-4">{selectedActivity ? selectedActivity.title : editTitle}</h3>
              <button
                onClick={() => setSelectedActId(null)}
                className="text-[#7d6b5e] hover:text-[#4a3c31] transition-colors p-0.5 rounded-full hover:bg-black/5"
              >
                <CloseCircle size={18} />
              </button>
            </div>
            <p className="text-[10px] text-[#7d6b5e]">
              Created At: {selectedActivity ? selectedActivity.createdAt : ''} {selectedActivity ? ` - ${selectedActivity.owner}` : ''}
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
                Sales Activity
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
                    {selectedActivity && selectedActivity.completed ? 'Mark as active' : 'Mark as completed'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteActivity}
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

                {/* Leads */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Leads</label>
                  <select
                    value={editLeads}
                    onChange={(e) => setEditLeads(e.target.value)}
                    className="h-9 px-3 glass-input border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] cursor-pointer"
                  >
                    <option value="">Select Lead...</option>
                    <option value="Madia Lestari">Madia Lestari</option>
                    <option value="Grand Hyatt Corporate">Grand Hyatt Corporate</option>
                    <option value="Alan Wake">Alan Wake</option>
                    <option value="Ryan Uno">Ryan Uno</option>
                  </select>
                </div>

                {/* Type */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditType('Call')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${editType === 'Call'
                        ? 'bg-amber-500/10 text-amber-800 border-amber-500/30 shadow-xs'
                        : 'bg-white/30 text-[#7d6b5e] border-[#d4c4b7]/60'
                        }`}
                    >
                      <Phone size={13} /> Call
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditType('Email')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${editType === 'Email'
                        ? 'bg-sky-500/10 text-sky-800 border-sky-500/30 shadow-xs'
                        : 'bg-white/30 text-[#7d6b5e] border-[#d4c4b7]/60'
                        }`}
                    >
                      <Letter size={13} /> Email
                    </button>
                  </div>
                </div>

                {/* Due Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Due Date <span className="text-red-500">*</span></label>
                    <Input
                      type="date"
                      required
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="h-9 px-3 glass-input border-[#d4c4b7] text-xs text-[#4a3c31] rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Due Time</label>
                    <Input
                      type="time"
                      value={editDueTime}
                      onChange={(e) => setEditDueTime(e.target.value)}
                      className="h-9 px-3 glass-input border-[#d4c4b7] text-xs text-[#4a3c31] rounded-lg"
                    />
                  </div>
                </div>

                {/* End Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">End Date</label>
                    <Input
                      type="date"
                      value={editEndDate}
                      onChange={(e) => setEditEndDate(e.target.value)}
                      className="h-9 px-3 glass-input border-[#d4c4b7] text-xs text-[#4a3c31] rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">End Time</label>
                    <Input
                      type="time"
                      value={editEndTime}
                      onChange={(e) => setEditEndTime(e.target.value)}
                      className="h-9 px-3 glass-input border-[#d4c4b7] text-xs text-[#4a3c31] rounded-lg"
                    />
                  </div>
                </div>

                {/* Reminder */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Reminder</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={editReminderVal}
                      onChange={(e) => setEditReminderVal(Number(e.target.value))}
                      className="h-9 w-20 px-3 glass-input border-[#d4c4b7] text-xs text-[#4a3c31] rounded-lg text-center"
                    />
                    <select
                      value={editReminderUnit}
                      onChange={(e) => setEditReminderUnit(e.target.value as any)}
                      className="flex-1 h-9 px-3 glass-input border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden cursor-pointer"
                    >
                      <option value="minutes">minutes before due</option>
                      <option value="hours">hours before due</option>
                      <option value="days">days before due</option>
                    </select>
                  </div>
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
                      placeholder="Write activity description here..."
                      className="p-3 text-xs text-[#4a3c31] bg-transparent outline-hidden w-full h-24 resize-none"
                    />
                  </div>
                </div>

                {/* Associate With Records - Companies */}
                <div className="pt-2 border-t border-[#d4c4b7]/50 space-y-2">
                  <h4 className="text-[11px] font-bold text-[#4a3c31] flex items-center gap-1">
                    🔗 Associate With Records
                  </h4>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#7d6b5e]">Companies</label>
                    <select
                      value={editCompany}
                      onChange={(e) => setEditCompany(e.target.value)}
                      className="h-9 px-3 glass-input border border-[#d4c4b7] rounded-lg text-xs text-[#4a3c31] outline-hidden focus:ring-1 focus:ring-[#947b66] cursor-pointer"
                    >
                      <option value="">Select Company...</option>
                      <option value="Bright Falls Corp">Bright Falls Corp</option>
                      <option value="Yuhuu Corp">Yuhuu Corp</option>
                      <option value="Travel Genius">Travel Genius</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setEditCompany('New Company Ltd')}
                      className="text-left text-[10px] text-[#947b66] hover:underline hover:text-[#7d6b5e] w-fit font-semibold mt-1"
                    >
                      + Create Company
                    </button>
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
                    onClick={() => setSelectedActId(null)}
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
