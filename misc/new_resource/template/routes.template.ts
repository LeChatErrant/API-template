import { capitalize } from '../utils';

const routesTemplate = (singular: string, plural: string) => `\
import express from 'express';
import handler from 'express-async-handler';
import httpStatus from 'http-status-codes';

import ownershipMiddleware from '../../middlewares/ownershipMiddleware';
import authMiddleware from '../../middlewares/authMiddleware';
import validate from '../../middlewares/validationMiddleware';

import ${singular}Middleware from './${singular}Middleware';
import * as controllers from './${singular}Controllers';
import { ${capitalize(singular)}CreateDto, ${capitalize(singular)}UpdateDto } from './${singular}Types';

const router = express.Router();

router.get(
  '/users/:userId/${plural}',
  authMiddleware,
  handler(async (req, res) => {
    const ${plural} = await controllers.list${capitalize(plural)}(req.params.userId);
    res.send(${plural});
  }),
);

router.${singular}(
  '/users/:userId/${plural}',
  validate(${capitalize(singular)}CreateDto),
  ownershipMiddleware,
  handler(async (req, res) => {
    const ${singular} = await controllers.createNew${capitalize(singular)}(req.params.userId, req.body);
    res.status(httpStatus.CREATED).send(${singular});
  }),
);

router.get(
  '/users/:userId/${plural}/:${singular}Id',
  authMiddleware,
  ${singular}Middleware,
  handler(async (req, res) => {
    const ${singular} = await controllers.get${capitalize(singular)}(res.locals.${singular});
    res.send(${singular});
  }),
);

router.patch(
  '/users/:userId/${plural}/:${singular}Id',
  validate(${capitalize(singular)}UpdateDto),
  ownershipMiddleware,
  ${singular}Middleware,
  handler(async (req, res) => {
    const ${singular} = await controllers.update${capitalize(singular)}(res.locals.${singular}, req.body);
    res.send(${singular});
  }),
);

router.delete(
  '/users/:userId/${plural}/:${singular}Id',
  ownershipMiddleware,
  ${singular}Middleware,
  handler(async (req, res) => {
    await controllers.delete${capitalize(singular)}(res.locals.${singular});
    res.sendStatus(httpStatus.NO_CONTENT);
  }),
);

export default router;
`;

export default routesTemplate;
