import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { addWhitelistDomain } from '../lib/api';
import { ShieldCheck, Plus, Search } from 'lucide-react';
export const WhitelistTable = ({ whitelist, onRefresh }) => {
    const [domain, setDomain] = useState('');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const filtered = whitelist.filter((item) => item.domain.toLowerCase().includes(search.toLowerCase()) ||
        (item.reason && item.reason.toLowerCase().includes(search.toLowerCase())));
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!domain.trim())
            return;
        setSubmitting(true);
        try {
            await addWhitelistDomain(domain.trim(), reason.trim() || undefined);
            setDomain('');
            setReason('');
            onRefresh();
        }
        catch (err) {
            alert(`Error: ${err.message}`);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl", children: [_jsxs("h3", { className: "text-sm font-bold text-white mb-3 flex items-center gap-2", children: [_jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-400" }), _jsx("span", { children: "Add Global Whitelist Override" })] }), _jsxs("form", { onSubmit: handleAdd, className: "flex flex-col sm:flex-row gap-3", children: [_jsx("input", { type: "text", required: true, placeholder: "Domain (e.g. internal.corp.com)", value: domain, onChange: (e) => setDomain(e.target.value), className: "flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono" }), _jsx("input", { type: "text", placeholder: "Operational Reason / Ticket ID", value: reason, onChange: (e) => setReason(e.target.value), className: "flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500" }), _jsxs("button", { type: "submit", disabled: submitting, className: "px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add Whitelist" })] })] })] }), _jsxs("div", { className: "bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl", children: [_jsxs("div", { className: "p-4 border-b border-slate-800 flex items-center justify-between", children: [_jsxs("div", { className: "relative w-72", children: [_jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }), _jsx("input", { type: "text", placeholder: "Search whitelisted domains...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500" })] }), _jsxs("div", { className: "text-xs text-slate-400 font-mono", children: [filtered.length, " domains whitelisted"] })] }), _jsxs("table", { className: "w-full text-left text-sm text-slate-300", children: [_jsx("thead", { className: "bg-slate-950/70 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800", children: _jsxs("tr", { children: [_jsx("th", { className: "py-3 px-4", children: "Domain" }), _jsx("th", { className: "py-3 px-4", children: "Reason / Notes" }), _jsx("th", { className: "py-3 px-4", children: "Scope" }), _jsx("th", { className: "py-3 px-4 text-right", children: "Created At" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-800/60", children: filtered.map((item) => (_jsxs("tr", { className: "hover:bg-slate-800/40", children: [_jsx("td", { className: "py-3.5 px-4 font-mono text-xs font-semibold text-emerald-400", children: item.domain }), _jsx("td", { className: "py-3.5 px-4 text-xs text-slate-300", children: item.reason || 'Manual administrative exemption' }), _jsx("td", { className: "py-3.5 px-4 text-xs", children: _jsx("span", { className: "px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]", children: item.is_global ? 'GLOBAL' : 'TENANT' }) }), _jsx("td", { className: "py-3.5 px-4 text-right font-mono text-xs text-slate-500", children: new Date(item.created_at || Date.now()).toLocaleDateString() })] }, item.id || item.domain))) })] })] })] }));
};
