import { endOfWeek, Interval, startOfWeek } from 'date-fns';
import { useContext, createContext } from 'react';
import { CalendarView } from '../types';

export type CalendarContextType = {
  /** The view that the calendar is currently displaying */
  view: CalendarView;
  viewPeriod: Interval;
  // Controls
  setView: (view: CalendarView) => void;
  goForward: () => void;
  goBackward: () => void;
};

export const CalendarContext = createContext<CalendarContextType>({
  view: 'week',
  viewPeriod: { start: startOfWeek(new Date()), end: endOfWeek(new Date()) },
  setView: () => {},
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
