export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="app-skeleton h-4 w-32 rounded-full" />
      <div className="app-skeleton h-96 rounded-2xl" />
    </main>
  );
}
