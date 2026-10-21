import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getPortfolioMetrics, getPropertyIdsByCategory, fmtInt } from '@/data/portfolio';

interface GuestMovementDrawerContentProps {
  theme?: string;
}

export function GuestMovementDrawerContent({ theme }: GuestMovementDrawerContentProps) {
  const collections = [
    { id: 'ski' as const, name: 'Ski', collection: 'SOSEI Ski (Courchevel, Niseko, Aspen)' },
    { id: 'beach-resort' as const, name: 'Beach Resort', collection: 'SOSEI Beach Resort (Amalfi, Los Cabos, Muscat, Sumba, Seychelles)' },
    { id: 'urban' as const, name: 'Urban', collection: 'SOSEI Urban (Geneva, Marrakech)' },
    { id: 'nature' as const, name: 'Nature', collection: 'SOSEI Nature (Patagonia, Serengeti)' },
    { id: 'wellness' as const, name: 'Wellness', collection: 'SOSEI Wellness (Kyoto, AlUla)' },
  ];

  const movementData = collections.map((c) => {
    const m = getPortfolioMetrics(getPropertyIdsByCategory([c.id]), 'today');
    const inHouse = m.avgDailyInHouseGuests;
    const arr = m.avgDailyArrivals;
    const dep = Math.max(4, Math.round(arr * 0.88));
    const vip = Math.max(4, Math.round(inHouse * 0.08));
    return {
      name: c.name,
      arr,
      in: inHouse,
      dep,
      vip,
      collection: c.collection,
    };
  });

  const totIn = movementData.reduce((s, r) => s + r.in, 0);
  const totArr = movementData.reduce((s, r) => s + r.arr, 0);
  const totDep = movementData.reduce((s, r) => s + r.dep, 0);
  const totVip = movementData.reduce((s, r) => s + r.vip, 0);

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <p className="text-xs text-zinc-500 font-normal">Real-time arrivals, in-house headcount, and scheduled departures across all 5 collections (14 global properties).</p>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
          Total In-House: {fmtInt(totIn)} Guests
        </span>
      </div>

      <div className="h-[220px] w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={movementData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#27272a' : '#f4f4f5'} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: theme === 'dark' ? '#a1a1aa' : '#71717a' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: theme === 'dark' ? '#a1a1aa' : '#71717a' }} width={40} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7',
                borderRadius: '8px',
                fontSize: '11px',
                color: theme === 'dark' ? '#fafafa' : '#09090b',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            />
            <Bar dataKey="in" name="In-House" fill={theme === 'dark' ? '#fafafa' : '#18181b'} radius={[4, 4, 0, 0]} />
            <Bar dataKey="arr" name="Expected Arrivals" fill="#059669" radius={[4, 4, 0, 0]} />
            <Bar dataKey="dep" name="Scheduled Departures" fill="#71717a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
          <thead className="bg-zinc-50/90 dark:bg-zinc-800/90">
            <tr className="text-left text-zinc-400">
              <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Property Categories</th>
              <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">In-House Guests</th>
              <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Arrivals Today</th>
              <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Departures Today</th>
              <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Net Movement</th>
              <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">VIP Guests</th>
            </tr>
          </thead>
          <tbody>
            {movementData.map((row) => (
              <tr key={row.name} className="border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.collection}</td>
                <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100">{fmtInt(row.in)}</td>
                <td className="py-2.5 px-3 text-right text-emerald-700 font-medium">+{fmtInt(row.arr)}</td>
                <td className="py-2.5 px-3 text-right text-zinc-500 font-medium">-{fmtInt(row.dep)}</td>
                <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">+{fmtInt(row.arr - row.dep)}</td>
                <td className="py-2.5 px-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">{row.vip}</td>
              </tr>
            ))}
            <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
              <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total Portfolio (14 Properties)</td>
              <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{fmtInt(totIn)}</td>
              <td className="py-3 px-3 text-right text-emerald-700">+{fmtInt(totArr)}</td>
              <td className="py-3 px-3 text-right text-zinc-500">-{fmtInt(totDep)}</td>
              <td className="py-3 px-3 text-right font-bold text-emerald-700">+{fmtInt(totArr - totDep)}</td>
              <td className="py-3 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{totVip} VIPs</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
