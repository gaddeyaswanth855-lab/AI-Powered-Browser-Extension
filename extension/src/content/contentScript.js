import { inspectDOM } from './domInspector';
import { evaluateClientSignals } from '../shared/heuristics';
import { MutationMonitor } from './mutationMonitor';
import { injectModalShield, removeModalShield } from './modalInjector';
import { injectAssistantDrawer, openAssistant } from './assistantInjector';
import { SHADOW_STYLES } from '../ui/stylesText';
const BACKEND_URL = 'http://localhost:5000';
let currentStatus = null;
let isBypassed = false;
let mutationMonitor = null;
// Prevent form submission on compromised pages
function freezeFormInteractions() {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
        form.addEventListener('submit', (e) => {
            if (!isBypassed) {
                e.preventDefault();
                e.stopPropagation();
                alert('🛡️ PhishLens Protection: Form submission blocked on this unverified or spoofed website.');
            }
        }, true);
    });
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        input.setAttribute('autocomplete', 'off');
    });
}
// Perform full security evaluation
async function runPageAudit(isDelayedRender = false) {
    const currentUrl = window.location.href;
    const currentDomain = window.location.hostname.toLowerCase();
    // Skip browser internals and extensions
    if (currentUrl.startsWith('chrome://') || currentUrl.startsWith('chrome-extension://') || currentUrl.startsWith('about:')) {
        return;
    }
    // 1. Audit DOM Structure
    const audit = inspectDOM();
    // 2. Compute pHash if candidate logo images are present
    let computedPHash = null;
    if (audit.candidateLogoUrls.length > 0) {
        try {
            const hashResponse = await new Promise((resolve) => {
                chrome.runtime.sendMessage({
                    type: 'COMPUTE_PHASH',
                    payload: { imageUrl: audit.candidateLogoUrls[0] },
                }, (res) => resolve(res));
                // Fallback timeout in case service worker takes too long
                setTimeout(() => resolve(null), 300);
            });
            if (hashResponse && hashResponse.phash) {
                computedPHash = hashResponse.phash;
            }
        }
        catch {
            // Continue with heuristic analysis
        }
    }
    // 3. Fast Client-Side Triage (<250ms)
    const clientEval = evaluateClientSignals({
        url: currentUrl,
        domain: currentDomain,
        externalFormActions: audit.externalFormActions,
        hasPasswordField: audit.hasPasswordField,
        computedPHash,
        delayedRenderDetected: isDelayedRender,
        iframeOverlayDetected: audit.iframeOverlayDetected,
    });
    let incidentResponse = null;
    // 4. If Suspicious or High Risk, execute server-orchestrated Gemini validation
    if (clientEval.score >= 35 && !isBypassed) {
        try {
            const resp = await fetch(`${BACKEND_URL}/api/v1/telemetry/evaluate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: currentUrl,
                    domain: currentDomain,
                    matchedBrand: clientEval.matchedBrand,
                    hammingDistance: clientEval.hammingDistance,
                    forms: audit.forms,
                    hasPasswordField: audit.hasPasswordField,
                    externalFormActions: audit.externalFormActions,
                    delayedRenderDetected: isDelayedRender,
                    clientHeuristicScore: clientEval.score,
                    viewportPHash: computedPHash || undefined,
                }),
            });
            if (resp.ok) {
                incidentResponse = await resp.json();
            }
        }
        catch (err) {
            console.warn('[PhishLens] Telemetry backend offline or unreachable:', err);
        }
    }
    const finalScore = incidentResponse ? incidentResponse.riskScore : clientEval.score;
    const finalRiskLevel = incidentResponse ? incidentResponse.verdict : clientEval.riskLevel;
    const finalEvidence = incidentResponse ? incidentResponse.primaryEvidence : clientEval.evidence;
    const userExplanation = incidentResponse?.userExplanation;
    currentStatus = {
        url: currentUrl,
        domain: currentDomain,
        riskScore: finalScore,
        riskLevel: finalRiskLevel,
        matchedBrand: clientEval.matchedBrand,
        hammingDistance: clientEval.hammingDistance,
        delayedRenderDetected: isDelayedRender,
        externalFormActions: audit.externalFormActions,
        forms: audit.forms,
        hasPasswordField: audit.hasPasswordField,
        evaluatedAt: new Date().toISOString(),
        bypassed: isBypassed,
        incidentResponse,
    };
    // 5. Notify Background Worker to update Badge
    chrome.runtime.sendMessage({
        type: 'PAGE_EVALUATED',
        payload: currentStatus,
    });
    // 6. Inject UI components
    const telemetryContext = {
        url: currentUrl,
        domain: currentDomain,
        matchedBrand: clientEval.matchedBrand,
        riskScore: finalScore,
        riskLevel: finalRiskLevel,
        externalFormActions: audit.externalFormActions,
        delayedRenderDetected: isDelayedRender,
    };
    // Always mount PhishLens Sentinel AI Assistant Drawer & Trigger Pill
    injectAssistantDrawer({
        telemetryContext,
        backendUrl: BACKEND_URL,
        cssText: SHADOW_STYLES,
        initialOpen: false,
    });
    // If High Risk or Suspicious, inject blocking Modal Shield
    if (finalRiskLevel !== 'SAFE' && !isBypassed) {
        freezeFormInteractions();
        injectModalShield({
            score: finalScore,
            riskLevel: finalRiskLevel,
            matchedBrand: clientEval.matchedBrand,
            currentHost: currentDomain,
            evidence: finalEvidence,
            externalFormActions: audit.externalFormActions,
            delayedRenderDetected: isDelayedRender,
            userExplanation,
            cssText: SHADOW_STYLES,
            onLeaveSite: () => {
                window.location.href = 'about:blank';
            },
            onBypass: () => {
                isBypassed = true;
                removeModalShield();
                chrome.runtime.sendMessage({ type: 'BYPASS_PAGE' });
            },
            onOpenAssistant: () => {
                openAssistant();
            },
            onReport: async () => {
                try {
                    await fetch(`${BACKEND_URL}/api/v1/telemetry/report`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            incidentId: incidentResponse?.incidentId,
                            url: currentUrl,
                            userVerdict: 'FALSE_POSITIVE',
                            userComments: 'Submitted via Modal Shield',
                        }),
                    });
                    alert('Report logged successfully. Our threat analysis team will review this site.');
                }
                catch {
                    alert('Unable to submit report to backend.');
                }
            },
        });
    }
}
// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_PAGE_STATUS') {
        sendResponse(currentStatus);
        return;
    }
    if (message.type === 'TOGGLE_ASSISTANT') {
        openAssistant();
        sendResponse({ success: true });
        return;
    }
    if (message.type === 'BYPASS_PAGE') {
        isBypassed = true;
        removeModalShield();
        sendResponse({ success: true });
        return;
    }
});
// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        runPageAudit(false);
    });
}
else {
    runPageAudit(false);
}
// Start MutationObserver watching for delayed rendering evasions (1.5s - 5s+)
mutationMonitor = new MutationMonitor((delayed) => {
    if (!isBypassed) {
        console.log('[PhishLens] DOM mutation observed. Re-evaluating page (delayed:', delayed, ')');
        runPageAudit(delayed);
    }
});
mutationMonitor.start();
