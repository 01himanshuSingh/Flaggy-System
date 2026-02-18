
import { getUserHashPercentage } from "../hook/utils/hashRollout";
import { EvaluationContext } from "../types/evaluationcontext";


export function evaluateRollout(
  rolloutPercentage: number | null,
  context?: EvaluationContext
): boolean {
  if (!rolloutPercentage) return true; // no rollout → enabled fully

  if (!context?.userId) return false; // no userId → fail closed

  const bucket = getUserHashPercentage(context.userId);

  return bucket < rolloutPercentage;
}