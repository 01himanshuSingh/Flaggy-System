/*
  Warnings:

  - You are about to drop the column `defaultValue` on the `FeatureFlag` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `FeatureFlag` table. All the data in the column will be lost.
  - You are about to drop the column `environmentId` on the `FeatureFlag` table. All the data in the column will be lost.
  - You are about to drop the column `flagId` on the `FeatureFlagVersion` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `FeatureFlagVersion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key,projectId]` on the table `FeatureFlag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[featureFlagId,version]` on the table `FeatureFlagVersion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `valueType` to the `FeatureFlag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `featureFlagId` to the `FeatureFlagVersion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snapshot` to the `FeatureFlagVersion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `FeatureFlagVersion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FeatureFlag" DROP CONSTRAINT "FeatureFlag_environmentId_fkey";

-- DropForeignKey
ALTER TABLE "FeatureFlagVersion" DROP CONSTRAINT "FeatureFlagVersion_flagId_fkey";

-- DropIndex
DROP INDEX "FeatureFlag_key_environmentId_key";

-- AlterTable
ALTER TABLE "FeatureFlag" DROP COLUMN "defaultValue",
DROP COLUMN "enabled",
DROP COLUMN "environmentId",
ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "valueType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FeatureFlagVersion" DROP COLUMN "flagId",
DROP COLUMN "value",
ADD COLUMN     "featureFlagId" TEXT NOT NULL,
ADD COLUMN     "snapshot" JSONB NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FeatureFlagEnvironment" (
    "id" TEXT NOT NULL,
    "featureFlagId" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "value" JSONB,
    "rollout" INTEGER,
    "rules" JSONB,
    "schedule" JSONB,

    CONSTRAINT "FeatureFlagEnvironment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureExperiment" (
    "id" TEXT NOT NULL,
    "featureFlagId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variants" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FeatureExperiment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlagEnvironment_featureFlagId_environmentId_key" ON "FeatureFlagEnvironment"("featureFlagId", "environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_key_projectId_key" ON "FeatureFlag"("key", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlagVersion_featureFlagId_version_key" ON "FeatureFlagVersion"("featureFlagId", "version");

-- AddForeignKey
ALTER TABLE "FeatureFlagEnvironment" ADD CONSTRAINT "FeatureFlagEnvironment_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES "FeatureFlag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureFlagEnvironment" ADD CONSTRAINT "FeatureFlagEnvironment_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureFlagVersion" ADD CONSTRAINT "FeatureFlagVersion_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES "FeatureFlag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureExperiment" ADD CONSTRAINT "FeatureExperiment_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES "FeatureFlag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
