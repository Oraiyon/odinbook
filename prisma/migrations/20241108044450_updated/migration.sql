-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_replyId_fkey";

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "replyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
