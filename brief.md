Portfolio Social Platform – Architectural Blueprint
Maximum of 30 students, production‑ready, security‑first.

1️⃣ Accounts to Create
Service Purpose Recommended Plan / Notes
GitHub Source control & CI (GitHub Actions)
Private repo,
enable branch protection
MongoDB Atlas
Managed MongoDB (cloud) Free tier is enough for ≤30 users, enable IP whitelist
Resend (or Brevo) Transactional email (verification, password reset) Verify domain, obtain API key
Vercel Front‑end hosting (static + edge functions) Connect repo, enable preview deployments
Render Backend hosting (Node/Express) Free or Starter plan, enable private services
Postman API design, testing, documentation Create a workspace, import OpenAPI spec
Cloudinary (optional) Profile image storage & transformations Free tier, set up upload preset

2️⃣ Required Secrets / Environment Variables

| Variable             | Scope   | Description                                                   | Where to get it                                                                                                      |
| -------------------- | ------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`        | Backend | Atlas connection string (username/password hidden)            | Create a MongoDB Atlas cluster, then copy the connection string from the Atlas dashboard.                            |
| `JWT_SECRET`         | Backend | HMAC secret for access tokens (≥256‑bit)                      | Generate a long random string locally with `openssl rand -base64 64` or any password manager.                        |
| `JWT_REFRESH_SECRET` | Backend | Separate secret for refresh tokens                            | Generate another long random secret locally; keep it distinct from `JWT_SECRET`.                                     |
| `EMAIL_API_KEY`      | Backend | Resend/Brevo API key                                          | Create an account on Resend or Brevo, verify your sending domain, then copy the API key from the dashboard.          |
| `EMAIL_FROM`         | Backend | Verified sender address (e.g., `no-reply@yourdomain.com`)     | Set this to an email address verified in Resend/Brevo.                                                               |
| `CLIENT_URL`         | Backend | Front‑end base URL (e.g., `https://your-frontend.vercel.app`) | Use the deployed Vercel frontend URL after deployment, or `http://localhost:5173` locally.                           |
| `CORS_ORIGIN`        | Backend | Whitelisted origin(s) – usually `CLIENT_URL`                  | Use the same frontend origin as `CLIENT_URL`; for local development, include `http://localhost:5173`.                |
| `ADMIN_EMAIL`        | Backend | Email of the sole administrator                               | Choose the email address you will use as the initial administrator account.                                          |
| `ADMIN_PASSWORD`     | Backend | Initial admin password (hashed on first start)                | Choose a strong temporary password; it will be hashed on first boot and should be changed after setup.               |
| `MAX_USERS`          | Backend | `30` – enforced at registration                               | Set this in the environment as `30`; if you want to change the limit later, update this value in deployment secrets. |
| `PORT`               | Backend | Port for Express (default `3000`)                             | Set to `3000` locally or use the platform’s assigned port in deployment.                                             |
| `NODE_ENV`           | Both    | `development` / `production`                                  | Set to `development` locally and `production` in deployment.                                                         |
| `VERCEL_TOKEN`       | CI/CD   | Vercel deployment token (GitHub Actions)                      | Create it in the Vercel dashboard under Account Settings → Tokens.                                                   |
| `RENDER_SERVICE_ID`  | CI/CD   | Render service identifier for automatic deploys               | Find this in the Render dashboard for your backend service.                                                          |

Never commit any of the above to the repository. Store them in the respective platform’s secret manager (GitHub Actions, Vercel, Render).

---

## 3️⃣ Project Rules (Business & Technical Constraints)

