import { getUsersWithRoleInOrganization } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import OrgTableCard from "@/components/data-tables/org/card";
import NotFoundCity from "../not-found";
import prisma from "@/lib/prisma";

export default async function PeoplePage({
  params,
}: {
  params: { subdomain: string };
}) {
  const session = await getSession();
  if (!session?.user.id) {
    return (
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          You need to be logged in to view this page.
        </h1>
      </div>
    );
  }
  const [{ usersWithRoles }, org, uniqueRoles] = await Promise.all([
    getUsersWithRoleInOrganization(params.subdomain),
    prisma.organization.findUnique({
      where: {
        subdomain: params.subdomain,
      },
    }),
    prisma.organizationRole.findMany({
      where: {
        organization: {
          subdomain: params.subdomain,
        },
      },
      include: {
        role: true,
      }
    }).then((orgRoles) => orgRoles.map(({ role }) => role)),
  ]);

  if (!org) {
    return <NotFoundCity />;
  }

  return (
    <div className="h-full flex-1 flex-col md:flex md:p-8">
      <div className="flex items-center justify-between space-y-2"></div>
      <OrgTableCard
        users={Object.values(usersWithRoles)}
        roles={uniqueRoles}
        organization={org}
      />
    </div>
  );
}
