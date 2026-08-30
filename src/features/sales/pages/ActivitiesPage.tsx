import { useState } from 'react';
import { Magnifer, Filter, Letter, Phone, AddSquare, TrashBinTrash } from '@solar-icons/react';
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

interface Activity {
  id: string;
  title: string;
  type: 'Call' | 'Email';
  dueDate: string;
  dueTime: string;
  owner: string;
  leads: string;
  company: string;
  completed: boolean;
}

const initialActivities: Activity[] = [
  {
    id: 'ACT-001',
    title: 'Executive Client Introduction Call',
    type: 'Call',
    dueDate: 'May 31, 2026',
    dueTime: '11:00 AM',
    owner: 'Alpha',
    leads: 'Madia Lestari',
    company: 'Lestari Holdings',
    completed: false
  },
  {
    id: 'ACT-002',
    title: 'Sales Fam 100 Proposal Email',
    type: 'Email',
    dueDate: 'May 15, 2026',
    dueTime: '09:30 AM',
    owner: 'vervast',
    leads: 'Grand Hyatt Corporate',
    company: 'Travel Agency X',
    completed: true
  },
  {
    id: 'ACT-003',
    title: 'Contract Finalization Check-in',
    type: 'Call',
    dueDate: 'May 16, 2026',
    dueTime: '12:00 PM',
    owner: 'Alpha',
    leads: 'Alan Wake',
    company: 'Bright Falls Corp',
    completed: false
  },
  {
    id: 'ACT-004',
    title: 'Rate Sheet & Catalog Dispatch',
    type: 'Email',
    dueDate: 'May 01, 2026',
    dueTime: '09:00 AM',
    owner: 'Alpha',
    leads: 'Ryan Uno',
    company: 'Uno Global',
    completed: true
  },
];

export function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activitiesList, setActivitiesList] = useState<Activity[]>(initialActivities);

  const toggleComplete = (id: string) => {
    setActivitiesList(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const filteredActivities = activitiesList.filter(act => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.leads.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'All' || act.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || (statusFilter === 'Completed' ? act.completed : !act.completed);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden pb-8 px-4 lg:px-6">
      {/* Header */}
      <header className="shrink-0 flex justify-between items-start mb-5 animate-card-enter">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 leading-tight mb-0.5">
            Sales Activities
          </h1>
          <p className="text-zinc-500 text-xs font-normal">
            Track outbound calls, client follow-up emails, and action checklists
          </p>
        </div>
        <button
          onClick={() => {}}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-xs cursor-pointer">
          <AddSquare size={14} />
          Log New Activity
        </button>
      </header>

      {/* Main Table Area */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div
          className="flex-1 flex flex-col rounded-[12px] bg-white/70 backdrop-blur-xs border border-zinc-200/80 shadow-xs overflow-hidden animate-card-enter"
          style={{ animationDelay: '0.1s' }}
        >
          {/* Toolbar */}
          <div className="p-3.5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <div className="relative w-72">
              <Magnifer size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search activities by title, lead, or owner…"
                className="pl-9 h-8.5 bg-white border-zinc-200 text-zinc-900 focus-visible:ring-zinc-400 rounded-lg text-xs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 relative">
              <span className="text-xs text-zinc-500 mr-1">
                <span className="font-medium text-zinc-900">{filteredActivities.length}</span> items
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
                  <div className="mb-3">
                    <label className="block text-[9.5px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Activity Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-zinc-50 border border-zinc-200 rounded px-2.5 text-zinc-800 outline-none cursor-pointer">
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
                    <label className="block text-[9.5px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full h-8 text-xs bg-zinc-50 border border-zinc-200 rounded px-2.5 text-zinc-800 outline-none cursor-pointer">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="All">All Statuses</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-zinc-50/90 backdrop-blur-xs border-b border-zinc-100 z-10">
                <tr>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400 w-12 text-center">Done</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Activity Title</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Type</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Related Lead / Client</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Company</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Due Date</th>
                  <th className="px-5 py-2.5 text-[9.5px] font-medium text-zinc-400">Owner</th>
                  <th className="px-5 py-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map(act => (
                    <tr
                      key={act.id}
                      className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={act.completed}
                          onChange={() => toggleComplete(act.id)}
                          className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 cursor-pointer"
                        />
                      </td>
                      <td className={`px-5 py-3 font-medium text-zinc-900 ${act.completed ? 'line-through text-zinc-400' : ''}`}>
                        {act.title}
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-1 text-[10px] text-zinc-600 font-medium">
                          {act.type === 'Call' ? <Phone size={13} className="text-zinc-500" /> : <Letter size={13} className="text-zinc-500" />}
                          {act.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-700 text-[10px]">{act.leads}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{act.company || '—'}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{act.dueDate} · {act.dueTime}</td>
                      <td className="px-5 py-3 text-zinc-500 text-[10px]">{act.owner}</td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => setActivitiesList(prev => prev.filter(a => a.id !== act.id))}
                          className="p-1 rounded hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors"
                        >
                          <TrashBinTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-zinc-400 text-xs italic">
                      No activities found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-zinc-100 flex justify-between items-center bg-zinc-50/50 text-[10px] text-zinc-500">
            <span>Showing <span className="font-medium text-zinc-900">{filteredActivities.length}</span> activities</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-6.5 text-[10px] text-zinc-600 hover:bg-zinc-100 opacity-50 cursor-not-allowed">Previous</Button>
              <Button variant="ghost" size="sm" className="h-6.5 text-[10px] text-zinc-600 hover:bg-zinc-100 opacity-50 cursor-not-allowed">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
