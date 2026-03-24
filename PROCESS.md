# Process Notes

## Tools Used

- GPT-based coding assistance for planning, draft code generation, refactoring support, and review prompts
- PowerShell for local inspection, validation, and Git operations
- Next.js App Router with TypeScript and Tailwind CSS
- Vitest with Testing Library for unit and component coverage
- `scripts/check-coverage.ts` for lightweight requirement traceability validation
- GitHub for repository hosting and Vercel for deployment

## Conversation Log

Exact timestamps and a verbatim transcript were not preserved as a formal artifact. The summary below reflects the actual sequence of work from the repository history and implementation steps.

1. Set up the initial Next.js project skeleton and placeholder dashboard structure.
2. Added local mock JSON data and a typed mock/API access layer.
3. Implemented the dashboard summary, requirements table, detail page, tasks panel, and orphan panel.
4. Added requirements table filtering, sorting, and URL synchronization.
5. Polished loading, empty, error, and theme states.
6. Realigned the domain model to the official requirement language: `FR` / `AR`, `covered` / `partial` / `missing`, linked annotations, linked tasks, and orphan records.
7. Added Vitest and Testing Library coverage for the data layer and key UI components.
8. Implemented `scripts/check-coverage.ts` and linked `@req` comments back to `requirements.yaml`.
9. Finalized README/PROCESS documentation, repository metadata, and submission readiness details.

## Timeline

Exact wall-clock timestamps were not retained. This timeline is an honest relative sequence of the work:

1. Foundation: project skeleton, folders, placeholder components, and minimal routing.
2. Data layer: mock dataset, strict types, server-side loaders, and API-mode handling.
3. Feature pass: dashboard summary, requirements list, requirement detail, tasks, and orphan views.
4. Interaction pass: filters, sorting, URL sync, and detail-page context preservation.
5. Polish pass: empty states, error handling, loading states, and theme support.
6. Compliance pass: domain alignment, requirement traceability, tests, and submission documents.

## Key Decisions

- Keep the app mock-data-first so the submission remains deterministic and easy to review.
- Preserve a simple typed API boundary so the live API path can be implemented later without reshaping the UI.
- Keep requirements filtering and sorting local instead of introducing remote state or a heavier client data layer.
- Use comment-based `@req` traceability because it is transparent, easy to inspect, and sufficient for a take-home submission.
- Prefer focused unit/component tests over a larger browser automation setup for this scope.

## What the Developer Controlled

- Broke the assignment into bounded implementation steps instead of attempting the whole UI at once.
- Reviewed and simplified generated code before accepting it.
- Chose the final data model, naming, and UI wording to match the official task more closely.
- Decided which regressions needed fixes and which non-essential ideas were left out.
- Ran local validation through `npm run typecheck`, `npm run test:run`, `npm run check:coverage`, `npm run lint`, and `npm run build`.

## Course Corrections

- Theme refactors initially flattened the UI too much; semantic surfaces, borders, and hover states were strengthened without redesigning the layout.
- Early placeholder requirement IDs and statuses were replaced with the final assignment-aligned domain model.
- Task status wording was aligned from `todo` to `open` for closer compliance with the official wording.
- Requirement detail rendering was tightened so annotation file path and line number are both explicit.
- Requirements table wording was adjusted so the requirement status column and filters read as `Status` instead of `Coverage`.
- Documentation was reworked from generic notes into submission-oriented README and PROCESS files.

## Self-Assessment

Strengths of the final submission:

- The codebase stays small, explicit, and strict-TypeScript-friendly.
- The implemented feature set aligns closely with the official task without unnecessary abstraction.
- The mock dataset, tests, and traceability script are internally consistent.
- The repository is ready to review locally or via the deployed app.

Known limits:

- Live API mode remains a stub.
- Traceability validation proves references, not full correctness.
- There are no end-to-end browser tests.

Final public URLs:

- repository: `https://github.com/LONELYDARKNESS23/sdd_navigator_dashboard`
- deployed application: `https://sddnavigatordashboard.vercel.app`
