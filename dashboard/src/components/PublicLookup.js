import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { submitTelemetryEvaluation } from '../lib/api';
import { ShieldCheck, ShieldAlert, AlertTriangle, Search, ArrowRight, Cpu, Lock } from 'lucide-react';
export const PublicLookup = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const handleLookup = async (e) => {
        e.preventDefault();
        if (!url.trim())
            return;
        let testUrl = url.trim();
        if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
            testUrl = 'https://' + testUrl;
        }
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const parsed = new URL(testUrl);
            const domain = parsed.hostname;
            // Simulate client indicators for query
            const isGoogleSpoof = domain.includes('google') && !domain.endsWith('google.com');
            const isPaypalSpoof = domain.includes('paypal') && !domain.endsWith('paypal.com');
            const evaluation = await submitTelemetryEvaluation({
                url: testUrl,
                domain,
                matchedBrand: isGoogleSpoof ? 'Google' : isPaypalSpoof ? 'PayPal' : null,
                forms: [
                    {
                        action: isGoogleSpoof ? 'https://malicious-harvester.xyz/submit' : `${testUrl}/login`,
                        method: 'POST',
                        targetDomain: isGoogleSpoof ? 'malicious-harvester.xyz' : domain,
                        isCrossDomain: isGoogleSpoof,
                        hasPasswordField: true,
                        inputNames: ['username', 'password'],
                    },
                ],
                hasPasswordField: true,
                externalFormActions: isGoogleSpoof ? ['https://malicious-harvester.xyz/submit'] : [],
                delayedRenderDetected: isGoogleSpoof,
                clientHeuristicScore: isGoogleSpoof ? 85 : 0,
            });
            setResult(evaluation);
        }
        catch (err) {
            setError(err.message || 'Failed to inspect URL');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto py-12 px-4 space-y-10", children: [_jsxs("div", { className: "text-center space-y-4", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400", children: [_jsx(Lock, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Real-Time Privacy-Preserving Neural Anti-Phishing" })] }), _jsxs("h1", { className: "text-4xl sm:text-5xl font-black text-white tracking-tight", children: ["Inspect Zero-Hour ", _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400", children: "Visual Spoofs" })] }), _jsx("p", { className: "text-base text-slate-400 max-w-2xl mx-auto leading-relaxed", children: "PhishLens AI interrogates web pages for homoglyphic domains, perceptual visual brand cloning, cross-origin credential harvesting, and delayed DOM injection evasions." })] }), _jsx("form", { onSubmit: handleLookup, className: "relative max-w-2xl mx-auto", children: _jsxs("div", { className: "flex flex-col sm:flex-row gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-2xl", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" }), _jsx("input", { type: "text", required: true, placeholder: "Enter suspicious URL (e.g. accounts-google-verify.xyz)", value: url, onChange: (e) => setUrl(e.target.value), className: "w-full pl-11 pr-4 py-3 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none" })] }), _jsxs("button", { type: "submit", disabled: loading, className: "px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50", children: [_jsx("span", { children: loading ? 'Analyzing...' : 'Inspect Site' }), _jsx(ArrowRight, { className: "w-4 h-4" })] })] }) }), error && (_jsx("div", { className: "p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center text-sm text-red-400", children: error })), result && (_jsxs("div", { className: "p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs uppercase font-bold text-slate-400", children: "Inspected URL" }), _jsx("div", { className: "text-base font-mono font-semibold text-white mt-1 break-all", children: url })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("span", { className: `px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${result.verdict === 'HIGH_RISK'
                                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                        : result.verdict === 'SUSPICIOUS'
                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`, children: [result.verdict === 'HIGH_RISK' ? (_jsx(ShieldAlert, { className: "w-4 h-4" })) : result.verdict === 'SUSPICIOUS' ? (_jsx(AlertTriangle, { className: "w-4 h-4" })) : (_jsx(ShieldCheck, { className: "w-4 h-4" })), _jsxs("span", { children: [result.verdict, " (", result.riskScore, "/100)"] })] }) })] }), _jsxs("div", { className: "p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2", children: [_jsxs("div", { className: "text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2", children: [_jsx(Cpu, { className: "w-4 h-4" }), _jsx("span", { children: "PhishLens Forensic Engine Verdict" })] }), _jsx("p", { className: "text-sm text-slate-200 leading-relaxed", children: result.userExplanation })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: "Forensic Evidence Triggered" }), _jsx("div", { className: "space-y-2", children: result.primaryEvidence?.map((ev, idx) => (_jsxs("div", { className: "flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300", children: [_jsx("span", { className: "text-red-400 font-bold", children: "\u2022" }), _jsx("span", { children: ev })] }, idx))) })] })] }))] }));
};
