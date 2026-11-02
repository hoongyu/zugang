// Modified Bavarian formula (modifizierte bayerische Formel).
// N = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin)
// Works for scales where a lower number is better, because only differences are used.

const EPS = 1e-9;

/** Round to `d` decimals, robust against binary floating point noise. */
export function roundTo(x, d) {
  const f = 10 ** d;
  return Math.round((x + Math.sign(x) * EPS) * f) / f;
}

/** Cut (truncate) after `d` decimals, robust against floating point noise. */
export function truncTo(x, d) {
  const f = 10 ** d;
  return Math.floor(x * f + EPS) / f;
}

function fmt(x) {
  return String(roundTo(x, 3));
}

/**
 * @param {{nMax:number, nMin:number, nD:number}} input
 * @returns {{exact:number, truncated:number, rounded:number, steps:string[], warnings:string[]}}
 *   `warnings` are i18n keys.
 */
export function convertGrade({ nMax, nMin, nD }) {
  for (const [name, v] of [['nMax', nMax], ['nMin', nMin], ['nD', nD]]) {
    if (typeof v !== 'number' || !Number.isFinite(v)) {
      throw new TypeError(`${name} must be a finite number`);
    }
  }
  if (nMax === nMin) {
    throw new RangeError('nMax and nMin must differ');
  }
  const raw = 1 + (3 * (nMax - nD)) / (nMax - nMin);
  const warnings = ['warn.grade.orientation', 'warn.grade.otherRules', 'warn.grade.twoPass'];
  let clamped = raw;
  if (raw < 1) clamped = 1;
  if (raw > 4) clamped = 4;
  if (clamped !== raw) warnings.push('warn.grade.clamped');

  const exact = roundTo(clamped, 3);
  const truncated = truncTo(clamped, 1);
  const rounded = roundTo(clamped, 1);

  const steps = [
    'N = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin)',
    `N = 1 + 3 × (${fmt(nMax)} − ${fmt(nD)}) / (${fmt(nMax)} − ${fmt(nMin)})`,
    `N = 1 + 3 × ${fmt(nMax - nD)} / ${fmt(nMax - nMin)} = ${fmt(raw)}`,
  ];
  if (clamped !== raw) steps.push(`N limited to the range 1.0 to 4.0: ${fmt(clamped)}`);
  return { exact, truncated, rounded, steps, warnings };
}
