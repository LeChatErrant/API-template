import handler from 'express-async-handler';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';

import db from '../../appDatabase';

/**
 * Middleware used to check if the requested post exists in database
 * If it exists, stores it in `res.locals` to forward it to controllers
 *
 * @throws 400 - Bad request | If the route parameters are missing
 * @throws 404 - Not found | If the post doesn't exist
 *
 * @example
 * router.get('/post/:postId', postMiddleware, (req, res) => {
 *   const { post } = res.locals;
 * });
 */
const postMiddleware = handler(async (req, res, next) => {
  const { userId, postId } = req.params;
  if (!userId || !postId) {
    next(createError(httpStatus.BAD_REQUEST, 'Missing route parameters "authorId" and/or "postId"'));
    return;
  }

  const post = await db.post.findFirst({ where: { id: postId, authorId: userId } });
  if (!post) {
    next(createError(httpStatus.NOT_FOUND, `Post ${postId} of user ${userId} doesn't exist`));
  } else {
    res.locals.post = post;
    next();
  }
});

export default postMiddleware;
