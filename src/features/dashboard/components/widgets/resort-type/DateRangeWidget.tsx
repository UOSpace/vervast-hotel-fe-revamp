import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from '@solar-icons/react';

export function DateRangeWidget({ 
  startDate, endDate, setStartDate, setEndDate
}: any) {
  return (
    <div className="flex items-center gap-2 animate-card-enter shrink-0" style={{ animationDelay: '0.1s' }}>
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
          placeholderText="Select date range"
          className="bg-white border border-[#e4e4e7] text-[#18181b] text-[10px] rounded-md pl-3 pr-8 py-1.5 w-[205px] focus:outline-none focus:ring-1 focus:ring-[#18181b] font-medium shadow-xs hover:border-gray-400 transition-all cursor-pointer"
        />
        <Calendar size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none" />
      </div>
    </div>
  );
}
