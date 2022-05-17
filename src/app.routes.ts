import { AsyncRouter } from 'express-async-router';

import postRoutes from '@routes/post/post.routes';
import userRoutes from '@routes/user/user.routes';

const router = AsyncRouter();

router.get('/', (req, res) => res.send('Welcome to the backend world !'));
router.get('/ping', (req, res) => res.send('pong'));

router.use(userRoutes);
router.use(postRoutes);

export default router;
