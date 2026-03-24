import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SummaryPanel from "@/components/summary-panel";
import { scanStatusFixture, statsFixture } from "@/tests/fixtures";

describe("SummaryPanel", () => {
  it("renders the headline counts and orphan warnings", () => {
    // @req FR-API-001
    render(<SummaryPanel stats={statsFixture} scanStatus={scanStatusFixture} />);

    expect(
      screen.getByRole("heading", { name: "Coverage Summary" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Requirements")).toBeInTheDocument();
    expect(screen.getByText("Coverage")).toBeInTheDocument();
    expect(screen.getByText("Annotations")).toBeInTheDocument();
    expect(screen.getByText("Work Items")).toBeInTheDocument();
    expect(screen.getByText("14 linked | 2 orphan")).toBeInTheDocument();
    expect(screen.getByText("5 linked | 1 orphan")).toBeInTheDocument();
    expect(screen.getByText(/2 annotations and 1 tasks still need/i)).toBeInTheDocument();
    expect(screen.getByText(/Last scan/i)).toBeInTheDocument();
  });

  it("renders the FR and AR requirement mix", () => {
    // @req FR-SCAN-001
    render(<SummaryPanel stats={statsFixture} scanStatus={scanStatusFixture} />);

    expect(screen.getByText("Requirement Mix")).toBeInTheDocument();
    expect(screen.getByText("FR 6 | AR 2")).toBeInTheDocument();
    expect(screen.getByText("FR")).toBeInTheDocument();
    expect(screen.getByText("AR")).toBeInTheDocument();
  });

  it("renders the covered, partial, and missing breakdown", () => {
    // @req AR-PERF-001
    render(<SummaryPanel stats={statsFixture} scanStatus={scanStatusFixture} />);

    expect(screen.getByText("Coverage Breakdown")).toBeInTheDocument();
    expect(screen.getAllByText("covered")).not.toHaveLength(0);
    expect(screen.getAllByText("partial")).not.toHaveLength(0);
    expect(screen.getAllByText("missing")).not.toHaveLength(0);
    expect(screen.getAllByText("62.5%")).not.toHaveLength(0);
    expect(screen.getByText("25.0%")).toBeInTheDocument();
    expect(screen.getByText("12.5%")).toBeInTheDocument();
  });
});
