// This file defines the route contract for the authentication module.
// It belongs in adapters/http because it adapts the application service to HTTP requests.
// The file contains no business logic; it only describes the entry points that future controllers or route handlers will implement.
// This keeps the request layer thin and supports the Single Responsibility Principle.

import type { Request, Response } from 'express';
import type { AuthService } from '../../usecases/auth/auth-service.js';

export interface AuthRouteHandlers {
  signup(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  verifyEmail(req: Request, res: Response): Promise<void>;
  refreshToken(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
}

export interface AuthRouteDependencies {
  authService: AuthService;
}
