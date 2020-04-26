import bcrypt from 'bcrypt';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';

import { config } from '../../appConfig';
import db from '../../appDatabase';

import type { UserCreation, UserModifiableFields } from './types';

function hashPassword(password: string) {
  return bcrypt.hash(password, config.saltRounds);
}

export async function createUser(payload: UserCreation) {
  const hashedPassword = await hashPassword(payload.password);
  try {
    const { password, ...user } = await db.user.create({
      data: { ...payload, password: hashedPassword },
    });
    return user;
  } catch (error) {
    throw createError(httpStatus.CONFLICT, `A user with email ${payload.email} already exists`);
  }
}

export function getUsers() {
  return db.user.findMany();
}

export async function getUser(id: string) {
  const user = await db.user.findOne({
    where: { id },
  });
  if (!user) throw createError(httpStatus.NOT_FOUND, `User ${id} doesn't exist`);
  delete user.password;
  return user;
}

export async function updateUser(id: string, fields: UserModifiableFields) {
  try {
    const { password, ...user } = await db.user.update({
      where: { id },
      data: fields,
    });
    return user;
  } catch (error) {
    throw createError(httpStatus.NOT_FOUND, `User ${id} doesn't exist`);
  }
}

export async function deleteUser(id: string) {
  try {
    await db.user.delete({ where: { id } });
  } catch (error) {
    throw createError(httpStatus.NOT_FOUND, `User ${id} doesn't exist`);
  }
}
