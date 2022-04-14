import type { User } from '@prisma/client';

import type { UserRo } from './user.types';

/**
 * Build a user Response Object (RO) with only the fields to be shown to the user
 * Can be used to compute or add extra information to the user object, useful for front-end display
 *
 * @param user The user object to format
 * @returns A user Response Object ready to be sent into API responses
 */
export function buildUserRo(user: User): UserRo {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
