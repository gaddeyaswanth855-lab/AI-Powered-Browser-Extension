import brandSignatures from './brandSignatures.json';
import { ThreatRiskLevel } from '../../../shared/validators';

export interface BrandMatchResult {
  brandName: string;
  isCanonical: boolean;
  isHomoglyph: boolean;
  isSubstringSpoof: boolean;
  distance: number;
  referencePHash: string;
}

export interface ClientEvaluationResult {
  score: number;
  riskLevel: ThreatRiskLevel;
  matchedBrand?: string | null;
  hammingDistance?: number | null;
  heuristicBreakdown: Record<string, { triggered: boolean; weight: number; description: string; detail?: string }>;
  evidence: string[];
}

const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'tk', 'work', 'click', 'gq', 'ml', 'cf', 'ga', 'buzz',
  'rest', 'fit', 'country', 'stream', 'download', 'racing', 'win', 'bid',
  'cam', 'monster', 'link', 'live', 'support', 'security', 'account', 'cc'
]);

// Map of common Cyrillic, Greek and symbol lookalikes to Latin characters
const HOMOGLYPH_MAP: Record<string, string> = {
  'а': 'a', 'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'α': 'a',
  'с': 'c', 'ç': 'c',
  'е': 'e', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'є': 'e', 'ε': 'e',
  'о': 'o', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ο': 'o',
  'р': 'p', 'ρ': 'p',
  'ѕ': 's',
  'ԁ': 'd',
  'ԛ': 'q',
  'ԝ': 'w',
  'х': 'x',
  'у': 'y', 'ý': 'y', 'ÿ': 'y',
  'і': 'i', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ι': 'i',
  'ј': 'j',
  'ν': 'v',
  '0': 'o',
  '1': 'l',
};

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
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
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

export function normalizeHomoglyphs(str: string): string {
  let normalized = '';
  for (const char of str.toLowerCase()) {
    normalized += HOMOGLYPH_MAP[char] || char;
  }
  return normalized;
}

