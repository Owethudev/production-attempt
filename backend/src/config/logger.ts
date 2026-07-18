import pino from 'pino';
import { env } from './env.js';

// Logging is separated out because observability is a cross-cutting concern.
// This file follows the Single Responsibility Principle by owning only logging behavior.
// It is easy to extend with transports, structured formats, or remote logging providers later.

const transport = env.NODE_ENV === 'development'
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    }
  : undefined;

export const logger = pino(
  {
    level: env.LOG_LEVEL,
    base: undefined,
    redact: ['req.headers.authorization', 'password', 'token', 'secret'],
  },
  transport ? pino.transport(transport) : undefined,
);

export const createRequestLogger = (requestId: string) => logger.child({ requestId });
