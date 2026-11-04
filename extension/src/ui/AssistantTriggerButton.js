import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const AssistantTriggerButton = ({ onClick, isOpen, riskLevel }) => {
    if (isOpen)
        return null;
    let borderColor = '#3b82f6';
    let dotColor = '#60a5fa';
    if (riskLevel === 'HIGH_RISK') {
        borderColor = '#ef4444';
        dotColor = '#f87171';
    }
    else if (riskLevel === 'SUSPICIOUS') {
        borderColor = '#f59e0b';
        dotColor = '#fbbf24';
    }
    return (_jsxs("button", { onClick: onClick, className: "pl-assistant-pill", style: {
            borderColor,
        }, title: "Open PhishLens Sentinel Security Assistant", children: [_jsx("span", { style: {
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: dotColor,
                    display: 'inline-block',
                } }), _jsx("span", { children: "PhishLens Sentinel" })] }));
};
