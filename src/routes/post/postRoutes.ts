import { AsyncRouter } from 'express-async-router';
import { StatusCodes } from 'http-status-codes';

import ownershipMiddleware from '../../middlewares/ownershipMiddleware';
import authMiddleware from '../../middlewares/authMiddleware';
import validate from '../../middlewares/validationMiddleware';

import postMiddleware from './postMiddleware';
import * as controllers from './postControllers';
import { PostCreateDto, PostUpdateDto } from './postTypes';

const router = AsyncRouter();

router.get(
  '/posts',
  authMiddleware,
  async (req, res) => {
    const posts = await controllers.listPosts();
    res.send(posts);
  },
);

router.get(
  '/users/:userId/posts',
  authMiddleware,
  async (req, res) => {
    const posts = await controllers.listPostsByUser(req.params.userId);
    res.send(posts);
  },
);

router.post(
  '/users/:userId/posts',
  validate(PostCreateDto),
  ownershipMiddleware,
  async (req, res) => {
    const post = await controllers.createNewPost(req.params.userId, req.body);
    res.status(StatusCodes.CREATED).send(post);
  },
);

router.get(
  '/users/:userId/posts/:postId',
  authMiddleware,
  postMiddleware,
  async (req, res) => {
    const post = await controllers.getPost(res.locals.post);
    res.send(post);
  },
);

router.patch(
  '/users/:userId/posts/:postId',
  validate(PostUpdateDto),
  ownershipMiddleware,
  postMiddleware,
  async (req, res) => {
    const post = await controllers.updatePost(res.locals.post, req.body);
    res.send(post);
  },
);

router.delete(
  '/users/:userId/posts/:postId',
  ownershipMiddleware,
  postMiddleware,
  async (req, res) => {
    await controllers.deletePost(res.locals.post);
    res.sendStatus(StatusCodes.NO_CONTENT);
  },
);

export default router;
