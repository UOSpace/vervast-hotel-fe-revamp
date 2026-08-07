import dashboardData from '../../../../data/dashboardData.json';

export function PortfolioPerformanceWidget() {
  const data = dashboardData.portfolioPerformance;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex-1 flex flex-col justify-between py-1 space-y-1">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-[10px]">
            <span className="text-[#4a3c31] font-normal">{item.label}</span>
            <div className="flex space-x-3 justify-end items-center">
              <span className="font-semibold text-[#4a3c31]">{item.value}</span>
              <span className={`w-8 text-right ${item.up ? 'text-[#15803d]' : 'text-[#b91c1c]'}`}>{item.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
