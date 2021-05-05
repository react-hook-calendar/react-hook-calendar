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

/**
 * Turns a time string into a millisecond time value
 *
 * @param time The time value as a string, e.g. 17:30
 * @param propHint A hint to where this time value was initially supplied for error messages
 * @returns Millisecond time value as integer
 */
export function parseTime(time: string, propHint: string = 'as property') {
  function throwError(message: string) {
    throw new Error(`Received invalid time string value "${time}" ${propHint}. ${message}.`);
  }
  const split = time.split(':');
  if (split.length !== 2) {
    throwError('Valid time values are hours and minutes seperated by ":"');
  }
  const hours = parseInt(split[0]);
  const minutes = parseInt(split[1]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    throwError('Could not parse hours or minutes to number');
  }
  if (hours < 0 || hours > 24 || (hours === 24 && minutes > 0)) {
    throwError('Only time values between 0:00 and 24:00 are allowed');
  }
  if (minutes !== 0 && minutes !== 30) {
    throwError('Currently only minute values 0 and 30 are allowed');
  }
  return (hours * 60 + minutes) * 60 * 1000;
}
