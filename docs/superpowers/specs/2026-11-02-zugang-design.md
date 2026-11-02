# Zugang: design

Date: 2026-11-02. Status: approved by the owner in chat; written before any code. Built for AccessED Hacks 2026 (development period 2026-10-17 to 2026-11-20).

## 1. Summary

Zugang ("access", as in *Hochschulzugang*, access to higher education) is a free self-check for international applicants to German master's programmes. You enter your degree, grades, credits and language certificates, then pick an example programme or type in the requirements of your target programme. Zugang converts your grade to the German scale, estimates your ECTS per subject area, checks each requirement, and gives you a document checklist, a back-planned timeline and the official fees. Every result shows the rule, the calculation and the official source, in English and Simplified Chinese, with the German terms kept.

It is a static web page: no account, no API key, no server. It works offline, and nothing the user types leaves the browser.

## 2. Problem

Applying to a German master's programme from abroad means working through rules spread over many official pages, mostly in German:

- Foreign grades are converted to the German scale, usually with the modified Bavarian formula, and many programmes set a minimum grade.
- Programmes require minimum credits in specific subject areas, counted in ECTS, which most foreign degrees do not use.
- Applicants whose degree is from China, India or Vietnam need an APS certificate first.
- Many universities route applications through uni-assist, which charges EUR 75 for the first programme and EUR 30 for each additional one per semester, whatever the result, and asks for documents and payment at least 8 weeks before the deadline.

Many applicants pay agencies to do this for them, or pay uni-assist fees for programmes they were never eligible for. The information is public; what is missing is a tool that applies it to your own case and explains why.

Barrier removed: cost (agency fees, wasted application fees), and language (German admission terms and rules).

## 3. Users

- Primary: international students preparing to apply for a master's programme in Germany, especially from China, India and Vietnam (the APS countries).
- Secondary: anyone helping them, such as friends or student advisers, who wants a transparent calculation.

## 4. Scope

In:

1. Profile form, with three synthetic example applicants.
2. Grade conversion with the modified Bavarian formula, steps shown.
3. ECTS estimate per subject area, compared with programme requirements.
4. Requirement check against one programme: one of three synthetic example programmes, or requirements typed in by the user.
5. Document checklist, timeline, fees.
6. Glossary of about 25 German admission terms (DE, EN, ZH).
7. UI in English and Simplified Chinese; print and Markdown export.
8. Accessibility: keyboard only, screen reader, high contrast, no colour-only signals.

Out: a database of real programmes, scraping, accounts, an LLM chat, visa and housing, bachelor's admission (HZB, Studienkolleg) beyond glossary entries.

## 5. Approach (chosen: static page with rules as pure functions)

Considered:

1. **Static HTML/CSS/JS, rules as pure functions, data as JSON. Chosen.** Zero dependencies, works offline, instant for judges, tested with Node's built-in test runner, deployable on any static host.
2. Streamlit app. Needs a running server and loads slowly; nothing it adds is needed here.
3. LLM assistant that answers admission questions. Needs an API key and may invent requirements, which is exactly the failure this tool must avoid.

## 6. Architecture

```
profile + programme  ->  rules (pure functions)  ->  results  ->  UI (EN / ZH)
                              ^
                 data/*.json (facts with sources and verified flags)
```

Modules, each with one job and a small interface:

| Module | Job | Interface |
|---|---|---|
| `js/grade.js` | Modified Bavarian formula | `convertGrade({nMax, nMin, nD})` -> `{exact, truncated, rounded, steps, warnings}` |
| `js/ects.js` | ECTS estimate per subject area | `estimateEcts({years, totalCredits, groups})` -> `{perCredit, groups: [{area, credits, ects}], steps}`; `compareEcts(estimate, required)` -> `[{area, have, need, gap}]` |
| `js/check.js` | Requirement check | `checkProgramme(profile, programme)` -> `[{id, status, detail, nextStep, source}]`, status `met`, `not_met` or `unknown` |
| `js/checklist.js` | Documents | `documents(profile, programme)` -> `[{id, de, label, why, source, verified}]` |
| `js/timeline.js` | Back-planning | `timeline({deadline, route, apsNeeded, today})` -> `[{date, label, status}]`, status `ok` or `late` |
| `js/fees.js` | Official fees | `uniAssistFee(n)` -> `{total, steps}`; other fees as links only |
| `js/i18n.js` | UI strings | `t(key, lang)`; every key has `en` and `zh` |
| `js/app.js` | UI wiring | reads the form, renders results, exports |
| `data/rules.json` | Facts | each with a `source` URL and `verified: true`, `partial` or `false` |
| `data/personas.json`, `data/programmes.json`, `data/glossary.json` | Synthetic examples, glossary | plain JSON |

## 7. Rules

