import path from 'path';
import fs from 'fs';
import routesTemplate from './template/routes.template';
import controllersTemplate from './template/controllers.template';
import middlewareTemplate from './template/middleware.template';

const componentPath = path.join(__dirname, '..', '..', 'src', 'components');

export function templateNewResource(singular: string, plural: string) {
  const resourcePath = path.join(componentPath, singular);

  if (fs.existsSync(resourcePath)) {
    console.error(`The directory ${resourcePath} already exists`);
    return false;
  }
  fs.mkdirSync(resourcePath);

  fs.writeFileSync(
    path.join(resourcePath, `${singular}Routes.ts`),
    routesTemplate(singular, plural),
  );

  fs.writeFileSync(
    path.join(resourcePath, `${singular}Controllers.ts`),
    controllersTemplate(singular, plural),
  );

  fs.writeFileSync(
    path.join(resourcePath, `${singular}Middleware.ts`),
    middlewareTemplate(singular, plural),
  );

  return true;
}
