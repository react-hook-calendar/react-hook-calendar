import React, { ReactNode, CSSProperties } from 'react';

export type CalendarBodyProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function CalendarBody(props: CalendarBodyProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 14.3%)',
        gridTemplateRows: 'repeat(96, 0.4rem)',
        ...props.style,
      }}
      className={props.className}
    >
      {props.children}
    </div>
  );
}
