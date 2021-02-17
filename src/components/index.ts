import express from 'express';

import users from './user/userRoutes';
import posts from './post/postRoutes';

const router = express.Router();

router.get('/ping', (req, res) => res.send('pong'));

router.use(users);
router.use(posts);

export default router;
