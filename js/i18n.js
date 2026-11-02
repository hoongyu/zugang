// UI strings. Every key has `en` and `zh`. German terms are marked [[de:...]] so the UI can
// wrap them in <span lang="de"> and the Markdown export can print them plainly.
export const LANGS = ['en', 'zh'];

export const STRINGS = {
  'app.title': { en: 'Zugang', zh: 'Zugang' },
  'app.tagline': {
    en: 'A free self-check for international applicants to German master\'s programmes. Every result shows the rule, the calculation and the source.',
    zh: '面向申请德国硕士项目的国际学生的免费自查工具。每个结果都显示规则、计算过程和来源。',
  },
  'app.privacy': {
    en: 'Works offline. Nothing you type leaves your browser. Example applicants and programmes are invented.',
    zh: '可离线使用。你输入的内容不会离开浏览器。示例申请人和专业均为虚构。',
  },
  'skip': { en: 'Skip to the form', zh: '跳到表单' },
  'lang.switch': { en: '中文', zh: 'English' },
  'lang.switchLabel': { en: 'Switch language to Simplified Chinese', zh: '将语言切换为英语' },

  's1.title': { en: '1. Your profile', zh: '1. 你的情况' },
  's1.intro': { en: 'Enter your bachelor\'s degree, or load an example applicant.', zh: '填写你的本科学历，或载入一个示例申请人。' },
  'f.example': { en: 'Example applicant', zh: '示例申请人' },
  'f.example.none': { en: '(choose an example)', zh: '（选择一个示例）' },
  'btn.loadExample': { en: 'Load example', zh: '载入示例' },
  'fs.degree': { en: 'Degree', zh: '学位' },
  'f.country': { en: 'Country where you obtained your degree', zh: '取得学位的国家' },
  'country.CN': { en: 'China', zh: '中国' },
  'country.IN': { en: 'India', zh: '印度' },
  'country.VN': { en: 'Vietnam', zh: '越南' },
  'country.OTHER': { en: 'Another country', zh: '其他国家' },
  'f.years': { en: 'Years of full-time study', zh: '全日制学习年数' },
  'f.totalCredits': { en: 'Total credits of the degree (in your country\'s system)', zh: '学位总学分（按你所在国家的学分制）' },
  'fs.grade': { en: 'Grade ([[de:Notenumrechnung]], grade conversion)', zh: '成绩（[[de:Notenumrechnung]]，成绩换算）' },
  'f.nMax': { en: 'Best possible grade (e.g. 100)', zh: '最高可能成绩（例如 100）' },
  'f.nMin': { en: 'Lowest passing grade (e.g. 60)', zh: '最低及格成绩（例如 60）' },
  'f.nD': { en: 'Your grade (overall average)', zh: '你的成绩（总平均）' },
  'fs.areas': { en: 'Credits per subject area', zh: '各学科领域的学分' },
  'f.area': { en: 'Subject area {n}', zh: '学科领域 {n}' },
  'f.areaCredits': { en: 'Credits in subject area {n}', zh: '学科领域 {n} 的学分' },
  'area.none': { en: '(none)', zh: '（无）' },
  'area.mathematics': { en: 'mathematics', zh: '数学' },
  'area.statistics': { en: 'statistics', zh: '统计学' },
  'area.computer science': { en: 'computer science', zh: '计算机科学' },
  'area.economics': { en: 'economics', zh: '经济学' },
  'area.engineering': { en: 'engineering', zh: '工程' },
  'area.other': { en: 'other', zh: '其他' },
  'or': { en: ' or ', zh: '或' },
  'fs.lang': { en: 'Language certificates ([[de:Sprachnachweis]])', zh: '语言证书（[[de:Sprachnachweis]]）' },
  'f.test': { en: 'Certificate {n}', zh: '证书 {n}' },
  'f.score': { en: 'Score or level of certificate {n}', zh: '证书 {n} 的分数或等级' },
  'f.score.hint': {
    en: 'IELTS: band, e.g. 6.5. TOEFL iBT: total, e.g. 95. DSH: 1 to 3. TestDaF: the lowest of your four parts, 3 to 5. Other certificates: CEFR level, e.g. B2.',
    zh: '雅思：总分，例如 6.5。托福 iBT：总分，例如 95。DSH：1 至 3。TestDaF：四个部分中最低的成绩，3 至 5。其他证书：欧洲语言共同参考框架（CEFR）等级，例如 B2。',
  },
  'test.none': { en: '(none)', zh: '（无）' },
  'test.CEFR-de': { en: 'Other German certificate (CEFR level)', zh: '其他德语证书（CEFR 等级）' },
  'test.CEFR-en': { en: 'Other English certificate (CEFR level)', zh: '其他英语证书（CEFR 等级）' },

  's2.title': { en: '2. Target programme', zh: '2. 目标专业' },
  's2.intro': {
    en: 'Pick an example programme, or type in the requirements from your target programme\'s page.',
    zh: '选择一个示例专业，或按目标专业网页填写其要求。',
  },
  'f.programme': { en: 'Programme', zh: '专业' },
  'prog.custom': { en: 'My own programme (type in its requirements)', zh: '我自己的目标专业（填写其要求）' },
  'fs.custom': { en: 'Requirements of your programme ([[de:Zulassungsvoraussetzungen]])', zh: '你的专业的入学要求（[[de:Zulassungsvoraussetzungen]]）' },
  'f.custom.hint': { en: 'Leave a field empty if you do not know it: Zugang will say "ask the admissions office" instead of guessing.', zh: '不知道的项目请留空：Zugang 会提示“询问招生办公室”，而不会猜测。' },
  'f.minGrade': { en: 'Minimum German grade (e.g. 2.5)', zh: '德国最低成绩要求（例如 2.5）' },
  'f.minTotalEcts': { en: 'Minimum ECTS of the bachelor\'s degree (e.g. 180)', zh: '本科学位最低 ECTS 学分（例如 180）' },
  'f.reqArea': { en: 'Required subject area {n}', zh: '要求的学科领域 {n}' },
  'f.reqEcts': { en: 'Minimum ECTS in required subject area {n}', zh: '要求的学科领域 {n} 的最低 ECTS' },
  'f.reqTest': { en: 'Accepted language certificate', zh: '认可的语言证书' },
  'f.reqMin': { en: 'Minimum score or level', zh: '最低分数或等级' },
  'f.route': { en: 'Where you apply', zh: '申请途径' },
  'route.uni-assist': { en: 'via uni-assist', zh: '通过 uni-assist' },
  'route.direct': { en: 'directly at the university', zh: '直接向大学申请' },
  'route.unknown': { en: 'I don\'t know', zh: '不知道' },
  'f.deadline': { en: 'Application deadline ([[de:Bewerbungsfrist]])', zh: '申请截止日期（[[de:Bewerbungsfrist]]）' },
  'f.aps': { en: 'The university applies the APS rule', zh: '该大学执行 APS 规定' },
  'f.count': { en: 'Number of programmes you apply to via uni-assist this semester', zh: '本学期通过 uni-assist 申请的专业数量' },
  'btn.check': { en: 'Check my eligibility', zh: '检查我的申请条件' },

  's3.title': { en: '3. Results', zh: '3. 结果' },
  'results.empty': { en: 'Fill in sections 1 and 2, then press "Check my eligibility".', zh: '填写第 1、2 部分后，点击“检查我的申请条件”。' },
  'results.summary': {
    en: 'Results for {programme}: {met} met, {notMet} not met, {unknown} to clarify.',
    zh: '{programme} 的结果：{met} 项满足，{notMet} 项不满足，{unknown} 项待确认。',
  },
  'results.error': { en: 'Please check your input: {msg}', zh: '请检查你的输入：{msg}' },
  'err.scale': { en: 'the best and the lowest passing grade must differ.', zh: '最高成绩与最低及格成绩不能相同。' },
  'status.met': { en: 'Met', zh: '满足' },
  'status.not_met': { en: 'Not met', zh: '不满足' },
  'status.unknown': { en: 'Unclear: ask', zh: '不确定：请询问' },
  'status.ok': { en: 'On time', zh: '来得及' },
  'status.late': { en: 'Too late', zh: '已来不及' },
  'lbl.rule': { en: 'Rule', zh: '规则' },
  'lbl.calc': { en: 'Calculation', zh: '计算' },
  'lbl.source': { en: 'Source', zh: '来源' },
  'lbl.next': { en: 'Next step', zh: '下一步' },
  'lbl.status': { en: 'Status', zh: '状态' },
  'v.true': { en: 'verified', zh: '已核实' },
  'v.partial': { en: 'partly verified: check the source', zh: '部分核实：请查看来源' },
  'v.false': { en: 'not verified: no official source found', zh: '未核实：未找到官方来源' },
  'src.none': { en: 'No official source', zh: '无官方来源' },
  'src.programme': { en: 'The programme you selected or typed in', zh: '你选择或填写的专业' },
  'src.example': { en: 'Invented example programme', zh: '虚构的示例专业' },

  'res.grade': { en: 'Grade conversion ([[de:Notenumrechnung]])', zh: '成绩换算（[[de:Notenumrechnung]]）' },
  'res.grade.values': {
    en: 'German grade: exact {exact}; cut after one decimal {truncated}; rounded to one decimal {rounded}.',
    zh: '德国成绩：精确值 {exact}；保留一位小数（截断）{truncated}；保留一位小数（四舍五入）{rounded}。',
  },
  'res.grade.rule': {
    en: 'German grades run from 1.0 (best) to 4.0 (lowest pass). Foreign grades are usually converted with the modified Bavarian formula ([[de:modifizierte bayerische Formel]]).',
    zh: '德国成绩从 1.0（最好）到 4.0（最低及格）。外国成绩通常用修正巴伐利亚公式（[[de:modifizierte bayerische Formel]]）换算。',
  },
  'warn.grade.orientation': { en: 'The result is for orientation only.', zh: '结果仅供参考。' },
  'warn.grade.otherRules': { en: 'Universities may apply other rules, for example those of the ZAB.', zh: '大学可能采用其他规定，例如 ZAB 的规定。' },
  'warn.grade.twoPass': { en: 'The formula does not apply to scales with only two passing grades.', zh: '该公式不适用于只有两个及格等级的评分体系。' },
  'warn.grade.clamped': { en: 'Your grade lies outside the scale you entered, so the result was limited to 1.0 to 4.0. Check the scale.', zh: '你的成绩超出了所填写的分数范围，结果已限制在 1.0 至 4.0 之间。请检查分数范围。' },
  'res.ects': { en: 'Credits estimate ([[de:Leistungspunkte]], ECTS)', zh: '学分估算（[[de:Leistungspunkte]]，ECTS）' },
  'res.ects.values': {
    en: 'About {perCredit} ECTS per credit; your degree is about {degreeEcts} ECTS.',
    zh: '每个学分约合 {perCredit} ECTS；你的学位约为 {degreeEcts} ECTS。',
  },
  'res.ects.rule': {
    en: '60 ECTS correspond to one year of full-time study. Converting your credits proportionally (years × 60 / total credits) is Zugang\'s estimate: universities may convert by workload or by their own method.',
    zh: '60 ECTS 相当于一年全日制学习。按比例换算学分（学年数 × 60 / 总学分）是 Zugang 的估算：大学可能按学习量或自己的方法换算。',
  },
  'res.ects.none': { en: 'Enter years of study and total credits to see the estimate.', zh: '填写学习年数和总学分即可查看估算。' },
  'res.reqs': { en: 'Requirements ([[de:Zulassungsvoraussetzungen]])', zh: '入学要求（[[de:Zulassungsvoraussetzungen]]）' },
  'req.grade': { en: 'Minimum grade', zh: '最低成绩' },
  'req.total-ects': { en: 'Minimum ECTS of the degree', zh: '学位最低 ECTS' },
  'req.area': { en: 'Minimum ECTS in {areas}', zh: '{areas} 最低 ECTS' },
  'req.language': { en: 'Language ([[de:Sprachnachweis]])', zh: '语言（[[de:Sprachnachweis]]）' },
  'rule.grade': { en: 'Lower is better: your converted grade must be at or below the minimum.', zh: '数字越小越好：换算后的成绩必须等于或低于最低要求。' },
  'rule.total-ects': { en: '60 ECTS correspond to one year of full-time study, so a degree counts as years × 60 ECTS.', zh: '60 ECTS 相当于一年全日制学习，因此学位按学年数 × 60 ECTS 计算。' },
  'rule.area': { en: 'Credits per area are converted proportionally (an estimate, not an official rule).', zh: '各领域学分按比例换算（这是估算，不是官方规则）。' },
  'rule.language': { en: 'The programme accepts only the certificates it lists.', zh: '该专业只认可其列出的证书。' },

  'chk.grade.met': { en: 'Your German grade {exact} (cut {truncated}, rounded {rounded}) meets the minimum of {min}.', zh: '你的德国成绩 {exact}（截断 {truncated}，四舍五入 {rounded}）满足最低要求 {min}。' },
  'chk.grade.notMet': { en: 'Your German grade {exact} (cut {truncated}, rounded {rounded}) does not meet the minimum of {min}.', zh: '你的德国成绩 {exact}（截断 {truncated}，四舍五入 {rounded}）不满足最低要求 {min}。' },
  'chk.grade.rounding': {
    en: 'Your German grade {exact} meets the minimum of {min} one way but not the other (cut {truncated}, rounded {rounded}). No official rounding rule was found.',
    zh: '你的德国成绩 {exact} 按一种方式满足最低要求 {min}，按另一种方式则不满足（截断 {truncated}，四舍五入 {rounded}）。未找到官方的取舍规则。',
  },
  'chk.grade.noRequirement': { en: 'The programme\'s minimum grade is not known.', zh: '该专业的最低成绩要求未知。' },
  'chk.grade.noProfile': { en: 'Enter your grading scale and grade to compare with the minimum of {min}.', zh: '填写你的评分体系和成绩，以便与最低要求 {min} 比较。' },
  'chk.total.met': { en: 'Your degree is about {have} ECTS; the programme asks for at least {need}.', zh: '你的学位约为 {have} ECTS；该专业要求至少 {need}。' },
  'chk.total.notMet': { en: 'Your degree is about {have} ECTS; the programme asks for at least {need}.', zh: '你的学位约为 {have} ECTS；该专业要求至少 {need}。' },
  'chk.total.noRequirement': { en: 'The programme\'s minimum total ECTS is not known.', zh: '该专业的学位最低 ECTS 要求未知。' },
  'chk.total.noProfile': { en: 'Enter years of study and total credits to compare with {need} ECTS.', zh: '填写学习年数和总学分，以便与 {need} ECTS 比较。' },
  'chk.area.met': { en: '{areas}: about {have} ECTS (estimate); at least {need} needed.', zh: '{areas}：约 {have} ECTS（估算）；至少需要 {need}。' },
  'chk.area.notMet': { en: '{areas}: about {have} ECTS (estimate); {need} needed, so {gap} ECTS short.', zh: '{areas}：约 {have} ECTS（估算）；需要 {need}，还差 {gap} ECTS。' },
  'chk.area.noProfile': { en: '{areas}: {need} ECTS needed. Enter your degree and credits.', zh: '{areas}：需要 {need} ECTS。请填写学位和学分。' },
  'chk.lang.met': { en: 'Your certificate {have} meets the requirement ({accepted}).', zh: '你的证书 {have} 满足要求（{accepted}）。' },
  'chk.lang.notMet': { en: 'Your certificate {have} is not one of the accepted ones: {accepted}.', zh: '你的证书 {have} 不在认可范围内：{accepted}。' },
  'chk.lang.none': { en: 'No accepted certificate entered. Accepted: {accepted}.', zh: '未填写认可的证书。认可：{accepted}。' },
  'chk.lang.noRequirement': { en: 'The language requirement is not known.', zh: '语言要求未知。' },

  'next.askOffice': { en: 'Ask the admissions office of the programme.', zh: '请询问该专业的招生办公室。' },
  'next.enterGrade': { en: 'Enter your grading scale and grade in section 1.', zh: '请在第 1 部分填写评分体系和成绩。' },
  'next.enterDegree': { en: 'Enter years of study, total credits and credits per area in section 1.', zh: '请在第 1 部分填写学习年数、总学分和各领域学分。' },
  'next.gradeNotMet': { en: 'Ask whether the university converts grades differently, or look for programmes with a lower minimum grade.', zh: '询问大学是否用其他方式换算成绩，或寻找最低成绩要求较低的专业。' },
  'next.areaGap': {
    en: 'Look in your [[de:Modulhandbuch]] (module handbook) for courses that count towards this area, ask how the university converts credits, or take extra courses before applying.',
    zh: '在你的 [[de:Modulhandbuch]]（课程手册）中查找可计入该领域的课程，询问大学如何换算学分，或在申请前补修课程。',
  },
  'next.langTest': { en: 'Take one of the accepted tests before the deadline, or ask whether your certificate is accepted.', zh: '在截止日期前参加一项认可的考试，或询问你的证书是否被认可。' },

  'res.docs': { en: 'Documents', zh: '材料清单' },
  'res.docs.note': { en: 'Items marked "not verified" are commonly requested; check your programme page for the exact list and form.', zh: '标有“未核实”的项目是常见要求；具体清单和形式请查看专业网页。' },
  'doc.degree': { en: 'Degree certificate, certified copy', zh: '学位证书，经认证的复印件' },
  'doc.degree.why': { en: 'Proves your bachelor\'s degree.', zh: '证明你的本科学位。' },
  'doc.transcript': { en: 'Transcript of records', zh: '成绩单' },
  'doc.transcript.why': { en: 'Shows your grades and credits per course; the grade and ECTS checks are based on it.', zh: '列出各课程的成绩和学分；成绩和 ECTS 检查以此为依据。' },
  'doc.modules': { en: 'Module handbook or course descriptions', zh: '课程手册或课程描述' },
  'doc.modules.why': { en: 'Used to check your credits per subject area.', zh: '用于核查各学科领域的学分。' },
  'doc.language': { en: 'Language certificate', zh: '语言证书' },
  'doc.language.why': { en: 'Proves the language level the programme asks for.', zh: '证明达到该专业要求的语言水平。' },
  'doc.cv': { en: 'CV', zh: '简历' },
  'doc.cv.why': { en: 'Many programmes ask for one.', zh: '很多专业要求提交。' },
  'doc.aps': { en: 'APS certificate', zh: 'APS 证书' },
  'doc.aps.why': { en: 'Your degree is from China, India or Vietnam: you need the APS certificate for a master\'s application. Start now.', zh: '你的学位来自中国、印度或越南：申请硕士需要 APS 证书。请现在就开始办理。' },
  'doc.uniAssist': { en: 'uni-assist online application and handling fee', zh: 'uni-assist 在线申请及处理费' },
  'doc.uniAssist.why': { en: 'This programme receives applications via uni-assist.', zh: '该专业通过 uni-assist 接收申请。' },

  'res.timeline': { en: 'Timeline', zh: '时间安排' },
  'res.timeline.today': { en: 'Planned from today, {today}.', zh: '以今天（{today}）为起点规划。' },
  'tl.aps': { en: 'Apply for the APS certificate now. No official processing time was verified, so start early.', zh: '现在就申请 APS 证书。未核实到官方处理时长，请尽早开始。' },
  'tl.uniAssist': { en: 'Submit documents and pay uni-assist, at least 8 weeks before the deadline (processing takes 4 to 6 weeks).', zh: '向 uni-assist 提交材料并付款，至少在截止日期前 8 周（处理需要 4 至 6 周）。' },
  'tl.direct': { en: 'Submit your application directly to the university.', zh: '直接向大学提交申请。' },
  'tl.deadline': { en: 'Application deadline ([[de:Bewerbungsfrist]])', zh: '申请截止日期（[[de:Bewerbungsfrist]]）' },
  'tl.deadlineUnknown': { en: 'Deadline unknown: check the programme page.', zh: '截止日期未知：请查看专业网页。' },
  'tl.routeUnknown': { en: 'Route unknown (uni-assist or direct): ask the admissions office.', zh: '申请途径未知（uni-assist 或直接申请）：请询问招生办公室。' },

  'res.fees': { en: 'Fees', zh: '费用' },
  'fee.ua': { en: 'uni-assist handling fee ([[de:Bearbeitungsentgelt]]) for {n} programme(s): EUR {total}.', zh: '{n} 个专业的 uni-assist 处理费（[[de:Bearbeitungsentgelt]]）：{total} 欧元。' },
  'fee.ua.compare': { en: 'For comparison: 1 programme EUR {one}, 2 programmes EUR {two}. The fee is charged whatever the result.', zh: '对比：1 个专业 {one} 欧元，2 个专业 {two} 欧元。无论结果如何都要收费。' },
  'fee.direct': { en: 'Direct application: no uni-assist fee. The university may have its own fee; check its page.', zh: '直接申请：无需 uni-assist 费用。大学可能另有收费，请查看其网页。' },
  'fee.aps': { en: 'APS fee: not shown, because sources disagree. Check the official APS site for your country.', zh: 'APS 费用：不显示，因为各来源说法不一。请查看你所在国家的 APS 官方网站。' },
  'fee.lang': { en: 'Language test fees: not shown; see the test provider.', zh: '语言考试费用：不显示；请查看考试机构。' },

  'btn.print': { en: 'Print', zh: '打印' },
  'btn.md': { en: 'Download as Markdown', zh: '下载为 Markdown' },

  's4.title': { en: '4. Glossary of German admission terms', zh: '4. 德国录取术语表' },
  's4.intro': { en: 'German terms you will meet on university pages, with a plain explanation.', zh: '你会在大学网页上遇到的德语术语及其通俗解释。' },
  'g.filter': { en: 'Filter terms', zh: '筛选术语' },
  'g.de': { en: 'German', zh: '德语' },
  'g.en': { en: 'English', zh: '英语' },
  'g.zh': { en: 'Chinese', zh: '中文' },
  'g.explain': { en: 'Explanation', zh: '解释' },
  'g.count': { en: '{n} terms shown.', zh: '显示 {n} 个术语。' },

  'footer.disclaimer': {
    en: 'Not affiliated with uni-assist, DAAD, APS or any university. Not legal advice. Rules as of 2026-11-02. Always check the official pages of your programme.',
    zh: '与 uni-assist、DAAD、APS 及任何大学均无关联。不构成法律建议。规则截至 2026-11-02。请务必查看目标专业的官方网页。',
  },
  'footer.sources': { en: 'Sources and verification status', zh: '来源及核实状态' },
};

/** Look up a string and fill {params}. Falls back to English, then to the key itself. */
export function t(key, lang = 'en', params = {}) {
  const entry = STRINGS[key];
  const s = entry ? (entry[lang] ?? entry.en) : key;
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
}

/** Remove [[de:...]] markers for plain-text output. */
export function plain(s) {
  return s.replace(/\[\[de:([^\]]+)\]\]/g, '$1');
}

/** Escape HTML and turn [[de:...]] markers into <span lang="de">. */
export function rich(s) {
  const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return esc.replace(/\[\[de:([^\]]+)\]\]/g, '<span lang="de">$1</span>');
}
