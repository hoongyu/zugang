# Build log: Zugang MVP

Cloud Claude Code session, 2026-11-02, branch `mvp`. Task: `docs/cloud-task.md`; design: `docs/superpowers/specs/2026-11-02-zugang-design.md`.

## Summary

The MVP is built and pushed to branch `mvp`. Nothing was pushed to `main`, nothing merged, no pull request opened, no repository settings changed, nothing deployed.

- `node --test`: **39 tests, 39 pass, 0 fail, duration_ms 202.48** (see "Tests").
- The page runs from `python3 -m http.server 8000`; Lin's example shows the numbers of design section 8 (checked in headless Chromium, see "Browser check").
- **All source websites were blocked** in this session (see "Blocked URLs"), so no fact could be re-checked. Following hard rule 5, every fact the owner had marked `true` is stored as `partial`. Re-check them before submitting.

## What was done, task by task (one commit each)

| Task | Result |
|---|---|
| T1 Skeleton | `LICENSE` (MIT, 2026 hoongyu), `package.json` (`"type": "module"`, no dependencies), `.gitignore` additions |
| T2 Rules | `js/grade.js`, `js/ects.js`, `js/check.js`, `js/checklist.js`, `js/timeline.js`, `js/fees.js`, interfaces as in design section 6; tests in `tests/` |
| T3 Data | `data/rules.json` (9 facts of appendix A), `data/personas.json` (Lin, Priya, Minh), `data/programmes.json` (3 example programmes), `data/glossary.json` (27 terms) |
| T4 UI | `index.html`, `css/style.css`, `js/i18n.js` (166 string keys, each with `en` and `zh`), `js/app.js`; language toggle stored in `localStorage` inside try/catch; print stylesheet; "Download as Markdown"; footer disclaimer |
| T5 Accessibility | checked item by item (below); three fixes committed |
| T6 Tests | below |
| T7 Screenshots | `docs/img/lin-results-en.png`, `lin-results-zh.png`, `glossary.png`, `form-en.png`, `mobile-390.png` (Playwright with the pre-installed Chromium, page served by `python3 -m http.server 8000`) |
| T8 Docs | `README.md`, `README.zh-CN.md`, `docs/judging.md`, `docs/submission.md`, `docs/walkthrough.md` |
| T9 Hand-off | this file; branch `mvp` pushed |

Implementation decisions worth reviewing:

- **APS is not one of the "met / not met" requirement rows.** It appears in the document checklist, the timeline ("start now") and the fees. Reason: the task's expected results ("Lin: ECTS gap in mathematics, everything else met"; "Priya: all requirements met, APS still to obtain") treat APS as a procedural step, not an eligibility criterion.
- **Grade against minimum**: met if both the cut and the rounded value meet the minimum, not met if neither does, otherwise `unknown` ("no official rounding rule", source `grade-rounding`).
- **Total ECTS of the degree** is computed as years × 60 (rule `ects-year`).
- **Example programmes without a stated minimum total ECTS** (Mechanical Engineering, Economics) show `unknown` / "ask the admissions office" for that row, as design section 7 requires, instead of an invented number.
- **Invented values not given in the task**: Priya's subject credits (mathematics 30, computer science 60), Minh's total credits (150) and engineering credits (90). Chosen so the expected results of the task come out; all are synthetic.
- **TestDaF** is entered as the lowest of the four parts, so "TestDaF 4 in all four parts" is a single comparison.
- `?example=lin|priya|minh` opens the page directly on an example's results (for demos and screenshots).

## Tests (T6)

Command, run in the repository root:

```
$ node --test
...
1..39
# tests 39
# suites 0
# pass 39
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 202.48166
```

Node v22.23.4. Test files: `tests/grade.test.js`, `tests/ects.test.js`, `tests/timeline-fees.test.js`, `tests/check.test.js`, `tests/data.test.js`. They cover every case listed in design section 11, including the before/after of design section 8 ("before/after (design section 8): Lin against the data science example") and the three personas' expected results.

## Browser check

Headless Chromium (Playwright, pre-installed), page at `http://localhost:8000/?example=lin`:

