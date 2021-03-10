/*  eslint-disable  import/no-extraneous-dependencies  */

import inquirer from 'inquirer';
import chalk from 'chalk';
import pluralize from 'pluralize';

import { Options } from './types';

/**
 * Prompt the user for the name of the resource to be created
 *
 * @return Resource name (lowercase)
 */
export async function queryResourceName() {
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
export async function queryPluralizedResourceName(resourceName: string) {
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
export async function queryOptions(options: Options) {
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
