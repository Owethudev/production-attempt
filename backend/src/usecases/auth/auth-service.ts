// This file defines the application service contract for authentication workflows.
// It belongs in the usecases layer because it orchestrates application behavior without depending on Express or database framework internals.
// The design follows the Single Responsibility Principle: one service class owns the orchestration of auth use cases.
// It also supports the Open/Closed Principle because new flows such as MFA or OAuth can be added without changing this module's API shape.

import type { UserEntity } from '../../core/entities/user.js';
import type { AuthResult } from '../../core/entities/auth-result.js';
import { AuthenticationError, RegistrationClosedError, ValidationError } from '../../core/entities/auth-errors.js';

export interface AuthService {
  signup(input: SignupInput): Promise<AuthResult>;
  login(input: LoginInput): Promise<AuthResult>;
  logout(input: LogoutInput): Promise<void>;
  verifyEmail(input: VerifyEmailInput): Promise<void>;
  refreshToken(input: RefreshTokenInput): Promise<AuthResult>;
  forgotPassword(input: ForgotPasswordInput): Promise<void>;
  resetPassword(input: ResetPasswordInput): Promise<void>;
  rememberMe(input: RememberMeInput): Promise<AuthResult>;
}

export interface SignupInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LogoutInput {
  userId: string;
  refreshToken?: string;
}

export interface VerifyEmailInput {
  token: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface RememberMeInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

// The service interface provides a stable abstraction for controllers.
// The implementation can later be swapped for a different storage or token provider without altering route definitions.
export abstract class BaseAuthService implements AuthService {
  protected constructor(protected readonly maxUsers: number) {
    this.maxUsers = maxUsers;
  }

  public abstract signup(input: SignupInput): Promise<AuthResult>;
  public abstract login(input: LoginInput): Promise<AuthResult>;
  public abstract logout(input: LogoutInput): Promise<void>;
  public abstract verifyEmail(input: VerifyEmailInput): Promise<void>;
  public abstract refreshToken(input: RefreshTokenInput): Promise<AuthResult>;
  public abstract forgotPassword(input: ForgotPasswordInput): Promise<void>;
  public abstract resetPassword(input: ResetPasswordInput): Promise<void>;
  public abstract rememberMe(input: RememberMeInput): Promise<AuthResult>;

  protected ensureSignupAllowed(userCount: number): void {
    // The brief requires that registration close when the user count reaches the configured limit.
    // The decision is explicit and centralized here so the rule is not duplicated across controllers or repositories.
    if (userCount >= this.maxUsers) {
      throw new RegistrationClosedError('Registration Closed');
    }
  }

  protected ensureEmailPresent(email: string): void {
    if (!email || !email.includes('@')) {
      throw new ValidationError('A valid email is required');
    }
  }

  protected ensurePasswordPresent(password: string): void {
    if (!password || password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }
  }

  protected ensureAccountIsVerified(user: Pick<UserEntity, 'isVerified'>): void {
    if (!user.isVerified) {
      throw new AuthenticationError('Email must be verified before login');
    }
  }
}
