-- DropForeignKey
ALTER TABLE "public"."VideoState" DROP CONSTRAINT "VideoState_roomId_fkey";

-- AddForeignKey
ALTER TABLE "public"."VideoState" ADD CONSTRAINT "VideoState_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
