import { plainToClass } from 'class-transformer';
import { validate as classValidator } from 'class-validator';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';
import handler from 'express-async-handler';
import { ClassType } from 'class-transformer/ClassTransformer';

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
function validate<T>(type: ClassType<T>): RequestHandler {
  return handler(async (req, res, next) => {
    const parsedBody = plainToClass(type, req.body);
    const errors = await classValidator(parsedBody);
    if (errors.length !== 0) {
      const message = errors.join('').trimEnd();
      next(createError(httpStatus.BAD_REQUEST, message));
    } else {
      req.body = parsedBody;
      next();
    }
  });
}

export default validate;
