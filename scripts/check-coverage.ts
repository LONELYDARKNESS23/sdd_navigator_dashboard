import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

import { parse } from "yaml";

const REQUIREMENTS_FILE = "requirements.yaml";
const SEARCH_TARGETS = ["src", "scripts"] as const;
const OPTIONAL_FILES = ["README.md", "PROCESS.md"] as const;
const TEXT_FILE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mts",
  ".cts",
  ".mjs",
  ".cjs",
  ".md",
]);
const TRACE_ID_PATTERN = /\b[A-Z]{2}(?:-[A-Z0-9]+)+-\d{3}\b/g;

interface RequirementEntry {
  id: string;
}

interface RequirementDocument {
  requirements: RequirementEntry[];
}

export interface TraceLocation {
  filePath: string;
  line: number;
}

export interface CoverageReport {
  requirementIds: string[];
  coveredRequirementIds: string[];
  uncoveredRequirementIds: string[];
  coverageMap: Map<string, TraceLocation[]>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRequirementEntry(value: unknown): value is RequirementEntry {
  return isRecord(value) && typeof value.id === "string" && value.id.trim().length > 0;
}

function isRequirementDocument(value: unknown): value is RequirementDocument {
  return (
    isRecord(value) &&
    Array.isArray(value.requirements) &&
    value.requirements.every((entry) => isRequirementEntry(entry))
  );
}

function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function loadRequirementIds(projectRoot: string): Promise<string[]> {
  const filePath = path.join(projectRoot, REQUIREMENTS_FILE);
  const contents = await readFile(filePath, "utf8");
  const parsed = parse(contents) as unknown;

  if (!isRequirementDocument(parsed)) {
    throw new Error(
      `Invalid ${REQUIREMENTS_FILE}: expected a top-level "requirements" array with string ids.`,
    );
  }

  return [...new Set(parsed.requirements.map((entry) => entry.id.trim()))];
}

async function collectTextFiles(filePath: string): Promise<string[]> {
  const fileStat = await stat(filePath);

  if (fileStat.isFile()) {
    return TEXT_FILE_EXTENSIONS.has(path.extname(filePath)) ? [filePath] : [];
  }

  const entries = await readdir(filePath, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((entry) => !entry.name.startsWith("."))
      .map(async (entry) => {
        const absolutePath = path.join(filePath, entry.name);

        if (entry.isDirectory()) {
          return collectTextFiles(absolutePath);
        }

        return TEXT_FILE_EXTENSIONS.has(path.extname(entry.name))
          ? [absolutePath]
          : [];
      }),
  );

  return files.flat();
}

async function collectSearchFiles(projectRoot: string): Promise<string[]> {
  const requiredFiles = await Promise.all(
    SEARCH_TARGETS.map(async (target) => collectTextFiles(path.join(projectRoot, target))),
  );
  const optionalFiles = await Promise.all(
    OPTIONAL_FILES.map(async (fileName) => {
      const absolutePath = path.join(projectRoot, fileName);

      if (!(await pathExists(absolutePath))) {
        return [] as string[];
      }

      return collectTextFiles(absolutePath);
    }),
  );

  return [...requiredFiles.flat(), ...optionalFiles.flat()].sort((left, right) =>
    left.localeCompare(right),
  );
}

function addTraceLocation(
  coverageMap: Map<string, TraceLocation[]>,
  requirementId: string,
  location: TraceLocation,
): void {
  const existingLocations = coverageMap.get(requirementId);

  if (existingLocations) {
    existingLocations.push(location);
    return;
  }

  coverageMap.set(requirementId, [location]);
}

export async function buildCoverageMap(
  projectRoot: string,
  requirementIds: readonly string[],
): Promise<Map<string, TraceLocation[]>> {
  const requirementIdSet = new Set(requirementIds);
  const searchFiles = await collectSearchFiles(projectRoot);
  const coverageMap = new Map<string, TraceLocation[]>();

  for (const absoluteFilePath of searchFiles) {
    const contents = await readFile(absoluteFilePath, "utf8");
    const relativeFilePath = normalizePath(path.relative(projectRoot, absoluteFilePath));
    const lines = contents.split(/\r?\n/u);

    lines.forEach((lineContent, index) => {
      if (!lineContent.includes("@req")) {
        return;
      }

      const idsOnLine = lineContent.match(TRACE_ID_PATTERN) ?? [];

      idsOnLine.forEach((requirementId) => {
        if (!requirementIdSet.has(requirementId)) {
          return;
        }

        addTraceLocation(coverageMap, requirementId, {
          filePath: relativeFilePath,
          line: index + 1,
        });
      });
    });
  }

  return coverageMap;
}

function formatLocations(locations: readonly TraceLocation[]): string[] {
  return locations.map((location) => `    - ${location.filePath}:${location.line}`);
}

export function printReport(report: CoverageReport): void {
  const {
    requirementIds,
    coveredRequirementIds,
    uncoveredRequirementIds,
    coverageMap,
  } = report;

  process.stdout.write("Requirement Traceability Report\n");
  process.stdout.write("==============================\n");
  process.stdout.write(`Total requirements : ${requirementIds.length}\n`);
  process.stdout.write(`Covered            : ${coveredRequirementIds.length}\n`);
  process.stdout.write(`Uncovered          : ${uncoveredRequirementIds.length}\n\n`);

  process.stdout.write("Requirement coverage\n");
  process.stdout.write("--------------------\n");

  requirementIds.forEach((requirementId) => {
    const locations = coverageMap.get(requirementId) ?? [];
    const statusLabel = locations.length > 0 ? "covered" : "uncovered";

    process.stdout.write(`- ${requirementId} (${statusLabel})\n`);

    if (locations.length === 0) {
      process.stdout.write("    - no @req references found\n");
      return;
    }

    formatLocations(locations).forEach((line) => {
      process.stdout.write(`${line}\n`);
    });
  });

  if (uncoveredRequirementIds.length > 0) {
    process.stdout.write("\nUncovered requirements\n");
    process.stdout.write("----------------------\n");
    uncoveredRequirementIds.forEach((requirementId) => {
      process.stdout.write(`- ${requirementId}\n`);
    });
  }
}

export async function runCoverageCheck(projectRoot: string): Promise<CoverageReport> {
  const requirementIds = await loadRequirementIds(projectRoot);
  const coverageMap = await buildCoverageMap(projectRoot, requirementIds);
  const coveredRequirementIds = requirementIds.filter((requirementId) =>
    coverageMap.has(requirementId),
  );
  const uncoveredRequirementIds = requirementIds.filter(
    (requirementId) => !coverageMap.has(requirementId),
  );

  return {
    requirementIds,
    coveredRequirementIds,
    uncoveredRequirementIds,
    coverageMap,
  };
}

async function main(): Promise<void> {
  const report = await runCoverageCheck(process.cwd());

  printReport(report);
  process.exitCode = report.uncoveredRequirementIds.length === 0 ? 0 : 1;
}

const isDirectExecution =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectExecution) {
  main().catch((error: unknown) => {
    const message =
      error instanceof Error ? error.message : "Unknown coverage validation failure.";

    process.stderr.write(`Coverage validation failed: ${message}\n`);
    process.exitCode = 1;
  });
}
