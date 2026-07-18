# Backend foundation

This directory contains the non-business-logic scaffold for the portfolio social platform.
It is intentionally limited to infrastructure concerns so that future feature modules can be added without rewriting the foundation.

## What is included

- Express initialization and application bootstrapping.
- Environment configuration with validation and safe defaults.
- Logging with structured output.
- Central error handling and route-not-found handling.
- Global middleware registration for security, parsing, and request tracking.
- Validation middleware for future route schemas.
- A lightweight dependency injection container for future services and repositories.

## Where to edit secrets and keys

- Copy [.env.example](.env.example) to .env and edit the values there.
- In production, set the same variables in your hosting provider secret manager.
- Keep `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `EMAIL_API_KEY`, `ADMIN_PASSWORD`, and similar values out of source control.
