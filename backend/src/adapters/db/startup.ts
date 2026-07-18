import { connectToDatabase, disconnectFromDatabase, getDatabaseConnectionStatus } from './connection.js';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';

// This startup module performs database validation during boot.
// It is intentionally isolated in adapters/db so that bootstrap code can call it without knowing the implementation details of Mongoose.
// The separation supports the Dependency Inversion and Open/Closed Principles because the startup sequence can evolve without changing route code.

export const validateDatabaseStartup = async () => {
  try {
    await connectToDatabase();

    const status = getDatabaseConnectionStatus();
    if (!status.isConnected) {
      throw new Error('Database connection was not established');
    }

    logger.info({ environment: env.NODE_ENV, readyState: status.readyState }, 'Database startup validation succeeded');
    return true;
  } catch (error) {
    logger.error({ error }, 'Database startup validation failed');
    throw error;
  }
};

export const shutdownDatabase = async () => {
  await disconnectFromDatabase();
  logger.info('Database disconnected');
};
