import CreateEventModal from "@/components/modal/create-event";
import { getSiteData } from "@/lib/fetchers";
import prisma from "@/lib/prisma";
import NotFoundCity from "@/app/app/(dashboard)/city/[subdomain]/not-found";
import { getSubdomainFromDomain } from "@/lib/utils";

export default async function AllEvents({
  params,
}: {
  params: { domain: string };
}) {
  const [organization, places] = await Promise.all([getSiteData(params.domain), prisma.place.findMany({
    where: {
      organization: {
        subdomain: getSubdomainFromDomain(params.domain),
      }
    }
  })]);

  if (!organization) {
    return <NotFoundCity />;
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-20 md:p-8">
        <CreateEventModal organization={organization} places={places}  redirectBaseUrl={'/'} />
    </div>
  );
}
