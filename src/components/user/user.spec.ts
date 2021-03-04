/*  eslint-disable  @typescript-eslint/no-explicit-any  */

import httpStatus from 'http-status-codes';
import { Role } from '@prisma/client';

import Requester from '../../appRequester';
import db from '../../appDatabase';
import { config } from '../../appConfig';
import seedAdminUser from '../../utils/seedAdminUser';
import logger from '../../appLogger';

const app = new Requester();

const baseUser = {
  email: 'test@test.test',
  username: 'Test account',
  password: 'password',
};

const adminUser = {
  email: config.defaultAdminEmail,
  password: config.defaultAdminPassword,
};

// Reset session before each test
beforeEach(() => {
  logger.debug('');
  logger.debug(`Running test '${expect.getState().currentTestName}'`);

  app.resetSession();
});

// Clean db after each test
afterEach(async () => {
  await db.user.deleteMany();
});

function validateUser(user: any) {
  expect(user.email).toBe(baseUser.email);
  expect(user.username).toBe(baseUser.username);
  expect(user.password).toBeUndefined();
  expect(user.id).toBeDefined();
  expect(user.createdAt).toBeDefined();
  expect(user.role).toBe(Role.USER);
}

/*  Signup  */

test('Signup', async () => {
  const user = await app.signup(baseUser);
  validateUser(user);

  const now = new Date(Date.now());
  const creationDate = new Date(user.createdAt);
  expect(creationDate.getMinutes()).toBeLessThanOrEqual(now.getMinutes());
  expect(creationDate.getMinutes()).toBeGreaterThanOrEqual(now.getMinutes() - 1);
});

test('Signup - user already exists', async () => {
  const user = await app.signup(baseUser);
  validateUser(user);

  await app.signup(baseUser, httpStatus.CONFLICT);
});

test('Signup - username can be omitted', async () => {
  const { username, ...userWithoutName } = baseUser;
  const user = await app.signup(userWithoutName);

  expect(user.email).toBe(baseUser.email);
  expect(user.username).toBeNull();
  expect(user.password).toBeUndefined();
  expect(user.id).toBeDefined();
});

test('Signup - missing parameter', async () => {
  await app.signup({}, httpStatus.BAD_REQUEST);
});

test('Signup - wrong email format', async () => {
  const falseUser = { ...baseUser };

  falseUser.email = '';
  await app.signup(falseUser, httpStatus.BAD_REQUEST);

  falseUser.email = 'wrong email';
  await app.signup(falseUser, httpStatus.BAD_REQUEST);

  falseUser.email = 'the@fuck@is@this';
  await app.signup(falseUser, httpStatus.BAD_REQUEST);
});

test('Signup - password length 8 minimum', async () => {
  const falseUser = { ...baseUser };

  falseUser.password = '1234567';
  await app.signup(falseUser, httpStatus.BAD_REQUEST);

  falseUser.password = '12345678';
  await app.signup(falseUser);
});

test('Signup - password length 64 maximum', async () => {
  const falseUser = { ...baseUser };

  falseUser.password = 'a'.repeat(65);
  await app.signup(falseUser, httpStatus.BAD_REQUEST);

  falseUser.password = 'a'.repeat(64);
  await app.signup(falseUser);
});

/*  Signin  */

test('Signin', async () => {
  let user = await app.signup(baseUser);
  validateUser(user);
  const { id } = user;

  user = await app.signin(baseUser);
  validateUser(user);
  expect(id).toBe(user.id);
});

test('Signin - consecutive', async () => {
  let user = await app.signup(baseUser);
  validateUser(user);
  const { id } = user;

  user = await app.signin(baseUser);
  validateUser(user);
  expect(user.id).toBe(id);

  user = await app.signin(baseUser);
  validateUser(user);
  expect(user.id).toBe(id);
});

test('Signin - missing parameter', async () => {
  await app.signin({}, httpStatus.BAD_REQUEST);
});

test('Signin - wrong email format', async () => {
  await app.signin({
    ...baseUser,
    email: 'the@fuck@is@this',
  }, httpStatus.BAD_REQUEST);
});

