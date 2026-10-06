interface SpaDrawerContentProps {
  config: {
    title?: string;
    data?: any;
  };
}

export function SpaDrawerContent({ config }: SpaDrawerContentProps) {
  const detailKey = config.data?.key || '';

  if (detailKey === 'TOTAL_TREATMENTS') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Distribution of completed holistic spa treatments and guest satisfaction MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            1,178 Treatments Conducted
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Treatment Name</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Treatments Conducted</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Rating</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Deep Tissue Recovery Massage', count: 312, rating: '4.85 / 5.0', rev: '$71,448' },
                { name: 'Aromatherapy Sanctuary Massage', count: 248, rating: '4.78 / 5.0', rev: '$56,792' },
                { name: 'Signature Cellular Facial', count: 196, rating: '4.92 / 5.0', rev: '$44,884' },
                { name: 'Thermal Hot Stone Therapy', count: 154, rating: '4.82 / 5.0', rev: '$35,266' },
                { name: 'Alpine Detox Herbal Wrap', count: 98, rating: '4.70 / 5.0', rev: '$22,442' },
                { name: 'Balinese Healing Sound Ritual', count: 70, rating: '4.95 / 5.0', rev: '$16,030' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.count}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.rating}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'TREATMENT_REVENUE') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Treatment revenue contribution breakdown across all sanctuary collections MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Total Revenue: $286,450
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Sanctuary Collection</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Treatments Conducted</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Average Session Rate</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Sosei Ocean Collection (Maldives & Amalfi)', count: 480, rate: '$240', rev: '$115,200' },
                { name: 'Sosei Alpine Collection (St. Moritz & Zermatt)', count: 390, rate: '$235', rev: '$91,650' },
                { name: 'Sosei Forest Collection (Kyoto & Black Forest)', count: 180, rate: '$210', rev: '$37,800' },
                { name: 'Sosei Desert Collection (Al Wadi & Sedona)', count: 110, rate: '$200', rev: '$22,000' },
                { name: 'Sosei City Collection (Tokyo & New York)', count: 88, rate: '$225', rev: '$19,800' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.count}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.rate}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'AVERAGE_REVENUE') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Average realized rate per spa treatment session by collection.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Average Realized: $228
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Collection</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Standard Off-Peak</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Weekend Peak</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Average Realized Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Sosei Ocean Collection', standard: '$220', peak: '$260', realized: '$240' },
                { name: 'Sosei Alpine Collection', standard: '$215', peak: '$255', realized: '$235' },
                { name: 'Sosei City Collection', standard: '$210', peak: '$245', realized: '$225' },
                { name: 'Sosei Forest Collection', standard: '$195', peak: '$230', realized: '$210' },
                { name: 'Sosei Desert Collection', standard: '$180', peak: '$220', realized: '$200' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.standard}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.peak}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400">{row.realized}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'SPA_UTILIZATION') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Utilization capacity rates across specialized sanctuary spa zones MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Portfolio Avg: 68.2%
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Spa Zone</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Capacity (Hours/Day)</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Utilized Hours MTD</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Utilization Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                { zone: 'Private Treatment Suites', capacity: 96, hours: 2246, rate: '78%' },
                { zone: 'Thermal Hydro & Onsen Pools', capacity: 48, hours: 936, rate: '65%' },
                { zone: 'Zen Relaxation Lounges', capacity: 64, hours: 1190, rate: '62%' },
                { zone: 'Mindfulness & Movement Studio', capacity: 32, hours: 460, rate: '48%' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.zone}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.capacity} hrs/day</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.hours.toLocaleString()} hrs</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'THERAPIST_HOURS') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Therapist master roster efficiency and revenue generation MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Top Performing Masters
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Therapist Master</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Treatments</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Hours Clocked</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Utilization</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Ananda (Master Ayurveda)', count: 152, hours: 180, util: '82%', rev: '$36,480' },
                { name: 'Maya (Master Aesthetician)', count: 148, hours: 190, util: '78%', rev: '$34,120' },
                { name: 'Suri (Holistic Therapist)', count: 137, hours: 182, util: '75%', rev: '$31,750' },
                { name: 'Lina (Bodywork Specialist)', count: 130, hours: 180, util: '72%', rev: '$28,910' },
                { name: 'Pema (Sound Healing Master)', count: 124, hours: 182, util: '68%', rev: '$27,560' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.count}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.hours}h</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.util}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'RETAIL_REVENUE') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Wellness retail boutique performance and signature product turnover MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Total Retail Rev: $24,470
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Signature Product</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Units Sold</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Sosei Botanical Signature Elixir', units: 120, price: '$78.50', rev: '$9,420' },
                { name: 'Calm & Restore Night Balm', units: 148, price: '$41.95', rev: '$6,210' },
                { name: 'Himalayan Pink Mineral Soak', units: 162, price: '$30.00', rev: '$4,860' },
                { name: 'Sosei Mulberry Silk Eye Pillow', units: 88, price: '$45.20', rev: '$3,980' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.units}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.price}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'MEMBERSHIP_REPORT') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Wellness membership and sanctuary retreat packages sales analysis MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            $86,240 Total Package Sales
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Membership Tier & Package</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Active Patrons</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">MTD New Subscriptions</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Wellness Elite Sanctuary Club', members: 48, sales: 8, rev: '$32,000' },
                { cat: 'Signature Immersion (10 Sessions)', members: 120, sales: 34, rev: '$34,000' },
                { cat: 'Half-Day Escape Wellness Package', members: 160, sales: 30, rev: '$20,240' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.cat}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.members}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">+{row.sales}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'TOP_TREATMENTS_DETAIL') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Top 10 performing spa treatments ranked by volume and total yield, MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Top 10 Rankings
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Rank</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Treatment Name</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Sessions</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Rating</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Ticket</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: 'Deep Tissue Recovery Massage', count: 312, rating: '4.85', ticket: '$229', rev: '$71,448' },
                { rank: 2, name: 'Aromatherapy Sanctuary Massage', count: 248, rating: '4.78', ticket: '$229', rev: '$56,792' },
                { rank: 3, name: 'Signature Cellular Facial', count: 196, rating: '4.92', ticket: '$199', rev: '$39,004' },
                { rank: 4, name: 'Thermal Hot Stone Therapy', count: 154, rating: '4.80', ticket: '$259', rev: '$39,886' },
                { rank: 5, name: 'Alpine Detox Herbal Wrap', count: 98, rating: '4.68', ticket: '$249', rev: '$24,402' },
                { rank: 6, name: 'Couples Sanctuary Retreat', count: 72, rating: '4.94', ticket: '$399', rev: '$28,728' },
                { rank: 7, name: 'Himalayan Salt Glow Scrub', count: 68, rating: '4.75', ticket: '$219', rev: '$14,892' },
                { rank: 8, name: 'Prenatal Restorative Therapy', count: 44, rating: '4.90', ticket: '$219', rev: '$9,636' },
                { rank: 9, name: 'Tibetan Sound Healing Session', count: 36, rating: '4.88', ticket: '$179', rev: '$6,444' },
                { rank: 10, name: 'Acupressure Reflexology', count: 20, rating: '4.65', ticket: '$149', rev: '$2,980' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-zinc-400">#{row.rank}</td>
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.count}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.rating} / 5</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.ticket}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'REVENUE_BY_CATEGORY') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Treatment revenue breakdown by wellness category, MTD.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Total Revenue: $273,338
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Wellness Category</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Sessions</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Revenue Share</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Ticket</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Holistic Massages', sessions: 692, share: '56.6%', ticket: '$224', rev: '$154,808' },
                { cat: 'Advanced Facials', sessions: 270, share: '19.0%', ticket: '$192', rev: '$51,840' },
                { cat: 'Body Wraps & Scrubs', sessions: 180, share: '15.7%', ticket: '$238', rev: '$42,840' },
                { cat: 'Wellness & Sound Rituals', sessions: 82, share: '7.5%', ticket: '$249', rev: '$20,418' },
                { cat: 'Specialized Express Treatments', sessions: 24, share: '1.2%', ticket: '$143', rev: '$3,432' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.cat}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.sessions}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.share}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.ticket}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'UPCOMING_PEAK_TIMES') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">Forecasted high-demand wellness periods with therapist master availability.</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Booking Forecast
          </span>
        </div>
        <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Date</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Peak Window</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Demand Level</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Therapists On Duty</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Pre-Booked</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'May 31 (Fri)', window: '3:00 PM – 6:00 PM', level: 'Peak', avail: '6 / 8', booked: '78%' },
                { date: 'Jun 1 (Sat)', window: '10:00 AM – 1:00 PM', level: 'Peak', avail: '8 / 8', booked: '91%' },
                { date: 'Jun 2 (Sun)', window: '11:00 AM – 2:00 PM', level: 'Medium', avail: '7 / 8', booked: '62%' },
                { date: 'Jun 7 (Fri)', window: '4:00 PM – 7:00 PM', level: 'High', avail: '6 / 8', booked: '74%' },
                { date: 'Jun 8 (Sat)', window: '2:00 PM – 5:00 PM', level: 'Medium', avail: '8 / 8', booked: '55%' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.date}</td>
                  <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-300">{row.window}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      row.level === 'Peak'
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    }`}>
                      {row.level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-500">{row.avail}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400">{row.booked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (detailKey === 'GUEST_WELLNESS_INSIGHTS') {
    return (
      <div className="space-y-4 animate-fade-in text-zinc-900 dark:text-zinc-100">
        <p className="text-xs text-zinc-500">Wellness seekers represent 38% of total portfolio guests this month.</p>
        <div className="p-4 border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30 space-y-2">
          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Length of Stay & Ancillary Yield Correlation</h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Patrons participating in structured wellness retreats stay an average of 4.5 nights compared to 2.8 nights for standard leisure stays, producing a 62% higher total guest basket across dining and curated excursions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-xs text-zinc-500 italic p-4 text-center">
      Detailed statistics and operational metrics available for {config.title || 'Wellness & Spa'}.
    </div>
  );
}
