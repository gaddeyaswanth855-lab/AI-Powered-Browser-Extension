import React from 'react';
import { ThreatRiskLevel } from '../../../shared/validators';

interface AssistantTriggerButtonProps {
  onClick: () => void;
  isOpen: boolean;
  riskLevel: ThreatRiskLevel;
}

export const AssistantTriggerButton: React.FC<AssistantTriggerButtonProps> = ({ onClick, isOpen, riskLevel }) => {
  if (isOpen) return null;

  let borderColor = '#3b82f6';
  let dotColor = '#60a5fa';

  if (riskLevel === 'HIGH_RISK') {
    borderColor = '#ef4444';
    dotColor = '#f87171';
  } else if (riskLevel === 'SUSPICIOUS') {
    borderColor = '#f59e0b';
    dotColor = '#fbbf24';
  }

  return (
    <button
      onClick={onClick}
      className="pl-assistant-pill"
      style={{
        borderColor,
      }}
      title="Open PhishLens Sentinel Security Assistant"
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          display: 'inline-block',
        }}
      />
      <span>PhishLens Sentinel</span>
    </button>
  );
};
