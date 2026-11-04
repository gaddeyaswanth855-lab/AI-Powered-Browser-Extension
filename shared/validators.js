import { z } from 'zod';
export const FormTelemetrySchema = z.object({
    action: z.string().default(''),
    method: z.string().default('GET'),
    targetDomain: z.string().default(''),
    isCrossDomain: z.boolean().default(false),
    hasPasswordField: z.boolean().default(false),
    inputNames: z.array(z.string()).default([]),
});
export const EvaluateRequestSchema = z.object({
    url: z.string().url(),
    domain: z.string().min(1),
    matchedBrand: z.string().nullable().optional(),
    hammingDistance: z.number().int().nonnegative().nullable().optional(),
    forms: z.array(FormTelemetrySchema).default([]),
    hasPasswordField: z.boolean().default(false),
    externalFormActions: z.array(z.string()).default([]),
    delayedRenderDetected: z.boolean().default(false),
    clientHeuristicScore: z.number().int().min(0).max(100),
    viewportPHash: z.string().max(64).optional(),
    userAgent: z.string().optional(),
});
export const ThreatRiskLevelSchema = z.enum(['SAFE', 'SUSPICIOUS', 'HIGH_RISK']);
export const TelemetryContextSchema = z.object({
    url: z.string(),
    domain: z.string(),
    matchedBrand: z.string().nullable().optional(),
    riskScore: z.number(),
    riskLevel: ThreatRiskLevelSchema,
    externalFormActions: z.array(z.string()).default([]),
    delayedRenderDetected: z.boolean().default(false),
});
export const AssistantChatRequestSchema = z.object({
    sessionId: z.string().uuid(),
    incidentId: z.string().uuid().nullable().optional(),
    message: z.string().min(1).max(2000),
    telemetryContext: TelemetryContextSchema,
});
export const ThreatIncidentResponseSchema = z.object({
    incidentId: z.string().uuid(),
    verdict: ThreatRiskLevelSchema,
    riskScore: z.number().min(0).max(100),
    brandImpersonated: z.string().nullable().optional(),
    primaryEvidence: z.array(z.string()),
    userExplanation: z.string(),
    technicalDetails: z.object({
        domainLegitimacy: z.string(),
        formDestinationSafety: z.string(),
        visualSimilarityConfidence: z.number(),
        antiEvasionFlagged: z.boolean(),
    }),
});
export const UserReportRequestSchema = z.object({
    incidentId: z.string().uuid().nullable().optional(),
    url: z.string().url(),
    userVerdict: z.enum(['FALSE_POSITIVE', 'MISSED_PHISH']),
    userComments: z.string().max(1000).optional(),
});
export const BrandCategorySchema = z.enum([
    'FINANCIAL',
    'IDENTITY',
    'COMMERCE',
    'SOCIAL',
    'CRYPTO',
    'OTHER',
]);
export const BrandAnchorSchema = z.object({
    id: z.string().uuid().optional(),
    brandName: z.string().min(1).max(100),
    canonicalDomains: z.array(z.string().min(1)),
    category: BrandCategorySchema.default('OTHER'),
    phashSignature: z.string().length(16),
    logoSvgUrl: z.string().optional().nullable(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});
export const WhitelistDomainSchema = z.object({
    id: z.string().uuid().optional(),
    domain: z.string().min(1).max(255),
    reason: z.string().optional().nullable(),
    isGlobal: z.boolean().default(false),
    createdAt: z.string().optional(),
});