1. **User Limit** – `MAX_USERS = 30`. Registration must reject new accounts once the count is reached.
2. **Email Verification** – Users must verify their email before they can obtain a JWT. Unverified accounts are stored with `isVerified: false`.
3. **Single Administrator** – Only one admin account (`ADMIN_EMAIL`). All admin-only routes check `user.role === 'admin'`.
4. **Password Security** – Passwords are hashed with **bcrypt** (`saltRounds = 12`). No plain-text storage.
5. **Protected Routes** – Every route that mutates data or reads private data requires a valid access token (`Authorization: Bearer <jwt>`).
6. **Input Validation** – All incoming payloads are validated with **Zod** (or Joi) before reaching the service layer. Validation errors return `400 Bad Request` with a clear message.
7. **Secrets Management** – All secrets are injected via environment variables; never appear in code or logs.
8. **Extensibility** – Limits such as `MAX_USERS` are read from env, making them configurable without code changes.

---

## 4️⃣ Production-Ready Folder Structure

```text
/ (repo root)
├─ .github/                # GitHub Actions CI/CD pipelines
│   └─ workflows/
│       └─ ci.yml
├─ backend/                # Node/Express API (Clean Architecture)
│   ├─ src/
│   │   ├─ config/         # Configuration loaders (env, validation)
│   │   ├─ core/           # Domain layer – pure business rules
│   │   │   ├─ entities/   # Domain models (User, Profile, Post, etc.)
│   │   │   └─ value-objects/
│   │   ├─ usecases/       # Application layer – Service classes (UserService, AuthService)
│   │   ├─ adapters/       # Infrastructure adapters
│   │   │   ├─ db/          # Mongoose models + Repository implementations
│   │   │   ├─ email/       # Resend/Brevo client wrapper
│   │   │   └─ http/        # Express controllers (router definitions)
│   │   ├─ di/             # Dependency Injection container (Inversify/TSyringe)
│   │   ├─ middlewares/    # Express middlewares (auth, error handling, validation)
│   │   ├─ utils/          # Cross-cutting helpers (logger, crypto, token utils)
│   │   └─ server.ts       # Composition root – builds DI container, starts Express
│   ├─ tests/              # Unit & integration tests (Jest + Supertest)
│   └─ tsconfig.json
├─ frontend/               # React + Vite (Feature-based modules)
│   ├─ src/
│   │   ├─ app/            # Core app bootstrap (router, providers)
│   │   │   ├─ routes/     # React Router route definitions (feature modules)
│   │   │   └─ providers/  # DI providers (Axios instance, auth context)
│   │   ├─ features/       # Feature-based folders (Auth, Profile, Portfolio)
│   │   │   ├─ auth/
│   │   │   │   ├─ components/   # UI components (LoginForm, RegisterForm)
│   │   │   │   ├─ hooks/        # Custom hooks (useLogin, useRegister)
│   │   │   │   └─ pages/        # Page components (LoginPage, VerifyEmailPage)
│   │   │   ├─ profile/
│   │   │   │   ├─ components/
│   │   │   │   └─ pages/
│   │   │   └─ portfolio/
│   │   │       ├─ components/
│   │   │       └─ pages/
│   │   ├─ shared/          # Reusable UI primitives (Button, Card, Input)
│   │   ├─ assets/          # Images, icons, fonts
│   │   ├─ styles/          # Tailwind config + global CSS
│   │   └─ main.tsx         # Entry point – renders <App />
│   ├─ public/
│   ├─ vite.config.ts
│   ├─ tsconfig.json
│   └─ tailwind.config.cjs
├─ .env.example           # Template for required env vars (frontend & backend)
├─ .gitignore
├─ README.md
└─ package.json           # Optional monorepo scripts
```

### Folder Explanations

