import {
  addDays,
  addWeeks,
  endOfDay,
  endOfWeek,
  startOfDay,
  startOfWeek,
  subDays,
  subWeeks,
} from 'date-fns';
import React, { useState, ReactNode, useCallback } from 'react';
import { CalendarContext } from '../hooks/useCalendar';
import { CalendarView } from '../types';
import { toDate } from '../util';

export type CalendarProps = {
  /** The view that the calendar should use. This can be changed with */
  defaultView?: CalendarView;
  /** A date that should be shown at the start. Defaults to today. */
  initialDate?: Date | string | number;
  /** A css class name that will be applied to the calendar surrounding div. */
  className?: string;
  /** All the elements within the calendar that might consume the calendar context. */
  children?: ReactNode;
};

/**
 * Manages the calendar state and provides the calendar context.
 */
export function Calendar({
  defaultView = 'week',
  initialDate = new Date(),
  className,
  children,
}: CalendarProps) {
  const [view, setViewInternal] = useState(defaultView);
  const [viewPeriod, setViewPeriod] = useState(() => ({
    start: getViewPeriodStart(view, toDate(initialDate)),
    end: getViewPeriodEnd(view, toDate(initialDate)),
  }));

  const setView = useCallback(
    function setView(newView: CalendarView) {
      if (view !== newView) {
        setViewInternal(newView);
        if (newView === 'day') {
          setViewPeriod(period => ({ ...period, end: endOfDay(period.start) }));
        } else if (newView === 'week') {
          setViewPeriod(period => ({
            start: startOfWeek(period.start),
            end: endOfDay(period.start),
          }));
        }
      }
    },
    [view, viewPeriod]
  );

  const goForward = useCallback(
    function goForward() {
      setViewPeriod(period => {
        switch (view) {
          case 'day':
            return { start: addDays(period.start, 1), end: addDays(period.end, 1) };
          case 'week':
            return { start: addWeeks(period.start, 1), end: addWeeks(period.end, 1) };
          default:
            return period;
        }
      });
    },
    [view, viewPeriod]
  );

  const goBackward = useCallback(
    function goBackward() {
      setViewPeriod(period => {
        switch (view) {
          case 'day':
            return { start: subDays(period.start, 1), end: subDays(period.end, 1) };
          case 'week':
            return { start: subWeeks(period.start, 1), end: subWeeks(period.end, 1) };
          default:
            return period;
        }
      });
    },
    [view, viewPeriod]
  );

  return (
    <CalendarContext.Provider value={{ view, setView, viewPeriod, goForward, goBackward }}>
      <div className={className}>{children}</div>
    </CalendarContext.Provider>
  );
}

function getViewPeriodStart(view: CalendarView, referenceDate: Date): Date {
  if (view === 'week') {
    return startOfWeek(referenceDate);
  }
  if (view === 'day') {
    return startOfDay(referenceDate);
  }
  throw new Error('Unknown view value `' + view + '`.');
}

function getViewPeriodEnd(view: CalendarView, referenceDate: Date): Date {
  if (view === 'week') {
    return endOfWeek(referenceDate);
  }
  if (view === 'day') {
    return endOfDay(referenceDate);
  }
  throw new Error('Unknown view value `' + view + '`.');
}
