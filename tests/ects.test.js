import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateEcts, compareEcts } from '../js/ects.js';

test('4 years and 160 credits give 1.5 ECTS per credit', () => {
  assert.equal(estimateEcts({ years: 4, totalCredits: 160, groups: [] }).perCredit, 1.5);
});

test('20 credits give 30 ECTS', () => {
  const e = estimateEcts({ years: 4, totalCredits: 160, groups: [{ area: 'mathematics', credits: 20 }] });
  assert.deepEqual(e.groups, [{ area: 'mathematics', credits: 20, ects: 30 }]);
  assert.equal(e.degreeEcts, 240);
});

test('a 36 ECTS requirement shows a gap of 6', () => {
  const e = estimateEcts({ years: 4, totalCredits: 160, groups: [{ area: 'mathematics', credits: 20 }] });
  const [c] = compareEcts(e, [{ areas: ['mathematics'], ects: 36 }]);
  assert.deepEqual(c, { area: 'mathematics', areas: ['mathematics'], have: 30, need: 36, gap: 6 });
});

test('alternative areas are summed (mathematics or statistics)', () => {
  const e = estimateEcts({ years: 3, totalCredits: 180, groups: [
    { area: 'mathematics', credits: 10 }, { area: 'statistics', credits: 6 }, { area: 'economics', credits: 40 },
  ] });
  const [c] = compareEcts(e, [{ areas: ['mathematics', 'statistics'], ects: 15 }]);
  assert.equal(c.have, 16);
  assert.equal(c.gap, 0);
});

test('invalid degree data is rejected', () => {
  assert.throws(() => estimateEcts({ years: 0, totalCredits: 160 }), RangeError);
  assert.throws(() => estimateEcts({ years: 4, totalCredits: 0 }), RangeError);
});