| Folder                      | Why it exists                                                                                                              | Design notes (SOLID, Clean Architecture)                                                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **backend/src/config**      | Centralizes configuration loading and validation.                                                                          | **Single Responsibility**: only config. **Open/Closed**: new config sources can be added without touching other code.                              |
| **backend/src/core**        | Holds domain entities and value objects — pure business concepts with no framework dependencies.                           | **Dependency Inversion**: higher layers depend on these abstractions, not on Express/Mongoose.                                                     |
| **backend/src/usecases**    | Service layer (application use cases). Each class implements one business operation.                                       | **SRP**: one class = one use case. **Open/Closed**: new use cases can be added without modifying existing ones.                                    |
| **backend/src/adapters**    | Bridges domain logic to external technologies (DB, email, HTTP). Contains repository implementations and gateway wrappers. | **Repository Pattern**: repository abstractions hide persistence details. **Interface Segregation**: each adapter exposes only the methods needed. |
| **backend/src/di**          | Dependency Injection container. Registers interfaces to concrete implementations.                                          | **Dependency Inversion**: high-level modules request abstractions and the container supplies implementations.                                      |
| **backend/src/middlewares** | Express middleware for auth, validation, and error handling.                                                               | **SRP**: each middleware does one thing. **Open/Closed**: more middleware can be layered in without changing existing routes.                      |
| **backend/src/utils**       | Cross-cutting helpers such as logger, crypto, token utilities.                                                             | **Single Responsibility**: each utility focuses on a single concern.                                                                               |
| **backend/src/server.ts**   | Composition root that builds the DI container, wires Express, and starts the server.                                       | **Dependency Injection**: all dependencies are resolved at the composition root, keeping the rest of the code framework-agnostic.                  |
| **frontend/src/app**        | Bootstrap layer: router, providers, global app wiring.                                                                     | **SRP**: only app-level wiring. **Open/Closed**: new providers can be added without changing core UI components.                                   |
| **frontend/src/features**   | Feature-based modules such as Auth, Profile, and Portfolio.                                                                | **Feature-Based Architecture**: concerns remain localized and easy to scale.                                                                       |
| **frontend/src/shared**     | Reusable UI primitives like Button, Input, Card.                                                                           | **Interface Segregation**: shared components expose only the props they truly need.                                                                |
| **frontend/src/styles**     | Tailwind config and global CSS.                                                                                            | **Single Responsibility**: styling concerns are isolated from application logic.                                                                   |
| **.github/workflows**       | CI/CD automation for lint, test, build, and deploy.                                                                        | **Open/Closed**: additional steps can be added without changing application code.                                                                  |
| **.env.example**            | Template for required environment variables.                                                                               | **SRP**: only documentation; no secrets are stored here.                                                                                           |

---

## 5️⃣ Request Lifecycle (From HTTP to Domain)

1. **Incoming HTTP request** → Express router for the relevant feature.
2. **Validation middleware** (Zod/Joi) rejects malformed payloads with `400`.
3. **Authentication middleware** checks the access token, verifies its signature, and attaches `req.user`.
4. **Authorization middleware** checks whether the user has the required role for the route.
5. **Controller** receives the request and calls the relevant use case/service.
6. **Service layer** orchestrates business rules, uses repository interfaces, and may invoke the email gateway.
7. **Repository implementation** (Mongoose) performs the database operation.
8. **Service** returns a DTO or domain result to the controller.
9. **Controller** formats the response and sends it back to the client.
10. **Error handler** catches `DomainError`, `ApplicationError`, or unexpected exceptions and returns consistent JSON errors.

---

## 6️⃣ Authentication Flow

| Step                      | Description                                                                                                                                      | SOLID Principle                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| **1. Register**           | User submits email/password; system validates input, checks `MAX_USERS`, stores the user as `isVerified: false`, and sends a verification email. | **SRP** – registration logic stays isolated.                                                |
| **2. Email verification** | User clicks the verification link; backend validates the token and marks the account as verified.                                                | **Open/Closed** – token validation can be swapped later without changing the business rule. |
| **3. Login**              | User submits credentials; backend validates password with bcrypt, checks email verification, and issues access + refresh tokens.                 | **Dependency Inversion** – token generation is abstracted behind a provider interface.      |
| **4. Refresh**            | Client sends the refresh token; backend validates it and issues a new access token.                                                              | **Liskov Substitution** – different token providers can be swapped.                         |
| **5. Logout**             | Client calls `/api/auth/logout`; server revokes or deletes the refresh token.                                                                    | **Interface Segregation** – logout only depends on the token revocation interface.          |

