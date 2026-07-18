// ────────────────────────────────────────────────────────────────
// Mapper: User Entity ↔ DTO ↔ Model
// ────────────────────────────────────────────────────────────────
// This file contains pure mapping functions that transform data
// between layers (entity, DTO, Mongoose document).
//
// Design decisions:
//   - Single Responsibility: mapping logic is isolated here so
//     entities, DTOs, and models never need to know about each
//     other's shapes.
//   - Dependency Inversion: the service layer depends on these
//     mapper functions rather than directly coupling to Mongoose
//     documents or DTO construction.
//   - Security: the toResponse function explicitly strips sensitive
//     fields (passwordHash, tokens) so they can never appear in
//     API responses.
//   - Testability: pure functions are easy to unit test without
//     any mocking or infrastructure setup.

import type { UserEntity } from '../entities/user.js';
import type { UserResponseDTO, UserListResponseDTO } from '../dto/user-dto.js';

/**
 * Maps a UserEntity to a safe API response DTO.
 *
 * @param entity - The domain entity (may come from repository or service).
 * @returns A plain object with only the fields safe for external consumption.
 *
 * @remarks
 * Sensitive fields are explicitly excluded. If new fields are added
 * to the entity, they must be intentionally included here to appear
 * in API responses — preventing accidental data leaks.
 */
export const toUserResponseDTO = (entity: UserEntity): UserResponseDTO => ({
  id: entity.id,
  email: entity.email,
  role: entity.role,
  isVerified: entity.isVerified,
  isActive: entity.isActive,
  createdAt: entity.createdAt.toISOString(),
  updatedAt: entity.updatedAt.toISOString(),
  lastLoginAt: entity.lastLoginAt ? entity.lastLoginAt.toISOString() : null,
});

/**
 * Maps an array of UserEntities to a paginated list response DTO.
 *
 * @param entities - Array of domain entities.
 * @param total - Total number of matching records (for pagination).
 * @param page - Current page number.
 * @param limit - Items per page.
 * @returns A paginated response DTO.
 */
export const toUserListResponseDTO = (
  entities: UserEntity[],
  total: number,
  page: number,
  limit: number,
): UserListResponseDTO => ({
  users: entities.map(toUserResponseDTO),
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

/**
 * Maps a Mongoose document (with _id and __v) to a plain UserEntity.
 *
 * @param doc - The raw document returned by Mongoose.
 * @returns A plain UserEntity object.
 *
 * @remarks
 * This function normalises the document by converting _id to id and
 * removing Mongoose-specific metadata. This keeps the domain layer
 * free of database framework concerns.
 */
export const fromDocumentToEntity = <T extends { _id: unknown; __v?: unknown; id?: string }>(
  doc: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  if (!doc) return doc;

  const obj = { ...doc } as Record<string, unknown>;
  // Convert Mongoose _id to a string id for the domain layer
  if (obj._id) {
    obj.id = String(obj._id);
  }
  // Remove Mongoose-internal fields
  delete obj._id;
  delete obj.__v;

  return obj;
};