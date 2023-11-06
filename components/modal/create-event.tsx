"use client";

import { toast } from "sonner";
import { createEvent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";
import { Organization } from "@prisma/client";
import FormButton from "./form-button";

export default function CreateEventModal({
  organization,
}: {
  organization: Organization;
}) {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    name: "",
    description: "",
    path: "",
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      path: prev.name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, "-"),
    }));
  }, [data.name]);

  return (
    <form
      action={async (data: FormData) =>
        createEvent({
          name: data.get("name") as string,
          description: data.get("description") as string,
          path: data.get("path") as string,
          organizationId: organization.id,
        }).then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Created Event");
            const { path } = res;
            router.refresh();
            router.push(`/city/${organization.subdomain}/events/${path}`);
            modal?.hide();
            toast.success(`Successfully created Event!`);
          }
        })
      }
      className="w-full rounded-md bg-white dark:bg-gray-900 md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
    >
      <div className="m.d:p-10 relative flex flex-col space-y-4 p-5">
        <h2 className="font-cal text-2xl dark:text-white">
          Create a new event
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-gray-500 text-sm font-medium dark:text-gray-400"
          >
            Event Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="My Awesome Event"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="path"
            className="text-gray-500 text-sm font-medium"
          >
            SEO Optimized Path
          </label>
          <div className="flex w-full max-w-md">
            <div className="flex items-center rounded-r-lg border border-l-0 border-gray-200 bg-gray-100 px-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {organization.subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}/
            </div>
            <input
              name="path"
              type="text"
              placeholder="path"
              value={data.path}
              onChange={(e) => setData({ ...data, path: e.target.value })}
              autoCapitalize="off"
              pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
              maxLength={32}
              required
              className="w-full rounded-l-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-gray-500 text-sm font-medium"
          >
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description about why my city is so awesome"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            maxLength={140}
            rows={3}
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900  focus:outline-none focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 md:px-10">
        <FormButton text={"Create Event"} />
      </div>
    </form>
  );
}
