import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkProgramme, apsNeeded } from '../js/check.js';
import { documents } from '../js/checklist.js';

const load = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), 'utf8'));
const { rules } = load('rules.json');
const { personas } = load('personas.json');
const { programmes } = load('programmes.json');
const { terms } = load('glossary.json');
const prog = (id) => programmes.find((p) => p.id === id);
const persona = (id) => personas.find((p) => p.id === id);
const isUrl = (s) => typeof s === 'string' && /^https:\/\/[^\s]+$/.test(s);
const FLAGS = [true, 'partial', false];

test('every rule has id, EN and ZH text, a source field and a verified flag', () => {
  for (const r of rules) {
    assert.ok(r.id && r.text_en && r.text_zh, r.id);
    assert.ok(FLAGS.includes(r.verified), `${r.id} verified flag`);
    assert.ok('source' in r, `${r.id} source field`);
    assert.ok(r.source === null || isUrl(r.source), `${r.id} source is a URL or null`);
    if (r.verified === true) assert.ok(isUrl(r.source), `${r.id}: verified true needs a URL`);
    if (r.source === null && r.verified !== false) assert.ok(r.source_note, `${r.id}: needs a source note`);
  }
});

test('all appendix A facts are present', () => {
  const ids = rules.map((r) => r.id).sort();
  assert.deepEqual(ids, ['aps-countries', 'aps-fees', 'ects-estimate', 'ects-year', 'grade-formula',
    'grade-rounding', 'grade-two-pass', 'ua-fee', 'ua-timing']);
});

test('open questions and estimates are not marked verified; no APS amount is shown', () => {
  assert.equal(rules.find((r) => r.id === 'ects-estimate').verified, false);
  assert.notEqual(rules.find((r) => r.id === 'grade-rounding').verified, true);
  const aps = rules.find((r) => r.id === 'aps-fees');
  assert.doesNotMatch(`${aps.text_en} ${aps.text_zh}`, /\d/);
});

test('rule-backed documents mirror the rule flags', () => {
  const docs = documents(persona('lin'), prog('ds'));
  for (const d of docs.filter((x) => x.source)) {
    assert.equal(d.verified, rules.find((r) => r.id === d.source).verified, d.id);
  }
});

test('every glossary term has DE, EN, ZH and plain explanations in EN and ZH', () => {
  assert.ok(terms.length >= 25, `${terms.length} terms`);
  for (const t of terms) {
    for (const k of ['de', 'en', 'zh', 'explain_en', 'explain_zh']) assert.ok(t[k], `${t.de}: ${k}`);
    assert.ok(FLAGS.includes(t.verified), `${t.de}: verified`);
    assert.ok(t.source === null || isUrl(t.source), `${t.de}: source`);
    if (t.verified === true) assert.ok(isUrl(t.source));
  }
});

test('personas and programmes are labelled as examples', () => {
  for (const p of [...personas, ...programmes]) assert.equal(p.example, true, p.id);
  for (const p of programmes) assert.equal(p.university, 'Example University');
});

const statuses = (res) => Object.fromEntries(res.map((r) => [r.id, r.status]));

test('Lin: ECTS gap in mathematics (30 of 36), everything else met; APS needed', () => {
  const res = checkProgramme(persona('lin'), prog('ds'));
  assert.deepEqual(statuses(res), {
    grade: 'met', 'total-ects': 'met', 'ects-mathematics': 'not_met', 'ects-computer_science': 'met', language: 'met',
  });
  const m = res.find((r) => r.id === 'ects-mathematics').detail.params;
  assert.deepEqual([m.have, m.need, m.gap], [30, 36, 6]);
  assert.equal(res.find((r) => r.id === 'grade').detail.params.exact, 2.125);
  assert.equal(apsNeeded(persona('lin'), prog('ds')), true);
});

test('Priya: all requirements of the data science example met, APS still to obtain', () => {
  const res = checkProgramme(persona('priya'), prog('ds'));
  assert.ok(res.every((r) => r.status === 'met'), JSON.stringify(statuses(res)));
  assert.equal(res.find((r) => r.id === 'grade').detail.params.exact, 2.2);
  assert.ok(documents(persona('priya'), prog('ds')).some((d) => d.id === 'aps'));
});

test('Minh: language requirement of the German-taught example not met', () => {
  const res = checkProgramme(persona('minh'), prog('me'));
  const s = statuses(res);
  assert.equal(s.language, 'not_met');
  assert.equal(s.grade, 'met');
  // the example programme lists no minimum total ECTS: unknown, ask the admissions office
  assert.equal(s['total-ects'], 'unknown');
  assert.equal(res.find((r) => r.id === 'grade').detail.params.exact, 2.5);
});
