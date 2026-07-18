import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { createRequestLogger } from '../config/logger.js';

// This middleware adds a correlation ID to each incoming request.
// Correlation IDs are crucial in production for tracing a single request across logs, traces, and support tickets.
// The design keeps request-scoped metadata separate from business logic and supports future diagnostics.

export const requestContextMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  const requestId = randomUUID();
  res.setHeader('x-request-id', requestId);
  _req.headers['x-request-id'] = requestId;
  _req.app.locals.requestLogger = createRequestLogger(requestId);
  next();
};
