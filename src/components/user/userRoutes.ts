import express from 'express';
import handler from 'express-async-handler';

import userMiddleware from '../../middlewares/userMiddleware';
import validationMiddleware from '../../middlewares/validationMiddleware';

import * as controllers from './userControllers';
import { UserSignup, UserSignin, UserUpdate } from './userTypes';

const router = express.Router();

router.get('/', handler(async (req, res, next) => {
  const users = await controllers.getUsers();
  res.send(users);
}));

router.post('/signup', validationMiddleware(UserSignup), handler(async (req, res, next) => {
  const user = await controllers.signup(req.body);
  res.send(user);
}));

router.post('/signin', validationMiddleware(UserSignin), handler(async (req, res, next) => {
  const user = await controllers.signin(req.body);
  req.session!.userId = user.id;
  req.session!.userRole = user.role;
  res.send(user);
}));

router.get('/:userId', userMiddleware, handler(async (req, res, next) => {
  const user = await controllers.getUser(req.params.userId);
  res.send(user);
}));

router.patch('/:userId', validationMiddleware(UserUpdate), userMiddleware, handler(async (req, res, next) => {
  const user = await controllers.updateUser(req.params.userId, req.body);
  res.send(user);
}));

router.delete('/:userId', userMiddleware, handler(async (req, res, next) => {
  await controllers.deleteUser(req.params.userId);
  const users = await controllers.getUsers();
  res.send(users);
}));

export default router;
