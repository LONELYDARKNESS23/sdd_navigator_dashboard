// @vitest-environment node

import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";

import {
  getRequirement,
  getScanStatus,
  getStats,
  listAnnotations,
  listRequirements,
  listTasks,
} from "@/lib/api";

describe("mock API layer", () => {
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

  it("loads the official summary stats shape from mock mode", async () => {
    // @req FR-API-001
    const stats = await getStats();

    expect(stats).toMatchObject({
      totalRequirements: 8,
      requirementsByType: {
        FR: 6,
        AR: 2,
      },
      requirementsByStatus: {
        covered: 5,
        partial: 2,
        missing: 1,
      },
      totalTasks: 6,
      totalAnnotations: 16,
      orphanAnnotations: 2,
      orphanTasks: 1,
      coveragePercent: 62.5,
      lastScanAt: "2026-03-24T06:45:00.000Z",
    });
  });

  it("lists requirements with FR and AR types plus coverage states", async () => {
    // @req FR-SCAN-001
    const requirements = await listRequirements();

    expect(requirements).toHaveLength(8);
    expect(requirements.map((requirement) => requirement.type)).toEqual(
      expect.arrayContaining(["FR", "AR"]),
    );
    expect(requirements.map((requirement) => requirement.status)).toEqual(
      expect.arrayContaining(["covered", "partial", "missing"]),
    );
    expect(requirements[0]).toMatchObject({
      id: "FR-SCAN-001",
      title: "Parse requirements from the source YAML file",
      type: "FR",
      status: "covered",
    });
  });

  it("returns one requirement detail for an existing id", async () => {
    // @req FR-API-002
    const requirement = await getRequirement("FR-API-002");

    expect(requirement).not.toBeNull();
    expect(requirement?.id).toBe("FR-API-002");
    expect(requirement?.description).toContain("linked annotations and tasks");
    expect(requirement?.tasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "TASK-204",
          requirementId: "FR-API-002",
        }),
      ]),
    );
    expect(requirement?.annotations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "ANN-207",
          requirementId: "FR-API-002",
        }),
        expect.objectContaining({
          id: "ANN-208",
          requirementId: "FR-API-002",
        }),
      ]),
    );
  });

  it("returns null for a missing requirement id", async () => {
    // @req FR-API-002
    await expect(getRequirement("FR-UNKNOWN-999")).resolves.toBeNull();
  });

  it("filters linked annotations by requirement id when requested", async () => {
    // @req FR-SCAN-002
    const annotations = await listAnnotations("FR-API-002");

    expect(annotations).toHaveLength(2);
    expect(annotations.every((annotation) => annotation.requirementId === "FR-API-002")).toBe(
      true,
    );
  });

  it("detects orphan annotations from the loaded dataset", async () => {
    // @req FR-REPORT-001
    const annotations = await listAnnotations();
    const orphanAnnotations = annotations.filter(
      (annotation) => annotation.requirementId === null,
    );

    expect(orphanAnnotations).toHaveLength(2);
    expect(orphanAnnotations.map((annotation) => annotation.id)).toEqual([
      "ANN-215",
      "ANN-216",
    ]);
  });

  it("detects orphan tasks from the loaded dataset", async () => {
    // @req FR-API-003
    const tasks = await listTasks();
    const orphanTasks = tasks.filter((task) => task.requirementId === null);

    expect(tasks).toHaveLength(6);
    expect(orphanTasks).toHaveLength(1);
    expect(orphanTasks[0]).toMatchObject({
      id: "TASK-206",
      status: "todo",
      requirementId: null,
    });
  });

  it("returns the latest scan status shape", async () => {
    // @req FR-SCAN-001
    const scanStatus = await getScanStatus();

    expect(scanStatus).toMatchObject({
      status: "completed",
      lastScanAt: "2026-03-24T06:45:00.000Z",
      message: "Mock scan completed from local JSON data.",
    });
  });
});
