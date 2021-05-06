import { eachDayOfInterval } from 'date-fns/esm';
import React, { CSSProperties, forwardRef, ReactNode } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { CalendarView } from '../types';

type CalendarHeaderInfo = {
  date: Date;
  view: CalendarView;
};

export type CalendarHeaderProps = {
  children: (options: CalendarHeaderInfo) => ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * This component makes rendering a header for each day in your calendar easy.
 * It will call and render the result of the provided `children` function as many times as it is
 * required in the current view.
 * The function is called with useful information about the current header cell.
 *
 * @example
 * ```ts
 * function MyCalendar() {
 *   return (
 *     <Calendar>
 *       <CalendarHead>
 *         {({ date }) => (
 *           <div>{format(date, 'MMM dd')}</div>
 *         )}
 *       </CalendarHead>
 *       <CalendarBody>
 *         {...}
 *       </CalendarBody>
 *     </Calendar>
 *   );
 * }
 * ```
 */
export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  function CalendarHeader(props, ref) {
    const { view, viewPeriod } = useCalendar();
    const days = eachDayOfInterval(viewPeriod);
    const gridTemplateColumns = view === 'day' ? '100%' : 'repeat(7, 1fr)';

    return (
      <div
        ref={ref}
        className={props.className}
        style={{ display: 'grid', gridTemplateColumns, ...props.style }}
      >
        {days.map((date, index) => (
          <div key={index} style={{ gridColumnStart: index + 1, gridColumnEnd: index + 1 }}>
            {props.children({ date, view })}
          </div>
        ))}
      </div>
    );
  }
);
