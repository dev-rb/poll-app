/*
  Warnings:

  - You are about to drop the column `timeLimit` on the `Poll` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Poll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalVotes` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "timeLimit",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalVotes" INTEGER NOT NULL;
