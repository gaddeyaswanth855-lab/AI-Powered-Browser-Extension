export function inspectDOM() {
    const currentHost = window.location.hostname.toLowerCase();
    const currentOrigin = window.location.origin.toLowerCase();
    const forms = [];
    const externalFormActionsSet = new Set();
    // 1. Audit all <form> elements
    const formElements = document.querySelectorAll('form');
    formElements.forEach((form) => {
        const rawAction = form.getAttribute('action') || '';
        let targetDomain = currentHost;
        let isCrossDomain = false;
        if (rawAction) {
            try {
                const resolved = new URL(rawAction, window.location.href);
                targetDomain = resolved.hostname.toLowerCase();
                // Check if cross-domain
                if (targetDomain !== currentHost && !targetDomain.endsWith(`.${currentHost}`)) {
                    isCrossDomain = true;
                    externalFormActionsSet.add(resolved.origin);
                }
            }
            catch {
                // malformed action URL or javascript: URI
                if (rawAction.startsWith('javascript:') || rawAction.startsWith('data:')) {
                    isCrossDomain = true;
                    externalFormActionsSet.add(rawAction.substring(0, 30));
                }
            }
        }
        const inputElements = form.querySelectorAll('input');
        const inputNames = [];
        let hasPasswordInForm = false;
        inputElements.forEach((input) => {
            const type = (input.getAttribute('type') || 'text').toLowerCase();
            const name = (input.getAttribute('name') || input.getAttribute('id') || '').substring(0, 50);
            if (name)
                inputNames.push(name);
            if (type === 'password' || name.toLowerCase().includes('pass') || input.getAttribute('autocomplete')?.includes('password')) {
                hasPasswordInForm = true;
            }
        });
        forms.push({
            action: rawAction,
            method: (form.getAttribute('method') || 'GET').toUpperCase(),
            targetDomain,
            isCrossDomain,
            hasPasswordField: hasPasswordInForm,
            inputNames,
        });
    });
    // 2. Audit standalone or Shadow DOM password fields
    let globalHasPassword = forms.some((f) => f.hasPasswordField);
    if (!globalHasPassword) {
        const standalonePasswords = document.querySelectorAll('input[type="password"]');
        if (standalonePasswords.length > 0) {
            globalHasPassword = true;
        }
    }
    // Pierce open shadow roots to discover hidden password inputs
    if (!globalHasPassword) {
        const allNodes = document.querySelectorAll('*');
        for (const node of Array.from(allNodes)) {
            if (node.shadowRoot) {
                const shadowPass = node.shadowRoot.querySelectorAll('input[type="password"]');
                if (shadowPass.length > 0) {
                    globalHasPassword = true;
                    break;
                }
            }
        }
    }
    // 3. Detect Fullscreen / Large Iframe Overlays (>80% of viewport)
    let iframeOverlayDetected = false;
    const iframes = document.querySelectorAll('iframe');
    const vpWidth = window.innerWidth || document.documentElement.clientWidth;
    const vpHeight = window.innerHeight || document.documentElement.clientHeight;
    iframes.forEach((frame) => {
        try {
            const rect = frame.getBoundingClientRect();
            const wPercent = (rect.width / vpWidth) * 100;
            const hPercent = (rect.height / vpHeight) * 100;
            const src = frame.getAttribute('src') || '';
            if (wPercent >= 75 && hPercent >= 75) {
                if (src && !src.startsWith('/') && !src.includes(currentHost)) {
                    iframeOverlayDetected = true;
                }
            }
        }
        catch {
            // Ignored for detached elements
        }
    });
    // 4. Candidate Brand Logo Image Discovery
    const candidateLogoUrls = [];
    const candidateSelectors = [
        'header img',
        'nav img',
        'img[src*="logo" i]',
        'img[alt*="logo" i]',
        'img[class*="logo" i]',
        'img[id*="logo" i]',
        '.logo img',
        '#logo img',
        'a[class*="brand" i] img',
        'a[class*="logo" i] img',
    ];
    const matchedImgs = document.querySelectorAll(candidateSelectors.join(', '));
    matchedImgs.forEach((img) => {
        const src = img.currentSrc || img.src;
        if (src && (src.startsWith('http') || src.startsWith('data:image')) && !candidateLogoUrls.includes(src)) {
            candidateLogoUrls.push(src);
        }
    });
    return {
        forms,
        hasPasswordField: globalHasPassword,
        externalFormActions: Array.from(externalFormActionsSet),
        iframeOverlayDetected,
        candidateLogoUrls: candidateLogoUrls.slice(0, 5), // Keep top 5 candidates
    };
}
