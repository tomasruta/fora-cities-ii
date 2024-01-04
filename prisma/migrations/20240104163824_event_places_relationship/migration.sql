-- CreateTable
CREATE TABLE "EventPlace" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "EventPlace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventPlace_eventId_placeId_key" ON "EventPlace"("eventId", "placeId");

-- AddForeignKey
ALTER TABLE "EventPlace" ADD CONSTRAINT "EventPlace_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPlace" ADD CONSTRAINT "EventPlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
