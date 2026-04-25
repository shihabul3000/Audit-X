// ─── UTILS ────────────────────────────────────────────────────────────────────
const cn = (...cls: any[]) => cls.filter(Boolean).join(' ');

const formatBDT = (num: number) => {
  if (num === 0) return '-';
  const abs = Math.abs(num);
  const formatted = abs.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
  return num < 0 ? `(${formatted})` : formatted;
};


export { cn, formatBDT };