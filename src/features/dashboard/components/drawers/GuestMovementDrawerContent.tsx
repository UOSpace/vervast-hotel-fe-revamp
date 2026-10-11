import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface GuestMovementDrawerContentProps {
  theme?: string;
}

export function GuestMovementDrawerContent({ theme }: GuestMovementDrawerContentProps) {
  const movementData = [
    { name: 'Sky', arr: 145, in: 580, dep: 95, vip: 18, collection: 'Sosei Sky (Switzerland & Finland)' },
    { name: 'Beach Resort', arr: 110, in: 520, dep: 80, vip: 14, collection: 'Sosei Beach Resort (Maldives & Bali)' },
    { name: 'Urban', arr: 160, in: 640, dep: 120, vip: 22, collection: 'SoSei Urban (New York & Los Angeles)' },
    { name: 'Nature', arr: 120, in: 597, dep: 85, vip: 16, collection: 'Sosei Nature (Tuscany, Provence & Kyoto)' },
    { name: 'Wellness', arr: 100, in: 510, dep: 75, vip: 16, collection: 'Sosei Wellness (Chiang Mai, Siwa & Al Hajar)' },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <p className="text-xs text-zinc-500 font-normal">Real-time arrivals, in-house headcount, and scheduled departures across all 5 collections.</p>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
          Total In-House: 2,847 Guests
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
              <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Property Collection</th>
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
                <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100">{row.in}</td>
                <td className="py-2.5 px-3 text-right text-emerald-700 font-medium">+{row.arr}</td>
                <td className="py-2.5 px-3 text-right text-zinc-500 font-medium">-{row.dep}</td>
                <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">+{row.arr - row.dep}</td>
                <td className="py-2.5 px-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">{row.vip}</td>
              </tr>
            ))}
            <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
              <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total Portfolio (12 Sanctuaries)</td>
              <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">2,847</td>
              <td className="py-3 px-3 text-right text-emerald-700">+535</td>
              <td className="py-3 px-3 text-right text-zinc-500">-455</td>
              <td className="py-3 px-3 text-right font-bold text-emerald-700">+80</td>
              <td className="py-3 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">84 VIPs</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
