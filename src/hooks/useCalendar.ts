import { endOfWeek, Interval, startOfWeek } from 'date-fns';
import { useContext, createContext } from 'react';
import { CalendarView } from '../types';

export type CalendarContextType = {
  /** The view that the calendar is currently displaying */
  date: Date;
  view: CalendarView;
  viewPeriod: Interval;
  daysNumber: number;
  viewTimes: { start: number; end: number };
  // Controls
  setDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  goForward: () => void;
  goBackward: () => void;
};

export const CalendarContext = createContext<CalendarContextType>({
  date: new Date(),
  view: 'week',
  viewPeriod: { start: startOfWeek(new Date()), end: endOfWeek(new Date()) },
  daysNumber: 7,
  viewTimes: { start: 0, end: 24 * 60 * 60 * 1000 },
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
