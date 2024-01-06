import Link from "next/link";
import { format } from "date-fns";
import EventListItemImage from "./event-list-item-image";
import { EventFeedEvent, uniqueHosts } from "./event-list";
import { HostedByInline } from "./event-page";
import { utcToZonedTime } from "date-fns-tz";

export default function EventListItem({
  event,
  href,
  showAnalytics = false,
}: {
  event: EventFeedEvent;
  href?: string;
  showAnalytics?: boolean;
}) {
  if (!event.startingAt) {
    return null;
  }
  const url = `${event.organization.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/events/${event.path}`;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDate = utcToZonedTime(event.startingAt, timeZone);
  console.log('zonedDate', zonedDate)
  console.log('startingAt', event.startingAt)
  const hosts = uniqueHosts(event);
  return (
    <div className="w-full">
      <div className="mb-3 space-x-2">
        <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {format(zonedDate, "MMM d, yyyy")}
        </span>
        <span className="font-medium text-gray-750 dark:text-gray-250">
          {format(zonedDate, "EEEE")}
        </span>
      </div>
      <Link
        href={
          href || `/city/${event.organization.subdomain}/events/${event.path}`
        }
      >
        <div className="relative flex  rounded-2xl border border-gray-200 shadow-md  transition-all hover:shadow-xl md:flex-row dark:border-gray-700 dark:hover:border-white">
          <div className="flex flex-col flex-1 border-gray-200 text-wrap  py-3 pl-3 dark:border-gray-700">
            <span className="text-sm">{format(zonedDate, "h:mm a")}</span>
            <h3 className="mb-2 text-md md:text-lg font-medium tracking-wide text-gray-800 dark:text-gray-200">
              {event.name}
            </h3>

            <HostedByInline
              users={Object.values(hosts).map((eventHost) => eventHost)}
            />

            {/* <p className="mb-2 line-clamp-2 text-sm font-normal leading-snug text-gray-650 dark:text-gray-350">
              {event.description}
            </p> */}
          </div>

          <div className="p-3">
            <EventListItemImage
              alt={event.name ?? "Card thumbnail"}
              src={
                event.image
                  ? event.image
                  : event.organization.image
                  ? event.organization.image
                  : "/placeholder.png"
              }
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
