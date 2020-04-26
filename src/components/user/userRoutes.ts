import express from 'express';

import userMiddleware from '../../middlewares/userMiddleware';

import * as controllers from './userControllers';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const users = await controllers.getUsers();
  res.send(users);
});

router.post('/signup', async (req, res, next) => {
  const user = await controllers.signup(req.body);
  res.send(user);
});

router.post('/signin', async (req, res, next) => {
  const user = await controllers.signin(req.body);
  req.session!.userId = user.id;
  req.session!.userRole = user.role;
  res.send(user);
});

router.get('/:userId', userMiddleware, async (req, res, next) => {
  const user = await controllers.getUser(req.params.userId);
  res.send(user);
});

router.patch('/:userId', userMiddleware, async (req, res, next) => {
  const user = await controllers.updateUser(req.params.userId, req.body);
  res.send(user);
});

router.delete('/:userId', userMiddleware, async (req, res, next) => {
  await controllers.deleteUser(req.params.userId);
  const users = await controllers.getUsers();
  res.send(users);
});

export default router;
