import React, { useState } from 'react';
import { Layout } from 'lucide-react';
import { useStore } from './store';
import { cn } from './utils';

// ─── CONFIG PANEL ─────────────────────────────────────────────────────────────
const ConfigPanel = ({ onClose }: { onClose: () => void }) => {
  const store = useStore();
  const inputCls = "w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400";
  const labelCls = "text-xs text-gray-500 font-medium uppercase tracking-wide mb-1 block";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center print:hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-bold">Configuration</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><span className="text-xl">×</span></button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-6">
          {/* Company */}
          <div className="col-span-2">
            <h3 className="font-semibold text-sm mb-3 text-gray-700">Company Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Company Name</label>
                <input className={inputCls} value={store.company.companyName} onChange={e => store.updateConfig('company', 'companyName', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Address</label>
                <input className={inputCls} value={store.company.address} onChange={e => store.updateConfig('company', 'address', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Reporting Date</label>
                <input className={inputCls} value={store.company.reportingDateLabel} onChange={e => store.updateConfig('company', 'reportingDateLabel', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Prior Year Date</label>
                <input className={inputCls} value={store.company.priorDateLabel} onChange={e => store.updateConfig('company', 'priorDateLabel', e.target.value)} />
              </div>
            </div>
          </div>

          {/* PPE */}
          <div className="col-span-2">
            <h3 className="font-semibold text-sm mb-3 text-gray-700">PPE / Annexure A</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['costClosing_cy', 'Cost Closing CY'], ['costOpening_py', 'Cost Opening PY'],
                ['depClosing_cy', 'Dep Closing CY'], ['depOpening_py', 'Dep Opening PY'],
                ['totalDepCharged_cy', 'Total Dep Charged'], ['adminDep_cy', 'Admin Dep Portion'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className={labelCls}>{label}</label>
                  <input type="number" className={inputCls} value={store.ppe[field]} onChange={e => store.updateConfig('ppe', field, Number(e.target.value))} />
                </div>
              ))}
            </div>
          </div>

          {/* Tax */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-700">Tax Rates</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['rateOnRevenue_cy', 'On Revenue CY'], ['rateOnRevenue_py', 'On Revenue PY'],
                ['rateOnIncome_cy', 'On Income CY'], ['rateOnIncome_py', 'On Income PY'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className={labelCls}>{label}</label>
                  <input type="number" step="0.001" className={inputCls} value={store.taxConfig[field]} onChange={e => store.updateConfig('taxConfig', field, Number(e.target.value))} />
                </div>
              ))}
            </div>
          </div>

          {/* Share Config */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-700">Share Capital Config</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['authorizedShares', 'Auth Shares'], ['authorizedFaceValue', 'Auth Face Value'],
                ['issuedShares', 'Issued Shares'], ['issuedFaceValue', 'Issued Face Value'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className={labelCls}>{label}</label>
                  <input type="number" className={inputCls} value={store.shareConfig[field]} onChange={e => store.updateConfig('shareConfig', field, Number(e.target.value))} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export { ConfigPanel };