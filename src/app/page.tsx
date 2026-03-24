import type { Metadata } from "next";

import ErrorCard from "@/components/error-card";
import OrphanPanel from "@/components/orphan-panel";
import RequirementsTable from "@/components/requirements-table";
import SummaryPanel from "@/components/summary-panel";
import TasksPanel from "@/components/tasks-panel";
import {
  getScanStatus,
  getStats,
  listAnnotations,
  listRequirements,
  listTasks,
} from "@/lib/api";
import { toUserErrorMessage } from "@/lib/errors";
import { parseRequirementTableQuery } from "@/lib/requirement-table";

export const metadata: Metadata = {
  title: "SDD Navigator Dashboard",
  description: "Traceability coverage dashboard for the SDD Navigator take-home assignment.",
};

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const tableQuery = parseRequirementTableQuery(await searchParams);
  // @req AR-PERF-001
  const [
    statsResult,
    requirementsResult,
    tasksResult,
    annotationsResult,
    scanStatusResult,
  ] = await Promise.allSettled([
    getStats(),
    listRequirements(),
    listTasks(),
    listAnnotations(),
    getScanStatus(),
  ]);

  const summaryFailed =
    statsResult.status === "rejected" || scanStatusResult.status === "rejected";
  const orphanFailed =
    tasksResult.status === "rejected" || annotationsResult.status === "rejected";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <header className="space-y-3">
        <p className="app-text-muted text-sm font-medium uppercase tracking-[0.2em]">
          Take-Home Assignment
        </p>
        <h1 className="app-title text-4xl font-semibold tracking-tight">
          SDD Navigator Dashboard
        </h1>
        <p className="app-text-secondary max-w-3xl text-sm leading-6">
          Review functional and architectural requirements, linked code
          evidence, work items, and orphan traceability records from a local
          mock scan dataset aligned to the assignment domain.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
        <div className="space-y-6">
          {summaryFailed ? (
            <ErrorCard
              title="Summary unavailable"
              message={toUserErrorMessage(
                statsResult.status === "rejected"
                  ? statsResult.reason
                  : scanStatusResult.status === "rejected"
                    ? scanStatusResult.reason
                    : null,
                "The dashboard summary could not be loaded right now.",
              )}
            />
          ) : (
            <SummaryPanel
              scanStatus={scanStatusResult.value}
              stats={statsResult.value}
            />
          )}
          {requirementsResult.status === "rejected" ? (
            <ErrorCard
              title="Requirements unavailable"
              message={toUserErrorMessage(
                requirementsResult.reason,
                "The requirements list could not be loaded right now.",
              )}
            />
          ) : (
            <RequirementsTable
              query={tableQuery}
              requirements={requirementsResult.value}
            />
          )}
        </div>
        <div className="space-y-6">
          {tasksResult.status === "rejected" ? (
            <ErrorCard
              title="Tasks unavailable"
              message={toUserErrorMessage(
                tasksResult.reason,
                "The task list could not be loaded right now.",
              )}
            />
          ) : (
            <TasksPanel tasks={tasksResult.value} />
          )}
          {orphanFailed ? (
            <ErrorCard
              title="Orphan insights unavailable"
              message={toUserErrorMessage(
                annotationsResult.status === "rejected"
                  ? annotationsResult.reason
                  : tasksResult.status === "rejected"
                    ? tasksResult.reason
                    : null,
                "Orphan annotations and tasks could not be loaded right now.",
              )}
            />
          ) : (
            <OrphanPanel
              annotations={annotationsResult.value}
              tasks={tasksResult.value}
            />
          )}
        </div>
      </div>
    </main>
  );
}
