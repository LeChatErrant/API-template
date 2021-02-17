import express from 'express';
import handler from 'express-async-handler';
import httpStatus from 'http-status-codes';

import adminMiddleware from '../../middlewares/adminMiddleware';
import validate from '../../middlewares/validationMiddleware';

import * as controllers from './postControllers';
import { NewPostDto } from './postTypes';
import userMiddleware from '../../middlewares/userMiddleware';

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
  validate(NewPostDto),
  userMiddleware,
  handler(async (req, res) => {
    const post = await controllers.createNewPost(req.params.userId, req.body);
    res.status(httpStatus.CREATED).send(post);
  }),
);

router.get(
  '/users/:userId/posts/:postId',
  userMiddleware,
  handler(async (req, res) => {
    const post = await controllers.getPost(req.params.userId, req.params.postId);
    res.send(post);
  }),
);

export default router;
