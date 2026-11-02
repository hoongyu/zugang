// Requirement check (Zulassungsvoraussetzungen) for one programme.
// A missing or unknown value gives status "unknown" with "ask the admissions office", never a guess.
import { convertGrade } from './grade.js';
import { estimateEcts, compareEcts } from './ects.js';

/** Countries whose degrees need an APS certificate for a master's application (rule "aps-countries"). */
export const APS_COUNTRIES = ['CN', 'IN', 'VN'];

export function apsNeeded(profile, programme) {
  return Boolean(programme && programme.aps !== false && profile && APS_COUNTRIES.includes(profile.country));
}

const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const isNum = (x) => typeof x === 'number' && Number.isFinite(x);

function item(id, status, key, params, nextStep, source) {
  return { id, status, detail: { key, params }, nextStep, source };
}

export function checkGrade(profile, programme) {
  const g = profile.grade;
  if (!isNum(programme.minGrade)) {
    return item('grade', 'unknown', 'chk.grade.noRequirement', {}, 'next.askOffice', 'grade-formula');
  }
  if (!g || !isNum(g.nMax) || !isNum(g.nMin) || !isNum(g.nD) || g.nMax === g.nMin) {
    return item('grade', 'unknown', 'chk.grade.noProfile', { min: programme.minGrade }, 'next.enterGrade', 'grade-formula');
  }
  const r = convertGrade(g);
  const params = { exact: r.exact, truncated: r.truncated, rounded: r.rounded, min: programme.minGrade };
  const okT = r.truncated <= programme.minGrade;
  const okR = r.rounded <= programme.minGrade;
  if (okT && okR) return item('grade', 'met', 'chk.grade.met', params, null, 'grade-formula');
  if (!okT && !okR) return item('grade', 'not_met', 'chk.grade.notMet', params, 'next.gradeNotMet', 'grade-formula');
  return item('grade', 'unknown', 'chk.grade.rounding', params, 'next.askOffice', 'grade-rounding');
}

function ectsEstimate(profile) {
  const d = profile.degree || {};
  if (!(d.years > 0) || !(d.totalCredits > 0)) return null;
  return estimateEcts({ years: d.years, totalCredits: d.totalCredits, groups: profile.groups || [] });
}

export function checkLanguage(profile, programme) {
  const req = programme.language;
  if (!req || !Array.isArray(req.anyOf) || req.anyOf.length === 0) {
    return item('language', 'unknown', 'chk.lang.noRequirement', {}, 'next.askOffice', null);
  }
  const certs = (profile.languages || []).filter((c) => c && c.test);
  const accepted = req.anyOf.map(optionLabel).join(' / ');
  for (const opt of req.anyOf) {
    for (const c of certs) {
      if (matches(c, opt)) {
        return item('language', 'met', 'chk.lang.met', { have: certLabel(c), accepted }, null, null);
      }
    }
  }
  if (certs.length === 0) {
    return item('language', 'not_met', 'chk.lang.none', { accepted }, 'next.langTest', null);
  }
  return item('language', 'not_met', 'chk.lang.notMet', { have: certs.map(certLabel).join(', '), accepted }, 'next.langTest', null);
}

function matches(cert, opt) {
  if (opt.test === 'CEFR') {
    return cert.test === 'CEFR' && cert.lang === opt.lang && CEFR.indexOf(cert.level) >= CEFR.indexOf(opt.min);
  }
  return cert.test === opt.test && isNum(cert.score) && cert.score >= opt.min;
}

export function optionLabel(opt) {
  if (opt.test === 'CEFR') return `CEFR ${opt.min} (${opt.lang})`;
  if (opt.test === 'DSH') return `DSH-${opt.min}`;
  if (opt.test === 'TestDaF') return `TestDaF ${opt.min} (all four parts)`;
  return `${opt.test} ${opt.min}`;
}

export function certLabel(c) {
  if (c.test === 'CEFR') return `CEFR ${c.level} (${c.lang})`;
  if (c.test === 'DSH') return `DSH-${c.score}`;
  if (c.test === 'TestDaF') return `TestDaF ${c.score} (lowest part)`;
  return `${c.test} ${c.score}`;
}

/**
 * @returns {{id:string, status:'met'|'not_met'|'unknown', detail:{key:string, params:object}, nextStep:string|null, source:string|null}[]}
 */
export function checkProgramme(profile, programme) {
  const out = [checkGrade(profile, programme)];
  const est = ectsEstimate(profile);

  // Minimum total ECTS of the degree
  if (!isNum(programme.minTotalEcts)) {
    out.push(item('total-ects', 'unknown', 'chk.total.noRequirement', {}, 'next.askOffice', 'ects-year'));
  } else if (!est) {
    out.push(item('total-ects', 'unknown', 'chk.total.noProfile', { need: programme.minTotalEcts }, 'next.enterDegree', 'ects-year'));
  } else {
    const params = { have: est.degreeEcts, need: programme.minTotalEcts };
    const ok = est.degreeEcts >= programme.minTotalEcts;
    out.push(item('total-ects', ok ? 'met' : 'not_met', ok ? 'chk.total.met' : 'chk.total.notMet', params, ok ? null : 'next.askOffice', 'ects-year'));
  }

  // Minimum ECTS per subject area
  for (const req of programme.areas || []) {
    const areas = req.areas;
    const id = `ects-${areas.join('-').replace(/\s+/g, '_')}`;
    if (!est) {
      out.push(item(id, 'unknown', 'chk.area.noProfile', { areas, need: req.ects }, 'next.enterDegree', 'ects-estimate'));
      continue;
    }
    const [c] = compareEcts(est, [req]);
    const params = { areas, have: c.have, need: c.need, gap: c.gap };
    out.push(c.gap > 0
      ? item(id, 'not_met', 'chk.area.notMet', params, 'next.areaGap', 'ects-estimate')
      : item(id, 'met', 'chk.area.met', params, null, 'ects-estimate'));
  }

  out.push(checkLanguage(profile, programme));
  return out;
}
