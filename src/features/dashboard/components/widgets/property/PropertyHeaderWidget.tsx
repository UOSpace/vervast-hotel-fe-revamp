import { useState, useRef, useEffect } from 'react';
import { CloudSnowfall, Calendar, AltArrowDown, Magnifer } from '@solar-icons/react';
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
    <div className="w-full border-b border-[#d4c4b7]/40 pb-3 flex flex-col gap-3">
      {/* Top Row: Welcome/Greeting & Property Select (Left) + Weather & Date/Time (Right) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 w-full">
        {/* Left Side: Property Dropdown */}
        <div>
          <p className="text-[10px] font-sans text-[#a65e52] tracking-widest uppercase mb-0.5 font-semibold">
            {getGreeting()}
          </p>
          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#d4c4b7]">
              <img src={selectedProperty.img} alt={selectedProperty.name} className="w-full h-full object-cover" />
            </div>
            
            <button 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <h2 className="text-2xl font-bold text-[#4a3c31] tracking-wide flex items-center gap-2">
                <span>{selectedProperty.name}</span>
                <span className="text-[#947b66] text-sm font-light">•</span>
                <span className="text-[#947b66] text-[10px] font-sans tracking-widest uppercase font-semibold">
                  {selectedProperty.location}
                </span>
              </h2>
              <AltArrowDown className={`text-[#947b66] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={16} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute top-10 left-11 mt-2 w-[320px] bg-[#fdfaf7] border border-[#d4c4b7] rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in flex flex-col">
                {/* Header label */}
                <div className="px-4 pt-3 pb-1 shrink-0">
                  <div className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider mb-2">Select Property</div>
                  {/* Search input */}
                  <div className="relative">
                    <Magnifer size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#947b66]" />
                    <input
                      ref={searchRef}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search property…"
                      className="w-full pl-8 pr-3 py-1.5 text-[11px] border border-[#d4c4b7] rounded-lg bg-[#f3eae1]/60 text-[#4a3c31] placeholder-[#b9a898] focus:outline-none focus:ring-1 focus:ring-[#947b66] transition"
                    />
                  </div>
                </div>

                {/* Scrollable list */}
                <div className="overflow-y-auto custom-scrollbar max-h-[280px] px-2 pb-2 pt-1">
                  {filtered.length > 0 ? filtered.map((prop: any) => (
                    <button
                      key={prop.id}
                      onClick={() => { onPropertyChange(prop); setIsOpen(false); setSearch(''); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f3eae1] transition-colors text-left ${selectedProperty.id === prop.id ? 'bg-[#f3eae1]' : ''}`}
                    >
                      <img src={prop.img} alt={prop.name} className="w-8 h-8 rounded-full object-cover border border-[#d4c4b7] shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-[#4a3c31] leading-none">{prop.name}</div>
                        <div className="text-[10px] text-[#8c6b4f] mt-1">{prop.location}</div>
                      </div>
                      {selectedProperty.id === prop.id && (
                        <span className="ml-auto shrink-0 w-4 h-4 rounded-full bg-[#657454]/20 border border-[#657454]/40 flex items-center justify-center">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#657454" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                    </button>
                  )) : (
                    <div className="px-3 py-4 text-center text-[11px] text-[#b9a898] italic">No properties found</div>
                  )}
                </div>

                {/* Footer count */}
                <div className="px-4 py-2 border-t border-[#d4c4b7]/50 bg-[#f3eae1]/30 shrink-0">
                  <span className="text-[9px] text-[#b9a898]">
                    {filtered.length} of {propertiesList.length} properties
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Weather & Date/Time */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Compact Weather Pill */}
          <div className="flex items-center gap-2 bg-[#f3eae1]/60 px-3 py-1.5 rounded-lg border border-[#d4c4b7]/50 text-right">
            <CloudSnowfall size={16} className="text-[#947b66]" />
            <span className="text-[9px] font-bold text-[#4a3c31] uppercase tracking-wider">-2°C · Light Snow</span>
          </div>
          
          {/* Date & Time */}
          <div className="text-right shrink-0">
            <p className="text-[10px] text-[#4a3c31] font-semibold">{date}</p>
            <p className="text-[9px] text-[#947b66]">{time} · {tz}</p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Date Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex flex-col relative">
          <span className="text-[#6A5848] text-[8.5px] font-bold tracking-wider uppercase mb-1">Date Range</span>
          <div className="relative">
            <DatePicker
              portalId="datepicker-portal"
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={onDateChange}
              dateFormat="MMM d, yyyy"
              className="bg-[#f3eae1]/60 border border-[#d4c4b7] text-[#4a3c31] text-[10px] rounded-md pl-3 pr-8 py-1.5 w-[180px] focus:outline-none focus:ring-1 focus:ring-[#947b66] font-medium"
            />
            <Calendar size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#947b66] pointer-events-none" />
          </div>
        </div>
        
        <div className="flex flex-col relative">
          <span className="text-[#6A5848] text-[8.5px] font-bold tracking-wider uppercase mb-1">Comparison</span>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a3c31] font-medium text-[10px] pointer-events-none z-10">
              vs.
            </div>
            <DatePicker
              portalId="datepicker-portal"
              selectsRange={true}
              startDate={compStartDate}
              endDate={compEndDate}
              onChange={onCompDateChange}
              dateFormat="MMM d, yyyy"
              className="bg-[#f3eae1]/60 border border-[#d4c4b7] text-[#4a3c31] text-[10px] rounded-md pl-8 pr-8 py-1.5 w-[210px] focus:outline-none focus:ring-1 focus:ring-[#947b66] font-medium"
            />
            <Calendar size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#947b66] pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
