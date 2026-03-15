-- Rename table (preserves all data)
ALTER TABLE "projectAssignments" RENAME TO "ProjectAllocations";

-- Rename primary key constraint
ALTER TABLE "ProjectAllocations" RENAME CONSTRAINT "projectAssignments_pkey" TO "ProjectAllocations_pkey";

-- Rename unique index
ALTER INDEX "projectAssignments_projectId_studentId_key" RENAME TO "ProjectAllocations_projectId_studentId_key";

-- Rename foreign key constraints
ALTER TABLE "ProjectAllocations" RENAME CONSTRAINT "projectAssignments_projectId_fkey" TO "ProjectAllocations_projectId_fkey";
ALTER TABLE "ProjectAllocations" RENAME CONSTRAINT "projectAssignments_studentId_fkey" TO "ProjectAllocations_studentId_fkey";
