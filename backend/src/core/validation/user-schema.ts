// ────────────────────────────────────────────────────────────────
// Validation: User Zod Schemas
// ────────────────────────────────────────────────────────────────
// This file centralises all Zod validation schemas for the User module.
// Keeping validation in the core layer ensures that business rules
// about data shape are enforced before any use case or repository
// processes the input.
//
// Design decisions:
//   - Single Responsibility: each schema validates exactly one
//     operation (create, update, change password, etc.).
//   - Fail Fast: validation happens at the HTTP boundary (middleware)
//     so malformed data never reaches the service layer.
//   - Reusability: schemas can be composed or extended for different
//     routes without duplication.
//   - Security: schemas enforce minimum lengths, allowed characters,
//     and format constraints to prevent injection or abuse.

import { z } from 'zod';

// ── Password rules ──────────────────────────────────────────────
// Centralised so the same rules apply to registration, password
// change, and password reset flows. Changing the policy here
// propagates everywhere automatically.
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters');

// ── Email rules ─────────────────────────────────────────────────
const emailSchema = z
  .string()
  .email('A valid email address is required')
  .max(255, 'Email must not exceed 255 characters')
  .transform((email) => email.toLowerCase().trim());

// ── Create User ─────────────────────────────────────────────────
// Used during registration. The role defaults to 'user' so that
// only the admin bootstrap flow can explicitly set 'admin'.
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['user', 'admin']).optional().default('user'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ── Update User ─────────────────────────────────────────────────
// All fields are optional for PATCH semantics. At least one field
// must be provided to prevent no-op updates.
export const updateUserSchema = z
  .object({
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    isVerified: z.boolean().optional(),
    isActive: z.boolean().optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ── Change Password ─────────────────────────────────────────────
// Requires both current and new password so the service can verify
// the user's identity before allowing the change.
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ── User ID Param ───────────────────────────────────────────────
// Validates that the :id route parameter is a valid MongoDB ObjectId
// or a UUID. This prevents malformed IDs from reaching the database.
export const userIdParamSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

export type UserIdParamInput = z.infer<typeof userIdParamSchema>;

// ── Pagination Query ────────────────────────────────────────────
// Standard pagination parameters for list endpoints.
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;