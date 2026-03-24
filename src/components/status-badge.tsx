type StatusBadgeProps = {
  value: string;
};

const badgeClasses: Record<string, string> = {
  covered: "status-badge--success",
  in_progress: "status-badge--info",
  done: "status-badge--success",
  open: "status-badge--neutral",
  partial: "status-badge--warning",
  missing: "status-badge--danger",
  impl: "status-badge--info",
  test: "status-badge--neutral",
  fully_covered: "status-badge--success",
  needs_tests: "status-badge--warning",
  not_implemented: "status-badge--danger",
  orphan: "status-badge--danger",
  completed: "status-badge--success",
  running: "status-badge--info",
  idle: "status-badge--neutral",
  failed: "status-badge--danger",
};

function normalizeValue(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function formatValue(value: string): string {
  return value.replace(/_/g, " ");
}

export default function StatusBadge({ value }: StatusBadgeProps) {
  const normalizedValue = normalizeValue(value);
  const className = badgeClasses[normalizedValue] ?? badgeClasses.open;

  return (
    <span className={`status-badge ${className}`}>
      {formatValue(value)}
    </span>
  );
}
