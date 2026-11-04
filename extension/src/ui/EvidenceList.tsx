import React from 'react';

interface EvidenceListProps {
  evidence: string[];
  matchedBrand?: string | null;
  currentHost: string;
  externalFormActions?: string[];
  delayedRenderDetected?: boolean;
}

export const EvidenceList: React.FC<EvidenceListProps> = ({
  evidence,
  matchedBrand,
  currentHost,
  externalFormActions = [],
  delayedRenderDetected = false,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Brand Host Mismatch Callout */}
      {matchedBrand && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '13px',
            color: '#fca5a5',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '4px', color: '#ef4444' }}>
            ⚠️ Identity Spoofing Conflict
          </div>
          <div>
            Asserted Target Brand: <strong>{matchedBrand}</strong>
          </div>
          <div>
            Current Unverified Host: <strong style={{ color: '#ffffff' }}>{currentHost}</strong>
          </div>
        </div>
      )}

      {/* Forensic Evidence Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Forensic Indicators
        </div>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {evidence.map((item, idx) => (
            <li
              key={idx}
              style={{
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
              }}
            >
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* External Form Targets Warning */}
      {externalFormActions.length > 0 && (
        <div
          style={{
            fontSize: '12px',
            color: '#fbbf24',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '10px 14px',
            borderRadius: '8px',
          }}
        >
          <strong>Data Exfiltration Route:</strong> Submitting credentials to{' '}
          <code style={{ background: '#374151', padding: '2px 4px', borderRadius: '4px', color: '#fff' }}>
            {externalFormActions.join(', ')}
          </code>
        </div>
      )}

      {delayedRenderDetected && (
        <div
          style={{
            fontSize: '12px',
            color: '#a78bfa',
            background: 'rgba(167, 139, 250, 0.1)',
            border: '1px solid rgba(167, 139, 250, 0.3)',
            padding: '10px 14px',
            borderRadius: '8px',
          }}
        >
          <strong>Delayed-Render Evasion:</strong> Phishing payload injected late via JavaScript to evade automated scanners.
        </div>
      )}
    </div>
  );
};
