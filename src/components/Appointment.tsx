import React, { CSSProperties, ReactNode } from 'react';
import { useAppointment } from '../hooks/useAppointment';

export type AppointmentProps = {
  start: Date | number | string;
  end: Date | number | string;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
};

export function Appointment(props: AppointmentProps) {
  const { style, inView } = useAppointment(props);
  if (inView) {
    return (
      <div style={{ ...style, ...props.style }} className={props.className}>
        {props.children}
      </div>
    );
  }
  return null;
}
