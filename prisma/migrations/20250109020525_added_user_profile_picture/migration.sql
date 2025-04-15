/*
  Warnings:

  - You are about to drop the `requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_senderId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ProfilePicture" TEXT;

-- DropTable
DROP TABLE "requests";
