import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { validateDatabaseStartup, shutdownDatabase } from './adapters/db/index.js';

// This is the composition root for the backend foundation.
// It wires together infrastructure concerns only: configuration, logging, database startup validation, and the HTTP server.
// No domain logic, authentication, or user modules are introduced here, in line with the request.
// Future feature modules can be mounted here without changing this bootstrap code unnecessarily.

const app = createApp();

const startServer = async () => {
  try {
    await validateDatabaseStartup();
    const server = app.listen(env.PORT, () => {
      logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Backend foundation listening');
    });

    const shutdown = async (signal: NodeJS.Signals) => {
      logger.info({ signal }, 'Received shutdown signal');
      server.close(async () => {
        await shutdownDatabase();
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error({ error }, 'Server startup failed');
    process.exit(1);
  }
};

await startServer();
