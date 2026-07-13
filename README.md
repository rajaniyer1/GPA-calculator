# GradePath

A GPA calculator and student productivity app built with Angular 17. Track courses, compute weighted and unweighted GPA, manage multiple semesters, and plan the grades you need to hit a target GPA — all stored locally in the browser.

## Features

**GPA calculation**
- Add/remove courses with name, letter grade, credits (0–10), and course type (Regular / Honors / AP)
- Weighted and unweighted GPA, computed live as you edit
- Customizable grade scale (point values per letter grade) and Honors/AP weighting bonus
- Per-course "quality points" breakdown showing exactly how the GPA was derived
- No weighting bonus applied to D/F grades, matching typical school policy

**Semesters & history**
- Multiple semesters, each with its own course list
- Cumulative GPA computed across all semesters
- Rename, delete, or reset any semester independently
- All data auto-saves to `localStorage` — no accounts, no backend

**Goal tracking**
- Set a target cumulative GPA
- Enter how many credits you plan to take next
- See the average grade you'd need on those credits to hit your goal

**Export & share**
- Copy a plain-text GPA summary to the clipboard
- Export a semester (or full history) as JSON
- Print / save as PDF via the browser's print dialog

**UI**
- Custom design system (no Bootstrap) with light/dark themes that follow system preference or a manual toggle
- Responsive layout for desktop and mobile, with a collapsible nav on small screens
- Accessible forms (labelled inputs, `aria-live` GPA updates, focus-visible states, dialog semantics on confirmations)

## Tech stack

- Angular 17, standalone components, signals for state management
- `@angular/animations` for transitions
- Plain CSS with custom properties (design tokens) — no CSS framework
- Karma/Jasmine for unit tests

## Project structure

```
src/app/
  core/
    models/       Course, Semester, AppSettings types
    services/      GpaCalculatorService (pure GPA math), StorageService (localStorage + legacy migration),
                    AppStoreService (signals-based app state), ThemeService, ToastService
  shared/
    components/    Reusable confirm-dialog and toast components
  features/
    calculator/    Active semester: course editor, GPA breakdown, grade-scale editor
    history/       All semesters, cumulative GPA, semester management
    goal-tracker/   Target GPA planner
  app.component.*  Shell: nav, theme toggle, router outlet
  app.routes.ts     Route definitions
```

## Development

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200/`. The app reloads automatically on source changes.

## Build

```bash
ng build
```

Build artifacts are written to `dist/gpacalc`.

## Tests

```bash
ng test
```

Runs unit tests via Karma/Jasmine, including a dedicated suite for `GpaCalculatorService` covering weighted/unweighted math, weighting bonuses, the D/F bonus exemption, and the goal-tracker's required-GPA formula.

## Data & privacy

All course, semester, and settings data is stored in the browser's `localStorage`. Nothing is sent to a server. Clearing browser storage (or using "Reset everything") permanently deletes it — export a JSON backup first if you want to keep a copy.
