import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronRight, Link as LinkIcon } from 'lucide-react';
import { Row, Section, BankAccount, Shareholder, LoanEntry, UPASEntry } from './types';
import { cn, formatBDT } from './utils';
import { useStore } from './store';

// ─── EDITABLE COMPONENTS ──────────────────────────────────────────────────────
interface EditableLabelProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  disabled?: boolean;
  multiline?: boolean;
}

const EditableLabel = ({ value, onChange, className = '', disabled = false, multiline = false }: EditableLabelProps) => {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(value);
  if (disabled) return <span className={className}>{value}</span>;
  if (multiline && edit) return (
    <textarea autoFocus value={draft} rows={3}
      onChange={e => setDraft(e.target.value)}
      onBlur={() => { onChange(draft); setEdit(false); }}
      className={cn("border border-blue-300 bg-blue-50 outline-none w-full p-1 text-sm rounded", className)} />
  );
  return edit ? (
    <input autoFocus value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={() => { onChange(draft); setEdit(false); }}
      onKeyDown={e => { if (e.key === 'Enter') { onChange(draft); setEdit(false); } }}
      className={cn("border-b border-blue-400 bg-blue-50 outline-none min-w-[8rem]", className)} />
  ) : (
    <span onClick={() => { setDraft(value); setEdit(true); }}
      title="Click to edit"
      className={cn("cursor-text hover:bg-yellow-50 rounded px-0.5", className)}>
      {value}
    </span>
  );
};

interface EditableNumberProps {
  value: number;
  onChange: (v: number) => void;
  readOnly?: boolean;
  className?: string;
}

const EditableNumber = ({ value, onChange, readOnly = false, className = '' }: EditableNumberProps) => {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState('');
  if (readOnly) return (
    <span className={cn("text-right block w-32 tabular-nums", className)}>{formatBDT(value)}</span>
  );
  return edit ? (
    <input autoFocus value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={() => { const n = parseFloat(draft.replace(/,/g, '')); onChange(isNaN(n) ? 0 : n); setEdit(false); }}
      onKeyDown={e => { if (e.key === 'Enter') { const n = parseFloat(draft.replace(/,/g, '')); onChange(isNaN(n) ? 0 : n); setEdit(false); } }}
      className={cn("border-b border-blue-400 bg-blue-50 outline-none text-right w-32 tabular-nums", className)} />
  ) : (
    <span onClick={() => { setDraft(String(value)); setEdit(true); }}
      title="Click to edit"
      className={cn("cursor-text text-right block w-32 hover:bg-yellow-50 rounded px-0.5 tabular-nums", className)}>
      {formatBDT(value)}
    </span>
  );
};



// ─── NOTE ROW COMPONENT ───────────────────────────────────────────────────────
const NoteRowComp: React.FC<{ row: Row; sId: string }> = ({ row, sId }) => {
  const store = useStore();
  const indent = row.indentLevel === 2 ? 'pl-20' : row.indentLevel === 1 ? 'pl-10' : 'pl-0';
  const bold = (row.isTotal || row.isSubHeader) ? 'font-bold' : '';

  if (row.isRichText) {
    return (
      <div className="py-2 text-sm text-gray-700 italic">
        <EditableLabel multiline value={row.label}
          onChange={v => store.updateRowLabel(sId, row.id, v)} />
      </div>
    );
  }

  if (row.isSubHeader) {
    return (
      <div className={cn(indent, bold, "mt-4 mb-1 text-gray-800 border-b border-gray-200 pb-0.5")}>
        <EditableLabel value={row.label}
          onChange={v => store.updateRowLabel(sId, row.id, v)} />
      </div>
    );
  }

  return (
    <div className="flex justify-between py-0.5 group hover:bg-amber-50/50 rounded transition-colors">
      <div className={cn("flex items-center flex-1 gap-1", indent, bold)}>
        {row.crossNoteRef
          ? <span className="flex items-center gap-1 text-gray-600">
            <LinkIcon size={9} className="text-blue-400 shrink-0" />
            {row.label}
          </span>
          : <>
            <EditableLabel value={row.label}
              onChange={v => store.updateRowLabel(sId, row.id, v)} />
            {!row.isTotal && !row.locked && (
              <button onClick={() => store.deleteRow(sId, row.id)}
                className="ml-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 print:hidden transition-opacity">
                <Trash2 size={10} />
              </button>
            )}
            {row.locked && <span className="ml-1 text-[9px] text-gray-400">🔒</span>}
          </>
        }
      </div>
      <div className="flex gap-6">
        <EditableNumber value={row.value_cy}
          onChange={v => store.updateRow(sId, row.id, 'value_cy', v)}
          readOnly={row.isTotal || !!row.crossNoteRef}
          className={cn(bold, row.isTotal && "border-t border-gray-600")} />
        <EditableNumber value={row.value_py}
          onChange={v => store.updateRow(sId, row.id, 'value_py', v)}
          readOnly={row.isTotal || !!row.crossNoteRef}
          className={cn(bold, row.isTotal && "border-t border-gray-600")} />
      </div>
    </div>
  );
};



