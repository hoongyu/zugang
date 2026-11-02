import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkProgramme, apsNeeded } from '../js/check.js';
import { documents } from '../js/checklist.js';
import { timeline } from '../js/timeline.js';
import { uniAssistFee } from '../js/fees.js';

// Lin and the data science programme exactly as in design section 8 (synthetic).
const lin = {
  country: 'CN',
  degree: { years: 4, totalCredits: 160 },
  grade: { nMax: 100, nMin: 60, nD: 85 },
  groups: [{ area: 'mathematics', credits: 20 }],
  languages: [],
};
const ds = {
  minGrade: 2.5,
  areas: [{ areas: ['mathematics'], ects: 36 }],
  route: 'uni-assist',
  deadline: '2027-07-15',
  aps: true,
};

test('before/after (design section 8): Lin against the data science example', () => {
  const res = checkProgramme(lin, ds);
  const grade = res.find((r) => r.id === 'grade');
  assert.equal(grade.status, 'met');
  assert.equal(grade.detail.params.exact, 2.125);
  assert.equal(grade.detail.params.min, 2.5);

  const math = res.find((r) => r.id === 'ects-mathematics');
  assert.equal(math.status, 'not_met');
  assert.deepEqual(
    { have: math.detail.params.have, need: math.detail.params.need, gap: math.detail.params.gap },
    { have: 30, need: 36, gap: 6 },
  );

  assert.equal(apsNeeded(lin, ds), true);
  const t = timeline({ deadline: ds.deadline, route: ds.route, apsNeeded: true, today: '2026-11-02' });
  assert.equal(t[0].id, 'aps');
  assert.equal(t.find((x) => x.id === 'uni-assist').date, '2027-05-20');
  assert.equal(uniAssistFee(1).total, 75);
  assert.equal(uniAssistFee(2).total, 105);
});

test('APS appears only for degrees from CN, IN or VN', () => {
  for (const c of ['CN', 'IN', 'VN']) {
    assert.ok(documents({ ...lin, country: c }, ds).some((d) => d.id === 'aps'), c);
  }
  for (const c of ['MN', 'PK', 'BR', 'DE', 'OTHER']) {
    assert.ok(!documents({ ...lin, country: c }, ds).some((d) => d.id === 'aps'), c);
    assert.equal(apsNeeded({ ...lin, country: c }, ds), false);
  }
});

test('APS is not required when the programme says so', () => {
  assert.equal(apsNeeded(lin, { ...ds, aps: false }), false);
});

test('missing requirement values give unknown with "ask the admissions office"', () => {
  const res = checkProgramme(lin, { areas: [] });
  for (const id of ['grade', 'total-ects', 'language']) {
    const r = res.find((x) => x.id === id);
    assert.equal(r.status, 'unknown', id);
    assert.equal(r.nextStep, 'next.askOffice', id);
  }
});

test('missing profile values give unknown, never a guess', () => {
  const res = checkProgramme({ country: 'CN' }, { ...ds, minTotalEcts: 180 });
  assert.equal(res.find((x) => x.id === 'grade').status, 'unknown');
  assert.equal(res.find((x) => x.id === 'total-ects').status, 'unknown');
  assert.equal(res.find((x) => x.id === 'ects-mathematics').status, 'unknown');
});

test('a grade between cut and rounded thresholds is unknown (no official rounding rule)', () => {
  // exact 2.455 -> cut 2.4, rounded 2.5; with min 2.4 the outcome depends on rounding
  const p = { ...lin, grade: { nMax: 100, nMin: 60, nD: 80.6 } };
  const r = checkProgramme(p, { ...ds, minGrade: 2.4 }).find((x) => x.id === 'grade');
  assert.equal(r.status, 'unknown');
  assert.equal(r.source, 'grade-rounding');
});

test('language: TestDaF uses the lowest of the four parts; CEFR certificate does not replace DSH/TestDaF', () => {
  const prog = { language: { anyOf: [{ test: 'DSH', min: 2 }, { test: 'TestDaF', min: 4 }] } };
  const ok = checkProgramme({ languages: [{ test: 'TestDaF', score: 4 }] }, prog).find((x) => x.id === 'language');
  assert.equal(ok.status, 'met');
  const low = checkProgramme({ languages: [{ test: 'TestDaF', score: 3 }] }, prog).find((x) => x.id === 'language');
  assert.equal(low.status, 'not_met');
  const b2 = checkProgramme({ languages: [{ test: 'CEFR', lang: 'de', level: 'B2' }] }, prog).find((x) => x.id === 'language');
  assert.equal(b2.status, 'not_met');
});

test('language: CEFR requirement compares levels', () => {
  const prog = { language: { anyOf: [{ test: 'CEFR', lang: 'en', min: 'B2' }] } };
  const c1 = checkProgramme({ languages: [{ test: 'CEFR', lang: 'en', level: 'C1' }] }, prog);
  assert.equal(c1.find((x) => x.id === 'language').status, 'met');
  const de = checkProgramme({ languages: [{ test: 'CEFR', lang: 'de', level: 'C1' }] }, prog);
  assert.equal(de.find((x) => x.id === 'language').status, 'not_met');
});
