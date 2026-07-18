// This file defines the core user entity for the authentication domain.
// It belongs in the core layer because it expresses business concepts without depending on Express, Mongoose, or any database library.
// The design follows the Single Responsibility Principle: this file only describes the user shape and invariants.
// It is intentionally free of persistence or HTTP concerns so it can evolve independently of infrastructure.

export type UserRole = 'user' | 'admin';

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
  verificationToken?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpiresAt?: Date | null;
  refreshTokenHash?: string | null;
}

// The entity is intentionally simple because the brief asks for authentication design only.
// It can be extended later to include profile fields, display name, bio, and portfolio metadata without breaking the domain contract.
