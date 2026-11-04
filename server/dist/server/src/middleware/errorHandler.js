"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error('[Error] Unhandled server error:', err);
    if (res.headersSent) {
        return next(err);
    }
    const statusCode = err.status || err.statusCode || 500;
    return res.status(statusCode).json({
        error: err.message || 'An unexpected internal server error occurred.',
        timestamp: new Date().toISOString(),
    });
}
