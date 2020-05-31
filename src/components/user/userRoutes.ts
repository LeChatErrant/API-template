import express from 'express';
import handler from 'express-async-handler';

import userMiddleware from '../../middlewares/userMiddleware';
import adminMiddleware from '../../middlewares/adminMiddleware';
import validate from '../../middlewares/validationMiddleware';

import * as controllers from './userControllers';
import { UserSignupDto, UserSigninDto, UserUpdateDto } from './userTypes';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - id
 *          - email
 *          - role
 *          - createdAt
 *        properties:
 *          id:
 *            type: string
 *            format: cuid
 *            description: User id
 *          name:
 *            type: string
 *            description: Name of the user (optional)
 *          email:
 *            type: string
 *            format: email
 *            description: Email of the user (unique)
 *          role:
 *            type: string
 *            enum: [USER, ADMIN]
 *            description: User role. ADMIN have access to all user's resources and to special protected routes, and user can only access their own resources
 *        example:
 *           id: fakeid
 *           name: LeChatErrant
 *           email: fake@email.com
 *           role: USER
 */

/**
 * @swagger
 * /users:
 *   get:
 *     description: List users (accessible only for ADMIN role)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/', adminMiddleware, handler(async (req, res) => {
  const users = await controllers.getUsers();
  res.send(users);
}));

/**
 * @swagger
 * /users/signup:
 *   post:
 *     description: Create account
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email password
 *               password:
 *                 type: string
 *                 description: User password
 *                 minLength: 8
 *                 maxLength: 64
 *               name:
 *                 type: string
 *                 description: User name (optional)
 *     responses:
 *       200:
 *         description: users
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: Session cookie
 *               example: connect.sid=abcde12345; Path=/; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/signup', validate(UserSignupDto), handler(async (req, res) => {
  const user = await controllers.signup(req.body);
  res.send(user);
}));

/**
 * @swagger
 * /users/signin:
 *   post:
 *     description: Log user in
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email password
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: users
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: Session cookie
 *               example: connect.sid=abcde12345
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/signin', validate(UserSigninDto), handler(async (req, res) => {
  const user = await controllers.signin(req.body);
  req.session!.userId = user.id;
  req.session!.userRole = user.role;
  res.send(user);
}));

router.get('/:userId', userMiddleware, handler(async (req, res) => {
  const user = await controllers.getUser(req.params.userId);
  res.send(user);
}));

router.patch('/:userId', validate(UserUpdateDto), userMiddleware, handler(async (req, res) => {
  const user = await controllers.updateUser(req.params.userId, req.body);
  res.send(user);
}));

router.delete('/:userId', userMiddleware, handler(async (req, res) => {
  await controllers.deleteUser(req.params.userId);
  const users = await controllers.getUsers();
  res.send(users);
}));

export default router;
