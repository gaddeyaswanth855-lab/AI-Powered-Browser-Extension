const BASE_URL = 'http://localhost:5000';
const ADMIN_SECRET = 'phishlens_admin_secret_key_2026';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${ADMIN_SECRET}`,
};

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/api/health`);
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/api/v1/admin/stats`, { headers });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchThreats(params: {
  page?: number;
  limit?: number;
  riskLevel?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.riskLevel && params.riskLevel !== 'ALL') query.set('riskLevel', params.riskLevel);
  if (params.search) query.set('search', params.search);

  const res = await fetch(`${BASE_URL}/api/v1/admin/threats?${query.toString()}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch threats');
  return res.json();
}

export async function fetchThreatDetail(id: string) {
  const res = await fetch(`${BASE_URL}/api/v1/admin/threats/${id}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch threat detail');
  return res.json();
}

export async function fetchBrands() {
  const res = await fetch(`${BASE_URL}/api/v1/signatures/brands`);
  if (!res.ok) throw new Error('Failed to fetch brand anchors');
  return res.json();
}

export async function createBrand(brandData: {
  brandName: string;
  canonicalDomains: string[];
  category: string;
  phashSignature: string;
  logoSvgUrl?: string | null;
}) {
  const res = await fetch(`${BASE_URL}/api/v1/signatures/brands`, {
    method: 'POST',
    headers,
    body: JSON.stringify(brandData),
  });
  if (!res.ok) throw new Error('Failed to register brand anchor');
  return res.json();
}

export async function fetchWhitelist() {
  const res = await fetch(`${BASE_URL}/api/v1/admin/whitelist`, { headers });
  if (!res.ok) throw new Error('Failed to fetch whitelist');
  return res.json();
}

export async function addWhitelistDomain(domain: string, reason?: string) {
  const res = await fetch(`${BASE_URL}/api/v1/admin/whitelist`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ domain, reason, isGlobal: true }),
  });
  if (!res.ok) throw new Error('Failed to add whitelisted domain');
  return res.json();
}

export async function fetchReports() {
  const res = await fetch(`${BASE_URL}/api/v1/admin/reports`, { headers });
  if (!res.ok) throw new Error('Failed to fetch user reports');
  return res.json();
}

export async function submitTelemetryEvaluation(payload: any) {
  const res = await fetch(`${BASE_URL}/api/v1/telemetry/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to evaluate telemetry');
  return res.json();
}
