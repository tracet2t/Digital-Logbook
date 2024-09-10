-- CreateTable
CREATE TABLE "mentoractivities" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "workingHours" INTEGER NOT NULL,
    "activities" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentoractivities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mentoractivities" ADD CONSTRAINT "mentoractivities_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
