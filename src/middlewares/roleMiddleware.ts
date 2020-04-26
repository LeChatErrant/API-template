import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';
import { Role } from '@prisma/client';
import { compose } from 'compose-middleware';

import authMiddleware from './authMiddleware';

const adminMiddleware: RequestHandler = (req, res, next) => {
  if (req.session!.userRole !== Role.ADMIN) {
    next(createError(httpStatus.FORBIDDEN, 'You must be admin to perform this operation'));
  } else {
    next();
  }
};

export default compose([authMiddleware, adminMiddleware]);
