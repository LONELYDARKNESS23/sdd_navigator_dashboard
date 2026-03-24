import type { ApiMode } from "@/lib/api-mode";

export class ApiModeNotImplementedError extends Error {
  readonly code = "API_MODE_NOT_IMPLEMENTED";

  constructor(mode: ApiMode) {
    super(`API mode "${mode}" is not implemented yet.`);
    this.name = "ApiModeNotImplementedError";
  }
}

export function toUserErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (error instanceof ApiModeNotImplementedError) {
    return "Live API mode is not available yet. Use the default mock mode.";
  }

  return fallbackMessage;
}
