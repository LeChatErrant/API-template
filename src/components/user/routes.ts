import express from 'express';

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
    const user = await controllers.createUser(req.body);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

router.post('/signin', async (req, res, next) => {

});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await controllers.getUser(req.params.id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const user = await controllers.updateUser(req.params.id, req.body);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async(req, res, next) => {
  try {
    await controllers.deleteUser(req.params.id);
    const users = await controllers.getUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

export default router;
