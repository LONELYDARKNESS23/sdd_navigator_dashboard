import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { cache } from "react";

import type {
  Annotation,
  Requirement,
  RequirementDetail,
  ScanStatus,
  Stats,
  Task,
} from "@/lib/api-types";

async function readJsonFile<T>(fileName: string): Promise<T> {
  const filePath = path.join(process.cwd(), "data", fileName);
  const contents = await readFile(filePath, "utf8");

  return JSON.parse(contents) as T;
}

const readStats = cache(async (): Promise<Stats> => {
  return readJsonFile<Stats>("stats.json");
});

const readRequirements = cache(async (): Promise<Requirement[]> => {
  return readJsonFile<Requirement[]>("requirements.json");
});

const readAnnotations = cache(async (): Promise<Annotation[]> => {
  return readJsonFile<Annotation[]>("annotations.json");
});

const readTasks = cache(async (): Promise<Task[]> => {
  return readJsonFile<Task[]>("tasks.json");
});

const readScanStatus = cache(async (): Promise<ScanStatus> => {
  return readJsonFile<ScanStatus>("scan.json");
});

export async function getMockStats(): Promise<Stats> {
  return readStats();
}

export async function listMockRequirements(): Promise<Requirement[]> {
  return readRequirements();
}

export async function listMockTasks(): Promise<Task[]> {
  return readTasks();
}

export async function listMockAnnotations(
  requirementId?: string,
): Promise<Annotation[]> {
  const annotations = await readAnnotations();

  if (!requirementId) {
    return annotations;
  }

  return annotations.filter((annotation) => annotation.requirementId === requirementId);
}

export async function getMockRequirement(
  id: string,
): Promise<RequirementDetail | null> {
  const [requirements, tasks, annotations] = await Promise.all([
    readRequirements(),
    readTasks(),
    readAnnotations(),
  ]);
  const requirement = requirements.find((item) => item.id === id);

  if (!requirement) {
    return null;
  }

  return {
    ...requirement,
    tasks: tasks.filter((task) => task.requirementId === id),
    annotations: annotations.filter((annotation) => annotation.requirementId === id),
  };
}

export async function getMockScanStatus(): Promise<ScanStatus> {
  return readScanStatus();
}
