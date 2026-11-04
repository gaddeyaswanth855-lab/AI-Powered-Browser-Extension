import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  DATABASE_URL: process.env.DATABASE_URL || '',
  PGSSLMODE: process.env.PGSSLMODE || 'disable',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  ADMIN_API_SECRET: process.env.ADMIN_API_SECRET || 'phishlens_admin_secret_key_2026',
  EXTENSION_SHARED_SECRET: process.env.EXTENSION_SHARED_SECRET || 'phishlens_shared_secret_2026',
};
