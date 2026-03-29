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

  React.useEffect(() => {
    store.updateCompanyInfo('reportingDateLabel', reportingDateLabel);
    store.updateCompanyInfo('priorDateLabel', priorDateLabel);
  }, [reportingDateLabel, priorDateLabel]);

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