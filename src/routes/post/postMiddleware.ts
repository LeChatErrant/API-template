import handler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

import db from '../../appDatabase';
import { ApiError } from '../../appErrors';

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
    next(new ApiError(StatusCodes.BAD_REQUEST, 'Missing route parameters "userId" and/or "postId"'));
    return;
  }

  const post = await db.post.findFirst({ where: { id: postId, authorId: userId } });
  if (!post) {
    next(new ApiError(StatusCodes.NOT_FOUND, `Post ${postId} of user ${userId} not found`));
  } else {
    res.locals.post = post;
    next();
  }
});

export default postMiddleware;
