# SDD Navigator Dashboard

SDD Navigator Dashboard is a Next.js App Router take-home submission for the ForEach Partners Frontend Engineer (AI-First) assignment. It presents a small software design-documentation dashboard backed by local mock data, with requirement coverage, linked implementation/test evidence, linked work items, and orphan traceability records.

Repository: `https://github.com/LONELYDARKNESS23/sdd_navigator_dashboard`  
Deployed app: `https://sddnavigatordashboard.vercel.app`

## Tech Stack

- Next.js 16
- React 19
- TypeScript with strict-friendly typing
- Tailwind CSS v4
- Vitest + Testing Library
- YAML parsing with `yaml`
- Local JSON mock data in `data/`

## Implemented Features

- Summary dashboard with:
  - total requirement count
  - FR / AR breakdown
  - covered / partial / missing breakdown
  - overall coverage percentage
  - orphan annotation and orphan task counts
  - last scan timestamp
- Requirements table with:
  - links to `/requirements/[id]`
  - type and coverage filters
  - URL-synced table state
  - sorting by requirement ID and last updated timestamp
- Requirement detail page with:
  - metadata
  - description
  - linked annotations with file, line, type, and snippet
  - linked tasks with status, assignee, and updated timestamp
  - coverage assessment label
- Tasks panel with simple status filtering
- Orphan panel with separate annotation/task sections
- Dark and light theme switching with persisted preference
- Vitest + Testing Library coverage for the data layer and key UI components
- Requirement traceability validation via `scripts/check-coverage.ts`

## Mock Data and API Mode

The app runs in mock mode by default.

- Mock mode reads local JSON files from `data/`
- API mode switches to `live` only when `NEXT_PUBLIC_API_URL` is set
- The live API path is intentionally a stub and is not implemented in this submission

Current mock dataset:

- 8 requirements
- 16 annotations
- 6 tasks
- 2 orphan annotations
- 1 orphan task
- 62.5% overall coverage

## Getting Started

Prerequisites:

- Node.js 20+
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Build the production bundle:

```bash
npm run build
```

Start the production build locally:

```bash
npm run start
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:run
npm run check:coverage
```

## Testing

Run the test suite once:

```bash
npm run test:run
```

Run the traceability check:

```bash
npm run check:coverage
```

Run linting:

```bash
npm run lint
```

Run the production build:

```bash
npm run build
```

The current suite covers:

- mock data loading and edge cases
- API-layer happy paths
- summary panel rendering
- requirements table filtering, sorting, and empty state behavior
- requirement detail rendering
- tasks panel behavior
- orphan panel behavior
- traceability script behavior

## Requirement Traceability

`requirements.yaml` is the source requirement list for the submission. The `check:coverage` script:

- reads `requirements.yaml`
- extracts all requirement IDs
- scans `src/`, `scripts/`, `README.md`, and `PROCESS.md` for `@req` comments
- prints file/line references for each requirement
- exits with code `1` if any requirement has no trace references

Supported trace comment format:

```ts
// @req <REQ_ID>
```

This is a lightweight traceability check. It proves that each listed requirement is referenced in implementation or tests; it does not prove complete functional correctness by itself.

## Project Structure

```text
data/                  Mock JSON dataset
scripts/               Utility scripts, including check-coverage
src/app/               App Router pages, layout, and loading states
src/components/        Dashboard and detail UI components
src/lib/               API layer, types, mock data loaders, table helpers, theme helpers
src/tests/             Vitest test suite and test utilities
requirements.yaml      Requirement source of truth for traceability checks
README.md              Submission-oriented project overview
PROCESS.md             AI-assisted implementation notes
```

## Notes and Assumptions

- The implementation is intentionally mock-data-first to keep the submission deterministic and easy to review
- The existing API layer is structured so a live backend can replace mock loaders later
- Filtering and sorting are kept local and explicit rather than introducing a heavier data layer
- The public repository and deployed application URLs are included above

## Limitations and Future Improvements

- Live API mode is not implemented in this submission
- No end-to-end browser tests are included
- The dataset is static and not produced by a real repository scan
- Traceability is comment-based and complements, but does not replace, functional testing
- `FR-REPORT-001` is still intentionally incomplete: orphan records are visible in the UI, but export/report generation is not implemented

## Submission Checklist

- [x] `npm run test:run` passes locally
- [x] `npm run check:coverage` passes locally
- [x] `npm run lint` passes locally
- [x] `npm run build` passes locally
- [ ] Confirm the GitHub repository is public at submission time
- [x] Deployed application URL is included above
