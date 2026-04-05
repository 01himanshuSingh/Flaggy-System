export async function getActiveFlag(flagId: string, env: string) {
  const res = await fetch(
    `/api/feature-flag/${flagId}/dashboard/activeflag?env=${env}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch flag");
  }

  return res.json();
}