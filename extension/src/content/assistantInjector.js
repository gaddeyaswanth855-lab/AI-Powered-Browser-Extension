import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AssistantTriggerButton } from '../ui/AssistantTriggerButton';
import { AssistantDrawer } from '../ui/AssistantDrawer';
let assistantRootNode = null;
let reactRoot = null;
let globalSetIsOpen = null;
const AssistantHostComponent = ({ telemetryContext, backendUrl, initialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);
    globalSetIsOpen = setIsOpen;
    return (_jsxs(_Fragment, { children: [_jsx(AssistantTriggerButton, { onClick: () => setIsOpen(true), isOpen: isOpen, riskLevel: telemetryContext.riskLevel }), _jsx(AssistantDrawer, { isOpen: isOpen, onClose: () => setIsOpen(false), telemetryContext: telemetryContext, backendUrl: backendUrl })] }));
};
export function injectAssistantDrawer(props) {
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
    reactRoot.render(_jsx(AssistantHostComponent, { telemetryContext: props.telemetryContext, backendUrl: props.backendUrl, initialOpen: props.initialOpen }));
}
export function openAssistant() {
    if (globalSetIsOpen) {
        globalSetIsOpen(true);
    }
}
export function removeAssistantDrawer() {
    if (reactRoot) {
        try {
            reactRoot.unmount();
        }
        catch {
            // Ignored
        }
        reactRoot = null;
    }
    if (assistantRootNode && assistantRootNode.parentNode) {
        assistantRootNode.parentNode.removeChild(assistantRootNode);
        assistantRootNode = null;
    }
}
