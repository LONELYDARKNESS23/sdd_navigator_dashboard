export type ApiMode = "mock" | "live";

export function getApiMode(): ApiMode {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (typeof apiUrl === "string" && apiUrl.trim().length > 0) {
    return "live";
  }

  return "mock";
}
