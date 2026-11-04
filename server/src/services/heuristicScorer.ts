import { EvaluateRequest, ThreatRiskLevel } from '../../../shared/validators';

export interface HeuristicEvaluationResult {
  score: number;
  verdict: ThreatRiskLevel;
  breakdown: Record<string, { triggered: boolean; weight: number; description: string; detail?: string }>;
  evidence: string[];
}

const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'tk', 'work', 'click', 'gq', 'ml', 'cf', 'ga', 'buzz',
  'rest', 'fit', 'country', 'stream', 'download', 'racing', 'win', 'bid',
  'cam', 'monster', 'link', 'live', 'support', 'security', 'account'
]);

export function calculateLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const aLen = a.length;
  const bLen = b.length;

  for (let i = 0; i <= bLen; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= aLen; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bLen; i++) {
    for (let j = 1; j <= aLen; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[bLen][aLen];
}

export function calculateEntropy(str: string): number {
  const len = str.length;
  if (len === 0) return 0;
  const frequencies: Record<string, number> = {};
  for (const ch of str) {
    frequencies[ch] = (frequencies[ch] || 0) + 1;
  }
  let entropy = 0;
  for (const ch in frequencies) {
    const p = frequencies[ch] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

export function evaluateClientTelemetry(payload: EvaluateRequest): HeuristicEvaluationResult {
  const breakdown: Record<string, { triggered: boolean; weight: number; description: string; detail?: string }> = {
    URL_PUNYCODE_HOMOGLYPH: {
      triggered: false,
      weight: 30,
      description: 'Hostname contains Punycode/homoglyphs or Levenshtein distance 1 to targeted brand',
    },
    URL_SUSPICIOUS_TLD: {
      triggered: false,
      weight: 15,
      description: 'Top-Level Domain belongs to high-abuse phishing registry',
    },
    DOM_EXTERNAL_FORM_ACTION: {
      triggered: false,
      weight: 35,
      description: '<form action> target domain submits data to an external, cross-domain destination',
    },
    DOM_CREDENTIAL_IN_UNTRUSTED: {
      triggered: false,
      weight: 25,
      description: 'Password input field present on unverified or mismatched brand layout',
    },
    VISUAL_PHASH_MATCH_UNTRUSTED: {
      triggered: false,
      weight: 40,
      description: 'Visual logo pHash matches known brand signature (Hamming dist <= 10) on an unverified host',
    },
    ANTI_EVASION_DELAYED_RENDER: {
      triggered: false,
      weight: 20,
      description: 'Password or brand asset attached via script delayed >1000ms post-DOMContentLoaded',
    },
    IFRAME_FULLSCREEN_OVERLAY: {
      triggered: false,
      weight: 25,
      description: 'High-coverage cross-origin iframe overlay detected in viewport',
    },
  };

  const evidence: string[] = [];
  const host = payload.domain.toLowerCase();

  // 1. Homoglyphs & Punycode
  const hasPunycode = host.startsWith('xn--') || host.includes('.xn--') || /[^\x00-\x7F]/.test(host);
  let distance1Brand: string | null = null;
  if (payload.matchedBrand) {
    const brandLower = payload.matchedBrand.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanHost = host.split('.')[0];
    const dist = calculateLevenshteinDistance(cleanHost, brandLower);
    if (dist === 1) {
      distance1Brand = payload.matchedBrand;
    }
  }

  if (hasPunycode || distance1Brand) {
    breakdown.URL_PUNYCODE_HOMOGLYPH.triggered = true;
    breakdown.URL_PUNYCODE_HOMOGLYPH.detail = hasPunycode
      ? 'Non-ASCII or Punycode IDN hostname detected'
      : `Host '${host}' is Levenshtein distance 1 from '${distance1Brand}'`;
    evidence.push(breakdown.URL_PUNYCODE_HOMOGLYPH.detail);
  }

  // 2. Suspicious TLD
  const parts = host.split('.');
  const tld = parts[parts.length - 1];
  if (SUSPICIOUS_TLDS.has(tld)) {
    breakdown.URL_SUSPICIOUS_TLD.triggered = true;
    breakdown.URL_SUSPICIOUS_TLD.detail = `High-abuse TLD '.${tld}'`;
    evidence.push(`Hostname utilizes high-abuse top-level domain (.${tld})`);
  }

  // 3. External Form Actions
  if (payload.externalFormActions && payload.externalFormActions.length > 0) {
    breakdown.DOM_EXTERNAL_FORM_ACTION.triggered = true;
    breakdown.DOM_EXTERNAL_FORM_ACTION.detail = `Target: ${payload.externalFormActions.join(', ')}`;
    evidence.push(`Forms submit authentication or input data cross-domain to: ${payload.externalFormActions.join(', ')}`);
  }

  // 4. Credential Field on Untrusted Origin
  if (payload.hasPasswordField) {
    const hasTrustedBrand = payload.matchedBrand && payload.domain.endsWith(`${payload.matchedBrand.toLowerCase()}.com`);
    if (!hasTrustedBrand) {
      breakdown.DOM_CREDENTIAL_IN_UNTRUSTED.triggered = true;
      breakdown.DOM_CREDENTIAL_IN_UNTRUSTED.detail = 'Sensitive password field detected on unauthorized domain';
      evidence.push('Password/credential input fields detected on untrusted origin');
    }
  }

  // 5. Visual pHash Match on Untrusted Host
  if (payload.matchedBrand && payload.hammingDistance !== null && payload.hammingDistance !== undefined && payload.hammingDistance <= 10) {
    breakdown.VISUAL_PHASH_MATCH_UNTRUSTED.triggered = true;
    breakdown.VISUAL_PHASH_MATCH_UNTRUSTED.detail = `Matches '${payload.matchedBrand}' signature (Hamming distance: ${payload.hammingDistance})`;
    evidence.push(`Visual brand signature matches '${payload.matchedBrand}' (Hamming distance: ${payload.hammingDistance}), but domain '${host}' does not belong to ${payload.matchedBrand}`);
  }

  // 6. Delayed Render Evasion
  if (payload.delayedRenderDetected) {
    breakdown.ANTI_EVASION_DELAYED_RENDER.triggered = true;
    breakdown.ANTI_EVASION_DELAYED_RENDER.detail = 'Password/brand node injected dynamically post-initial load';
    evidence.push('Delayed DOM rendering detected: credential or brand element injected post-load to evade static scanners');
  }

  // Calculate Total Score: sum(w_i * c_i), capped at 100
  let totalScore = 0;
  for (const key in breakdown) {
    if (breakdown[key].triggered) {
      totalScore += breakdown[key].weight;
    }
  }

  // Merge client heuristic score if provided and higher
  const finalScore = Math.min(100, Math.max(totalScore, payload.clientHeuristicScore || 0));

  let verdict: ThreatRiskLevel = 'SAFE';
  if (finalScore >= 70) {
    verdict = 'HIGH_RISK';
  } else if (finalScore >= 35) {
    verdict = 'SUSPICIOUS';
  }

  if (evidence.length === 0) {
    evidence.push('No malicious homoglyphs, visual spoofing, or cross-origin credential harvesting detected.');
  }

  return {
    score: finalScore,
    verdict,
    breakdown,
    evidence,
  };
}
