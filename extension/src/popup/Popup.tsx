import React, { useEffect, useState } from 'react';
import { PageStatus } from '../shared/types';
import { HeuristicBadge } from '../ui/HeuristicBadge';

export const Popup: React.FC = () => {
  const [status, setStatus] = useState<PageStatus | null>(null);
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
          } else {
            setStatus(response);
            setLoading(false);
          }
        });
      } else {
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
    return (
      <div style={{ width: '340px', padding: '24px', background: '#0f172a', color: '#f8fafc', textAlign: 'center' }}>
        <div>Auditing active page telemetry...</div>
      </div>
    );
  }

  if (!status) {
    return (
      <div style={{ width: '340px', padding: '24px', background: '#0f172a', color: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ fontSize: '20px' }}>🛡️</div>
          <h2 style={{ fontSize: '16px', fontWeight: 700 }}>PhishLens AI</h2>
        </div>
        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
          No active telemetry available for this page (internal browser or blank tab).
        </p>
      </div>
    );
  }

  const isSafe = status.riskLevel === 'SAFE';

  return (
    <div
      style={{
        width: '360px',
        background: '#0f172a',
        color: '#f8fafc',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🛡️</span>
          <span style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em' }}>PhishLens AI</span>
        </div>
        <HeuristicBadge score={status.riskScore} riskLevel={status.riskLevel} />
      </div>

      {/* Target URL Card */}
      <div
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '14px',
        }}
      >
        <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
          Audited Host
        </div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', wordBreak: 'break-all', marginTop: '2px' }}>
          {status.domain}
        </div>
        {status.matchedBrand && (
          <div style={{ fontSize: '12px', color: '#60a5fa', marginTop: '4px' }}>
            Brand Signatures: <strong>{status.matchedBrand}</strong>
          </div>
        )}
      </div>

      {/* Score Meter */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
          <span style={{ color: '#94a3b8' }}>Risk Confidence Score</span>
          <span style={{ fontWeight: 700 }}>{status.riskScore} / 100</span>
        </div>
        <div style={{ height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${status.riskScore}%`,
              background: isSafe ? '#10b981' : status.riskLevel === 'SUSPICIOUS' ? '#f59e0b' : '#ef4444',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Quick Diagnostics */}
      <div
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '10px',
          padding: '12px 14px',
          fontSize: '12.5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#94a3b8' }}>Password Inputs:</span>
          <span>{status.hasPasswordField ? 'Detected' : 'None'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#94a3b8' }}>External Form Submits:</span>
          <span>{status.externalFormActions.length > 0 ? `${status.externalFormActions.length} External` : 'None (Safe)'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#94a3b8' }}>Anti-Evasion Delayed:</span>
          <span>{status.delayedRenderDetected ? '⚠️ Delayed Render' : 'Standard'}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={handleOpenAssistant}
          style={{
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
          }}
        >
          💬 Consult Sentinel AI Assistant
        </button>

        {!isSafe && !status.bypassed && (
          <button
            onClick={handleBypass}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              border: '1px solid #475569',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Bypass Warning on This Page
          </button>
        )}
      </div>
    </div>
  );
};
