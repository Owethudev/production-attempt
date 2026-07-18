// This file represents the authentication token concept in the core layer.
// It lives outside any HTTP or database implementation so future token strategies can be changed without modifying business rules.
// The design follows the Dependency Inversion Principle because the service layer depends on this abstraction rather than the concrete JWT library.

export interface AccessTokenPayload {
  sub: string;
  role: 'user' | 'admin';
  type: 'access';
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string;
  role: 'user' | 'admin';
  type: 'refresh';
  tokenVersion?: number;
  iat?: number;
  exp?: number;
}

export interface EmailVerificationTokenPayload {
  sub: string;
  type: 'email-verification';
  iat?: number;
  exp?: number;
}

export interface PasswordResetTokenPayload {
  sub: string;
  type: 'password-reset';
  iat?: number;
  exp?: number;
}
