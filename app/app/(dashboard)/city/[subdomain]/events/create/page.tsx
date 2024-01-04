import CreateEventModal from "@/components/modal/create-event";
import prisma from "@/lib/prisma";
import NotFoundSite from "../../not-found";

export default async function AllEvents({
  params,
}: {
  params: { subdomain: string };
}) {
  const [organization, places] = await Promise.all([prisma.organization.findUnique({
    where: {
      subdomain: params.subdomain,
    },
  }), prisma.place.findMany({
    where: {
      organization: {
        subdomain: params.subdomain,
      }
    }
  })]);



  if (!organization) {
    return <NotFoundSite />;
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-20 md:p-8">
        <CreateEventModal organization={organization} places={places} />
    </div>
  );
}