export function calculateHammingDistance(hexA: string, hexB: string): number {
  if (!hexA || !hexB || hexA.length !== 16 || hexB.length !== 16) {
    return 64; // Maximum distance
  }

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

export function analyzeHostAgainstBrands(host: string): BrandMatchResult | null {
  const cleanHost = host.toLowerCase().trim();
  const normalizedHost = normalizeHomoglyphs(cleanHost);

  for (const brand of brandSignatures) {
    // 1. Check exact canonical match
    for (const canonical of brand.canonicalDomains) {
      if (cleanHost === canonical || cleanHost.endsWith(`.${canonical}`)) {
        return {
          brandName: brand.brandName,
          isCanonical: true,
          isHomoglyph: false,
          isSubstringSpoof: false,
          distance: 0,
          referencePHash: brand.phashSignature,
        };
      }
    }

    // 2. Check Homoglyph spoofing
    for (const canonical of brand.canonicalDomains) {
      if (normalizedHost === canonical || normalizedHost.endsWith(`.${canonical}`)) {
        return {
          brandName: brand.brandName,
          isCanonical: false,
          isHomoglyph: true,
          isSubstringSpoof: false,
          distance: 0,
          referencePHash: brand.phashSignature,
        };
      }
    }

    // 3. Substring squatting (e.g. accounts-google-security.xyz or paypal-login.com)
    const brandLower = brand.brandName.toLowerCase();
    if (cleanHost.includes(brandLower) && !brand.canonicalDomains.some((c) => cleanHost.endsWith(c))) {
      return {
        brandName: brand.brandName,
        isCanonical: false,
        isHomoglyph: false,
        isSubstringSpoof: true,
        distance: 0,
        referencePHash: brand.phashSignature,
      };
    }

    // 4. Levenshtein Distance 1 against Brand Name or canonical domain stem
    const hostStem = cleanHost.split('.')[0].replace(/[^a-z0-9]/g, '');
    const brandStem = brandLower.replace(/[^a-z0-9]/g, '');
    const dist = calculateLevenshteinDistance(hostStem, brandStem);
    if (dist === 1 && hostStem.length >= 4) {
      return {
        brandName: brand.brandName,
        isCanonical: false,
        isHomoglyph: false,
        isSubstringSpoof: false,
        distance: 1,
        referencePHash: brand.phashSignature,
      };
    }
  }

  return null;
}

export function evaluateClientSignals(options: {
  url: string;
  domain: string;
  externalFormActions: string[];
  hasPasswordField: boolean;
  computedPHash?: string | null;
  delayedRenderDetected: boolean;
  iframeOverlayDetected: boolean;
}): ClientEvaluationResult {
  const host = options.domain.toLowerCase().trim();
  const brandMatch = analyzeHostAgainstBrands(host);

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

  // If host is verified canonical brand domain, give clean score unless external cross-site form action is present
  if (brandMatch && brandMatch.isCanonical) {
    if (options.externalFormActions.length === 0) {
      return {
        score: 0,
        riskLevel: 'SAFE',
        matchedBrand: brandMatch.brandName,
        hammingDistance: 0,
        heuristicBreakdown: breakdown,
        evidence: [`Verified canonical domain for ${brandMatch.brandName}.`],
      };
    }
  }

  // 1. Homoglyph / Punycode / Brand Substring Spoofing
  const isPunycode = host.startsWith('xn--') || host.includes('.xn--') || /[^\x00-\x7F]/.test(host);
  if (isPunycode || (brandMatch && (brandMatch.isHomoglyph || brandMatch.isSubstringSpoof || brandMatch.distance === 1))) {
    breakdown.URL_PUNYCODE_HOMOGLYPH.triggered = true;
    const detail = brandMatch
      ? `Host '${host}' mimics brand '${brandMatch.brandName}' (Levenshtein/Spoof/Homoglyph)`
      : `Punycode / non-ASCII character set detected in domain '${host}'`;
    breakdown.URL_PUNYCODE_HOMOGLYPH.detail = detail;
    evidence.push(detail);
  }

  // 2. Suspicious TLD
  const parts = host.split('.');
  const tld = parts[parts.length - 1];
  if (SUSPICIOUS_TLDS.has(tld)) {
    breakdown.URL_SUSPICIOUS_TLD.triggered = true;
    breakdown.URL_SUSPICIOUS_TLD.detail = `TLD .${tld} in high-abuse threat registry`;
    evidence.push(`Domain uses high-abuse top-level domain (.${tld})`);
  }

  // 3. External Form Target
  if (options.externalFormActions && options.externalFormActions.length > 0) {
    breakdown.DOM_EXTERNAL_FORM_ACTION.triggered = true;
    breakdown.DOM_EXTERNAL_FORM_ACTION.detail = `External submission destination: ${options.externalFormActions.join(', ')}`;
    evidence.push(`Form inputs route to external third-party destination (${options.externalFormActions.join(', ')})`);
  }

  // 4. Insecure Credential Field
  if (options.hasPasswordField) {
    const isVerified = brandMatch && brandMatch.isCanonical;
    if (!isVerified) {
      breakdown.DOM_CREDENTIAL_IN_UNTRUSTED.triggered = true;
      breakdown.DOM_CREDENTIAL_IN_UNTRUSTED.detail = 'Password input on untrusted or spoofed domain';
      evidence.push('Password/credential input fields present on untrusted domain');
    }
  }

  // 5. Visual pHash Match on Untrusted Host
  let hammingDist: number | null = null;
  if (options.computedPHash && brandMatch) {
    hammingDist = calculateHammingDistance(options.computedPHash, brandMatch.referencePHash);
    if (hammingDist <= 10 && !brandMatch.isCanonical) {
      breakdown.VISUAL_PHASH_MATCH_UNTRUSTED.triggered = true;
      breakdown.VISUAL_PHASH_MATCH_UNTRUSTED.detail = `Visual logo matches '${brandMatch.brandName}' (Hamming: ${hammingDist}) on unauthorized domain`;
      evidence.push(`Visual brand logo matches '${brandMatch.brandName}' (Hamming distance: ${hammingDist}), but host is '${host}'`);
    }
  }

  // 6. Delayed Render Evasion
  if (options.delayedRenderDetected) {
    breakdown.ANTI_EVASION_DELAYED_RENDER.triggered = true;
    breakdown.ANTI_EVASION_DELAYED_RENDER.detail = 'Credential or logo node dynamically injected >1000ms after load';
    evidence.push('Anti-evasion flagged: Delayed rendering of forms or brand marks detected post-load');
  }

  // 7. Iframe Overlay
  if (options.iframeOverlayDetected) {
    breakdown.IFRAME_FULLSCREEN_OVERLAY.triggered = true;
    breakdown.IFRAME_FULLSCREEN_OVERLAY.detail = 'Fullscreen cross-origin iframe overlay (>80% viewport)';
    evidence.push('Viewport contains large overlay iframe from external origin');
  }

  // Compute Total Score
  let score = 0;
  for (const k in breakdown) {
    if (breakdown[k].triggered) {
      score += breakdown[k].weight;
    }
  }

  score = Math.min(100, score);

  let riskLevel: ThreatRiskLevel = 'SAFE';
  if (score >= 70) {
    riskLevel = 'HIGH_RISK';
  } else if (score >= 35) {
    riskLevel = 'SUSPICIOUS';
  }

  if (evidence.length === 0) {
    evidence.push('Page passes baseline heuristic and structural validation.');
  }

  return {
    score,
    riskLevel,
    matchedBrand: brandMatch?.brandName || null,
    hammingDistance: hammingDist,
    heuristicBreakdown: breakdown,
    evidence,
  };
}
