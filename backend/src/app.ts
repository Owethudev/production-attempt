import express from 'express';
import type { Application } from 'express';
import { registerSecurityMiddleware } from './middlewares/security.js';
import { requestContextMiddleware } from './middlewares/request-context.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import { logger } from './config/logger.js';
import { env } from './config/env.js';
import { getDatabaseHealth } from './adapters/db/index.js';

// This module builds the Express application instance.
// It acts as the interface adapter layer and keeps the server bootstrapping logic separate from configuration and infrastructure concerns.
// The design follows Separation of Concerns: no business logic is present here; only initialization, middleware registration, and lifecycle wiring.

export const createApp = (): Application => {
  const app = express();

  app.set('trust proxy', 1);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  registerSecurityMiddleware(app);
  app.use(requestContextMiddleware);

  app.get('/health', (_req, res) => {
    const databaseHealth = getDatabaseHealth();

    res.status(databaseHealth.status === 'ok' ? 200 : 503).json({
      status: databaseHealth.status === 'ok' ? 'ok' : 'degraded',
      environment: env.NODE_ENV,
      database: databaseHealth,
      timestamp: new Date().toISOString(),
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  logger.info({ port: env.PORT }, 'Express application initialized');

  return app;
};
