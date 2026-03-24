export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="space-y-3">
        <div className="app-skeleton h-4 w-40 rounded-full" />
        <div className="app-skeleton h-10 w-80 rounded-xl" />
        <div className="app-skeleton h-4 w-full max-w-3xl rounded-full" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
        <div className="space-y-6">
          <div className="app-skeleton h-64 rounded-2xl" />
          <div className="app-skeleton h-96 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <div className="app-skeleton h-64 rounded-2xl" />
          <div className="app-skeleton h-72 rounded-2xl" />
        </div>
      </div>
    </main>
  );
}
