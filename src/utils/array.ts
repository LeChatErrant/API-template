/* eslint-disable  @typescript-eslint/no-explicit-any */

/**
 * Group by regroup elements of an array depending on the value of the given field
 *
 * @param arr The array to group
 * @param by Name of the key to group by
 *
 * @example
 * const inventory = [
 *   { name: 'asparagus', type: 'vegetable', quantity: 5 },
 *   { name: 'banana',  type: 'fruit', quantity: 0 },
 *   { name: 'cow', type: 'meat', quantity: 23 },
 *   { name: 'cherry', type: 'fruit', quantity: 5 },
 *   { name: 'fish', type: 'meat', quantity: 22 },
 * ];
 *
 * groupBy(inventory, 'type');
 * // {
 * //   vegetable: [ { name: 'asparagus', type: 'vegetable', quantity: 5 } ],
 * //   fruit: [
 * //     { name: 'banana', type: 'fruit', quantity: 0 },
 * //     { name: 'cherry', type: 'fruit', quantity: 5 }
 * //   ],
 * //   meat: [
 * //     { name: 'cow', type: 'meat', quantity: 23 },
 * //     { name: 'fish', type: 'meat', quantity: 22 }
 * //   ]
 * // }
 */
export function groupBy<T extends Record<string, any>, K extends keyof T>(arr: Array<T>, by: K): Record<T[K], Array<T>> {
  return arr.reduce((acc, val) => ({
    ...acc,
    [val[by]]: acc[val[by]]
      ? [...acc[val[by]], val]
      : [val],
  }), {} as Record<T[K], Array<T>>);
}
