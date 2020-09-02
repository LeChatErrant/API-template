import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';
import { Role } from '@prisma/client';

import authMiddleware from './authMiddleware';

const userMiddleware: RequestHandler = (req, res, next) => {
  if (!req.params.userId) {
    next(createError(httpStatus.BAD_REQUEST, 'You must specify a target user'));
  } else if (req.params.userId !== 'me' && req.params.userId !== req.session!.userId && req.session!.userRole !== Role.ADMIN) {
    next(createError(httpStatus.FORBIDDEN, 'You are not allowed to access other users information\'s'));
  } else {
    if (req.params.userId === 'me') req.params.userId = req.session!.userId;
    next();
  }
};

export default [authMiddleware, userMiddleware];
