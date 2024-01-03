-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "address1" TEXT,
ADD COLUMN     "address2" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
