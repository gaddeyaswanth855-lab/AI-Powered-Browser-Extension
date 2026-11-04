import { ThreatRiskLevel, FormTelemetry, ThreatIncidentResponse } from '../../../shared/validators';

export type ExtensionMessageType =
  | 'EVALUATE_PAGE'
  | 'PAGE_EVALUATED'
  | 'GET_PAGE_STATUS'
  | 'UPDATE_BADGE'
  | 'COMPUTE_PHASH'
  | 'PHASH_RESULT'
  | 'TOGGLE_ASSISTANT'
  | 'BYPASS_PAGE'
  | 'SUBMIT_REPORT'
  | 'RE_EVALUATE_MUTATION';

export interface PageStatus {
  url: string;
  domain: string;
  riskScore: number;
  riskLevel: ThreatRiskLevel;
  matchedBrand?: string | null;
  hammingDistance?: number | null;
  delayedRenderDetected: boolean;
  externalFormActions: string[];
  forms: FormTelemetry[];
  hasPasswordField: boolean;
  evaluatedAt: string;
  bypassed?: boolean;
  incidentResponse?: ThreatIncidentResponse | null;
}

export interface ExtensionMessage<T = any> {
  type: ExtensionMessageType;
  payload?: T;
}

export interface PHashRequestPayload {
  imageUrl: string;
  targetBrand?: string;
}

export interface PHashResponsePayload {
  imageUrl: string;
  phash: string;
  matchedBrand?: string | null;
  hammingDistance?: number | null;
}
