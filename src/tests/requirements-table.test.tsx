import type { ReactNode } from "react";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RequirementsTable from "@/components/requirements-table";
import {
  cloneFixture,
  requirementFixtures,
} from "@/tests/fixtures";
import {
  defaultRequirementTableQuery,
  type RequirementTableQuery,
} from "@/lib/requirement-table";

const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) => (
    <a className={className} href={href}>
      {children}
    </a>
  ),
}));

function renderRequirementsTable(query: RequirementTableQuery = defaultRequirementTableQuery) {
  render(
    <RequirementsTable
      query={query}
      requirements={cloneFixture(requirementFixtures)}
    />,
  );
}

function getRenderedRequirementIds(): string[] {
  const rows = within(screen.getByRole("table")).getAllByRole("row").slice(1);

  return rows
    .map((row) => within(row).queryAllByRole("link")[0]?.textContent?.trim() ?? "")
    .filter((value) => value.length > 0);
}

describe("RequirementsTable", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockSearchParams = new URLSearchParams();
  });

  it("renders the current requirement rows and toolbar", () => {
    // @req FR-API-002
    renderRequirementsTable();

    expect(
      screen.getByRole("heading", { name: "Requirements Table" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Requirement Type")).toBeInTheDocument();
    expect(screen.getByText("Coverage Status")).toBeInTheDocument();
    expect(screen.getByText("Sort by")).toBeInTheDocument();
    expect(screen.getByText("Order")).toBeInTheDocument();
    expect(screen.getByText("Parse requirements from the source YAML file")).toBeInTheDocument();
    expect(screen.getByText("Export an orphan traceability report")).toBeInTheDocument();
  });

  it("filters the table to the selected requirement type", () => {
    // @req FR-API-002
    renderRequirementsTable({
      ...defaultRequirementTableQuery,
      types: ["AR"],
    });

    expect(getRenderedRequirementIds()).toEqual(["AR-SEC-001", "AR-PERF-001"]);
    expect(screen.queryByText("Export an orphan traceability report")).not.toBeInTheDocument();
  });

  it("filters the table to the selected coverage status", () => {
    // @req FR-API-002
    renderRequirementsTable({
      ...defaultRequirementTableQuery,
      statuses: ["missing"],
    });

    expect(getRenderedRequirementIds()).toEqual(["FR-REPORT-001"]);
    expect(screen.getByText("Export an orphan traceability report")).toBeInTheDocument();
  });

  it("sorts requirements by id in ascending order", () => {
    // @req FR-API-002
    renderRequirementsTable({
      ...defaultRequirementTableQuery,
      sortBy: "id",
      sortOrder: "asc",
    });

    expect(getRenderedRequirementIds()).toEqual([
      "AR-PERF-001",
      "AR-SEC-001",
      "FR-API-001",
      "FR-API-002",
      "FR-API-003",
      "FR-REPORT-001",
      "FR-SCAN-001",
      "FR-SCAN-002",
    ]);
  });

  it("sorts requirements by updated date in ascending order", () => {
    // @req AR-PERF-001
    renderRequirementsTable({
      ...defaultRequirementTableQuery,
      sortBy: "updatedAt",
      sortOrder: "asc",
    });

    expect(getRenderedRequirementIds()[0]).toBe("FR-SCAN-001");
    expect(getRenderedRequirementIds().at(-1)).toBe("FR-REPORT-001");
  });

  it("renders an empty state when the active filters match nothing", () => {
    // @req FR-REPORT-001
    renderRequirementsTable({
      ...defaultRequirementTableQuery,
      types: ["AR"],
      statuses: ["missing"],
    });

    expect(
      screen.getByText("No requirements match the current filters. Try resetting them."),
    ).toBeInTheDocument();
  });

  it("renders clickable requirement links", () => {
    // @req FR-API-002
    renderRequirementsTable();

    const link = screen.getByRole("link", {
      name: "Parse requirements from the source YAML file",
    });

    expect(link).toHaveAttribute("href", "/requirements/FR-SCAN-001");
  });

  it("syncs chip filter changes to the URL", async () => {
    // @req FR-API-002
    const user = userEvent.setup();

    renderRequirementsTable();
    await user.click(screen.getByRole("button", { name: "AR" }));

    expect(mockReplace).toHaveBeenCalledWith("/?type=AR", { scroll: false });
  });
});
