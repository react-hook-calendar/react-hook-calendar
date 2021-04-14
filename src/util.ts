import { isValid } from 'date-fns';

/**
 * Turn a value into a date by passing it to the date constructor or returning the value if it is
 * already a date. This makes the calendar API more flexible and allows passing values directly
 * e.g. from a JSON API.
 *
 * @param value Some JS value that should be turned into a date
 * @returns a value that is sure to be a date type
 */
export function toDate(value: unknown): Date {
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (!isValid(date)) {
      throw new TypeError(
        `Invalid date value provided '${value}'. Please make sure the date string is parsable by JS Date constructor.`
      );
    }
    return date;
  }
  if (typeof value === 'object' && value !== null && value instanceof Date) {
    return value;
  }
  throw new TypeError(`Invalid date value provided '${value}'.`);
}
