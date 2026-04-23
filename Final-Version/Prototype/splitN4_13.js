import fs from 'fs';
import path from 'path';

const fileContent = fs.readFileSync('src/components/tabs/N4_13.tsx', 'utf8');

// split the file via the comment headers using regex
const parts = fileContent.split(/(?=\/\/\s*───\s+[A-Z])/);

let blocks = {};

parts.forEach(part => {
  if (part.includes('─── TYPES')) blocks.types = part;
  else if (part.includes('─── UTILS')) blocks.utils = part;
  else if (part.includes('─── CALCULATION')) blocks.recalculate = part;
  else if (part.includes('─── INITIAL')) blocks.sections = part;
  else if (part.includes('─── STORE')) blocks.store = part;
  else if (part.includes('─── EDITABLE')) blocks.components_editable = part;
  else if (part.includes('─── NOTE ROW')) blocks.components_row = part;
  else if (part.includes('─── DYNAMIC TAB')) blocks.components_tables = part;
  else if (part.includes('─── NOTE SEC')) blocks.components_section = part;
  else if (part.includes('─── CONFIG')) blocks.components_config = part;
  else if (part.includes('─── MAIN APP')) blocks.main_app = part;
  else blocks.imports = part; // the first chunk before any "───"
});

const outDir = 'src/components/tabs/N4_13';
if (!fs.existsSync(outDir)) { fs.mkdirSync(outDir, { recursive: true }); }

// Write the files based on parsed chunks
fs.writeFileSync(path.join(outDir, 'types.ts'), (blocks.types || '').trim());
fs.writeFileSync(path.join(outDir, 'utils.ts'), ((blocks.utils || '') + '\nexport { cn, formatBDT };').trim());
fs.writeFileSync(path.join(outDir, 'recalculate.ts'), ("import { Store } from './types';\n" + (blocks.recalculate || '') + '\nexport { recalculate };').trim());
fs.writeFileSync(path.join(outDir, 'sections.ts'), ("import { Section, Row, PPE } from './types';\nimport { v4 as uuidv4 } from 'uuid';\n" + (blocks.sections || '') + '\nexport { buildInitialSections };').trim());
fs.writeFileSync(path.join(outDir, 'store.ts'), ("import { create } from 'zustand';\nimport { immer } from 'zustand/middleware/immer';\nimport { Store } from './types';\nimport { recalculate } from './recalculate';\nimport { buildInitialSections } from './sections';\n" + (blocks.store || '') + '\nexport { useStore };').trim());

const sharedTsx = `import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronRight, Link as LinkIcon } from 'lucide-react';
import { Row, Section, BankAccount, Shareholder, LoanEntry, UPASEntry } from './types';
import { cn, formatBDT } from './utils';
import { useStore } from './store';

${blocks.components_editable || ''}

${blocks.components_row || ''}

${blocks.components_tables || ''}

${blocks.components_section || ''}

export { EditableLabel, EditableNumber, NoteRowComp, BankAccountTable, ShareholderTable, LoanTable, UPASTable, NoteSectionComp };
`;
fs.writeFileSync(path.join(outDir, 'Shared.tsx'), sharedTsx.trim());

const configTsx = `import React, { useState } from 'react';
import { Layout } from 'lucide-react';
import { useStore } from './store';
import { cn } from './utils';

${blocks.components_config || ''}

export { ConfigPanel };
`;
fs.writeFileSync(path.join(outDir, 'ConfigPanel.tsx'), configTsx.trim());

console.log("Core files written.");

// Notes generation
const sectionsContent = blocks.sections || '';
const idMatches = [...sectionsContent.matchAll(/id:\s*['"](note[a-zA-Z0-9_]+)['"]/g)];
const uniqueIds = [...new Set(idMatches.map(m => m[1]))];

const notesDir = path.join(outDir, 'notes');
if (!fs.existsSync(notesDir)) { fs.mkdirSync(notesDir, { recursive: true }); }

let indexExports = [];

uniqueIds.forEach(id => {
  const compName = id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, '');
  const tsxContent = `import React from 'react';
import { useStore } from '../store';
import { NoteSectionComp } from '../Shared';

export const ${compName}: React.FC = () => {
  const section = useStore(state => state.sections.find(s => s.id === '${id}'));
  
  if (!section) return null;
  return <NoteSectionComp section={section} />;
};
`;
  fs.writeFileSync(path.join(notesDir, `${compName}.tsx`), tsxContent.trim());
  indexExports.push(`export { ${compName} } from './notes/${compName}';`);
});

fs.writeFileSync(path.join(outDir, 'index.ts'), indexExports.join('\n'));
console.log("Notes generation completed. IDs found:", uniqueIds.length);