test('Signin - unknown account', async () => {
  await app.signin(baseUser, httpStatus.UNAUTHORIZED);
});

test('Signin - wrong email', async () => {
  await app.signup(baseUser);
  await app.signin({
    ...baseUser,
    email: 'crack.me@something.fr',
  }, httpStatus.UNAUTHORIZED);
});

test('Signin - wrong password', async () => {
  await app.signup(baseUser);
  await app.signin({
    ...baseUser,
    password: 'crack me',
  }, httpStatus.UNAUTHORIZED);
});

test('Signin - hiding password length informations', async () => {
  await app.signup(baseUser);
  await app.signin({
    ...baseUser,
    password: 'short',
  }, httpStatus.UNAUTHORIZED);
  await app.signin({
    ...baseUser,
    password: 'long'.repeat(50),
  }, httpStatus.UNAUTHORIZED);
});

test('Signin - admin', async () => {
  await seedAdminUser();

  const user = await app.signin(adminUser);
  expect(user.role).toBe(Role.ADMIN);
});

/*  Signout */

test('Signout', async () => {
  await app.signup(baseUser);
  await app.signin(baseUser);

  await app.getUser('me');

  await app.signout();
  await app.getUser('me', httpStatus.UNAUTHORIZED);
});

test('Signout - Not logged in', async () => {
  await app.signout(httpStatus.UNAUTHORIZED);
});

/*  List users */

test('List users - auth', async () => {
  await app.listUsers(httpStatus.UNAUTHORIZED);
});

test('List users - forbidden unless admin', async () => {
  await app.signup(baseUser);
  await app.signin(baseUser);
  await app.listUsers(httpStatus.FORBIDDEN);
});

test.todo('List users - empty');
test.todo('List users - order');
test.todo('List users - pagination');

/*  Get user  */

test('Get user - auth', async () => {
  const { id } = await app.signup(baseUser);
  await app.getUser(id, httpStatus.UNAUTHORIZED);
});

test('Get user', async () => {
  await app.signup(baseUser);
  const { id } = await app.signin(baseUser);
  const user = await app.getUser(id);
  validateUser(user);
  expect(user.id).toBe(id);
});

test('Get user - me', async () => {
  await app.signup(baseUser);
  const { id } = await app.signin(baseUser);
  const user = await app.getUser('me');
  validateUser(user);
  expect(user.id).toBe(id);
});

test('Get user - access others forbidden unless admin', async () => {
  await app.signup(baseUser);
  await app.signin(baseUser);
  await app.getUser('otherUserId', httpStatus.FORBIDDEN);
});

test('Get user - admin', async () => {
  await seedAdminUser();
  const { id } = await app.signin(adminUser);

  const admin = await app.getUser(id);
  expect(admin.id).toBe(id);

  expect(
    await app.getUser('me'),
  ).toMatchObject(admin);

  const { id: userId } = await app.signup(baseUser);
  const user = await app.getUser(userId);
  validateUser(user);

  await app.getUser('unknownUserId', httpStatus.NOT_FOUND);
});

/*  Update user */

test('Update user - auth', async () => {
  const { id } = await app.signup(baseUser);
  await app.updateUser(id, { username: 'LeChatErrant' }, httpStatus.UNAUTHORIZED);
});

test('Update user - username', async () => {
  await app.signup(baseUser);
  const { id } = await app.signin(baseUser);

  const user = await app.updateUser(id, { username: 'LeChatErrant' });
  expect(user.username).toBe('LeChatErrant');
  user.username = baseUser.username;
  validateUser(user);
});

test('Update user - email', async () => {
  await app.signup(baseUser);
  const { id } = await app.signin(baseUser);

  const user = await app.updateUser(id, { email: 'a.new@email.com' });
  expect(user.email).toBe('a.new@email.com');
  user.email = baseUser.email;
  validateUser(user);

  await app.updateUser(id, { email: 'a.nice.api.template' }, httpStatus.BAD_REQUEST);
});

