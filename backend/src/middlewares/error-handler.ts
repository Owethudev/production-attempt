import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';

// This module centralizes error handling.
// By keeping all error formatting and logging in one place, the system follows the Single Responsibility Principle and remains easier to evolve.
// The error response is intentionally generic in production to avoid leaking internal details to clients.

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  const error = new Error(`Route not found: ${_req.method} ${_req.originalUrl}`);
  (error as Error & { statusCode?: number }).statusCode = 404;
  next(error);
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = (err as Error & { statusCode?: number }).statusCode ?? 500;
  const message = statusCode >= 500 ? 'Internal server error' : err.message;

  logger.error({ err, statusCode, path: _req.originalUrl }, 'Request failed');

  res.status(statusCode).json({
    error: message,
    requestId: _req.headers['x-request-id'] ?? 'unknown',
  });
};
