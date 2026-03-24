import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import OrphanPanel from "@/components/orphan-panel";
import {
  annotationFixtures,
  cloneFixture,
  taskFixtures,
} from "@/tests/fixtures";

describe("OrphanPanel", () => {
  it("renders orphan annotations and orphan tasks in separate sections", () => {
    // @req FR-REPORT-001
    render(
      <OrphanPanel
        annotations={cloneFixture(annotationFixtures)}
        tasks={cloneFixture(taskFixtures)}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Orphan Traceability" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Orphan Annotations")).toBeInTheDocument();
    expect(screen.getByText("Orphan Tasks")).toBeInTheDocument();
    expect(screen.getByText("ANN-215")).toBeInTheDocument();
    expect(screen.getByText("ANN-216")).toBeInTheDocument();
    expect(screen.getByText("TASK-206")).toBeInTheDocument();
    expect(screen.getByText("legacy/trace-map.csv:14")).toBeInTheDocument();
    expect(screen.getByText(/Assignee Unassigned/i)).toBeInTheDocument();
    expect(screen.queryByText("ANN-201")).not.toBeInTheDocument();
    expect(screen.queryByText("TASK-201")).not.toBeInTheDocument();
  });
});
