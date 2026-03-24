# Process Notes

## Overview

This project was built as a small traceability dashboard rather than a generic admin shell. The work was approached in layers so the app could stay runnable after each step:

1. establish the Next.js project skeleton
2. wire local mock data into a minimal dashboard
3. add interaction to the requirements table
4. improve empty, error, loading, and theme states
5. align the domain model to the take-home specification
6. add testing and traceability validation

The goal was to keep the code explicit and easy to inspect, not to optimize for abstraction.

## Turning the Specification Into Work Items

The assignment was first broken into a few stable areas:

- domain model and mock data
- dashboard summary
- requirements table and detail route
- tasks/orphan traceability views
- theme handling
- test setup and traceability checks

That decomposition helped separate structural work from polish work. It also made it easier to preserve working behavior while changing the domain semantics from the initial placeholder dataset to the official `FR` / `AR` requirement model.

## AI-Assisted Workflow

AI assistance was used as a coding tool, not as a substitute for review.

It was useful for:

- generating the initial file/folder skeleton
- drafting straightforward TypeScript types and mock API stubs
- iterating on component markup quickly
- refactoring repeated UI styling into semantic classes
- scaffolding Vitest and Testing Library setup
- expanding repetitive but structured test coverage
- drafting the traceability script

The main pattern was:

1. inspect the current codebase
2. decide the next bounded change
3. generate or edit code for that change
4. review the result manually
5. run lint, tests, and build
6. fix regressions before moving on

## Review and Validation

Generated code was treated as a draft.

The main review checks were:

- does the implementation match the current requirement language
- does the change fit the existing architecture
- are the types still strict-friendly
- are there hidden behavior regressions
- do the tests still reflect the real UI instead of stale assumptions

Validation was done with:

- `npm run test:run`
- `npm run lint`
- `npm run build`
- `npm run check:coverage`

## Where Manual Adjustment Was Needed

Several areas needed manual correction after generation:

- theme work initially flattened the UI too much and had to be rebalanced
- the domain model had to be rewritten from placeholder IDs/statuses to the assignment-specific IDs and coverage states
- tests needed careful updates when labels appeared more than once in the UI
- the coverage script needed to be made real and then adjusted so it stayed lint-clean
- back-link behavior on the detail page needed explicit handling to preserve dashboard query context

These were the places where review mattered more than raw code generation speed.

## Regressions and Fixes

The largest regressions happened during theme refactoring. Dark/light switching worked, but the UI lost contrast and hierarchy. That was fixed by moving back toward stronger semantic surfaces and more deliberate border/card separation instead of relying on flat shared styling.

Another small regression area was tests: once the mock dataset and UI semantics changed, older assertions no longer matched the actual app. Those were corrected by rewriting the tests around the official requirement domain instead of patching them incrementally.

## Testing and Traceability

Testing was added in two layers:

- component and data-layer tests with Vitest and Testing Library
- traceability validation through `scripts/check-coverage.ts`

The test suite now covers:

- mock API loading
- malformed file handling
- coverage edge cases
- dashboard summary rendering
- requirements table filtering and sorting
- detail rendering
- tasks panel behavior
- orphan panel behavior

The traceability script adds a second check: it verifies that every requirement listed in `requirements.yaml` is referenced through `@req` comments somewhere in the codebase or tests.

This does not prove full correctness, but it does provide a lightweight, inspectable link between requirements and implementation/tests.

## Tradeoffs

A few tradeoffs were made intentionally:

- local mock data was prioritized over a live backend because it keeps the app deterministic and easy to review
- filtering and sorting remain local and explicit instead of introducing a heavier state or data-fetching layer
- the coverage check is comment-based rather than trying to infer traceability automatically
- tests focus on unit/component behavior rather than browser-level flows

Those choices keep the project small and readable for a take-home setting.

## What I Would Improve With More Time

- implement the live API path instead of leaving it as a stub
- add a small typed mock-data validation layer instead of trusting file shape at load time
- add e2e coverage for the main dashboard and detail flow
- make traceability checks richer by separating implementation references from test references in the report
- tighten the requirements table tests around URL state transitions further
- add clearer deployment documentation once a hosted version exists

## Placeholders

The current repository still needs a few manual values filled in outside the code:

- deployed demo URL
- repository URL
- any final submission notes required by the take-home prompt
