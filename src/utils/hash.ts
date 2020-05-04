import argon2 from 'argon2';

import { config } from '../appConfig';

export async function hashPassword(password: string) {
  return argon2.hash(password, { saltLength: config.saltLength });
}

export function verifyPassword(password: string, cryptedPassword: string) {
  return argon2.verify(cryptedPassword, password);
}
