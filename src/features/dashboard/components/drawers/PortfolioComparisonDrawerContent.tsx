import { useNavigate } from 'react-router-dom';
import {
  simulatedPortfolioComparisonData,
  simulatedPropertiesData,
} from '../../services/propertySimulation';

export function PortfolioComparisonDrawerContent() {
  const navigate = useNavigate();
  const data = simulatedPortfolioComparisonData;

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Executive Benchmarking
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-zinc-900 text-white">
              Who is Winning?
            </span>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mt-1">
            Portfolio Comparison &amp; Collection Benchmarks
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Direct property comparison of Occupancy, ADR, RevPAR, and revenue pacing across all destinations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/dashboard/property')}
          className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          View Full Property Portal →
        </button>
      </div>

      {/* 4 Hero Benchmarks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Top Revenue Driver
          </span>
          <div className="text-lg font-bold text-zinc-900 mt-1">SOSEI Alpine</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              ↑ +18% vs LY
            </span>
            <span className="text-[10px] text-zinc-500">$31.2M Total</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Highest Occupancy
          </span>
          <div className="text-lg font-bold text-zinc-900 mt-1">SOSEI City</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-zinc-800 font-semibold">81.0% Occ</span>
            <span className="text-[10px] text-emerald-700 font-medium">↑ +4 pts</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Highest ADR Yield
          </span>
          <div className="text-lg font-bold text-zinc-900 mt-1">$1,420 ADR</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-zinc-600">Alpine Collection</span>
            <span className="text-[10px] text-emerald-700 font-medium">+$85 vs LY</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Attention / Softening
          </span>
          <div className="text-lg font-bold text-rose-600 mt-1">SOSEI Desert</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-rose-600 font-medium bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
              ↓ -3% YoY
            </span>
            <span className="text-[10px] text-zinc-500">61% Occ</span>
          </div>
        </div>
      </div>

      {/* Primary Collection Comparison Table */}
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 mb-2">
          Collection Performance League
        </h5>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <table className="w-full min-w-[760px] text-xs text-zinc-800 border-separate border-spacing-0">
            <thead>
              <tr className="text-zinc-500 bg-zinc-50/80">
                <th className="py-2.5 px-3 text-left font-semibold text-[10px] border-b border-zinc-200">Property</th>
                <th className="py-2.5 px-3 text-left font-semibold text-[10px] border-b border-zinc-200">Destination</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">Occupancy</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">ADR (USD)</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">RevPAR</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">Room Revenue</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">Total Revenue</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">vs LY</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">vs Budget</th>
                <th className="py-2.5 px-3 text-center font-semibold text-[10px] border-b border-zinc-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, idx) => (
                <tr
                  key={item.id}
                  onClick={() => item.propertyRoute && navigate(item.propertyRoute)}
                  className={`hover:bg-zinc-50 transition-colors cursor-pointer group ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/30'
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-zinc-900 group-hover:text-zinc-700 border-b border-zinc-100">
                    {item.property}
                  </td>
                  <td className="py-3 px-3 text-zinc-500 border-b border-zinc-100">
                    {item.location}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-zinc-800 border-b border-zinc-100">
                    {item.occupancy}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-zinc-800 border-b border-zinc-100">
                    {item.adrFormatted}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-zinc-800 border-b border-zinc-100">
                    {item.revparFormatted}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-zinc-800 border-b border-zinc-100">
                    {item.roomRevenueFormatted}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-zinc-900 border-b border-zinc-100">
                    {item.totalRevenueFormatted}
                  </td>
                  <td className="py-3 px-3 text-right border-b border-zinc-100">
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-semibold text-[10px] ${
                        item.growthVsLyUp
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}
                    >
                      {item.growthVsLyUp ? '↑' : '↓'} {item.growthVsLy}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right border-b border-zinc-100">
                    <span
                      className={`inline-flex items-center gap-0.5 font-medium text-[10px] ${
                        item.vsBudgetUp ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {item.vsBudgetUp ? '↑' : '↓'} {item.vsBudget}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center border-b border-zinc-100">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        item.status === 'above_plan'
                          ? 'bg-emerald-600'
                          : item.status === 'on_plan'
                          ? 'bg-emerald-500'
                          : 'bg-rose-500'
                      }`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sanctuary Level Roster (All 12 Sanctuaries - 100% SSOT Data) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Sanctuary Roster (12 Properties Live Audit)
          </h5>
          <span className="text-[10px] text-zinc-400">
            Click any sanctuary to inspect inventory
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <table className="w-full min-w-[700px] text-xs text-zinc-800 border-separate border-spacing-0">
            <thead>
              <tr className="text-zinc-500 bg-zinc-50/80">
                <th className="py-2.5 px-3 text-left font-semibold text-[10px] border-b border-zinc-200">Sanctuary</th>
                <th className="py-2.5 px-3 text-left font-semibold text-[10px] border-b border-zinc-200">Grouping</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">Keys</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">Occ %</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">ADR</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">RevPAR</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">MTD Revenue</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {simulatedPropertiesData.map((prop, idx) => (
                <tr
                  key={prop.id}
                  onClick={() => navigate('/dashboard/property')}
                  className={`hover:bg-zinc-50 transition-colors cursor-pointer ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/30'
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold text-zinc-900 border-b border-zinc-100">
                    {prop.name}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-500 text-[10px] border-b border-zinc-100">
                    {prop.grouping} · {prop.city}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-700 border-b border-zinc-100">
                    {prop.totalRooms} Keys
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-zinc-800 border-b border-zinc-100">
                    {prop.occupancyFormatted}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-zinc-700 border-b border-zinc-100">
                    {prop.adrFormatted}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-zinc-700 border-b border-zinc-100">
                    {prop.revparFormatted}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 border-b border-zinc-100">
                    {prop.revenueFormatted}
                  </td>
                  <td className="py-2.5 px-3 text-right border-b border-zinc-100">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-semibold ${
                        prop.status === 'above_plan'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : prop.status === 'on_plan'
                          ? 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}
                    >
                      {prop.status === 'above_plan'
                        ? 'Above Plan'
                        : prop.status === 'on_plan'
                        ? 'On Plan'
                        : 'Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
