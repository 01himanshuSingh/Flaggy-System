"use client";

import { useUser } from "@/lib/hook/useUser";

export default function UserClient() {
  const { user, isLoading } = useUser();

  if (isLoading) return <p>Loading...</p>;

  return <p>Hello {user?.email}   Your landing page </p>;

}