**Grade.** N = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin), where Nmax is the best possible grade, Nmin the lowest passing grade and Nd the applicant's grade. It also works for scales where a lower number is better, because it only uses differences. Clamp the result to 1.0 to 4.0. Show the exact value with up to three decimals, and both "cut after one decimal" and "rounded to one decimal", because we found no official rounding rule. Always show these warnings: the result is orientation only; universities may apply other rules (for example, the ZAB's); the formula does not apply to scales with only two passing grades.

**ECTS.** 60 ECTS correspond to one year of full-time study. Estimate: ECTS per credit = years × 60 / total credits of the degree; area ECTS = area credits × ECTS per credit. Label it as an estimate: universities may convert by workload or by their own method.

**APS.** Needed when the degree that qualifies for the master's was obtained in China, India or Vietnam. Sources disagree on the fees, so show no amount and link the official APS sites.

**uni-assist.** Fee: EUR 75 for the first programme, EUR 30 for each additional one in the same semester. Timing: submit documents and payment at least 8 weeks before the deadline; processing takes 4 to 6 weeks.

**Programme check.** Each programme lists: minimum German grade, minimum total ECTS of the degree, minimum ECTS per area, language requirement (CEFR level or test score), route (uni-assist or direct), deadline, and whether APS applies. A missing or unknown value gives `unknown` with "ask the admissions office", never a guess.

Sources and their verification status: `docs/cloud-task.md`, appendix A.

## 8. Synthetic data and the before/after

Three applicants and three programmes, all invented and labelled "example" in the UI. The before/after uses applicant Lin:

- 4-year bachelor's degree from China, 100-point scale, lowest passing grade 60, average 85, 160 credits in total, 20 of them in mathematics.
- Target: example programme "M.Sc. Data Science", minimum grade 2.5, at least 36 ECTS in mathematics, via uni-assist, deadline 2027-07-15.
- Expected results: German grade 2.125, which meets 2.5; 1.5 ECTS per credit, so mathematics comes to 30 ECTS, 6 short of 36; APS needed, start now; uni-assist documents and payment by 2027-05-20; fee EUR 75 for one programme, EUR 105 for two.

Before: Lin pays an agency, or reads a dozen German pages and still is not sure. After: ten minutes, with each number explained and sourced.

## 9. UI

One page, four sections: 1 Your profile, 2 Target programme, 3 Results (grade, ECTS, requirements, documents, timeline, fees), 4 Glossary. Language toggle EN / 中文. Pickers for the example applicants and programmes. Each result card: status icon plus text, the rule in one sentence, the calculation, the source link, the next step. Print stylesheet and "Download as Markdown". Footer: not affiliated with uni-assist, DAAD, APS or any university; not legal advice; rules as of 2026-11-02.

## 10. Accessibility

Semantic HTML; a label for every field; fieldsets with legends; logical tab order; visible focus; results announced through an `aria-live` region; text contrast at least 4.5:1; status never shown by colour alone; `lang` attributes on Chinese and German text; works at 200% zoom and at 390 px width; respects `prefers-reduced-motion`.

## 11. Testing

`node --test`, no dependencies:

- Grade: 85 on a 100/60 scale gives 2.125; 8.0 on a 10/5 scale gives 2.2; the best and the lowest passing grade give 1.0 and 4.0; a scale where lower is better (best 1, lowest pass 4, grade 2) gives 2.0; Nmax equal to Nmin is rejected.
- ECTS: 4 years and 160 credits give 1.5 per credit; 20 credits give 30 ECTS; a 36 ECTS requirement shows a gap of 6.
- Timeline: deadline 2027-07-15 gives uni-assist by 2027-05-20; a `today` after that date marks it late.
- Fees: 1 programme EUR 75, 2 EUR 105, 3 EUR 135.
- Check and checklist: Lin against the data science example gives the results in section 8; APS appears only for degrees from CN, IN or VN.
- Data: every rule has a source URL and a verified flag; every glossary term and UI string has EN and ZH.

## 12. Deliverables

README (English) with the AccessED learning story, the before/after, how to run, limitations, sources, and AI and prior-work disclosure; `docs/judging.md`, `docs/submission.md`, `docs/walkthrough.md`, `docs/build-log.md`; screenshots in `docs/img/`. The owner deploys (GitHub Pages or another static host), makes the repository public and submits.

## 13. Risks

| Risk | Mitigation |
|---|---|
| A wrong rule misleads an applicant | Only verified facts stated as fact; every result links its source; unknowns say "ask the admissions office" |
| Rules differ between universities | Requirements entered per programme; disclaimers on grade and ECTS |
| Learning Value judged weak | Every result explains its rule and shows the calculation; the glossary teaches the German terms |
| Synthetic-data rule | Only invented applicants and programmes; no scraping |
