import express from 'express';
import handler from 'express-async-handler';
import httpStatus from 'http-status-codes';

import validate from '../../middlewares/validationMiddleware';

import { NewPostDto } from './postTypes';

const router = express.Router();

router.post('/:id', validate(NewPostDto), handler(async (req, res, next) => {
  const post = await controllers.createNewPost(req.body);
  res.status(httpStatus.CREATED).send(post);
}));

export default router;
