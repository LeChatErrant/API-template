import express from 'express';
import handler from 'express-async-handler';

import userMiddleware from '../../middlewares/userMiddleware';
import adminMiddleware from '../../middlewares/adminMiddleware';
import validate from '../../middlewares/validationMiddleware';

import * as controllers from './userControllers';
import { UserSignupDto, UserSigninDto, UserUpdateDto } from './userTypes';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentification
 */

/**
 * @swagger
 * /:
 *   get:
 *     description: List users
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: users
 */
router.get('/', adminMiddleware, handler(async (req, res) => {
  const users = await controllers.getUsers();
  res.send(users);
}));

router.post('/signup', validate(UserSignupDto), handler(async (req, res) => {
  const user = await controllers.signup(req.body);
  res.send(user);
}));

router.post('/signin', validate(UserSigninDto), handler(async (req, res) => {
  const user = await controllers.signin(req.body);
  req.session!.userId = user.id;
  req.session!.userRole = user.role;
  res.send(user);
}));

router.get('/:userId', userMiddleware, handler(async (req, res) => {
  const user = await controllers.getUser(req.params.userId);
  res.send(user);
}));

router.patch('/:userId', validate(UserUpdateDto), userMiddleware, handler(async (req, res) => {
  const user = await controllers.updateUser(req.params.userId, req.body);
  res.send(user);
}));

router.delete('/:userId', userMiddleware, handler(async (req, res) => {
  await controllers.deleteUser(req.params.userId);
  const users = await controllers.getUsers();
  res.send(users);
}));

export default router;
