-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timeLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pollId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollChoice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "votes" INTEGER NOT NULL,
    "pollId" TEXT,

    CONSTRAINT "PollChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Participant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Participant_AB_unique" ON "_Participant"("A", "B");

-- CreateIndex
CREATE INDEX "_Participant_B_index" ON "_Participant"("B");

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollChoice" ADD CONSTRAINT "PollChoice_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Participant" ADD CONSTRAINT "_Participant_A_fkey" FOREIGN KEY ("A") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Participant" ADD CONSTRAINT "_Participant_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
