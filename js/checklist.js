// Document checklist. Generic items are commonly requested but not verified for any one programme:
// they carry verified:false and tell the user to check the programme page.
import { apsNeeded } from './check.js';

/**
 * @returns {{id:string, de:string, label:string, why:string, source:string|null, verified:true|'partial'|false}[]}
 *   `label` and `why` are i18n keys; `source` is a rule id from data/rules.json or null.
 */
export function documents(profile, programme) {
  const list = [
    { id: 'degree', de: 'Abschlusszeugnis (beglaubigte Kopie)', label: 'doc.degree', why: 'doc.degree.why', source: null, verified: false },
    { id: 'transcript', de: 'Notenübersicht / Transcript of Records', label: 'doc.transcript', why: 'doc.transcript.why', source: null, verified: false },
  ];
  if ((programme.areas || []).length > 0) {
    list.push({ id: 'modules', de: 'Modulhandbuch', label: 'doc.modules', why: 'doc.modules.why', source: null, verified: false });
  }
  list.push({ id: 'language', de: 'Sprachnachweis', label: 'doc.language', why: 'doc.language.why', source: null, verified: false });
  list.push({ id: 'cv', de: 'Lebenslauf', label: 'doc.cv', why: 'doc.cv.why', source: null, verified: false });
  if (apsNeeded(profile, programme)) {
    list.push({ id: 'aps', de: 'APS-Zertifikat (Akademische Prüfstelle)', label: 'doc.aps', why: 'doc.aps.why', source: 'aps-countries', verified: true });
  }
  if (programme.route === 'uni-assist') {
    list.push({ id: 'uni-assist', de: 'uni-assist-Bewerbung und Bearbeitungsentgelt', label: 'doc.uniAssist', why: 'doc.uniAssist.why', source: 'ua-fee', verified: true });
  }
  return list;
}
