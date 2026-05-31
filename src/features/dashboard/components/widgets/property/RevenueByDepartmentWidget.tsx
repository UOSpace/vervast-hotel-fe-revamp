export function RevenueByDepartmentWidget() {
  const data = [
    { dept: 'Rooms', today: '$52,340', trend: '↑ 9%', up: true },
    { dept: 'F&B', today: '$18,720', trend: '↑ 7%', up: true },
    { dept: 'Spa & Wellness', today: '$5,980', trend: '↑ 12%', up: true },
    { dept: 'Other Income', today: '$1,420', trend: '↑ 5%', up: true },
  ];

  const totals = { today: '$78,460', trend: '↑ 8%', up: true };

  return (
    <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col backdrop-blur-sm bg-[#f3eae1]/0 animate-card-enter" style={{ animationDelay: '0.25s' }}>
      <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e] mb-4">REVENUE BY DEPARTMENT (USD)</div>

      <div className="flex flex-col text-xs text-[#4a3c31] h-full justify-between pb-1">
        <div>
          {/* Header */}
          <div className="grid grid-cols-[45%_35%_20%] mb-2 pb-2 border-b border-[#d4c4b7]/50 font-bold">
            <div>Department</div>
            <div className="text-right">Today</div>
            <div className="text-right">vs yesterday</div>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-3 mt-3">
            {data.map((row) => (
              <div key={row.dept} className="grid grid-cols-[45%_35%_20%] items-center">
                <div>{row.dept}</div>
                <div className="text-right">{row.today}</div>
                <div className={`text-right ${row.up ? 'text-[#657454]' : 'text-[#a65e52]'}`}>{row.trend}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer / Total */}
        <div className="grid grid-cols-[45%_35%_20%] items-center mt-4 pt-3 border-t border-[#d4c4b7]/50 font-bold">
          <div>Total</div>
          <div className="text-right">{totals.today}</div>
          <div className={`text-right ${totals.up ? 'text-[#657454]' : 'text-[#a65e52]'}`}>{totals.trend}</div>
        </div>
      </div>
    </div>
  );
}
