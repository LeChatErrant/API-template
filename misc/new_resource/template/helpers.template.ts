import { capitalize } from '../utils';

const helpersTemplate = (singular: string) => `\
import type { ${capitalize(singular)} } from '@prisma/client';

import type { ${capitalize(singular)}Ro } from './${singular}Types';

/**
 * Build a ${singular} Response Object (RO) with only the fields to be shown to the user
 * Can be used to compute or add extra informations to the ${singular} object, useful for front-end display
 *
 * @param ${singular} The ${singular} object to format
 * @returns A ${singular} Response Object ready to be sent into API responses
 */
export function build${capitalize(singular)}Ro(${singular}: ${capitalize(singular)}): ${capitalize(singular)}Ro {
  return {
    id: ${singular}.id,
    userId: ${singular}.userId,
    createdAt: ${singular}.createdAt,
  };
}
`;

export default helpersTemplate;
