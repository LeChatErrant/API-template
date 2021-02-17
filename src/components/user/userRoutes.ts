import express from 'express';
import handler from 'express-async-handler';
import httpStatus from 'http-status-codes';

import ownershipMiddleware from '../../middlewares/ownershipMiddleware';
import adminMiddleware from '../../middlewares/adminMiddleware';
import validate from '../../middlewares/validationMiddleware';

import * as controllers from './userControllers';
import userMiddleware from './userMiddleware';
import { UserSignupDto, UserSigninDto, UserUpdateDto } from './userTypes';

const router = express.Router();

router.get(
  '/users',
  adminMiddleware,
  handler(async (req, res) => {
    const users = await controllers.listUsers();
    res.send(users);
  }),
);

router.post(
  '/users/signup',
  validate(UserSignupDto),
  handler(async (req, res) => {
    const user = await controllers.signup(req.body);
    res.status(httpStatus.CREATED).send(user);
  }),
);

router.post(
  '/users/signin',
  validate(UserSigninDto),
  handler(async (req, res) => {
    const user = await controllers.signin(req.body);
    req.session.user = {
      id: user.id,
      role: user.role,
    };
    res.send(user);
  }),
);

router.get(
  '/users/:userId',
  ownershipMiddleware,
  userMiddleware,
  handler(async (req, res) => {
    const user = await controllers.getUser(res.locals.user);
    res.send(user);
  }),
);

router.patch(
  '/users/:userId',
  validate(UserUpdateDto),
  ownershipMiddleware,
  userMiddleware,
  handler(async (req, res) => {
    const user = await controllers.updateUser(res.locals.user, req.body);
    res.send(user);
  }),
);

router.delete(
  '/users/:userId',
  ownershipMiddleware,
  userMiddleware,
  handler(async (req, res) => {
    await controllers.deleteUser(res.locals.user);
    res.sendStatus(httpStatus.NO_CONTENT);
  }),
);

export default router;
