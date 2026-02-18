import redis from "@/lib/redis";

type LogParams = {
  projectId: string;
  flagKey: string;
  environment: string;
  enabled: boolean;
};

export async function logEvaluation({
  projectId,
  flagKey,
  environment,
  enabled,
}: LogParams) {
  try {
    const baseKey = `feature:metrics:${projectId}:${flagKey}:${environment}`;

    const pipeline = redis.pipeline();

    pipeline.incr(`${baseKey}:total`);
    if (enabled) {
      pipeline.incr(`${baseKey}:enabled`);
    } else {
      pipeline.incr(`${baseKey}:disabled`);
    }

    // optional TTL so metrics reset periodically
    pipeline.expire(`${baseKey}:total`, 86400);
    pipeline.expire(`${baseKey}:enabled`, 86400);
    pipeline.expire(`${baseKey}:disabled`, 86400);

    await pipeline.exec();
  } catch (error) {
    console.error("Evaluation logging failed:", error);
  }
}
