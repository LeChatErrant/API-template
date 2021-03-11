import { capitalize } from '../utils';

const controllersTemplate = (singular: string, plural: string) => `\
import httpStatus from 'http-status-codes';
import createError from 'http-errors';
import { ${capitalize(singular)} } from '@prisma/client';

import db from '../../appDatabase';

import type { ${capitalize(singular)}CreateDto, ${capitalize(singular)}UpdateDto } from './${singular}Types';
import { build${capitalize(singular)}Ro } from './${singular}Helpers';

export async function list${capitalize(plural)}(userId: string) {
  const ${plural} = await db.${singular}.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return ${plural}.map((${singular}) => build${capitalize(singular)}Ro(${singular}));
}

export async function createNew${capitalize(singular)}(userId: string, payload: ${capitalize(singular)}CreateDto) {
  const ${singular} = await db.${singular}.create({
    data: {
      ...payload,
      user: {
        connect: { id: userId },
      },
    },
  });
  return build${capitalize(singular)}Ro(${singular});
}

export async function get${capitalize(singular)}(${singular}: ${capitalize(singular)}) {
  return build${capitalize(singular)}Ro(${singular});
}

export async function update${capitalize(singular)}(${singular}: ${capitalize(singular)}, payload: ${capitalize(singular)}UpdateDto) {
  const updated${capitalize(singular)} = await db.${singular}.update({
    where: { id: ${singular}.id },
    data: payload,
  });
  return build${capitalize(singular)}Ro(updated${capitalize(singular)});
}

export async function delete${capitalize(singular)}(${singular}: ${capitalize(singular)}) {
  await db.${singular}.delete({ where: { id: ${singular}.id } });
}
`;

export default controllersTemplate;
