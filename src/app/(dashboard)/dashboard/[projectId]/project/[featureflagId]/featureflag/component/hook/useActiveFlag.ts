import { useQuery } from "@tanstack/react-query";
import { getActiveFlag } from "../lib/api/featureFlag";
export function useActiveFlag(flagId: string, env: string) {
  return useQuery({
    queryKey: ["flag", flagId, env], // 🔥 cache key
    queryFn: () => getActiveFlag(flagId, env),
    enabled: !!flagId && !!env, // prevent empty calls
    staleTime: 1000 * 30, // 30 sec cache
  });
}