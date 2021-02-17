import handler from 'express-async-handler';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';

import db from '../../appDatabase';

const postMiddleware = handler(async (req, res, next) => {
  const { authorId, postId } = req.params;
  if (!authorId || !postId) {
    next(createError(httpStatus.BAD_REQUEST, 'Missing route parameters "authorId" and/or "postId"'));
    return;
  }

  const post = await db.post.findFirst({
    where: { id: postId, authorId },
  });
  if (!post) {
    next(createError(httpStatus.NOT_FOUND, `Post ${postId} of user ${authorId} doesn't exist`));
  } else {
    // Post is passed to the controller through res.locals
    res.locals.post = post;
  }
});

export default postMiddleware;
