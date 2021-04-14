import { useMemo, CSSProperties } from 'react';
import { areIntervalsOverlapping, getHours, getMinutes } from 'date-fns';
import { useCalendar } from './useCalendar';
import { toDate } from '../util';
import { differenceInDays } from 'date-fns/esm';

export type UseAppointmentConfig = {
  start: Date | number | string;
  end: Date | number | string;
};

export type UseAppointmentResult = {
  style: CSSProperties;
  inView: boolean;
  /** An interval with the parsed Dates */
  interval: Interval;
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
  const { view, viewPeriod } = useCalendar();
  return useMemo(() => {
    const interval = { start: toDate(config.start), end: toDate(config.end) };
    if (!areIntervalsOverlapping(viewPeriod, interval)) {
      return {
        style: {},
        interval,
        inView: false,
      };
    }
    // The column in the grid where we want to render this appoinment slot
    const column = differenceInDays(viewPeriod.start, interval.start) + 1;
    // The rows in the grid where we want to render this appointment slot
    const gridRowStart = getHours(interval.start) * 4 + Math.round(getMinutes(interval.start) / 15);
    const gridRowEnd = getHours(interval.end) * 4 + Math.round(getMinutes(interval.end) / 15);
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
  }, [config.start, config.end, view, viewPeriod]);
}
