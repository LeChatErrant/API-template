import { capitalize } from '../utils';

const typesTemplate = (singular: string) => `\
import { } from 'class-validator';

import { Ro } from '../../appRo';

export class ${capitalize(singular)}CreateDto {
}

export class ${capitalize(singular)}UpdateDto {
}

export interface ${capitalize(singular)}Ro extends Ro {
  id: string;
  userId: string;
  createdAt: Date;
}
`;

export default typesTemplate;
