// services/dashboard.service.ts

import redis from "@/lib/redis";
import { AppError, getactiveflagrepodata } from "../repository/getactiveflag.repo";

const VALID_ENVS = ["DEVELOPMENT", "STAGING", "PRODUCTION"];

type Variation = {
  id: string;
  value: unknown; // supports boolean | string | number | object
  weight: number;
};

type Rule = {
  attribute: string;
  operator: string;
  value: unknown;
  variationId: string;
  priority: number;
};

type FeatureFlagData = {
  key: string;
lifecycle: string;
createdAt: Date;
createdBy: {
  name: string;
  email: string;
};
  featureFlagVariation: {
    id: string;
    value: unknown;
    weight: number | null;
  }[];

  targetingRule: {
    attribute: string;
    operator: string;
    value: unknown;
    variationId: string;
    priority: number;
  }[];
};

type EnvironmentData = {
  enabled: boolean;
  rollout: number | null;
};

type CompiledFlag = {
  flagKey: string;
  enabled: boolean;
  rollout: number;
  lifecycle: string;
  createdAt: Date;
  createdBy: string;
  variations: Variation[];
  totalWeight: number;

  rules: Omit<Rule, "priority">[];

  defaultVariationId: string | null;
};

export function buildCompiledFlag(
  data: FeatureFlagData,
  envData: { enabled: boolean; rollout: number | null }
): CompiledFlag {

  const rules = (data.targetingRule ?? [])
    .sort((a, b) => a.priority - b.priority)
    .map((rule): Omit<Rule, "priority"> => ({
      attribute: rule.attribute,
      operator: rule.operator,
      value: rule.value,
      variationId: rule.variationId
    }));

  const variations: Variation[] = (data.featureFlagVariation ?? []).map(v => ({
    id: v.id,
    value: v.value,
    weight: v.weight ?? 0
  }));

  const totalWeight = variations.reduce((sum, v) => sum + v.weight, 0);

  return {
    flagKey: data.key,
    lifecycle: data.lifecycle,
    enabled: envData.enabled,
    rollout: envData.rollout ?? 0,
    createdAt: data.createdAt,
    createdBy: data.createdBy?.name || "Unknown",
    variations,
    totalWeight,

    rules,

    defaultVariationId: variations.length > 0 ? variations[0].id : null
  };
}
export async function getActiveFlagService(flagId: string, env: string) {
  if (!flagId) throw new AppError("Flag ID is required", 400);
  if (!env) throw new AppError("Environment is required", 400);

  const envUpper = env.toUpperCase();

  if (!VALID_ENVS.includes(envUpper)) {
    throw new AppError("Invalid environment", 400);
  }

  // 1. Fetch from DB (needed for version anyway)
  const data = await getactiveflagrepodata(flagId);

  if (!data) throw new AppError("Flag not found", 404);

  const envData = data.environments.find(
    (e) => e.environment.type === envUpper
  );

  if (!envData) {
    throw new AppError("Environment config not found", 404);
  }

  // 2. Versioned cache key
  const cacheKey = `flag:${flagId}:${envUpper}`;

  // 3. Redis fast path
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.warn("Redis read failed:", err);
  }

  // 4. Build compiled flag
  const compiled = buildCompiledFlag(data, envData);

  // 5. Cache it
  try {
    await redis.set(cacheKey, JSON.stringify(compiled), "EX", 120);
  } catch (err) {
    console.warn("Redis write failed:", err);
  }

  return compiled;
}