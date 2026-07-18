// ────────────────────────────────────────────────────────────────
// DTO: User Data Transfer Objects
// ────────────────────────────────────────────────────────────────
// This file defines the input/output contracts for the User module.
// DTOs live in the core layer because they represent the shape of
// data flowing across the application boundary without tying to
// Express, Mongoose, or any external framework.
//
// Design decisions:
//   - Single Responsibility: each DTO serves exactly one purpose
//     (create input, update input, response output).
//   - Interface Segregation: consumers (controllers, services)
//     depend only on the specific DTO they need, not on a bloated
//     user object.
//   - Security: UserResponseDTO explicitly excludes sensitive fields
//     like passwordHash, refreshTokenHash, and reset tokens so they
//     can never leak through API responses.
//   - Immutability: all fields are readonly to prevent accidental
//     mutation after construction.

/**
 * Input DTO for creating a new user.
 * Used by the signup/registration flow.
 */
export interface CreateUserDTO {
  readonly email: string;
  readonly password: string;
  readonly role?: 'user' | 'admin';
}

/**
 * Input DTO for updating an existing user's profile.
 * All fields are optional so callers can send partial updates.
 */
export interface UpdateUserDTO {
  readonly email?: string;
  readonly password?: string;
  readonly isVerified?: boolean;
  readonly isActive?: boolean;
  readonly role?: 'user' | 'admin';
}

/**
 * Input DTO for changing a user's password.
 * Requires the current password for verification and the new password.
 */
export interface ChangePasswordDTO {
  readonly userId: string;
  readonly currentPassword: string;
  readonly newPassword: string;
}

/**
 * Response DTO sent to clients.
 * Sensitive fields (passwordHash, tokens, etc.) are intentionally omitted.
 * This ensures the API never accidentally exposes secrets even if the
 * entity or model changes internally.
 */
export interface UserResponseDTO {
  readonly id: string;
  readonly email: string;
  readonly role: 'user' | 'admin';
  readonly isVerified: boolean;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly lastLoginAt: string | null;
}

/**
 * Response DTO for paginated user lists.
 * Wraps the array in a metadata object so the client knows about
 * pagination state without needing a separate request.
 */
export interface UserListResponseDTO {
  readonly users: UserResponseDTO[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}