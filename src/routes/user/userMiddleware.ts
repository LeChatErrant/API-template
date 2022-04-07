import { StatusCodes } from 'http-status-codes';
import { RequestHandler } from 'express';

import db from '../../appDatabase';
import { ApiError } from '../../appErrors';

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
const userMiddleware: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    next(new ApiError(StatusCodes.BAD_REQUEST, 'Missing route parameters "userId"'));
    return;
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      next(new ApiError(StatusCodes.NOT_FOUND, `User ${userId} not found`));
    } else {
      res.locals.user = user;
      next();
    }
  } catch (err) {
    next(err);
  }
};

export default userMiddleware;
