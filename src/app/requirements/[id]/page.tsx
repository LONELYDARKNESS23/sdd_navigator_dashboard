import Link from "next/link";

import ErrorCard from "@/components/error-card";
import RequirementDetail from "@/components/requirement-detail";
import { getRequirement } from "@/lib/api";
import { toUserErrorMessage } from "@/lib/errors";

type RequirementPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function createBackHref(searchParams: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
      continue;
    }

    if (typeof value === "string") {
      params.set(key, value);
    }
  }

  const queryString = params.toString();

  if (queryString.length === 0) {
    return "/";
  }

  return `/?${queryString}`;
}

export default async function RequirementPage({
  params,
  searchParams,
}: RequirementPageProps) {
  const { id } = await params;
  const backHref = createBackHref(await searchParams);
  let requirement = null;
  let loadError: string | null = null;

  try {
    requirement = await getRequirement(id);
  } catch (error) {
    loadError = toUserErrorMessage(
      error,
      "The requirement detail could not be loaded right now.",
    );
  }

  if (loadError) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
        <Link
          className="app-link-muted app-focus-ring w-fit rounded-sm text-sm font-medium"
          href={backHref}
        >
          Back to dashboard
        </Link>
        <ErrorCard title="Requirement unavailable" message={loadError} />
      </main>
    );
  }

  if (!requirement) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
        <Link
          className="app-link-muted app-focus-ring w-fit rounded-sm text-sm font-medium"
          href={backHref}
        >
          Back to dashboard
        </Link>
        <section className="app-panel rounded-2xl p-6">
          <h1 className="app-title text-2xl font-semibold">Requirement not found</h1>
          <p className="app-text-muted mt-2 text-sm">
            No local mock requirement exists for {id}.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <Link
        className="app-link-muted app-focus-ring w-fit rounded-sm text-sm font-medium"
        href={backHref}
      >
        Back to dashboard
      </Link>
      <RequirementDetail requirement={requirement} />
    </main>
  );
}
