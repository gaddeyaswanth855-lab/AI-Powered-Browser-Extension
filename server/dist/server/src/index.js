"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const client_1 = require("./db/client");
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const telemetry_1 = __importDefault(require("./routes/telemetry"));
const assistant_1 = __importDefault(require("./routes/assistant"));
const brandAnchors_1 = __importDefault(require("./routes/brandAnchors"));
const admin_1 = __importDefault(require("./routes/admin"));
const gemini_1 = require("./lib/gemini");
const app = (0, express_1.default)();
exports.app = app;
// Security Headers
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Allow SSE streaming and embedding
    crossOriginEmbedderPolicy: false,
}));
// Cross-Origin Resource Sharing (CORS)
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow Chrome Extension origins, local dev origins, and configured CORS_ORIGIN
        if (!origin || origin.startsWith('chrome-extension://') || origin.includes('localhost') || origin.includes('127.0.0.1') || env_1.env.CORS_ORIGIN === '*') {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
}));
// Body Parsing
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
// Health & System Info
app.get('/api/health', (req, res) => {
    const hasGemini = !!(0, gemini_1.getGenAIClient)();
    const isPostgres = client_1.db.isRealPostgres();
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
app.use('/api/v1/telemetry', rateLimiter_1.generalApiLimiter, telemetry_1.default);
// Assistant Chat with dedicated streaming rate-limiter
app.use('/api/v1/assistant/chat', rateLimiter_1.assistantChatLimiter);
app.use('/api/v1/assistant', assistant_1.default);
// Brand Signatures Sync
app.use('/api/v1/signatures', brandAnchors_1.default);
// Administrative Intelligence Center
app.use('/api/v1/admin', admin_1.default);
// Global Error Handler
app.use(errorHandler_1.errorHandler);
// Initialize DB and Start Server
async function startServer() {
    try {
        await client_1.db.initialize();
    }
    catch (err) {
        console.warn('[Server] DB init notice:', err);
    }
    const server = app.listen(env_1.env.PORT, '0.0.0.0', () => {
        console.log(`=======================================================`);
        console.log(`  🛡️  PhishLens AI Cloud Intelligence Engine Active`);
        console.log(`  🚀 Port: ${env_1.env.PORT}`);
        console.log(`  📡 AI Model: gemini-2.5-flash`);
        console.log(`  🔒 Security: Manifest V3 Compliant / Zero-PII`);
        console.log(`=======================================================`);
    });
    return server;
}
if (process.env.NODE_ENV !== 'test') {
    startServer();
}
