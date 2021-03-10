/*  eslint-disable  import/no-extraneous-dependencies  */

import npm from 'npm';

/**
 * Capitalize the given string
 *
 * @param str The string to capitalize
 * @return The capitalized string
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function npmRun(script: string, args: string[] = []) {
  await new Promise<void>((resolve, reject) => {
    npm.load((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

  return new Promise<void>((resolve, reject) => {
    npm.commands['run-script']([script, ...args], (error, result) => {
      console.log(result);
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
