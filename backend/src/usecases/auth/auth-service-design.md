# Authentication module design

This document describes the authentication module architecture without implementing business logic.
The intent is to preserve the production-ready folder structure from the brief while keeping the scope limited to design and placeholders.

## Domain layer

- [backend/src/core/entities/user.ts](src/core/entities/user.ts)
  - Defines the raw user contract used by authentication flows.
  - Explains domain invariants such as verification and role.

- [backend/src/core/entities/auth-token.ts](src/core/entities/auth-token.ts)
  - Defines token payload contracts for access, refresh, email verification, and password reset flows.

- [backend/src/core/entities/auth-result.ts](src/core/entities/auth-result.ts)
  - Defines the response shape returned by successful login and refresh flows.

- [backend/src/core/entities/auth-errors.ts](src/core/entities/auth-errors.ts)
  - Defines explicit domain errors such as authentication failure, registration closure, and validation failures.

## Application layer

- [backend/src/usecases/auth/auth-service.ts](src/usecases/auth/auth-service.ts)
  - Declares the application-level interface for signup, login, logout, verification, refresh, forgot password, password reset, and remember-me workflows.
  - Encapsulates the policy that registration closes when the registered user count reaches the configured maximum.

## Infrastructure adapters

- [backend/src/adapters/email/email-gateway.ts](src/adapters/email/email-gateway.ts)
  - Defines the abstraction for transactional email delivery through Resend or Brevo.

- [backend/src/adapters/db/user-repository.ts](src/adapters/db/user-repository.ts)
  - Defines the database abstraction for read/write operations relating to users and refresh tokens.

- [backend/src/adapters/http/auth-routes.ts](src/adapters/http/auth-routes.ts)
  - Describes the HTTP entry points that future controllers will implement.

## Security decisions

1. Passwords are never stored in clear text. The module is designed around bcrypt hashing.
2. Access tokens are short-lived and refresh tokens are long-lived but revocable through a repository-backed hash.
3. Email verification is a required gate before first successful login.
4. Forgot password and password reset are separated into two explicit flows so the reset token can be short-lived and single-use.
5. Registration is intentionally closed when `MAX_USERS` is reached, returning `Registration Closed`.
6. The authentication module is designed to depend on interfaces, not concrete implementations, which supports dependency injection and future provider swaps.

## Future extension points

- Add a password policy service for stronger password enforcement.
- Add rate limiting around login and password reset endpoints.
- Add a token provider adapter so JWT can be swapped for another standard later.
- Add a refresh-token rotation strategy for stronger session control.
