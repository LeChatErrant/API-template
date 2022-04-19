/**
 * Add hours to a given date
 *
 * @param date Date to increase
 * @param hours Number of hours
 * @return New date
 */
export function addHours(date: Date, hours: number) {
  const newDate = new Date(date);
  newDate.setHours(date.getHours() + hours);
  return newDate;
}
