import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertGrade } from '../js/grade.js';

test('85 on a 100/60 scale gives 2.125 (Lin, design section 8)', () => {
  const r = convertGrade({ nMax: 100, nMin: 60, nD: 85 });
  assert.equal(r.exact, 2.125);
  assert.equal(r.truncated, 2.1);
  assert.equal(r.rounded, 2.1);
  assert.match(r.steps.at(-1), /2\.125/);
});

test('8.0 on a 10/5 scale gives 2.2', () => {
  const r = convertGrade({ nMax: 10, nMin: 5, nD: 8 });
  assert.equal(r.exact, 2.2);
  assert.equal(r.truncated, 2.2);
  assert.equal(r.rounded, 2.2);
});

test('best grade gives 1.0, lowest passing grade gives 4.0', () => {
  assert.equal(convertGrade({ nMax: 100, nMin: 60, nD: 100 }).exact, 1);
  assert.equal(convertGrade({ nMax: 100, nMin: 60, nD: 60 }).exact, 4);
});

test('scale where lower is better: best 1, lowest pass 4, grade 2 gives 2.0', () => {
  assert.equal(convertGrade({ nMax: 1, nMin: 4, nD: 2 }).exact, 2);
});

test('Nmax equal to Nmin is rejected', () => {
  assert.throws(() => convertGrade({ nMax: 5, nMin: 5, nD: 5 }), RangeError);
});

test('non-numbers are rejected', () => {
  assert.throws(() => convertGrade({ nMax: 100, nMin: 60, nD: '85' }), TypeError);
});

test('results are clamped to 1.0..4.0 with a warning', () => {
  const r = convertGrade({ nMax: 100, nMin: 60, nD: 50 });
  assert.equal(r.exact, 4);
  assert.ok(r.warnings.includes('warn.grade.clamped'));
});

test('always warns: orientation only, other rules, two-pass scales', () => {
  const r = convertGrade({ nMax: 100, nMin: 60, nD: 85 });
  for (const w of ['warn.grade.orientation', 'warn.grade.otherRules', 'warn.grade.twoPass']) {
    assert.ok(r.warnings.includes(w), w);
  }
});

test('cut and rounded differ where they should (2.55 -> 2.5 cut, 2.6 rounded)', () => {
  const r = convertGrade({ nMax: 100, nMin: 60, nD: 80.6 }); // 1 + 3 × 19.4 / 40 = 2.455
  assert.equal(r.exact, 2.455);
  assert.equal(r.truncated, 2.4);
  assert.equal(r.rounded, 2.5);
});
