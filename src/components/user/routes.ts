import express from 'express';

import userMiddleware from '../../middlewares/userMiddleware';

import * as controllers from './controllers';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await controllers.getUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const user = await controllers.signup(req.body);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

router.post('/signin', async (req, res, next) => {
  try {
    const user = await controllers.signin(req.body);
    req.session!.userId = user.id;
    req.session!.userRole = user.role;
    res.send(user);
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', userMiddleware, async (req, res, next) => {
  try {
    const user = await controllers.getUser(req.params.userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

router.patch('/:userId', userMiddleware, async (req, res, next) => {
  try {
    const user = await controllers.updateUser(req.params.userId, req.body);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

router.delete('/:userId', userMiddleware, async (req, res, next) => {
  try {
    await controllers.deleteUser(req.params.userId);
    const users = await controllers.getUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

export default router;
