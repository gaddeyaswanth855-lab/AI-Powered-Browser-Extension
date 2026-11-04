"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.getDatabaseAdapter = getDatabaseAdapter;
const pg_1 = require("pg");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
// In-Memory Storage Fallback for zero-dependency local runs or offline environments
class InMemoryDatabaseAdapter {
    brandAnchors = [
        {
            id: '11111111-1111-4111-a111-111111111111',
            brand_name: 'Google',
            canonical_domains: ['google.com', 'accounts.google.com', 'gmail.com'],
            category: 'IDENTITY',
            phash_signature: 'a1b2c3d4e5f60718',
            logo_svg_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '22222222-2222-4222-a222-222222222222',
            brand_name: 'PayPal',
            canonical_domains: ['paypal.com', 'paypal-prepaid.com'],
            category: 'FINANCIAL',
            phash_signature: '8f7e6d5c4b3a2109',
            logo_svg_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '33333333-3333-4333-a333-333333333333',
            brand_name: 'Microsoft',
            canonical_domains: ['microsoft.com', 'login.microsoftonline.com', 'live.com'],
            category: 'IDENTITY',
            phash_signature: '1122334455667788',
            logo_svg_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '44444444-4444-4444-a444-444444444444',
            brand_name: 'Apple',
            canonical_domains: ['apple.com', 'icloud.com'],
            category: 'IDENTITY',
            phash_signature: '99aabbccddeeff00',
            logo_svg_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '55555555-5555-4555-a555-555555555555',
            brand_name: 'Chase',
            canonical_domains: ['chase.com'],
            category: 'FINANCIAL',
            phash_signature: '1234567890abcdef',
            logo_svg_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '66666666-6666-4666-a666-666666666666',
            brand_name: 'Amazon',
            canonical_domains: ['amazon.com', 'sellercentral.amazon.com', 'aws.amazon.com'],
            category: 'COMMERCE',
            phash_signature: 'fedcba0987654321',
            logo_svg_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '77777777-7777-4777-a777-777777777777',
            brand_name: 'Coinbase',
            canonical_domains: ['coinbase.com'],
            category: 'CRYPTO',
            phash_signature: 'abcdef0123456789',
            logo_svg_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '88888888-8888-4888-a888-888888888888',
            brand_name: 'Meta',
            canonical_domains: ['facebook.com', 'instagram.com', 'whatsapp.com'],
            category: 'SOCIAL',
            phash_signature: '1029384756afbecd',
            logo_svg_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ];
    threatIncidents = [];
    assistantSessions = [];
    assistantMessages = [];
    userReports = [];
    whitelistedDomains = [
        { id: crypto_1.default.randomUUID(), domain: 'google.com', reason: 'Canonical search and identity engine', is_global: true, created_at: new Date().toISOString() },
        { id: crypto_1.default.randomUUID(), domain: 'github.com', reason: 'Canonical software hosting provider', is_global: true, created_at: new Date().toISOString() },
        { id: crypto_1.default.randomUUID(), domain: 'microsoft.com', reason: 'Canonical enterprise identity provider', is_global: true, created_at: new Date().toISOString() },
        { id: crypto_1.default.randomUUID(), domain: 'apple.com', reason: 'Canonical technology provider', is_global: true, created_at: new Date().toISOString() },
        { id: crypto_1.default.randomUUID(), domain: 'paypal.com', reason: 'Canonical payment gateway', is_global: true, created_at: new Date().toISOString() },
        { id: crypto_1.default.randomUUID(), domain: 'chase.com', reason: 'Canonical banking institution', is_global: true, created_at: new Date().toISOString() },
        { id: crypto_1.default.randomUUID(), domain: 'amazon.com', reason: 'Canonical commerce platform', is_global: true, created_at: new Date().toISOString() },
    ];
    async initialize() {
        console.log('[DB] Initialized in-memory fallback store with preloaded brand anchors and whitelists.');
    }
    isRealPostgres() {
        return false;
    }
    async query(text, params = []) {
        const cleanSql = text.trim();
        // 1. SELECT role, content FROM assistant_chat_messages WHERE session_id = $1
        if (cleanSql.includes('FROM assistant_chat_messages WHERE session_id = $1')) {
            const sessionId = params[0];
            const msgs = this.assistantMessages
                .filter((m) => m.session_id === sessionId)
                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                .map((m) => ({ role: m.role, content: m.content, created_at: m.created_at }));
            return { rows: msgs, rowCount: msgs.length };
        }
        // 2. INSERT INTO assistant_chat_messages
        if (cleanSql.startsWith('INSERT INTO assistant_chat_messages')) {
            const id = crypto_1.default.randomUUID();
            const session_id = params[0];
            const role = params[1];
            const content = params[2];
            const metadata = params[3] ? (typeof params[3] === 'string' ? JSON.parse(params[3]) : params[3]) : {};
            const record = {
                id,
                session_id,
                role,
                content,
                metadata,
                created_at: new Date().toISOString(),
            };
            this.assistantMessages.push(record);
            return { rows: [record], rowCount: 1 };
        }
        // 3. INSERT INTO assistant_chat_sessions
        if (cleanSql.startsWith('INSERT INTO assistant_chat_sessions')) {
            const id = params[0] || crypto_1.default.randomUUID();
            const incident_id = params[1] || null;
            const session_token = params[2] || crypto_1.default.randomBytes(16).toString('hex');
            const current_url = params[3] || '';
            const record = {
                id,
                incident_id,
                session_token,
                current_url,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            const existingIdx = this.assistantSessions.findIndex((s) => s.id === id);
            if (existingIdx >= 0) {
                this.assistantSessions[existingIdx] = record;
            }
            else {
                this.assistantSessions.push(record);
            }
            return { rows: [record], rowCount: 1 };
        }
        // 4. SELECT FROM assistant_chat_sessions WHERE id = $1
        if (cleanSql.includes('FROM assistant_chat_sessions WHERE id = $1')) {
            const match = this.assistantSessions.find((s) => s.id === params[0]);
            return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
        }
        // 5. INSERT INTO threat_incidents
        if (cleanSql.startsWith('INSERT INTO threat_incidents')) {
            const id = params[0] || crypto_1.default.randomUUID();
            const detected_url = params[1];
            const normalized_domain = params[2];
            const matched_brand_id = params[3] || null;
            const risk_score = params[4];
            const risk_level = params[5];
            const heuristic_breakdown = typeof params[6] === 'string' ? JSON.parse(params[6]) : params[6];
            const dom_telemetry = typeof params[7] === 'string' ? JSON.parse(params[7]) : params[7];
            const ai_forensic_analysis = typeof params[8] === 'string' ? (params[8] ? JSON.parse(params[8]) : null) : params[8];
            const client_ip_hash = params[9] || null;
            const user_agent = params[10] || null;
            const record = {
                id,
                detected_url,
                normalized_domain,
                matched_brand_id,
                risk_score,
                risk_level,
                heuristic_breakdown,
                dom_telemetry,
                ai_forensic_analysis,
                client_ip_hash,
                user_agent,
                created_at: new Date().toISOString(),
            };
            this.threatIncidents.unshift(record);
            return { rows: [record], rowCount: 1 };
        }
        // 6. SELECT threat_incidents
        if (cleanSql.includes('FROM threat_incidents') && cleanSql.includes('WHERE id = $1')) {
            const match = this.threatIncidents.find((t) => t.id === params[0]);
            return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
        }
        if (cleanSql.includes('FROM threat_incidents') && !cleanSql.includes('COUNT(')) {
            let filtered = [...this.threatIncidents];
            if (params.length > 0 && params[0]) {
                filtered = filtered.filter((t) => t.risk_level === params[0]);
            }
            return { rows: filtered, rowCount: filtered.length };
        }
        // 7. COUNT queries
        if (cleanSql.includes('COUNT(*)') && cleanSql.includes('FROM threat_incidents')) {
            if (cleanSql.includes("risk_level = 'HIGH_RISK'")) {
                const count = this.threatIncidents.filter((t) => t.risk_level === 'HIGH_RISK').length;
                return { rows: [{ count: String(count) }], rowCount: 1 };
            }
            return { rows: [{ count: String(this.threatIncidents.length) }], rowCount: 1 };
        }
        // 8. brand_anchors queries
        if (cleanSql.includes('FROM brand_anchors')) {
            if (cleanSql.includes('WHERE id = $1')) {
                const match = this.brandAnchors.find((b) => b.id === params[0]);
                return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
            }
            if (cleanSql.includes('WHERE brand_name = $1')) {
                const match = this.brandAnchors.find((b) => b.brand_name.toLowerCase() === params[0].toLowerCase());
                return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
            }
            return { rows: this.brandAnchors, rowCount: this.brandAnchors.length };
        }
        if (cleanSql.startsWith('INSERT INTO brand_anchors')) {
            const id = crypto_1.default.randomUUID();
            const record = {
                id,
                brand_name: params[0],
                canonical_domains: params[1],
                category: params[2] || 'OTHER',
                phash_signature: params[3],
                logo_svg_url: params[4] || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            this.brandAnchors.push(record);
            return { rows: [record], rowCount: 1 };
        }
        // 9. whitelisted_domains
        if (cleanSql.includes('FROM whitelisted_domains')) {
            if (cleanSql.includes('WHERE domain = $1')) {
                const match = this.whitelistedDomains.find((w) => w.domain === params[0]);
                return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
            }
            return { rows: this.whitelistedDomains, rowCount: this.whitelistedDomains.length };
        }
        if (cleanSql.startsWith('INSERT INTO whitelisted_domains')) {
            const id = crypto_1.default.randomUUID();
            const record = {
                id,
                domain: params[0],
                reason: params[1] || null,
                is_global: params[2] ?? true,
                created_at: new Date().toISOString(),
            };
            this.whitelistedDomains.push(record);
            return { rows: [record], rowCount: 1 };
        }
        // 10. user_reports
        if (cleanSql.startsWith('INSERT INTO user_reports')) {
            const id = params[0] || crypto_1.default.randomUUID();
            const record = {
                id,
                incident_id: params[1] || null,
                submitted_url: params[2],
                user_verdict: params[3],
                user_comments: params[4] || null,
                reporter_token: params[5] || null,
                status: 'PENDING',
                created_at: new Date().toISOString(),
                reviewed_at: null,
            };
            this.userReports.push(record);
            return { rows: [record], rowCount: 1 };
        }
        if (cleanSql.includes('FROM user_reports')) {
            return { rows: this.userReports, rowCount: this.userReports.length };
        }
        return { rows: [], rowCount: 0 };
    }
}
// PostgreSQL Implementation
class PostgresDatabaseAdapter {
    pool;
    constructor(connectionString) {
        this.pool = new pg_1.Pool({
            connectionString,
            ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });
    }
    isRealPostgres() {
        return true;
    }
    async initialize() {
        const schemaPath = path_1.default.resolve(__dirname, 'schema.sql');
        if (fs_1.default.existsSync(schemaPath)) {
            const schemaSql = fs_1.default.readFileSync(schemaPath, 'utf8');
            await this.pool.query(schemaSql);
            console.log('[DB] PostgreSQL schema successfully applied.');
        }
    }
    async query(text, params) {
        const res = await this.pool.query(text, params);
        return {
            rows: res.rows,
            rowCount: res.rowCount ?? 0,
        };
    }
}
let activeAdapter;
function getDatabaseAdapter() {
    if (activeAdapter)
        return activeAdapter;
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl && !dbUrl.includes('localhost:5432/phishlens_db')) {
        try {
            activeAdapter = new PostgresDatabaseAdapter(dbUrl);
            console.log('[DB] Configured PostgreSQL database connection pool.');
            return activeAdapter;
        }
        catch (err) {
            console.warn('[DB] Failed to construct PostgreSQL adapter. Falling back to in-memory store:', err);
        }
    }
    activeAdapter = new InMemoryDatabaseAdapter();
    return activeAdapter;
}
exports.db = {
    async query(text, params) {
        const adapter = getDatabaseAdapter();
        return adapter.query(text, params);
    },
    async initialize() {
        const adapter = getDatabaseAdapter();
        return adapter.initialize();
    },
    isRealPostgres() {
        return getDatabaseAdapter().isRealPostgres();
    },
};
