import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HeuristicBadge } from './HeuristicBadge';
import { EvidenceList } from './EvidenceList';
import { ActionFooter } from './ActionFooter';
export const ModalShield = ({ score, riskLevel, matchedBrand, currentHost, evidence, externalFormActions = [], delayedRenderDetected = false, userExplanation, onLeaveSite, onBypass, onOpenAssistant, onReport, }) => {
    const isHighRisk = riskLevel === 'HIGH_RISK';
    return (_jsx("div", { className: "pl-modal-backdrop", children: _jsxs("div", { className: "pl-modal-card", children: [_jsxs("div", { className: "pl-modal-header", children: [_jsx("div", { style: {
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: isHighRisk ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                border: `1px solid ${isHighRisk ? '#ef4444' : '#f59e0b'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                            }, children: isHighRisk ? '🛑' : '⚠️' }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }, children: _jsx("h2", { style: { fontSize: '18px', fontWeight: 800, color: '#ffffff' }, children: isHighRisk ? 'PhishLens: Deceptive Impersonation Intercepted' : 'PhishLens: Suspicious Brand Replica Flagged' }) }), _jsx(HeuristicBadge, { score: score, riskLevel: riskLevel })] })] }), _jsxs("div", { className: "pl-modal-body", children: [userExplanation && (_jsx("div", { style: {
                                fontSize: '14px',
                                color: '#f3f4f6',
                                lineHeight: '1.5',
                                background: '#1f2937',
                                padding: '14px 18px',
                                borderRadius: '10px',
                                borderLeft: `4px solid ${isHighRisk ? '#ef4444' : '#f59e0b'}`,
                            }, children: userExplanation })), _jsx(EvidenceList, { evidence: evidence, matchedBrand: matchedBrand, currentHost: currentHost, externalFormActions: externalFormActions, delayedRenderDetected: delayedRenderDetected })] }), _jsx("div", { className: "pl-modal-footer", children: _jsx(ActionFooter, { onLeaveSite: onLeaveSite, onBypass: onBypass, onOpenAssistant: onOpenAssistant, onReport: onReport, riskLevel: riskLevel }) })] }) }));
};
