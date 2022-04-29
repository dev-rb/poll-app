/*
  Warnings:

  - You are about to drop the column `userId` on the `Poll` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Participant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Poll" DROP CONSTRAINT "Poll_userId_fkey";

-- DropForeignKey
ALTER TABLE "_Participant" DROP CONSTRAINT "_Participant_A_fkey";

-- DropForeignKey
ALTER TABLE "_Participant" DROP CONSTRAINT "_Participant_B_fkey";

-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_Participant";
