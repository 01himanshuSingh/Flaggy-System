// this is only for making the feature flag creation of flag 

import { EvaluationContext } from "@/lib/types/evaluationcontext";
import { evaluateFeatureFlag } from "./evaluateFeatureFlag";

type BulkParams = {
  projectId: string;
  environmentType: "PRODUCTION" | "STAGING" | "DEVELOPMENT";
  keys: string[];
  context?: EvaluationContext;
};

export async function evaluateBulkFlags({
  projectId,
  environmentType,
  keys,
  context,
}: BulkParams): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};

  const evaluations = keys.map(async (key) => {
    try {
      const enabled = await evaluateFeatureFlag({
        projectId,
        environmentType,
        flagKey: key,
        context,
      });

      results[key] = enabled;
    } catch {
      results[key] = false; // fail closed
    }
  });

  await Promise.all(evaluations);

  return results;
}
