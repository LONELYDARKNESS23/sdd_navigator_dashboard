import type { RequirementDetail as RequirementDetailData } from "@/lib/api-types";

import EmptyState from "@/components/empty-state";
import StatusBadge from "@/components/status-badge";

type RequirementDetailProps = {
  requirement: RequirementDetailData;
};

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function getCoverageAssessmentLabel(requirement: RequirementDetailData): string {
  if (requirement.status === "covered") {
    return "Fully covered";
  }

  if (requirement.status === "partial") {
    return "Needs tests";
  }

  return "Not implemented";
}

export default function RequirementDetail({ requirement }: RequirementDetailProps) {
  const coverageLabel = getCoverageAssessmentLabel(requirement);
  const metadataItems = [
    { label: "ID", value: requirement.id },
    { label: "Type", value: requirement.type },
    { label: "Status", value: requirement.status },
    { label: "Created", value: formatDateTime(requirement.createdAt) },
    { label: "Updated", value: formatDateTime(requirement.updatedAt) },
    { label: "Coverage", value: coverageLabel },
  ];

  return (
    <article className="app-panel space-y-6 rounded-2xl p-6">
      <header className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="app-text-muted font-mono text-xs uppercase tracking-[0.2em]">
              {requirement.id}
            </p>
            <h1 className="app-title text-2xl font-semibold">{requirement.title}</h1>
            <p className="app-text-secondary max-w-3xl text-sm leading-6">
              {requirement.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={requirement.status} />
            <StatusBadge value={coverageLabel} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {metadataItems.map((item) => (
            <div key={item.label} className="app-card-strong rounded-xl p-4">
              <p className="app-text-muted text-xs uppercase tracking-[0.2em]">
                {item.label}
              </p>
              <p className="app-title mt-2 text-sm font-medium">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="app-text-muted text-sm font-semibold uppercase tracking-[0.2em]">
            Linked Tasks
          </h2>
          <span className="app-chip rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
            {requirement.tasks.length} linked
          </span>
        </div>
        {requirement.tasks.length === 0 ? (
          <EmptyState
            title="No linked tasks"
            message="This requirement is not connected to any implementation tasks yet."
          />
        ) : (
          <ul className="grid gap-3">
            {requirement.tasks.map((task) => (
              <li key={task.id} className="app-card rounded-xl p-4 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="app-text-muted font-mono text-xs uppercase tracking-[0.16em]">
                      {task.id}
                    </p>
                    <p className="app-title mt-2 font-medium">{task.title}</p>
                  </div>
                  <StatusBadge value={task.status} />
                </div>
                <div className="app-text-muted mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <span>
                    Assignee {task.assignee && task.assignee.length > 0 ? task.assignee : "Unassigned"}
                  </span>
                  <span>Updated {formatDateTime(task.updatedAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="app-text-muted text-sm font-semibold uppercase tracking-[0.2em]">
            Linked Annotations
          </h2>
          <span className="app-chip rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
            {requirement.annotations.length} linked
          </span>
        </div>
        {requirement.annotations.length === 0 ? (
          <EmptyState
            title="No linked annotations"
            message="No implementation or test annotations have been attached to this requirement yet."
          />
        ) : (
          <ul className="grid gap-3">
            {requirement.annotations.map((annotation) => (
              <li key={annotation.id} className="app-card rounded-xl p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="app-text-muted font-mono text-xs">{annotation.id}</span>
                  <StatusBadge value={annotation.type} />
                  <span className="app-text-muted text-xs">
                    Updated {formatDateTime(annotation.updatedAt)}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <p className="app-text-secondary font-mono">
                    File {annotation.filePath}
                  </p>
                  <p className="app-text-muted">Line {annotation.line}</p>
                </div>
                {/* @req AR-SEC-001 */}
                <pre className="app-panel-soft mt-3 overflow-x-auto rounded-xl p-3 text-xs leading-5">
                  <code>{annotation.snippet}</code>
                </pre>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
