import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const EvidenceList = ({ evidence, matchedBrand, currentHost, externalFormActions = [], delayedRenderDetected = false, }) => {
    return (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '14px' }, children: [matchedBrand && (_jsxs("div", { style: {
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    fontSize: '13px',
                    color: '#fca5a5',
                }, children: [_jsx("div", { style: { fontWeight: 700, marginBottom: '4px', color: '#ef4444' }, children: "\u26A0\uFE0F Identity Spoofing Conflict" }), _jsxs("div", { children: ["Asserted Target Brand: ", _jsx("strong", { children: matchedBrand })] }), _jsxs("div", { children: ["Current Unverified Host: ", _jsx("strong", { style: { color: '#ffffff' }, children: currentHost })] })] })), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: [_jsx("div", { style: { fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }, children: "Forensic Indicators" }), _jsx("ul", { style: { listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }, children: evidence.map((item, idx) => (_jsxs("li", { style: {
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                fontSize: '13px',
                                color: '#e5e7eb',
                                lineHeight: '1.4',
                                background: '#1f2937',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                borderLeft: '3px solid #ef4444',
                            }, children: [_jsx("span", { style: { color: '#ef4444', fontWeight: 'bold' }, children: "\u2022" }), _jsx("span", { children: item })] }, idx))) })] }), externalFormActions.length > 0 && (_jsxs("div", { style: {
                    fontSize: '12px',
                    color: '#fbbf24',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                }, children: [_jsx("strong", { children: "Data Exfiltration Route:" }), " Submitting credentials to", ' ', _jsx("code", { style: { background: '#374151', padding: '2px 4px', borderRadius: '4px', color: '#fff' }, children: externalFormActions.join(', ') })] })), delayedRenderDetected && (_jsxs("div", { style: {
                    fontSize: '12px',
                    color: '#a78bfa',
                    background: 'rgba(167, 139, 250, 0.1)',
                    border: '1px solid rgba(167, 139, 250, 0.3)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                }, children: [_jsx("strong", { children: "Delayed-Render Evasion:" }), " Phishing payload injected late via JavaScript to evade automated scanners."] }))] }));
};