// ─── DYNAMIC TABLE COMPONENTS ─────────────────────────────────────────────────
const BankAccountTable = () => {
  const store = useStore();
  const thCls = "text-left py-1 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-300";
  const tdCls = "py-0.5 px-2";
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className={thCls}>Bank Name</th>
            <th className={thCls}>Account No.</th>
            <th className={cn(thCls, "text-right w-32")}>CY</th>
            <th className={cn(thCls, "text-right w-32")}>PY</th>
            <th className={cn(thCls, "w-6 print:hidden")}></th>
          </tr>
        </thead>
        <tbody>
          {store.bankAccounts.map(ba => (
            <tr key={ba.id} className="group hover:bg-amber-50/50 border-b border-gray-100">
              <td className={tdCls}><EditableLabel value={ba.bankName} onChange={v => store.updateTableItem('bank', ba.id, 'bankName', v)} /></td>
              <td className={tdCls}><EditableLabel value={ba.accountNo} onChange={v => store.updateTableItem('bank', ba.id, 'accountNo', v)} /></td>
              <td className={tdCls}><EditableNumber value={ba.value_cy} onChange={v => store.updateTableItem('bank', ba.id, 'value_cy', v)} /></td>
              <td className={tdCls}><EditableNumber value={ba.value_py} onChange={v => store.updateTableItem('bank', ba.id, 'value_py', v)} /></td>
              <td className={cn(tdCls, "print:hidden")}>
                <button onClick={() => store.deleteTableItem('bank', ba.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"><Trash2 size={10} /></button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold border-t-2 border-gray-700">
            <td colSpan={2} className={tdCls}>Total</td>
            <td className={tdCls}><span className="text-right block w-32 tabular-nums">{formatBDT(store.bankAccounts.reduce((s, b) => s + b.value_cy, 0))}</span></td>
            <td className={tdCls}><span className="text-right block w-32 tabular-nums">{formatBDT(store.bankAccounts.reduce((s, b) => s + b.value_py, 0))}</span></td>
          </tr>
        </tfoot>
      </table>
      <button onClick={() => store.addTableItem('bank')} className="mt-2 text-xs text-blue-600 hover:text-blue-800 print:hidden">+ Add bank account</button>
    </div>
  );
};

const ShareholderTable = () => {
  const store = useStore();
  const totalShares = store.shareholders.reduce((s, sh) => s + sh.shares, 0);
  const thCls = "text-left py-1 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-300";
  const tdCls = "py-0.5 px-2";
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className={thCls}>Name of Shareholders</th>
            <th className={cn(thCls, "text-right")}>No. of Shares</th>
            <th className={cn(thCls, "text-right")}>% Holding</th>
            <th className={cn(thCls, "text-right w-32")}>Amount (BDT)</th>
            <th className={cn(thCls, "w-6 print:hidden")}></th>
          </tr>
        </thead>
        <tbody>
          {store.shareholders.map(sh => {
            const ratio = totalShares > 0 ? sh.shares / totalShares : 0;
            const amount = sh.shares * store.shareConfig.issuedFaceValue;
            return (
              <tr key={sh.id} className="group hover:bg-amber-50/50 border-b border-gray-100">
                <td className={tdCls}><EditableLabel value={sh.name} onChange={v => store.updateTableItem('sh', sh.id, 'name', v)} /></td>
                <td className={cn(tdCls, "text-right")}><EditableNumber value={sh.shares} onChange={v => store.updateTableItem('sh', sh.id, 'shares', v)} /></td>
                <td className={cn(tdCls, "text-right tabular-nums")}>{(ratio * 100).toFixed(3)}%</td>
                <td className={cn(tdCls, "text-right tabular-nums")}>{formatBDT(amount)}</td>
                <td className={cn(tdCls, "print:hidden")}>
                  <button onClick={() => store.deleteTableItem('sh', sh.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"><Trash2 size={10} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-bold border-t-2 border-gray-700">
            <td className={tdCls}>Total</td>
            <td className={cn(tdCls, "text-right tabular-nums")}>{totalShares.toLocaleString('en-IN')}</td>
            <td className={cn(tdCls, "text-right")}>100%</td>
            <td className={cn(tdCls, "text-right tabular-nums")}>{formatBDT(totalShares * store.shareConfig.issuedFaceValue)}</td>
          </tr>
        </tfoot>
      </table>
      <button onClick={() => store.addTableItem('sh')} className="mt-2 text-xs text-blue-600 hover:text-blue-800 print:hidden">+ Add shareholder</button>
    </div>
  );
};

const LoanTable = ({ type }) => {
  const store = useStore();
  const items = type === 'loan' ? store.loans : store.upasEntries;
  const thCls = "text-left py-1 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-300";
  const tdCls = "py-0.5 px-2";
  const totalNC = items.reduce((s, l) => s + l.nonCurrent_cy, 0);
  const totalC = items.reduce((s, l) => s + l.current_cy, 0);
  const totalPY = items.reduce((s, l) => s + l.total_py, 0);
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className={thCls}>Lender</th>
            <th className={thCls}>A/C No.</th>
            <th className={cn(thCls, "text-right w-28")}>Non-current</th>
            <th className={cn(thCls, "text-right w-28")}>Current</th>
            <th className={cn(thCls, "text-right w-28")}>Total CY</th>
            <th className={cn(thCls, "text-right w-28")}>Total PY</th>
            <th className={cn(thCls, "w-6 print:hidden")}></th>
          </tr>
        </thead>
        <tbody>
          {items.map(loan => (
            <tr key={loan.id} className="group hover:bg-amber-50/50 border-b border-gray-100">
              <td className={tdCls}><EditableLabel value={loan.lenderName} onChange={v => store.updateTableItem(type, loan.id, 'lenderName', v)} /></td>
              <td className={tdCls}><EditableLabel value={loan.accountNo} onChange={v => store.updateTableItem(type, loan.id, 'accountNo', v)} /></td>
              <td className={tdCls}><EditableNumber value={loan.nonCurrent_cy} onChange={v => store.updateTableItem(type, loan.id, 'nonCurrent_cy', v)} /></td>
              <td className={tdCls}><EditableNumber value={loan.current_cy} onChange={v => store.updateTableItem(type, loan.id, 'current_cy', v)} /></td>
              <td className={cn(tdCls, "text-right tabular-nums font-medium")}>{formatBDT(loan.nonCurrent_cy + loan.current_cy)}</td>
              <td className={tdCls}><EditableNumber value={loan.total_py} onChange={v => store.updateTableItem(type, loan.id, 'total_py', v)} /></td>
              <td className={cn(tdCls, "print:hidden")}>
                <button onClick={() => store.deleteTableItem(type, loan.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"><Trash2 size={10} /></button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold border-t-2 border-gray-700">
            <td colSpan={2} className={tdCls}>Total</td>
            <td className={cn(tdCls, "text-right tabular-nums")}>{formatBDT(totalNC)}</td>
            <td className={cn(tdCls, "text-right tabular-nums")}>{formatBDT(totalC)}</td>
            <td className={cn(tdCls, "text-right tabular-nums")}>{formatBDT(totalNC + totalC)}</td>
            <td className={cn(tdCls, "text-right tabular-nums")}>{formatBDT(totalPY)}</td>
          </tr>
        </tfoot>
      </table>
      <button onClick={() => store.addTableItem(type)} className="mt-2 text-xs text-blue-600 hover:text-blue-800 print:hidden">
        + Add {type === 'loan' ? 'loan' : 'UPAS'} entry
      </button>
    </div>
  );
};



// ─── NOTE SECTION COMPONENT ───────────────────────────────────────────────────
const NoteSectionComp = ({ section }: { section: Section }) => {
  const store = useStore();
  const [collapsed, setCollapsed] = useState(false);

  const showAddRow = !section.tableType && !['note30_01', 'note30_02'].includes(section.id);
  const hasValues = section.rows.some(r => !r.isTotal && !r.isSubHeader && !r.isRichText);

  return (
    <div className="mb-10 break-inside-avoid">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-300">
        <button onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-gray-600 print:hidden shrink-0">
          {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
        </button>
        <span className="font-bold text-base text-gray-800 min-w-[3rem] shrink-0">
          {section.noteNumber}.
        </span>
        <EditableLabel
          value={section.title}
          onChange={v => store.updateSectionTitle(section.id, v)}
          className="font-bold text-base text-gray-800 uppercase tracking-wide"
        />
      </div>

      {!collapsed && (
        <>
          {/* Standard rows */}
          {(!section.tableType || section.tableType === 'standard') && (
            <div className="space-y-0 pl-4">
              {section.rows.map(r => (
                <NoteRowComp key={r.id} row={r} sId={section.id} />
              ))}
            </div>
          )}

          {/* Special table types */}
          {section.tableType === 'bank_account' && <BankAccountTable />}
          {section.tableType === 'shareholder' && (
            <>
              <div className="space-y-0 pl-4">
                {section.rows.map(r => <NoteRowComp key={r.id} row={r} sId={section.id} />)}
              </div>
              <ShareholderTable />
            </>
          )}
          {section.tableType === 'loan' && (
            <>
              <LoanTable type="loan" />
              <div className="space-y-0 pl-4 mt-2">
                {section.rows.filter(r => r.isTotal).map(r => <NoteRowComp key={r.id} row={r} sId={section.id} />)}
              </div>
            </>
          )}
          {section.tableType === 'upas' && (
            <>
              <LoanTable type="upas" />
              <div className="space-y-0 pl-4 mt-2">
                {section.rows.filter(r => r.isTotal).map(r => <NoteRowComp key={r.id} row={r} sId={section.id} />)}
              </div>
            </>
          )}

          {/* Double underline */}
          {section.showDoubleLine && (
            <div className="flex justify-end mt-1 relative">
              <div className="flex gap-6">
                <div className="w-32 border-t-2 border-double border-gray-800"></div>
                <div className="w-32 border-t-2 border-double border-gray-800"></div>
              </div>
              {section.suffixLabel && (
                <span className="absolute left-[calc(100%+10px)] bottom-0 text-[10px] italic text-gray-500 whitespace-nowrap">
                  {section.suffixLabel}
                </span>
              )}
            </div>
          )}

          {/* Add row button */}
          {showAddRow && (
            <button onClick={() => store.addRow(section.id)}
              className="mt-1.5 text-xs text-blue-500 hover:text-blue-700 print:hidden flex items-center gap-1">
              <span className="text-base leading-none">+</span> Add item
            </button>
          )}
        </>
      )}
    </div>
  );
};



export { EditableLabel, EditableNumber, NoteRowComp, BankAccountTable, ShareholderTable, LoanTable, NoteSectionComp };