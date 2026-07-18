// This file defines the persistence contract for authentication-related user operations.
// It is intentionally placed in adapters/db because it adapts the domain to data storage.
// The design follows the Repository Pattern: the application layer depends on an abstraction, not on Mongoose directly.
// No models are created here because the request explicitly asked for module design without creating database models yet.

import type { UserEntity } from '../../core/entities/user.js';

export interface UserRepository {
  countAll(): Promise<number>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
  update(id: string, patch: Partial<UserEntity>): Promise<UserEntity | null>;
  updateByEmail(email: string, patch: Partial<UserEntity>): Promise<UserEntity | null>;
  setRefreshTokenHash(userId: string, hash: string | null): Promise<void>;
  clearRefreshTokenHash(userId: string): Promise<void>;
}
