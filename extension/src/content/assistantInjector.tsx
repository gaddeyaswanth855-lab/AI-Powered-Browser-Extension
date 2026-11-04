import React, { useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { AssistantTriggerButton } from '../ui/AssistantTriggerButton';
import { AssistantDrawer } from '../ui/AssistantDrawer';
import { TelemetryContext, ThreatRiskLevel } from '../../../shared/validators';

let assistantRootNode: HTMLElement | null = null;
let reactRoot: Root | null = null;

let globalSetIsOpen: ((open: boolean) => void) | null = null;

const AssistantHostComponent: React.FC<{
  telemetryContext: TelemetryContext;
  backendUrl?: string;
  initialOpen?: boolean;
}> = ({ telemetryContext, backendUrl, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  globalSetIsOpen = setIsOpen;

  return (
    <>
      <AssistantTriggerButton
        onClick={() => setIsOpen(true)}
        isOpen={isOpen}
        riskLevel={telemetryContext.riskLevel}
      />
      <AssistantDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        telemetryContext={telemetryContext}
        backendUrl={backendUrl}
      />
    </>
  );
};

export function injectAssistantDrawer(props: {
  telemetryContext: TelemetryContext;
  backendUrl?: string;
  cssText: string;
  initialOpen?: boolean;
}): void {
  if (assistantRootNode) {
    if (props.initialOpen && globalSetIsOpen) {
      globalSetIsOpen(true);
    }
    return;
  }

  assistantRootNode = document.createElement('phishlens-assistant-root');
  assistantRootNode.style.position = 'fixed';
  assistantRootNode.style.zIndex = '2147483646';
  assistantRootNode.style.bottom = '0';
  assistantRootNode.style.right = '0';
  assistantRootNode.style.pointerEvents = 'auto';

  const shadow = assistantRootNode.attachShadow({ mode: 'closed' });

  const styleEl = document.createElement('style');
  styleEl.textContent = props.cssText;
  shadow.appendChild(styleEl);

  const mountContainer = document.createElement('div');
  shadow.appendChild(mountContainer);

  document.documentElement.appendChild(assistantRootNode);

  reactRoot = createRoot(mountContainer);
  reactRoot.render(
    <AssistantHostComponent
      telemetryContext={props.telemetryContext}
      backendUrl={props.backendUrl}
      initialOpen={props.initialOpen}
    />
  );
}

export function openAssistant(): void {
  if (globalSetIsOpen) {
    globalSetIsOpen(true);
  }
}

export function removeAssistantDrawer(): void {
  if (reactRoot) {
    try {
      reactRoot.unmount();
    } catch {
      // Ignored
    }
    reactRoot = null;
  }
  if (assistantRootNode && assistantRootNode.parentNode) {
    assistantRootNode.parentNode.removeChild(assistantRootNode);
    assistantRootNode = null;
  }
}
