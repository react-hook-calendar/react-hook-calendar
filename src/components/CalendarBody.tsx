import React, { ReactNode, CSSProperties } from 'react';
import { useCalendar } from '../hooks/useCalendar';

export type CalendarBodyProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function CalendarBody(props: CalendarBodyProps) {
  const { view, viewTimes, customDays } = useCalendar();
  const numRows = (viewTimes.end - viewTimes.start) / (15 * 60 * 1000);
  let gridTemplateColumns = '100%';
  if (view === 'week') {
    gridTemplateColumns = 'repeat(7, 1fr)';
  }
  if (view === 'custom') {
    gridTemplateColumns = `repeat(${customDays}, 1fr)`;
  }
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
