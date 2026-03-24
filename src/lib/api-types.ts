export type RequirementType = "FR" | "AR";

export type RequirementStatus = "covered" | "partial" | "missing";

export type TaskStatus = "open" | "in_progress" | "done";

export type ScanState = "idle" | "running" | "completed" | "failed";

export type AnnotationType = "impl" | "test";

export interface Stats {
  totalRequirements: number;
  requirementsByType: Record<RequirementType, number>;
  requirementsByStatus: Record<RequirementStatus, number>;
  totalTasks: number;
  totalAnnotations: number;
  orphanAnnotations: number;
  orphanTasks: number;
  coveragePercent: number;
  lastScanAt: string;
}

export interface Requirement {
  id: string;
  title: string;
  type: RequirementType;
  status: RequirementStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Annotation {
  id: string;
  requirementId: string | null;
  filePath: string;
  line: number;
  type: AnnotationType;
  snippet: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  requirementId: string | null;
  assignee?: string | null;
  updatedAt: string;
}

export interface RequirementDetail extends Requirement {
  annotations: Annotation[];
  tasks: Task[];
}

export interface ScanStatus {
  status: ScanState;
  lastScanAt: string;
  message?: string;
}
