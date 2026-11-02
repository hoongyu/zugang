# Cloud task: Zugang MVP for AccessED Hacks

You are a cloud Claude Code session in hoongyu/zugang, a **private** repository. Build the MVP described in `docs/superpowers/specs/2026-11-02-zugang-design.md` (below: "the design"). Read this file first, then the design.

## 1. Deadlines (Berlin time; CET = UTC+1 since 2026-10-25; ET = UTC−5 since 2026-11-01)

| What | When |
|---|---|
| AccessED development period | 2026-10-17 00:00 ET to 2026-11-20 17:00 ET (2026-11-20 23:00 CET) |
| Judging / results | 2026-11-21 to 11-22 / 2026-11-23 |
| Links must stay live until | 2026-11-22 |
| This session | finish and push everything in this one session |

## 2. Hard rules

1. Work on a new branch `mvp` and push it. Do not push to `main`, do not merge, do not open a pull request, do not change repository settings, do not make the repository public, do not deploy.
2. No API keys, no accounts, no analytics, no runtime network calls, no CDN: the page works offline, and nothing the user types leaves the browser.
3. No npm or pip dependencies for the app or its tests. Tests run with `node --test`. Screenshot tooling that is already installed is fine (see T7).
4. Synthetic data only. Applicants and programmes are invented and labelled as examples. Do not scrape any website. No real person's data.
5. Never present an unverified rule as fact. Every fact in `data/rules.json` has a source URL and `verified: true`, `partial` or `false`, following appendix A. Before writing a fact, re-check its source with WebFetch where you can; if a page is blocked or says something different, record it in `docs/build-log.md` and downgrade the flag. Where sources conflict (APS fees, rounding of the converted grade), the app says so and links the official page.
6. Never invent numbers in the docs: every figure comes from a command you ran, from appendix A or from the design, and says which.
7. English for code, docs and commit messages. UI text in English and Simplified Chinese, with the German term kept next to the translation, for example "Vorprüfungsdokumentation (VPD)".
8. Do not claim anything about other hackathons or prizes.
9. Authorship, stated plainly in the README: the owner, a master's student at TU Berlin, chose the problem, wrote the design together with Claude and reviews the build; Claude Code wrote the code and the docs in this cloud session.

## 3. AccessED Hacks: rules that matter

- Devpost, organiser AccessEDnpo. Enrolled students of legal age, worldwide, solo allowed. The owner handles eligibility and posts the entry.
- Prior work is allowed, but the parts built during the development period must be clearly separated from older work. This repository was created on 2026-11-02, inside the period; there is no older code.
- Theme: a small working tool that removes one concrete barrier between people and learning: language, ability, connectivity or cost. Tracks: Understand (translation, plain-language explanations, captions), Interact (keyboard-friendly, readable interfaces, audio alternatives), Connect (offline, low bandwidth, old devices), Afford (open educational resources, free learning). Zugang's main track is Afford (it replaces paid agency help and prevents wasted application fees); it also serves Understand (plain-language explanations of German admission rules and terms).
- The entry needs: a Devpost page; a learning story (problem, user, solution, tools, challenges, what we learned, plus **one concrete before/after**); something judges can evaluate (live demo, downloadable build or recorded walkthrough, with install instructions and limitations); screenshots; an optional 2 to 3 minute video, captioned if possible; a source link; disclosure of libraries, datasets, assets, AI assistance and prior work.
- **Synthetic data only.**
- Judging, four equal criteria scored 1 to 5: **Barrier Removed**, **Learning Value**, **Inclusive Experience**, **Working Prototype & Explanation**. Ties go to Barrier Removed, then Learning Value. Technical complexity alone earns nothing: clarity, correctness and accessibility matter more than features.

## 4. Tasks

Commit after each task.

**T1 Skeleton.** `index.html`, `css/style.css`, `js/*.js` (ES modules), `data/*.json`, `tests/*.test.js`, `.gitignore`, and an MIT `LICENSE` (copyright 2026 hoongyu; the owner may change it). ES modules do not load over `file://` in Chrome, so the documented way to run locally is `python3 -m http.server 8000`.

**T2 Rules.** Implement the modules of design section 6 as pure functions with the interfaces given there, following design section 7, with the tests of design section 11. The before/after numbers of design section 8 must come out of the code, and a test must assert them.

**T3 Data.**
- `data/rules.json`: the facts of appendix A, each with `id`, `text_en`, `text_zh`, `source` and `verified`.
- `data/personas.json`: three invented applicants, each exercising a different path. Lin (China, as in design section 8, plus 70 credits in computer science and IELTS 6.5; result: ECTS gap in mathematics, everything else met). Priya (India; 10-point CGPA 8.0 with lowest pass 5.0, 4 years, 180 credits, TOEFL iBT 95; result: all requirements of the data science example met, APS still to obtain). Minh (Vietnam; 10-point scale, 7.5 with lowest pass 5.0, 4 years, a German B2 certificate; result: the language requirement of the German-taught example is not met).
- `data/programmes.json`: three invented programmes at "Example University". M.Sc. Data Science, English-taught: as in design section 8, plus IELTS 6.5 or TOEFL iBT 88 and at least 60 ECTS in computer science, minimum degree 180 ECTS. M.Sc. Mechanical Engineering, German-taught: minimum grade 2.7, DSH-2 or TestDaF 4 in all four parts, direct application, deadline 2027-05-31. M.Sc. Economics, English-taught: minimum grade 2.3, at least 30 ECTS in economics and 15 ECTS in mathematics or statistics, IELTS 7.0, via uni-assist, deadline 2027-01-15. All three apply the APS rule.
- `data/glossary.json`: about 25 German admission terms (for example Zulassung, Zulassungsvoraussetzungen, Bewerbungsfrist, Vorprüfungsdokumentation, Akademische Prüfstelle, beglaubigte Kopie, Modulhandbuch, Leistungspunkte, Notenumrechnung, Auflage, Zulassungsbescheid, Immatrikulation, Semesterbeitrag, zulassungsfrei, zulassungsbeschränkt, Numerus clausus, Sprachnachweis, DSH, TestDaF, Motivationsschreiben, Lebenslauf, Wintersemester, Sommersemester, Anerkennung, Hochschulzugangsberechtigung). Each has `de`, `en`, `zh`, a one-sentence plain explanation in English and in Chinese, and a source where one exists; anything you cannot source gets `verified: false`.

