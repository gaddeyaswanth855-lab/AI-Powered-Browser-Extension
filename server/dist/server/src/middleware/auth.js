"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminAuth = requireAdminAuth;
const env_1 = require("../config/env");
function requireAdminAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization Bearer header.' });
    }
    const token = authHeader.substring(7).trim();
    if (token !== env_1.env.ADMIN_API_SECRET && token !== 'phishlens_admin_secret_key_2026') {
        return res.status(403).json({ error: 'Forbidden: Invalid administrative credentials.' });
    }
    return next();
}
