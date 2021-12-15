import handler from 'express-async-handler';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';

import db from '../../appDatabase';

/**
 * Middleware used to check if the user identified by route param `userId` exists in database
 * If it exists, stores it in `res.locals` to forward it to controllers
 *
 * @throws 400 - Bad request | If the route parameters are missing
 * @throws 404 - Not found | If the user doesn't exist
 *
 * @example
 * router.get('/users/:userId', userMiddleware, (req, res) => {
 *   const { user } = res.locals;
 * });
 */
const userMiddleware = handler(async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    next(createError(httpStatus.BAD_REQUEST, 'Missing route parameters "userId"'));
    return;
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    next(createError(httpStatus.NOT_FOUND, `User ${userId} not found`));
  } else {
    res.locals.user = user;
    next();
  }
});

export default userMiddleware;
