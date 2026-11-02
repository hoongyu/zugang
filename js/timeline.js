// Back-planning from the application deadline (Bewerbungsfrist).
// uni-assist: submit documents and pay at least 8 weeks before the deadline (rule "ua-timing").

export const UA_WEEKS_BEFORE = 8;

function parseISO(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function addDays(iso, days) {
  const d = parseISO(iso);
  if (!d) throw new RangeError(`invalid date: ${iso}`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * @param {{deadline:string|null, route:'uni-assist'|'direct'|null, apsNeeded:boolean, today:string}} input
 * @returns {{id:string, date:string|null, label:string, status:'ok'|'late'|'unknown', source:string|null}[]}
 *   `label` is an i18n key.
 */
export function timeline({ deadline, route, apsNeeded, today }) {
  if (!parseISO(today)) throw new RangeError('today must be YYYY-MM-DD');
  const items = [];
  const status = (date) => (date < today ? 'late' : 'ok');

  if (apsNeeded) {
    items.push({ id: 'aps', date: today, label: 'tl.aps', status: 'ok', source: 'aps-countries' });
  }
  if (!parseISO(deadline)) {
    items.push({ id: 'deadline', date: null, label: 'tl.deadlineUnknown', status: 'unknown', source: null });
    return items;
  }
  if (route === 'uni-assist') {
    const by = addDays(deadline, -7 * UA_WEEKS_BEFORE);
    items.push({ id: 'uni-assist', date: by, label: 'tl.uniAssist', status: status(by), source: 'ua-timing' });
  } else if (route === 'direct') {
    items.push({ id: 'direct', date: deadline, label: 'tl.direct', status: status(deadline), source: null });
  } else {
    items.push({ id: 'route', date: null, label: 'tl.routeUnknown', status: 'unknown', source: null });
  }
  items.push({ id: 'deadline', date: deadline, label: 'tl.deadline', status: status(deadline), source: null });
  return items.sort((a, b) => (a.date ?? '9999') < (b.date ?? '9999') ? -1 : 1);
}
