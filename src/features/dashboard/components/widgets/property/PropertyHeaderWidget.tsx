import { useState, useRef, useEffect } from 'react';
import { CloudSnowfall, Calendar, AltArrowDown } from '@solar-icons/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function PropertyHeaderWidget({ 
  startDate, endDate, onDateChange,
  compStartDate, compEndDate, onCompDateChange,
  selectedProperty, onPropertyChange, propertiesList
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="w-full flex justify-between items-start pt-4 lg:pt-6 mb-4">
      {/* Left Side */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#d4c4b7]">
            <img src={selectedProperty.img} alt={selectedProperty.name} className="w-full h-full object-cover" />
          </div>
          
          <button 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <h1 className="text-4xl font-serif text-[#4a3c31] flex items-center gap-3">
              {selectedProperty.name} <span className="text-[#8c6b4f] text-2xl">•</span> <span className="text-[#8c6b4f] text-2xl">{selectedProperty.location}</span>
            </h1>
            <AltArrowDown className={`text-[#8c6b4f] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={24} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-14 left-14 mt-2 w-[320px] bg-[#fdfaf7] border border-[#d4c4b7] rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
              <div className="p-3 flex flex-col gap-1">
                <div className="text-[10px] font-bold text-[#7d6b5e] uppercase tracking-wider mb-1 px-3 pt-1">Select Property</div>
                {propertiesList.map((prop: any) => (
                  <button
                    key={prop.id}
                    onClick={() => { onPropertyChange(prop); setIsOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f3eae1] transition-colors text-left ${selectedProperty.id === prop.id ? 'bg-[#f3eae1]' : ''}`}
                  >
                    <img src={prop.img} alt={prop.name} className="w-8 h-8 rounded-full object-cover border border-[#d4c4b7]" />
                    <div>
                      <div className="text-sm font-bold text-[#4a3c31] leading-none">{prop.name}</div>
                      <div className="text-[10px] text-[#8c6b4f] mt-1">{prop.location}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col relative">
            <span className="text-[#6A5848] text-[9px] font-bold mb-1">Date Range</span>
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
            <span className="text-[#6A5848] text-[9px] font-bold mb-1">Comparison</span>
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

      {/* Right Side - Weather */}
      <div className="flex items-center gap-4 bg-[#f3eae1]/60 backdrop-blur-sm p-3 rounded-xl border border-[#d4c4b7]">
        <CloudSnowfall size={32} className="text-[#8c6b4f]" />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-[#4a3c31]">-2°C | Light Snow</span>
          <span className="text-xs text-[#6A5848]">Local time 9:42 AM</span>
        </div>
      </div>
    </div>
  );
}
