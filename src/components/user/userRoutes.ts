import express from 'express';
import handler from 'express-async-handler';
import httpStatus from 'http-status-codes';

import userMiddleware from '../../middlewares/userMiddleware';
import adminMiddleware from '../../middlewares/adminMiddleware';
import validate from '../../middlewares/validationMiddleware';

import * as controllers from './userControllers';
import { UserSignupDto, UserSigninDto, UserUpdateDto } from './userTypes';

const router = express.Router();

router.get('/users', adminMiddleware, handler(async (req, res) => {
  const users = await controllers.listUsers();
  res.send(users);
}));

router.post('/users/signup', validate(UserSignupDto), handler(async (req, res) => {
  const user = await controllers.signup(req.body);
  res.status(httpStatus.CREATED).send(user);
}));

router.post('/users/signin', validate(UserSigninDto), handler(async (req, res) => {
  const user = await controllers.signin(req.body);
  req.session.user = {
    id: user.id,
    role: user.role,
  };
  res.send(user);
}));

router.get('/users/:userId', userMiddleware, handler(async (req, res) => {
  const user = await controllers.getUser(req.params.userId);
  res.send(user);
}));

router.patch('/users/:userId', validate(UserUpdateDto), userMiddleware, handler(async (req, res) => {
  const user = await controllers.updateUser(req.params.userId, req.body);
  res.send(user);
}));

router.delete('/users/:userId', userMiddleware, handler(async (req, res) => {
  await controllers.deleteUser(req.params.userId);
  res.sendStatus(httpStatus.NO_CONTENT);
}));

export default router;