**T4 UI.** As in design sections 9 and 10. The language toggle remembers the choice in `localStorage`, wrapped in try/catch so the page still works without it. Print stylesheet; "Download as Markdown" of the results; footer disclaimer.

**T5 Accessibility check.** Go through design section 10 item by item and record each result in `docs/build-log.md`.

**T6 Tests.** `node --test` passes; record the command, the number of tests and the duration in the build log.

**T7 Screenshots.** If headless Chromium with Playwright is already available (an earlier cloud session in this environment captured screenshots with it), serve the page with `python3 -m http.server` and capture into `docs/img/`: Lin's results in English, the same in Chinese, the glossary, and the page at 390 px width. Otherwise list what to capture in the walkthrough.

**T8 Docs.**
- `README.md`: one-line pitch; the barrier and who it is for; the before/after (Lin, numbers from the tests); features; how to run (`python3 -m http.server 8000`, then http://localhost:8000/) and how the owner can deploy to GitHub Pages; accessibility; data and sources (appendix A, with verification status); limitations (rules differ by university; the grade formula is orientation only; the ECTS conversion is an estimate; APS and language-test fees are not shown because sources disagree; not legal advice; not affiliated with uni-assist, DAAD, APS or any university); AI and prior-work disclosure (repository created 2026-11-02, inside the development period; the design was written a few hours before the code; no earlier code); licence.
- `docs/judging.md`: one section per AccessED criterion with concrete evidence (files, tests, screenshots).
- `docs/submission.md`, ready to paste into Devpost: Inspiration, What it does, How we built it, Challenges, Accomplishments, What we learned, What's next, Built with; the learning story (problem, user, solution, tools, challenges, what we learned) with **one concrete before/after**; Try it; Limitations; Disclosure (libraries: none; data: synthetic; assets; AI assistance; prior work); Links (repository, plus demo and video placeholders for the owner).
- `docs/walkthrough.md`: a 2 to 3 minute screen-recording script: what to click, what to say, in short caption-friendly sentences.
- Optional, if time remains: `README.zh-CN.md`, with "English | 简体中文" links at the top of both READMEs.

**T9 Hand-off.** Finish `docs/build-log.md`: what was done, commands and results, blocked URLs, what failed, and the owner's checklist (review the app locally; deploy; make the repository public when ready; record the video; post on Devpost before 2026-11-20 23:00 CET). Push `mvp`.

Definition of done: `node --test` passes; the page runs from `python3 -m http.server` and Lin's example shows the numbers of design section 8; the docs above exist with no invented figures; branch `mvp` is pushed.

## Appendix A. Facts and sources

Checked on 2026-11-02 by the owner's local session. Re-check with WebFetch before use (hard rule 5).

| id | Fact | Source | Status |
|---|---|---|---|
| grade-formula | Modified Bavarian formula: N = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin), with Nmax the best grade, Nmin the lowest passing grade, Nd the applicant's grade. Universities describe the result as orientation only. University pages say uni-assist generally uses it, but not where the ZAB has other rules. | https://www.tum.de/studium/bewerbung/infoportal-bewerbung/bayerische-formel ; https://www.uni-hamburg.de/campuscenter/bewerbung/international/studium-mit-abschluss/anerkennung-auslaendischer-schulbildung/notenumrechner.html | true for the formula; re-check the uni-assist and ZAB sentence |
| grade-two-pass | The formula does not apply to grading scales with only two passing grades. | https://www.uni-marburg.de/de/fb02/studium/pruefungsbuero/anerkennungen/notenumrechnung-grade-conversion | true, as one university's statement; say so |
| grade-rounding | No official rule found on rounding versus cutting after one decimal. | none | false: show both values |
| aps-countries | An APS certificate is required for a master's application when the qualifying degree was obtained in China, Vietnam or India. Some third-party sources add Mongolia. | https://www.tum.de/en/studies/application/aps | true for CN, VN, IN; Mongolia unverified, leave it out of the rule |
| aps-fees | Fees differ between sources (for China, third parties quote RMB 2,500). Show no amount; link the official APS sites after verifying their URLs, or only the TUM page if you cannot. | none | false |
| ua-fee | uni-assist: EUR 75 for the first chosen programme, EUR 30 for each additional one in the same application semester; the fees cover processing regardless of the evaluation result. | https://uni-assist.de/en/how-to-apply/pay-all-fees/handling-fees ; https://uni-assist.de/en/faqs/pay-all-fees/ | true |
| ua-timing | uni-assist: submit and pay at least 8 weeks before the deadline; processing takes 4 to 6 weeks from receipt of the online application; applications are handled in order of arrival. | https://uni-assist.de/en/how-to-apply/plan-your-application/deadlines-processing-time | true |
| ects-year | 60 ECTS credits correspond to one year of full-time study; one credit corresponds to 25 to 30 hours of work. | ECTS Users' Guide 2015 (European Commission): find and verify the official URL | partial until the URL is verified |
| ects-estimate | Converting foreign credits proportionally (years × 60 / total credits) is our estimate, not an official rule. | none | false: label it as an estimate |
