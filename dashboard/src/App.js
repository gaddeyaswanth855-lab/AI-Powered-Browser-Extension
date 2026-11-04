import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useThreats } from './hooks/useThreats';
import { StatSummaryWidget } from './components/StatSummaryWidget';
import { ThreatFeedTable } from './components/ThreatFeedTable';
import { ForensicModal } from './components/ForensicModal';
import { BrandManager } from './components/BrandManager';
import { WhitelistTable } from './components/WhitelistTable';
import { ReportsDesk } from './components/ReportsDesk';
import { PublicLookup } from './components/PublicLookup';
import { fetchHealth } from './lib/api';
import { Shield, Activity, Layers, ShieldCheck, FileText, Search, RefreshCw, } from 'lucide-react';
export function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedThreatId, setSelectedThreatId] = useState(null);
    const [systemHealth, setSystemHealth] = useState(null);
    const { stats, threats, brands, reports, whitelist, loading, page, setPage, totalPages, riskFilter, setRiskFilter, searchQuery, setSearchQuery, reload, } = useThreats();
    useEffect(() => {
        fetchHealth()
            .then(setSystemHealth)
            .catch(() => null);
    }, []);
    return (_jsxs("div", { className: "min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans", children: [_jsxs("header", { className: "sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { className: "flex items-center gap-3 cursor-pointer", onClick: () => setActiveTab('dashboard'), children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20", children: _jsx(Shield, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { children: [_jsxs("div", { className: "font-extrabold text-base tracking-tight text-white flex items-center gap-2", children: [_jsx("span", { children: "PhishLens AI" }), _jsx("span", { className: "text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20", children: "Sentinel v2.5" })] }), _jsx("div", { className: "text-[10px] text-slate-400 font-mono", children: "Real-Time Anti-Phishing & Visual Spoofing Platform" })] })] }), _jsxs("nav", { className: "hidden md:flex items-center gap-1 text-xs font-semibold", children: [_jsxs("button", { onClick: () => setActiveTab('dashboard'), className: `px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${activeTab === 'dashboard'
                                            ? 'bg-slate-800 text-white'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`, children: [_jsx(Activity, { className: "w-4 h-4 text-blue-400" }), _jsx("span", { children: "Threat Feed" })] }), _jsxs("button", { onClick: () => setActiveTab('lookup'), className: `px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${activeTab === 'lookup'
                                            ? 'bg-slate-800 text-white'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`, children: [_jsx(Search, { className: "w-4 h-4 text-indigo-400" }), _jsx("span", { children: "URL Scanner" })] }), _jsxs("button", { onClick: () => setActiveTab('brands'), className: `px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${activeTab === 'brands'
                                            ? 'bg-slate-800 text-white'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`, children: [_jsx(Layers, { className: "w-4 h-4 text-cyan-400" }), _jsx("span", { children: "Brand Anchors" })] }), _jsxs("button", { onClick: () => setActiveTab('whitelist'), className: `px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${activeTab === 'whitelist'
                                            ? 'bg-slate-800 text-white'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`, children: [_jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-400" }), _jsx("span", { children: "Whitelist" })] }), _jsxs("button", { onClick: () => setActiveTab('reports'), className: `px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${activeTab === 'reports'
                                            ? 'bg-slate-800 text-white'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`, children: [_jsx(FileText, { className: "w-4 h-4 text-purple-400" }), _jsx("span", { children: "Reports" }), reports.length > 0 && (_jsx("span", { className: "px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px]", children: reports.length }))] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [systemHealth && (_jsxs("div", { className: "hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }), _jsx("span", { children: systemHealth.aiEngine })] })), _jsx("button", { onClick: () => reload(), title: "Refresh Live Threat Data", className: "p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition", children: _jsx(RefreshCw, { className: `w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}` }) })] })] }), _jsxs("main", { className: "flex-1 p-6 max-w-7xl w-full mx-auto space-y-8", children: [activeTab === 'dashboard' && (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white tracking-tight", children: "Enterprise Telemetry & Active Threat Intelligence" }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Real-time zero-hour visual spoofing, homoglyph domain interceptions, and embedded Sentinel conversations." })] }), _jsx(StatSummaryWidget, { stats: stats }), _jsx(ThreatFeedTable, { threats: threats, onSelectThreat: (id) => setSelectedThreatId(id), page: page, totalPages: totalPages, onPageChange: setPage, riskFilter: riskFilter, onRiskFilterChange: setRiskFilter, searchQuery: searchQuery, onSearchChange: setSearchQuery })] })), activeTab === 'lookup' && _jsx(PublicLookup, {}), activeTab === 'brands' && _jsx(BrandManager, { brands: brands, onRefresh: reload }), activeTab === 'whitelist' && _jsx(WhitelistTable, { whitelist: whitelist, onRefresh: reload }), activeTab === 'reports' && _jsx(ReportsDesk, { reports: reports, onRefresh: reload })] }), _jsx(ForensicModal, { threatId: selectedThreatId, onClose: () => setSelectedThreatId(null) })] }));
}
export default App;
