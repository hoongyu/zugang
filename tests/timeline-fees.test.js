import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timeline, addDays } from '../js/timeline.js';
import { uniAssistFee } from '../js/fees.js';

test('deadline 2027-07-15 gives uni-assist by 2027-05-20', () => {
  const t = timeline({ deadline: '2027-07-15', route: 'uni-assist', apsNeeded: false, today: '2026-11-02' });
  const ua = t.find((x) => x.id === 'uni-assist');
  assert.equal(ua.date, '2027-05-20');
  assert.equal(ua.status, 'ok');
});

test('a today after the uni-assist date marks it late', () => {
  const t = timeline({ deadline: '2027-07-15', route: 'uni-assist', apsNeeded: false, today: '2027-05-21' });
  assert.equal(t.find((x) => x.id === 'uni-assist').status, 'late');
  assert.equal(t.find((x) => x.id === 'deadline').status, 'ok');
});

test('APS appears first, dated today, when needed', () => {
  const t = timeline({ deadline: '2027-07-15', route: 'uni-assist', apsNeeded: true, today: '2026-11-02' });
  assert.equal(t[0].id, 'aps');
  assert.equal(t[0].date, '2026-11-02');
});

test('direct route uses the deadline itself', () => {
  const t = timeline({ deadline: '2027-05-31', route: 'direct', apsNeeded: false, today: '2026-11-02' });
  assert.equal(t.find((x) => x.id === 'direct').date, '2027-05-31');
});

test('missing deadline gives unknown, not a guess', () => {
  const t = timeline({ deadline: null, route: 'uni-assist', apsNeeded: false, today: '2026-11-02' });
  assert.equal(t.at(-1).status, 'unknown');
});

test('addDays crosses month and year boundaries', () => {
  assert.equal(addDays('2027-01-15', -56), '2026-11-20');
});

test('uni-assist fee: 1 programme EUR 75, 2 EUR 105, 3 EUR 135', () => {
  assert.equal(uniAssistFee(1).total, 75);
  assert.equal(uniAssistFee(2).total, 105);
  assert.equal(uniAssistFee(3).total, 135);
  assert.equal(uniAssistFee(2).steps, 'EUR 75 + EUR 30 × 1 = EUR 105');
});

test('uni-assist fee rejects invalid counts', () => {
  assert.throws(() => uniAssistFee(-1), RangeError);
  assert.throws(() => uniAssistFee(1.5), RangeError);
});