- Results summary: "Results for M.Sc. Data Science (example): 4 met, 1 not met, 0 to clarify."
- Grade card: "German grade: exact 2.125; cut after one decimal 2.1; rounded to one decimal 2.1."; calculation "N = 1 + 3 × 15 / 40 = 2.125".
- ECTS: "ECTS per credit = 4 × 60 / 160 = 1.5", "mathematics: 20 × 1.5 = 30 ECTS"; mathematics row "about 30 ECTS (estimate); 36 needed, so 6 ECTS short."
- Timeline: 2026-11-02 APS (start now), 2027-05-20 uni-assist, 2027-07-15 deadline. Fees: EUR 75; comparison "1 programme EUR 75, 2 programmes EUR 105".
- Priya: "5 met, 0 not met, 0 to clarify." Minh: "1 met, 1 not met, 1 to clarify." (language not met; total ECTS unknown because the example programme states none).
- Custom programme with all fields empty: "0 met, 0 not met, 3 to clarify."
- Markdown download works and contains the same values.
- No console errors, no page errors, and no requests to any host other than `localhost:8000`.
- `grep` for `http://` / `https://` in `index.html`, `css/`, `js/` found no URLs (source links live only in `data/*.json`).

## Accessibility check (T5), design section 10 item by item

Checked with Playwright scripts against the served page (Lin's results loaded unless noted).

| Item | How checked | Result |
|---|---|---|
| Semantic HTML | headings listed | Pass: one `h1`, `h2` per section ("1. Your profile", "2. Target programme", "3. Results", "4. Glossary of German admission terms", "Sources and verification status"), `main`, `header`, `footer`, `section` with `aria-labelledby`, `article` per result card, `table` with `th scope="col"` |
| A label for every field | every `input`/`select` checked for a non-empty `<label>` | Pass: 0 unlabelled fields |
| Fieldsets with legends | every `fieldset` checked for a non-empty `legend` | Pass: 5 of 5 |
| Logical tab order | pressed Tab 40 times from page load | Pass: skip link, language toggle, example picker, load button, degree fields, grade fields, area rows, language rows, programme, count, Check button, glossary filter, glossary table, source links. **Fixed**: the hidden Print/Download buttons were focusable because `.actions { display:flex }` overrode `hidden`; added `[hidden] { display:none !important }` |
| Visible focus | computed outline of each focused element | Pass: `solid 3px` on every focused control |
| Results announced via `aria-live` | attributes of `#live` | Pass: `role="status"`, `aria-live="polite"`, `aria-atomic="true"`; focus moves to the "3. Results" heading after submit |
| Keyboard-only use | chose Lin with arrow keys, Enter on "Load example", Enter on "Check" | Pass: results rendered, focus on `s3-title` |
| Text contrast at least 4.5:1 | computed contrast of 368 text elements against their effective background | Pass: minimum 7.0:1 (status badge "Met") |
| Status never by colour alone | every badge checked for text | Pass: icon plus text ("✓ Met", "✗ Not met", "? Unclear: ask", "✓ On time", "! Too late") |
| `lang` on Chinese and German text | counted elements | Pass: 46 elements with `lang="de"` (English UI with Lin's results), 28 with `lang="zh-Hans"` (glossary column); `<html lang>` switches to `zh-Hans` in Chinese mode; the toggle button carries the language of its own label |
| Works at 200% zoom | viewport 640 CSS px (1280 px at 200%) | Pass: no horizontal scroll (scrollWidth 640 = clientWidth 640) |
| Works at 390 px | viewport 390 px | Pass after fix: long source URLs overflowed (scrollWidth 434); added `overflow-wrap: anywhere` to links; now scrollWidth 390 = clientWidth 390. Glossary table reflows into labelled blocks |
| Respects `prefers-reduced-motion` | emulated `reduce`, read `scroll-behavior` | Pass: `auto` under reduce (smooth scrolling only with `no-preference`); there are no animations |
| Works without `localStorage` | `localStorage` getter made to throw | Pass: no errors; language toggle still works |

Also fixed: the glossary's "Source" links all had the same name; each now has an `aria-label` such as "Source: Akademische Prüfstelle (APS)".

Not checked (needs a human): a real screen reader (NVDA, VoiceOver), Windows High Contrast mode, and reading quality of the Chinese text by a native speaker.

## Blocked URLs (hard rule 5)

WebFetch failed for every source host with `getaddrinfo ENOTFOUND`: the host is outside this session's allowed network domains. After the tool reported this, no further sites were tried.

| URL | Result | Effect |
|---|---|---|
| https://www.tum.de/studium/bewerbung/infoportal-bewerbung/bayerische-formel | blocked (ENOTFOUND www.tum.de) | `grade-formula` true → partial |
| https://www.uni-hamburg.de/campuscenter/bewerbung/international/studium-mit-abschluss/anerkennung-auslaendischer-schulbildung/notenumrechner.html | blocked (ENOTFOUND www.uni-hamburg.de) | uni-assist / ZAB sentence not re-checked; part of `grade-formula` (partial) |
| https://www.uni-marburg.de/de/fb02/studium/pruefungsbuero/anerkennungen/notenumrechnung-grade-conversion | blocked (ENOTFOUND www.uni-marburg.de) | `grade-two-pass` true → partial |
| https://www.tum.de/en/studies/application/aps | blocked (ENOTFOUND www.tum.de) | `aps-countries` true → partial |
| https://uni-assist.de/en/how-to-apply/pay-all-fees/handling-fees | blocked (ENOTFOUND uni-assist.de) | `ua-fee` true → partial |
| https://uni-assist.de/en/how-to-apply/plan-your-application/deadlines-processing-time | blocked (ENOTFOUND uni-assist.de) | `ua-timing` true → partial |
| https://uni-assist.de/en/faqs/pay-all-fees/ | not tried (same host blocked) | — |
| ECTS Users' Guide 2015 | official URL not found (no search possible) | `ects-year` stays partial, `source: null` with a note |
| Official APS sites (China, India, Vietnam) | URLs not verified | not linked; the app links only the TUM APS page for fees (`aps-fees`, false) |

Glossary entries (counted with `node -e` over `data/glossary.json`): 27 terms; 4 cite a source URL (the blocked TUM and uni-assist pages) and are flagged `partial`; 1 more (Leistungspunkte) is `partial` because it rests on the `ects-year` rule, which has no verified URL; the other 22 are flagged `false`.

To fix: allow `www.tum.de`, `www.uni-hamburg.de`, `www.uni-marburg.de`, `uni-assist.de` (and `ec.europa.eu` or the ECTS guide's host) in the environment's network settings, or re-check the pages by hand, then set the flags in `data/rules.json` (and the matching `verified` values in `js/checklist.js` and `data/glossary.json`; `tests/data.test.js` checks that the checklist mirrors the rules).

## What failed or is incomplete

- No source could be re-checked (above). Nothing in the app is shown as "verified".
- The first Playwright accessibility run timed out waiting for a visible `<option>`; fixed in the script (`state: 'attached'`). Not an app bug.
- No real screen-reader test and no native-speaker review of the Chinese text.
- No video (needs the owner).

## Owner's checklist

1. Review the app locally: `git fetch origin mvp && git checkout mvp`, `python3 -m http.server 8000`, open http://localhost:8000/?example=lin ; run `node --test`.
2. Re-check the sources in "Blocked URLs" and update the flags (or allow the hosts and ask a session to do it). Find the official ECTS Users' Guide URL. Proofread the Chinese text.
3. Merge `mvp` into `main` yourself if you are happy with it.
4. Make the repository public when ready.
5. Deploy: GitHub Pages from the repository root (steps in `README.md`), and keep the link live until at least 2026-11-22.
6. Record the 2 to 3 minute video with `docs/walkthrough.md`; add captions.
7. Paste `docs/submission.md` into Devpost, fill in the demo and video links, add the screenshots from `docs/img/`, confirm eligibility, and post **before 2026-11-20 23:00 CET** (17:00 ET).
