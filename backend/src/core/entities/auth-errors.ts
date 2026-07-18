// This file centralizes domain-level error definitions for the authentication module.
// Keeping errors explicit improves maintainability and makes failures easier to handle consistently across controllers and middleware.
// The design follows the Single Responsibility Principle because all authentication-related error shapes live in one place.

export class AuthenticationError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = statusCode;
  }
}

export class AuthorizationError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 403) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = statusCode;
  }
}

export class ValidationError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }
}

export class RegistrationClosedError extends Error {
  public readonly statusCode: number;

  constructor(message = 'Registration Closed') {
    super(message);
    this.name = 'RegistrationClosedError';
    this.statusCode = 403;
  }
}
