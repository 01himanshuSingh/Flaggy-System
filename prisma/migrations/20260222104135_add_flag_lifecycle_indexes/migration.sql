/*
  Warnings:

  - Added the required column `createdById` to the `FeatureFlag` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FeatureLifecycle" AS ENUM ('draft', 'active', 'deprecated', 'archived');

-- AlterTable
ALTER TABLE "FeatureFlag" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "lifecycle" "FeatureLifecycle" NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE INDEX "FeatureFlag_projectId_idx" ON "FeatureFlag"("projectId");

-- CreateIndex
CREATE INDEX "FeatureFlag_createdById_idx" ON "FeatureFlag"("createdById");

-- CreateIndex
CREATE INDEX "FeatureFlag_projectId_archived_idx" ON "FeatureFlag"("projectId", "archived");

-- AddForeignKey
ALTER TABLE "FeatureFlag" ADD CONSTRAINT "FeatureFlag_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
