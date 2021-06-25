import { useMemo, CSSProperties } from 'react';
import { areIntervalsOverlapping, getHours, getMinutes, differenceInDays } from 'date-fns';
import { useCalendar } from './useCalendar';
import { toDate } from '../util';

export type UseAppointmentConfig = {
  start: Date | number | string;
  end: Date | number | string;
};

export type UseAppointmentResult = {
  style: CSSProperties;
  inView: boolean;
  /** An interval with the parsed Dates */
  interval: { start: Date; end: Date };
};

/**
 * This hook powers the Appointment component and allows users to simply build their own custom
 * appointment components. The `style` property can be passed to any DOM node that should be placed
 * and sized correctly with the calendar body.
 *
 * @example
 * ```tsx
 * const MyAppointment(props) {
 *   const { style, inView } = useAppointment({ start: props.start, end: props.end });
 *   return (
 *     <div style={style} hidden={inView}>{props.title}</div>
 *   );
 * }
 * ```
 */
export function useAppointment(config: UseAppointmentConfig): UseAppointmentResult {
  const { view, viewPeriod, viewTimes } = useCalendar();
  return useMemo(() => {
    const interval = { start: toDate(config.start), end: toDate(config.end) };
    // This is the rendered start time. This time is at least the displayed minimum time of the cal.
    const startTime = Math.max(viewTimes.start, estMillisecondsSinceStartOfDay(interval.start));
    // This is the rendered end time. This time is at most the displayed maximum time of the cal.
    const endTime = Math.min(viewTimes.end, estMillisecondsSinceStartOfDay(interval.end));
    if (
      !areIntervalsOverlapping(viewPeriod, interval) ||
      endTime < viewTimes.start ||
      startTime > viewTimes.end
    ) {
      return {
        style: {},
        interval,
        inView: false,
      };
    }
    // The column in the grid where we want to render this appoinment slot
    const column = differenceInDays(interval.start, viewPeriod.start) + 1;
    // The rows in the grid where we want to render this appointment slot
    const gridRowStart = Math.round((startTime - viewTimes.start) / (15 * 60 * 1000)) + 1;
    const gridRowEnd = Math.round((endTime - viewTimes.start) / (15 * 60 * 1000)) + 1;
    return {
      style: {
        gridColumnStart: column,
        gridColumnEnd: column,
        gridRowStart,
        gridRowEnd,
      },
      interval,
      inView: true,
    };
  }, [config.start, config.end, view, viewPeriod, viewTimes.start, viewTimes.end]);
}

function estMillisecondsSinceStartOfDay(date: Date) {
  return (getHours(date) * 60 + getMinutes(date)) * 60 * 1000;
}
