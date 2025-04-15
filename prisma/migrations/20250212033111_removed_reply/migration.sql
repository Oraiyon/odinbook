/*
  Warnings:

  - You are about to drop the `replies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_authorId_fkey";

-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_postId_fkey";

-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_replyToId_fkey";

-- DropTable
DROP TABLE "replies";
