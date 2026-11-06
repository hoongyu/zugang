# LaunchPad Hacks: Devpost paste sheet for Zugang

Every field of the Devpost project form, in the order the form shows it, with the final text. Copy the text inside each box exactly as it is; "About the project" is Markdown, which Devpost renders. This is the LaunchPad version of `docs/submission.md` (AccessED Hacks). Wohin is a separate entry with its own sheet.

- **Submit this one only after Zugang is public.** Once the owner agrees, the project window merges `mvp`, makes the repository public, turns on GitHub Pages and checks that the demo link below opens. Until then judges could open neither the code nor the demo.
- **Deadline:** 2026-11-20 17:00 Eastern Time (23:00 CET). One entry per project.
- **Required by the rules:** a working demo link, a build or recorded walkthrough with setup steps, and screenshots. All three are below. A video of 2 to 3 minutes is optional; if the AccessED video (script `docs/walkthrough.md`) is recorded in time, its link can go here too.
- **Judging (equal weight):** Innovation & Originality, Usefulness & Impact, Implementation & Functionality, Design & Presentation (which includes accessibility). Judging runs from 21 to 25 November, so every link must keep working until then.
- **Order:** join the hackathon on Devpost, start a project, fill in steps 1 to 3, check step 4, submit.
- If anything is added to Zugang before submitting, add it to the table in "Built during LaunchPad Hacks".

## Step 1: Project overview

**Project name**

```text
Zugang
```

**Elevator pitch** (153 of 200 characters)

```text
A free, offline self-check for German master's admission that shows the rule, the calculation and the source behind every answer, in English and Chinese.
```

**Thumbnail:** upload `docs/img/devpost-thumbnail.png` (3:2).

## Step 2: Project details

**About the project**

````markdown
## Inspiration

Applying to a German master's programme from abroad means piecing together grade conversion, ECTS credits per subject, the APS certificate and uni-assist fees and deadlines from many official pages, mostly in German. Many applicants pay an agency, or pay uni-assist fees for programmes they never qualified for. The information is public; what is missing is a tool that applies it to your own case and explains why.

## What it does

You enter your degree, grade, credits and language certificates, or load an invented example applicant. You pick an example programme or type in your programme's requirements. Zugang then:

- converts your grade to the German scale with the modified Bavarian formula, showing every step;
- estimates your ECTS per subject area and shows any gap;
- checks each requirement as met, not met or "unclear: ask the admissions office", never guessing;
- lists the documents, back-plans the timeline from the deadline and shows the uni-assist fee;
- explains 27 German admission terms in German, English and Chinese.

Every result shows the rule, the calculation, the source and how well that source is verified. The page works offline; nothing you type leaves the browser. Results can be printed or downloaded as Markdown.

### One concrete before/after

Lin (an invented applicant) has a 4-year degree from China: 100-point scale, lowest pass 60, average 85, 160 credits, 20 in mathematics. The target is an example data science programme: minimum grade 2.5, at least 36 ECTS in mathematics, via uni-assist, deadline 2027-07-15.

- **Before**: Lin pays an agency, or reads a dozen German pages and is still not sure, and might pay the uni-assist fee anyway.
- **After**: on one page Lin sees German grade 2.125 (meets 2.5); 1.5 ECTS per credit, so mathematics is 30 ECTS, 6 short of 36; APS needed, start now; uni-assist application and fee ideally by 2027-05-20; fee EUR 75 for one programme, EUR 105 for two. Each number has its calculation and source, and the tests assert these values.

## Who it is for

International students preparing to apply for a master's programme in Germany, especially from China, India and Vietnam, whose degrees need an APS certificate, and the friends or student advisers helping them.

## How we built it

A static page: HTML, CSS and plain JavaScript modules, with no libraries, no server and no network calls. The rules are pure functions (`grade.js`, `ects.js`, `check.js`, `checklist.js`, `timeline.js`, `fees.js`); the facts live in JSON with a source URL and a verification flag each. 39 tests run with Node's built-in test runner. The interface is in English and Simplified Chinese, and German terms carry a German `lang` attribute so screen readers pronounce them correctly. Playwright was used only for checks and screenshots; it is not part of the app.

## Built during LaunchPad Hacks

Everything in Zugang was made during the event (16 October to 20 November 2026). There is no earlier version and no pre-existing code. The git history shows each step; times are CET:

| When | What was made |
|---|---|
| 2 Nov, until 22:51 | Problem choice, check of the official sources, design document and build task (`docs/superpowers/specs/2026-11-02-zugang-design.md`, `docs/cloud-task.md`) |
| 2 Nov, 23:00 to 23:12 | Rule modules with tests; data (rules with sources, three example applicants and programmes, 27-term glossary); interface in English and Chinese; accessibility fixes; screenshots; README and docs |
| 2 Nov, 23:52 | Local re-check of every source: statements the pages did not support were rewritten, verification flags set, screenshots retaken |

