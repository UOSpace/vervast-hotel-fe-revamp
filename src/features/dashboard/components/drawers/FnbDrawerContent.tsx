interface FnbDrawerContentProps {
  config: {
    title?: string;
    data?: any;
  };
}

export function FnbDrawerContent({ config }: FnbDrawerContentProps) {
  const detailKey = config.data?.key || '';

  if (detailKey === 'EXP_BOOKINGS_OVER_TIME') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Daily trend of curated experience bookings and guest satisfaction rating MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            96.8% Avg Completion Rate
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Date</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Confirmed Bookings</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Completion Rate</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Guest CSAT</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'May 1', val: 380, pct: '95%', rate: '4.85 / 5.0' },
                { date: 'May 8', val: 530, pct: '97%', rate: '4.78 / 5.0' },
                { date: 'May 15', val: 410, pct: '94%', rate: '4.82 / 5.0' },
                { date: 'May 22', val: 680, pct: '96%', rate: '4.91 / 5.0' },
                { date: 'May 29', val: 610, pct: '95%', rate: '4.75 / 5.0' },
                { date: 'May 31', val: 892, pct: '98%', rate: '4.94 / 5.0' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.date}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.val}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.pct}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'EXP_BY_CATEGORY') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Experience categories volume and ancillary revenue contribution MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Total Revenue: $234,445
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Category</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Active Offerings</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Total Bookings</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Revenue Share</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Total Revenue (USD)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Water & Marine Expeditions', items: 8, bookings: 596, share: '38.1%', rev: '$89,400' },
                { cat: 'Private & Bespoke Charters', items: 4, bookings: 149, share: '15.9%', rev: '$37,250' },
                { cat: 'Nature & High Alpine Adventures', items: 12, bookings: 447, share: '16.2%', rev: '$37,995' },
                { cat: 'Wellness & Mindfulness Rituals', items: 10, bookings: 280, share: '14.3%', rev: '$33,600' },
                { cat: 'Artisanal & Local Culture', items: 6, bookings: 317, share: '13.5%', rev: '$31,700' },
                { cat: 'Other Curated Activities', items: 5, bookings: 75, share: '2.0%', rev: '$4,500' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.cat}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.items}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.bookings}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.share}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'TOP_EXPERIENCES_DETAIL' || detailKey === 'TOTAL_EXPERIENCES') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Top ranked guest experiences by reservation volume and realized yield MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Top 5 Experiences
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Rank</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Experience Name</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Category</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Ticket</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Bookings</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: 'Sunset Catamaran Cruise', cat: 'Water & Marine', ticket: '$150', bookings: 312, rev: '$46,800' },
                { rank: 2, name: 'Private Sandbank Picnic & Snorkel', cat: 'Water & Marine', ticket: '$150', bookings: 278, rev: '$41,700' },
                { rank: 3, name: 'Holistic Alpine Wellness Journey', cat: 'Wellness & Mindfulness', ticket: '$150', bookings: 212, rev: '$31,800' },
                { rank: 4, name: 'Ancient Forest Botanical Hike', cat: 'Nature & Adventure', ticket: '$50', bookings: 246, rev: '$12,300' },
                { rank: 5, name: 'Artisan Pottery & Tea Masterclass', cat: 'Cultural & Local', ticket: '$100', bookings: 184, rev: '$18,400' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-zinc-400">#{row.rank}</td>
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-zinc-500 text-[11px]">{row.cat}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.ticket}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.bookings}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'EXP_REVENUE_PROPERTY') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Experiences revenue breakdown across all 6 resort collections.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Total MTD: $213,440
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Collection</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Active Offerings</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">MTD Bookings</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Ticket</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prop: 'Sosei Beach Resort Collection', items: 12, bookings: 780, ticket: '$100.79', rev: '$78,620' },
                { prop: 'Sosei Sky Collection', items: 15, bookings: 510, ticket: '$106.49', rev: '$54,310' },
                { prop: 'Sosei Wellness Collection', items: 10, bookings: 360, ticket: '$98.50', rev: '$35,460' },
                { prop: 'Sosei Nature Collection', items: 10, bookings: 320, ticket: '$98.12', rev: '$31,400' },
                { prop: 'SoSei Urban Collection', items: 6, bookings: 160, ticket: '$92.00', rev: '$14,720' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.prop}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.items}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.bookings}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.ticket}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'FNB_REVENUE_OVER_TIME') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">F&B weekly revenue trend and sub-channel performance MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Total MTD: $512,400
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Date Period</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Fine Dining</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Casual Dining</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Bars & Lounges</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">In-Villa Dining</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'May 1 – May 7', fine: '$35,400', casual: '$22,100', bar: '$18,400', room: '$10,200', total: '$86,100' },
                { date: 'May 8 – May 14', fine: '$40,200', casual: '$24,500', bar: '$19,200', room: '$11,500', total: '$95,400' },
                { date: 'May 15 – May 21', fine: '$38,700', casual: '$21,800', bar: '$17,900', room: '$9,800', total: '$88,200' },
                { date: 'May 22 – May 28', fine: '$45,800', casual: '$28,300', bar: '$22,400', room: '$14,100', total: '$110,600' },
                { date: 'May 29 – May 31', fine: '$52,100', casual: '$32,400', bar: '$26,800', room: '$20,800', total: '$132,100' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.date}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.fine}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.casual}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.bar}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.room}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'FNB_REVENUE_OUTLET' || detailKey === 'TOTAL_FNB_REVENUE') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">F&B outlet metrics, covers serviced and check averages MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Total Outlets Rev: $512,450
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Outlet Name</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Covers</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Average Check</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Beverage Share</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Seascape Restaurant (SOSEI Ocean)', covers: '3,200', check: '$58.25', share: '35%', rev: '$186,420' },
                { name: 'Terra Pavilion (SOSEI Alpine)', covers: '2,840', check: '$39.57', share: '20%', rev: '$112,380' },
                { name: 'Alpine Grill (SOSEI Alpine)', covers: '1,980', check: '$42.80', share: '45%', rev: '$84,760' },
                { name: 'The Tea Lounge (SOSEI City)', covers: '1,540', check: '$39.76', share: '55%', rev: '$61,240' },
                { name: 'In-Villa Private Dining (All Properties)', covers: '980', check: '$47.76', share: '15%', rev: '$46,810' },
                { name: 'Poolside Ocean Bar (SOSEI Ocean)', covers: '1,200', check: '$17.36', share: '70%', rev: '$20,840' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.covers}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.check}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.share}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'TOP_OUTLETS_PERFORMANCE') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Top performing F&B outlets based on RevPAS (Revenue Per Available Seat) MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Efficiency Ranking
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Outlet Name</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Collection</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Capacity (Seats)</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">RevPAS</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Seat Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Seascape Restaurant', prop: 'SOSEI Ocean', cap: 80, revpas: '$245', occ: '88%' },
                { name: 'Terra Pavilion', prop: 'SOSEI Alpine', cap: 120, revpas: '$198', occ: '74%' },
                { name: 'Alpine Grill', prop: 'SOSEI Alpine', cap: 90, revpas: '$176', occ: '70%' },
                { name: 'The Tea Lounge', prop: 'SOSEI City', cap: 60, revpas: '$142', occ: '62%' },
                { name: 'Poolside Ocean Bar', prop: 'SOSEI Ocean', cap: 100, revpas: '$118', occ: '65%' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-zinc-500 text-[11px]">{row.prop}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.cap}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-bold">{row.revpas}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100">{row.occ}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'FNB_MIX_BREAKDOWN_DETAIL') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">F&B product mix contribution breakdown MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Total Revenue: $512,450
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Category</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Covers</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Average Spend</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Food Rev</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Beverage Rev</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Food (62.0%)', covers: '8,400', check: '$37.82', food: '$317,719', bev: '$0', total: '$317,719' },
                { cat: 'Beverage (23.0%)', covers: '5,200', check: '$22.66', food: '$0', bev: '$117,863', total: '$117,863' },
                { cat: 'In-Villa Dining (10.0%)', covers: '980', check: '$52.30', food: '$41,000', bev: '$10,245', total: '$51,245' },
                { cat: 'Events & Private (5.0%)', covers: '320', check: '$80.08', food: '$20,500', bev: '$5,123', total: '$25,623' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.cat}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.covers}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.check}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.food}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.bev}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'PEAK_HOURS_OUTLET') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Average covers serviced during peak meal intervals across outlets.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Peak Operational Windows
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Outlet Name</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Breakfast Peak</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Lunch Peak</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Dinner Peak</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Seascape Restaurant', bfast: '120 covers (9 AM)', lunch: '280 covers (12 PM)', dinner: '340 covers (7 PM)' },
                { name: 'Terra Pavilion', bfast: '350 covers (8 AM)', lunch: '410 covers (1 PM)', dinner: '480 covers (7 PM)' },
                { name: 'Alpine Grill', bfast: 'Continental only', lunch: '180 covers (1 PM)', dinner: '320 covers (8 PM)' },
                { name: 'The Tea Lounge', bfast: '80 covers (9 AM)', lunch: '120 covers (3 PM)', dinner: '150 covers (5 PM)' },
                { name: 'Poolside Ocean Bar', bfast: 'Beverage only', lunch: '220 covers (1 PM)', dinner: '180 covers (6 PM)' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.bfast}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.lunch}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.dinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'EXP_CONVERSION_FUNNEL') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Conversion funnel progression from digital portal previews to attended experiences.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            44.8% End-to-End Conversion
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Conversion Funnel Step</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Volume</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Step Conversion Rate</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Luxury Benchmark</th>
              </tr>
            </thead>
            <tbody>
              {[
                { step: '1. Experiences Viewed', vol: '3,842 views', conv: '100%', bench: '100% (Baseline)' },
                { step: '2. Added to Wishlist', vol: '1,926 additions', conv: '50.1%', bench: '45.0%' },
                { step: '3. Concierge Inquiries', vol: '1,102 inquiries', conv: '57.2%', bench: '48.0%' },
                { step: '4. Bookings Confirmed', vol: '1,864 bookings', conv: '48.5%', bench: '40.0%' },
                { step: '5. Completed & Attended', vol: '1,720 completed', conv: '92.3%', bench: '95.0%' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.step}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.vol}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.conv}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-zinc-500 text-[10px]">{row.bench}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'EXP_TYPE_PERFORMANCE') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Performance matrix and Net Promoter Score (NPS) by experience category.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Portfolio NPS: +81
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Experience Category</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Rating</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">NPS Score</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Certified Masters</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Private & Bespoke Charters', score: '4.92 / 5.0', nps: '+88', guides: 4 },
                { name: 'Wellness & Mindfulness Rituals', score: '4.86 / 5.0', nps: '+84', guides: 10 },
                { name: 'Water & Marine Expeditions', score: '4.82 / 5.0', nps: '+82', guides: 12 },
                { name: 'Nature & High Alpine Adventures', score: '4.74 / 5.0', nps: '+78', guides: 8 },
                { name: 'Artisanal & Local Culture', score: '4.68 / 5.0', nps: '+75', guides: 6 },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.score}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.nps}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.guides} Guides</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'UPCOMING_HIGHLIGHTS_DETAIL') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Upcoming signature dining events and exclusive sanctuary highlight experiences.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Next 14 Days
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Date & Time</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Highlight Event Name</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Collection</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Booked / Capacity</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'Jun 2, 7:00 PM', name: 'Full Moon Sandbank Gala', location: 'SOSEI Ocean', cap: '24 / 24 seats', status: 'Fully Booked', statusColor: 'emerald' },
                { date: 'Jun 4, 6:30 AM', name: 'Glacier Sunrise Yoga & Tea', location: 'SOSEI Alpine', cap: '18 / 20 seats', status: 'Almost Full', statusColor: 'amber' },
                { date: 'Jun 7, 7:00 PM', name: 'Michelin Guest Chef Omakase', location: 'SOSEI Ocean', cap: '12 / 12 seats', status: 'Fully Booked', statusColor: 'emerald' },
                { date: 'Jun 12, 10:00 AM', name: 'Coral Restoration & Reef Safari', location: 'SOSEI Ocean', cap: '15 / 30 seats', status: 'Open for Booking', statusColor: 'zinc' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 text-zinc-500 text-[11px]">{row.date}</td>
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-300 text-[11px]">{row.location}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-zinc-700 dark:text-zinc-300">{row.cap}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${row.statusColor === 'emerald'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : row.statusColor === 'amber'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                      }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'AVERAGE_SPEND') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Average guest spend realization per day by resort property MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Portfolio Avg: $232 / Guest / Day
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Collection</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">F&B Average Spend</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Activities Average Spend</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Combined Ancillary Spend</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Sosei Beach Resort Collection', fnb: '$165', act: '$112', combined: '$277' },
                { name: 'Sosei Sky Collection', fnb: '$150', act: '$98', combined: '$248' },
                { name: 'Sosei Wellness Collection', fnb: '$140', act: '$95', combined: '$235' },
                { name: 'Sosei Nature Collection', fnb: '$120', act: '$72', combined: '$192' },
                { name: 'SoSei Urban Collection', fnb: '$110', act: '$55', combined: '$165' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.fnb}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.act}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.combined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'SUNSET_INSIGHT') {
    return (
      <div className="space-y-4 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <p className="text-xs text-zinc-500">Sunset experiences analysis: Driving 34% of total experience revenue.</p>
        <div className="p-4 border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30 space-y-2">
          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Sunset Cruise Yield & Performance</h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The Sunset Catamaran Cruise continues to be the highest performing single experiential item in the SOSEI portfolio.
            With an average ticket price of $150 per person and a 92% capacity load factor on weekends, it generates significant high-margin beverage revenue.
          </p>
        </div>
      </div>
    );
  }

  if (detailKey === 'INVILLA_INSIGHT') {
    return (
      <div className="space-y-4 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <p className="text-xs text-zinc-500">In-villa dining analysis: +21% MoM surge in bespoke private dining orders.</p>
        <div className="p-4 border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30 space-y-2">
          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Digital Butler & Bespoke Menu Expansion</h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The recent deployment of in-villa digital butler ordering and personalized omakase supper options has increased check sizes by 28% and reduced delivery turnaround times to under 22 minutes.
          </p>
        </div>
      </div>
    );
  }

  if (detailKey === 'WEEKEND_INSIGHT') {
    return (
      <div className="space-y-4 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <p className="text-xs text-zinc-500">Weekend dining analysis: Premium tasting dinners drive peak ancillary contribution.</p>
        <div className="p-4 border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30 space-y-2">
          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Saturday Fine Dining Peak</h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Saturday dinner service contributes 42% of total weekly fine-dining revenue across all resort outlets, with wine pairings driving an additional $65 average check uplift.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-xs text-zinc-500 italic p-4 text-center">
      Detailed operational statistics and reporting available for {config.title || 'F&B Experience'}.
    </div>
  );
}
