# Devpost submission (ready to paste)

**Project name**: Zugang
**Tagline**: A free, offline self-check for German master's admission that shows the rule, the calculation and the source behind every answer, in English and Chinese.
**Track**: Afford (main), Understand

## Inspiration

Applying to a German master's programme from abroad means piecing together grade conversion, ECTS credits per subject, the APS certificate and uni-assist fees and deadlines from many official pages, mostly in German. Many applicants pay an agency, or pay uni-assist fees for programmes they never qualified for. The information is public; what is missing is a tool that applies it to your own case and explains why.

## What it does

You enter your degree, grade, credits and language certificates, or load an invented example applicant. You pick an example programme or type in your programme's requirements. Zugang then:

- converts your grade to the German scale with the modified Bavarian formula, showing every step;
- estimates your ECTS per subject area and shows any gap;
- checks each requirement as met, not met or "unclear: ask the admissions office", never guessing;
- lists the documents, back-plans the timeline from the deadline and shows the uni-assist fee;
- explains 27 German admission terms in German, English and Chinese.

Every result shows the rule, the calculation, the source and how well that source is verified. The page works offline; nothing you type leaves the browser.

## How we built it

A static page: HTML, CSS and plain JavaScript modules, no libraries. The rules are pure functions (`grade.js`, `ects.js`, `check.js`, `checklist.js`, `timeline.js`, `fees.js`); facts live in JSON with a source URL and a verification flag each. 39 tests run with Node's built-in test runner. The design was written first (with Claude), then Claude Code built the app in one session from that design.

## Challenges

- **Not stating unverified rules as fact.** Each APS office sets its own fee, and the only official rounding rule we found (a KMK agreement: cut after one decimal) covers school-leaving certificates, not degrees. So the app shows no APS amount and shows both cut and rounded grades. The build session could not reach the source websites; a second pass re-checked every page and rewrote the statements the pages did not support before marking anything verified.
- **Two languages plus German terms.** UI strings mark German terms so they keep a German `lang` attribute inside English or Chinese sentences, for screen readers.
- **Credits that are not ECTS.** There is no official conversion, so the app uses a proportional estimate and labels it as one.

## Accomplishments that we're proud of

- The before/after numbers for Lin come from the code and are asserted by tests.
- Unknowns are explicit: a missing requirement gives "ask the admissions office", not a guess.
- Keyboard and screen-reader friendly, lowest measured text contrast 7.0:1, works at 390 px width and 200% zoom.

## What we learned

- The hardest part of an admission tool is honesty about uncertainty, not the arithmetic.
- Showing the calculation teaches more than a yes/no answer: users can redo it for another programme.
- Accessibility is cheaper when designed in: semantic HTML and text labels for status did most of the work.

## What's next

- Re-check the sources before each application cycle; fees and processing times change.
- Let users compare several programmes at once.
- More languages (Vietnamese, Hindi) and more glossary terms, reviewed by native speakers.
- Feedback from real applicants and student advisers.

## Built with

HTML, CSS, JavaScript (ES modules), JSON, Node.js test runner (`node --test`), Playwright and headless Microsoft Edge (checks and screenshots only, not part of the app). No libraries, no APIs.

## Learning story

- **Problem**: German master's admission rules are spread over many pages, mostly in German; applicants pay agencies or waste application fees.
- **User**: international applicants, especially from China, India and Vietnam, and the people helping them.
- **Solution**: a free offline page that applies the public rules to your case and explains each result with its rule, calculation and source, in English and Chinese.
- **Tools**: plain HTML, CSS and JavaScript; Node's test runner; Claude for the design and Claude Code for the code and docs.
- **Challenges**: conflicting or missing official rules; source sites unreachable during the build, so a second pass re-checked them; keeping German terms accessible inside two other languages.
- **What we learned**: say what is uncertain, show the calculation, design accessibility in from the start.

### One concrete before/after

Lin (an invented applicant) has a 4-year degree from China: 100-point scale, lowest pass 60, average 85, 160 credits, 20 in mathematics. The target is an example data science programme: minimum grade 2.5, at least 36 ECTS in mathematics, via uni-assist, deadline 2027-07-15.

- **Before**: Lin pays an agency, or reads a dozen German pages and is still not sure, and might pay the uni-assist fee anyway.
- **After**: in one page Lin sees German grade 2.125 (meets 2.5), 1.5 ECTS per credit so mathematics is 30 ECTS, 6 short of 36; APS needed, start now; uni-assist application and fee ideally by 2027-05-20; fee EUR 75 for one programme, EUR 105 for two. Each number has its calculation and source. (Values from the code, asserted in `tests/check.test.js`.)

## Try it

- Live demo: https://hoongyu.github.io/zugang/ (add `?example=lin` to open straight on Lin's results)
- Run locally: `git clone https://github.com/hoongyu/zugang.git`, `cd zugang`, `python3 -m http.server 8000`, open http://localhost:8000/ . Add `?example=lin` to open on Lin's results.
- Tests: `node --test` (Node 18 or later).

## Limitations

Rules differ by university; the grade formula gives orientation only; the ECTS conversion is an estimate; APS and language-test fees are not shown (the APS offices and the test providers publish them); whether the converted grade is cut or rounded is only partly verified; not legal advice; not affiliated with uni-assist, DAAD, APS or any university.

## Disclosure

- **Libraries**: none.
- **Data**: synthetic. All applicants and programmes are invented and labelled as examples. Rules cite public official pages (listed in the README).
- **Assets**: none besides our own screenshots; system fonts only.
- **AI assistance**: the owner, a master's student at TU Berlin, chose the problem, wrote the design together with Claude and reviews the build. Claude Code wrote the code and the docs in one cloud session; a local Claude Code session re-checked the sources the same day.
- **Prior work**: none. The first commit was made on 2026-11-02, inside the development period. The design was written a few hours before the code.

## Links

- Source: https://github.com/hoongyu/zugang
- Demo: https://hoongyu.github.io/zugang/
- Video: [VIDEO LINK: owner to add]
