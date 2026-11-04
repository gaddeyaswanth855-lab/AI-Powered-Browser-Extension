import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ModalShield } from '../ui/ModalShield';
import { ThreatRiskLevel } from '../../../shared/validators';

let modalRootNode: HTMLElement | null = null;
let reactRoot: Root | null = null;

export function injectModalShield(props: {
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
  cssText: string;
}): void {
  // If already injected, remove or re-render
  if (modalRootNode) {
    removeModalShield();
  }

  modalRootNode = document.createElement('phishlens-modal-root');
  modalRootNode.style.position = 'fixed';
  modalRootNode.style.zIndex = '2147483647';
  modalRootNode.style.top = '0';
  modalRootNode.style.left = '0';
  modalRootNode.style.width = '100vw';
  modalRootNode.style.height = '100vh';
  modalRootNode.style.pointerEvents = 'auto';

  // Attach isolated closed ShadowRoot
  const shadow = modalRootNode.attachShadow({ mode: 'closed' });

  // Inject Styles
  const styleEl = document.createElement('style');
  styleEl.textContent = props.cssText;
  shadow.appendChild(styleEl);

  const mountContainer = document.createElement('div');
  shadow.appendChild(mountContainer);

  document.documentElement.appendChild(modalRootNode);

  reactRoot = createRoot(mountContainer);
  reactRoot.render(
    <ModalShield
      score={props.score}
      riskLevel={props.riskLevel}
      matchedBrand={props.matchedBrand}
      currentHost={props.currentHost}
      evidence={props.evidence}
      externalFormActions={props.externalFormActions}
      delayedRenderDetected={props.delayedRenderDetected}
      userExplanation={props.userExplanation}
      onLeaveSite={props.onLeaveSite}
      onBypass={() => {
        removeModalShield();
        props.onBypass();
      }}
      onOpenAssistant={() => {
        removeModalShield();
        props.onOpenAssistant();
      }}
      onReport={props.onReport}
    />
  );
}

export function removeModalShield(): void {
  if (reactRoot) {
    try {
      reactRoot.unmount();
    } catch {
      // Ignored
    }
    reactRoot = null;
  }
  if (modalRootNode && modalRootNode.parentNode) {
    modalRootNode.parentNode.removeChild(modalRootNode);
    modalRootNode = null;
  }
}
