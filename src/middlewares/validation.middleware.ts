import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate as classValidator } from 'class-validator';
import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '@root/app.errors';

/**
 * Validate the request body
 *
 * @param type The DTO object, defining the shape of the body
 * @throws 400 - Bad request | If at least one constraint is not respected
 *
 * @example
 * import validate from 'middlewares/validationMiddleware'
 *
 * class UserSignupDto {
 *  @IsEmail()
 *  email!: string;
 *
 *  @IsString()
 *  @IsOptional()
 *  name!: string;
 *
 *  @IsString()
 *  @MinLength(8)
 *  @MaxLength(64)
 *  password!: string;
 * }

 * router.post('/users/signup', validate(UserSignupDto), ...);
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validate(type: ClassConstructor<any>, where: 'body' | 'query'): RequestHandler {
  return async (req, res, next) => {
    let data;

    if (where === 'body') {
      data = req.body;
    } else {
      data = req.query;
    }
    const parsedData = plainToInstance(type, data);

    const errors = await classValidator(parsedData, { whitelist: true });
    if (errors.length !== 0) {
      const message = errors.join('').trimEnd();
      next(new ApiError(StatusCodes.BAD_REQUEST, message));
    } else {
      if (where === 'body') {
        req.body = parsedData;
      } else {
        req.query = parsedData;
      }
      next();
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateBody(type: ClassConstructor<any>): RequestHandler {
  return validate(type, 'body');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateQuery(type: ClassConstructor<any>): RequestHandler {
  return validate(type, 'query');
}
