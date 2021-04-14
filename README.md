# React Hooks Calendar

React Hooks Calendar is a library of React components and hooks to display calendar views.

## Project Goals

In the React ecosystem, we see a new generation of component libraries and styling solutions emerge.
These solutions focus heavily on customization.
Projects like [tailwindlabs/headlessui](https://github.com/tailwindlabs/headlessui) give the styling control back to the user.
Components in this project want to allow a similar experience for calendar views.

## Features and Goals

- Stylable with modern styling solutions (styled-components, emotion, tailwind-css, chakra-ui, css-modules, ...)
- React Hooks
- No/minimal CSS (for now inline everything)
- Skeleton; not UI
- Different views: "day" view, "three-day" view, "week" view
- Lightweight date function library: `date-fns`
- `Intl` for internationalisation

## API Ideas

```tsx
import { Calendar, CalendarBody, GridCells, Appointment } from 'react-simple-calendar';

const appointments = [
  { start: new Date(2021, 3, 21, 12, 0, 0), end: new Date(2021, 3, 21, 14, 30, 0), title: 'Ap. 1' },
  { start: new Date(2021, 3, 25, 10, 0, 0), end: new Date(2021, 3, 25, 17, 15, 0), title: 'Ap. 1' },
];

function MyCalendar() {
  return (
    <Calendar view="week" timeStart="8:00" timeEnd="20:00">
      <CalendarBody>
        <GridCells className="border-gray border-bottom-1px" />
        {appointments.map(appointment => (
          <Appointment
            start={appointment.start}
            end={appointment.end}
            className="bg-blue-300 rounded-md"
          >
            <div className="text-bold">{appointment.title}</div>
          </Appointment>
        ))}
      </CalendarBody>
    </Calendar>
  );
}
```
