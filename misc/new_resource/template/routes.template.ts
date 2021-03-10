import { capitalize } from '../utils';

const routeTemplate = (singular: string, plural: string) => `
import express from 'express';
import handler from 'express-async-handler';
import httpStatus from 'http-status-codes';

import ownershipMiddleware from '../../middlewares/ownershipMiddleware';
import validate from '../../middlewares/validationMiddleware';
import authMiddleware from '../../middlewares/authMiddleware';

import ${singular}Middleware from './${singular}Middleware';
import * as controllers from './${singular}Controllers';
import { ${capitalize(singular)}CreateDto, ${capitalize(singular)}UpdateDto } from './${singular}Types';

const router = express.Router();

router.get(
  '/${plural}',
  authMiddleware,
  handler(async (req, res) => {
    const ${plural} = await controllers.list${capitalize(plural)}(req.params.userId);
    res.send(posts);
  }),
);

router.post(
  '/users/:userId/posts',
  validate(PostCreateDto),
  ownershipMiddleware,
  handler(async (req, res) => {
    const post = await controllers.createNewPost(req.params.userId, req.body);
    res.status(httpStatus.CREATED).send(post);
  }),
);

router.get(
  '/users/:userId/posts/:postId',
  authMiddleware,
  postMiddleware,
  handler(async (req, res) => {
    const post = await controllers.getPost(res.locals.post);
    res.send(post);
  }),
);

router.patch(
  '/users/:userId/posts/:postId',
  validate(PostUpdateDto),
  ownershipMiddleware,
  postMiddleware,
  handler(async (req, res) => {
    const post = await controllers.updatePost(res.locals.post, req.body);
    res.send(post);
  }),
);

router.delete(
  '/users/:userId/posts/:postId',
  ownershipMiddleware,
  postMiddleware,
  handler(async (req, res) => {
    await controllers.deletePost(res.locals.post);
    res.sendStatus(httpStatus.NO_CONTENT);
  }),
);

export default router;
`;

export default routeTemplate;
