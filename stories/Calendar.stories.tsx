import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Calendar, CalendarBody, Appointment, Grid } from '../src';

const meta: Meta = {
  title: 'Welcome',
  component: Calendar,
  // argTypes: {
  //   children: {
  //     control: {
  //       type: 'text',
  //     },
  //   },
  // },
  // parameters: {
  //   controls: { expanded: true },
  // },
};

export default meta;

const appointments = [
  { start: new Date(2021, 3, 21, 12, 0, 0), end: new Date(2021, 3, 21, 14, 30, 0), title: 'Ap. 1' },
  { start: new Date(2021, 3, 25, 10, 0, 0), end: new Date(2021, 3, 25, 17, 15, 0), title: 'Ap. 1' },
];

const Template: Story<{}> = () => (
  <Calendar initialDate={appointments[0].start} defaultView="week">
    <div style={{ border: '1px solid #F2F2F2', padding: '0.5rem' }}>
      <CalendarBody style={{ border: '1px solid #F2F2F2' }}>
        <Grid style={{ borderBottom: '1px solid #F2F2F2', borderRight: '1px solid #F2F2F2' }} />
        {appointments.map(app => (
          <Appointment start={app.start} end={app.end}>
            {app.title}
          </Appointment>
        ))}
      </CalendarBody>
    </div>
  </Calendar>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
