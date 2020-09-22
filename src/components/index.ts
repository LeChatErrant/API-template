import express from 'express';

import users from './user/userRoutes';

const router = express.Router();

router.get('/ping', (req, res) => res.send('pong'));
router.use('/users', users);

export default router;
