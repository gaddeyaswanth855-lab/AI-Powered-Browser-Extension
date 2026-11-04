"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gemini_1 = require("../lib/gemini");
const client_1 = require("../db/client");
const validators_1 = require("../../../shared/validators");
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
// Fallback response generator when external API is unreachable or unconfigured
function generateFallbackResponse(userMessage, telemetry) {
    const lower = userMessage.toLowerCase();
    const brand = telemetry.matchedBrand || 'the legitimate service';
    const domain = telemetry.domain;
    const isHighRisk = telemetry.riskScore >= 70;
    if (lower.includes('why') && (lower.includes('flag') || lower.includes('block') || lower.includes('suspicious') || lower.includes('risk'))) {
        return `### PhishLens Sentinel Threat Breakdown

This page was flagged with a **Risk Score of ${telemetry.riskScore}/100 (${telemetry.riskLevel})** for the following critical indicators:

1. **Brand Visual Impersonation:** The page mimics the look and styling of **${brand}**, but the actual domain is \`${domain}\`.
2. **Form Target Anomalies:** ${telemetry.externalFormActions && telemetry.externalFormActions.length > 0
            ? `Form submissions route your credentials to external servers: \`${telemetry.externalFormActions.join(', ')}\`.`
            : `Credential input fields are positioned on an unverified third-party host.`}
3. **Evasion Indicators:** ${telemetry.delayedRenderDetected
            ? 'The page used delayed script injection (rendering forms 1.5s+ after page load) to evade signature scanners.'
            : 'The domain does not belong to authorized brand infrastructure.'}

**Recommendation:** Do not enter any passwords, credit card numbers, or MFA codes. Close this tab immediately.`;
    }
    if (lower.includes('browse') || lower.includes('safe to look') || lower.includes('view') || lower.includes('without logging in')) {
        if (isHighRisk) {
            return `### Can You Safely Browse?

**No, we strongly recommend closing this page entirely.** 

Even if you avoid typing your password:
- Phishing sites frequently host **drive-by malware**, malicious tracking pixels, and browser exploit kits.
- Fake session popups may trick you into authorizing browser permissions or notifications.
- The host domain \`${domain}\` is completely untrusted.

If you must access **${brand}**, open a new browser tab and navigate directly to the verified official address.`;
        }
        else {
            return `### Caution Advised

While passively viewing this page without entering credentials presents lower immediate risk than submitting a form, this page scored **${telemetry.riskScore}/100**.

- **Do NOT enter credentials, personal info, or download files.**
- If you were sent here via a link in an email or SMS, it is likely an impersonation campaign.`;
        }
    }
    if (lower.includes('submitted') || lower.includes('already entered') || lower.includes('typed my password') || lower.includes('entered my password') || lower.includes('compromised')) {
        return `### 🚨 EMERGENCY CREDENTIAL COMPROMISE PROTOCOL

If you entered credentials or MFA codes on this page, act immediately:

1. **Change Your Password Now:**
   - Go directly to the official **${brand}** website from a known-safe device or bookmark.
   - Do NOT use any links provided on this suspicious page.
2. **Revoke Active Sessions & App Permissions:**
   - In your account settings, select "Sign out of all other sessions / devices".
3. **Verify Two-Factor Authentication (2FA/MFA):**
   - Ensure MFA is enabled. If SMS was used, upgrade to an Authenticator App (Google Authenticator, Microsoft Authenticator) or security key.
4. **Inspect Recovery Info:**
   - Verify that your recovery email and phone number have not been altered.
5. **Report to IT / Security (If Enterprise):**
   - If this is a work-related account, notify your security operations center (SOC) or IT department immediately.`;
    }
    return `### PhishLens Sentinel Security Assessment

I am analyzing your query against the live security telemetry for \`${domain}\` (Risk Score: **${telemetry.riskScore}/100**).

- **Current Host:** \`${domain}\`
- **Targeted Brand:** **${brand}**
- **Action Route:** ${telemetry.externalFormActions && telemetry.externalFormActions.length > 0 ? telemetry.externalFormActions.join(', ') : 'Host form destination'}

This page shows clear hallmarks of deception. Please refrain from entering any personal details. Let me know if you would like me to explain how to verify legitimate URLs or guide you through account hardening.`;
}
router.post('/chat', async (req, res) => {
    const parseResult = validators_1.AssistantChatRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.format() });
    }
    const { sessionId, incidentId, message, telemetryContext } = parseResult.data;
    // Set Server-Sent Events Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();
    try {
        // 1. Ensure assistant chat session exists
        const sessionCheck = await client_1.db.query('SELECT id FROM assistant_chat_sessions WHERE id = $1', [sessionId]);
        if (sessionCheck.rows.length === 0) {
            await client_1.db.query('INSERT INTO assistant_chat_sessions (id, incident_id, session_token, current_url) VALUES ($1, $2, $3, $4)', [sessionId, incidentId || null, crypto_1.default.randomBytes(16).toString('hex'), telemetryContext.url]);
        }
        // 2. Fetch conversation history for this session
        const previousMessages = await client_1.db.query('SELECT role, content FROM assistant_chat_messages WHERE session_id = $1 ORDER BY created_at ASC', [sessionId]);
        // 3. Persist incoming user message
        await client_1.db.query('INSERT INTO assistant_chat_messages (session_id, role, content) VALUES ($1, $2, $3)', [sessionId, 'user', message]);
        // 4. Check if Gemini client is active
        const client = (0, gemini_1.getGenAIClient)();
        let fullAssistantResponse = '';
        if (client) {
            try {
                const systemInstruction = `You are PhishLens Sentinel, an embedded browser AI cybersecurity assistant and compassionate security peer.
The user is currently on the following webpage:
- URL: ${telemetryContext.url}
- Domain: ${telemetryContext.domain}
- Matched Brand: ${telemetryContext.matchedBrand || "None detected"}
- Risk Score: ${telemetryContext.riskScore}/100 (${telemetryContext.riskLevel})
- Form Submit Destinations: ${JSON.stringify(telemetryContext.externalFormActions)}
- Delayed Render Flagged: ${telemetryContext.delayedRenderDetected}

Guidelines:
1. Guide the user calmly through ambiguous or flagged security incidents.
2. Ground explanations in the verified telemetry provided above.
3. Never use dismissive jargon; translate technical risks into clear, actionable consequences.
4. If the user indicates they submitted passwords or sensitive info, provide a prioritized, step-by-step emergency action plan.
5. Never validate or recommend proceeding on a HIGH_RISK page. Keep answers concise, highly practical, and protective.`;
                const contents = [
                    ...previousMessages.rows.map((m) => ({
                        role: m.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: m.content }],
                    })),
                    { role: 'user', parts: [{ text: message }] },
                ];
                const responseStream = await gemini_1.ai.models.generateContentStream({
                    model: gemini_1.GEMINI_MODEL,
                    config: {
                        systemInstruction,
                        temperature: 0.2,
                    },
                    contents,
                });
                for await (const chunk of responseStream) {
                    const chunkObj = chunk;
                    const text = typeof chunkObj.text === 'function' ? chunkObj.text() : chunkObj.text;
                    if (text) {
                        fullAssistantResponse += text;
                        res.write(`data: ${JSON.stringify({ text })}\n\n`);
                    }
                }
            }
            catch (geminiError) {
                console.warn('[Assistant] Gemini stream error, transitioning to fallback:', geminiError);
                // If stream already started partially, don't re-run from scratch; otherwise generate fallback
                if (!fullAssistantResponse) {
                    const fallbackText = generateFallbackResponse(message, telemetryContext);
                    fullAssistantResponse = fallbackText;
                    // Stream in chunks to preserve SSE client behavior
                    const words = fallbackText.split(' ');
                    for (let i = 0; i < words.length; i += 4) {
                        const part = words.slice(i, i + 4).join(' ') + ' ';
                        res.write(`data: ${JSON.stringify({ text: part })}\n\n`);
                        await new Promise((r) => setTimeout(r, 20));
                    }
                }
            }
        }
        else {
            // Deterministic Sentinel guidance engine
            const fallbackText = generateFallbackResponse(message, telemetryContext);
            fullAssistantResponse = fallbackText;
            const words = fallbackText.split(' ');
            for (let i = 0; i < words.length; i += 4) {
                const part = words.slice(i, i + 4).join(' ') + ' ';
                res.write(`data: ${JSON.stringify({ text: part })}\n\n`);
                await new Promise((r) => setTimeout(r, 20));
            }
        }
        // 5. Persist assistant reply in database
        await client_1.db.query('INSERT INTO assistant_chat_messages (session_id, role, content) VALUES ($1, $2, $3)', [sessionId, 'assistant', fullAssistantResponse]);
        res.write('data: [DONE]\n\n');
        res.end();
    }
    catch (error) {
        console.error('[Assistant] Fatal streaming error:', error);
        res.write(`data: ${JSON.stringify({ error: 'PhishLens Sentinel encountered an error analyzing your request.' })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
    }
});
router.get('/history/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    try {
        const result = await client_1.db.query('SELECT id, role, content, created_at FROM assistant_chat_messages WHERE session_id = $1 ORDER BY created_at ASC', [sessionId]);
        return res.status(200).json({ sessionId, messages: result.rows });
    }
    catch (error) {
        console.error('[Assistant] History fetch error:', error);
        return res.status(500).json({ error: 'Failed to retrieve conversation history', message: error.message });
    }
});
exports.default = router;
