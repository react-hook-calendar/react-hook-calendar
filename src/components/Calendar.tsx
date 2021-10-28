import { endOfDay, endOfWeek, startOfDay, startOfWeek } from 'date-fns';
import { addDays, subDays } from 'date-fns/fp';
import React, { useState, ReactNode, useCallback, useMemo } from 'react';
import { CalendarContext } from '../hooks/useCalendar';
import { CalendarView } from '../types';
import { parseTime, toDate } from '../util';

export type CalendarProps = {
  /** The view that the calendar should use. This can be changed with */
  defaultView?: CalendarView;
  /** A date that should be shown at the start. Defaults to today. */
  initialDate?: Date | string | number;
  /** All the elements within the calendar that might consume the calendar context. */
  children?: ReactNode;
  /** Limit the view to appointments after this time */
  timeStart?: string;
  /** Limit the view to appointments before this time */
  timeEnd?: string;
  /** Number of days in a view */
  daysNumber?: number;
  /** Configure the day, that the week should start on */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

/**
 * Manages the calendar state and provides the calendar context.
 */
export function Calendar({
  defaultView = 'week',
  initialDate = new Date(),
  timeStart = '0:00',
  timeEnd = '24:00',
  daysNumber = 7,
  weekStartsOn,
  children,
}: CalendarProps) {
  // The focus date is the date that is currently shown
  const [focusDate, setFocusDate] = useState(toDate(initialDate));
  // Stores the current view
  const [view, setView] = useState(defaultView);

  // The view period reacts to changes in view and focus date
  const viewPeriod = useMemo(
    () => ({
      start: getViewPeriodStart(view, focusDate, weekStartsOn),
      end: getViewPeriodEnd(view, focusDate, weekStartsOn),
    }),
    [view, focusDate]
  );

  const viewTimes = useMemo(() => ({ start: parseTime(timeStart), end: parseTime(timeEnd) }), [
    timeStart,
    timeEnd,
  ]);

  const goForward = useCallback(() => setFocusDate(view === 'week' ? addDays(1) : addDays(1)), [
    view,
  ]);

  const goBackward = useCallback(() => setFocusDate(view === 'week' ? subDays(1) : subDays(1)), [
    view,
  ]);

  return (
    <CalendarContext.Provider
      value={{
        view,
        setView,
        date: focusDate,
        setDate: setFocusDate,
        viewPeriod,
        daysNumber,
        goForward,
        goBackward,
        viewTimes,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

function getViewPeriodStart(
  view: CalendarView,
  referenceDate: Date,
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
): Date {
  if (view === 'week') {
    return startOfDay(referenceDate);
    return startOfWeek(referenceDate, { weekStartsOn });
  }
  if (view === 'day') {
    return startOfDay(referenceDate);
  }
  throw new Error('Unknown view value `' + view + '`.');
}

function getViewPeriodEnd(
  view: CalendarView,
  referenceDate: Date,
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
): Date {
  if (view === 'week') {
    return addDays(2, referenceDate);
    return endOfWeek(referenceDate, { weekStartsOn });
  }
  if (view === 'day') {
    return endOfDay(referenceDate);
  }
  throw new Error('Unknown view value `' + view + '`.');
}
