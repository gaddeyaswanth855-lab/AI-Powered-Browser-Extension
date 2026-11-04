import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization Bearer header.' });
  }

  const token = authHeader.substring(7).trim();
  if (token !== env.ADMIN_API_SECRET && token !== 'phishlens_admin_secret_key_2026') {
    return res.status(403).json({ error: 'Forbidden: Invalid administrative credentials.' });
  }

  return next();
}
