"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validators_1 = require("../../../shared/validators");
const forensicEngine_1 = require("../services/forensicEngine");
const client_1 = require("../db/client");
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
router.post('/evaluate', async (req, res) => {
    const parseResult = validators_1.EvaluateRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            error: 'Invalid telemetry evaluation payload',
            details: parseResult.error.format(),
        });
    }
    const payload = parseResult.data;
    try {
        const report = await (0, forensicEngine_1.executeForensicTriage)(payload);
        // If score >= 35 (Suspicious or High Risk), persist incident to database
        if (report.riskScore >= 35) {
            const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
            const ipHash = crypto_1.default.createHash('sha256').update(clientIp).digest('hex').substring(0, 32);
            // Match brand ID if present
            let matchedBrandId = null;
            if (report.brandImpersonated) {
                const brandMatch = await client_1.db.query('SELECT id FROM brand_anchors WHERE brand_name = $1 LIMIT 1', [report.brandImpersonated]);
                if (brandMatch.rows.length > 0) {
                    matchedBrandId = brandMatch.rows[0].id;
                }
            }
            await client_1.db.query(`INSERT INTO threat_incidents (
          id, detected_url, normalized_domain, matched_brand_id, risk_score,
          risk_level, heuristic_breakdown, dom_telemetry, ai_forensic_analysis,
          client_ip_hash, user_agent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [
                report.incidentId,
                payload.url,
                payload.domain,
                matchedBrandId,
                report.riskScore,
                report.verdict,
                JSON.stringify(report.technicalDetails),
                JSON.stringify({
                    forms: payload.forms,
                    hasPasswordField: payload.hasPasswordField,
                    externalFormActions: payload.externalFormActions,
                    delayedRenderDetected: payload.delayedRenderDetected,
                }),
                JSON.stringify({
                    userExplanation: report.userExplanation,
                    primaryEvidence: report.primaryEvidence,
                }),
                ipHash,
                payload.userAgent || req.headers['user-agent'] || null,
            ]);
        }
        return res.status(200).json(report);
    }
    catch (error) {
        console.error('[Telemetry] Evaluation error:', error);
        return res.status(500).json({ error: 'Failed to process forensic telemetry', message: error.message });
    }
});
router.post('/report', async (req, res) => {
    const parseResult = validators_1.UserReportRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            error: 'Invalid user report payload',
            details: parseResult.error.format(),
        });
    }
    const { incidentId, url, userVerdict, userComments } = parseResult.data;
    try {
        const reportId = crypto_1.default.randomUUID();
        const reporterToken = crypto_1.default.randomBytes(16).toString('hex');
        await client_1.db.query(`INSERT INTO user_reports (id, incident_id, submitted_url, user_verdict, user_comments, reporter_token, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')`, [reportId, incidentId || null, url, userVerdict, userComments || null, reporterToken]);
        return res.status(201).json({
            success: true,
            reportId,
            message: 'Report logged successfully for forensic analysis.',
        });
    }
    catch (error) {
        console.error('[Telemetry] Report logging error:', error);
        return res.status(500).json({ error: 'Failed to log report', message: error.message });
    }
});
exports.default = router;
