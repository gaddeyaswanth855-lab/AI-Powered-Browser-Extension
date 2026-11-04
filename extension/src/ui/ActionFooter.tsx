import React from 'react';

interface ActionFooterProps {
  onLeaveSite: () => void;
  onBypass: () => void;
  onOpenAssistant: () => void;
  onReport: () => void;
  riskLevel: string;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({
  onLeaveSite,
  onBypass,
  onOpenAssistant,
  onReport,
  riskLevel,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={onLeaveSite}
          style={{
            background: '#dc2626',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
          }}
        >
          🛡️ Leave Site Immediately
        </button>

        <button
          onClick={onOpenAssistant}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          💬 Ask PhishLens Sentinel
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={onReport}
          style={{
            background: 'transparent',
            color: '#9ca3af',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Report Issue
        </button>

        <button
          onClick={onBypass}
          style={{
            background: 'transparent',
            color: '#6b7280',
            border: 'none',
            fontSize: '12px',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          I accept the risk (Bypass)
        </button>
      </div>
    </div>
  );
};
