import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const donutData = [
  { name: 'Rooms', value: 4.2, color: '#C8A050' },
  { name: 'Value', value: 4.5, color: '#947b66' },
  { name: 'Cleanliness', value: 4.5, color: '#657454' },
  { name: 'Service', value: 4.6, color: '#586981' },
  { name: 'Sleep Quality', value: 4.5, color: '#8b6b7a' },
];

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block ml-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
      <span className="cursor-help text-[#7d6b5e]/60 hover:text-[#C8A050] transition-colors text-[9px] border border-[#7d6b5e]/30 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center font-bold font-sans">
        ?
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-[#4a3c31] text-[#fdfaf7] text-[9.5px] rounded p-2 shadow-xl z-[90] pointer-events-none leading-normal font-normal normal-case tracking-normal text-left">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#4a3c31]" />
      </div>
    </div>
  );
}

export function SentimentScoreWidget() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-2">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31]">Sentiment Score</h3>
            <p className="text-[10px] text-[#7d6b5e]">MTD AVERAGE</p>
          </div>
          <InfoTooltip text="Average score based on guest survey feedback across Rooms, Value, Cleanliness, Service, and Sleep Quality." />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <div className="relative w-[144px] h-[144px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={55}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="flex items-baseline justify-center">
              <span className="text-2xl font-bold text-[#4a3c31]">4.8</span>
              <span className="text-[10px] text-[#7d6b5e]">/5</span>
            </div>
            <span className="text-[10px] text-[#4a3c31]">Excellent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
