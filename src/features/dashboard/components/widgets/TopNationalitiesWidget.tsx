import dashboardData from '../../../../data/dashboardData.json';

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

export function TopNationalitiesWidget() {
  const data = dashboardData.topNationalities;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31]">Top Nationalities</h3>
            <p className="text-[10px] text-[#7d6b5e]">MTD</p>
          </div>
          <InfoTooltip text="The distribution of guest origin countries based on check-ins MTD." />
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-2.5">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-[10px]">
            <span className="text-[#4a3c31]">{item.country}</span>
            <span className="text-[#4a3c31] font-semibold">{item.percentage}</span>
          </div>
        ))}
      </div>
      
      <div className="text-[9px] text-[#a65e52] font-semibold hover:underline mt-2 self-start cursor-pointer">
        See details →
      </div>
    </div>
  );
}
