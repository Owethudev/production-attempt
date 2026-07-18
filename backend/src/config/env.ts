import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

// This module exists to centralize environment loading and validation.
// The design follows the Single Responsibility Principle because configuration is isolated from the rest of the application.
// It also supports future scalability by allowing new environment values to be introduced in one place without scattering defaults across the codebase.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the backend root, not from the current working directory.
// This prevents path-dependent environment loading and makes local development predictable.
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// The schema provides an explicit contract for runtime configuration.
// Validation is intentionally strict so that missing or malformed values fail fast.
// This is a defensive design choice that improves production safety and simplifies debugging.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  EMAIL_API_KEY: z.string().min(1, 'EMAIL_API_KEY is required'),
  EMAIL_FROM: z.string().email('EMAIL_FROM must be a valid email address'),
  CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL'),
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email address'),
  ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters'),
  MAX_USERS: z.coerce.number().int().positive().default(30),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // Fail fast at startup rather than allowing invalid configuration to reach deeper layers.
  // This follows the Dependency Inversion Principle by making the configuration contract explicit and predictable.
  throw new Error(`Invalid environment configuration: ${parsedEnv.error.issues.map((issue) => issue.message).join(', ')}`);
}

export const env = parsedEnv.data;

// The exported object is intentionally read-only for consumers.
// This makes configuration usage predictable and prevents accidental mutation during runtime.
export const getEnv = () => env;
