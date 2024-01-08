"use client";

import { toast } from "sonner";
import { createEvent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { FormEvent, LabelHTMLAttributes, useEffect, useState } from "react";
import { Event, Organization, Place } from "@prisma/client";
import FormButton from "./form-button";
import { DatePicker } from "../form-builder/date-picker";
import TimePicker from "../ui/time-picker";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { revalidatePath } from "next/cache";
import { Building2Icon, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import ResponsiveDialog from "../responsive-dialog";
import CreatePlaceModal from "./create-place-form";
import { Separator } from "../ui/separator";

export function combineDateAndTime(date: Date, timeInMs: string) {
  const timeElapsed = parseInt(timeInMs);

  const hours = Math.floor(timeElapsed / (1000 * 60 * 60));
  const minutes = Math.floor(
    (timeElapsed - hours * 1000 * 60 * 60) / (1000 * 60),
  );
  const seconds = Math.floor(
    (timeElapsed - hours * 1000 * 60 * 60 - minutes * 1000 * 60) / 1000,
  );
  const milliseconds = timeElapsed % 1000;

  const combined = new Date(date);
  combined.setHours(hours);
  combined.setMinutes(minutes);
  combined.setSeconds(seconds);
  combined.setMilliseconds(milliseconds);

  console.log("combined date and time: ", combined.toISOString());
  return combined;
}

const FormLabel = (props: LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      className="text-sm font-medium text-gray-700 dark:text-gray-400"
      {...props}
    />
  );
};

export default function CreateEventModal({
  organization,
  places,
  parentEvent,
  redirectBaseUrl,
}: {
  organization: Organization;
  places: Place[];
  parentEvent?: Event;
  redirectBaseUrl?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<{
    name: string;
    description: string;
    path: string;
    startingAtDate?: Date;
    startingAtTime?: string;
    endingAtDate?: Date;
    endingAtTime?: string;
    placeId?: string;
  }>({
    name: "",
    description: "",
    path: "",
    startingAtDate: new Date(),
    startingAtTime: undefined,

    endingAtDate: new Date(),
    endingAtTime: undefined,

    placeId: undefined,
  });

  const [addPlace, setAddPlace] = useState(false);

  const [placeData, setPlaceData] = useState<{
    name: string;
    address1: string;
    address2: string;
  }>({
    name: "",
    address1: "",
    address2: "",
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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const startingAt =
      data.startingAtDate && data.startingAtTime
        ? combineDateAndTime(data.startingAtDate, data.startingAtTime)
        : new Date();

    const endingAt =
      data.endingAtDate && data.endingAtTime
        ? combineDateAndTime(data.endingAtDate, data.endingAtTime)
        : new Date();

    const name = data.name;
    const description = data.description;
    const path = data.path;
    const placeId = data.placeId;

    createEvent({
      name,
      description,
      path,
      organizationId: organization.id,
      startingAt,
      endingAt,
      placeId,
      parentEvent,
      oneTimeLocation: addPlace ? placeData : undefined,
    })
      .then((res: any) => {
        setLoading(false);
        if (res.error) {
          toast.error(res.error);
        } else {
          const { imageBlurhash, createdAt, updatedAt, ...org } = organization;
          toast.success(`Successfully created Event!`);
          revalidatePath(`/`, "page");
          if (parentEvent) {
            revalidatePath(`/${parentEvent.path}`);
          }
          router.refresh();
          router.push(
            redirectBaseUrl
              ? `${redirectBaseUrl}${res.path}`
              : `/city/${organization.subdomain}/events/${res.path}`,
          );
        }
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full rounded-md bg-white pt-10 md:max-w-lg md:border md:border-gray-200 md:pt-0 md:shadow dark:bg-gray-900 dark:md:border-gray-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-white">
          {parentEvent
            ? `Create a sub event for ${parentEvent.name}`
            : "Create a new event"}
        </h2>

        <div className="flex flex-col space-y-2">
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            name="name"
            type="text"
            placeholder="My Awesome Event"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={64}
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <FormLabel htmlFor="path">Path</FormLabel>
          <div className="flex w-full max-w-md">
            <div className="flex items-center rounded-r-lg border border-l-0 border-gray-200 bg-gray-100 px-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {organization.subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}/
            </div>
            <Input
              name="path"
              type="text"
              placeholder="path"
              value={data.path}
              onChange={(e) => setData({ ...data, path: e.target.value })}
              autoCapitalize="off"
              pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
              maxLength={6432}
              required
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <FormLabel htmlFor="description">Description</FormLabel>
          <textarea
            name="description"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            maxLength={280}
            rows={3}
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900  focus:outline-none focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-700 dark:focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <FormLabel>Location</FormLabel>

          {addPlace ? (
            <Button
              variant={"ghost"}
              type="button"
              onClick={() => {
                setAddPlace(false);
              }}
            >
              <div className="flex items-center">
                <Building2Icon className="h-4 w-4 stroke-gray-800 dark:stroke-gray-300" />
                <span className="mx-2.5">{`Use Venue Space`}</span>
              </div>
            </Button>
          ) : (
            <>
              <Select
                onValueChange={(value) => {
                  setData((prev) => ({ ...prev, placeId: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {places.map((place) => {
                    return (
                      <SelectItem key={place.id} value={place.id}>
                        {place.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Button
                variant={"ghost"}
                type="button"
                onClick={() => {
                  setAddPlace(true);
                }}
              >
                <div className="flex items-center">
                  <PlusCircle className="h-4 w-4 stroke-gray-800 dark:stroke-gray-300" />
                  <span className="mx-2.5">{`Use One-Time Location`}</span>
                </div>
              </Button>
            </>
          )}
        </div>

        {addPlace ? (
          <>
            <div className="flex flex-col space-y-2">
              <FormLabel>Location Name</FormLabel>
              <Input
                name="location_name"
                type="text"
                value={placeData.name}
                onChange={(e) =>
                  setPlaceData({ ...placeData, name: e.target.value })
                }
                maxLength={64}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <FormLabel>Location Address</FormLabel>
              <Input
                name="location_address1"
                type="text"
                value={placeData.address1}
                onChange={(e) =>
                  setPlaceData({ ...placeData, address1: e.target.value })
                }
                maxLength={64}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <FormLabel>Location Address 2</FormLabel>
              <Input
                name="location_address2"
                type="text"
                placeholder="Room, unit, number, etc."
                value={placeData.address2}
                onChange={(e) =>
                  setPlaceData({ ...placeData, address2: e.target.value })
                }
                maxLength={32}
                required
              />
            </div>
            <Separator />
          </>
        ) : (
          <Separator />
        )}

        <div className="flex flex-col space-y-2">
          <FormLabel>Starts At</FormLabel>
          <div className="flex">
            <DatePicker
              date={data.startingAtDate}
              onSelect={(date) => {
                setData((prev) => ({ ...prev, startingAtDate: date }));
              }}
            />
            <TimePicker
              value={data.startingAtTime}
              onValueChange={(value) => {
                setData((prev) => ({ ...prev, startingAtTime: value }));
              }}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <FormLabel>Ends At</FormLabel>
          <div className="flex">
            <DatePicker
              date={data.endingAtDate}
              onSelect={(date) => {
                setData((prev) => ({ ...prev, endingAtDate: date }));
              }}
            />
            <TimePicker
              value={data.endingAtTime}
              onValueChange={(value) => {
                setData((prev) => ({ ...prev, endingAtTime: value }));
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-end rounded-b-lg border-t border-gray-200 bg-gray-50 px-4 py-3 md:w-auto md:px-10 dark:border-gray-700 dark:bg-gray-800">
        <FormButton
          loading={loading}
          text={"Create Event"}
          className="w-full md:w-auto"
        />
      </div>
    </form>
  );
}
