// @vitest-environment node

import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  loadRequirementIds,
  runCoverageCheck,
} from "../../scripts/check-coverage";
import {
  createTempProject,
  removeTempProject,
  withWorkingDirectory,
} from "@/tests/node-test-utils";

async function withCoverageProject<T>(
  files: Record<string, string>,
  callback: (projectRoot: string) => Promise<T>,
): Promise<T> {
  const projectRoot = await createTempProject(files);

  try {
    return await callback(projectRoot);
  } finally {
    await removeTempProject(projectRoot);
  }
}

describe("check-coverage script helpers", () => {
  it("loads requirement ids from a valid yaml file", async () => {
    // @req FR-SCAN-001
    await withCoverageProject(
      {
        "requirements.yaml": [
          "requirements:",
          "  - id: FR-SCAN-001",
          "  - id: FR-API-001",
        ].join("\n"),
      },
      async (projectRoot) => {
        await expect(loadRequirementIds(projectRoot)).resolves.toEqual([
          "FR-SCAN-001",
          "FR-API-001",
        ]);
      },
    );
  });

  it("throws on malformed yaml input", async () => {
    // @req FR-SCAN-001
    await withCoverageProject(
      {
        "requirements.yaml": "requirements: [id: FR-SCAN-001",
      },
      async (projectRoot) => {
        await expect(loadRequirementIds(projectRoot)).rejects.toThrow();
      },
    );
  });

  it("throws on an empty requirements file", async () => {
    // @req FR-SCAN-001
    await withCoverageProject(
      {
        "requirements.yaml": "",
      },
      async (projectRoot) => {
        await expect(loadRequirementIds(projectRoot)).rejects.toThrow(
          "Invalid requirements.yaml",
        );
      },
    );
  });

  it("reports uncovered requirements and trace file locations", async () => {
    // @req FR-REPORT-001
    await withCoverageProject(
      {
        "requirements.yaml": [
          "requirements:",
          "  - id: FR-SCAN-001",
          "  - id: FR-REPORT-001",
        ].join("\n"),
        "src/trace.ts": "// @req FR-SCAN-001\nexport const ready = true;\n",
        "scripts/helper.ts": "export const noop = true;\n",
      },
      async (projectRoot) => {
        const report = await withWorkingDirectory(projectRoot, async () =>
          runCoverageCheck(projectRoot),
        );
        const locations = report.coverageMap.get("FR-SCAN-001") ?? [];

        expect(report.coveredRequirementIds).toEqual(["FR-SCAN-001"]);
        expect(report.uncoveredRequirementIds).toEqual(["FR-REPORT-001"]);
        expect(locations).toEqual([
          {
            filePath: path.join("src", "trace.ts").replace(/\\/g, "/"),
            line: 1,
          },
        ]);
      },
    );
  });
});
