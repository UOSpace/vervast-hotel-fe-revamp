import { PieChart, Pie, Cell, Tooltip } from 'recharts';

export function SharedDonutChart({ data, total }: { data: { name: string; value: number; color: string }[]; total: string }) {
  return (
    <div className="relative w-[90px] h-[90px] shrink-0">
      <PieChart width={90} height={90}>
        <Pie data={data} cx={42} cy={42} innerRadius={28} outerRadius={42} dataKey="value" strokeWidth={0}>
          {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip formatter={(v: any) => `${v}%`} />
      </PieChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[9px] font-bold text-[#4a3c31] leading-none">{total}</div>
        <div className="text-[7px] text-[#7d6b5e]">Rnights</div>
      </div>
    </div>
  );
}
