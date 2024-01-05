import { Event, Organization, Place } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import OpenModalButton from "./open-modal-button";
import CreateEventModal from "./modal/create-event";
import prisma from "@/lib/prisma";
import EventListItem from "./event-list-item";

export default async function EventSubEvents({
  event,
  org,
  places,
  userIsHost,
}: {
  event: Event;
  org: Organization;
  places: Place[];
  userIsHost: boolean;
}) {
  const subevents = await prisma.event.findMany({
    where: {
      parentId: event.id,
    },
    include: {
      organization: {
        select: {
          subdomain: true,
          image: true,
        },
      },
      eventRole: {
        select: {
          role: {
            select: {
              id: true,
              image: true,
              name: true,
              userRoles: {
                select: {
                  user: {
                    select: {
                      id: true,
                      image: true,
                      name: true,
                      username: true,
                      ens_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      startingAt: "asc",
    },
  });

  if (!subevents && !userIsHost) {
    return <div />;
  }

  return (
    <div>
      <CardHeader>
        <CardTitle>Happening During {event.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {userIsHost && (
          <div>
            <OpenModalButton
              text="Host Sub Event"
              variant={"outline"}
              size={"sm"}
            >
              <CreateEventModal
                organization={org}
                places={places}
                parentEvent={event}
                redirectBaseUrl={"/"}
              />
            </OpenModalButton>
          </div>
        )}
        <div className="my-3 w-full space-y-5">
          {subevents.map((event) => {
            return (
              <EventListItem
                href={`/${event.path}`}
                key={event.id}
                event={event}
              />
            );
          })}
        </div>
      </CardContent>
    </div>
  );
}
