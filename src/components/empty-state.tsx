type EmptyStateProps = {
  title: string;
  message: string;
};

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="app-empty-state rounded-xl p-4">
      <p className="app-title text-sm font-medium">{title}</p>
      <p className="app-text-muted mt-1 text-sm">{message}</p>
    </div>
  );
}
