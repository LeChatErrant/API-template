import { capitalize } from '../utils';

const middlewareTemplate = (singular: string, plural: string) => `\
import handler from 'express-async-handler';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';

import db from '../../appDatabase';

/**
 * Middleware used to check if the requested ${singular} exists in database
 * If it exists, stores it in \`res.locals\` to forward it to controllers
 *
 * @throws 400 - Bad request | If the route parameters are missing
 * @throws 404 - Not found | If the ${singular} doesn't exist
 *
 * @example
 * router.get('/${singular}/:${singular}Id', ${singular}Middleware, (req, res) => {
 *   const { ${singular} } = res.locals;
 * });
 */
const ${singular}Middleware = handler(async (req, res, next) => {
  const { userId, ${singular}Id } = req.params;
  if (!userId || !${singular}Id) {
    next(createError(httpStatus.BAD_REQUEST, 'Missing route parameters "userId" and/or "${singular}Id"'));
    return;
  }

  const ${singular} = await db.${singular}.findFirst({ where: { id: ${singular}Id, authorId: userId } });
  if (!${singular}) {
    next(createError(httpStatus.NOT_FOUND, \`${capitalize(singular)} \${${singular}Id} of user \${userId} not found\`));
  } else {
    res.locals.${singular} = ${singular};
    next();
  }
});

export default ${singular}Middleware;
`;

export default middlewareTemplate;
