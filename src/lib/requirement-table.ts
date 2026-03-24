import type { RequirementStatus, RequirementType } from "@/lib/api-types";

export const requirementTypeOptions = [
  "FR",
  "AR",
] as const satisfies readonly RequirementType[];

export const requirementStatusOptions = [
  "covered",
  "partial",
  "missing",
] as const satisfies readonly RequirementStatus[];

export const requirementSortByOptions = [
  "updatedAt",
  "id",
] as const;

export const requirementSortOrderOptions = [
  "desc",
  "asc",
] as const;

export type RequirementSortBy = (typeof requirementSortByOptions)[number];

export type RequirementSortOrder = (typeof requirementSortOrderOptions)[number];

export interface RequirementTableQuery {
  types: RequirementType[];
  statuses: RequirementStatus[];
  sortBy: RequirementSortBy;
  sortOrder: RequirementSortOrder;
}

type SearchParamValue = string | string[] | undefined;

type SearchParamsLike = Record<string, SearchParamValue>;

export const defaultRequirementTableQuery: RequirementTableQuery = {
  types: [],
  statuses: [],
  sortBy: "updatedAt",
  sortOrder: "desc",
};

function getMultiSearchParam(value: SearchParamValue): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      item
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0),
    );
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export function isRequirementType(value: string): value is RequirementType {
  return requirementTypeOptions.includes(value as RequirementType);
}

export function isRequirementStatus(value: string): value is RequirementStatus {
  return requirementStatusOptions.includes(value as RequirementStatus);
}

function isRequirementSortBy(value: string): value is RequirementSortBy {
  return requirementSortByOptions.includes(value as RequirementSortBy);
}

function isRequirementSortOrder(value: string): value is RequirementSortOrder {
  return requirementSortOrderOptions.includes(value as RequirementSortOrder);
}

export function parseRequirementTableQuery(
  searchParams: SearchParamsLike,
): RequirementTableQuery {
  const typeValues = getMultiSearchParam(searchParams.type);
  const statusValues = getMultiSearchParam(searchParams.status);
  const sortBy = getMultiSearchParam(searchParams.sortBy)[0];
  const sortOrder = getMultiSearchParam(searchParams.sortOrder)[0];

  return {
    types: typeValues.filter(isRequirementType),
    statuses: statusValues.filter(isRequirementStatus),
    sortBy:
      sortBy && isRequirementSortBy(sortBy)
        ? sortBy
        : defaultRequirementTableQuery.sortBy,
    sortOrder:
      sortOrder && isRequirementSortOrder(sortOrder)
        ? sortOrder
        : defaultRequirementTableQuery.sortOrder,
  };
}
