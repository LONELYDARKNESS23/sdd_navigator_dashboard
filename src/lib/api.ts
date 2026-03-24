import type {
  Annotation,
  Requirement,
  RequirementDetail,
  ScanStatus,
  Stats,
  Task,
} from "@/lib/api-types";
import { getApiMode } from "@/lib/api-mode";
import { ApiModeNotImplementedError } from "@/lib/errors";
import {
  getMockRequirement,
  getMockScanStatus,
  getMockStats,
  listMockAnnotations,
  listMockRequirements,
  listMockTasks,
} from "@/lib/mock-data";

function assertMockMode(): void {
  const mode = getApiMode();

  if (mode !== "mock") {
    throw new ApiModeNotImplementedError(mode);
  }
}

export async function getStats(): Promise<Stats> {
  assertMockMode();
  return getMockStats();
}

export async function listRequirements(): Promise<Requirement[]> {
  assertMockMode();
  return listMockRequirements();
}

export async function getRequirement(id: string): Promise<RequirementDetail | null> {
  assertMockMode();
  return getMockRequirement(id);
}

export async function listTasks(): Promise<Task[]> {
  assertMockMode();
  return listMockTasks();
}

export async function listAnnotations(requirementId?: string): Promise<Annotation[]> {
  assertMockMode();
  return listMockAnnotations(requirementId);
}

export async function getScanStatus(): Promise<ScanStatus> {
  assertMockMode();
  return getMockScanStatus();
}

export async function triggerScan(): Promise<ScanStatus> {
  assertMockMode();
  // TODO: replace this with a real scan trigger when the live API exists.
  return getMockScanStatus();
}
