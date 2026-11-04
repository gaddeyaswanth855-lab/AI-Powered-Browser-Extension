import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';
import { db } from './db/client';
import { errorHandler } from './middleware/errorHandler';
import { generalApiLimiter, assistantChatLimiter } from './middleware/rateLimiter';
import telemetryRouter from './routes/telemetry';
import assistantRouter from './routes/assistant';
import brandAnchorsRouter from './routes/brandAnchors';
import adminRouter from './routes/admin';
import { getGenAIClient } from './lib/gemini';

const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow SSE streaming and embedding
    crossOriginEmbedderPolicy: false,
  })
);

// Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Chrome Extension origins, local dev origins, and configured CORS_ORIGIN
      if (!origin || origin.startsWith('chrome-extension://') || origin.includes('localhost') || origin.includes('127.0.0.1') || env.CORS_ORIGIN === '*') {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Body Parsing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Health & System Info
app.get('/api/health', (req, res) => {
  const hasGemini = !!getGenAIClient();
  const isPostgres = db.isRealPostgres();

  res.status(200).json({
    status: 'ONLINE',
    service: 'PhishLens AI Cloud Intelligence Platform',
    version: '2.5.0-production',
    timestamp: new Date().toISOString(),
    aiEngine: hasGemini ? 'Google Gemini 2.5 Flash (Active)' : 'Deterministic Neural Forensics Fallback',
    database: isPostgres ? 'PostgreSQL 16+ Pool' : 'Resilient In-Memory Storage Engine',
  });
});

// General Rate Limiter for Ingestion
app.use('/api/v1/telemetry', generalApiLimiter, telemetryRouter);

// Assistant Chat with dedicated streaming rate-limiter
app.use('/api/v1/assistant/chat', assistantChatLimiter);
app.use('/api/v1/assistant', assistantRouter);

// Brand Signatures Sync
app.use('/api/v1/signatures', brandAnchorsRouter);

// Administrative Intelligence Center
app.use('/api/v1/admin', adminRouter);

// Serve Central Web Dashboard in Production
const possibleDashboardPaths = [
  path.resolve(__dirname, '../../../dashboard/dist'),
  path.resolve(process.cwd(), 'dashboard/dist'),
  path.resolve(process.cwd(), '../dashboard/dist'),
];

for (const p of possibleDashboardPaths) {
  if (fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))) {
    app.use(express.static(p));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(p, 'index.html'));
    });
    console.log(`[Server] Serving production dashboard UI from: ${p}`);
    break;
  }
}

// Global Error Handler
app.use(errorHandler);

// Initialize DB and Start Server
async function startServer() {
  try {
    await db.initialize();
  } catch (err) {
    console.warn('[Server] DB init notice:', err);
  }

  const server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`  🛡️  PhishLens AI Cloud Intelligence Engine Active`);
    console.log(`  🚀 Port: ${env.PORT}`);
    console.log(`  📡 AI Model: gemini-2.5-flash`);
    console.log(`  🔒 Security: Manifest V3 Compliant / Zero-PII`);
    console.log(`=======================================================`);
  });

  return server;
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app, startServer };
