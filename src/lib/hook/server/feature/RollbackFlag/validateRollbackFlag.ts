type RollbackInput = {
  featureFlagId?: string;
  version?: number;
  environmentType?: "PRODUCTION" | "STAGING" | "DEVELOPMENT";
  reason?: string;
};

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateRollbackInput(input: RollbackInput) {

  if (!input.featureFlagId || input.featureFlagId.length < 10) {
    throw new ValidationError("Invalid featureFlagId");
  }

  if (
    typeof input.version !== "number" ||
    input.version <= 0
  ) {
    throw new ValidationError("Version must be a positive number");
  }

  if (
    input.environmentType &&
    !["PRODUCTION", "STAGING", "DEVELOPMENT"].includes(
      input.environmentType
    )
  ) {
    throw new ValidationError("Invalid environmentType");
  }

  if (input.reason && input.reason.length > 300) {
    throw new ValidationError("Reason too long");
  }

  return {
    featureFlagId: input.featureFlagId,
    version: input.version,
    environmentType: input.environmentType,
    reason: input.reason?.trim(),
  };
}
