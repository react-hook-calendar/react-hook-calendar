import React, { CSSProperties, ReactNode } from 'react';
import { useCalendar } from '../hooks/useCalendar';

export type GridProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Grid({ children, className, style }: GridProps) {
  const { view } = useCalendar();
  const numDaysDisplayed = view === 'day' ? 1 : 7;
  return Array.apply(null, Array(numDaysDisplayed)).flatMap((_, dayIndex) =>
    Array.apply(null, Array(12)).map((_, timeIndex) => {
      const gridRowStart = timeIndex * 8 + 1;
      const gridRowEnd = gridRowStart + 8;
      const gridColumnStart = dayIndex + 1;
      return (
        <div
          className={className}
          style={{
            gridRowStart,
            gridRowEnd,
            gridColumnStart,
            gridColumnEnd: gridColumnStart,
            ...style,
          }}
        >
          {children}
        </div>
      );
    })
  );
}
