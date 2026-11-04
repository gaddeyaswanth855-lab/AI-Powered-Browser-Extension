"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeForensicTriage = executeForensicTriage;
const gemini_1 = require("../lib/gemini");
const heuristicScorer_1 = require("./heuristicScorer");
const crypto_1 = __importDefault(require("crypto"));
const SYSTEM_INSTRUCTION = `You are PhishLens Neural Forensics Engine, an autonomous security auditor specialized in web application deception, credential harvesting detection, and brand visual spoofing.

Your job is to critically evaluate real-time telemetry extracted from a live web page (URL, DOM structural hierarchy, form submit destinations, homoglyphs, and perceptual visual signatures).

Analyze the evidence systematically:
1. Examine if the page host domain legitimately represents the asserted visual brand.
2. Check for deceptive homoglyphs, brand keyword squatting, or suspicious top-level domains (TLDs).
3. Verify if credential inputs (passwords, MFA tokens, credit card fields) route to anomalous or third-party origins.
4. Detect indicators of delayed-render or DOM cloaking behavior.
5. Provide a deterministic verdict: SAFE, SUSPICIOUS, or HIGH_RISK.
6. Provide plain, jargon-free explanations directly addressing the end user.

You MUST strictly output valid JSON complying with the provided schema.`;
const RESPONSE_SCHEMA = {
    type: 'object',
    properties: {
        verdict: {
            type: 'string',
            enum: ['SAFE', 'SUSPICIOUS', 'HIGH_RISK'],
        },
        riskScore: {
            type: 'integer',
            minimum: 0,
            maximum: 100,
        },
        brandImpersonated: {
            type: 'string',
            nullable: true,
        },
        primaryEvidence: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
        },
        userExplanation: {
            type: 'string',
        },
        technicalDetails: {
            type: 'object',
            properties: {
                domainLegitimacy: { type: 'string' },
                formDestinationSafety: { type: 'string' },
                visualSimilarityConfidence: { type: 'number' },
                antiEvasionFlagged: { type: 'boolean' },
            },
            required: ['domainLegitimacy', 'formDestinationSafety', 'visualSimilarityConfidence', 'antiEvasionFlagged'],
        },
    },
    required: ['verdict', 'riskScore', 'primaryEvidence', 'userExplanation', 'technicalDetails'],
};
async function executeForensicTriage(payload) {
    const heuristicResult = (0, heuristicScorer_1.evaluateClientTelemetry)(payload);
    const incidentId = crypto_1.default.randomUUID();
    // If score < 35, return fast heuristic triage verdict directly without unnecessary AI latency
    if (heuristicResult.score < 35) {
        return {
            incidentId,
            verdict: 'SAFE',
            riskScore: heuristicResult.score,
            brandImpersonated: null,
            primaryEvidence: ['No deceptive brand impersonation or malicious form actions detected.'],
            userExplanation: 'This website displays standard legitimate characteristics with no active threat indicators.',
            technicalDetails: {
                domainLegitimacy: 'Legitimate domain structure with standard entropy.',
                formDestinationSafety: 'All forms target verified same-origin endpoints.',
                visualSimilarityConfidence: 0.0,
                antiEvasionFlagged: false,
            },
        };
    }
    // Score >= 35: Attempt Gemini 2.5 Flash Neural Forensic Evaluation
    const client = (0, gemini_1.getGenAIClient)();
    if (client) {
        try {
            const prompt = `Analyze the following web page telemetry for visual and structural phishing indicators:

TARGET URL: ${payload.url}
DOMAIN: ${payload.domain}
MATCHED VISUAL BRAND SIGNATURE: ${payload.matchedBrand || 'None detected'}
HAMMING DISTANCE: ${payload.hammingDistance ?? 'N/A'}
FORM ATTRIBUTES: ${JSON.stringify(payload.forms, null, 2)}
PASSWORD FIELDS DETECTED: ${payload.hasPasswordField}
EXTERNAL FORM DESTINATIONS: ${JSON.stringify(payload.externalFormActions)}
MUTATION / DELAYED RENDER DETECTED: ${payload.delayedRenderDetected}
HEURISTIC SCORE: ${heuristicResult.score}

Synthesize these indicators and generate an explainable forensic verdict.`;
            const response = await gemini_1.ai.models.generateContent({
                model: gemini_1.GEMINI_MODEL,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    responseMimeType: 'application/json',
                    responseSchema: RESPONSE_SCHEMA,
                    temperature: 0.1,
                },
                contents: prompt,
            });
            const text = response.text;
            if (text) {
                const parsed = JSON.parse(text);
                return {
                    incidentId,
                    verdict: parsed.verdict,
                    riskScore: Math.min(100, Math.max(parsed.riskScore, heuristicResult.score)),
                    brandImpersonated: parsed.brandImpersonated || payload.matchedBrand || null,
                    primaryEvidence: parsed.primaryEvidence || heuristicResult.evidence,
                    userExplanation: parsed.userExplanation || 'Suspicious structural and visual indicators detected.',
                    technicalDetails: parsed.technicalDetails || {
                        domainLegitimacy: `Domain ${payload.domain} does not match expected identity.`,
                        formDestinationSafety: payload.externalFormActions.length > 0 ? 'External destination flagged.' : 'Suspicious.',
                        visualSimilarityConfidence: payload.hammingDistance !== null && payload.hammingDistance !== undefined ? Math.max(0, 1 - payload.hammingDistance / 64) : 0,
                        antiEvasionFlagged: payload.delayedRenderDetected,
                    },
                };
            }
        }
        catch (err) {
            console.warn('[ForensicEngine] Gemini AI call failed or timed out. Falling back to deterministic heuristics:', err);
        }
    }
    // Deterministic Fallback on error / offline
    const isHighRisk = heuristicResult.score >= 70;
    const brandName = payload.matchedBrand || 'Known Brand';
    const explanation = isHighRisk
        ? `CRITICAL THREAT: This page attempts to deceive you by impersonating ${brandName}. The current website host (${payload.domain}) is not authorized by ${brandName}. Any passwords or credentials entered here will be harvested by unauthorized third parties.`
        : `WARNING: This page exhibits anomalous behavior typically associated with phishing attacks, including mismatched submission destinations or deceptive domain naming.`;
    return {
        incidentId,
        verdict: heuristicResult.verdict,
        riskScore: heuristicResult.score,
        brandImpersonated: payload.matchedBrand || null,
        primaryEvidence: heuristicResult.evidence,
        userExplanation: explanation,
        technicalDetails: {
            domainLegitimacy: `Hostname '${payload.domain}' exhibits anomalous structural distance to legitimate brand anchors.`,
            formDestinationSafety: payload.externalFormActions.length > 0
                ? `External submission destinations detected: ${payload.externalFormActions.join(', ')}`
                : 'Insecure credential input on untrusted host.',
            visualSimilarityConfidence: payload.hammingDistance !== null && payload.hammingDistance !== undefined
                ? Math.max(0, parseFloat((1 - payload.hammingDistance / 64).toFixed(2)))
                : 0.85,
            antiEvasionFlagged: payload.delayedRenderDetected,
        },
    };
}
