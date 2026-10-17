interface ExperienceDrawerContentProps {
  config: {
    title?: string;
    data?: any;
  };
}

export function ExperienceDrawerContent({ config }: ExperienceDrawerContentProps) {
  const detailKey = typeof config.data === 'string' ? config.data : config.data?.key || '';
  const payload = typeof config.data === 'object' ? config.data : {};

  /* ───────────────────────── 1. 6 HEADLINE METRICS & 10-PROPERTY BENCHMARK ───────────────────────── */
  if (detailKey === 'EXP_HEADLINE_KPI') {
    const kpiId = payload.kpiId || 'participation';
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <div>
            <p className="text-xs text-zinc-500">
              Portfolio-wide Resort Activities &amp; Experiences performance across all 10 SOSEI resorts (excluding Spa treatments).
            </p>
          </div>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            142 Active Programs · 1,180 Sessions Delivered MTD
          </span>
        </div>

        {/* 6 Headline Summary Strip Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { id: 'participation', label: 'PARTICIPATION RATE', val: '64.8%', sub: '+5.4 pts · 1.92 Act/Stay' },
            { id: 'utilization', label: 'CAPACITY UTILIZATION', val: '81.4%', sub: '10,400 / 12,775 Places' },
            { id: 'fulfillment', label: 'DEMAND FULFILLMENT', val: '88.2%', sub: '1,390 Waitlist / Turnaways' },
            { id: 'quality', label: 'EXPERIENCE QUALITY', val: '96.4%', sub: '4.88/5 CSAT · 41.2% Repeat' },
            { id: 'readiness', label: 'STAFF & SESSION READY', val: '97.2%', sub: '99.4% Certified Coverage' },
            { id: 'contribution', label: 'PORTFOLIO CONTRIBUTION', val: '$5.40M', sub: '58% Comp / 42% Paid Mix' },
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

        {/* Technical Distinction Callout */}
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
              Capacity Utilization (81.4%) vs Demand Fulfillment (88.2%)
            </div>
            <p className="text-[10px] text-zinc-600 mt-1 leading-relaxed">
              <strong>Capacity Utilization</strong> measures actual attendees against seats/places offered in delivered sessions.{' '}
              <strong>Demand Fulfillment</strong> accounts for valid guest booking requests turned away or waitlisted because high-demand sessions (e.g., Reef Manta Snorkeling, Private Catamaran, Sunrise Cliff Yoga) reached capacity.
            </p>
          </div>
        </div>

        {/* All 10 Resorts Benchmark Table */}
        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Resort Property</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Collection</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Participation</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Cap Util</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Fulfillment</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Quality</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Readiness</th>
                <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Paid Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prop: 'SOSEI Maldives', col: 'SOSEI Beach Resort', part: '78.4%', util: '88.2%', ful: '84.0%', qual: '98.1%', ready: '98.5%', rev: '$980K' },
                { prop: 'SOSEI Costa Rica', col: 'SOSEI Nature', part: '76.2%', util: '86.4%', ful: '85.5%', qual: '97.4%', ready: '97.8%', rev: '$720K' },
                { prop: 'SOSEI Bali', col: 'SOSEI Beach Resort', part: '71.5%', util: '84.0%', ful: '89.2%', qual: '96.8%', ready: '98.0%', rev: '$640K' },
                { prop: 'SOSEI Switzerland', col: 'SOSEI Ski', part: '69.8%', util: '85.1%', ful: '87.4%', qual: '97.0%', ready: '99.0%', rev: '$780K' },
                { prop: 'SOSEI Canada', col: 'SOSEI Ski', part: '67.4%', util: '81.6%', ful: '90.1%', qual: '96.2%', ready: '97.5%', rev: '$540K' },
                { prop: 'SOSEI Japan', col: 'SOSEI Nature', part: '64.0%', util: '79.8%', ful: '91.4%', qual: '97.6%', ready: '98.8%', rev: '$460K' },
                { prop: 'SOSEI Oman', col: 'SOSEI Wellness', part: '66.2%', util: '78.4%', ful: '92.0%', qual: '95.8%', ready: '96.4%', rev: '$420K' },
                { prop: 'SOSEI Tokyo', col: 'SOSEI Urban', part: '48.6%', util: '76.2%', ful: '91.8%', qual: '96.5%', ready: '99.2%', rev: '$390K' },
                { prop: 'SOSEI Barcelona', col: 'SOSEI Urban', part: '51.2%', util: '74.8%', ful: '90.6%', qual: '95.2%', ready: '97.0%', rev: '$290K' },
                { prop: 'SOSEI Egypt', col: 'SOSEI Wellness', part: '54.4%', util: '69.5%', ful: '86.0%', qual: '93.4%', ready: '91.2%', rev: '$180K' },
              ].map((r) => (
                <tr key={r.prop} className="border-b border-zinc-200/60 last:border-0 hover:bg-zinc-100/50">
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900">{r.prop}</td>
                  <td className="py-2.5 px-3 text-[10px] text-zinc-500">{r.col}</td>
                  <td className="py-2.5 px-3 text-[10px] font-semibold text-[#14532d] text-right">{r.part}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">{r.util}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-700 text-right">{r.ful}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-900 text-right">{r.qual}</td>
                  <td className="py-2.5 px-3 text-[10px] font-medium text-zinc-700 text-right">{r.ready}</td>
                  <td className="py-2.5 px-3 text-[10px] font-bold text-zinc-900 text-right">{r.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 2. 14-CATEGORY ACTIVITY TAXONOMY & SECONDARY ATTRIBUTES ───────────────────────── */
  if (detailKey === 'EXP_PORTFOLIO_TAXONOMY') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="pb-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">
            Standardized 14-Category SOSEI Global Activity Taxonomy &amp; Secondary Attribute Framework (excludes Spa treatments).
          </p>
        </div>

        <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-zinc-50/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left">
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Primary Category</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Signature Examples</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Audience</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400">Commercial Model</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Participants</th>
                <th className="py-2 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Util %</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: '1. Water & Marine', ex: 'Reef snorkeling, diving, catamaran sailing, kayaking', aud: 'Adults, Eligible Kids, Families', mod: 'Comp Gear / Paid Excursions', part: '2,280', util: '88.4%' },
                { cat: '2. Yoga & Meditation', ex: 'Sunrise cliff yoga, pranayama, sound meditation', aud: 'Adults, Families', mod: 'Complimentary / Paid Private', part: '1,960', util: '86.2%' },
                { cat: '3. Nature & Discovery', ex: 'Guided canopy walks, birdwatching, coral conservation', aud: 'All Ages, Families', mod: 'Complimentary / Package', part: '1,540', util: '82.0%' },
                { cat: '4. Adventure & Exploration', ex: 'Alpine trekking, volcano ridge cycling, canyon hikes', aud: 'Adults, Teens (13–17)', mod: 'Paid Guided / Package', part: '1,120', util: '84.5%' },
                { cat: '5. Culture & Local Immersion', ex: 'Temple purification, artisan visits, heritage walks', aud: 'Adults, Families', mod: 'Paid / Package-Included', part: '940', util: '79.6%' },
                { cat: '6. Kids’ Club & Discovery', ex: 'Junior marine biologist, nature crafts, treasure trails', aud: 'Children (4–7, 8–12)', mod: 'Complimentary / Paid Camp', part: '860', util: '83.4%' },
                { cat: '7. Family Experiences', ex: 'Family scavenger hunts, parent-child yoga, beach games', aud: 'Families', mod: 'Complimentary / Paid Private', part: '680', util: '78.2%' },
                { cat: '8. Fitness & Movement', ex: 'Beach functional training, Reformer Pilates, trail run', aud: 'Adults, Teens', mod: 'Complimentary / Paid 1-on-1', part: '620', util: '75.8%' },
                { cat: '9. Excursions & External', ex: 'Dhow cruise, helicopter glacier tour, vineyard visit', aud: 'Adults, Families, Couples', mod: 'Paid / Licensed Partner', part: '540', util: '91.2%' },
                { cat: '10. Signature & Bespoke', ex: 'Private sandbank astronomy, private yacht charter', aud: 'Couples, Private Groups', mod: 'High-Ticket Paid Bespoke', part: '380', util: '94.0%' },
              ].map((row) => (
                <tr key={row.cat} className="border-b border-zinc-200/60 last:border-0">
                  <td className="py-2 px-3 text-[10px] font-bold text-zinc-900">{row.cat}</td>
                  <td className="py-2 px-3 text-[10px] text-zinc-600">{row.ex}</td>
                  <td className="py-2 px-3 text-[10px] text-zinc-600">{row.aud}</td>
                  <td className="py-2 px-3 text-[10px] text-zinc-700">{row.mod}</td>
                  <td className="py-2 px-3 text-[10px] font-medium text-zinc-900 text-right">{row.part}</td>
                  <td className="py-2 px-3 text-[10px] font-semibold text-[#14532d] text-right">{row.util}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ───────────────────────── 3. KIDS' CLUB DAILY CONTROL VIEW (SECTION 4C) ───────────────────────── */
  if (detailKey === 'EXP_KIDS_CLUB_CONTROL') {
    return (
      <div className="space-y-6 animate-fade-in text-zinc-900">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-zinc-200">
          <div>
            <p className="text-xs text-zinc-500">
              Dedicated child-safety &amp; supervision control workflow. Aggregate metrics shown to management; individual child PII restricted to authorized Kids&apos; Club supervisors.
            </p>
          </div>
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
            100% Ratio &amp; Handover Compliant
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'REGISTERED TODAY', val: '18', sub: 'Age Eligibility Verified' },
            { label: 'CHECKED IN (ACTIVE)', val: '14', sub: 'Across 3 Age Bands' },
            { label: 'CERTIFIED STAFF ASSIGNED', val: '3', sub: '1:4.6 Effective Ratio' },
            { label: 'COLLECTION PENDING', val: '2', sub: 'Authorized Guardian PIN' },
          ].map((k) => (
            <div key={k.label} className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
              <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-500">{k.label}</div>
              <div className="text-xl font-bold text-zinc-900 mt-1">{k.val}</div>
              <div className="text-[9px] text-[#14532d] font-medium mt-0.5">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
            5 Mandatory Child Safety &amp; Operational Control Points
          </h4>
          {[
            { step: '1. Registration & Age Eligibility Confirmed', status: 'Verified (18/18)', desc: 'All registered children mapped to property-defined age bands (0–3 Toddler with Guardian, 4–7 Explorers, 8–12 Navigators).' },
            { step: '2. Authorized Drop-Off & Collection Arrangements', status: 'Active PIN / Biometric', desc: 'Named parent/guardian pickup list locked at check-in; no child released without matching guardian verification.' },
            { step: '3. Staff-to-Child Supervision Ratios Verified', status: 'Compliant (3 Certified Staff)', desc: 'Pediatric First-Aid & Water-Safety certified supervisors assigned according to youngest age band present.' },
            { step: '4. Transition & End-of-Session Headcount Reconciliation', status: '4/4 Checkpoints Logged', desc: 'Mandatory digital headcount logged when moving between indoor studio, garden trail, and shallow lagoon.' },
            { step: '5. Restricted-Access Allergy & Care Protocols', status: '3 Care Flags Active', desc: 'Allergy and medical notes surfaced strictly on supervisor handhelds without exposing sensitive child PII on global boards.' },
          ].map((c) => (
            <div key={c.step} className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-zinc-900">{c.step}</div>
                <div className="text-[10px] text-zinc-600 mt-0.5">{c.desc}</div>
              </div>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] shrink-0 self-start sm:self-center">
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ───────────────────────── DEFAULT / COMMERCIAL & STAY CONTRIBUTION ───────────────────────── */
  return (
    <div className="space-y-5 animate-fade-in text-zinc-900">
      <div className="pb-3 border-b border-zinc-200">
        <p className="text-xs text-zinc-500">
          SOSEI Global Resort Activities &amp; Experiences Intelligence — Commercial Contribution, Guest Participation &amp; Operational Readiness.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Paid &amp; Bespoke Revenue</div>
          <div className="text-lg font-bold text-zinc-900 mt-1">$5.40M MTD</div>
          <div className="text-[9.5px] text-[#14532d] font-medium mt-0.5">+16.0% YoY · $519 / Paid Guest</div>
        </div>
        <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Complimentary Enrichment</div>
          <div className="text-lg font-bold text-zinc-900 mt-1">6,030 Participants</div>
          <div className="text-[9.5px] text-zinc-600 font-medium mt-0.5">58% of Total Volume · 4.91/5 CSAT</div>
        </div>
        <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Stay Contribution (2+ Act.)</div>
          <div className="text-lg font-bold text-zinc-900 mt-1">+1.4 Nights ALOS</div>
          <div className="text-[9.5px] text-[#14532d] font-medium mt-0.5">+6.2 pts Resort NPS Association</div>
        </div>
      </div>
    </div>
  );
}
