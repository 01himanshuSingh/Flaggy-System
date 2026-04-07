export async function toggleFlag(data: any) {
  const res = await fetch("/api/feature-flag/toggle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Toggle failed");
  }

  return res.json();
}