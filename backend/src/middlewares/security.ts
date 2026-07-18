import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import type { Application } from 'express';
import { env } from '../config/env.js';

// Security middleware is registered here rather than inside the server bootstrap.
// This keeps security concerns grouped and makes future tuning easier.
// The design follows the Open/Closed Principle because new security controls can be added without changing the application entrypoint.

export const registerSecurityMiddleware = (app: Application) => {
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(cookieParser());
};
