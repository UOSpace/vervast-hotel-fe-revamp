import { useState } from 'react';
import {
  simulatedSOSEISignalsData,
  simulatedPropertiesData,
} from '../../services/propertySimulation';

export function SOSEISignalsDrawerContent() {
  const [filter, setFilter] = useState<'all' | 'opportunity' | 'risk'>('all');
  const allSignals = simulatedSOSEISignalsData.items;

  const filteredSignals = allSignals.filter((sig) => {
    if (filter === 'opportunity') return sig.signalType === 'opportunity';
    if (filter === 'risk') return sig.signalType === 'risk' || sig.signalType === 'neutral';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Signature Intelligence Layer
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-zinc-900 text-white">
              SOSEI Signals
            </span>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mt-1">
            Portfolio Signals &amp; Strategic Advisory
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Answering the executive question &ldquo;So what?&rdquo; with data-derived signals and transparent AI recommendations.
          </p>
        </div>

        {/* Filters */}
        <div className="inline-flex items-center p-1 rounded-lg bg-zinc-100 border border-zinc-200 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${filter === 'all'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
              }`}
          >
            All Signals ({allSignals.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('opportunity')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${filter === 'opportunity'
                ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
              }`}
          >
            Opportunities (2)
          </button>
          <button
            type="button"
            onClick={() => setFilter('risk')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${filter === 'risk'
                ? 'bg-white text-rose-800 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
              }`}
          >
            Risks &amp; Exposure (2)
          </button>
        </div>
      </div>

      {/* Signal Cards */}
      <div className="space-y-3.5">
        {filteredSignals.map((sig) => (
          <div
            key={sig.id}
            className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all shadow-2xs"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {sig.iconType === 'up_arrow' ? (
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-100">
                    ↑
                  </span>
                ) : sig.iconType === 'down_arrow' ? (
                  <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-100">
                    ↓
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center font-bold text-xs border border-zinc-200">
                    —
                  </span>
                )}
                <div>
                  <h5 className="text-sm font-bold text-zinc-900">{sig.title}</h5>
                  <span className="text-[10px] text-zinc-400">
                    Category: <strong className="text-zinc-600">{sig.category}</strong> · Detected: {sig.timestamp}
                  </span>
                </div>
              </div>

              <span
                className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full border ${sig.signalType === 'opportunity'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : sig.signalType === 'risk'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                  }`}
              >
                {sig.impactSummary}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-600 mt-2.5 leading-relaxed">
              {sig.description}
            </p>

            {/* Affected Sanctuaries */}
            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              <span className="text-[10px] text-zinc-400 font-medium">Affected Sanctuaries:</span>
              {sig.affectedProperties.map((propName) => (
                <span
                  key={propName}
                  className="px-2 py-0.5 rounded text-[9.5px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/60"
                >
                  {propName}
                </span>
              ))}
            </div>

            {/* AI Recommendation (Separated for trust and clarity) */}
            {sig.aiRecommendation && (
              <div className="mt-3.5 p-3 rounded-lg bg-zinc-50 border border-zinc-200/90 text-zinc-800">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-900 mb-1">
                  <span>✦</span>
                  <span>AI Tactical Recommendation</span>
                  <span className="text-[8.5px] font-normal text-zinc-400 lowercase">(non-binding advisory)</span>
                </div>
                <div className="text-[11px] text-zinc-700 font-normal leading-normal">
                  {sig.aiRecommendation}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cross-Reference Table with All 12 Sanctuaries */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Portfolio Health Cross-Reference (100% SSOT Data)
          </h5>
          <span className="text-[10px] text-zinc-400">
            Live Sanctuary Audit
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[700px] text-xs text-zinc-800 border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-zinc-500 bg-zinc-50/80">
                <th className="py-2.5 px-3 font-semibold text-[10px] border-b border-zinc-200">
                  Property
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] border-b border-zinc-200">
                  Collection
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Occupancy
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  ADR
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  RevPAR
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Active Signal
                </th>
              </tr>
            </thead>
            <tbody>
              {simulatedPropertiesData.map((prop, idx) => {
                const hasOpportunity = ['SOSEI MAREA', 'SOSEI ELAN', 'SOSEI SYLVAN', 'SOSEI NOCTURNE', 'SOSEI AURORA'].includes(prop.name);
                const hasRisk = ['SOSEI PELAGIA', 'SOSEI SOLSTICE', 'SOSEI MIRAGE', 'SOSEI VERPER', 'SOSEI HEARTH'].includes(prop.name);

                return (
                  <tr
                    key={prop.id}
                    className={`hover:bg-zinc-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/30'
                      }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-zinc-900 border-b border-zinc-100">
                      {prop.name}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-500 text-[10px] border-b border-zinc-100">
                      {prop.grouping} · {prop.city}
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
                    <td className="py-2.5 px-3 text-right border-b border-zinc-100">
                      {hasOpportunity ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          ↑ Acceleration
                        </span>
                      ) : hasRisk ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                          ↓ Attention
                        </span>
                      ) : (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
                          Steady
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
