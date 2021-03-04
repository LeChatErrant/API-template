/*  eslint-disable  @typescript-eslint/no-explicit-any  */

import httpStatus from 'http-status-codes';

import Requester from '../../appRequester';
import db from '../../appDatabase';
import logger from '../../appLogger';

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
  expect(post.createdAt).toBeDefined();
  expect(post.title).toBe(basePost.title);
  expect(post.content).toBe(basePost.content);
}

/*  Create post */

test('Create post', async () => {
  const post = await app.createPost('me', basePost);
  validatePost(post);
});

test('Create post - Title already exist', async () => {
  await app.createPost('me', basePost);
  await app.createPost('me', basePost, httpStatus.CONFLICT);
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
  }, httpStatus.BAD_REQUEST);

  const post = await app.createPost('me', {
    ...basePost,
    title: 'a'.repeat(50),
  });
  expect(post.title).toHaveLength(50);
});

test('Create post - ownership', async () => {
  await app.createPost(otherUser.id, basePost, httpStatus.FORBIDDEN);
});

test('Create post - auth', async () => {
  await app.signout();
  await app.createPost('me', basePost, httpStatus.UNAUTHORIZED);
});

/*  List posts  */

test('List posts - me + ordering', async () => {
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

test('List posts - other user', async () => {
  await app.signin(otherUser);
  await app.createPost(otherUser.id, basePost);
  await app.createPost(otherUser.id, { ...basePost, title: 'other title' });

  await app.signin(user);
  await app.createPost(user.id, basePost);

  let posts = await app.listPosts('me');
  expect(posts).toHaveLength(1);

  posts = await app.listPosts(user.id);
  expect(posts).toHaveLength(1);

  posts = await app.listPosts(otherUser.id);
  expect(posts).toHaveLength(2);
});

test('List posts - auth', async () => {
  await app.signout();
  await app.listPosts('me', httpStatus.UNAUTHORIZED);
});

/*  Get post  */
