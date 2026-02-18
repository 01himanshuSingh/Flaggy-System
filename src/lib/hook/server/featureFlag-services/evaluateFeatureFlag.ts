import redis from "@/lib/redis";
import { getFlagVersion } from "./getFlagVersion";
import { logEvaluation } from "@/lib/feature/evaluationLogger";
import { evaluateRollout } from "@/lib/feature/rollutPercentage";
import { getFlagConfig } from "./getFlagConfig";

type Params = {
  projectId: string;
  environmentType: "PRODUCTION" | "STAGING" | "DEVELOPMENT";
  flagKey: string;
  context?: { userId?: string };
};

export async function evaluateFeatureFlag({
  projectId,
  environmentType,
  flagKey,
  context,
}: Params): Promise<boolean> {
  try {
    /* 1️⃣ Get version */
    const version = await getFlagVersion(projectId, flagKey);

    const cacheKey = `feature:config:${projectId}:${flagKey}:${environmentType}:v${version}`;

    /* 2️⃣ Cache lookup */
    const cached = await redis.get(cacheKey);
    if (cached) {
      const result = JSON.parse(cached).enabled;

      logEvaluation({
        projectId,
        flagKey,
        environment: environmentType,
        enabled: result,
      }).catch(console.error);

      return result;
    }

    /* 3️⃣ DB fallback */
    const config = await getFlagConfig(
      projectId,
      flagKey,
      environmentType
    );

    if (!config) return false;

    /* 4️⃣ Decision */
    let result = false;

    if (config.enabled) {
      result = evaluateRollout(config.rollout, context);
    }

    /* 5️⃣ Cache result */
    await redis.set(
      cacheKey,
      JSON.stringify({ enabled: result }),
      "EX",
      30
    );

    /* 6️⃣ Log */
    logEvaluation({
      projectId,
      flagKey,
      environment: environmentType,
      enabled: result,
    }).catch(console.error);

    return result;
  } catch (error) {
    console.error("Evaluation failed:", error);
    return false;
  }
}
