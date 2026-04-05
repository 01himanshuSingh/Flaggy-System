-- CreateTable
CREATE TABLE "TargetingRule" (
    "id" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "featureFlagId" TEXT NOT NULL,
    "attribute" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,

    CONSTRAINT "TargetingRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlagVariation" (
    "id" TEXT NOT NULL,
    "featureFlagId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "weight" INTEGER NOT NULL,

    CONSTRAINT "FeatureFlagVariation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlagEvaluationCache" (
    "id" TEXT NOT NULL,
    "featureFlagId" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlagEvaluationCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFlagAssignment" (
    "id" TEXT NOT NULL,
    "userKey" TEXT NOT NULL,
    "featureFlagId" TEXT NOT NULL,
    "variationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFlagAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationWebhook" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegrationWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlagSchedule" (
    "id" TEXT NOT NULL,
    "featureFlagId" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "enableAt" TIMESTAMP(3),
    "disableAt" TIMESTAMP(3),

    CONSTRAINT "FeatureFlagSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TargetingRule_featureFlagId_idx" ON "TargetingRule"("featureFlagId");

-- CreateIndex
CREATE INDEX "FeatureFlagVariation_featureFlagId_idx" ON "FeatureFlagVariation"("featureFlagId");

-- CreateIndex
CREATE UNIQUE INDEX "FlagEvaluationCache_featureFlagId_environmentId_key" ON "FlagEvaluationCache"("featureFlagId", "environmentId");

-- CreateIndex
CREATE INDEX "UserFlagAssignment_featureFlagId_idx" ON "UserFlagAssignment"("featureFlagId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE INDEX "FeatureFlag_projectId_createdAt_idx" ON "FeatureFlag"("projectId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "TargetingRule" ADD CONSTRAINT "TargetingRule_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES "FeatureFlag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TargetingRule" ADD CONSTRAINT "TargetingRule_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureFlagVariation" ADD CONSTRAINT "FeatureFlagVariation_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES "FeatureFlag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlagEvaluationCache" ADD CONSTRAINT "FlagEvaluationCache_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES "FeatureFlag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationWebhook" ADD CONSTRAINT "IntegrationWebhook_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureFlagSchedule" ADD CONSTRAINT "FeatureFlagSchedule_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES "FeatureFlag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
