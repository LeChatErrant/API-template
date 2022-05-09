/**
 * Add hours to a given date
 *
 * @param date Date to increase
 * @param hours Number of hours
 * @return New date
 */
export function addHoursToDate(date: Date, hours: number) {
  const newDate = new Date(date);
  newDate.setHours(date.getHours() + hours);
  return newDate;
}

/**
 * Add days to a given date
 *
 * @param date Date to increase
 * @param days Number of days
 * @return New date
 */
export function addDaysToDate(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

/**
 * Add months to a given date
 *
 * @param date Date to increase
 * @param months Number of months
 * @return New date
 */
export function addMonthsToDate(date: Date, months: number) {
  const newDate = new Date(date);
  newDate.setMonth(date.getMonth() + months);
  return newDate;
}
