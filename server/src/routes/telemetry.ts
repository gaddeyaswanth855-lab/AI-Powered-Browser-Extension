import { Router, Request, Response } from 'express';
import { EvaluateRequestSchema, UserReportRequestSchema } from '../../../shared/validators';
import { executeForensicTriage } from '../services/forensicEngine';
import { db } from '../db/client';
import crypto from 'crypto';

const router = Router();

router.post('/evaluate', async (req: Request, res: Response) => {
  const parseResult = EvaluateRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid telemetry evaluation payload',
      details: parseResult.error.format(),
    });
  }

  const payload = parseResult.data;

  try {
    const report = await executeForensicTriage(payload);

    // If score >= 35 (Suspicious or High Risk), persist incident to database
    if (report.riskScore >= 35) {
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
      const ipHash = crypto.createHash('sha256').update(clientIp).digest('hex').substring(0, 32);

      // Match brand ID if present
      let matchedBrandId: string | null = null;
      if (report.brandImpersonated) {
        const brandMatch = await db.query(
          'SELECT id FROM brand_anchors WHERE brand_name = $1 LIMIT 1',
          [report.brandImpersonated]
        );
        if (brandMatch.rows.length > 0) {
          matchedBrandId = brandMatch.rows[0].id;
        }
      }

      await db.query(
        `INSERT INTO threat_incidents (
          id, detected_url, normalized_domain, matched_brand_id, risk_score,
          risk_level, heuristic_breakdown, dom_telemetry, ai_forensic_analysis,
          client_ip_hash, user_agent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
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
        ]
      );
    }

    return res.status(200).json(report);
  } catch (error: any) {
    console.error('[Telemetry] Evaluation error:', error);
    return res.status(500).json({ error: 'Failed to process forensic telemetry', message: error.message });
  }
});

router.post('/report', async (req: Request, res: Response) => {
  const parseResult = UserReportRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid user report payload',
      details: parseResult.error.format(),
    });
  }

  const { incidentId, url, userVerdict, userComments } = parseResult.data;

  try {
    const reportId = crypto.randomUUID();
    const reporterToken = crypto.randomBytes(16).toString('hex');

    await db.query(
      `INSERT INTO user_reports (id, incident_id, submitted_url, user_verdict, user_comments, reporter_token, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')`,
      [reportId, incidentId || null, url, userVerdict, userComments || null, reporterToken]
    );

    return res.status(201).json({
      success: true,
      reportId,
      message: 'Report logged successfully for forensic analysis.',
    });
  } catch (error: any) {
    console.error('[Telemetry] Report logging error:', error);
    return res.status(500).json({ error: 'Failed to log report', message: error.message });
  }
});

export default router;
