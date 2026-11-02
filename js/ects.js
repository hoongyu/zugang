// ECTS estimate per subject area. 60 ECTS = one year of full-time study.
// Proportional conversion (years × 60 / total credits) is OUR ESTIMATE, not an official rule.
import { roundTo } from './grade.js';

const n = (x) => String(roundTo(x, 3));

/**
 * @param {{years:number, totalCredits:number, groups:{area:string, credits:number}[]}} input
 * @returns {{perCredit:number, degreeEcts:number, groups:{area:string, credits:number, ects:number}[], steps:string[]}}
 */
export function estimateEcts({ years, totalCredits, groups = [] }) {
  if (!(years > 0) || !(totalCredits > 0)) {
    throw new RangeError('years and totalCredits must be positive numbers');
  }
  const perCreditRaw = (years * 60) / totalCredits;
  const perCredit = roundTo(perCreditRaw, 3);
  const degreeEcts = roundTo(years * 60, 1);
  const out = groups
    .filter((g) => g && g.area && g.credits > 0)
    .map((g) => ({ area: g.area, credits: g.credits, ects: roundTo(g.credits * perCreditRaw, 1) }));
  const steps = [
    `ECTS per credit = ${n(years)} × 60 / ${n(totalCredits)} = ${n(perCreditRaw)}`,
    ...out.map((g) => `${g.area}: ${n(g.credits)} × ${n(perCreditRaw)} = ${n(g.ects)} ECTS`),
  ];
  return { perCredit, degreeEcts, groups: out, steps };
}

/**
 * @param {{groups:{area:string, ects:number}[]}} estimate
 * @param {{areas:string[], ects:number}[]} required  each requirement may accept several areas (summed)
 * @returns {{area:string, areas:string[], have:number, need:number, gap:number}[]}
 */
export function compareEcts(estimate, required = []) {
  return required.map((req) => {
    const areas = Array.isArray(req.areas) ? req.areas : [req.area];
    const have = roundTo(
      estimate.groups.filter((g) => areas.includes(g.area)).reduce((s, g) => s + g.ects, 0),
      1,
    );
    const gap = roundTo(Math.max(0, req.ects - have), 1);
    return { area: areas.join(' / '), areas, have, need: req.ects, gap };
  });
}
