type ErrorCardProps = {
  title: string;
  message: string;
};

export default function ErrorCard({ title, message }: ErrorCardProps) {
  return (
    <section className="app-error-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm">{message}</p>
    </section>
  );
}
