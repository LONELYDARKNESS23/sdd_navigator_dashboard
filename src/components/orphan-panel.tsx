import type { Annotation, Task } from "@/lib/api-types";

import EmptyState from "@/components/empty-state";
import StatusBadge from "@/components/status-badge";

type OrphanPanelProps = {
  annotations?: Annotation[];
  tasks?: Task[];
};

export default function OrphanPanel({
  annotations = [],
  tasks = [],
}: OrphanPanelProps) {
  const orphanAnnotations = annotations.filter(
    (annotation) => annotation.requirementId === null,
  );
  const orphanTasks = tasks.filter((task) => task.requirementId === null);

  function formatDateTime(value: string): string {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(new Date(value));
  }

  return (
    <section className="app-panel rounded-2xl p-6">
      <div className="mb-4">
        <h2 className="app-title text-lg font-semibold">Orphan Traceability</h2>
        <p className="app-text-muted text-sm">
          {orphanAnnotations.length} orphan annotations | {orphanTasks.length} orphan
          {" "}tasks
        </p>
      </div>
      {orphanAnnotations.length === 0 && orphanTasks.length === 0 ? (
        <EmptyState
          title="No orphan records"
          message="All annotations and tasks are currently linked to known requirements."
        />
      ) : (
        <div className="space-y-4">
          {/* @req FR-REPORT-001 current scope surfaces orphan records for review, but export remains out of scope. */}
          <details className="app-card rounded-xl p-4" open>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <h3 className="app-title text-sm font-semibold uppercase tracking-[0.16em]">
                Orphan Annotations
              </h3>
              <span className="app-chip rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                {orphanAnnotations.length}
              </span>
            </summary>
            {orphanAnnotations.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                title="No orphan annotations"
                message="Every annotation is linked to a requirement."
                />
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {orphanAnnotations.map((annotation) => (
                  <li key={annotation.id} className="app-panel-soft rounded-xl p-4 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="app-text-muted font-mono text-xs">{annotation.id}</span>
                      <StatusBadge value={annotation.type} />
                      <span className="app-text-muted text-xs">
                        Updated {formatDateTime(annotation.updatedAt)}
                      </span>
                    </div>
                    <p className="app-text-secondary mt-3 font-mono text-xs">
                      {annotation.filePath}:{annotation.line}
                    </p>
                    <pre className="app-card mt-3 overflow-x-auto rounded-xl p-3 text-xs leading-5">
                      <code className="app-text-secondary whitespace-pre-wrap">
                        {annotation.snippet}
                      </code>
                    </pre>
                  </li>
                ))}
              </ul>
            )}
          </details>

          <details className="app-card rounded-xl p-4" open>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <h3 className="app-title text-sm font-semibold uppercase tracking-[0.16em]">
                Orphan Tasks
              </h3>
              <span className="app-chip rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                {orphanTasks.length}
              </span>
            </summary>
            {orphanTasks.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                title="No orphan tasks"
                message="Every task currently points to at least one requirement."
                />
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {orphanTasks.map((task) => (
                  <li key={task.id} className="app-panel-soft rounded-xl p-4 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="app-text-muted font-mono text-xs uppercase tracking-[0.16em]">
                          {task.id}
                        </p>
                        <p className="app-title mt-2 font-medium">{task.title}</p>
                      </div>
                      <StatusBadge value={task.status} />
                    </div>
                    <div className="app-text-muted mt-3 grid gap-2 text-xs">
                      <span>
                        Assignee {task.assignee && task.assignee.length > 0 ? task.assignee : "Unassigned"}
                      </span>
                      <span>Updated {formatDateTime(task.updatedAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </details>
        </div>
      )}
    </section>
  );
}
