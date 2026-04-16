-- CreateTable
CREATE TABLE "warningStatuses" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "warningType" TEXT,

    CONSTRAINT "warningStatuses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "warningStatuses" ADD CONSTRAINT "warningStatuses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
