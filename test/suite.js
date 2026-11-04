const assert = require('assert');
const http = require('http');

async function runTests() {
  console.log('===============================================================');
  console.log('🧪 PhishLens AI Comprehensive Verification & Test Suite');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Heuristics Scorer Unit Tests
  console.log('--- 1. Mathematical Heuristics & String Similarity Engine ---');
  const { calculateLevenshteinDistance, calculateEntropy, evaluateClientTelemetry } = require('../server/dist/server/src/services/heuristicScorer');

  test('Levenshtein distance calculation accuracy', () => {
    assert.strictEqual(calculateLevenshteinDistance('google', 'google'), 0);
    assert.strictEqual(calculateLevenshteinDistance('googl', 'google'), 1);
    assert.strictEqual(calculateLevenshteinDistance('g00gle', 'google'), 2);
    assert.strictEqual(calculateLevenshteinDistance('paypal', 'paypa1'), 1);
  });

  test('Shannon entropy calculation on hostnames', () => {
    const lowEntropy = calculateEntropy('aaaaaa');
    const highEntropy = calculateEntropy('x8f9q2m1z4');
    assert.strictEqual(lowEntropy, 0);
    assert.ok(highEntropy > 3.0, `Expected high entropy > 3, got ${highEntropy}`);
  });

  test('Heuristic Scoring Formula: w_i * c_i accumulation capped at 100', () => {
    // Evaluation for safe page
    const safePayload = {
      url: 'https://google.com/search',
      domain: 'google.com',
      matchedBrand: 'Google',
      forms: [],
      hasPasswordField: false,
      externalFormActions: [],
      delayedRenderDetected: false,
      clientHeuristicScore: 0,
    };
    const safeRes = evaluateClientTelemetry(safePayload);
    assert.strictEqual(safeRes.verdict, 'SAFE');
    assert.ok(safeRes.score < 35, `Safe score should be < 35, got ${safeRes.score}`);

    // Evaluation for malicious spoof
    const phishPayload = {
      url: 'https://accounts-google-verify.xyz/auth',
      domain: 'accounts-google-verify.xyz',
      matchedBrand: 'Google',
      hammingDistance: 4, // Visual pHash matches Google logo
      forms: [{
        action: 'https://exfiltrate-tokens.top/login',
        method: 'POST',
        targetDomain: 'exfiltrate-tokens.top',
        isCrossDomain: true,
        hasPasswordField: true,
        inputNames: ['username', 'passwd'],
      }],
      hasPasswordField: true,
      externalFormActions: ['https://exfiltrate-tokens.top/login'],
      delayedRenderDetected: true,
      clientHeuristicScore: 90,
    };
    const phishRes = evaluateClientTelemetry(phishPayload);
    assert.strictEqual(phishRes.verdict, 'HIGH_RISK');
    assert.ok(phishRes.score >= 70, `High risk score should be >= 70, got ${phishRes.score}`);
    assert.ok(phishRes.evidence.length >= 3, 'Expected multiple evidence points');
    assert.strictEqual(phishRes.breakdown.URL_SUSPICIOUS_TLD.triggered, true);
    assert.strictEqual(phishRes.breakdown.DOM_EXTERNAL_FORM_ACTION.triggered, true);
    assert.strictEqual(phishRes.breakdown.ANTI_EVASION_DELAYED_RENDER.triggered, true);
    assert.strictEqual(phishRes.breakdown.VISUAL_PHASH_MATCH_UNTRUSTED.triggered, true);
  });

  // 2. pHash Hamming Distance Tests
  console.log('\n--- 2. Perceptual Hashing & Hamming Distance Logic ---');
  function calculateHammingDistance(hexA, hexB) {
    if (!hexA || !hexB || hexA.length !== 16 || hexB.length !== 16) return 64;
    let distance = 0;
    for (let i = 0; i < 16; i++) {
      const valA = parseInt(hexA[i], 16);
      const valB = parseInt(hexB[i], 16);
      let xor = valA ^ valB;
      while (xor > 0) {
        distance += xor & 1;
        xor >>= 1;
      }
    }
    return distance;
  }

  test('Hamming distance comparison between 16-hex pHash digests', () => {
    const hash1 = 'a1b2c3d4e5f60718';
    const hash2 = 'a1b2c3d4e5f60718';
    const hash3 = 'a1b2c3d4e5f60719'; // 1 bit diff
    const hash4 = 'ffffffffffffffff';

    assert.strictEqual(calculateHammingDistance(hash1, hash2), 0);
    assert.strictEqual(calculateHammingDistance(hash1, hash3), 1);
    assert.ok(calculateHammingDistance(hash1, hash4) > 20);
  });

  // 3. Server Endpoints & Integration Tests
  console.log('\n--- 3. Backend REST API & Server-Sent Events (SSE) Tests ---');
  process.env.PORT = '5099';
  process.env.NODE_ENV = 'test';
  const { app } = require('../server/dist/server/src/index');

  let server;
  await new Promise((resolve) => {
    server = app.listen(5099, () => {
      console.log('  [Server] Test server active on http://localhost:5099');
      resolve();
    });
  });

  async function makeRequest(path, method = 'GET', body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const opts = {
        hostname: 'localhost',
        port: 5099,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      const req = http.request(opts, (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed, raw });
        });
      });

      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  await asyncTest('GET /api/health returns ONLINE and system diagnostics', async () => {
    const res = await makeRequest('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ONLINE');
    assert.ok(res.body.aiEngine, 'Expected aiEngine to be specified');
    assert.ok(res.body.database, 'Expected database to be specified');
  });

  await asyncTest('GET /api/v1/signatures/brands returns pre-bundled brand anchors', async () => {
    const res = await makeRequest('/api/v1/signatures/brands');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.brands.length >= 5, 'Expected at least 5 default brand anchors');
    const brandNames = res.body.brands.map((b) => b.brand_name);
    assert.ok(brandNames.includes('Google'), 'Expected Google in brands list');
    assert.ok(brandNames.includes('PayPal'), 'Expected PayPal in brands list');
  });

  let capturedIncidentId = null;

  await asyncTest('POST /api/v1/telemetry/evaluate processes high-risk phishing attack', async () => {
    const payload = {
      url: 'https://security-verify-google.xyz/login',
      domain: 'security-verify-google.xyz',
      matchedBrand: 'Google',
      hammingDistance: 3,
      forms: [{
        action: 'https://malicious-exfil.top/collect',
        method: 'POST',
        targetDomain: 'malicious-exfil.top',
        isCrossDomain: true,
        hasPasswordField: true,
        inputNames: ['email', 'password'],
      }],
      hasPasswordField: true,
      externalFormActions: ['https://malicious-exfil.top/collect'],
      delayedRenderDetected: true,
      clientHeuristicScore: 85,
    };

    const res = await makeRequest('/api/v1/telemetry/evaluate', 'POST', payload);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.verdict, 'HIGH_RISK');
    assert.ok(res.body.riskScore >= 70, `Expected riskScore >= 70, got ${res.body.riskScore}`);
    assert.strictEqual(res.body.brandImpersonated, 'Google');
    assert.ok(res.body.incidentId, 'Expected incidentId to be returned');
    assert.ok(res.body.primaryEvidence.length > 0, 'Expected primaryEvidence list');
    capturedIncidentId = res.body.incidentId;
  });

  await asyncTest('POST /api/v1/assistant/chat delivers streaming SSE Sentinel forensic advice', async () => {
    const sessionId = 'a0000000-0000-4000-8000-000000000001';
    const payload = {
      sessionId,
      incidentId: capturedIncidentId,
      message: 'Why is this page flagged as a threat?',
      telemetryContext: {
        url: 'https://security-verify-google.xyz/login',
        domain: 'security-verify-google.xyz',
        matchedBrand: 'Google',
        riskScore: 85,
        riskLevel: 'HIGH_RISK',
        externalFormActions: ['https://malicious-exfil.top/collect'],
        delayedRenderDetected: true,
      },
    };

    const res = await makeRequest('/api/v1/assistant/chat', 'POST', payload, {
      Accept: 'text/event-stream',
    });

    assert.strictEqual(res.status, 200);
    assert.ok(res.headers['content-type'].includes('text/event-stream'), 'Expected text/event-stream header');
    assert.ok(res.raw.includes('data:'), 'Expected SSE data frames');
    assert.ok(res.raw.includes('[DONE]'), 'Expected SSE terminal [DONE] event');
    assert.ok(res.raw.toLowerCase().includes('google') || res.raw.toLowerCase().includes('phishlens'), 'Expected content mentioning Google/Sentinel');
  });

  await asyncTest('POST /api/v1/assistant/chat handles emergency credential compromise scenario', async () => {
    const sessionId = 'a0000000-0000-4000-8000-000000000001';
    const payload = {
      sessionId,
      incidentId: capturedIncidentId,
      message: 'I already submitted my password! What should I do now?',
      telemetryContext: {
        url: 'https://security-verify-google.xyz/login',
        domain: 'security-verify-google.xyz',
        matchedBrand: 'Google',
        riskScore: 85,
        riskLevel: 'HIGH_RISK',
        externalFormActions: ['https://malicious-exfil.top/collect'],
        delayedRenderDetected: true,
      },
    };

    const res = await makeRequest('/api/v1/assistant/chat', 'POST', payload, {
      Accept: 'text/event-stream',
    });

    assert.strictEqual(res.status, 200);
    assert.ok(res.raw.includes('EMERGENCY') || res.raw.includes('Password'), 'Expected emergency action plan');
  });

  await asyncTest('GET /api/v1/assistant/history/:sessionId retrieves full multi-turn transcript', async () => {
    const sessionId = 'a0000000-0000-4000-8000-000000000001';
    const res = await makeRequest(`/api/v1/assistant/history/${sessionId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.sessionId, sessionId);
    assert.ok(res.body.messages.length >= 2, 'Expected conversation history with user and assistant turns');
  });

  await asyncTest('GET /api/v1/admin/threats requires authorization and lists captured incidents', async () => {
    // 1. Without auth
    const unauthorizedRes = await makeRequest('/api/v1/admin/threats');
    assert.strictEqual(unauthorizedRes.status, 401);

    // 2. With valid auth
    const authorizedRes = await makeRequest('/api/v1/admin/threats', 'GET', null, {
      Authorization: 'Bearer phishlens_admin_secret_key_2026',
    });
    assert.strictEqual(authorizedRes.status, 200);
    assert.ok(authorizedRes.body.threats.length > 0, 'Expected at least 1 persisted threat incident');
  });

  await asyncTest('GET /api/v1/admin/stats returns computed security analytics', async () => {
    const res = await makeRequest('/api/v1/admin/stats', 'GET', null, {
      Authorization: 'Bearer phishlens_admin_secret_key_2026',
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.totalScans > 0, 'Expected totalScans metric');
    assert.ok(res.body.zeroHourInterceptions >= 1, 'Expected zeroHourInterceptions metric');
  });

  await asyncTest('POST /api/v1/admin/whitelist appends new global domain exemption', async () => {
    const res = await makeRequest(
      '/api/v1/admin/whitelist',
      'POST',
      { domain: 'internal-corp-gateway.com', reason: 'Internal enterprise SSO portal', isGlobal: true },
      { Authorization: 'Bearer phishlens_admin_secret_key_2026' }
    );
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.entry.domain, 'internal-corp-gateway.com');
  });

  await asyncTest('POST /api/v1/telemetry/report logs user feedback loop', async () => {
    const res = await makeRequest('/api/v1/telemetry/report', 'POST', {
      incidentId: capturedIncidentId,
      url: 'https://security-verify-google.xyz/login',
      userVerdict: 'FALSE_POSITIVE',
      userComments: 'Testing triage report workflow',
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.reportId, 'Expected reportId');
  });

  // Teardown server
  server.close();

  console.log('\n===============================================================');
  console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

