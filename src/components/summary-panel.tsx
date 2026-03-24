import type { RequirementStatus, RequirementType, ScanStatus, Stats } from "@/lib/api-types";

import StatusBadge from "@/components/status-badge";

type SummaryPanelProps = {
  stats?: Stats | null;
  scanStatus?: ScanStatus | null;
};

const emptyStats: Stats = {
  totalRequirements: 0,
  requirementsByType: {
    FR: 0,
    AR: 0,
  },
  requirementsByStatus: {
    covered: 0,
    partial: 0,
    missing: 0,
  },
  totalTasks: 0,
  totalAnnotations: 0,
  orphanAnnotations: 0,
  orphanTasks: 0,
  coveragePercent: 0,
  lastScanAt: "",
};

function formatDateTime(value: string): string {
  if (!value) {
    return "No scan recorded";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatLabel(value: RequirementStatus | RequirementType): string {
  return value.replace("_", " ");
}

function getProgressTone(status: RequirementStatus): "success" | "warning" | "danger" {
  if (status === "covered") {
    return "success";
  }

  if (status === "partial") {
    return "warning";
  }

  return "danger";
}

function getProgressColor(tone: "success" | "warning" | "danger"): string {
  if (tone === "success") {
    return "var(--badge-success-border)";
  }

  if (tone === "warning") {
    return "var(--badge-warning-border)";
  }

  return "var(--badge-danger-border)";
}

export default function SummaryPanel({
  stats,
  scanStatus,
}: SummaryPanelProps) {
  const values = stats ?? emptyStats;
  const headlineItems = [
    {
      label: "Requirements",
      value: values.totalRequirements,
      detail: `FR ${values.requirementsByType.FR} | AR ${values.requirementsByType.AR}`,
    },
    {
      label: "Coverage",
      value: `${values.coveragePercent}%`,
      detail: `${values.requirementsByStatus.covered} of ${values.totalRequirements} fully covered`,
    },
    {
      label: "Annotations",
      value: values.totalAnnotations,
      detail: `${values.totalAnnotations - values.orphanAnnotations} linked | ${values.orphanAnnotations} orphan`,
    },
    {
      label: "Work Items",
      value: values.totalTasks,
      detail: `${values.totalTasks - values.orphanTasks} linked | ${values.orphanTasks} orphan`,
    },
  ];
  const coverageItems = [
    {
      label: "covered" as const,
      value: values.requirementsByStatus.covered,
    },
    {
      label: "partial" as const,
      value: values.requirementsByStatus.partial,
    },
    {
      label: "missing" as const,
      value: values.requirementsByStatus.missing,
    },
  ];
  const typeItems = [
    {
      label: "FR" as const,
      value: values.requirementsByType.FR,
    },
    {
      label: "AR" as const,
      value: values.requirementsByType.AR,
    },
  ];

  return (
    <section className="app-panel rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="app-title text-lg font-semibold">Coverage Summary</h2>
          <div className="app-text-muted mt-2 flex flex-wrap items-center gap-2 text-sm">
            <StatusBadge value={scanStatus?.status ?? "idle"} />
            <span>Last scan {formatDateTime(scanStatus?.lastScanAt ?? values.lastScanAt)}</span>
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {headlineItems.map((item) => (
          <div key={item.label} className="app-card-strong rounded-xl p-4">
            <p className="app-text-muted text-xs uppercase tracking-[0.2em]">
              {item.label}
            </p>
            <p className="app-title mt-2 text-2xl font-semibold">{item.value}</p>
            <p className="app-text-muted mt-2 text-xs">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="app-card rounded-xl p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="app-title text-sm font-semibold uppercase tracking-[0.18em]">
              Coverage Breakdown
            </h3>
            <span className="app-text-muted text-xs">
              {values.totalRequirements} requirements
            </span>
          </div>
          <div className="space-y-4">
            {coverageItems.map((item) => {
              const percent =
                values.totalRequirements === 0
                  ? 0
                  : (item.value / values.totalRequirements) * 100;
              const tone = getProgressTone(item.label);
              const toneColor = getProgressColor(tone);

              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge value={item.label} />
                    </div>
                    <p className="app-text-secondary text-sm font-medium">
                      {item.value}
                      <span className="app-text-muted ml-2 text-xs">
                        {percent.toFixed(1)}%
                      </span>
                    </p>
                  </div>
                  <div className="app-panel-soft h-2 rounded-full p-0.5">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: toneColor,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="app-card rounded-xl p-4">
            <h3 className="app-title text-sm font-semibold uppercase tracking-[0.18em]">
              Requirement Mix
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {typeItems.map((item) => (
                <div key={item.label} className="app-panel-soft rounded-xl p-4">
                  <p className="app-text-muted text-xs uppercase tracking-[0.18em]">
                    {formatLabel(item.label)}
                  </p>
                  <p className="app-title mt-2 text-xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="app-card rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="app-title text-sm font-semibold uppercase tracking-[0.18em]">
                  Orphan Warnings
                </h3>
                <p className="app-text-muted mt-2 text-sm">
                  {values.orphanAnnotations} annotations and {values.orphanTasks} tasks
                  still need requirement mapping.
                </p>
              </div>
              <StatusBadge
                value={
                  values.orphanAnnotations + values.orphanTasks > 0
                    ? "partial"
                    : "covered"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