Pre-existing work by others: only the public official pages that the rules cite. The app uses no libraries and no third-party assets, and only system fonts.

## Challenges we ran into

- **Not stating unverified rules as fact.** Each APS office sets its own fee, and the only official rounding rule we found (a KMK agreement: cut after one decimal) covers school-leaving certificates, not degrees. So the app shows no APS amount and shows both the cut and the rounded grade. The build session could not reach the source websites; a second pass re-checked every page and rewrote the statements the pages did not support before marking anything verified.
- **Two languages plus German terms.** UI strings mark German terms so they keep a German `lang` attribute inside English or Chinese sentences, for screen readers.
- **Credits that are not ECTS.** There is no official conversion, so the app uses a proportional estimate and labels it as one.

## Accomplishments that we're proud of

- The before/after numbers for Lin come from the code and are asserted by tests.
- Unknowns are explicit: a missing requirement gives "ask the admissions office", not a guess.
- 7 of the 9 rules are verified against official pages; the other two are shown as partly verified or as our own estimate.
- Keyboard and screen-reader friendly: lowest measured text contrast 7.0:1, works at 390 px width and at 200% zoom without horizontal scrolling.

## Limitations

- Rules differ by university and programme; users should always check the official page of their programme.
- The grade formula gives orientation only; universities may apply other rules.
- The ECTS conversion is an estimate; universities may convert by workload or by their own method.
- APS and language-test fees are not shown: the APS offices and the test providers publish them.
- Whether the converted grade is cut or rounded is only partly verified.
- All applicants and programmes in the app are invented examples; it has not been tested with real applicants yet.
- Not legal advice. Not affiliated with uni-assist, DAAD, APS or any university.

## What we learned

- The hardest part of an admission tool is honesty about uncertainty, not the arithmetic.
- Showing the calculation teaches more than a yes/no answer: users can redo it for another programme.
- Accessibility is cheaper when designed in: semantic HTML and text labels for status did most of the work.

## What's next for Zugang

- Feedback from real applicants and student advisers.
- Comparing several programmes at once.
- More languages (Vietnamese, Hindi) and more glossary terms, reviewed by native speakers.
- Re-checking the sources before each application cycle, since fees and processing times change.

## Try it out

- Live demo: https://hoongyu.github.io/zugang/ (add `?example=lin`, `?example=priya` or `?example=minh` to open straight on an example's results)
- Source code: https://github.com/hoongyu/zugang

## Run it locally

A browser, plus Python 3 only to serve the files:

```
git clone https://github.com/hoongyu/zugang.git
cd zugang
python3 -m http.server 8000
```

Then open http://localhost:8000/ . Tests: `node --test` (Node 18 or later, no dependencies).

## Contributions

Solo entry. The owner, hoongyu, a master's student at TU Berlin, chose the problem, wrote the design together with Claude and reviewed the build. Claude Code (Anthropic) wrote the code and the docs in one cloud session; a local Claude Code session re-checked every source the same day, corrected the data and the texts, and retook the screenshots.

## Disclosure

- **Libraries**: none.
- **Data**: synthetic. All applicants and programmes are invented and labelled as examples. The rules cite public official pages (listed in the README).
- **Assets**: none besides our own screenshots; system fonts only.
- **AI assistance**: as described under "Contributions".
- **Other hackathons**: Zugang was built for AccessED Hacks 2026 and is also entered there. This is its only LaunchPad entry.
````

**Built with** (paste; each comma-separated word becomes a tag)

```text
html, css, javascript, json, node.js, playwright
```

**"Try it out" links** (one per field)

```text
https://hoongyu.github.io/zugang/
```

```text
https://github.com/hoongyu/zugang
```

**Image gallery:** upload these from `docs/img/`, in this order: `lin-results-en.png`, `lin-results-zh.png`, `form-en.png`, `glossary.png`, `mobile-390.png`.

**Video demo link:** optional. Paste the AccessED video link if it is recorded in time; otherwise leave it empty.

## Step 3: Additional questions

The form may add questions of its own. These answers are ready:

| If it asks | Answer |
|---|---|
| Team members | Solo; nobody to invite |
| Student status | Master's student at TU Berlin |
| Built during the hackathon? | Yes: designed and built on 2 November 2026; the git history shows every step |
| AI tools used | Claude Code (Anthropic) wrote the code and the docs, and a second Claude Code session re-checked every source; the owner chose the problem, co-wrote the design and reviewed the build |
| Entered in other hackathons? | AccessED Hacks 2026, which it was built for |

## Step 4: Before pressing Submit

- [ ] https://hoongyu.github.io/zugang/ opens, and `?example=lin` shows Lin's results (the project window checks this as soon as GitHub Pages is on).
- [ ] The repository opens in a private browser window.
- [ ] The thumbnail and all five gallery images are uploaded.
- [ ] If a video link was added, it plays.
- [ ] Zugang is also submitted to AccessED Hacks; if it is not, delete the last line of "Disclosure".
