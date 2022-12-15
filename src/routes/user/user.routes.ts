import { AsyncRouter } from 'express-async-router';
import { StatusCodes } from 'http-status-codes';

import adminMiddleware from '@middlewares/admin.middleware';
import authMiddleware from '@middlewares/auth.middleware';
import ownershipMiddleware from '@middlewares/ownership.middleware';
import { validateBody } from '@middlewares/validation.middleware';

import * as controllers from './user.controllers';
import userMiddleware from './user.middleware';
import { UserSignupDto, UserSigninDto, UserUpdateDto } from './user.types';

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
  validateBody(UserSignupDto),
  async (req, res) => {
    const user = await controllers.signup(req.body);
    res.status(StatusCodes.CREATED).send(user);
  },
);

router.post(
  '/users/signin',
  validateBody(UserSigninDto),
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
    res.sendStatus(StatusCodes.NO_CONTENT);
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
  validateBody(UserUpdateDto),
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
    res.sendStatus(StatusCodes.NO_CONTENT);
  },
);

export default router;
