import httpStatus from 'http-status-codes';
import createError from 'http-errors';

import db from '../../appDatabase';
import { hashPassword, verifyPassword } from '../../utils/hash';

import type { UserSignupDto, UserSigninDto, UserUpdateDto } from './userTypes';
import { buildUserRo } from './userHelpers';

export async function signup(payload: UserSignupDto) {
  const hashedPassword = await hashPassword(payload.password);
  try {
    const user = await db.user.create({
      data: { ...payload, password: hashedPassword },
    });
    return buildUserRo(user);
  } catch (error) {
    throw createError(httpStatus.CONFLICT, `A user with email ${payload.email} already exists`);
  }
}

export async function signin(payload: UserSigninDto) {
  const user = await db.user.findOne({
    where: { email: payload.email },
  });
  if (!user || !await verifyPassword(payload.password, user.password)) throw createError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  return buildUserRo(user);
}

export async function listUsers() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return users.map((user) => buildUserRo(user));
}

export async function getUser(id: string) {
  const user = await db.user.findOne({
    where: { id },
  });
  if (!user) throw createError(httpStatus.NOT_FOUND, `User ${id} doesn't exist`);
  return buildUserRo(user);
}

export async function updateUser(id: string, fields: UserUpdateDto) {
  try {
    const user = await db.user.update({
      where: { id },
      data: fields,
    });
    return buildUserRo(user);
  } catch (error) {
    throw createError(httpStatus.NOT_FOUND, `User ${id} doesn't exist`);
  }
}

export async function deleteUser(id: string) {
  try {
    await db.user.delete({ where: { id } });
    return listUsers();
  } catch (error) {
    throw createError(httpStatus.NOT_FOUND, `User ${id} doesn't exist`);
  }
}
