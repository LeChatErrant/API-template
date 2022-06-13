import type { RequestHandler } from 'express';

/**
 * This middleware adds the 'me' logic on API routes
 * It enables using 'me' as userId to refer to the user currently logged in (ex: GET /users/me)
 *
 * @example
 * router.get('/users/:userId', meMiddleware, ...);
 * // You can now GET /users/me
 */
const meMiddleware: RequestHandler = (req, res, next) => {
  if (req.session.user) {
    if (req.url.endsWith('/users/me') || req.url.includes('/users/me/')) {
      req.url = req.url.replace('/users/me', `/users/${req.session.user.id}`);
      req.params.userId = req.session.user.id;
    }
  }
  next();
};

export default meMiddleware;
