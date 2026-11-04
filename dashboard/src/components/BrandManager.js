import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { createBrand } from '../lib/api';
import { Plus, Search } from 'lucide-react';
export const BrandManager = ({ brands, onRefresh }) => {
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [brandName, setBrandName] = useState('');
    const [domains, setDomains] = useState('');
    const [category, setCategory] = useState('IDENTITY');
    const [phashSignature, setPhashSignature] = useState('a1b2c3d4e5f60718');
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState(null);
    const filtered = brands.filter((b) => b.brand_name.toLowerCase().includes(search.toLowerCase()) ||
        b.canonical_domains.some((d) => d.toLowerCase().includes(search.toLowerCase())));
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMsg(null);
        try {
            const canonicalDomains = domains
                .split(',')
                .map((d) => d.trim().toLowerCase())
                .filter(Boolean);
            await createBrand({
                brandName: brandName.trim(),
                canonicalDomains,
                category,
                phashSignature: phashSignature.trim(),
            });
            setMsg('Brand anchor successfully registered.');
            setShowAddModal(false);
            setBrandName('');
            setDomains('');
            onRefresh();
        }
        catch (err) {
            setMsg(`Error: ${err.message}`);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4", children: [_jsxs("div", { className: "relative w-full sm:w-80", children: [_jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }), _jsx("input", { type: "text", placeholder: "Search registered brand anchors...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500" })] }), _jsxs("button", { onClick: () => setShowAddModal(true), className: "w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Register New Brand Anchor" })] })] }), msg && (_jsx("div", { className: "p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-300", children: msg })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filtered.map((b) => (_jsxs("div", { className: "p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("span", { className: "font-bold text-base text-white", children: b.brand_name }), _jsx("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300", children: b.category })] }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsx("div", { className: "text-[11px] text-slate-400 font-semibold uppercase", children: "Canonical Domains" }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: b.canonical_domains.map((dom, i) => (_jsx("span", { className: "px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs", children: dom }, i))) })] })] }), _jsxs("div", { className: "pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono", children: [_jsx("span", { children: "pHash:" }), _jsx("span", { className: "text-blue-400", children: b.phash_signature })] })] }, b.id || b.brand_name))) }), showAddModal && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md", children: _jsxs("div", { className: "w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl", children: [_jsx("h3", { className: "text-base font-bold text-white mb-4", children: "Register Enterprise Brand Anchor" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 text-xs", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1 font-semibold", children: "Brand Name" }), _jsx("input", { type: "text", required: true, placeholder: "e.g. Acme Corp", value: brandName, onChange: (e) => setBrandName(e.target.value), className: "w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1 font-semibold", children: "Canonical Domains (comma-separated)" }), _jsx("input", { type: "text", required: true, placeholder: "acme.com, login.acme.com", value: domains, onChange: (e) => setDomains(e.target.value), className: "w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1 font-semibold", children: "Category" }), _jsxs("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500", children: [_jsx("option", { value: "FINANCIAL", children: "Financial Institution" }), _jsx("option", { value: "IDENTITY", children: "Identity & SSO Provider" }), _jsx("option", { value: "COMMERCE", children: "E-Commerce & Delivery" }), _jsx("option", { value: "SOCIAL", children: "Social & Messaging" }), _jsx("option", { value: "CRYPTO", children: "Cryptocurrency & Web3" }), _jsx("option", { value: "OTHER", children: "Other Enterprise Target" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-400 mb-1 font-semibold", children: "Baseline pHash Signature (16-char Hex)" }), _jsx("input", { type: "text", required: true, maxLength: 16, placeholder: "16-character hexadecimal", value: phashSignature, onChange: (e) => setPhashSignature(e.target.value), className: "w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-slate-200 focus:outline-none focus:border-blue-500" })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: () => setShowAddModal(false), className: "px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700", children: "Cancel" }), _jsx("button", { type: "submit", disabled: submitting, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50", children: submitting ? 'Saving...' : 'Register' })] })] })] }) }))] }));
};
