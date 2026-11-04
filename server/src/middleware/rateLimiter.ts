import rateLimit from 'express-rate-limit';

// Standard API Rate Limiter: 100 requests per 15 minutes per IP
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait before submitting additional telemetry.',
  },
});

// Assistant Chat Rate Limiter: 30 requests per 1 minute per IP
export const assistantChatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many assistant messages. Please pause for a moment before continuing dialogue.',
  },
});
