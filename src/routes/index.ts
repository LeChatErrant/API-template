import { AsyncRouter } from 'express-async-router';

import posts from './post/post.routes';
import users from './user/user.routes';

const router = AsyncRouter();

router.get('/', (req, res) => res.send('Welcome to the backend world !'));
router.get('/ping', (req, res) => res.send('pong'));

router.use(users);
router.use(posts);

export default router;
