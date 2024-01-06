"use client"
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";

export default function EventPageTimeDisplay({
  startingAt,
  endingAt,
}: {
  startingAt: Date;
  endingAt: Date;
}) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedStartingAtDate = utcToZonedTime(startingAt, timeZone);
  const zonedEndingAtDate = utcToZonedTime(endingAt, timeZone);

  return (
    <div className="my-0">
      <div className="space-x-2">
        <span className="text-md font-semibold tracking-tight text-gray-900 lg:text-lg dark:text-gray-100">
          {formatInTimeZone(zonedStartingAtDate, timeZone, "EEEE, MMMM d, yyyy")}
        </span>
      </div>
      <div className="lg:text-md text-sm font-medium text-gray-750 dark:text-gray-250">
        {formatInTimeZone(zonedEndingAtDate, timeZone, "h:mm a")} to{" "}
        {formatInTimeZone(zonedEndingAtDate, timeZone, "MMM d, h:mm a zzz")}{" "}
      </div>
    </div>
  );
}
