"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhitelistDomainSchema = exports.BrandAnchorSchema = exports.BrandCategorySchema = exports.UserReportRequestSchema = exports.ThreatIncidentResponseSchema = exports.AssistantChatRequestSchema = exports.TelemetryContextSchema = exports.ThreatRiskLevelSchema = exports.EvaluateRequestSchema = exports.FormTelemetrySchema = void 0;
const zod_1 = require("zod");
exports.FormTelemetrySchema = zod_1.z.object({
    action: zod_1.z.string().default(''),
    method: zod_1.z.string().default('GET'),
    targetDomain: zod_1.z.string().default(''),
    isCrossDomain: zod_1.z.boolean().default(false),
    hasPasswordField: zod_1.z.boolean().default(false),
    inputNames: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.EvaluateRequestSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    domain: zod_1.z.string().min(1),
    matchedBrand: zod_1.z.string().nullable().optional(),
    hammingDistance: zod_1.z.number().int().nonnegative().nullable().optional(),
    forms: zod_1.z.array(exports.FormTelemetrySchema).default([]),
    hasPasswordField: zod_1.z.boolean().default(false),
    externalFormActions: zod_1.z.array(zod_1.z.string()).default([]),
    delayedRenderDetected: zod_1.z.boolean().default(false),
    clientHeuristicScore: zod_1.z.number().int().min(0).max(100),
    viewportPHash: zod_1.z.string().max(64).optional(),
    userAgent: zod_1.z.string().optional(),
});
exports.ThreatRiskLevelSchema = zod_1.z.enum(['SAFE', 'SUSPICIOUS', 'HIGH_RISK']);
exports.TelemetryContextSchema = zod_1.z.object({
    url: zod_1.z.string(),
    domain: zod_1.z.string(),
    matchedBrand: zod_1.z.string().nullable().optional(),
    riskScore: zod_1.z.number(),
    riskLevel: exports.ThreatRiskLevelSchema,
    externalFormActions: zod_1.z.array(zod_1.z.string()).default([]),
    delayedRenderDetected: zod_1.z.boolean().default(false),
});
exports.AssistantChatRequestSchema = zod_1.z.object({
    sessionId: zod_1.z.string().uuid(),
    incidentId: zod_1.z.string().uuid().nullable().optional(),
    message: zod_1.z.string().min(1).max(2000),
    telemetryContext: exports.TelemetryContextSchema,
});
exports.ThreatIncidentResponseSchema = zod_1.z.object({
    incidentId: zod_1.z.string().uuid(),
    verdict: exports.ThreatRiskLevelSchema,
    riskScore: zod_1.z.number().min(0).max(100),
    brandImpersonated: zod_1.z.string().nullable().optional(),
    primaryEvidence: zod_1.z.array(zod_1.z.string()),
    userExplanation: zod_1.z.string(),
    technicalDetails: zod_1.z.object({
        domainLegitimacy: zod_1.z.string(),
        formDestinationSafety: zod_1.z.string(),
        visualSimilarityConfidence: zod_1.z.number(),
        antiEvasionFlagged: zod_1.z.boolean(),
    }),
});
exports.UserReportRequestSchema = zod_1.z.object({
    incidentId: zod_1.z.string().uuid().nullable().optional(),
    url: zod_1.z.string().url(),
    userVerdict: zod_1.z.enum(['FALSE_POSITIVE', 'MISSED_PHISH']),
    userComments: zod_1.z.string().max(1000).optional(),
});
exports.BrandCategorySchema = zod_1.z.enum([
    'FINANCIAL',
    'IDENTITY',
    'COMMERCE',
    'SOCIAL',
    'CRYPTO',
    'OTHER',
]);
exports.BrandAnchorSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    brandName: zod_1.z.string().min(1).max(100),
    canonicalDomains: zod_1.z.array(zod_1.z.string().min(1)),
    category: exports.BrandCategorySchema.default('OTHER'),
    phashSignature: zod_1.z.string().length(16),
    logoSvgUrl: zod_1.z.string().optional().nullable(),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional(),
});
exports.WhitelistDomainSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    domain: zod_1.z.string().min(1).max(255),
    reason: zod_1.z.string().optional().nullable(),
    isGlobal: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.string().optional(),
});
