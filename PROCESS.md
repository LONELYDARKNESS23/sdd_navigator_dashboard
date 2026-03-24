# Process Notes

## Scope and Approach

This repository was built as the ForEach Partners Next.js Frontend Engineer (AI-First) take-home. The goal was to deliver a small, inspectable SDD dashboard with a clear data model, traceability hooks, and a testable UI, without turning the submission into a large framework exercise.

The work was broken into bounded steps so the app stayed runnable after each change:

1. create the Next.js skeleton and basic folders
2. add a local mock dataset and a typed API layer
3. build the dashboard, requirement detail route, and supporting panels
4. add filtering, sorting, and URL-synced state to the requirements table
5. align the domain model with the assignment language
6. add tests and a requirement traceability script
7. polish the themes and submission documentation

## Translating the Specification Into Implementation Tasks

The assignment was first reduced to a few stable problem areas:

- requirement and evidence domain model
- mock data loading and API boundaries
- dashboard summary and requirement list
- requirement detail rendering
- task/orphan traceability surfaces
- testing and traceability validation

That decomposition made it easier to change one layer at a time without losing working behavior. It also helped when the early placeholder model had to be replaced with the final `FR` / `AR` requirement types and `covered` / `partial` / `missing` coverage states.

## How AI Was Used

AI assistance was used as a development accelerator, not as an unreviewed code dump.

It was useful for:

- generating the initial file and route skeleton
- drafting first-pass TypeScript types, mock loaders, and API stubs
- iterating quickly on component structure
- expanding repetitive tests once the UI stabilized
- drafting the requirement traceability script
- helping compare regressions after styling and theme refactors

The working pattern was consistent:

1. inspect the current codebase
2. choose one bounded change
3. generate or edit code for that change
4. review and simplify the result manually
5. run validation commands
6. fix regressions before moving on

## Review, Validation, and Manual Cleanup

Generated code was treated as a draft that needed manual review.

The main checks were:

- does the implementation still match the take-home language
- are types explicit and strict-friendly
- does the change fit the existing structure
- did the UI or behavior regress
- do tests still describe real behavior rather than stale assumptions

Validation relied on:

- `npm run test:run`
- `npm run check:coverage`
- `npm run lint`
- `npm run build`

Manual cleanup was especially important in a few places:

- the theme refactor initially weakened contrast and card hierarchy
- the mock domain had to be rewritten to match the official IDs and coverage states
- some test assertions had to be updated after labels and filtering semantics changed
- the traceability script needed a real implementation and a safer runtime command
- documentation had to be tightened so it matched the actual codebase and deliverables

## Regressions and How They Were Fixed

The most visible regressions came from theme work. Dark/light switching functioned, but panels, cards, and metadata blocks became too flat. The fix was not a redesign; it was a targeted pass on semantic surfaces, borders, and hover states so the existing layout regained hierarchy in both themes.

Another regression area was traceability semantics. Early placeholder requirements and statuses no longer matched the assignment once the domain was aligned. That required updating the mock dataset, UI labels, tests, and `@req` trace comments together so the repository stayed internally consistent.

## Testing and Traceability

Testing was added in layers rather than all at once.

The current suite covers:

- mock data and API happy paths
- malformed file and empty file edge cases
- coverage metric edge cases
- dashboard summary rendering
- requirements table rendering, filtering, sorting, and empty state behavior
- requirement detail rendering
- tasks panel behavior
- orphan panel behavior
- traceability script behavior

Traceability is handled by `scripts/check-coverage.ts`, which reads `requirements.yaml`, scans the repository for `@req` comments, and fails if any requirement lacks references. That does not replace functional testing, but it gives a lightweight, inspectable link between the listed requirements and the code/tests that address them.

## Tradeoffs

The main tradeoffs were deliberate:

- local mock data was prioritized over a live backend to keep the submission deterministic
- data filtering and sorting stay local instead of adding a heavier client data layer
- traceability is comment-based rather than inferred automatically
- tests focus on unit/component behavior instead of full browser automation

These choices keep the repository small, readable, and aligned with a take-home review workflow.

## What I Would Improve Next

With more time, the next steps would be:

- implement the live API path instead of leaving it as a stub
- add a typed validation layer for mock JSON/YAML inputs
- add browser-level coverage for the main dashboard and detail flow
- extend traceability reporting to distinguish implementation references from test references
- add deployment-specific documentation once the final hosted URL is available

## Remaining Manual Inputs

Final public URLs:

- repository: `https://github.com/LONELYDARKNESS23/sdd_navigator_dashboard`
- deployed application: `https://sddnavigatordashboard.vercel.app`

The codebase is submission-ready aside from values that only exist outside the repository:

- any final submission note required by the take-home instructions
