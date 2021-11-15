import React, { CSSProperties, ReactNode } from 'react';
import { useCalendar } from '../hooks/useCalendar';

type GridLength = '30 min' | '1 hour' | '2 hours' | '4 hours';

export type CalendarGridProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  length?: GridLength;
};

function gridLenghtToQuaterHours(length: GridLength) {
  return {
    '30 min': 2,
    '1 hour': 4,
    '2 hours': 8,
    '4 hours': 16,
  }[length];
}

export function CalendarGrid({
  children,
  className,
  style,
  length = '2 hours',
}: CalendarGridProps) {
  const { view, viewTimes, customDays } = useCalendar();
  const numDaysDisplayed = view === 'day' ? 1 : customDays;
  const quaterHours = gridLenghtToQuaterHours(length);
  const numRowsDisplayed = (viewTimes.end - viewTimes.start) / (15 * 60 * 1000) / quaterHours;
  return (
    <>
      {Array.apply(null, Array(numDaysDisplayed)).flatMap((_, dayIndex) =>
        Array.apply(null, Array(numRowsDisplayed)).map((_, timeIndex) => {
          const gridRowStart = timeIndex * quaterHours + 1;
          const gridRowEnd = gridRowStart + quaterHours;
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
      )}
    </>
  );
}
