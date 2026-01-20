"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";

export function useUser() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await authClient.getSession();

      if (error) {
        setError(error);
        setSession(null);
      } else {
        setSession(data);
        setError(null);
      }
    } catch (err) {
      setError(err);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    user: session?.user ?? null,
    session,
    isAuthenticated: !!session,
    isLoading,
    error,
    refetch: fetchSession,
  };
}
