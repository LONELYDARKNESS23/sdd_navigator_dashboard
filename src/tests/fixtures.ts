import annotationsData from "../../data/annotations.json";
import requirementsData from "../../data/requirements.json";
import scanData from "../../data/scan.json";
import statsData from "../../data/stats.json";
import tasksData from "../../data/tasks.json";

import type {
  Annotation,
  Requirement,
  RequirementDetail,
  ScanStatus,
  Stats,
  Task,
} from "@/lib/api-types";

export const statsFixture = statsData as Stats;
export const scanStatusFixture = scanData as ScanStatus;
export const requirementFixtures = requirementsData as Requirement[];
export const annotationFixtures = annotationsData as Annotation[];
export const taskFixtures = tasksData as Task[];

export function cloneFixture<T>(value: T): T {
  return structuredClone(value);
}

export function getRequirementFixture(id: string): Requirement {
  const requirement = requirementFixtures.find((item) => item.id === id);

  if (!requirement) {
    throw new Error(`Missing requirement fixture for ${id}.`);
  }

  return cloneFixture(requirement);
}

export function getRequirementDetailFixture(id: string): RequirementDetail {
  const requirement = getRequirementFixture(id);

  return {
    ...requirement,
    tasks: cloneFixture(taskFixtures.filter((task) => task.requirementId === id)),
    annotations: cloneFixture(
      annotationFixtures.filter((annotation) => annotation.requirementId === id),
    ),
  };
}
