/**
 * Capitalize the given string
 *
 * @param str The string to capitalize
 * @return The capitalized string
 */
export function capitalize<T extends string>(str: T): Capitalize<T> {
  return str.charAt(0).toUpperCase() + str.slice(1) as Capitalize<T>;
}

/**
 * Uncapitalize the given string
 *
 * @param str The string to uncapitalize
 * @return The uncapitalized string
 */
export function uncapitalize<T extends string>(str: T): Uncapitalize<T> {
  return str.charAt(0).toLowerCase() + str.slice(1) as Uncapitalize<T>;
}
