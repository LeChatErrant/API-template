/*  eslint-disable  import/no-extraneous-dependencies  */

import chalk from 'chalk';
import clui from 'clui';
import inquirer from 'inquirer';
import pluralize from 'pluralize';
import { Option, Options } from './types';

/**
 * Capitalize the given string
 *
 * @param str The string to capitalize
 * @return The capitalized string
 */
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Prompt the user for the name of the resource to be created
 *
 * @return Resource name (lowercase)
 */
async function queryResourceName() {
  const { resourceName } = await inquirer.prompt([{
    name: 'resourceName',
    type: 'input',
    message: `How should your new API resource be named ? ${chalk.red('(singular)')}`,
    validate: (input) => input !== '',
  }]);
  return resourceName.toLowerCase();
}

/**
 * Prompt the user for the plural form of the resource to be created
 * Try first to guess it using grammatical rules
 * If incorrect, let the user write it
 *
 * @param resourceName The singular form of the resource name
 * @return The plural form of the resource name
 */
async function queryPluralizedResourceName(resourceName: string) {
  const guess = pluralize(resourceName);
  const { isPluralCorrect } = await inquirer.prompt([{
    name: 'isPluralCorrect',
    type: 'list',
    message: `Is '${chalk.blue(guess)}' the correct plural form ?`,
    choices: ['Yes', 'No'],
  }]);

  if (isPluralCorrect === 'Yes') {
    return guess.toLowerCase();
  }

  const { pluralizedResourceName } = await inquirer.prompt([{
    name: 'pluralizedResourceName',
    type: 'input',
    message: 'Write it in the plural form :',
    validate: (input) => input !== '',
  }]);
  return pluralizedResourceName.toLowerCase();
}

/**
 * Prompt the user for the given `options`
 * The `desc` field of each option will be displayed, and `default` will be taken in account
 * Directly fill the `value` field of each `options`
 *
 * @param options
 */
async function queryOptions(options: Options) {
  const { options: selectedOptions }: { options: string[] } = await inquirer.prompt([{
    name: 'options',
    type: 'checkbox',
    message: 'Select options',
    choices: Object
      .entries(options)
      .map(([name, option]) => ({
        value: name,
        name: option.desc,
        checked: option.default,
      })),
  }]);

  Object
    .entries(options)
    .forEach(([name, option]) => {
      option.value = selectedOptions.includes(name);
    });
}

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
  const resourceNamePluralize = await queryPluralizedResourceName(resourceName);
  await queryOptions(options);

  const spinner = new clui.Spinner('Generating new API resource...');
  spinner.start();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  spinner.stop();
}

main();
