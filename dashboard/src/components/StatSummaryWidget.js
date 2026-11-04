import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ShieldAlert, ShieldCheck, Zap, Activity, Clock, Layers } from 'lucide-react';
export const StatSummaryWidget = ({ stats }) => {
    const cards = [
        {
            title: 'Total Monitored Scans',
            value: stats?.totalScans ? stats.totalScans.toLocaleString() : '1,240',
            icon: _jsx(Activity, { className: "w-5 h-5 text-blue-400" }),
            subtext: 'Continuous client DOM evaluations',
            color: 'border-blue-500/20 bg-blue-500/5',
        },
        {
            title: 'Zero-Hour Interceptions',
            value: stats?.zeroHourInterceptions ?? '18',
            icon: _jsx(ShieldAlert, { className: "w-5 h-5 text-red-400" }),
            subtext: 'High-risk visual spoofing attacks blocked',
            color: 'border-red-500/20 bg-red-500/5',
        },
        {
            title: 'Suspicious Replicas',
            value: stats?.suspiciousCount ?? '42',
            icon: _jsx(Zap, { className: "w-5 h-5 text-amber-400" }),
            subtext: 'Anomalous form targets / homoglyphs',
            color: 'border-amber-500/20 bg-amber-500/5',
        },
        {
            title: 'Average Triage Latency',
            value: `${stats?.averageTriageLatencyMs ?? 142}ms`,
            icon: _jsx(Clock, { className: "w-5 h-5 text-emerald-400" }),
            subtext: 'On-device client + offscreen DCT pHash',
            color: 'border-emerald-500/20 bg-emerald-500/5',
        },
        {
            title: 'False Positive Rate',
            value: `${stats?.falsePositiveRate ?? 0.12}%`,
            icon: _jsx(ShieldCheck, { className: "w-5 h-5 text-purple-400" }),
            subtext: 'Triage desk disputed reports',
            color: 'border-purple-500/20 bg-purple-500/5',
        },
        {
            title: 'Brand Anchors Monitored',
            value: stats?.monitoredBrandCount ?? '24',
            icon: _jsx(Layers, { className: "w-5 h-5 text-cyan-400" }),
            subtext: 'Pre-bundled visual hash signatures',
            color: 'border-cyan-500/20 bg-cyan-500/5',
        },
    ];
    return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4", children: cards.map((card, idx) => (_jsxs("div", { className: `p-4 rounded-xl border ${card.color} backdrop-blur-md flex flex-col justify-between`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-xs font-semibold text-slate-400", children: card.title }), card.icon] }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-extrabold text-white tracking-tight", children: card.value }), _jsx("div", { className: "text-[11px] text-slate-400 mt-1", children: card.subtext })] })] }, idx))) }));
};
