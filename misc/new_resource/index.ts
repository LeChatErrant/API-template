/*  eslint-disable  import/no-extraneous-dependencies  */

import clui from 'clui';

import type { Options } from './types';
import { queryOptions, queryPluralizedResourceName, queryResourceName } from './cli';
import { templateNewResource } from './templater';

async function main() {
  const options: Options = {
    database_model: {
      desc: 'Create a default database model',
      default: true,
    },
    tests: {
      desc: 'Create test files and extend requester',
      default: true,
    },
  };

  const resourceName = await queryResourceName();
  const resourceNamePluralized = await queryPluralizedResourceName(resourceName);
  // await queryOptions(options);

  const spinner = new clui.Spinner('Generating new API resource...');
  spinner.start();
  const success = await templateNewResource(resourceName, resourceNamePluralized);
  spinner.stop();

  if (!success) {
    console.error('Aborting...');
    process.exit(1);
  }
}

main();
