import crypto from "crypto";

export function getUserHashPercentage(userId: string): number {
  const hash = crypto
    .createHash("sha256")
    .update(userId)
    .digest("hex");

  const slice = hash.substring(0, 8);
  const number = parseInt(slice, 16);

  return number % 100;
}
