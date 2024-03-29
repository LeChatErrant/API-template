/*  eslint-disable  @typescript-eslint/no-explicit-any  */

import { StatusCodes } from 'http-status-codes';

import { gracefullyCloseConnections, waitServices } from '@root/app.handlers';
import Requester from '@root/app.requester';
import db from '@services/database';
import logger from '@services/logger';

const app = new Requester();

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

// Wait for all external services (db, redis...)
beforeAll(async () => {
  await waitServices();
});

// Gracefully terminate external services connections
afterAll(async () => {
  await gracefullyCloseConnections();
});

// Reset session before each test, create two user and log in
beforeEach(async () => {
  logger.debug('');
  logger.debug(`Running test '${expect.getState().currentTestName}'`);

  app.resetSession();

  user.id = (await app.signup(user)).id;
  await app.signin(user);
  otherUser.id = (await app.signup(otherUser)).id;
});

// Clean db after each test
afterEach(async () => {
  await db.post.deleteMany();
  await db.user.deleteMany();
});

function validatePost(post: any) {
  expect(post.id).toBeDefined();
  expect(post.authorId).toBe(user.id);
  expect(post.title).toBe(basePost.title);
  expect(post.content).toBe(basePost.content);
  expect(post.createdAt).toBeDefined();
  expect(post.updatedAt).toBeDefined();
}

/*  Create post */

test('Create post - auth', async () => {
  await app.signout();
  await app.createPost('me', basePost, StatusCodes.UNAUTHORIZED);
});

test('Create post', async () => {
  const post = await app.createPost('me', basePost);
  validatePost(post);
});

test('Create post - Title already exist', async () => {
  await app.createPost('me', basePost);
  await app.createPost('me', basePost, StatusCodes.CONFLICT);
});

test('Create post - Same title, different user', async () => {
  const post = await app.createPost('me', basePost);
  validatePost(post);

  await app.signin(otherUser);
  const { authorId } = await app.createPost('me', basePost);
  expect(authorId).toBe(otherUser.id);
});

test('Create post - Title max length (50)', async () => {
  await app.createPost('me', {
    ...basePost,
    title: 'a'.repeat(51),
  }, StatusCodes.BAD_REQUEST);

  const post = await app.createPost('me', {
    ...basePost,
    title: 'a'.repeat(50),
  });
  expect(post.title).toHaveLength(50);
});

test('Create post - ownership', async () => {
  await app.createPost(otherUser.id, basePost, StatusCodes.FORBIDDEN);
});

/*  List users posts  */

test('List user posts - auth', async () => {
  await app.signout();
  await app.listPosts('me', StatusCodes.UNAUTHORIZED);
});

test('List user posts - me + ordering', async () => {
  let posts = await app.listPosts('me');
  expect(posts).toHaveLength(0);

  await app.createPost('me', basePost);
  posts = await app.listPosts('me');
  expect(posts).toHaveLength(1);
  validatePost(posts[0]);

  await app.createPost('me', {
    ...basePost,
    title: 'other title',
  });
  await app.createPost('me', {
    ...basePost,
    title: 'last title',
  });
  posts = await app.listPosts('me');
  expect(posts).toHaveLength(3);
  validatePost(posts[2]);
  expect(posts[1].title).toBe('other title');
  expect(posts[0].title).toBe('last title');
});

test('List user posts - other user', async () => {
  await app.signin(otherUser);
  await app.createPost('me', basePost);
  await app.createPost('me', { ...basePost, title: 'other title' });

  await app.signin(user);
  await app.createPost('me', basePost);

  let posts = await app.listPosts('me');
  expect(posts).toHaveLength(1);

  posts = await app.listPosts(user.id);
  expect(posts).toHaveLength(1);

  posts = await app.listPosts(otherUser.id);
  expect(posts).toHaveLength(2);
});

/*  Get post  */

test('Get post - auth', async () => {
  const { id } = await app.createPost(user.id, basePost);

  await app.signout();
  await app.getPost(user.id, id, StatusCodes.UNAUTHORIZED);
});

test('Get post', async () => {
  const { id } = await app.createPost(user.id, basePost);
  validatePost(await app.getPost(user.id, id));
  validatePost(await app.getPost('me', id));
});

test('Get post - other user', async () => {
  const { id } = await app.createPost(user.id, basePost);

  await app.signin(otherUser);
  const post = await app.getPost(user.id, id);
  validatePost(post);
});

test('Get post - wrong user', async () => {
  const { id } = await app.createPost(user.id, basePost);
  await app.getPost(otherUser.id, id, StatusCodes.NOT_FOUND);
});

test('Get post - unknown user', async () => {
  const { id } = await app.createPost(user.id, basePost);
  await app.getPost('unknown', id, StatusCodes.NOT_FOUND);
});

test('Get post - unknown post', async () => {
  await app.getPost('me', 'unknown', StatusCodes.NOT_FOUND);
});

/*  Update post */

test('Update post - auth', async () => {
  await app.createPost('me', basePost);
});

test('Update post', async () => {
  const { id } = await app.createPost('me', basePost);

  let post = await app.updatePost('me', id, {});
  validatePost(post);

  post = await app.updatePost('me', id, {
    title: 'New title',
  });
  expect(post.id).toBe(id);
  expect(post.title).toBe('New title');
  expect(post.content).toBe(basePost.content);

  post = await app.updatePost('me', id, {
    content: 'New content',
  });
  expect(post.id).toBe(id);
  expect(post.title).toBe('New title');
  expect(post.content).toBe('New content');

  post = await app.updatePost('me', id, basePost);
  validatePost(post);
});

test('Update post - ownership', async () => {
  const { id } = await app.createPost('me', basePost);

  await app.signin(otherUser);
  await app.updatePost(user.id, id, { title: '' }, StatusCodes.FORBIDDEN);
});

test('Update post - Title max length (50)', async () => {
  const { id } = await app.createPost('me', basePost);
  await app.updatePost('me', id, { title: 'a'.repeat(50) });
  await app.updatePost('me', id, { title: 'a'.repeat(51) }, StatusCodes.BAD_REQUEST);
});

test('Update post - unknown post', async () => {
  await app.updatePost('me', 'unknown', {}, StatusCodes.NOT_FOUND);
});

/*  Delete posts  */

test('Delete post - auth', async () => {
  const { id } = await app.createPost('me', basePost);
  await app.signout();

  await app.deletePost('me', id, StatusCodes.UNAUTHORIZED);
});

test('Delete post', async () => {
  const { id } = await app.createPost('me', basePost);

  await app.deletePost('me', id);
  await app.getPost('me', id, StatusCodes.NOT_FOUND);
  expect(await app.listPosts('me')).toHaveLength(0);
});

test('Delete post - multiple times', async () => {
  const { id } = await app.createPost('me', basePost);

  await app.deletePost('me', id);
  await app.deletePost('me', id, StatusCodes.NOT_FOUND);
});

test('Delete post - unknown post', async () => {
  await app.deletePost('me', 'unknown', StatusCodes.NOT_FOUND);
});

test('Delete post - ownership', async () => {
  const { id } = await app.createPost('me', basePost);

  await app.signin(otherUser);
  await app.deletePost(user.id, id, StatusCodes.FORBIDDEN);
});
