"use client";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";

export function EventListItemDate({
  startingAt,
}: {
  startingAt: Date;
}) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDate = utcToZonedTime(startingAt, timeZone);
  return (
    <div className="mb-3 space-x-2">
      <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        {formatInTimeZone(zonedDate, timeZone, "MMM d, yyyy")}
      </span>
      <span className="font-medium text-gray-750 dark:text-gray-250">
        {formatInTimeZone(zonedDate, timeZone, "EEEE")}
      </span>
    </div>
  );
}

export function EventListItemTime({
  startingAt,
}: {
  startingAt: Date;
}) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDate = utcToZonedTime(startingAt, timeZone);
  return (
<span className="text-sm">{formatInTimeZone(zonedDate, timeZone, "h:mm a")}</span>
  );
}