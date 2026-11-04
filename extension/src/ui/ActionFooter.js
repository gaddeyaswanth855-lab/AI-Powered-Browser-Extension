import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ActionFooter = ({ onLeaveSite, onBypass, onOpenAssistant, onReport, riskLevel, }) => {
    return (_jsxs("div", { style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: '12px',
            flexWrap: 'wrap',
        }, children: [_jsxs("div", { style: { display: 'flex', gap: '8px', alignItems: 'center' }, children: [_jsx("button", { onClick: onLeaveSite, style: {
                            background: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 18px',
                            fontWeight: 700,
                            fontSize: '13.5px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                        }, children: "\uD83D\uDEE1\uFE0F Leave Site Immediately" }), _jsx("button", { onClick: onOpenAssistant, style: {
                            background: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            fontWeight: 600,
                            fontSize: '13px',
                            cursor: 'pointer',
                        }, children: "\uD83D\uDCAC Ask PhishLens Sentinel" })] }), _jsxs("div", { style: { display: 'flex', gap: '10px', alignItems: 'center' }, children: [_jsx("button", { onClick: onReport, style: {
                            background: 'transparent',
                            color: '#9ca3af',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            cursor: 'pointer',
                        }, children: "Report Issue" }), _jsx("button", { onClick: onBypass, style: {
                            background: 'transparent',
                            color: '#6b7280',
                            border: 'none',
                            fontSize: '12px',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }, children: "I accept the risk (Bypass)" })] })] }));
};
