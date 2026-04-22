import React, { useMemo, useEffect, useRef } from 'react';
import { AuditReportData } from '../../types';
import {
  PPEProvider,
  Asset,
  HeaderInfo,
  STATEMENT_HEAD_MAPPING
} from './PPE/Shared';
import { Controls } from './PPE/Controls';
import { ReportHeader } from './PPE/ReportHeader';
import { AssetTable } from './PPE/AssetTable';
import { Breakdown } from './PPE/Breakdown';

interface PPEProps {
  data: AuditReportData;
  onUpdate?: (newData: Partial<AuditReportData>) => void;
}

export const PPE: React.FC<PPEProps> = ({ data, onUpdate }) => {
  const ppeData = data.ppe;
  const tableRef = useRef<HTMLTableElement>(null);

  const setAssets = (newAssets: Asset[] | ((prev: Asset[]) => Asset[])) => {
    if (onUpdate) {
      const assets = typeof newAssets === 'function' ? newAssets(ppeData.assets) : newAssets;
      onUpdate({ ppe: { ...ppeData, assets } });
    }
  };

  const setHeaderInfo = (newHeader: HeaderInfo | ((prev: HeaderInfo) => HeaderInfo)) => {
    if (onUpdate) {
      const headerInfo = typeof newHeader === 'function' ? newHeader(ppeData.headerInfo) : newHeader;
      onUpdate({ ppe: { ...ppeData, headerInfo } });
    }
  };

  const setPrevYearData = (newPrev: any | ((prev: any) => any)) => {
    if (onUpdate) {
      const prevYearData = typeof newPrev === 'function' ? newPrev(ppeData.prevYearData) : newPrev;
      onUpdate({ ppe: { ...ppeData, prevYearData } });
    }
  };

  const setBreakdown = (newBreakdown: any | ((prev: any) => any)) => {
    if (onUpdate) {
      const breakdown = typeof newBreakdown === 'function' ? newBreakdown(ppeData.breakdown) : newBreakdown;
      onUpdate({ ppe: { ...ppeData, breakdown } });
    }
  };

  const assets = ppeData.assets;
  const headerInfo = ppeData.headerInfo;
  const breakdown = ppeData.breakdown;

  // Column Resizing Logic
  useEffect(() => {
    if (!tableRef.current) return;

    const table = tableRef.current;
    const resizers = table.querySelectorAll('.resizer');

    let currentResizer: HTMLElement | null = null;
    let startX = 0;
    let startWidth = 0;
    let colIndex = -1;

    const onMouseMove = (e: MouseEvent) => {
      if (!currentResizer) return;
      const dx = e.clientX - startX;
      const newWidth = Math.max(30, startWidth + dx);

      const colGroup = table.querySelector('colgroup');
      if (colGroup && colGroup.children[colIndex]) {
        (colGroup.children[colIndex] as HTMLElement).style.width = `${newWidth}px`;
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      currentResizer = null;
    };

    resizers.forEach((resizer) => {
      (resizer as HTMLElement).addEventListener('mousedown', (e) => {
        currentResizer = resizer as HTMLElement;
        startX = e.clientX;
        const th = currentResizer.parentElement;
        if (th) {
          startWidth = th.offsetWidth;
          colIndex = parseInt(th.getAttribute('data-col-index') || '-1');
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
      });
    });
  }, [assets]);

  const parseValue = (val: string | number): number => {
    if (!val || val === '' || val === '-') return 0;
    const str = typeof val === 'string' ? val.replace(/,/g, '').replace(/%/g, '').replace(/\(/g, '-').replace(/\)/g, '') : val.toString();
    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatDisplay = (num: number): string => {
    if (num === 0) return '-';
    if (num < 0) return `(${Math.abs(num).toLocaleString('en-US')})`;
    return num.toLocaleString('en-US');
  };

  const formatRateDisplay = (val: string): string => {
    if (!val) return '';
    return `${val}%`;
  };

  const handleAssetChange = (id: string, field: keyof Asset, value: string) => {
    setAssets(prev => prev.map(asset => {
      if (asset.id !== id) return asset;

      let cleanValue = value;
      if (field === 'rate') {
        if (asset.rate && value === asset.rate) {
          cleanValue = asset.rate.slice(0, -1);
        } else {
          cleanValue = value.replace(/%/g, '');
        }
      }

      const updated = { ...asset, [field]: cleanValue };

      if (field === 'particular') {
        updated.statementHead = STATEMENT_HEAD_MAPPING[cleanValue] || cleanValue;
      }

      // Auto-calculate depreciation if rate or costs change
      const costOpening = parseValue(updated.costOpening);
      const depOpening = parseValue(updated.depOpening);
      const rate = parseValue(updated.rate);
      const wdvStartOfYear = costOpening - depOpening;

      if (rate > 0 && wdvStartOfYear > 0) {
        updated.depCharged = Math.round(wdvStartOfYear * (rate / 100)).toString();
      } else {
        updated.depCharged = '';
      }

      return updated;
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      const inputs = Array.from(document.querySelectorAll('input, select'));
      const index = inputs.indexOf(e.currentTarget as any);
      if (index > -1 && index < inputs.length - 1) {
        (inputs[index + 1] as HTMLElement).focus();
      }
    }
  };

  const totals = useMemo(() => {
    const t = {
      costOpening: 0,
      costAddition: 0,
      costDisposal: 0,
      costClosing: 0,
      depOpening: 0,
      depCharged: 0,
      depAdjustment: 0,
      depClosing: 0,
      wdvCurrent: 0,
      wdvPrevious: 0,
      statementHeads: {} as Record<string, number>
    };

    assets.forEach(asset => {
      const co = parseValue(asset.costOpening);
      const ca = parseValue(asset.costAddition);
      const cd = parseValue(asset.costDisposal);
      const cc = co + ca - cd;

      const do_ = parseValue(asset.depOpening);
      const dc = parseValue(asset.depCharged);
      const da = parseValue(asset.depAdjustment);
      const dcl = do_ + dc + da;

      t.costOpening += co;
      t.costAddition += ca;
      t.costDisposal += cd;
      t.costClosing += cc;
      t.depOpening += do_;
      t.depCharged += dc;
      t.depAdjustment += da;
      t.depClosing += dcl;
      t.wdvCurrent += (cc - dcl);
      t.wdvPrevious += (co - do_);

      // Track statement head totals
      Object.keys(STATEMENT_HEAD_MAPPING).forEach(key => {
        if (asset.statementHead.toLowerCase().includes(key.toLowerCase())) {
          t.statementHeads[key] = (t.statementHeads[key] || 0) + dc;
        }
      });
    });

    return t;
  }, [assets]);

  return (
    <PPEProvider value={{
      data,
      assets,
      setAssets,
      headerInfo,
      setHeaderInfo,
      breakdown,
      prevYearData: ppeData.prevYearData,
      setPrevYearData,
      setBreakdown,
      handleAssetChange,
      handleKeyDown,
      parseValue,
      formatDisplay,
      formatRateDisplay,
      totals,
      onUpdate,
      tableRef
    }}>
      <div className="w-full bg-white p-8 font-serif text-[11px] leading-tight text-black">
        <div className="max-w-7xl mx-auto border border-blue-800 p-1 min-h-full relative bg-white shadow-sm print:shadow-none print:border-none">
          <Controls />
          <div className="p-2 overflow-x-auto">
            <div className="min-w-full w-fit">
              <ReportHeader />
              <AssetTable />
              <Breakdown />
            </div>
          </div>
        </div>
      </div>
    </PPEProvider>
  );
};

export default PPE;
