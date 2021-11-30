import { endOfWeek, Interval, startOfWeek } from 'date-fns';
import { useContext, createContext } from 'react';
import { CalendarView } from '../types';

export type CalendarContextType = {
  /** The currently focused date */
  date: Date;
  /** The view that the calendar is currently displaying */
  view: CalendarView;
  /** The start and end of the currently displayed view */
  viewPeriod: Interval;
  /** Start and end of the visible part of each day in seconds since start of the day */
  viewTimes: { start: number; end: number };
  /** Current setting for the amount of displayed custom days */
  customDays: number;
  /** Set the currently focused day. Provide a function to get the current date for easy updates! */
  setDate: (date: Date | ((current: Date) => Date)) => void;
  /** Set the calendar view */
  setView: (view: CalendarView) => void;
  /** Move to next view period; this is done by moving the date for the length of a view peroid */
  goForward: () => void;
  /** Move to previous view period; this is done by moving the date for the length of a peroid */
  goBackward: () => void;
};

export const CalendarContext = createContext<CalendarContextType>({
  date: new Date(),
  view: 'week',
  viewPeriod: { start: startOfWeek(new Date()), end: endOfWeek(new Date()) },
  viewTimes: { start: 0, end: 24 * 60 * 60 * 1000 },
  customDays: 7,
  setView: () => {},
  setDate: () => {},
  goForward: () => {},
  goBackward: () => {},
});

/**
 * This hook can be used to connect to the calendar context and render content based on the context.
 * The context contains various information about the calendar state.
 *
 * @returns The calendar context
 */
export function useCalendar(): CalendarContextType {
  return useContext(CalendarContext);
}
