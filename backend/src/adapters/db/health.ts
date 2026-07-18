import { getDatabaseConnectionStatus } from './connection.js';
import { logger } from '../../config/logger.js';

// This module is intentionally small because health checks are infrastructure concerns.
// It exposes a simple status object so higher layers, such as Express routes or external monitors, can verify database readiness.
// Following the Single Responsibility Principle, it focuses only on status reporting and not on any business logic.

export const getDatabaseHealth = () => {
  const status = getDatabaseConnectionStatus();

  if (status.isConnected) {
    return {
      status: 'ok',
      database: 'mongodb',
      readyState: status.readyState,
      message: 'Database connection is ready',
    } as const;
  }

  return {
    status: 'degraded',
    database: 'mongodb',
    readyState: status.readyState,
    message: 'Database connection is not ready',
  } as const;
};

export const reportDatabaseHealth = () => {
  const health = getDatabaseHealth();
  logger.info({ health }, 'Database health check');
  return health;
};
