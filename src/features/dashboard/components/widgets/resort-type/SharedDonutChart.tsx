import { PieChart, Pie, Cell, Tooltip } from 'recharts';

export function SharedDonutChart({ data, total }: { data: { name: string; value: number; color: string }[]; total: string }) {
  const size = 110;
  const center = size / 2;

  return (
    <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      <PieChart width={size} height={size} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={data}
          cx={center}
          cy={center}
          innerRadius={34}
          outerRadius={48}
          dataKey="value"
          strokeWidth={0}
          isAnimationActive={false}
        >
          {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip formatter={(v: any) => `${v}%`} />
        <text x={center} y={center - 5} textAnchor="middle" dominantBaseline="central" fill="#18181b" className="text-[11px] font-bold">
          {total}
        </text>
        <text x={center} y={center + 8} textAnchor="middle" dominantBaseline="central" fill="#7d6b5e" className="text-[7.5px] font-medium tracking-wide">
          Rnights
        </text>
      </PieChart>
    </div>
  );
}
