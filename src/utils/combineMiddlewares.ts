import { RequestHandler } from 'express';

/**
 * Combine multiple express middlewares together
 *
 * @param middlewares Middlewares to combine
 * @return Single middleware
 */
function combineMiddlewares(...middlewares: RequestHandler[]) {
  return middlewares.reduce((acc, val) => (req, res, next) => {
    acc(req, res, (err) => {
      if (err) {
        return next(err);
      }
      val(req, res, next);
    });
  });
}

export default combineMiddlewares;
