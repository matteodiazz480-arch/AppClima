/**
 * Parses a date-only string ("YYYY-MM-DD") as a local calendar date instead of UTC.
 * `new Date("YYYY-MM-DD")` parses as UTC midnight per the ES spec, which shifts to
 * the previous day once converted to a negative-offset local timezone (e.g. `getDay()`).
 */
export function parseLocalDate(dateOnly: string): Date {
  const [year, month, day] = dateOnly.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatHour(iso: string): string {
  return `${new Date(iso).getHours()}h`;
}
