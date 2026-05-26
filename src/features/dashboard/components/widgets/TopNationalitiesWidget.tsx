import dashboardData from '../../../../data/dashboardData.json';

export function TopNationalitiesWidget() {
  const data = dashboardData.topNationalities;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31]">Top Nationalities</h3>
        <p className="text-[10px] text-[#7d6b5e]">MTD</p>
      </div>

      <div className="flex-1 flex flex-col space-y-2.5">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-[10px]">
            <span className="text-[#4a3c31]">{item.country}</span>
            <span className="text-[#4a3c31] font-semibold">{item.percentage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
