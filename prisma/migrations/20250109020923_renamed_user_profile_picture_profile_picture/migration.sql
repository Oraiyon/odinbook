/*
  Warnings:

  - You are about to drop the column `ProfilePicture` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "ProfilePicture",
ADD COLUMN     "profilePicture" TEXT;
