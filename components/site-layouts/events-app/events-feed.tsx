import EventList from "@/components/event-list";
import CreateEventModal from "@/components/modal/create-event";
import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { getSiteData } from "@/lib/fetchers";
import { getSubdomainFromDomain } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PlusCircleIcon } from "lucide-react";

export default async function EventsFeed({ domain }: { domain: string }) {
  const [org, orgPlaces] = await Promise.all([
    getSiteData(domain),
    prisma.place.findMany({
      where: {
        organization: {
          subdomain: getSubdomainFromDomain(domain),
        },
      },
    }),
  ]);

  if (!org) {
    return notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl pb-20">
      <div className="flex items-center justify-between px-5">
        <h4 className="mb-3 mt-3 font-bold tracking-tight text-gray-750 md:my-5 md:text-lg dark:text-gray-400 ">
          {"Events"}
        </h4>
        <ResponsiveDialog
          Trigger={
            <Button size={'sm'}>
              <PlusCircleIcon className="h-4 w-4" />{" "}
              <span className="px-2">Create Event</span>
            </Button>
          }
        >
          <CreateEventModal
            organization={org}
            places={orgPlaces}
            redirectBaseUrl={"/"}
          />
        </ResponsiveDialog>
      </div>
      <EventList domain={domain} upcoming />
    </div>
  );
}
