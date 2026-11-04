import React from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, Clock, ArrowRight, Search, Filter } from 'lucide-react';

interface ThreatFeedTableProps {
  threats: any[];
  onSelectThreat: (threatId: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  riskFilter: string;
  onRiskFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
}

export const ThreatFeedTable: React.FC<ThreatFeedTableProps> = ({
  threats,
  onSelectThreat,
  page,
  totalPages,
  onPageChange,
  riskFilter,
  onRiskFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
      {/* Table Controls Header */}
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by domain or suspicious URL..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={riskFilter}
              onChange={(e) => onRiskFilterChange(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH_RISK">High Risk (70-100)</option>
              <option value="SUSPICIOUS">Suspicious (35-69)</option>
              <option value="SAFE">Safe (0-34)</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {threats.length} intercepted incidents
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/70 text-xs uppercase font-semibold text-slate-400 tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Status & Score</th>
              <th className="py-3.5 px-4">Impersonated Target</th>
              <th className="py-3.5 px-4">Deceptive Host Domain</th>
              <th className="py-3.5 px-4">Threat Vectors</th>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {threats.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500">
                  No threat incidents found matching your query.
                </td>
              </tr>
            ) : (
              threats.map((threat) => {
                const isHigh = threat.risk_level === 'HIGH_RISK';
                const isSuspicious = threat.risk_level === 'SUSPICIOUS';

                const badgeBg = isHigh
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : isSuspicious
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

                const Icon = isHigh ? ShieldAlert : isSuspicious ? AlertTriangle : ShieldCheck;

                return (
                  <tr
                    key={threat.id}
                    className="hover:bg-slate-800/40 transition-colors duration-150 group"
                  >
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeBg}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{threat.risk_score} / 100</span>
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-white whitespace-nowrap">
                      {threat.ai_forensic_analysis?.brandImpersonated ||
                        threat.matched_brand_name ||
                        'Visual Mimic'}
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-blue-400 max-w-xs truncate">
                      <div className="truncate font-semibold text-slate-200">
                        {threat.normalized_domain}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate" title={threat.detected_url}>
                        {threat.detected_url}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {threat.dom_telemetry?.externalFormActions?.length > 0 && (
                          <span className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-800/50 rounded text-[11px] font-mono">
                            External Form Target
                          </span>
                        )}
                        {threat.dom_telemetry?.delayedRenderDetected && (
                          <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800/50 rounded text-[11px] font-mono">
                            Delayed-Render
                          </span>
                        )}
                        {threat.dom_telemetry?.hasPasswordField && (
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] font-mono">
                            Password Harvest
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(threat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectThreat(threat.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg text-xs font-semibold transition-all border border-blue-500/30"
                      >
                        <span>Deep Forensic</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 bg-slate-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-200"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 bg-slate-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

