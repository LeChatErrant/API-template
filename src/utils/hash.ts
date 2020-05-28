import bcrypt from 'bcrypt';

import { config } from '../appConfig';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, config.saltRounds);
}

export function verifyPassword(password: string, cryptedPassword: string) {
  return bcrypt.compare(password, cryptedPassword);
}
