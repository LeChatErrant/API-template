import httpStatus from 'http-status-codes';
import createError from 'http-errors';
import { User } from '@prisma/client';

import db from '../../appDatabase';
import { hashPassword, verifyPassword } from '../../utils/hash';

import type { UserSignupDto, UserSigninDto, UserUpdateDto } from './userTypes';
import { buildUserRo } from './userHelpers';

export async function signup(payload: UserSignupDto) {
  const alreadyExists = !!await db.user.findUnique({ where: { email: payload.email } });
  if (alreadyExists) {
    throw createError(httpStatus.CONFLICT, `A user with email ${payload.email} already exists`);
  }

  const hashedPassword = await hashPassword(payload.password);
  const user = await db.user.create({
    data: { ...payload, password: hashedPassword },
  });
  return buildUserRo(user);
}

export async function signin(payload: UserSigninDto) {
  const user = await db.user.findUnique({
    where: { email: payload.email},
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

export async function getUser(user: User) {
  return buildUserRo(user);
}

export async function updateUser(user: User, payload: UserUpdateDto) {
  const fields = payload;
  if (payload.password) {
    fields.password = await hashPassword(payload.password);
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: fields,
  });
  return buildUserRo(updatedUser);
}

export async function deleteUser(user: User) {
  await db.user.delete({ where: { id: user.id } });
}
