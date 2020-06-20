import bcrypt from 'bcrypt';

import { config } from '../appConfig';

/**
 * Hash the given password using bcrypt algorithm
 *
 * @param password The password to hash (must not be more than 64 bytes)
 * @returns The hashed password
 */
export async function hashPassword(password: string) {
  return bcrypt.hash(password, config.saltRounds);
}

/**
 * Check if the given password match the given crypted password
 *
 * @param password The clear password
 * @param cryptedPassword The hash of a password
 * @returns True if the two passwords match, false otherwise
 */
export function verifyPassword(password: string, cryptedPassword: string) {
  return bcrypt.compare(password, cryptedPassword);
}
