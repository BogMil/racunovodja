export function daysInMonth(iMonth: number, iYear: number) {
  return new Date(iYear, iMonth, 0).getDate();
}

export function isWeekday(year: number, month: number, day: number) {
  var dayOfWeek = new Date(year, month - 1, day).getDay();
  return dayOfWeek != 0 && dayOfWeek != 6;
}

export function getBusinesDaysInMonth(month: number, year: number) {
  var days = daysInMonth(month, year);

  var weekdays = 0;
  for (var i = 1; i <= days; i++) {
    if (isWeekday(year, month, i)) weekdays++;
  }
  return weekdays;
}
