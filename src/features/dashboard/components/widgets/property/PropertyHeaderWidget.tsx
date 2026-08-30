import { useState, useRef, useEffect } from 'react';
import { Calendar, AltArrowDown, Magnifer } from '@solar-icons/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function PropertyHeaderWidget({ 
  startDate, endDate, onDateChange,
  compStartDate, compEndDate, onCompDateChange,
  selectedProperty, onPropertyChange, propertiesList
}: any) {
  const [isOpen, setIsOpen]       = useState(false);
  const [search, setSearch]       = useState('');
  const dropdownRef               = useRef<HTMLDivElement>(null);
  const searchRef                 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const filtered = propertiesList.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Ohayō Alfonso!';
    if (hour >= 12 && hour < 18) return 'Konnichiwa Alfonso!';
    return 'Konbanwa Alfonso!';
  };

  const getFormattedDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return { date, time, tz };
  };

  const { date, time, tz } = getFormattedDateTime();

  return (
    <div className="w-full border-b border-zinc-100 pb-4 flex flex-col gap-3.5">
      {/* Top Row: Welcome/Greeting & Property Select (Left) + Weather & Date/Time (Right) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 w-full">
        {/* Left Side: Property Dropdown */}
        <div>
          <p className="text-[10px] font-medium text-zinc-400 tracking-widest uppercase mb-1">
            {getGreeting()}
          </p>
          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 shadow-xs shrink-0">
              <img src={selectedProperty.img} alt={selectedProperty.name} className="w-full h-full object-cover" />
            </div>
            
            <button 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xl font-bold text-zinc-900 tracking-tight leading-none">
                    {selectedProperty.name}
                  </h2>
                  <AltArrowDown className={`text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={16} />
                </div>
                <span className="text-zinc-500 text-[10px] font-sans tracking-widest uppercase font-semibold mt-1">
                  {selectedProperty.location}
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute top-10 left-11 mt-2 w-[320px] bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in flex flex-col">
                {/* Header label */}
                <div className="px-3.5 pt-3 pb-2 shrink-0 border-b border-zinc-100">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Select Property</div>
                  {/* Search input */}
                  <div className="relative">
                    <Magnifer size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      ref={searchRef}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search property…"
                      className="w-full pl-8 pr-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition"
                    />
                  </div>
                </div>

                {/* Scrollable list */}
                <div className="overflow-y-auto custom-scrollbar max-h-[280px] p-1.5">
                  {filtered.length > 0 ? filtered.map((prop: any) => (
                    <button
                      key={prop.id}
                      onClick={() => { onPropertyChange(prop); setIsOpen(false); setSearch(''); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100/80 transition-colors text-left ${selectedProperty.id === prop.id ? 'bg-zinc-100 font-medium' : ''}`}
                    >
                      <img src={prop.img} alt={prop.name} className="w-7 h-7 rounded-full object-cover border border-zinc-200 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-zinc-900 leading-tight">{prop.name}</div>
                        <div className="text-[9.5px] text-zinc-500 mt-0.5">{prop.location}</div>
                      </div>
                      {selectedProperty.id === prop.id && (
                        <span className="ml-auto shrink-0 w-4 h-4 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                    </button>
                  )) : (
                    <div className="px-3 py-4 text-center text-[11px] text-zinc-400 italic">No properties found</div>
                  )}
                </div>

                {/* Footer count */}
                <div className="px-3.5 py-2 border-t border-zinc-100 bg-zinc-50/50 shrink-0">
                  <span className="text-[9px] text-zinc-400 font-medium">
                    {filtered.length} of {propertiesList.length} properties
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Date/Time */}
        <div className="flex items-center gap-3.5 shrink-0">
          {/* Date & Time */}
          <div className="text-right shrink-0">
            <div className="text-[11px] font-bold text-zinc-900 leading-tight">{time}</div>
            <div className="text-[9px] text-zinc-500 font-medium mt-0.5">{date} · {tz}</div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Date Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-zinc-600 pt-1">
        {/* Main Date Range */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 uppercase tracking-wider text-[9.5px]">Period:</span>
          <div className="relative flex items-center">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(dates) => onDateChange(dates)}
              className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1 text-[10px] text-zinc-900 cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors w-[190px] shadow-2xs font-medium"
              dateFormat="MMM d, yyyy"
              placeholderText="Select main range"
            />
            <Calendar size={13} className="absolute right-2.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Comparison Date Range */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 uppercase tracking-wider text-[9.5px]">Compare vs:</span>
          <div className="relative flex items-center">
            <DatePicker
              selectsRange
              startDate={compStartDate}
              endDate={compEndDate}
              onChange={(dates) => onCompDateChange(dates)}
              className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1 text-[10px] text-zinc-900 cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors w-[190px] shadow-2xs font-medium"
              dateFormat="MMM d, yyyy"
              placeholderText="Select comparison range"
            />
            <Calendar size={13} className="absolute right-2.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
