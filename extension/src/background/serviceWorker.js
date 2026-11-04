// Tab State Cache (tabId -> PageStatus)
const tabStatusCache = new Map();
let isOffscreenCreating = false;
// Ensure offscreen document exists for HTML5 Canvas perceptual hashing
async function ensureOffscreenDocument() {
    if (isOffscreenCreating)
        return;
    const offscreenUrl = chrome.runtime.getURL('src/offscreen/offscreen.html');
    // Check if offscreen document already exists
    const existingContexts = await chrome.runtime.getContexts?.({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [offscreenUrl],
    });
    if (existingContexts && existingContexts.length > 0) {
        return;
    }
    isOffscreenCreating = true;
    try {
        await chrome.offscreen.createDocument({
            url: 'src/offscreen/offscreen.html',
            reasons: [chrome.offscreen.Reason.DOM_PARSER, chrome.offscreen.Reason.BLOBS],
            justification: 'Compute client-side Perceptual Hashing (pHash) on suspicious logo assets without sending raw images',
        });
    }
    catch (err) {
        // Check if error is simply document already exists
        if (!err.message?.includes('Only a single offscreen document may be created')) {
            console.warn('[ServiceWorker] Offscreen document creation notice:', err);
        }
    }
    finally {
        isOffscreenCreating = false;
    }
}
// Update Chrome Extension Toolbar Badge
function updateBadgeForTab(tabId, status) {
    let badgeText = '';
    let badgeColor = '#10B981'; // Green (Safe)
    if (status.riskLevel === 'HIGH_RISK') {
        badgeText = `${status.riskScore}`;
        badgeColor = '#EF4444'; // Red
    }
    else if (status.riskLevel === 'SUSPICIOUS') {
        badgeText = `${status.riskScore}`;
        badgeColor = '#F59E0B'; // Amber
    }
    else {
        badgeText = '✓';
        badgeColor = '#10B981'; // Green
    }
    chrome.action.setBadgeText({ tabId, text: badgeText });
    chrome.action.setBadgeBackgroundColor({ tabId, color: badgeColor });
}
// Handle Tab Removal
chrome.tabs.onRemoved.addListener((tabId) => {
    tabStatusCache.delete(tabId);
});
// Main Message Routing Hub
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const tabId = sender.tab?.id;
    switch (message.type) {
        case 'PAGE_EVALUATED': {
            if (tabId && message.payload) {
                tabStatusCache.set(tabId, message.payload);
                updateBadgeForTab(tabId, message.payload);
            }
            sendResponse({ success: true });
            break;
        }
        case 'GET_PAGE_STATUS': {
            const requestedTabId = message.payload?.tabId || tabId;
            if (requestedTabId && tabStatusCache.has(requestedTabId)) {
                sendResponse(tabStatusCache.get(requestedTabId));
            }
            else {
                sendResponse(null);
            }
            break;
        }
        case 'COMPUTE_PHASH': {
            ensureOffscreenDocument()
                .then(() => {
                chrome.runtime.sendMessage(message, (response) => {
                    sendResponse(response);
                });
            })
                .catch((err) => {
                sendResponse({ phash: '0000000000000000', error: err.message });
            });
            return true; // Keep channel open for async response
        }
        case 'BYPASS_PAGE': {
            if (tabId && tabStatusCache.has(tabId)) {
                const current = tabStatusCache.get(tabId);
                current.bypassed = true;
                tabStatusCache.set(tabId, current);
                chrome.action.setBadgeText({ tabId, text: 'BYPASS' });
                chrome.action.setBadgeBackgroundColor({ tabId, color: '#6B7280' });
            }
            sendResponse({ success: true });
            break;
        }
        default:
            break;
    }
});
// Lifecycle initialization
chrome.runtime.onInstalled.addListener(() => {
    console.log('[PhishLens AI] Service Worker installed and ready.');
    ensureOffscreenDocument().catch(console.warn);
});
export {};
