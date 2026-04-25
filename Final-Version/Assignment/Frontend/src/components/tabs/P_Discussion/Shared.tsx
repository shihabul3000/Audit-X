import React from 'react';
import { AuditReportData } from '../../../types';

export const TableHeader = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <th className={`border border-gray-400 bg-gray-100 px-2 py-1 text-left font-bold text-[11px] break-words ${className}`}>
    {children}
  </th>
);

export const TableCell = ({ children, className = "", rowSpan }: { children: React.ReactNode, className?: string, rowSpan?: number }) => (
  <td className={`border border-gray-400 px-2 py-1 text-[11px] break-words ${className}`} rowSpan={rowSpan}>
    {children}
  </td>
);

export const SectionHeader = ({ id, title, className = "" }: { id: string, title: string, className?: string }) => (
  <div className={`bg-purple-800 text-white px-2 py-1 font-bold flex items-center gap-2 text-xs ${className}`}>
    <span className="bg-white text-purple-800 px-1 rounded text-[10px]">{id}</span>
    <span>. {title}</span>
  </div>
);

export const Dropdown = ({ value, onChange, options = ['Yes', 'No', 'N/A'] }: { value: string, onChange: (val: string) => void, options?: string[] }) => {
  const getBgColor = (val: string) => {
    if (val === 'Yes') return 'bg-green-700 text-white';
    if (val === 'No') return 'bg-red-700 text-white';
    if (val === 'N/A') return 'bg-gray-400 text-white';
    if (val === 'Correct') return 'bg-green-700 text-white';
    if (val === 'Wrong') return 'bg-red-700 text-white';
    if (val === 'Rectified') return 'bg-yellow-500 text-black';
    return 'bg-white text-black';
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full h-full text-center font-bold text-[10px] italic border-none focus:ring-0 cursor-pointer ${getBgColor(value)}`}
    >
      {options.map(opt => (
        <option key={opt} value={opt} className="bg-white text-black">{opt}</option>
      ))}
    </select>
  );
};

export const DiscussionContext = React.createContext<{
  values: Record<string, string>;
  handleValueChange: (id: string, val: string) => void;
  data: AuditReportData;
} | null>(null);

export const EditableValue = ({ id, className = "" }: { id: string, className?: string }) => {
  const ctx = React.useContext(DiscussionContext);
  const [isFocused, setIsFocused] = React.useState(false);

  if (!ctx) return null;
  const { values, handleValueChange } = ctx;

  const handleBlur = () => {
    setIsFocused(false);
    const val = values[id];
    if (val) {
      const num = parseNum(val);
      // Store empty string for 0 to let placeholder show '-'
      handleValueChange(id, num === 0 ? '' : formatNum(num));
    }
  };

  // The value should be empty if it's 0 or '-' to let placeholder show '-'
  const displayValue = (values[id] === '-' || !values[id]) ? '' : values[id];

  return (
    <input
      type="text"
      value={displayValue}
      placeholder="-"
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onChange={(e) => {
        const val = e.target.value;
        // If user types something that's not just a dash
        if (val !== '-') {
          handleValueChange(id, val);
        }
      }}
      className={`w-full text-right bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-400 px-1 h-5 leading-5 min-w-0 ${className}`}
    />
  );
};

export const ValueRow: React.FC<{ label: string, id2025?: string, id2024?: string, val2025?: number|string, val2024?: number|string, width?: string, gap?: string, className?: string, extra?: React.ReactNode }> = ({ label, id2025, id2024, val2025, val2024, width = "w-[80px]", gap = "gap-12", className = "", extra }) => (
  <div className={`flex justify-between py-0.5 border-b border-gray-200 items-center ${className}`}>
    <span>{label}</span>
    <div className={`flex ${gap} text-right items-center`}>
      <span className={`${width} inline-block`}>
        {val2025 !== undefined ? <FormattedValue value={val2025} /> : (id2025 && <EditableValue id={id2025} />)}
      </span>
      <span className={`${width} inline-block`}>
        {val2024 !== undefined ? <FormattedValue value={val2024} /> : (id2024 && <EditableValue id={id2024} />)}
      </span>
      {extra}
    </div>
  </div>
);

export const TotalRow: React.FC<{ label: string, value2025: number, value2024: number, width?: string, gap?: string, className?: string, extra?: React.ReactNode }> = ({ label, value2025, value2024, width = "w-[80px]", gap = "gap-12", className = "", extra }) => (
  <div className={`flex justify-between border-t border-black mt-1 pt-0.5 font-bold items-center ${className}`}>
    <span>{label}</span>
    <div className={`flex ${gap} text-right items-center`}>
      <FormattedValue value={value2025} className={width} />
      <FormattedValue value={value2024} className={width} />
      {extra}
    </div>
  </div>
);

export const FormattedValue = ({ value, className = "" }: { value: number | string, className?: string }) => {
  const num = typeof value === 'number' ? value : parseNum(value);
  const formatted = formatNum(num);
  return <span className={`inline-block text-right px-1 h-5 leading-5 shrink-0 ${className}`}>{formatted || '-'}</span>;
};

export const parseNum = (val: string | undefined) => {
  if (!val || val === '-' || val === '') return 0;
  const clean = val.replace(/,/g, '').replace(/\(/g, '-').replace(/\)/g, '');
  return parseFloat(clean) || 0;
};

export const formatNum = (num: number) => {
  if (num === 0) return ''; // Return empty string for 0
  const absNum = Math.abs(num);
  const formatted = absNum.toLocaleString('en-US');
  return num < 0 ? `(${formatted})` : formatted;
};
