/**
 * Pause the execution
 *
 * @param ms Milliseconds to wait
 * @example
 * await sleep(1000); // Sleep 1s
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default sleep;
