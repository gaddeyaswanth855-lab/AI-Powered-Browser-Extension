import React from 'react';
import { ThreatRiskLevel } from '../../../shared/validators';

interface HeuristicBadgeProps {
  score: number;
  riskLevel: ThreatRiskLevel;
}

export const HeuristicBadge: React.FC<HeuristicBadgeProps> = ({ score, riskLevel }) => {
  let bgColor = 'rgba(16, 185, 129, 0.2)';
  let borderColor = '#10B981';
  let textColor = '#34D399';
  let label = 'VERIFIED SAFE';

  if (riskLevel === 'HIGH_RISK') {
    bgColor = 'rgba(239, 68, 68, 0.2)';
    borderColor = '#EF4444';
    textColor = '#F87171';
    label = 'CRITICAL PHISHING RISK';
  } else if (riskLevel === 'SUSPICIOUS') {
    bgColor = 'rgba(245, 158, 11, 0.2)';
    borderColor = '#F59E0B';
    textColor = '#FBBF24';
    label = 'SUSPICIOUS REPLICA DETECTED';
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '9999px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        color: textColor,
        fontSize: '12.5px',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: borderColor,
          boxShadow: `0 0 8px ${borderColor}`,
        }}
      />
      <span>{label} ({score}/100)</span>
    </div>
  );
};
