import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import TasksPanel from "@/components/tasks-panel";
import { cloneFixture, taskFixtures } from "@/tests/fixtures";

describe("TasksPanel", () => {
  it("renders the work items summary and orphan task details", () => {
    // @req FR-API-003
    render(<TasksPanel tasks={cloneFixture(taskFixtures)} />);

    expect(
      screen.getByRole("heading", { name: "Work Items" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/6 tasks loaded, including 1 orphan task/i)).toBeInTheDocument();
    expect(screen.getByText("TASK-206")).toBeInTheDocument();
    expect(screen.getByText(/Requirement No linked requirement/i)).toBeInTheDocument();
    expect(screen.getByText("orphan")).toBeInTheDocument();
  });

  it("filters tasks by status using the local filter chips", async () => {
    // @req FR-API-003
    const user = userEvent.setup();

    render(<TasksPanel tasks={cloneFixture(taskFixtures)} />);
    await user.click(screen.getByRole("button", { name: "open" }));

    expect(screen.getByText("TASK-206")).toBeInTheDocument();
    expect(screen.queryByText("TASK-201")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "done" }));

    expect(screen.getByText("TASK-201")).toBeInTheDocument();
    expect(screen.queryByText("TASK-206")).not.toBeInTheDocument();
  });
});
