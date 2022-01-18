import { AsyncRouter } from 'express-async-router';

import users from './user/userRoutes';
import posts from './post/postRoutes';

const router = AsyncRouter();

router.get('/', (req, res) => res.send('Welcome to the backend world !'));
router.get('/ping', (req, res) => res.send('pong'));

router.use(users);
router.use(posts);

export default router;
