import supertest from 'supertest';
import httpStatus from 'http-status-codes';
import { Role } from '@prisma/client';

import app from '../../app';
import db, { clearTestResources } from '../../appDatabase';
import { config } from '../../appConfig';
import seedAdminUser from '../../utils/seedAdminUser';

let request = supertest.agent(app);

// Reset session before each test
beforeEach(() => {
  request = supertest.agent(app);
});

// Clean db after each test
afterEach(async () => {
  await clearTestResources();
});

const baseUser = {
  email: 'test.test@epitech.eu',
  username: 'Test account',
  password: 'password',
};

const adminUser = {
  email: config.defaultAdminEmail,
  password: config.defaultAdminPassword,
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function validateUser(user: any) {
  expect(user.email).toBe(baseUser.email);
  expect(user.username).toBe(baseUser.username);
  expect(user.password).toBeUndefined();
  expect(user.id).toBeDefined();
  expect(user.createdAt).toBeDefined();
  expect(user.role).toBe(Role.USER);
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
async function signup(user: any, statusCodeExpected = httpStatus.CREATED) {
  const { body } = await request
    .post('/users/signup')
    .send(user)
    .expect(statusCodeExpected);

  return body;
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
async function signin(user: any, statusCodeExpected = httpStatus.OK) {
  const { body } = await request
    .post('/users/signin')
    .send(user)
    .expect(statusCodeExpected);

  return body;
}

async function listUsers(statusCodeExpected = httpStatus.OK) {
  const { body } = await request
    .get('/users')
    .expect(statusCodeExpected);

  return body;
}

async function getUser(userId: string, statusCodeExpected = httpStatus.OK) {
  const { body } = await request
    .get(`/users/${userId}`)
    .expect(statusCodeExpected);

  return body;
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
async function updateUser(userId: string, payload: any, statusCodeExpected = httpStatus.OK) {
  const { body } = await request
    .patch(`/users/${userId}`)
    .send(payload)
    .expect(statusCodeExpected);

  return body;
}

async function deleteUser(userId: string, statusCodeExpected = httpStatus.NO_CONTENT) {
  await request
    .delete(`/users/${userId}`)
    .expect(statusCodeExpected);
}

/*  Signup  */

test('Signup', async () => {
  const user = await signup(baseUser);
  validateUser(user);

  const now = new Date(Date.now());
  const creationDate = new Date(user.createdAt);
  expect(creationDate.getMinutes()).toBeLessThanOrEqual(now.getMinutes());
  expect(creationDate.getMinutes()).toBeGreaterThanOrEqual(now.getMinutes() - 1);
});

test('Signup - user already exists', async () => {
  const user = await signup(baseUser);
  validateUser(user);

  await signup(baseUser, httpStatus.CONFLICT);
});

test('Signup - username can be omitted', async () => {
  const { username, ...userWithoutName } = baseUser;
  const user = await signup(userWithoutName);

  expect(user.email).toBe(baseUser.email);
  expect(user.username).toBeNull();
  expect(user.password).toBeUndefined();
  expect(user.id).toBeDefined();
});

test('Signup - missing parameter', async () => {
  await signup({}, httpStatus.BAD_REQUEST);
});

test('Signup - wrong email format', async () => {
  const falseUser = { ...baseUser };

  falseUser.email = '';
  await signup(falseUser, httpStatus.BAD_REQUEST);

  falseUser.email = 'wrong email';
  await signup(falseUser, httpStatus.BAD_REQUEST);

  falseUser.email = 'the@fuck@is@this';
  await signup(falseUser, httpStatus.BAD_REQUEST);
});

test('Signup - email length 8 minimum', async () => {
  const falseUser = { ...baseUser };

  falseUser.password = '1234567';
  await signup(falseUser, httpStatus.BAD_REQUEST);

  falseUser.password = '12345678';
  await signup(falseUser, httpStatus.CREATED);
});

test('Signup - email length 64 maximum', async () => {
  const falseUser = { ...baseUser };

  falseUser.password = 'a'.repeat(65);
  await signup(falseUser, httpStatus.BAD_REQUEST);

  falseUser.password = 'a'.repeat(64);
  await signup(falseUser, httpStatus.CREATED);
});

/*  Signin  */

test('Signin', async () => {
  let user = await signup(baseUser);
  validateUser(user);
  const { id } = user;

  user = await signin(baseUser);
  validateUser(user);
  expect(id).toBe(user.id);
});

test('Signin - consecutive', async () => {
  let user = await signup(baseUser);
  validateUser(user);
  const { id } = user;

  user = await signin(baseUser);
  validateUser(user);
  expect(user.id).toBe(id);

  user = await signin(baseUser);
  validateUser(user);
  expect(user.id).toBe(id);
});

test('Signin - missing parameter', async () => {
  await signin({}, httpStatus.BAD_REQUEST);
});

test('Signin - wrong email format', async () => {
  await signin({ ...baseUser, email: 'the@fuck@is@this' }, httpStatus.BAD_REQUEST);
});

test('Signin - unknown account', async () => {
  await signin(baseUser, httpStatus.UNAUTHORIZED);
});

test('Signin - wrong email', async () => {
  await signup(baseUser);
  await signin({ ...baseUser, email: 'crack.me@something.fr' }, httpStatus.UNAUTHORIZED);
});

test('Signin - wrong password', async () => {
  await signup(baseUser);
  await signin({ ...baseUser, password: 'crack me' }, httpStatus.UNAUTHORIZED);
});

test('Signin - hiding password length informations', async () => {
  await signin({ ...baseUser, password: 'short' }, httpStatus.UNAUTHORIZED);
  await signin({ ...baseUser, password: 'long'.repeat(50) }, httpStatus.UNAUTHORIZED);
});

test('Signin - admin', async () => {
  await seedAdminUser();

  const user = await signin(adminUser);
  expect(user.role).toBe(Role.ADMIN);
});

/*  Get users */

test('Get users - auth', async () => {
  await listUsers(httpStatus.UNAUTHORIZED);
});

test('Get users - forbidden unless admin', async () => {
  await signup(baseUser);
  await signin(baseUser);
  await listUsers(httpStatus.FORBIDDEN);
});

test.todo('Get users - empty');
test.todo('Get users - order');
test.todo('Get users - pagination');

/*  Get user  */

test('Get user - auth', async () => {
  const { id } = await signup(baseUser);
  await getUser(id, httpStatus.UNAUTHORIZED);
});

test('Get user', async () => {
  await signup(baseUser);
  const { id } = await signin(baseUser);
  const user = await getUser(id);
  validateUser(user);
  expect(user.id).toBe(id);
});

test('Get user - me', async () => {
  await signup(baseUser);
  const { id } = await signin(baseUser);
  const user = await getUser('me');
  validateUser(user);
  expect(user.id).toBe(id);
});

test('Get user - access others forbidden unless admin', async () => {
  await signup(baseUser);
  await signin(baseUser);
  await getUser('otherUserId', httpStatus.FORBIDDEN);
});

test('Get user - admin', async () => {
  await seedAdminUser();
  const { id } = await signin(adminUser);

  const admin = await getUser(id);
  expect(admin.id).toBe(id);

  expect(await getUser('me')).toMatchObject(admin);

  const { id: userId } = await signup(baseUser);
  const user = await getUser(userId);
  validateUser(user);

  await getUser('unknownUserId', httpStatus.NOT_FOUND);
});

/*  Update user */

test('Update user - auth', async () => {
  const { id } = await signup(baseUser);
  await updateUser(id, { username: 'LeChatErrant' }, httpStatus.UNAUTHORIZED);
});

test('Update user - username', async () => {
  await signup(baseUser);
  const { id } = await signin(baseUser);

  const user = await updateUser(id, { username: 'LeChatErrant' });
  expect(user.username).toBe('LeChatErrant');
  user.username = baseUser.username;
  validateUser(user);
});

test('Update user - email', async () => {
  await signup(baseUser);
  const { id } = await signin(baseUser);

  const user = await updateUser(id, { email: 'a.new@email.com' });
  expect(user.email).toBe('a.new@email.com');
  user.email = baseUser.email;
  validateUser(user);

  await updateUser(id, { email: 'a.nice.api.template' }, httpStatus.BAD_REQUEST);
});

test('Update user - password', async () => {
  await signup(baseUser);
  const { id } = await signin(baseUser);

  const user = await updateUser(id, { password: 'new password' });
  validateUser(user);
  await signin(baseUser, httpStatus.UNAUTHORIZED);
  await signin({ ...baseUser, password: 'new password' });

  await updateUser(id, { password: 'short' }, httpStatus.BAD_REQUEST);
  await updateUser(id, { password: 'long'.repeat(50) }, httpStatus.BAD_REQUEST);
});


test('Update user - me', async () => {
  await signup(baseUser);
  await signin(baseUser);

  const user = await updateUser('me', { email: 'a.new@email.com' });
  expect(user.email).toBe('a.new@email.com');
  user.email = baseUser.email;
  validateUser(user);
});

test('Update user - multiple fields', async () => {
  await signup(baseUser);
  const { id } = await signin(baseUser);

  const user = await updateUser(id, {
    email: 'a.new@email.com',
    username: 'LeChatErrant',
    password: 'new password',
  });
  expect(user.username).toBe('LeChatErrant');
  expect(user.email).toBe('a.new@email.com');
  await signin(baseUser, httpStatus.UNAUTHORIZED);
  await signin({ email: 'a.new@email.com', password: 'new password' });
});

test('Update user - empty payload', async () => {
  await signup(baseUser);
  const { id } = await signin(baseUser);

  const user = await updateUser(id, {});
  validateUser(user);
});

test('Update user - access others forbidden unless admin', async () => {
  await signup(baseUser);
  await signin(baseUser);

  await updateUser('otherUserId', { password: 'YOU HAVE BEEN HACKED' }, httpStatus.FORBIDDEN);
});

test('Update user - admin', async () => {
  await seedAdminUser();
  const { id } = await signin(adminUser);

  await updateUser(id, { password: 'new password' });
  await signin(adminUser, httpStatus.UNAUTHORIZED);
  await signin({ ...adminUser, password: 'new password' });

  const admin = await updateUser('me', { username: 'root' });
  expect(admin.username).toBe('root');

  const { id: userId } = await signup(baseUser);
  const { username } = await updateUser(userId, { username: 'I have all rights' });
  expect(username).toBe('I have all rights');

  await updateUser('unknownUserId', {}, httpStatus.NOT_FOUND);
});

test('Delete user - auth', async () => {
  const { id } = await signup(baseUser);
  await deleteUser(id, httpStatus.UNAUTHORIZED);

  const users = await db.user.findMany();
  expect(users).toHaveLength(1);
});

test('Delete user', async () => {
  await signup(baseUser);
  const { id } = await signin(baseUser);

  await deleteUser(id);
  const users = await db.user.findMany();
  expect(users).toHaveLength(0);
});

test('Delete user - me', async () => {
  await signup(baseUser);
  await signin(baseUser);

  await deleteUser('me');
  const users = await db.user.findMany();
  expect(users).toHaveLength(0);
});

test('Delete user - access others forbidden unless admin', async () => {
  await signup(baseUser);
  await signin(baseUser);

  await deleteUser('otherUserId', httpStatus.FORBIDDEN);
  const users = await db.user.findMany();
  expect(users).toHaveLength(1);
});

test('Delete user - admin', async () => {
  await seedAdminUser();
  const user = await signup(baseUser);
  const admin = await signin(adminUser);
  expect(await db.user.findMany()).toHaveLength(2);

  await deleteUser(user.id);
  expect(await db.user.findMany()).toHaveLength(1);

  await deleteUser('unknownUserId', httpStatus.NOT_FOUND);
  expect(await db.user.findMany()).toHaveLength(1);

  await deleteUser(admin.id);
  expect(await db.user.findMany()).toHaveLength(0);
});
