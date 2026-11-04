import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { HeuristicBadge } from '../ui/HeuristicBadge';
export const Popup = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Query active tab status from background/content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab && activeTab.id) {
                chrome.tabs.sendMessage(activeTab.id, { type: 'GET_PAGE_STATUS' }, (response) => {
                    if (chrome.runtime.lastError || !response) {
                        // Fallback to background cache
                        chrome.runtime.sendMessage({ type: 'GET_PAGE_STATUS', payload: { tabId: activeTab.id } }, (bgRes) => {
                            setStatus(bgRes || null);
                            setLoading(false);
                        });
                    }
                    else {
                        setStatus(response);
                        setLoading(false);
                    }
                });
            }
            else {
                setLoading(false);
            }
        });
    }, []);
    const handleOpenAssistant = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab && activeTab.id) {
                chrome.tabs.sendMessage(activeTab.id, { type: 'TOGGLE_ASSISTANT' });
                window.close();
            }
        });
    };
    const handleBypass = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab && activeTab.id) {
                chrome.tabs.sendMessage(activeTab.id, { type: 'BYPASS_PAGE' });
                setStatus((prev) => (prev ? { ...prev, bypassed: true } : null));
            }
        });
    };
    if (loading) {
        return (_jsx("div", { style: { width: '340px', padding: '24px', background: '#0f172a', color: '#f8fafc', textAlign: 'center' }, children: _jsx("div", { children: "Auditing active page telemetry..." }) }));
    }
    if (!status) {
        return (_jsxs("div", { style: { width: '340px', padding: '24px', background: '#0f172a', color: '#f8fafc' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }, children: [_jsx("div", { style: { fontSize: '20px' }, children: "\uD83D\uDEE1\uFE0F" }), _jsx("h2", { style: { fontSize: '16px', fontWeight: 700 }, children: "PhishLens AI" })] }), _jsx("p", { style: { fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }, children: "No active telemetry available for this page (internal browser or blank tab)." })] }));
    }
    const isSafe = status.riskLevel === 'SAFE';
    return (_jsxs("div", { style: {
            width: '360px',
            background: '#0f172a',
            color: '#f8fafc',
            padding: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx("span", { style: { fontSize: '20px' }, children: "\uD83D\uDEE1\uFE0F" }), _jsx("span", { style: { fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em' }, children: "PhishLens AI" })] }), _jsx(HeuristicBadge, { score: status.riskScore, riskLevel: status.riskLevel })] }), _jsxs("div", { style: {
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    marginBottom: '14px',
                }, children: [_jsx("div", { style: { fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }, children: "Audited Host" }), _jsx("div", { style: { fontSize: '13px', fontWeight: 600, color: '#ffffff', wordBreak: 'break-all', marginTop: '2px' }, children: status.domain }), status.matchedBrand && (_jsxs("div", { style: { fontSize: '12px', color: '#60a5fa', marginTop: '4px' }, children: ["Brand Signatures: ", _jsx("strong", { children: status.matchedBrand })] }))] }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }, children: [_jsx("span", { style: { color: '#94a3b8' }, children: "Risk Confidence Score" }), _jsxs("span", { style: { fontWeight: 700 }, children: [status.riskScore, " / 100"] })] }), _jsx("div", { style: { height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }, children: _jsx("div", { style: {
                                height: '100%',
                                width: `${status.riskScore}%`,
                                background: isSafe ? '#10b981' : status.riskLevel === 'SUSPICIOUS' ? '#f59e0b' : '#ef4444',
                                transition: 'width 0.3s ease',
                            } }) })] }), _jsxs("div", { style: {
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    fontSize: '12.5px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    marginBottom: '16px',
                }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx("span", { style: { color: '#94a3b8' }, children: "Password Inputs:" }), _jsx("span", { children: status.hasPasswordField ? 'Detected' : 'None' })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx("span", { style: { color: '#94a3b8' }, children: "External Form Submits:" }), _jsx("span", { children: status.externalFormActions.length > 0 ? `${status.externalFormActions.length} External` : 'None (Safe)' })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx("span", { style: { color: '#94a3b8' }, children: "Anti-Evasion Delayed:" }), _jsx("span", { children: status.delayedRenderDetected ? '⚠️ Delayed Render' : 'Standard' })] })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: [_jsx("button", { onClick: handleOpenAssistant, style: {
                            background: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                        }, children: "\uD83D\uDCAC Consult Sentinel AI Assistant" }), !isSafe && !status.bypassed && (_jsx("button", { onClick: handleBypass, style: {
                            background: 'transparent',
                            color: '#94a3b8',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            padding: '8px 14px',
                            fontSize: '12px',
                            cursor: 'pointer',
                        }, children: "Bypass Warning on This Page" }))] })] }));
};
