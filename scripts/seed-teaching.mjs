/** Rebuilds the teaching collection from the real module record. */
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'c:/Users/JFLWi/jameswil/jameswil/src/content/teaching';

const NEWMAN = 'Birmingham Newman University';
const UON = 'University of Nottingham';

const M = [
  // 2025/26 prepared but not yet delivered
  { code: 'CMU5XX', title: 'Software Security', year: '2025/26', semester: 'Semester 1', status: 'Upcoming', credits: '20 credits', institution: NEWMAN, tags: ['Software security', 'Secure development'] },
  { code: 'CMU6XX-CF', title: 'Cyber Forensics', year: '2025/26', semester: 'Semester 1', status: 'Upcoming', credits: '20 credits', institution: NEWMAN, tags: ['Digital forensics', 'Cyber security'] },
  { code: 'CMU6XX', title: 'Ethical Hacking', year: '2025/26', semester: 'Semester 1', status: 'Upcoming', credits: '20 credits', institution: NEWMAN, tags: ['Ethical hacking', 'Offensive security'] },
  { code: 'CMM7XX', title: 'Information Security', year: '2025/26', semester: 'Semester 2', status: 'Upcoming', credits: '20 credits', institution: NEWMAN, tags: ['Information security', 'Cryptography'] },
  { code: 'CMU4XX', title: 'Fundamentals of Systems and Networking', year: '2025/26', semester: 'Semester 2', status: 'Upcoming', credits: '20 credits', institution: NEWMAN, tags: ['Networking', 'Systems'] },
  { code: 'CMU5XX-INFOSEC', title: 'Information Security for Industry', year: '2025/26', semester: 'Semester 2', status: 'Upcoming', credits: '20 credits', institution: NEWMAN, tags: ['Information security', 'Industry'] },

  // 2025/26 delivered
  { code: 'CMM721', title: 'Web Application Development', year: '2025/26', semester: 'Semester 1', level: 'Masters conversion', cohort: '20 students', credits: '20 credits', institution: NEWMAN, tags: ['Web development', 'JavaScript'] },
  { code: 'CMU422', title: 'Fundamentals of Web Design', year: '2025/26', semester: 'Semester 1', level: 'Undergraduate', cohort: '20 students', credits: '20 credits', institution: NEWMAN, tags: ['Web design', 'HTML and CSS'] },
  { code: 'CMU529', title: 'Advanced Web Development', year: '2025/26', semester: 'Semester 1', level: 'Undergraduate', cohort: '20 students', credits: '20 credits', institution: NEWMAN, tags: ['Full stack', 'JavaScript'] },
  { code: 'CMU540', title: 'Cyber Security', year: '2025/26', semester: 'Semester 1', level: 'Undergraduate', cohort: '20 students', credits: '20 credits', institution: NEWMAN, tags: ['Cyber security'], history: [{ year: '2024/25', semester: 'Semester 2', cohort: '20 students' }] },
  { code: 'CMU597', title: 'Industry Project', year: '2025/26', semester: 'Semester 1', level: 'Level 5', cohort: '20 students', credits: '20 credits', institution: NEWMAN, tags: ['Industry project', 'Professional practice'] },
  { code: 'CMU601', title: 'Dissertation', year: '2025/26', semester: 'Semester 1', level: 'Final year', cohort: '20 students', credits: '40 credits', institution: NEWMAN, tags: ['Supervision', 'Research methods'] },

  // Earlier
  { code: 'CMU421', title: 'Web Applications', year: '2024/25', semester: 'Semester 3', level: 'Level 4', cohort: '20 students', credits: '20 credits', institution: NEWMAN, tags: ['Web development'] },
  { code: 'CMU410', title: 'Introduction to Programming', year: '2024/25', semester: 'Semester 2', level: 'Undergraduate', credits: '20 credits', institution: NEWMAN, tags: ['Programming'] },
  { code: 'EEEE1040', title: 'Introduction to Software Engineering and Programming', year: '2024/25', semester: 'Semester 1', level: 'Level 1 undergraduate', cohort: '150 students', credits: '10 credits', institution: UON, tags: ['Software engineering', 'Programming'], history: [{ year: '2023/24', semester: 'Semester 1', cohort: '150 students' }, { year: '2022/23', semester: 'Semester 1', cohort: '150 students' }] },
  { code: 'EEEE1002', title: 'Applied Electrical and Electronic Engineering: Construction Project', year: '2023/24', semester: 'Semester 1', level: 'Level 1 undergraduate', cohort: '75 students', credits: '40 credits', institution: UON, tags: ['Engineering', 'Project'] },
  { code: 'EEEE4123', title: 'HDL for Programmable Logic', year: '2023/24', semester: 'Semester 2', level: 'Level 4 undergraduate', cohort: '50 students', credits: '20 credits', institution: UON, tags: ['HDL', 'Programmable logic'] },
];

await rm(DIR, { recursive: true, force: true });
await mkdir(DIR, { recursive: true });

const yaml = (v) => JSON.stringify(v);

for (const m of MModules()) {
  const lines = [
    '---',
    `title: ${yaml(m.title)}`,
    `summary: ${yaml(`Placeholder summary for ${m.code}. Replace with a real description of the module.`)}`,
    `year: ${yaml(m.year)}`,
    `semester: ${yaml(m.semester)}`,
    `status: ${yaml(m.status ?? 'Delivered')}`,
    `code: ${yaml(m.code)}`,
  ];
  if (m.credits) lines.push(`credits: ${yaml(m.credits)}`);
  if (m.cohort) lines.push(`cohort: ${yaml(m.cohort)}`);
  if (m.level) lines.push(`level: ${yaml(m.level)}`);
  if (m.institution) lines.push(`institution: ${yaml(m.institution)}`);
  lines.push('role: "Module lead"');
  if (m.history?.length) {
    lines.push('history:');
    for (const h of m.history) {
      lines.push(`  - year: ${yaml(h.year)}`);
      lines.push(`    semester: ${yaml(h.semester)}`);
      if (h.cohort) lines.push(`    cohort: ${yaml(h.cohort)}`);
    }
  }
  lines.push(`tags: [${m.tags.map(yaml).join(', ')}]`);
  lines.push('---', '', 'Placeholder copy. Replace with the real module description.', '', '## Outline', '', 'To be written.', '', '## Assessment', '', 'To be written.', '');

  await writeFile(join(DIR, `${m.code.toLowerCase()}.md`), lines.join('\n'), 'utf8');
}

function MModules() {
  return M;
}

console.log(`wrote ${M.length} teaching entries`);
