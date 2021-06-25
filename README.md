# React Hook Calendar

React Hook Calendar is a library of React components and hooks to display calendar views.
React Hook Calendar manages the logic and calculations of the calendar while the developer can freely style every aspect of it.

- [Features](#features)
- [Getting Started](#getting-started)
- [Example](#example)
- [Architecture](#architecture)
- [Documentation](#documentation)
  - [`<Calendar />`](#calendar)
  - [`useCalendar()`](#usecalendar)
  - [`<CalendarHeader />`](#calendarheader)
  - [`<CalendarBody />`](#calendarbody)
  - [`<CalendarGrid />`](#calendargrid)
  - [`<Appointment />`](#appointment)
  - [`useAppointment()`](#useappointment)
- [Contributing](#contributing)

## Features

- Stylable with modern styling solutions (styled-components, emotion, tailwind-css, chakra-ui, css-modules, ...)
- React Hooks and components for complete individualisation
- TypeScript
- No/minimal CSS (for now inline everything)
- 100% tree-shakable, use only the parts that you need
- Different views: "day" view, "week" view, more coming soon
- Lightweight date function library: `date-fns`

## Getting Started

Install React Hook Calendar via NPM.
React Hook Calendar requires React 16 or higher as a peer dependency.

```
npm install react-hook-calendar
```

## Example

This is a basic example, check out the `example` folder for a complete Chakra UI example!

```tsx
import {
  Calendar,
  CalendarBody,
  CalendarHeader,
  CalendarGrid,
  Appointment,
  useCalendar,
} from 'react-hook-calendar';

// Your calendar would probably take these through props in the real world
const appointments = [
  { start: new Date(2021, 3, 21, 12, 0, 0), end: new Date(2021, 3, 21, 14, 30, 0), title: 'Ap. 1' },
  { start: new Date(2021, 3, 25, 10, 0, 0), end: new Date(2021, 3, 25, 17, 15, 0), title: 'Ap. 1' },
];

function MyCalendar() {
  return (
    <Calendar
      view="week"
      timeStart="8:00"
      timeEnd="20:00"
      className="bg-white rounded-md border border-gray-100" // some pseudo tailwind classes
    >
      {/*Our Custom Component defined below*/}
      <TodayButton />
      <CalendarHeader>
        {({ date }) => (
          <div className="flex justify-center items-center">
            <div className="text-2xl">{date.getDate()}</div>
            <div className="text-gray-800">
              {Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date)}
            </div>
          </div>
        )}
      </CalendarHeader>
      <CalendarBody>
        <CalendarGrid className="border-gray-100 border-t border-l" />
        {appointments.map(appointment => (
          <Appointment
            start={appointment.start}
            end={appointment.end}
            className="bg-blue-500 rounded-md"
          >
            <div className="text-bold text-white">{appointment.title}</div>
          </Appointment>
        ))}
      </CalendarBody>
    </Calendar>
  );
}

// You can use the hooks to build components that interact with the calendar
function TodayButton() {
  const { setDate } = useCalendar();

  return (
    <button className="rounded-md bg-blue-500 text-white" onClick={() => setDate(new Date())}>
      Today
    </button>
  );
}
```

## Architecture

React Hook Calendar uses hooks and React Context to pass down data to elements.
It is inspired by libraries like [React Hook Form](https://github.com/react-hook-form/react-hook-form), [Chakra UI](https://chakra-ui.com)'s Form Control, Tailwind's [headless UI](https://github.com/tailwindlabs/headlessui).
Othen than in more well known applications of React Context, the context provider is not used at the root level but
The `Calendar` component makes the calendar context available to all (nested) child elements.
This allows us to make use of the other components in the package and even build complete custum control elements.

React Hook Calendar uses CSS Grid to draw the `CalendarBody` and place appointments within this body accordingly.

While I find this approach particular fun, as it gives full control to the developer, it also comes with a few challenges:
Specific edge cases must be handled by the developer, namely things that relate to appointment rendering.
Appointments can overlap, span over multiple days or be only partly displayed because a part of them is outside of the current view.
These edge cases might not be part of all applications of this library, but many might face at least some variation of this problem.

## Documentation

### `<Calendar />`

The `Calendar` component creates a new calendar context and handles the calendar state management.
The calendar context can be consumed via the [`useCalendar()`](#useCalendar) hook.

| Property     | Default      | Description                                                                      |
| ------------ | ------------ | -------------------------------------------------------------------------------- |
| defaultView  | `week`       | The view that the calendar should use. This can be changed with                  |
| initialDate  | `new Date()` | A date that should be shown at the start. Defaults to today.                     |
| children     | `null`       | All the elements within the calendar that might consume the calendar context.    |
| timeStart    | `'0:00'`     | Start the calendar body at this time.                                            |
| timeEnd      | `'24:00'`    | End the calendar body at this time.                                              |
| weekStartsOn | `0`          | Configure the day, that the week should start on. `0` is Sunday (see `date-fns`) |

### `useCalendar()`

This hook exposes the calendar state (such as the current view, the current date, the view period, ...) and useful control functions.

| Value      | Type                             | Description                                                |
| ---------- | -------------------------------- | ---------------------------------------------------------- |
| date       | `Date`                           | Current focus date, will always be within the `viewPeriod` |
| view       | `CalendarView`                   | Current view (enum: `'day' \| 'week'`)                     |
| viewPeriod | `{ start: Date, end: Date }`     | Currently shown period (calculated from `date` and `view`) |
| viewTimes  | `{ start: number; end: number }` | `timeStart` and `timeEnd` translated to numbers            |
| setDate    | `(date: Date) => void`           | Set the focus date, useful for jumping to a day or week    |
| setView    | `(view: CalendarView) => void`   |                                                            |
| goForward  | `() => void`                     | Add a view period (e.g. a week) to the focus date          |
| goBackward | `() => void`                     | Subtract a view period (e.g. a week) from the focus date   |

### `<CalendarHeader />`

Calls the function provided as `children` property for each day in the current view and renders the result within a grid that is similar to the `CalendarBody` grid.
This component must be rendered within a `Calendar` component as it uses the calendar context.
See the examples for more context.

| Propery   | Type                                         | Description                                                      |
| --------- | -------------------------------------------- | ---------------------------------------------------------------- |
| children  | `(options: CalendarHeaderInfo) => ReactNode` | This function is called for every header cell                    |
| className | `string`                                     | Optional CSS class names for the header (not for the cells)      |
| style     | `CSSProperties`                              | Optional CSS style properties for the header (not for the cells) |

### `<CalendarBody />`

Creates a CSS grid based on the current view and start and end times.
Each 15 minute slot withing the `viewPeriod` receives a grid cell so that `Appointment`s and other elements can be rendered as direct children (or within a `Fragment`) of this grid and will be placed within an appropropriate time slot.
This component must be rendered within a `Calendar` component as it uses the calendar context.

| Propery   | Type            | Description                                                      |
| --------- | --------------- | ---------------------------------------------------------------- |
| children  | `ReactNode`     | `Appointment`, `CalendarGrid`, etc. must be direct children      |
| className | `string`        | Optional CSS class names for the header (not for the cells)      |
| style     | `CSSProperties` | Optional CSS style properties for the header (not for the cells) |

### `<CalendarGrid />`

Creates a **visual** time grid based on the current view and start and end times.
The length of each grid box can be configured via the `length` property.
Valid values for the `legth` are the strings `30 minutes`, `1 hour`, `2 hours` and `4 hours`.
This component must be rendered within a `CalendarBody` component.

| Propery   | Type            | Description                                          |
| --------- | --------------- | ---------------------------------------------------- |
| length    | `GridLength`    | Determine the length of each grid cell               |
| children  | `ReactNode`     | Render any element you want inside of each grid item |
| className | `string`        | Optional CSS class names for each grid item          |
| style     | `CSSProperties` | Optional CSS style properties for each grid item     |

### `<Appointment />`

This component renders a simple single appointment to the calendar, if the appointment is within the view period.
If the appointment is outside of the view period, this component will simply return null, so there is no need to filter out appointments first.
This component must be rendered within a `CalendarBody` component.

| Propery   | Type                       | Description                                                                                         |
| --------- | -------------------------- | --------------------------------------------------------------------------------------------------- |
| start     | `Date \| number \| string` | The start of the appointment either as JS `Date`, timestamp, or ISO formatted date (e.g. from JSON) |
| end       | `Date \| number \| string` | The end of the appointment either as JS `Date`, timestamp, or ISO formatted date (e.g. from JSON)   |
| children  | `ReactNode`                | Render any element you want inside of the appointment                                               |
| className | `string`                   | Optional CSS class names for the header (not for the cells)                                         |
| style     | `CSSProperties`            | Optional CSS style properties for the header (not for the cells)                                    |

### `useAppointment()`

Hook that implements the logic of the `Appointment` component.
This is useful, if you want to build your own component for appointments.
Make sure to hand over the `style` value to your wrapping element.

| Value    | Type                         | Description                                                            |
| -------- | ---------------------------- | ---------------------------------------------------------------------- |
| style    | `CSSProperties`              | Pass this style object down to your wrapping component                 |
| inView   | `boolean`                    | If the appointment is in the current `viewPeriod` returns true         |
| interval | `{ start: Date; end: Date }` | The parsed start and end times (so you don't have to parse them again) |

**Example**

```tsx
type AppointmentProps = {
  start: Date | number | string;
  end: Date | number | string;
  title: string;
};

function Appointment(props: AppointmentProps) {
  const { style, inView, interval } = useAppointment(props);
  if (!inView) {
    return null;
  }
  return (
    <div style={style}>
      <div>
        {format(interval.start, 'HH:mm')} - {format(interval.end, 'HH:mm')}
      </div>
      <div>{props.title}</div>
    </div>
  );
}
```

## Contributing

Please feel free to contribute in any way you want.
Contributing can be as simple as giving feedback in the issues, updating documentation or writing your own posts, that can be linked in the README.
Of course you are also welcome to propose changes via the issues or pull requests.
