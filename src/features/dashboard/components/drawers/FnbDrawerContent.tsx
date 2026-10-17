interface FnbDrawerContentProps {
  config: {
    title?: string;
    data?: any;
  };
}

export function FnbDrawerContent({ config }: FnbDrawerContentProps) {
  const detailKey = typeof config.data === 'string' ? config.data : config.data?.key || '';
  const payload = typeof config.data === 'object' ? config.data : {};

  /* ───────────────────────── 1. HEADLINE KPIs & PORTFOLIO SNAPSHOT ───────────────────────── */
  if (detailKey === 'FNB_HEADLINE_KPI') {
    const kpiId = payload.kpiId || 'revenue';
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <div>
            <p className="text-xs text-zinc-500">
              Portfolio-wide commercial &amp; operational performance across all 10 SOSEI luxury resorts (68 operating F&amp;B outlets).
            </p>
          </div>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            Like-for-Like Comparable Basis · 10 Resorts
          </span>
        </div>

        {/* 5 Headline Summary Strip Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { id: 'revenue', label: 'F&B REV & LFL GROWTH', val: '$22.0M', sub: '+9.4% LFL vs LY' },
            { id: 'spend', label: 'SPEND / IN-HOUSE GUEST', val: '$296', sub: '$1,480 RevPOR (+8.0%)' },
            { id: 'capture', label: 'GUEST CAPTURE RATE', val: '68.4%', sub: '+4.2 pts · 1.84 Cvr/Guest' },
            { id: 'forward', label: 'FORWARD VS CAPACITY', val: '84.2%', sub: '48,500 Covers OTB (30D)' },
            { id: 'experience', label: 'GUEST EXPERIENCE', val: '94.8%', sub: '4.82 CSAT · 14m Recovery' },
          ].map((box) => (
            <div
              key={box.id}
              className={`p-3 rounded-xl border ${
                kpiId === box.id ? 'border-zinc-900 bg-zinc-100/80' : 'border-zinc-200/80 bg-zinc-50/40'
              }`}
            >
              <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">{box.label}</div>
              <div className="text-base font-bold text-zinc-900 mt-1">{box.val}</div>
              <div className="text-[9px] font-medium text-[#14532d] mt-0.5">{box.sub}</div>
            </div>
          ))}
        </div>

        {/* All 10 Resorts Commercial & Operational Ranking */}
        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Resort Property</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">SOSEI Collection</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">F&amp;B Revenue</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">LFL Growth</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">RevPOR</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Spend / Guest</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Capture Rate</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Seat Util</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">CSAT</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prop: 'SOSEI Maldives', model: 'SOSEI Beach Resort', rev: '$3.85M', lfl: '+14.2%', revpor: '$1,980', spend: '$412', cap: '86.4%', util: '91%', csat: '4.92', pos: true },
                { prop: 'SOSEI Switzerland', model: 'SOSEI Ski', rev: '$3.10M', lfl: '+11.8%', revpor: '$1,740', spend: '$348', cap: '79.2%', util: '87%', csat: '4.88', pos: true },
                { prop: 'SOSEI Tokyo', model: 'SOSEI Urban', rev: '$2.95M', lfl: '+10.5%', revpor: '$1,620', spend: '$318', cap: '64.0%', util: '89%', csat: '4.89', pos: true },
                { prop: 'SOSEI Bali', model: 'SOSEI Beach Resort', rev: '$2.40M', lfl: '+9.6%', revpor: '$1,490', spend: '$294', cap: '74.5%', util: '83%', csat: '4.85', pos: true },
                { prop: 'SOSEI Oman', model: 'SOSEI Wellness', rev: '$2.18M', lfl: '+7.9%', revpor: '$1,410', spend: '$268', cap: '88.0%', util: '84%', csat: '4.78', pos: true },
                { prop: 'SOSEI Japan', model: 'SOSEI Nature', rev: '$1.92M', lfl: '+8.4%', revpor: '$1,820', spend: '$365', cap: '82.1%', util: '86%', csat: '4.94', pos: true },
                { prop: 'SOSEI Costa Rica', model: 'SOSEI Nature', rev: '$1.75M', lfl: '-2.4%', revpor: '$1,120', spend: '$214', cap: '54.2%', util: '62%', csat: '4.68', pos: false },
                { prop: 'SOSEI Barcelona', model: 'SOSEI Urban', rev: '$1.65M', lfl: '+6.4%', revpor: '$1,240', spend: '$242', cap: '58.6%', util: '78%', csat: '4.76', pos: true },
                { prop: 'SOSEI Canada', model: 'SOSEI Ski', rev: '$1.18M', lfl: '+12.1%', revpor: '$1,680', spend: '$340', cap: '84.0%', util: '81%', csat: '4.90', pos: true },
                { prop: 'SOSEI Egypt', model: 'SOSEI Wellness', rev: '$1.02M', lfl: '+9.2%', revpor: '$1,890', spend: '$390', cap: '81.5%', util: '85%', csat: '4.87', pos: true },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 last:border-0 hover:bg-zinc-100/50 transition-colors">
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900">{row.prop}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500">{row.model}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">{row.rev}</td>
                  <td className={`py-2.5 px-3 text-[9.5px] font-medium text-right ${row.pos ? 'text-[#14532d]' : 'text-[#800020]'}`}>{row.lfl}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{row.revpor}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">{row.spend}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-700 text-right">{row.cap}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{row.util}</td>
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">{row.csat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 2. REVENUE CENTRE SCORECARDS (6 CENTRES) ───────────────────────── */
  if (detailKey === 'FNB_REVENUE_CENTRE_SCORECARD') {
    const selectedCentre = payload.centre || 'Fine & Specialty Dining';
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <div>
            <p className="text-xs text-zinc-500">
              Group-level view of the 6 F&amp;B revenue centres. Concept-level operating KPIs (service times, queue, ticket SLA) are managed in the Property View.
            </p>
          </div>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-zinc-900 text-white">
            Active Focus: {selectedCentre}
          </span>
        </div>

        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Revenue Centre</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">MTD Rev</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Core Commercial KPIs</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Executive Insight</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: 'Fine & Specialty Dining',
                  match: 'Fine & Specialty Dining',
                  rev: '$7.48M',
                  comm: '44.5K Covers · $168 Avg Check · 92% Reservation Conversion · 44% Tasting Uptake',
                  insight: 'Separates weak demand from limited seating (4 resorts at 96% dinner load).',
                },
                {
                  name: 'All-Day Dining & Buffet',
                  match: 'All-Day Dining & Buffet',
                  rev: '$4.54M',
                  comm: '94% In-House Participation · $48 Incremental Paid · 9% External Mix',
                  insight: 'Ties buffet demand to occupancy and meal-plan entitlements.',
                },
                {
                  name: 'Bars & Sunset Lounges',
                  match: 'Bars & Sunset Lounges',
                  rev: '$3.52M',
                  comm: '$64 Avg Spend · 58% Premium Mix · $2,140 Revenue / Trading Hour',
                  insight: 'Captures sunset golden-hour and post-dinner spillover.',
                },
                {
                  name: 'In-Villa & Room Service',
                  match: 'In-Villa & Room Service',
                  rev: '$2.64M',
                  comm: '0.68 Orders / Occupied Room · $128 AOV · 41% Repeat Villa Usage',
                  insight: 'Segmented by villa tier, stay stage and daypart.',
                },
                {
                  name: 'Pool, Beach & Minibar',
                  match: 'Pool, Beach & Minibar',
                  rev: '$2.06M',
                  comm: '$58 Spend / Guest · 52% Beverage Attachment · 34% Minibar Usage',
                  insight: 'Detects lost demand in post-excursion peaks (1–3 PM).',
                },
                {
                  name: 'Banqueting & Private Dining',
                  match: 'Banqueting & Private Dining',
                  rev: '$1.76M',
                  comm: '526 Bookings & Events · $2,450 Spend / Private Booking · 34% Repeat Group',
                  insight: 'High-margin bespoke occasions, distinct from everyday trading.',
                },
              ].map((row, idx) => {
                const isSelected = row.match === selectedCentre;
                return (
                  <tr
                    key={idx}
                    className={`border-b border-zinc-200/60 last:border-0 transition-colors ${
                      isSelected ? 'bg-zinc-100/80' : 'hover:bg-zinc-100/40'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">{row.name}</td>
                    <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">{row.rev}</td>
                    <td className="py-2.5 px-3 text-[9.5px] text-zinc-700">{row.comm}</td>
                    <td className="py-2.5 px-3 text-[9.5px] text-zinc-500">{row.insight}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 3. AI CUISINE CATEGORY & MENU ENGINEERING ───────────────────────── */
  if (detailKey === 'FNB_AI_CUISINE_CATEGORY') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <div>
            <p className="text-xs text-zinc-500">
              AI-classified restaurant cuisine concepts (42 restaurants) &amp; contribution-informed signature dish performance.
            </p>
          </div>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            AI Culinary Taxonomy · Global View
          </span>
        </div>

        {/* AI Cuisine Category Table */}
        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Cuisine Category (AI Tagged)</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Outlets</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">MTD Covers</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Check</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Bev Attach</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Gross Margin</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">MTD Revenue</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">YoY Growth</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Japanese, Omakase & Robatayaki', outlets: 9, covers: '18,400', check: '$182', bev: '46%', margin: '74.2%', rev: '$6.16M (28%)', trend: '+16.4%' },
                { cat: 'Italian, Coastal & Mediterranean', outlets: 10, covers: '24,200', check: '$136', bev: '42%', margin: '76.8%', rev: '$4.84M (22%)', trend: '+11.2%' },
                { cat: 'Contemporary Western & Prime Grill', outlets: 8, covers: '16,900', check: '$158', bev: '48%', margin: '69.4%', rev: '$3.96M (18%)', trend: '+8.5%' },
                { cat: 'Korean Fine Grill & Pan-Asian', outlets: 6, covers: '12,600', check: '$144', bev: '39%', margin: '73.5%', rev: '$3.08M (14%)', trend: '+19.8%' },
                { cat: 'Local Heritage & Indigenous Gastronomy', outlets: 5, covers: '11,200', check: '$124', bev: '34%', margin: '78.1%', rev: '$2.20M (10%)', trend: '+9.1%' },
                { cat: 'Botanical, Wellness & Longevity Cuisine', outlets: 4, covers: '9,800', check: '$118', bev: '28%', margin: '79.6%', rev: '$1.76M (8%)', trend: '+15.2%' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-zinc-200/60 last:border-0 hover:bg-zinc-100/50 transition-colors">
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">{row.cat}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500 text-right">{row.outlets}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-700 text-right">{row.covers}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">{row.check}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-600 text-right">{row.bev}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{row.margin}</td>
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">{row.rev}</td>
                  <td className="py-2.5 px-3 text-[9.5px] font-medium text-[#14532d] text-right">{row.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Menu & Signature Dish Performance (Module 9) */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-2">
            GLOBAL SIGNATURE DISHES &amp; EXPERIENCE CONTRIBUTION LEADERS
          </h4>
          <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Signature Dish / Experience</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Cuisine Category</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Orders MTD</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Menu Price</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Contribution %</th>
                  <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Pairing Attach</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { item: 'A5 Miyazaki Wagyu Striploin & Truffle Jus', cat: 'Japanese / Grill', ord: '4,820', price: '$145', cm: '72%', pair: '64% Red/Saké' },
                  { item: '12-Course Chef Omakase & Rare Saké Flight', cat: 'Japanese Omakase', ord: '3,410', price: '$260', cm: '76%', pair: '82% Flight' },
                  { item: 'White Truffle Tagliolini & Aged Parmigiano', cat: 'Italian Coastal', ord: '5,190', price: '$78', cm: '84%', pair: '54% Barolo' },
                  { item: 'Patagonian Toothfish & Yuzu Miso Glaze', cat: 'Pan-Asian / Japanese', ord: '4,280', price: '$92', cm: '75%', pair: '49% White' },
                  { item: 'Jeju Black Pork & Hanwoo Galbi Tasting', cat: 'Korean Fine Grill', ord: '3,640', price: '$138', cm: '74%', pair: '58% Soju/Wine' },
                ].map((d, i) => (
                  <tr key={i} className="border-b border-zinc-200/60 last:border-0">
                    <td className="py-2 px-3 text-[10px] font-medium text-zinc-900">{d.item}</td>
                    <td className="py-2 px-3 text-[10px] text-zinc-500">{d.cat}</td>
                    <td className="py-2 px-3 text-[10px] text-zinc-700 text-right">{d.ord}</td>
                    <td className="py-2 px-3 text-[10px] font-medium text-zinc-900 text-right">{d.price}</td>
                    <td className="py-2 px-3 text-[10px] font-medium text-[#14532d] text-right">{d.cm}</td>
                    <td className="py-2 px-3 text-[10px] text-zinc-600 text-right">{d.pair}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 4. DEMAND CONVERSION, CAPTURE & GUEST SPEND MIX ───────────────────────── */
  if (detailKey === 'FNB_DEMAND_CAPTURE') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Distinguishing Covers (245,600), Unique F&amp;B Guests (50,750), and Transactions (118,400) across Meal-Plan vs À La Carte demand.
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            74,200 In-House Guest Nights MTD
          </span>
        </div>

        {/* 3 Denominator Distinction Cards (Rule: Distinguish Covers, Unique Guests & Transactions) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">1. TOTAL COVERS SERVED</div>
            <div className="text-lg font-bold text-zinc-900 mt-1">245,600 Covers</div>
            <div className="text-[9.5px] text-zinc-600 mt-0.5">Avg Check per Cover: <strong>$89.58</strong> · 1.84 Covers / Guest-Day</div>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">2. UNIQUE IN-HOUSE F&amp;B GUESTS</div>
            <div className="text-lg font-bold text-zinc-900 mt-1">50,750 Guests (68.4% Capture)</div>
            <div className="text-[9.5px] text-[#14532d] font-medium mt-0.5">Spend per In-House Guest-Day: <strong>$296</strong></div>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
            <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">3. POS CHECK TRANSACTIONS</div>
            <div className="text-lg font-bold text-zinc-900 mt-1">118,400 Checks</div>
            <div className="text-[9.5px] text-zinc-600 mt-0.5">Avg Check Size: <strong>$185.80</strong> (2.07 Covers / Check)</div>
          </div>
        </div>

        {/* Guest Spend by Origin Market & Stay Profile (Module 6) */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-2">
            GUEST F&amp;B SPEND &amp; CAPTURE BY ORIGIN MARKET / NATIONALITY
          </h4>
          <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Origin Market</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">In-House Share</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">F&amp;B Capture %</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Spend / Guest-Day</th>
                  <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Top Concept &amp; Purchasing Behavior</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { mkt: 'Asia Pacific', share: '35%', cap: '72.4%', spend: '$318', pref: 'Strong Omakase, Tasting Menu & Vintage Wine/Whisky flight conversion (JP, SG, AU)' },
                  { mkt: 'Europe', share: '25%', cap: '68.2%', spend: '$284', pref: 'High Half-Board utilization + Coastal Mediterranean & Wine Cellar uptake (UK, CH, FR)' },
                  { mkt: 'America', share: '20%', cap: '74.6%', spend: '$342', pref: 'High Prime Grill, Sunset Cocktails & In-Villa Dining attachment (US, CA, BR)' },
                  { mkt: 'Middle East', share: '12%', cap: '84.6%', spend: '$418', pref: 'Highest Private Sandbank Dining, In-Villa BBQ & Zero-Proof Elixir spend (UAE, KSA, QA)' },
                  { mkt: 'Africa', share: '8%', cap: '64.0%', spend: '$256', pref: 'Strong Beach Club, Restorative Wellness Grazing & Chef Table participation (ZA, EG, MA)' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-zinc-200/60 last:border-0 hover:bg-zinc-100/50 transition-colors">
                    <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">{row.mkt}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-600 text-right">{row.share}</td>
                    <td className="py-2.5 px-3 text-[10px] font-medium text-[#14532d] text-right">{row.cap}</td>
                    <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">{row.spend}</td>
                    <td className="py-2.5 px-3 text-[10px] text-zinc-500">{row.pref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 5. GUEST EXPERIENCE & REPUTATION (MODULE 8) ───────────────────────── */
  if (detailKey === 'FNB_GUEST_EXPERIENCE') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Connecting commercial F&amp;B performance to dining quality, complaint themes, and service recovery speed across properties.
          </p>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            4.82 / 5.0 Portfolio CSAT · 0.8% Complaint Rate
          </span>
        </div>

        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Meal Period / Concept</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">CSAT Score</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Complaint Rate</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg Recovery Time</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Primary Recurring Feedback Theme</th>
              </tr>
            </thead>
            <tbody>
              {[
                { p: 'Fine Dining & Omakase Dinner', csat: '4.92 / 5.0', comp: '0.4%', rec: '8 mins (Table-side)', theme: 'Praise for sommelier pairing; minor waitlist friction for 8 PM prime slots' },
                { p: 'Breakfast & All-Day Buffet', csat: '4.78 / 5.0', comp: '1.1%', rec: '11 mins', theme: '9:00 AM barista coffee wait during weekend checkout peaks at 2 resorts' },
                { p: 'Sunset Bars & Beach Clubs', csat: '4.86 / 5.0', comp: '0.6%', rec: '9 mins', theme: 'High acclaim for botanical elixirs; sunbed shade requests at peak sun' },
                { p: 'In-Villa & Room Service', csat: '4.71 / 5.0', comp: '1.8%', rec: '19 mins (Butler)', theme: 'Delivery SLA >30m during rain/peak buggy windows at cliffside & jetty resorts' },
                { p: 'Private Destination Dining', csat: '4.96 / 5.0', comp: '0.2%', rec: '6 mins', theme: 'Highest NPS (+91) across portfolio; strong repeat celebration demand' },
              ].map((r, i) => (
                <tr key={i} className="border-b border-zinc-200/60 last:border-0">
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">{r.p}</td>
                  <td className="py-2.5 px-3 text-[10px] font-bold text-[#14532d] text-right">{r.csat}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-700 text-right">{r.comp}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">{r.rec}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500">{r.theme}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── LEGACY EXPERIENCE & F&B DRAWERS (KEPT FOR COMPATIBILITY) ───────────────────────── */
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

  return (
    <div className="space-y-4 animate-fade-in text-zinc-900">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
        <p className="text-xs text-zinc-500">
          Executive commercial &amp; operational intelligence drill-down for <span className="font-semibold text-zinc-900">{config.title || 'F&B Portfolio'}</span>.
        </p>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
          Live Resort Context Connected
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">PORTFOLIO BENCHMARK</div>
          <div className="text-base font-semibold text-zinc-900 mt-1">Comparable Resort Peers</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Normalized by occupancy, meal plan &amp; concept</div>
        </div>
        <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">COMMERCIAL IMPACT</div>
          <div className="text-base font-semibold text-[#14532d] mt-1">+$1.42M Opportunity</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Identified via capture &amp; capacity optimization</div>
        </div>
        <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">ACCOUNTABLE GOVERNANCE</div>
          <div className="text-base font-semibold text-zinc-900 mt-1">Group &amp; Regional F&amp;B</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Tracked weekly with resort GMs &amp; Culinary Directors</div>
        </div>
      </div>
    </div>
  );
}
