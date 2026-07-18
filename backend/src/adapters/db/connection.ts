import mongoose from 'mongoose';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

// This module exists to isolate database connectivity from the rest of the application.
// Following the Clean Architecture guidance from the brief, infrastructure concerns belong in adapters/db.
// This keeps the HTTP layer and future use cases independent from the details of MongoDB Atlas.

let connectionPromise: Promise<typeof mongoose> | null = null;

const connectWithRetry = async (attempt = 1): Promise<typeof mongoose> => {
  try {
    // Mongoose connection is established through the Atlas URI supplied in the environment.
    // The connection string is intentionally loaded from configuration rather than hard-coded.
    logger.info({ attempt }, 'Attempting MongoDB Atlas connection');
    return await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      },
    });
  } catch (error) {
    // Retry logic is necessary in production because transient network issues and Atlas failovers are common.
    // The exponential backoff strategy gives the deployment time to recover without spamming logs.
    if (attempt >= 5) {
      logger.error({ error, attempt }, 'MongoDB connection failed after retries');
      throw error;
    }

    const delayMs = 2 ** attempt * 1000;
    logger.warn({ error, attempt, delayMs }, 'MongoDB connection attempt failed; retrying');
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return connectWithRetry(attempt + 1);
  }
};

export const connectToDatabase = async (): Promise<typeof mongoose> => {
  // Reuse an in-flight connection promise to avoid duplicate connection attempts during startup.
  // This is especially important when multiple bootstrap paths initialize the database simultaneously.
  if (!connectionPromise) {
    connectionPromise = connectWithRetry();
  }
  return connectionPromise;
};

export const getDatabaseConnectionStatus = () => ({
  // Expose connection status in a simple shape so health checks and startup validation can remain lightweight.
  isConnected: mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
});

export const disconnectFromDatabase = async (): Promise<void> => {
  // This is useful for tests and controlled shutdown scenarios.
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
