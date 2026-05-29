-- CreateTable
CREATE TABLE "sharedProfiles" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "sharedProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sharedProfiles_studentId_key" ON "sharedProfiles"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "sharedProfiles_token_key" ON "sharedProfiles"("token");

-- AddForeignKey
ALTER TABLE "sharedProfiles" ADD CONSTRAINT "sharedProfiles_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
