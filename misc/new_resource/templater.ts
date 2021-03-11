/*  eslint-disable  import/no-extraneous-dependencies  */

import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

import { capitalize, npmRun } from './utils';
import routesTemplate from './template/routes.template';
import controllersTemplate from './template/controllers.template';
import middlewareTemplate from './template/middleware.template';
import prismaTemplate from './template/prisma.template';
import typesTemplate from './template/types.template';
import helpersTemplate from './template/helpers.template';
import specTemplate from './template/spec.template';

const projectPath = path.join(__dirname, '..', '..');
const componentPath = path.join(projectPath, 'src', 'components');
const prismaPath = path.join(projectPath, 'prisma');

async function fillPrismaSchema(singular: string) {
  const schemaPath = path.join(prismaPath, 'schema.prisma');
  const initialLength = fs.statSync(schemaPath).size;

  console.log(`Creating ${chalk.green(capitalize(singular))} model in ${chalk.blue(schemaPath)}`);

  fs.appendFileSync(
    schemaPath,
    prismaTemplate(singular),
  );

  try {
    await npmRun('prisma:format');
    await npmRun('prisma:generate');
    return true;
  } catch (error) {
    console.log(`The model ${chalk.red(capitalize(singular))} cannon be defined because a model with that name already exists in ${chalk.blue(schemaPath)} `);
    fs.truncateSync(schemaPath, initialLength);
    return false;
  }
}

function createTemplatedFile(directory: string, filename: string, content: string) {
  const filePath = path.join(directory, filename);

  console.log(`Creating ${chalk.green(filePath)} file...`);
  fs.writeFileSync(filePath, content);
}

export async function templateNewResource(singular: string, plural: string) {
  const resourcePath = path.join(componentPath, singular);

  if (fs.existsSync(resourcePath)) {
    console.error(`The directory ${resourcePath} already exists`);
    return false;
  }

  const prismaSuccess = await fillPrismaSchema(singular);
  if (!prismaSuccess) return false;

  console.log(`Creating ${chalk.green(resourcePath)} folder`);
  fs.mkdirSync(resourcePath);

  createTemplatedFile(resourcePath, `${singular}Routes.ts`, routesTemplate(singular, plural));
  createTemplatedFile(resourcePath, `${singular}Controllers.ts`, controllersTemplate(singular, plural));
  createTemplatedFile(resourcePath, `${singular}Middleware.ts`, middlewareTemplate(singular, plural));
  createTemplatedFile(resourcePath, `${singular}Types.ts`, typesTemplate(singular));
  createTemplatedFile(resourcePath, `${singular}Helpers.ts`, helpersTemplate(singular));
  createTemplatedFile(resourcePath, `${singular}.spec.ts`, specTemplate(singular));

  return true;
}
