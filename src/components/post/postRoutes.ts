import express from 'express';
import handler from 'express-async-handler';
import httpStatus from 'http-status-codes';

import adminMiddleware from '../../middlewares/adminMiddleware';
import userMiddleware from '../../middlewares/userMiddleware';
import validate from '../../middlewares/validationMiddleware';

import postMiddleware from './postMiddleware';
import * as controllers from './postControllers';
import { PostCreateDto, PostUpdateDto } from './postTypes';

const router = express.Router();

router.get(
  '/users/:userId/posts',
  adminMiddleware,
  handler(async (req, res) => {
    const posts = await controllers.listPosts(req.params.userId);
    res.send(posts);
  }),
);

router.post(
  '/users/:userId/posts',
  validate(PostCreateDto),
  userMiddleware,
  handler(async (req, res) => {
    const post = await controllers.createNewPost(req.params.userId, req.body);
    res.status(httpStatus.CREATED).send(post);
  }),
);

router.get(
  '/users/:userId/posts/:postId',
  userMiddleware,
  postMiddleware,
  handler(async (req, res) => {
    const post = await controllers.getPost(res.locals.post);
    res.send(post);
  }),
);

router.patch(
  '/users/:userId/posts/:postId',
  validate(PostUpdateDto),
  userMiddleware,
  postMiddleware,
  handler(async (req, res) => {
    const post = await controllers.updatePost(res.locals.post, req.body);
    res.send(post);
  }),
);

router.delete(
  '/users/:userId/posts/:postId',
  userMiddleware,
  postMiddleware,
  handler(async (req, res) => {
    await controllers.deletePost(res.locals.post);
    res.sendStatus(httpStatus.NO_CONTENT);
  }),
);

export default router;