test('Update user - password', async () => {
  await app.signup(baseUser);
  const { id } = await app.signin(baseUser);

  const user = await app.updateUser(id, { password: 'new password' });
  validateUser(user);
  await app.signin(baseUser, httpStatus.UNAUTHORIZED);
  await app.signin({ ...baseUser, password: 'new password' });

  await app.updateUser(id, { password: 'short' }, httpStatus.BAD_REQUEST);
  await app.updateUser(id, { password: 'long'.repeat(50) }, httpStatus.BAD_REQUEST);
});


test('Update user - me', async () => {
  await app.signup(baseUser);
  await app.signin(baseUser);

  const user = await app.updateUser('me', { email: 'a.new@email.com' });
  expect(user.email).toBe('a.new@email.com');
  user.email = baseUser.email;
  validateUser(user);
});

test('Update user - multiple fields', async () => {
  await app.signup(baseUser);
  const { id } = await app.signin(baseUser);

  const user = await app.updateUser(id, {
    email: 'a.new@email.com',
    username: 'LeChatErrant',
    password: 'new password',
  });
  expect(user.username).toBe('LeChatErrant');
  expect(user.email).toBe('a.new@email.com');
  await app.signin(baseUser, httpStatus.UNAUTHORIZED);
  await app.signin({ email: 'a.new@email.com', password: 'new password' });
});

test('Update user - empty payload', async () => {
  await app.signup(baseUser);
  const { id } = await app.signin(baseUser);

  const user = await app.updateUser(id, {});
  validateUser(user);
});

test('Update user - access others forbidden unless admin', async () => {
  await app.signup(baseUser);
  await app.signin(baseUser);

  await app.updateUser('otherUserId', { password: 'YOU HAVE BEEN HACKED' }, httpStatus.FORBIDDEN);
});

test('Update user - admin', async () => {
  await seedAdminUser();
  const { id } = await app.signin(adminUser);

  await app.updateUser(id, { password: 'new password' });
  await app.signin(adminUser, httpStatus.UNAUTHORIZED);
  await app.signin({ ...adminUser, password: 'new password' });

  const admin = await app.updateUser('me', { username: 'root' });
  expect(admin.username).toBe('root');

  const { id: userId } = await app.signup(baseUser);
  const { username } = await app.updateUser(userId, { username: 'I have all rights' });
  expect(username).toBe('I have all rights');

  await app.updateUser('unknownUserId', {}, httpStatus.NOT_FOUND);
});

test('Delete user - auth', async () => {
  const { id } = await app.signup(baseUser);
  await app.deleteUser(id, httpStatus.UNAUTHORIZED);

  const users = await db.user.findMany();
  expect(users).toHaveLength(1);
});

test('Delete user', async () => {
  await app.signup(baseUser);
  const { id } = await app.signin(baseUser);

  await app.deleteUser(id);
  const users = await db.user.findMany();
  expect(users).toHaveLength(0);
});

test('Delete user - me', async () => {
  await app.signup(baseUser);
  await app.signin(baseUser);

  await app.deleteUser('me');
  const users = await db.user.findMany();
  expect(users).toHaveLength(0);
});

test('Delete user - access others forbidden unless admin', async () => {
  await app.signup(baseUser);
  await app.signin(baseUser);

  await app.deleteUser('otherUserId', httpStatus.FORBIDDEN);
  const users = await db.user.findMany();
  expect(users).toHaveLength(1);
});

test('Delete user - admin', async () => {
  await seedAdminUser();
  const user = await app.signup(baseUser);
  const admin = await app.signin(adminUser);
  expect(await db.user.findMany()).toHaveLength(2);

  await app.deleteUser(user.id);
  expect(await db.user.findMany()).toHaveLength(1);

  await app.deleteUser('unknownUserId', httpStatus.NOT_FOUND);
  expect(await db.user.findMany()).toHaveLength(1);

  await app.deleteUser(admin.id);
  expect(await db.user.findMany()).toHaveLength(0);
});
