import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

// Validation is kept in a dedicated module so that request schemas can be centralized.
// This supports the Single Responsibility Principle and makes request contracts explicit.
// Future routes can reuse the same validation middleware with feature-specific schemas.

export const validateBody = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      // Return a structured error so the client knows exactly which field failed.
      return _res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    req.body = result.data;
    return next();
  };
};

export const validateQuery = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return _res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    req.query = result.data as typeof req.query;
    return next();
  };
};
