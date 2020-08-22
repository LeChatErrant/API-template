import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';
import handler from 'express-async-handler';
import { ClassType } from 'class-transformer/ClassTransformer';

function validationMiddleware<T>(type: ClassType<T>): RequestHandler {
  return handler(async (req, res, next) => {
    const parsedBody = plainToClass(type, req.body);
    const errors = await validate(parsedBody);
    if (errors.length !== 0) {
      const message = errors.join('');
      next(createError(httpStatus.BAD_REQUEST, message));
    } else {
      req.body = parsedBody;
      next();
    }
  });
}

export default validationMiddleware;
