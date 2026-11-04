-- PhishLens AI Enterprise Security Platform Database Schema
-- Strict PostgreSQL 16+ Schema with Row Level Security & Indexes

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types for status, risk levels, and categories
DO $$ BEGIN
    CREATE TYPE threat_risk_level AS ENUM ('SAFE', 'SUSPICIOUS', 'HIGH_RISK');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE target_category AS ENUM ('FINANCIAL', 'IDENTITY', 'COMMERCE', 'SOCIAL', 'CRYPTO', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('PENDING', 'VERIFIED_PHISH', 'FALSE_POSITIVE', 'RESOLVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Table: Brand Anchors (Canonical brand references)
CREATE TABLE IF NOT EXISTS brand_anchors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name VARCHAR(100) NOT NULL UNIQUE,
    canonical_domains TEXT[] NOT NULL,
    category target_category NOT NULL DEFAULT 'OTHER',
    phash_signature VARCHAR(64) NOT NULL,
    logo_svg_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Threat Incidents (Intercepted phishing attempts)
CREATE TABLE IF NOT EXISTS threat_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    detected_url TEXT NOT NULL,
    normalized_domain VARCHAR(255) NOT NULL,
    matched_brand_id UUID REFERENCES brand_anchors(id) ON DELETE SET NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level threat_risk_level NOT NULL,
    heuristic_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    dom_telemetry JSONB NOT NULL DEFAULT '{}'::jsonb,
    ai_forensic_analysis JSONB,
    client_ip_hash VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Assistant Chat Sessions (Conversational history between user & Sentinel)
CREATE TABLE IF NOT EXISTS assistant_chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES threat_incidents(id) ON DELETE CASCADE,
    session_token VARCHAR(128) NOT NULL,
    current_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Assistant Chat Messages
CREATE TABLE IF NOT EXISTS assistant_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES assistant_chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: User False Positive & Incident Reports
CREATE TABLE IF NOT EXISTS user_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES threat_incidents(id) ON DELETE SET NULL,
    submitted_url TEXT NOT NULL,
    user_verdict VARCHAR(50) NOT NULL,
    user_comments TEXT,
    reporter_token VARCHAR(128),
    status report_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Table: Whitelisted Domains (Global and User override lists)
CREATE TABLE IF NOT EXISTS whitelisted_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain VARCHAR(255) NOT NULL UNIQUE,
    reason TEXT,
    is_global BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for high-performance lookup
CREATE INDEX IF NOT EXISTS idx_threat_incidents_domain ON threat_incidents(normalized_domain);
CREATE INDEX IF NOT EXISTS idx_threat_incidents_risk_level ON threat_incidents(risk_level);
CREATE INDEX IF NOT EXISTS idx_threat_incidents_created_at ON threat_incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assistant_sessions_incident ON assistant_chat_sessions(incident_id);
CREATE INDEX IF NOT EXISTS idx_assistant_messages_session ON assistant_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_brand_anchors_domains ON brand_anchors USING GIN(canonical_domains);

-- Seed Initial Brand Anchors (Canonical brand signatures)
INSERT INTO brand_anchors (brand_name, canonical_domains, category, phash_signature) VALUES
('Google', ARRAY['google.com', 'accounts.google.com', 'gmail.com'], 'IDENTITY', 'a1b2c3d4e5f60718'),
('PayPal', ARRAY['paypal.com', 'paypal-prepaid.com'], 'FINANCIAL', '8f7e6d5c4b3a2109'),
('Microsoft', ARRAY['microsoft.com', 'login.microsoftonline.com', 'live.com'], 'IDENTITY', '1122334455667788'),
('Apple', ARRAY['apple.com', 'icloud.com'], 'IDENTITY', '99aabbccddeeff00'),
('Chase', ARRAY['chase.com'], 'FINANCIAL', '1234567890abcdef'),
('Amazon', ARRAY['amazon.com', 'sellercentral.amazon.com', 'aws.amazon.com'], 'COMMERCE', 'fedcba0987654321'),
('Meta', ARRAY['facebook.com', 'instagram.com', 'whatsapp.com'], 'SOCIAL', '1029384756afbecd'),
('Coinbase', ARRAY['coinbase.com'], 'CRYPTO', 'abcdef0123456789'),
('Bank of America', ARRAY['bankofamerica.com'], 'FINANCIAL', '445566778899aabb'),
('Wells Fargo', ARRAY['wellsfargo.com'], 'FINANCIAL', '3344556677889900')
ON CONFLICT (brand_name) DO NOTHING;

-- Seed Global Whitelisted Domains
INSERT INTO whitelisted_domains (domain, reason, is_global) VALUES
('google.com', 'Canonical search and identity engine', true),
('github.com', 'Canonical software hosting provider', true),
('microsoft.com', 'Canonical software and enterprise identity provider', true),
('apple.com', 'Canonical technology provider', true),
('paypal.com', 'Canonical payment gateway', true),
('chase.com', 'Canonical banking institution', true),
('amazon.com', 'Canonical commerce platform', true)
ON CONFLICT (domain) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE threat_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_anchors ENABLE ROW LEVEL SECURITY;
ALTER TABLE whitelisted_domains ENABLE ROW LEVEL SECURITY;

-- Anonymous client ingestion policies
DO $$ BEGIN
    CREATE POLICY anon_insert_threat_incidents ON threat_incidents FOR INSERT TO public WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY anon_select_threat_incidents ON threat_incidents FOR SELECT TO public USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY anon_insert_assistant_sessions ON assistant_chat_sessions FOR ALL TO public USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY anon_insert_assistant_messages ON assistant_chat_messages FOR ALL TO public USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY anon_insert_user_reports ON user_reports FOR INSERT TO public WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY public_read_brand_anchors ON brand_anchors FOR SELECT TO public USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY public_read_whitelist ON whitelisted_domains FOR SELECT TO public USING (is_global = true);
EXCEPTION WHEN duplicate_object THEN null; END $$;
