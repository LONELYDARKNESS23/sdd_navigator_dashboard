"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { Requirement } from "@/lib/api-types";
import StatusBadge from "@/components/status-badge";
import {
  defaultRequirementTableQuery,
  isRequirementStatus,
  isRequirementType,
  requirementSortByOptions,
  requirementSortOrderOptions,
  requirementStatusOptions,
  requirementTypeOptions,
  type RequirementTableQuery,
} from "@/lib/requirement-table";

type RequirementsTableProps = {
  requirements: Requirement[];
  query: RequirementTableQuery;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatLabel(value: string): string {
  return value.replace("_", " ");
}

function toggleValue<T extends string>(values: T[], value: T): T[] {
  if (values.includes(value)) {
    return values.filter((item) => item !== value);
  }

  return [...values, value];
}

function getFilterButtonClass(
  isActive: boolean,
  tone: "info" | "success" | "warning" | "danger" = "info",
): string {
  const baseClassName =
    "app-focus-ring inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]";

  if (isActive) {
    return `${baseClassName} status-badge status-badge--${tone}`;
  }

  return `${baseClassName} app-chip cursor-pointer`;
}

export default function RequirementsTable({
  requirements,
  query,
}: RequirementsTableProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const filteredRequirements = [...requirements]
    .filter((requirement) => {
      if (query.types.length > 0 && !query.types.includes(requirement.type)) {
        return false;
      }

      if (
        query.statuses.length > 0 &&
        !query.statuses.includes(requirement.status)
      ) {
        return false;
      }

      return true;
    })
    .sort((left, right) => {
      const direction = query.sortOrder === "asc" ? 1 : -1;

      if (query.sortBy === "updatedAt") {
        return (
          (new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime()) *
          direction
        );
      }

      return left.id.localeCompare(right.id, undefined, { numeric: true }) * direction;
    });

  const activeLabels = [
    ...query.types.map((type) => `Type: ${type}`),
    ...query.statuses.map((status) => `Coverage: ${formatLabel(status)}`),
    `Sort: ${query.sortBy === "updatedAt" ? "updated date" : "requirement id"} ${query.sortOrder}`,
  ];

  function navigate(nextQuery: RequirementTableQuery): void {
    const params = new URLSearchParams(searchParams.toString());

    if (nextQuery.types.length > 0) {
      params.set("type", nextQuery.types.join(","));
    } else {
      params.delete("type");
    }

    if (nextQuery.statuses.length > 0) {
      params.set("status", nextQuery.statuses.join(","));
    } else {
      params.delete("status");
    }

    if (nextQuery.sortBy === defaultRequirementTableQuery.sortBy) {
      params.delete("sortBy");
    } else {
      params.set("sortBy", nextQuery.sortBy);
    }

    if (nextQuery.sortOrder === defaultRequirementTableQuery.sortOrder) {
      params.delete("sortOrder");
    } else {
      params.set("sortOrder", nextQuery.sortOrder);
    }

    const nextUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }

  function buildRequirementHref(requirementId: string): string {
    const currentQueryString = searchParams.toString();

    if (currentQueryString.length === 0) {
      return `/requirements/${requirementId}`;
    }

    return `/requirements/${requirementId}?${currentQueryString}`;
  }

  return (
    <section className="app-panel rounded-2xl p-6">
      <div className="mb-5 space-y-4">
        <div className="app-panel-soft flex flex-col gap-4 rounded-xl p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="app-title text-lg font-semibold">Requirements Table</h2>
              <p className="app-text-muted text-sm">
                Showing {filteredRequirements.length} of {requirements.length} requirements.
              </p>
            </div>
            <button
              type="button"
              className="app-button-secondary app-focus-ring rounded-full px-3 py-2 text-sm"
              onClick={() => navigate(defaultRequirementTableQuery)}
            >
              Reset filters
            </button>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <span className="app-text-muted block text-xs uppercase tracking-[0.2em]">
                Requirement Type
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={getFilterButtonClass(query.types.length === 0)}
                  onClick={() =>
                    navigate({
                      ...query,
                      types: [],
                    })
                  }
                >
                  All
                </button>
                {requirementTypeOptions.map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={query.types.includes(type)}
                    className={getFilterButtonClass(query.types.includes(type), "info")}
                    onClick={() =>
                      navigate({
                        ...query,
                        types: toggleValue(query.types, type).filter(isRequirementType),
                      })
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="app-text-muted block text-xs uppercase tracking-[0.2em]">
                Coverage Status
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={getFilterButtonClass(query.statuses.length === 0)}
                  onClick={() =>
                    navigate({
                      ...query,
                      statuses: [],
                    })
                  }
                >
                  All
                </button>
                {requirementStatusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    aria-pressed={query.statuses.includes(status)}
                    className={getFilterButtonClass(
                      query.statuses.includes(status),
                      status === "covered"
                        ? "success"
                        : status === "partial"
                          ? "warning"
                          : "danger",
                    )}
                    onClick={() =>
                      navigate({
                        ...query,
                        statuses: toggleValue(query.statuses, status).filter(isRequirementStatus),
                      })
                    }
                  >
                    {formatLabel(status)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="app-text-muted block text-xs uppercase tracking-[0.2em]">
                Sort by
              </span>
              <select
                className="app-input w-full rounded-xl px-3 py-2"
                value={query.sortBy}
                onChange={(event) =>
                  navigate({
                    ...query,
                    sortBy:
                      event.target.value === "id" ? "id" : "updatedAt",
                  })
                }
              >
                {requirementSortByOptions.map((sortBy) => (
                  <option key={sortBy} value={sortBy}>
                    {sortBy === "updatedAt" ? "updated date" : "requirement id"}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="app-text-muted block text-xs uppercase tracking-[0.2em]">
                Order
              </span>
              <select
                className="app-input w-full rounded-xl px-3 py-2"
                value={query.sortOrder}
                onChange={(event) =>
                  navigate({
                    ...query,
                    sortOrder:
                      event.target.value === "asc" ? "asc" : "desc",
                  })
                }
              >
                {requirementSortOrderOptions.map((sortOrder) => (
                  <option key={sortOrder} value={sortOrder}>
                    {sortOrder === "asc" ? "ascending" : "descending"}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeLabels.map((label) => (
            <span key={label} className="app-chip rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em]">
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="app-table-wrap overflow-x-auto rounded-2xl">
        <table className="app-table text-sm">
          <thead>
            <tr className="app-text-muted text-left">
              <th className="w-28 min-w-[7rem] whitespace-nowrap py-3 pl-4 pr-4 font-medium">
                ID
              </th>
              <th className="py-3 pr-4 font-medium">Title</th>
              <th className="py-3 pr-4 font-medium">Type</th>
              <th className="py-3 font-medium">Coverage</th>
              <th className="py-3 pl-4 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {requirements.length === 0 ? (
              <tr>
                <td className="app-text-muted w-28 min-w-[7rem] whitespace-nowrap py-4 pl-4 pr-4">
                  -
                </td>
                <td className="app-text-muted py-4 pr-4">
                  No requirements available.
                </td>
                <td className="app-text-muted py-4 pr-4">-</td>
                <td className="app-text-muted py-4">-</td>
                <td className="app-text-muted py-4 pl-4">-</td>
              </tr>
            ) : filteredRequirements.length === 0 ? (
              <tr>
                <td className="app-text-muted w-28 min-w-[7rem] whitespace-nowrap py-4 pl-4 pr-4">
                  -
                </td>
                <td className="app-text-muted py-4 pr-4">
                  No requirements match the current filters. Try resetting them.
                </td>
                <td className="app-text-muted py-4 pr-4">-</td>
                <td className="app-text-muted py-4">-</td>
                <td className="app-text-muted py-4 pl-4">-</td>
              </tr>
            ) : (
              filteredRequirements.map((requirement) => (
                <tr
                  key={requirement.id}
                  className="app-table-row group cursor-pointer"
                >
                  <td className="app-text-secondary w-28 min-w-[7rem] whitespace-nowrap py-4 pl-4 pr-4 font-mono text-xs tabular-nums">
                    <Link
                      className="app-link app-focus-ring inline-block rounded-sm font-semibold whitespace-nowrap"
                      href={buildRequirementHref(requirement.id)}
                    >
                      {requirement.id}
                    </Link>
                  </td>
                  <td className="py-4 pr-4">
                    <Link
                      className="app-link app-focus-ring rounded-sm font-semibold group-hover:underline"
                      href={buildRequirementHref(requirement.id)}
                    >
                      {requirement.title}
                    </Link>
                    <p className="app-text-muted mt-1 text-xs leading-5">
                      {requirement.description}
                    </p>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="app-chip inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                      {requirement.type}
                    </span>
                  </td>
                  <td className="py-4">
                    <StatusBadge value={requirement.status} />
                  </td>
                  <td className="app-text-secondary py-4 pl-4">
                    {formatDate(requirement.updatedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
