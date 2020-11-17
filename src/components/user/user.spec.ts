import supertest from 'supertest';
import httpStatus from 'http-status-codes';

import app from '../../app';
import db from '../../appDatabase';

const request = supertest(app);

afterEach(async () => {
  await db.user.deleteMany({});
});

const baseUser = {
  email: 'test.test@epitech.eu',
  name: 'Test account',
  password: 'password',
};

function validateUser(user: any) {
  expect(user.email).toBe(baseUser.email);
  expect(user.name).toBe(baseUser.name);
  expect(user.password).toBeUndefined();
  expect(user.id).toBeDefined();
}

async function signup(user: any, statusCodeExpected = httpStatus.CREATED) {
  const { body } = await request
    .post('/users/signup')
    .send(user)
    .expect(statusCodeExpected);

  return body;
}

async function signin(user: any, statusCodeExpected = httpStatus.OK) {
  const { body } = await request
    .post('/users/signin')
    .send(user)
    .expect(statusCodeExpected);
}

test('Signup', async () => {
  const user = await signup(baseUser);
  validateUser(user);
});

test('Signup - User already exists', async () => {
  const user = await signup(baseUser);
  validateUser(user);

  await signup(baseUser, httpStatus.CONFLICT);
});

test('Signup - Name can be omitted', async () => {
  const { name, ...userWithoutName } = baseUser;
  const user = await signup(userWithoutName);

  expect(user.email).toBe(baseUser.email);
  expect(user.name).toBeNull();
  expect(user.password).toBeUndefined();
  expect(user.id).toBeDefined();
});

test('Signup - Missing parameter', async () => {
  await signup({}, httpStatus.BAD_REQUEST);
});

test('Signup - Wrong email format', async () => {
  const falseUser = { ...baseUser };

  falseUser.email = '';
  await signup(falseUser, httpStatus.BAD_REQUEST);

  falseUser.email = 'wrong email';
  await signup(falseUser, httpStatus.BAD_REQUEST);

  falseUser.email = 'the@fuck@is@this';
  await signup(falseUser, httpStatus.BAD_REQUEST);
});

test('Signup - Email length 8 minimum', async () => {
  const falseUser = { ...baseUser };

  falseUser.password = '1234567';
  await signup(falseUser, httpStatus.BAD_REQUEST);

  falseUser.password = '12345678';
  await signup(falseUser, httpStatus.CREATED);
});

test('Signup - Email length 64 maximum', async () => {
  const falseUser = { ...baseUser };

  falseUser.password = 'a'.repeat(65);
  await signup(falseUser, httpStatus.BAD_REQUEST);

  falseUser.password = 'a'.repeat(64);
  await signup(falseUser, httpStatus.CREATED);
});

test('Signin', async () => {

})