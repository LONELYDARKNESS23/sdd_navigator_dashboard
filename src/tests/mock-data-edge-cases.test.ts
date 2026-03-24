// @vitest-environment node

import process from "node:process";

import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { scanStatusFixture, statsFixture } from "@/tests/fixtures";
import {
  createTempProject,
  removeTempProject,
  withWorkingDirectory,
  type TempProjectFiles,
} from "@/tests/node-test-utils";

function toJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

async function importApiModule() {
  vi.resetModules();
  return import("@/lib/api");
}

async function withApiFromFiles<T>(
  files: TempProjectFiles,
  callback: (apiModule: typeof import("@/lib/api")) => Promise<T>,
): Promise<T> {
  const projectRoot = await createTempProject(files);

  try {
    return await withWorkingDirectory(projectRoot, async () => {
      const apiModule = await importApiModule();
      return callback(apiModule);
    });
  } finally {
    await removeTempProject(projectRoot);
  }
}

describe("mock data edge cases", () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeAll(() => {
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  afterAll(() => {
    if (typeof originalApiUrl === "string") {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
      return;
    }

    delete process.env.NEXT_PUBLIC_API_URL;
  });

  it("loads a valid mock stats file from a temporary project", async () => {
    // @req FR-API-001
    const stats = await withApiFromFiles(
      {
        "data/stats.json": toJson(statsFixture),
      },
      async ({ getStats }) => getStats(),
    );

    expect(stats).toMatchObject(statsFixture);
  });

  it("rejects malformed JSON in stats.json", async () => {
    // @req FR-API-001
    await withApiFromFiles(
      {
        "data/stats.json": "{not-valid-json",
      },
      async ({ getStats }) => {
        await expect(getStats()).rejects.toThrow(SyntaxError);
      },
    );
  });

  it("rejects empty JSON files", async () => {
    // @req FR-API-001
    await withApiFromFiles(
      {
        "data/stats.json": "",
      },
      async ({ getStats }) => {
        await expect(getStats()).rejects.toThrow(SyntaxError);
      },
    );
  });

  it("supports a 0 percent coverage stats payload", async () => {
    // @req FR-API-001
    const zeroCoverageStats = {
      ...statsFixture,
      requirementsByStatus: {
        covered: 0,
        partial: 0,
        missing: 8,
      },
      coveragePercent: 0,
    };

    const stats = await withApiFromFiles(
      {
        "data/stats.json": toJson(zeroCoverageStats),
      },
      async ({ getStats }) => getStats(),
    );

    expect(stats.coveragePercent).toBe(0);
    expect(stats.requirementsByStatus.covered).toBe(0);
    expect(stats.requirementsByStatus.missing).toBe(8);
  });

  it("supports a 100 percent coverage stats payload", async () => {
    // @req FR-API-001
    const fullCoverageStats = {
      ...statsFixture,
      requirementsByStatus: {
        covered: 8,
        partial: 0,
        missing: 0,
      },
      coveragePercent: 100,
    };

    const stats = await withApiFromFiles(
      {
        "data/stats.json": toJson(fullCoverageStats),
      },
      async ({ getStats }) => getStats(),
    );

    expect(stats.coveragePercent).toBe(100);
    expect(stats.requirementsByStatus.covered).toBe(8);
    expect(stats.requirementsByStatus.missing).toBe(0);
  });

  it("supports partial coverage edge cases with decimal percentages", async () => {
    // @req AR-PERF-001
    const partialCoverageStats = {
      ...statsFixture,
      requirementsByStatus: {
        covered: 3,
        partial: 4,
        missing: 1,
      },
      coveragePercent: 37.5,
    };

    const stats = await withApiFromFiles(
      {
        "data/stats.json": toJson(partialCoverageStats),
      },
      async ({ getStats }) => getStats(),
    );

    expect(stats.coveragePercent).toBe(37.5);
    expect(stats.requirementsByStatus.partial).toBe(4);
  });

  it("loads scan status independently from the stats file", async () => {
    // @req FR-SCAN-001
    const scanStatus = await withApiFromFiles(
      {
        "data/scan.json": toJson(scanStatusFixture),
      },
      async ({ getScanStatus }) => getScanStatus(),
    );

    expect(scanStatus.status).toBe("completed");
    expect(scanStatus.message).toContain("Mock scan completed");
  });
});
