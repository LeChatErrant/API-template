import bcrypt from 'bcrypt';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';

import { config } from '../../appConfig';
import db from '../../appDatabase';

import type { UserSignupDto, UserSigninDto, UserUpdateDto } from './userTypes';

const userWithoutPassword = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
};

function hashPassword(password: string) {
  return bcrypt.hash(password, config.saltRounds);
}

export async function signup(payload: UserSignupDto) {
  const hashedPassword = await hashPassword(payload.password);
  try {
    return await db.user.create({
      data: { ...payload, password: hashedPassword },
      select: userWithoutPassword,
    });
  } catch (error) {
    throw createError(httpStatus.CONFLICT, `A user with email ${payload.email} already exists`);
  }
}

export async function signin(payload: UserSigninDto) {
  const user = await db.user.findOne({
    where: { email: payload.email },
  });
  if (!user || !bcrypt.compareSync(payload.password, user.password)) throw createError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  delete user.password;
  return user;
}

export async function getUsers() {
  return db.user.findMany({
    select: userWithoutPassword,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUser(id: string) {
  const user = await db.user.findOne({
    where: { id },
    select: userWithoutPassword,
  });
  if (!user) throw createError(httpStatus.NOT_FOUND, `User ${id} doesn't exist`);
  return user;
}

export async function updateUser(id: string, fields: UserUpdateDto) {
  try {
    const user = await db.user.update({
      where: { id },
      data: fields,
      select: userWithoutPassword,
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