### Token Types

| Token                      | Purpose                   | Lifetime   | Stored Where                                                    |
| -------------------------- | ------------------------- | ---------- | --------------------------------------------------------------- |
| **Access JWT**             | Authorize API calls       | 15 minutes | Client memory or secure storage; sent in `Authorization` header |
| **Refresh JWT**            | Obtain a new access token | 7 days     | httpOnly, Secure cookie or secure client storage                |
| **Email verification JWT** | Verify email address      | 24 hours   | Sent through email link                                         |

---

## 7️⃣ Authorization Flow

- **Roles**: `admin`, `user`.
- **RBAC** is enforced by middleware that reads `req.user.role`.
- Each protected route declares the roles it allows.
- If authorization fails, the API returns `403 Forbidden`.

> Adding new roles later only requires extending the role model and the policy map — this preserves **Open/Closed** behavior.

---

## 8️⃣ Security Strategy

| Concern                     | Mitigation                                                                                    |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| **Injection**               | Use Mongoose parameterized queries and validate every input before it hits the service layer. |
| **Password Storage**        | Hash passwords with bcrypt (`saltRounds = 12`).                                               |
| **Token Theft**             | Use short-lived access tokens and httpOnly refresh cookies.                                   |
| **CSRF**                    | Use SameSite cookies and restrict cross-site requests.                                        |
| **CORS**                    | Whitelist only approved origins via `CORS_ORIGIN`.                                            |
| **Rate Limiting**           | Apply rate limiting to auth endpoints.                                                        |
| **Helmet**                  | Set security headers such as CSP and X-Content-Type-Options.                                  |
| **Sensitive Data Exposure** | Never return password hashes or internal error traces.                                        |
| **Logging**                 | Use structured logs without sensitive values.                                                 |
| **Dependency Updates**      | Run `npm audit` in CI and block high-severity vulnerabilities.                                |
| **Secrets Management**      | Load all secrets from environment variables; never commit `.env` files.                       |
| **HTTPS Everywhere**        | Vercel and Render provide TLS by default; enforce HTTPS in production.                        |

---

## 9️⃣ Deployment Strategy

| Component         | Platform                  | Build / Deploy Steps                                                                           |
| ----------------- | ------------------------- | ---------------------------------------------------------------------------------------------- |
| **Frontend**      | **Vercel**                | Connect GitHub repo, run `npm install && npm run build`, and deploy the static output.         |
| **Backend**       | **Render**                | Connect GitHub repo, build the Node/Express service, and run it in production mode.            |
| **Database**      | **MongoDB Atlas**         | Create a cluster, enable access control, and store the URI in the backend environment secrets. |
| **Email Service** | **Resend / Brevo**        | Verify your sending domain and store the API key in backend secrets.                           |
| **CI/CD**         | **GitHub Actions**        | Run linting, tests, and security checks before deployment.                                     |
| **Static Assets** | **Cloudinary** (optional) | Store profile images via signed upload preset and save the returned public URL.                |

### Deployment Pipeline (high-level)

1. **Push** to GitHub triggers the pipeline.
2. **Lint + tests** fail fast on quality issues.
3. **Build frontend** and **backend**.
4. **Deploy** to Vercel and Render.
5. **Smoke test** the health endpoint to confirm the backend is live.

---

## 10️⃣ Summary

- **Clean Architecture** separates the domain, application, infrastructure, and interface layers.
- **Repository Pattern** keeps persistence details behind abstractions.
- **Service Layer** holds all business rules and keeps controllers thin.
- **Dependency Injection** wires concrete implementations at the composition root.
- **Feature-based frontend modules** keep the UI easy to scale.
- **Security** is built in from the start: bcrypt, JWTs, cookies, rate limiting, and strict CORS.
- **Deployment** uses Vercel and Render with automated CI/CD, keeping the system production-ready.

All constraints — max 30 users, email verification, single admin, secret handling — are expressed as environment-driven configuration so the system remains configurable and easy to evolve.
