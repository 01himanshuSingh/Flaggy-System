import { EvaluationContext } from "@/lib/types/evaluationcontext";
import { getUserHashPercentage } from "../../utils/hashRollout";

export function evaluateRollout(
  rolloutPercentage: number | null,
  context?: EvaluationContext
): boolean {
  if (!rolloutPercentage) return true; // no rollout → enabled fully

  if (!context?.userId) return false; // no userId → fail closed

  const bucket = getUserHashPercentage(context.userId);

  return bucket < rolloutPercentage;
}