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
import ResponsiveDialog from "./responsive-dialog";
import { Button } from "./ui/button";

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

  const orgPlaces = await prisma.place.findMany({
    where: {
      organizationId: org.id
    }
  })

  if (!subevents && !userIsHost) {
    return <div />;
  }

  return (
    <div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Events</CardTitle>
          <ResponsiveDialog
            Trigger={
              <Button variant={"outline"} size={"sm"}>
                Host Sub Event
              </Button>
            }
          >
            <CreateEventModal
              organization={org}
              places={orgPlaces}
              parentEvent={event}
              redirectBaseUrl={"/"}
            />
          </ResponsiveDialog>
        </div>
      </CardHeader>
      <CardContent>
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
