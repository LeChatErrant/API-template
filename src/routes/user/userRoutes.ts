import { AsyncRouter } from 'express-async-router';
import httpStatus from 'http-status-codes';

import authMiddleware from '../../middlewares/authMiddleware';
import adminMiddleware from '../../middlewares/adminMiddleware';
import ownershipMiddleware from '../../middlewares/ownershipMiddleware';
import validate from '../../middlewares/validationMiddleware';

import * as controllers from './userControllers';
import userMiddleware from './userMiddleware';
import { UserSignupDto, UserSigninDto, UserUpdateDto } from './userTypes';

const router = AsyncRouter();

router.get(
  '/users',
  adminMiddleware,
  async (req, res) => {
    const users = await controllers.listUsers();
    res.send(users);
  },
);

router.post(
  '/users/signup',
  validate(UserSignupDto),
  async (req, res) => {
    const user = await controllers.signup(req.body);
    res.status(httpStatus.CREATED).send(user);
  },
);

router.post(
  '/users/signin',
  validate(UserSigninDto),
  async (req, res) => {
    const user = await controllers.signin(req.body);
    req.session.user = {
      id: user.id,
      role: user.role,
    };
    res.send(user);
  },
);

router.post(
  '/users/signout',
  authMiddleware,
  async (req, res) => {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    res.sendStatus(httpStatus.NO_CONTENT);
  },
);

router.get(
  '/users/:userId',
  ownershipMiddleware,
  userMiddleware,
  async (req, res) => {
    const user = await controllers.getUser(res.locals.user);
    res.send(user);
  },
);

router.patch(
  '/users/:userId',
  validate(UserUpdateDto),
  ownershipMiddleware,
  userMiddleware,
  async (req, res) => {
    const user = await controllers.updateUser(res.locals.user, req.body);
    res.send(user);
  },
);

router.delete(
  '/users/:userId',
  ownershipMiddleware,
  userMiddleware,
  async (req, res) => {
    await controllers.deleteUser(res.locals.user);
    res.sendStatus(httpStatus.NO_CONTENT);
  },
);

export default router;
