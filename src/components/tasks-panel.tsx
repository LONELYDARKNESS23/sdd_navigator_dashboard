"use client";

import { useState } from "react";

import type { Task } from "@/lib/api-types";

import EmptyState from "@/components/empty-state";
import StatusBadge from "@/components/status-badge";

type TasksPanelProps = {
  tasks?: Task[];
};

type TaskFilter = "all" | Task["status"];

const taskFilterOptions: readonly TaskFilter[] = [
  "all",
  "open",
  "in_progress",
  "done",
];

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatLabel(value: TaskFilter): string {
  return value.replace("_", " ");
}

function getFilterButtonClass(isActive: boolean): string {
  const baseClassName =
    "app-focus-ring inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]";

  if (isActive) {
    return `${baseClassName} status-badge status-badge--info`;
  }

  return `${baseClassName} app-chip cursor-pointer`;
}

export default function TasksPanel({ tasks = [] }: TasksPanelProps) {
  const [filter, setFilter] = useState<TaskFilter>("all");
  const visibleTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);
  const orphanCount = tasks.filter((task) => task.requirementId === null).length;

  return (
    <section className="app-panel rounded-2xl p-6">
      <div className="mb-4 space-y-4">
        <div>
          <h2 className="app-title text-lg font-semibold">Work Items</h2>
          <p className="app-text-muted text-sm">
            {tasks.length} tasks loaded, including {orphanCount} orphan task
            {orphanCount === 1 ? "" : "s"}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {taskFilterOptions.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              className={getFilterButtonClass(filter === option)}
              onClick={() => setFilter(option)}
            >
              {formatLabel(option)}
            </button>
          ))}
        </div>
      </div>
      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          message="Tasks will appear here once requirements are linked to implementation work."
        />
      ) : visibleTasks.length === 0 ? (
        <EmptyState
          title="No tasks match this filter"
          message="Try a different task status to inspect the current work items."
        />
      ) : (
        <ul className="space-y-3">
          {visibleTasks.map((task) => {
            const isOrphan = task.requirementId === null;

            return (
              <li
                key={task.id}
                className={`${isOrphan ? "app-card-strong" : "app-card"} rounded-xl p-4 text-sm`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="app-text-muted font-mono text-xs uppercase tracking-[0.16em]">
                      {task.id}
                    </p>
                    <p className="app-title font-medium">{task.title}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {isOrphan ? <StatusBadge value="orphan" /> : null}
                    <StatusBadge value={task.status} />
                  </div>
                </div>
                <div className="app-text-muted mt-3 grid gap-2 text-xs sm:grid-cols-2">
                  <span>
                    Requirement {task.requirementId ?? "No linked requirement"}
                  </span>
                  <span>
                    Assignee {task.assignee && task.assignee.length > 0 ? task.assignee : "Unassigned"}
                  </span>
                  <span className="sm:col-span-2">
                    Updated {formatDateTime(task.updatedAt)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
