# Zugang: evidence for the AccessED judging criteria

Each criterion is scored 1 to 5. Below: what Zugang does for it and where to check.

## Barrier Removed

- **Barrier**: cost (agency fees; uni-assist fees paid for programmes the applicant never qualified for) and language (admission rules and terms mostly in German).
- **How Zugang removes it**: one free page applies the public rules to the applicant's own case: grade conversion, ECTS per subject area, language certificate, APS, uni-assist timing and fees. A failed requirement is visible before any fee is paid.
- **Concrete case**: Lin (invented) would meet the grade (2.125 against 2.5) but is 6 ECTS short in mathematics (30 of 36). Lin learns this before paying uni-assist EUR 75. Asserted in `tests/check.test.js` ("before/after (design section 8)") and `tests/data.test.js` ("Lin: ...").
- **Who**: applicants from China, India and Vietnam (APS countries) and their helpers; UI in English and Simplified Chinese.
- Evidence: `README.md` (before/after), `docs/img/lin-results-en.png`, `docs/img/lin-results-zh.png`.

## Learning Value

- Every result card shows the rule in one sentence, the calculation step by step, the source link with its verification status, and the next step. Code: `js/app.js` (`render`), strings in `js/i18n.js`.
- The grade card shows the formula with the applicant's numbers filled in (`js/grade.js`, `steps`), plus exact, cut and rounded values, because no rounding rule for degrees was found (the KMK rule that cuts covers school-leaving certificates only).
- The ECTS card shows the per-credit factor and each area's calculation (`js/ects.js`), labelled as an estimate.
- The glossary teaches 27 German admission terms in DE, EN and ZH with plain explanations (`data/glossary.json`, section 4 of the page, `docs/img/glossary.png`).
- German terms stay next to translations ("Bewerbungsfrist", "Modulhandbuch"), so users can read the official pages afterwards.

## Inclusive Experience

- Keyboard only: logical tab order, skip link, visible focus, focus moves to the results heading after "Check". Checked with Playwright: see `docs/build-log.md`, section "Accessibility check".
- Screen readers: labels on all fields, fieldsets with legends, `aria-live` results summary, `lang` attributes on German and Chinese text, status as icon plus text.
- Low vision: lowest measured text contrast 7.0:1; works at 200% zoom and 390 px width without horizontal scrolling (`docs/img/mobile-390.png`).
- Connectivity and cost: static files, no network calls, no account, works offline once loaded; prints and exports to Markdown.
- Language: English and Simplified Chinese, choice remembered (with a fallback when storage is blocked).

## Working Prototype & Explanation

- Runs with `python3 -m http.server 8000`; `?example=lin` opens straight on Lin's results.
- `node --test`: 39 tests, 39 passing, no dependencies (`docs/build-log.md` has the command output).
- Pure functions with small interfaces (`js/grade.js`, `js/ects.js`, `js/check.js`, `js/checklist.js`, `js/timeline.js`, `js/fees.js`), data in `data/*.json`.
- Honest about uncertainty: every fact in `data/rules.json` has a verification flag, and every source was re-checked on 2026-11-02 (7 of 9 facts verified, 1 partly verified, 1 is Zugang's own estimate; `docs/build-log.md`, "Local re-check"); unknown requirements show "ask the admissions office"; limitations listed in `README.md`.
- Design written before the code: `docs/superpowers/specs/2026-11-02-zugang-design.md`.
