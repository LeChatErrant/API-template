/*  eslint-disable  @typescript-eslint/no-explicit-any  */

import supertest from 'supertest';
import httpStatus from 'http-status-codes';

import app from '../../app';
import db, { clearTestResources } from '../../appDatabase';
import { signin, signup } from '../user/user.spec';

let request = supertest.agent(app);

const user = {
  email: 'test@test.test',
  username: 'Test',
  password: 'password',
  id: '',
};

const otherUser = {
  email: 'test2@test.test',
  username: 'Test 2',
  password: 'password',
  id: '',
};

const basePost = {
  title: 'Lorem ipsum',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
};

// Reset session before each test, create two user and log in
beforeEach(async () => {
  request = supertest.agent(app);

  user.id = (await signup(user)).id;
  await signin(user);
  otherUser.id = (await signup(otherUser)).id;
});

// Clean db after each test
afterEach(async () => {
  await clearTestResources();
});

export async function createPost(userId: string, payload: any, statusCodeExpected = httpStatus.OK) {
  const { body } = await request
    .post(`/users/${userId}/posts`)
    .send(payload)
    .expect(statusCodeExpected);

  return body;
}

function validatePost(post: any) {
  expect(post.id).toBeDefined();
  expect(post.authorId).toBe(user.id);
  expect(post.createdAt).toBeDefined();
  expect(post.title).toBe(basePost.title);
  expect(post.content).toBe(basePost.content);
}

/*  Create post */

test('Create post', async () => {
  const post = await createPost('me', basePost);
  validatePost(post);
});

test('Create post - Title already exist', async () => {
  await createPost('me', basePost);
  await createPost('me', basePost, httpStatus.CONFLICT);
});

test('Create post - Same title, different user', async () => {
  const post = await createPost('me', basePost);
  validatePost(post);

  await signin(otherUser);
  const { authorId } = await createPost('me', basePost);
  expect(authorId).toBe(otherUser.id);
});

test('Create post - Title max length (50)', async () => {
  await createPost('me', {
    ...basePost,
    title: 'a'.repeat(51),
  }, httpStatus.BAD_REQUEST);

  const post = await createPost('me', {
    ...basePost,
    title: 'a'.repeat(50),
  });
});

test('Create post - Ownership', async () => {
  await createPost(otherUser.id, basePost, httpStatus.FORBIDDEN);
});
