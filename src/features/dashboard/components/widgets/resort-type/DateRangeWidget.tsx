import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from '@solar-icons/react';

export function DateRangeWidget({ 
  startDate, endDate, setStartDate, setEndDate,
  compStartDate, compEndDate, setCompStartDate, setCompEndDate
}: any) {
  return (
    <div className="flex gap-4 items-center animate-card-enter mt-2 mb-1" style={{ animationDelay: '0.1s' }}>
      <div className="flex flex-col relative">
        <div className="text-[9px] font-bold text-[#4a3c31] mb-1">Date Range</div>
        <div className="relative">
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
            className="bg-[#f3eae1]/60 border border-[#d4c4b7] text-[#4a3c31] text-[10px] rounded-md pl-3 pr-8 py-1.5 w-[180px] focus:outline-none focus:ring-1 focus:ring-[#947b66] font-medium"
          />
          <Calendar size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#947b66] pointer-events-none" />
        </div>
      </div>
      
      <div className="flex flex-col relative">
        <div className="text-[9px] font-bold text-[#4a3c31] mb-1">Comparison</div>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a3c31] font-medium text-[10px] pointer-events-none z-10">
            vs.
          </div>
          <DatePicker
            portalId="datepicker-portal"
            selectsRange={true}
            startDate={compStartDate}
            endDate={compEndDate}
            onChange={(update: [Date | null, Date | null]) => {
              setCompStartDate(update[0]);
              setCompEndDate(update[1]);
            }}
            dateFormat="MMM d, yyyy"
            className="bg-[#f3eae1]/60 border border-[#d4c4b7] text-[#4a3c31] text-[10px] rounded-md pl-8 pr-8 py-1.5 w-[210px] focus:outline-none focus:ring-1 focus:ring-[#947b66] font-medium"
          />
          <Calendar size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#947b66] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
