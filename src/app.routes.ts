import { AsyncRouter } from 'express-async-router';

import posts from '@routes/post/post.routes';
import users from '@routes/user/user.routes';

const router = AsyncRouter();

router.get('/', (req, res) => res.send('Welcome to the backend world !'));
router.get('/ping', (req, res) => res.send('pong'));

router.use(users);
router.use(posts);

export default router;
