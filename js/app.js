// UI wiring: reads the form, runs the pure rule functions, renders results, exports.
import { t, rich, plain, STRINGS } from './i18n.js';
import { convertGrade } from './grade.js';
import { estimateEcts } from './ects.js';
import { checkProgramme, apsNeeded } from './check.js';
import { documents } from './checklist.js';
import { timeline } from './timeline.js';
import { uniAssistFee } from './fees.js';

const AREAS = ['mathematics', 'statistics', 'computer science', 'economics', 'engineering', 'other'];
const COUNTRIES = ['CN', 'IN', 'VN', 'OTHER'];
const TESTS = ['IELTS', 'TOEFL iBT', 'DSH', 'TestDaF', 'CEFR-de', 'CEFR-en'];
const AREA_ROWS = 4;
const LANG_ROWS = 2;
const REQ_ROWS = 2;
const STORE_KEY = 'zugang.lang';

const $ = (id) => document.getElementById(id);
const state = { lang: 'en', data: null, last: null };

function readLang() {
  try {
    const v = localStorage.getItem(STORE_KEY);
    if (v === 'en' || v === 'zh') return v;
  } catch { /* storage unavailable: fall through */ }
  return (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
}
function saveLang(v) {
  try { localStorage.setItem(STORE_KEY, v); } catch { /* ignore */ }
}

const T = (key, params) => t(key, state.lang, params);
const H = (key, params) => rich(T(key, params));
const esc = (s) => rich(String(s));

/* ---------- static text and form building ---------- */

function option(value, label, selected = false) {
  const o = document.createElement('option');
  o.value = value;
  o.textContent = label;
  if (selected) o.selected = true;
  return o;
}

function fillSelect(sel, items) {
  const keep = sel.value;
  sel.replaceChildren(...items.map(([v, l]) => option(v, l)));
  if ([...sel.options].some((o) => o.value === keep)) sel.value = keep;
}

function buildRows() {
  const areaRows = $('area-rows');
  for (let i = 1; i <= AREA_ROWS; i++) {
    areaRows.insertAdjacentHTML('beforeend', `
      <div class="field"><label for="area${i}" data-i18n="f.area" data-n="${i}"></label><select id="area${i}"></select></div>
      <div class="field"><label for="credits${i}" data-i18n="f.areaCredits" data-n="${i}"></label>
        <input id="credits${i}" type="number" inputmode="decimal" min="0" step="any"></div>`);
  }
  const langRows = $('lang-rows');
  for (let i = 1; i <= LANG_ROWS; i++) {
    langRows.insertAdjacentHTML('beforeend', `
      <div class="field"><label for="test${i}" data-i18n="f.test" data-n="${i}"></label><select id="test${i}"></select></div>
      <div class="field"><label for="score${i}" data-i18n="f.score" data-n="${i}"></label>
        <input id="score${i}" type="text" autocomplete="off" aria-describedby="score-hint"></div>`);
  }
  const reqRows = $('req-rows');
  for (let i = 1; i <= REQ_ROWS; i++) {
    reqRows.insertAdjacentHTML('beforeend', `
      <div class="field"><label for="reqArea${i}" data-i18n="f.reqArea" data-n="${i}"></label><select id="reqArea${i}"></select></div>
      <div class="field"><label for="reqEcts${i}" data-i18n="f.reqEcts" data-n="${i}"></label>
        <input id="reqEcts${i}" type="number" inputmode="numeric" min="0" step="1"></div>`);
  }
}

function testLabel(v) {
  return v.startsWith('CEFR') ? T(`test.${v}`) : v;
}

function applyStaticText() {
  const { lang } = state;
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
  document.title = lang === 'zh' ? 'Zugang：德国硕士申请自查' : 'Zugang: German master\'s admission self-check';
  for (const el of document.querySelectorAll('[data-i18n]')) {
    el.innerHTML = H(el.dataset.i18n, { n: el.dataset.n ?? '' });
  }
  const toggle = $('lang-toggle');
  toggle.textContent = T('lang.switch');
  toggle.lang = lang === 'zh' ? 'en' : 'zh-Hans';
  toggle.setAttribute('aria-label', T('lang.switchLabel'));

  const d = state.data;
  fillSelect($('persona'), [['', T('f.example.none')], ...d.personas.map((p) => [p.id, lang === 'zh' ? p.label_zh : p.label_en])]);
  fillSelect($('country'), COUNTRIES.map((c) => [c, T(`country.${c}`)]));
  const areaOpts = [['', T('area.none')], ...AREAS.map((a) => [a, T(`area.${a}`)])];
  for (let i = 1; i <= AREA_ROWS; i++) fillSelect($(`area${i}`), areaOpts);
  for (let i = 1; i <= REQ_ROWS; i++) fillSelect($(`reqArea${i}`), areaOpts);
  const testOpts = [['', T('test.none')], ...TESTS.map((x) => [x, testLabel(x)])];
  for (let i = 1; i <= LANG_ROWS; i++) fillSelect($(`test${i}`), testOpts);
  fillSelect($('reqTest'), testOpts);
  fillSelect($('route'), [['uni-assist', T('route.uni-assist')], ['direct', T('route.direct')], ['', T('route.unknown')]]);
  fillSelect($('programme'), [...d.programmes.map((p) => [p.id, lang === 'zh' ? p.name_zh : p.name_en]), ['custom', T('prog.custom')]]);
  renderGlossary();
  renderRuleList();
  if (state.last) render(state.last, false);
}

/* ---------- reading the form ---------- */

const num = (id) => {
  const v = $(id).value.trim();
  if (v === '') return null;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

function parseCert(test, raw) {
  if (!test) return null;
  const v = raw.trim();
  if (test.startsWith('CEFR')) {
    const level = v.toUpperCase();
    return /^[ABC][12]$/.test(level) ? { test: 'CEFR', lang: test.slice(5), level } : null;
  }
  const score = Number(v.replace(',', '.'));
  return v !== '' && Number.isFinite(score) ? { test, score } : null;
}

function readProfile() {
  const groups = [];
  for (let i = 1; i <= AREA_ROWS; i++) {
    const area = $(`area${i}`).value;
    const credits = num(`credits${i}`);
    if (area && credits > 0) groups.push({ area, credits });
  }
  const languages = [];
  for (let i = 1; i <= LANG_ROWS; i++) {
    const c = parseCert($(`test${i}`).value, $(`score${i}`).value);
    if (c) languages.push(c);
  }
  return {
    country: $('country').value,
    degree: { years: num('years'), totalCredits: num('totalCredits') },
    grade: { nMax: num('nMax'), nMin: num('nMin'), nD: num('nD') },
    groups,
    languages,
  };
}

function readProgramme() {
  const id = $('programme').value;
  if (id !== 'custom') return state.data.programmes.find((p) => p.id === id);
  const areas = [];
  for (let i = 1; i <= REQ_ROWS; i++) {
    const a = $(`reqArea${i}`).value;
    const e = num(`reqEcts${i}`);
    if (a && e > 0) areas.push({ areas: [a], ects: e });
  }
  const test = $('reqTest').value;
  let language = null;
  if (test) {
    const raw = $('reqMin').value.trim();
    if (test.startsWith('CEFR')) {
      const lvl = raw.toUpperCase();
      if (/^[ABC][12]$/.test(lvl)) language = { anyOf: [{ test: 'CEFR', lang: test.slice(5), min: lvl }] };
    } else {
      const m = Number(raw.replace(',', '.'));
      if (raw !== '' && Number.isFinite(m)) language = { anyOf: [{ test, min: m }] };
    }
  }
  return {
    id: 'custom', example: false, name_en: T('src.programme'), name_zh: T('src.programme'),
    minGrade: num('minGrade'), minTotalEcts: num('minTotalEcts'), areas, language,
    route: $('route').value || null, deadline: $('deadline').value || null, aps: $('aps').checked,
  };
}

function loadPersona(id) {
  const p = state.data.personas.find((x) => x.id === id);
  if (!p) return;
  $('country').value = p.country;
  $('years').value = p.degree.years;
  $('totalCredits').value = p.degree.totalCredits;
  $('nMax').value = p.grade.nMax;
  $('nMin').value = p.grade.nMin;
  $('nD').value = p.grade.nD;
  for (let i = 1; i <= AREA_ROWS; i++) {
    const g = p.groups[i - 1];
    $(`area${i}`).value = g ? g.area : '';
    $(`credits${i}`).value = g ? g.credits : '';
  }
  for (let i = 1; i <= LANG_ROWS; i++) {
    const c = p.languages[i - 1];
    $(`test${i}`).value = c ? (c.test === 'CEFR' ? `CEFR-${c.lang}` : c.test) : '';
    $(`score${i}`).value = c ? (c.test === 'CEFR' ? c.level : c.score) : '';
  }
  $('programme').value = p.programme;
  $('custom').hidden = true;
}

/* ---------- computing ---------- */

export function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function compute() {
  const profile = readProfile();
  const programme = readProgramme();
  const g = profile.grade;
  let grade = null;
  if (g.nMax !== null && g.nMin !== null && g.nD !== null) {
    if (g.nMax === g.nMin) return { error: T('err.scale') };
    grade = convertGrade(g);
  }
  let ects = null;
  if (profile.degree.years > 0 && profile.degree.totalCredits > 0) ects = estimateEcts({ ...profile.degree, groups: profile.groups });
  const checks = checkProgramme(profile, programme);
  const aps = apsNeeded(profile, programme);
  const docs = documents(profile, programme);
  const tl = timeline({ deadline: programme.deadline, route: programme.route, apsNeeded: aps, today: today() });
  const count = Math.max(1, Math.round(num('count') || 1));
  const fee = programme.route === 'uni-assist' ? uniAssistFee(count) : null;
  return { profile, programme, grade, ects, checks, aps, docs, tl, fee, count, today: today() };
}

/* ---------- rendering ---------- */

const ICON = { met: '✓', ok: '✓', not_met: '✗', late: '!', unknown: '?' };
const rules = () => Object.fromEntries(state.data.rules.map((r) => [r.id, r]));

function areaText(areas) {
  return areas.map((a) => T(`area.${a}`)).join(T('or'));
}
function checkParams(c) {
  const p = { ...c.detail.params };
  if (Array.isArray(p.areas)) p.areas = areaText(p.areas);
  return p;
}
function checkTitle(c) {
  if (c.id.startsWith('ects-') && c.detail.params.areas) return T('req.area', { areas: areaText(c.detail.params.areas) });
  return T(`req.${c.id}`);
}
function ruleKey(c) {
  return c.id.startsWith('ects-') ? 'rule.area' : `rule.${c.id}`;
}

function sourceInfo(sourceId, programme) {
  if (!sourceId) {
    return { text: programme.example ? T('src.example') : T('src.programme'), url: null, verified: null };
  }
  const r = rules()[sourceId];
  if (!r) return { text: T('src.none'), url: null, verified: false };
  const ruleText = state.lang === 'zh' ? r.text_zh : r.text_en;
  return { text: r.source || (state.lang === 'en' && r.source_note) || ruleText, url: r.source, verified: r.verified };
}

function vflag(v) {
  if (v === null || v === undefined) return '';
  const k = v === true ? 'v.true' : v === 'partial' ? 'v.partial' : 'v.false';
  return ` <span class="vflag">(${H(k)})</span>`;
}
function sourceHtml(s) {
  const link = s.url ? `<a href="${esc(s.url)}" rel="noopener noreferrer">${esc(s.url)}</a>` : esc(s.text);
  return link + vflag(s.verified);
}
function badge(status) {
  return `<span class="badge ${status}"><span class="icon" aria-hidden="true">${ICON[status]}</span>${H(`status.${status}`)}</span>`;
}

function render(r, announce = true) {
  state.last = r;
  const body = $('results-body');
  if (r.error) {
    body.innerHTML = `<p class="notice">${H('results.error', { msg: r.error })}</p>`;
    $('live').textContent = plain(T('results.error', { msg: r.error }));
    $('actions').hidden = true;
    return;
  }
  const { programme } = r;
  const progName = state.lang === 'zh' ? programme.name_zh : programme.name_en;
  const counts = { met: 0, not_met: 0, unknown: 0 };
  for (const c of r.checks) counts[c.status]++;
  const summary = T('results.summary', { programme: progName, met: counts.met, notMet: counts.not_met, unknown: counts.unknown });
  const html = [];

  // Grade
  html.push(`<article class="card info"><h3>${H('res.grade')}</h3>`);
  if (r.grade) {
    html.push(`<p><strong>${H('res.grade.values', r.grade)}</strong></p>`);
    html.push(`<dl class="facts"><dt>${H('lbl.rule')}</dt><dd>${H('res.grade.rule')}</dd>`);
    html.push(`<dt>${H('lbl.calc')}</dt><dd>${r.grade.steps.map((s) => `<div class="calc">${esc(s)}</div>`).join('')}</dd>`);
    html.push(`<dt>${H('lbl.source')}</dt><dd>${sourceHtml(sourceInfo('grade-formula', programme))}<br>${sourceHtml(sourceInfo('grade-rounding', programme))}</dd></dl>`);
    html.push(`<ul class="warnings">${r.grade.warnings.map((w) => `<li>${H(w)}</li>`).join('')}</ul>`);
  } else {
    html.push(`<p>${H('next.enterGrade')}</p>`);
  }
  html.push('</article>');

  // ECTS
  html.push(`<article class="card info"><h3>${H('res.ects')}</h3>`);
  if (r.ects) {
    html.push(`<p><strong>${H('res.ects.values', { perCredit: r.ects.perCredit, degreeEcts: r.ects.degreeEcts })}</strong></p>`);
    html.push(`<dl class="facts"><dt>${H('lbl.rule')}</dt><dd>${H('res.ects.rule')}</dd>`);
    const steps = r.ects.steps.map((s, i) => (i === 0 ? s : s.replace(/^[^:]+/, (a) => T(`area.${a}`))));
    html.push(`<dt>${H('lbl.calc')}</dt><dd>${steps.map((s) => `<div class="calc">${esc(s)}</div>`).join('')}</dd>`);
    html.push(`<dt>${H('lbl.source')}</dt><dd>${sourceHtml(sourceInfo('ects-year', programme))}<br>${sourceHtml(sourceInfo('ects-estimate', programme))}</dd></dl>`);
  } else {
    html.push(`<p>${H('res.ects.none')}</p>`);
  }
  html.push('</article>');

  // Requirements
  html.push(`<h3 class="group">${H('res.reqs')}</h3>`);
  for (const c of r.checks) {
    const s = sourceInfo(c.source, programme);
    html.push(`<article class="card ${c.status}"><h3>${esc(checkTitle(c))} ${badge(c.status)}</h3>`);
    html.push(`<p>${H(c.detail.key, checkParams(c))}</p><dl class="facts">`);
    html.push(`<dt>${H('lbl.rule')}</dt><dd>${H(ruleKey(c))}</dd>`);
    html.push(`<dt>${H('lbl.source')}</dt><dd>${sourceHtml(s)}</dd>`);
    if (c.nextStep) html.push(`<dt>${H('lbl.next')}</dt><dd>${H(c.nextStep)}</dd>`);
    html.push('</dl></article>');
  }

  // Documents
  html.push(`<article class="card info"><h3>${H('res.docs')}</h3><p class="hint">${H('res.docs.note')}</p><ul class="docs">`);
  for (const d of r.docs) {
    const s = d.source ? sourceInfo(d.source, programme) : null;
    html.push(`<li><strong>${H(d.label)}</strong> (<span lang="de">${esc(d.de)}</span>): ${H(d.why)}${s ? ` ${H('lbl.source')}: ${sourceHtml(s)}` : vflag(d.verified)}</li>`);
  }
  html.push('</ul></article>');

  // Timeline
  html.push(`<article class="card info"><h3>${H('res.timeline')}</h3><p class="hint">${H('res.timeline.today', { today: r.today })}</p><ol class="timeline">`);
  for (const i of r.tl) {
    const s = i.source ? ` ${H('lbl.source')}: ${sourceHtml(sourceInfo(i.source, programme))}` : '';
    html.push(`<li><strong>${i.date ? `<time datetime="${i.date}">${i.date}</time>` : '—'}</strong> ${badge(i.status)} ${H(i.label)}${s}</li>`);
  }
  html.push('</ol></article>');

  // Fees
  html.push(`<article class="card info"><h3>${H('res.fees')}</h3><ul>`);
  if (r.fee) {
    html.push(`<li><strong>${H('fee.ua', { n: r.count, total: r.fee.total })}</strong><div class="calc">${esc(r.fee.steps)}</div>`);
    html.push(`${H('fee.ua.compare', { one: uniAssistFee(1).total, two: uniAssistFee(2).total })} ${H('lbl.source')}: ${sourceHtml(sourceInfo('ua-fee', programme))}</li>`);
  } else if (programme.route === 'direct') {
    html.push(`<li>${H('fee.direct')}</li>`);
  }
  if (r.aps) html.push(`<li>${H('fee.aps')} ${H('lbl.source')}: ${sourceHtml(sourceInfo('aps-fees', programme))}</li>`);
  html.push(`<li>${H('fee.lang')}</li></ul></article>`);

  body.innerHTML = html.join('\n');
  $('actions').hidden = false;
  $('live').textContent = summary;
  if (announce) $('s3-title').focus();
}

/* ---------- Markdown export ---------- */

export function toMarkdown(r, lang) {
  const L = (k, p) => plain(t(k, lang, p));
  const rl = Object.fromEntries(state.data.rules.map((x) => [x.id, x]));
  const src = (id) => (id && rl[id] ? `${rl[id].source || rl[id].source_note || L('src.none')} (verified: ${rl[id].verified})` : L('src.example'));
  const name = lang === 'zh' ? r.programme.name_zh : r.programme.name_en;
  const area = (a) => a.map((x) => t(`area.${x}`, lang)).join(t('or', lang));
  const out = [`# Zugang: ${name}`, '', `${L('res.timeline.today', { today: r.today })}`, ''];
  if (r.grade) {
    out.push(`## ${L('res.grade')}`, '', L('res.grade.values', r.grade), '', '```', ...r.grade.steps, '```', '');
    out.push(...r.grade.warnings.map((w) => `- ${L(w)}`), '', `${L('lbl.source')}: ${src('grade-formula')}`, '');
  }
  if (r.ects) {
    out.push(`## ${L('res.ects')}`, '', L('res.ects.values', r.ects), '', '```', ...r.ects.steps, '```', '', L('res.ects.rule'), '');
  }
  out.push(`## ${L('res.reqs')}`, '');
  for (const c of r.checks) {
    const p = { ...c.detail.params };
    if (Array.isArray(p.areas)) p.areas = area(p.areas);
    const title = c.id.startsWith('ects-') && c.detail.params.areas ? L('req.area', { areas: area(c.detail.params.areas) }) : L(`req.${c.id}`);
    out.push(`- **${title}: ${L(`status.${c.status}`)}.** ${L(c.detail.key, p)}${c.nextStep ? ` ${L('lbl.next')}: ${L(c.nextStep)}` : ''} (${L('lbl.source')}: ${src(c.source)})`);
  }
  out.push('', `## ${L('res.docs')}`, '');
  for (const d of r.docs) out.push(`- [ ] ${L(d.label)} (${d.de}): ${L(d.why)}${d.source ? ` (${L('lbl.source')}: ${src(d.source)})` : ` (${L('v.false')})`}`);
  out.push('', `## ${L('res.timeline')}`, '');
  for (const i of r.tl) out.push(`- ${i.date || '—'} [${L(`status.${i.status}`)}] ${L(i.label)}`);
  out.push('', `## ${L('res.fees')}`, '');
  if (r.fee) out.push(`- ${L('fee.ua', { n: r.count, total: r.fee.total })} (${r.fee.steps}; ${src('ua-fee')})`);
  if (r.programme.route === 'direct') out.push(`- ${L('fee.direct')}`);
  if (r.aps) out.push(`- ${L('fee.aps')} (${src('aps-fees')})`);
  out.push(`- ${L('fee.lang')}`, '', '---', '', L('footer.disclaimer'), '');
  return out.join('\n');
}

function download() {
  if (!state.last || state.last.error) return;
  const blob = new Blob([toMarkdown(state.last, state.lang)], { type: 'text/markdown;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `zugang-results-${state.last.today}.md`;
  document.body.append(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
}

/* ---------- glossary and sources ---------- */

function renderGlossary() {
  const q = $('g-filter').value.trim().toLowerCase();
  const terms = state.data.glossary.filter((g) => !q || [g.de, g.en, g.zh, g.explain_en, g.explain_zh].some((s) => s.toLowerCase().includes(q)));
  const lbl = { de: T('g.de'), en: T('g.en'), zh: T('g.zh'), ex: T('g.explain') };
  $('g-body').innerHTML = terms.map((g) => {
    const ex = state.lang === 'zh' ? g.explain_zh : g.explain_en;
    const exLang = state.lang === 'zh' ? 'zh-Hans' : 'en';
    const src = g.source ? ` <a href="${esc(g.source)}" rel="noopener noreferrer" aria-label="${esc(`${T('lbl.source')}: ${g.de}`)}">${H('lbl.source')}</a>` : '';
    return `<tr><td data-label="${esc(lbl.de)}" lang="de"><strong>${esc(g.de)}</strong></td>
      <td data-label="${esc(lbl.en)}" lang="en">${esc(g.en)}</td>
      <td data-label="${esc(lbl.zh)}" lang="zh-Hans">${esc(g.zh)}</td>
      <td data-label="${esc(lbl.ex)}"><span lang="${exLang}">${esc(ex)}</span>${src}${vflag(g.verified)}</td></tr>`;
  }).join('');
  $('g-count').textContent = T('g.count', { n: terms.length });
}

function renderRuleList() {
  const link = (u) => `<a href="${esc(u)}" rel="noopener noreferrer">${esc(u)}</a>`;
  $('rule-list').innerHTML = state.data.rules.map((r) => {
    const text = state.lang === 'zh' ? r.text_zh : r.text_en;
    const src = r.source ? [r.source, ...(r.sources_extra || [])].map(link).join(', ') : esc(r.source_note || T('src.none'));
    return `<li><strong>${esc(r.id)}</strong>: ${esc(text)}<br>${H('lbl.source')}: ${src}${vflag(r.verified)}</li>`;
  }).join('');
}

/* ---------- start ---------- */

async function loadJson(name) {
  const res = await fetch(`data/${name}.json`);
  if (!res.ok) throw new Error(`data/${name}.json: ${res.status}`);
  return res.json();
}

async function init() {
  const [r, p, pr, g] = await Promise.all(['rules', 'personas', 'programmes', 'glossary'].map(loadJson));
  state.data = { rules: r.rules, personas: p.personas, programmes: pr.programmes, glossary: g.terms };
  state.lang = readLang();
  buildRows();
  applyStaticText();

  $('lang-toggle').addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'zh' : 'en';
    saveLang(state.lang);
    applyStaticText();
    $('lang-toggle').focus();
  });
  $('load-persona').addEventListener('click', () => {
    const id = $('persona').value;
    if (id) { loadPersona(id); $('country').focus(); }
  });
  $('programme').addEventListener('change', () => { $('custom').hidden = $('programme').value !== 'custom'; });
  $('form').addEventListener('submit', (e) => { e.preventDefault(); render(compute()); });
  $('print').addEventListener('click', () => window.print());
  $('download').addEventListener('click', download);
  $('g-filter').addEventListener('input', renderGlossary);

  // Deep link for demos and screenshots: ?example=lin runs Lin's check immediately.
  const ex = new URLSearchParams(location.search).get('example');
  if (ex && state.data.personas.some((x) => x.id === ex)) {
    $('persona').value = ex;
    loadPersona(ex);
    render(compute(), false);
  }
}

if (typeof document !== 'undefined') {
  init().catch((err) => {
    document.getElementById('results-body').innerHTML =
      `<p class="notice">Could not load data (${rich(String(err.message))}). Run <code>python3 -m http.server 8000</code> in the project folder and open http://localhost:8000/.</p>`;
  });
}
// Exposed for checks in the browser console and tests that run in a DOM.
export { STRINGS };
