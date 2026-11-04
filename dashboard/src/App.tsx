import React, { useState, useEffect } from 'react';
import { useThreats } from './hooks/useThreats';
import { StatSummaryWidget } from './components/StatSummaryWidget';
import { ThreatFeedTable } from './components/ThreatFeedTable';
import { ForensicModal } from './components/ForensicModal';
import { BrandManager } from './components/BrandManager';
import { WhitelistTable } from './components/WhitelistTable';
import { ReportsDesk } from './components/ReportsDesk';
import { PublicLookup } from './components/PublicLookup';
import { fetchHealth } from './lib/api';
import {
  Shield,
  Activity,
  Layers,
  ShieldCheck,
  FileText,
  Search,
  RefreshCw,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'lookup' | 'dashboard' | 'brands' | 'whitelist' | 'reports'>('dashboard');
  const [selectedThreatId, setSelectedThreatId] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);

  const {
    stats,
    threats,
    brands,
    reports,
    whitelist,
    loading,
    page,
    setPage,
    totalPages,
    riskFilter,
    setRiskFilter,
    searchQuery,
    setSearchQuery,
    reload,
  } = useThreats();

  useEffect(() => {
    fetchHealth()
      .then(setSystemHealth)
      .catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                <span>PhishLens AI</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Sentinel v2.5
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Real-Time Anti-Phishing & Visual Spoofing Platform
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Threat Feed</span>
            </button>

            <button
              onClick={() => setActiveTab('lookup')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                activeTab === 'lookup'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-indigo-400" />
              <span>URL Scanner</span>
            </button>

            <button
              onClick={() => setActiveTab('brands')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                activeTab === 'brands'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Brand Anchors</span>
            </button>

            <button
              onClick={() => setActiveTab('whitelist')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                activeTab === 'whitelist'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Whitelist</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
                activeTab === 'reports'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Reports</span>
              {reports.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px]">
                  {reports.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* System Status & Reload */}
        <div className="flex items-center gap-3">
          {systemHealth && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{systemHealth.aiEngine}</span>
            </div>
          )}

          <button
            onClick={() => reload()}
            title="Refresh Live Threat Data"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Enterprise Telemetry & Active Threat Intelligence
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time zero-hour visual spoofing, homoglyph domain interceptions, and embedded Sentinel conversations.
              </p>
            </div>

            <StatSummaryWidget stats={stats} />

            <ThreatFeedTable
              threats={threats}
              onSelectThreat={(id) => setSelectedThreatId(id)}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              riskFilter={riskFilter}
              onRiskFilterChange={setRiskFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        )}

        {activeTab === 'lookup' && <PublicLookup />}

        {activeTab === 'brands' && <BrandManager brands={brands} onRefresh={reload} />}

        {activeTab === 'whitelist' && <WhitelistTable whitelist={whitelist} onRefresh={reload} />}

        {activeTab === 'reports' && <ReportsDesk reports={reports} onRefresh={reload} />}
      </main>

      {/* Forensic Deep Dive Modal */}
      <ForensicModal
        threatId={selectedThreatId}
        onClose={() => setSelectedThreatId(null)}
      />
    </div>
  );
}

export default App;

