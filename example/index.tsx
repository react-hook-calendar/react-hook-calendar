import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  Box,
  Button,
  Center,
  ChakraProvider,
  CSSReset,
  Grid as ChakraGrid,
  Flex,
  HStack,
  IconButton,
  Select,
  Text,
  VStack,
  GridItem,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  addDays,
  differenceInMinutes,
  format,
  getDate,
  setHours,
  setMinutes,
  startOfWeek,
} from 'date-fns';
import { Calendar, CalendarBody, CalendarHeader, Grid, useAppointment, useCalendar } from '../';

const timezoneOffset = new Date().getTimezoneOffset() / -60;

const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
const appointments = [
  {
    title: 'Lunch with Max',
    color: 'purple',
    start: setMinutes(setHours(monday, 12), 0),
    end: setMinutes(setHours(monday, 13), 0),
  },
  {
    title: 'Weekly Team Meeting',
    color: 'blue',
    start: setMinutes(setHours(monday, 13), 0),
    end: setMinutes(setHours(monday, 14), 30),
  },
  {
    title: 'Day Off',
    color: 'blue',
    start: setMinutes(setHours(addDays(monday, 4), 0), 0),
    end: setMinutes(setHours(addDays(monday, 4), 23), 59),
  },
  {
    title: 'Go over sales',
    color: 'blue',
    start: setMinutes(setHours(addDays(monday, 2), 9), 0),
    end: setMinutes(setHours(addDays(monday, 2), 12), 0),
  },
  {
    title: 'Pick up the kids',
    color: 'green',
    start: setMinutes(setHours(addDays(monday, 3), 18), 0),
    end: setMinutes(setHours(addDays(monday, 3), 19), 0),
  },
];

function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <Center bg="#f7f8fc" w="100%" h="100vh" p={['2', null, '4']}>
        <CustomCalendar />
      </Center>
    </ChakraProvider>
  );
}

function CustomCalendar() {
  return (
    <VStack
      as={Calendar}
      weekStartsOn={1}
      timeStart="8:00"
      timeEnd="20:00"
      maxW="1200px"
      w="100%"
      h="100%"
      spacing="8"
    >
      <Flex w="100%" justifyContent="space-between" alignItems="center">
        <TodayButton />
        <PageControl />
        <ViewControl />
      </Flex>
      <Flex flexGrow={1} direction="column" w="100%" bg="white" rounded="lg" overflow="hidden">
        <Flex borderColor="blue.600" borderBottomWidth="2px">
          <Center w="20" flexShrink={0} color="gray.500" fontSize="0.875rem">
            GMT{timezoneOffset < 0 ? timezoneOffset : `+${timezoneOffset}`}
          </Center>
          <Box as={CalendarHeader} flexGrow={1}>
            {({ date }) => (
              <Center h="20" flexDirection="column" borderLeft="1px" borderColor="gray.100">
                <Box fontSize="3xl">{getDate(date)}</Box>
                <Box frontSize="md" color="blackAlpha.700" mt="-0.5em">
                  {Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date)}
                </Box>
              </Center>
            )}
          </Box>
        </Flex>
        <Flex direction="row" flexGrow={1}>
          <Box flexShrink={0} w="20">
            <TimeLegend />
          </Box>
          <Box h="100%" flexGrow={1} as={CalendarBody}>
            <Box
              as={Grid}
              length="1 hour"
              borderTopWidth="1px"
              borderLeftWidth="1px"
              borderColor="gray.100"
            />
            {appointments.map(appointment => (
              <Appointment {...appointment} />
            ))}
          </Box>
        </Flex>
      </Flex>
    </VStack>
  );
}

function ViewControl() {
  const { view, setView } = useCalendar();
  const onChange = React.useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
    event => {
      const newValue = event.currentTarget.value;
      if (newValue === 'week' || newValue === 'day') {
        setView(newValue);
      }
    },
    [setView]
  );
  return (
    <div>
      <Select
        size="md"
        variant="filled"
        bg="white"
        fontWeight="bold"
        value={view}
        onChange={onChange}
        borderWidth="1px"
        borderColor="gray.100"
      >
        <option value="week">Week</option>
        <option value="day">Day</option>
      </Select>
    </div>
  );
}

function TodayButton() {
  const { setDate } = useCalendar();
  return (
    <Button
      bg="white"
      color="gray.900"
      borderWidth="1px"
      borderColor="gray.100"
      onClick={() => setDate(new Date())}
    >
      Today
    </Button>
  );
}

function PageControl() {
  const { viewPeriod, goBackward, goForward, view } = useCalendar();

  // Displaying the view period
  let date = format(viewPeriod.start, 'MMMM d');
  if (view === 'week') {
    date = format(viewPeriod.start, 'MMM d') + ' - ' + format(viewPeriod.end, 'MMM d');
  }
  return (
    <HStack alignItems="center">
      <IconButton
        color="gray.500"
        variant="unstyled"
        aria-label="show previous"
        icon={<ChevronLeftIcon boxSize="1.75rem" />}
        onClick={goBackward}
      />
      <Text fontSize="3xl" fontWeight="semibold">
        {date}
      </Text>
      <IconButton
        color="gray.500"
        variant="unstyled"
        aria-label="show next"
        icon={<ChevronRightIcon boxSize="1.75rem" />}
        onClick={goForward}
      />
    </HStack>
  );
}

function TimeLegend() {
  const { viewTimes } = useCalendar();
  const numHours = (viewTimes.end - viewTimes.start) / (60 * 60 * 1000);
  const startHour = viewTimes.start / (60 * 60 * 1000);
  return (
    <ChakraGrid width="100%" height="100%" templateRows={`repeat(${numHours}, 1fr)`}>
      {Array.apply(null, Array(numHours)).map((_, index) => (
        <GridItem
          rowStart={index * 1 + 1}
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-start"
          fontSize="0.75rem"
          color="gray.400"
          p="1"
          borderTopWidth="1px"
          borderColor="gray.200"
        >
          {index + startHour}:00
        </GridItem>
      ))}
    </ChakraGrid>
  );
}

function Appointment(props: { start: Date; end: Date; title: string; color: string }) {
  const { style, inView, interval } = useAppointment(props);
  if (!inView) {
    return null;
  }
  return (
    <Box style={style} px="3px" pt="2px" pb="1px">
      <Flex
        direction="column"
        fontSize="0.875em"
        rounded="md"
        bg={`${props.color}.500`}
        px="2"
        py="1"
        height="100%"
        overflow="hidden"
      >
        {differenceInMinutes(interval.end, interval.start) > 60 ? (
          [
            <Box fontWeight="600" color="white">
              {props.title}
            </Box>,
            <Box fontSize="0.75em" color="whiteAlpha.900">
              {format(interval.start, 'HH:mm')} - {format(interval.end, 'HH:mm')}
            </Box>,
          ]
        ) : (
          <Box fontWeight="600" color="white">
            {props.title}
          </Box>
        )}
      </Flex>
    </Box>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
