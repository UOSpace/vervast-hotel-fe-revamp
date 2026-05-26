import dashboardData from '../../../../data/dashboardData.json';

export function PortfolioPerformanceWidget() {
  const data = dashboardData.portfolioPerformance;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31]">Portfolio Performance</h3>
        <p className="text-[10px] text-[#7d6b5e]">MTD (MONTH TO DATE)</p>
      </div>

      <div className="flex-1 flex flex-col space-y-2.5">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-[10px] pb-1">
            <span className="text-[#4a3c31]">{item.label}</span>
            <div className="flex space-x-4 w-24 justify-end">
              <span className="font-semibold text-[#4a3c31]">{item.value}</span>
              <span className={`w-8 text-right ${item.up ? 'text-[#657454]' : 'text-[#a65e52]'}`}>{item.trend}</span>
            </div>
          </div>
        ))}
        <p className="text-[9px] text-[#7d6b5e] pt-2">vs same period last month</p>
      </div>
    </div>
  );
}
