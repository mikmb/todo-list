import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  parseISO,
} from "date-fns";

export function dateFormatter(value) {
  return format(parseISO(value), "MM/dd/yyyy");
}
export function getToday() {
  return format(new Date(), "MM/dd/yyyy");
}

export function getTomorrow() {
  const tomorrow = addDays(new Date(), 1);
  return format(tomorrow, "MM/dd/yyyy");
}

export function isInCurrentWeek(taskDueDate) {
  const today = new Date();

  const startOfTheWeek = startOfWeek(today, { weekStartsOn: 1 });
  const endOfTheWeek = endOfWeek(today, { weekStartsOn: 1 });

  const result = isWithinInterval(taskDueDate, {
    start: startOfTheWeek,
    end: endOfTheWeek,
  });
  return result;
}
