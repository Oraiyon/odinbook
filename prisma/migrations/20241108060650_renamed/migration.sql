/*
  Warnings:

  - You are about to drop the column `commentId` on the `replies` table. All the data in the column will be lost.
  - Added the required column `replyToId` to the `replies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_commentId_fkey";

-- AlterTable
ALTER TABLE "replies" DROP COLUMN "commentId",
ADD COLUMN     "replyToId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
