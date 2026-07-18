// This file defines a data contract for authentication results.
// It is intentionally in the core layer so service classes can return a stable shape to controllers and future presenters.
// This supports the Interface Segregation Principle because each consumer receives only what it needs.

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: 'user' | 'admin';
    isVerified: boolean;
  };
  expiresAt: string;
}
