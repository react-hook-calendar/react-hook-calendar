import React, { ReactNode, CSSProperties } from 'react';
import { useCalendar } from '../hooks/useCalendar';

export type CalendarBodyProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function CalendarBody(props: CalendarBodyProps) {
  const { view, viewTimes } = useCalendar();
  const numRows = (viewTimes.end - viewTimes.start) / (15 * 60 * 1000);
  const gridTemplateColumns = view === 'day' ? '100%' : 'repeat(7, 1fr)';
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns,
        gridTemplateRows: `repeat(${numRows}, 1fr)`,
        ...props.style,
      }}
      className={props.className}
    >
      {props.children}
    </div>
  );
}
