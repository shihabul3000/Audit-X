import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layout } from 'lucide-react';
import { getFormattedDate } from '../../utils/dateFormatter';

import { useStore } from './N4_13/store';
import { ConfigPanel } from './N4_13/ConfigPanel';
import * as Notes from './N4_13/index';

export const N4_13: React.FC<{ data: any }> = ({ data }) => {
  const [showConfig, setShowConfig] = useState(false);
  const store = useStore();

  const reportingDateLabel = getFormattedDate(data?.reportingDate) || '30 June 2024';
  const priorDateLabel = getFormattedDate(data?.startDate) || '30 June 2023';

  const parseValue = (val: string | number): number => {
    if (!val || val === '' || val === '-') return 0;
    const str = typeof val === 'string' ? val.replace(/,/g, '').replace(/%/g, '').replace(/\(/g, '-').replace(/\)/g, '') : val.toString();
    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
  };

  React.useEffect(() => {
    store.updateCompanyInfo('reportingDateLabel', reportingDateLabel);
    store.updateCompanyInfo('priorDateLabel', priorDateLabel);
    store.updateCompanyInfo('companyName', data?.company || 'New Company Ltd.');

    if (data?.ppe) {
      let costClosing_cy = 0;
      let costOpening_py = 0;
      let depClosing_cy = 0;
      let depOpening_py = 0;
      let totalDepCharged_cy = 0;

      data.ppe.assets.forEach(asset => {
        const co = parseValue(asset.costOpening);
        const ca = parseValue(asset.costAddition);
        const cd = parseValue(asset.costDisposal);
        const cc = co + ca - cd;

        const do_ = parseValue(asset.depOpening);
        const dc = parseValue(asset.depCharged);
        const da = parseValue(asset.depAdjustment);
        const dcl = do_ + dc + da;

        costClosing_cy += cc;
        costOpening_py += co;
        depClosing_cy += dcl;
        depOpening_py += do_;
        totalDepCharged_cy += dc;
      });

      const adminDep = parseValue(data.ppe.breakdown?.adminExpense || 0);

      // Update PPE summarized data in store
      store.updatePPESummary({
        costClosing_cy,
        costOpening_py,
        depClosing_cy,
        depOpening_py,
        totalDepCharged_cy,
        adminDep_cy: adminDep,
      });
    }
  }, [reportingDateLabel, priorDateLabel, data]);

  return (
    <div className="min-h-screen bg-slate-50/50 print:bg-white pb-20 font-sans text-slate-800">

      {/* HEADER BAR (Non-print) */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 print:hidden shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded text-indigo-700 border border-indigo-100">
              Notes 4-30
            </h1>
            <span className="text-slate-400 text-xs">—</span>
            <span className="text-slate-500 text-sm font-medium">{store.company.companyName}</span>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded transition-colors"
          >
            <Layout size={15} className={showConfig ? "text-indigo-600" : ""} />
            {showConfig ? 'Hide Config' : 'Show Config'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 px-6 print:p-0">
        <div className="flex flex-col xl:flex-row gap-6 items-start">

          {/* MAIN DOCUMENT AREA */}
          <div className="flex-1 w-full bg-white rounded shadow-sm border border-slate-200 print:border-none print:shadow-none print:w-full overflow-hidden">
            <div className="px-12 py-8 print:px-8 space-y-0">

              <div className="flex justify-end mb-6 border-b-[1.5px] border-black pb-2">
                <div className="flex gap-6">
                  <div className="w-32 text-center font-bold text-[14px] font-serif border-b border-black pb-1">
                    {store.company.reportingDateLabel}
                  </div>
                  <div className="w-32 text-center font-bold text-[14px] font-serif border-b border-black pb-1">
                    {store.company.priorDateLabel}
                  </div>
                </div>
              </div>

              {store.sections.map((s, i) => {
                const compName = s.id.charAt(0).toUpperCase() + s.id.slice(1).replace(/_/g, '');
                const NoteComponent = (Notes as any)[compName];

                if (!NoteComponent) return null;

                return (
                  <motion.div key={s.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.2 }}>
                    <NoteComponent />
                  </motion.div>
                );
              })}

            </div>
          </div>

          {/* SIDE CONFIG PANEL */}
          {showConfig && (
            <div className="w-full xl:w-80 shrink-0 sticky top-20 print:hidden">
              <ConfigPanel onClose={() => setShowConfig(false)} />
            </div>
          )}

        </div>
      </div>

    </div>
  );
};