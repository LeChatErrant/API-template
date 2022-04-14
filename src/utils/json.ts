/* eslint-disable  @typescript-eslint/no-explicit-any */

/**
 * Stringify a data in a readable way, with indents and line break
 *
 * @param json Json to beautify
 * @return Printable string
 */
export function beautifyJson(json: any) {
  return JSON.stringify(json, null, 2);
}

/**
 * Sort keys of a JSON alphabetically
 *
 * @param json Json to sort
 * @return Sorted json
 */
export function sortJsonKeys(json: Record<string, any>) {
  return JSON.parse(JSON.stringify(json, Object.keys(json).sort()));
}

/**
 * JSON.parse doesn't convert dates to Date type (yeah, it's insane...)
 * Use parseJsonWithDates to correctly have Dates deserialized
 *
 * @param str Stringified JSON
 * @return JSON deserialized, including dates
 */
export function parseJsonWithDates(str: string) {
  const isDateValid = (val: string) => !Number.isNaN(Date.parse(val)) && Number.isNaN(Number(val));

  const handleDates = (key: string, val: any) => {
    if (typeof val === 'string' && isDateValid(val)) {
      return new Date(val);
    }
    return val;
  };

  return JSON.parse(str, handleDates);
}

/**
 * Return a deep copy of the json passed as parameter
 *
 * @param json Json to copy
 * @return Deep copy of the json
 */
export function deepCopy<T>(json: T): T {
  return JSON.parse(JSON.stringify(json));
}
