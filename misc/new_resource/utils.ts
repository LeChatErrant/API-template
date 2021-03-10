/**
 * Capitalize the given string
 *
 * @param str The string to capitalize
 * @return The capitalized string
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
