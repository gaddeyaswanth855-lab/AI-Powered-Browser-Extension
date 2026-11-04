import React from 'react';
import { HeuristicBadge } from './HeuristicBadge';
import { EvidenceList } from './EvidenceList';
import { ActionFooter } from './ActionFooter';
import { ThreatRiskLevel } from '../../../shared/validators';

interface ModalShieldProps {
  score: number;
  riskLevel: ThreatRiskLevel;
  matchedBrand?: string | null;
  currentHost: string;
  evidence: string[];
  externalFormActions?: string[];
  delayedRenderDetected?: boolean;
  userExplanation?: string;
  onLeaveSite: () => void;
  onBypass: () => void;
  onOpenAssistant: () => void;
  onReport: () => void;
}

export const ModalShield: React.FC<ModalShieldProps> = ({
  score,
  riskLevel,
  matchedBrand,
  currentHost,
  evidence,
  externalFormActions = [],
  delayedRenderDetected = false,
  userExplanation,
  onLeaveSite,
  onBypass,
  onOpenAssistant,
  onReport,
}) => {
  const isHighRisk = riskLevel === 'HIGH_RISK';

  return (
    <div className="pl-modal-backdrop">
      <div className="pl-modal-card">
        {/* Modal Header */}
        <div className="pl-modal-header">
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: isHighRisk ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              border: `1px solid ${isHighRisk ? '#ef4444' : '#f59e0b'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            {isHighRisk ? '🛑' : '⚠️'}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                {isHighRisk ? 'PhishLens: Deceptive Impersonation Intercepted' : 'PhishLens: Suspicious Brand Replica Flagged'}
              </h2>
            </div>
            <HeuristicBadge score={score} riskLevel={riskLevel} />
          </div>
        </div>

        {/* Modal Body */}
        <div className="pl-modal-body">
          {userExplanation && (
            <div
              style={{
                fontSize: '14px',
                color: '#f3f4f6',
                lineHeight: '1.5',
                background: '#1f2937',
                padding: '14px 18px',
                borderRadius: '10px',
                borderLeft: `4px solid ${isHighRisk ? '#ef4444' : '#f59e0b'}`,
              }}
            >
              {userExplanation}
            </div>
          )}

          <EvidenceList
            evidence={evidence}
            matchedBrand={matchedBrand}
            currentHost={currentHost}
            externalFormActions={externalFormActions}
            delayedRenderDetected={delayedRenderDetected}
          />
        </div>

        {/* Modal Footer */}
        <div className="pl-modal-footer">
          <ActionFooter
            onLeaveSite={onLeaveSite}
            onBypass={onBypass}
            onOpenAssistant={onOpenAssistant}
            onReport={onReport}
            riskLevel={riskLevel}
          />
        </div>
      </div>
    </div>
  );
};
