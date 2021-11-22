import { endOfDay, endOfWeek, startOfDay, startOfWeek } from 'date-fns';
import { addDays, addWeeks, subDays, subWeeks } from 'date-fns/fp';
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
  customDays?: number;
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
  customDays = 4,
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
      end: getViewPeriodEnd(view, focusDate, customDays, weekStartsOn),
    }),
    [view, focusDate]
  );

  const viewTimes = useMemo(() => ({ start: parseTime(timeStart), end: parseTime(timeEnd) }), [
    timeStart,
    timeEnd,
  ]);

  const goForward = useCallback(
    () => setFocusDate(view === 'week' ? addWeeks(1) : addDays(view === 'day' ? 1 : customDays)),
    [view],
  );

  const goBackward = useCallback(
    () => setFocusDate(view === 'week' ? subWeeks(1) : subDays(view === 'day' ? 1 : customDays)),
    [view],
  );

  return (
    <CalendarContext.Provider
      value={{
        view,
        setView,
        date: focusDate,
        setDate: setFocusDate,
        viewPeriod,
        customDays,
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
    return startOfWeek(referenceDate, { weekStartsOn });
  }
  if (view === 'day' || view === 'custom') {
    return startOfDay(referenceDate);
  }
  throw new Error('Unknown view value `' + view + '`.');
}

function getViewPeriodEnd(
  view: CalendarView,
  referenceDate: Date,
  customDays: number,
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
): Date {
  if (view === 'week') {
    return endOfWeek(referenceDate, { weekStartsOn });
  }
  if (view === 'day') {
    return endOfDay(referenceDate);
  }
  if (view === 'custom') {
    return endOfDay(addDays(customDays - 1, referenceDate));
  }
  throw new Error('Unknown view value `' + view + '`.');
}
