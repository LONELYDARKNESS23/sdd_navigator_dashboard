import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RequirementDetail from "@/components/requirement-detail";
import {
  getRequirementDetailFixture,
} from "@/tests/fixtures";

describe("RequirementDetail", () => {
  it("renders description, metadata, linked annotations, and linked tasks", () => {
    // @req FR-API-002
    render(<RequirementDetail requirement={getRequirementDetailFixture("FR-API-002")} />);

    expect(
      screen.getByRole("heading", { name: "Expose requirement list and detail payloads" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/linked annotations and tasks for traceability review/i)).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Updated")).toBeInTheDocument();
    expect(screen.getByText("Coverage")).toBeInTheDocument();
    expect(screen.getByText("Linked Tasks")).toBeInTheDocument();
    expect(screen.getByText("Linked Annotations")).toBeInTheDocument();
    expect(screen.getByText("TASK-204")).toBeInTheDocument();
    expect(screen.getByText(/Assignee S. Lopez/i)).toBeInTheDocument();
    expect(screen.getByText("ANN-207")).toBeInTheDocument();
    expect(screen.getByText("File src/lib/api.ts")).toBeInTheDocument();
    expect(screen.getByText("Line 29")).toBeInTheDocument();
    expect(
      screen.getByText(/getRequirement\(id: string\): Promise<RequirementDetail \| null>/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Fully covered")).not.toHaveLength(0);
  });

  it("renders empty states when no linked tasks or annotations exist", () => {
    // @req FR-REPORT-001
    render(<RequirementDetail requirement={getRequirementDetailFixture("FR-REPORT-001")} />);

    expect(screen.getByText("No linked tasks")).toBeInTheDocument();
    expect(screen.getByText("No linked annotations")).toBeInTheDocument();
    expect(screen.getAllByText("Not implemented")).not.toHaveLength(0);
  });
});
