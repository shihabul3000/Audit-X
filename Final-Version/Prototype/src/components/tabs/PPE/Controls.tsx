import React from 'react';
import { usePPE } from './Shared';
import { Plus, Trash2, Calculator, Save } from 'lucide-react';

export const Controls: React.FC = () => {
  const { assets, setAssets } = usePPE();

  const addRow = () => {
    const newId = (Math.max(0, ...assets.map(a => parseInt(a.id))) + 1).toString();
    setAssets([...assets, {
      id: newId,
      particular: "",
      statementHead: "",
      costOpening: '',
      costAddition: '',
      costDisposal: '',
      rate: '',
      depOpening: '',
      depCharged: '',
      depAdjustment: ''
    }]);
  };

  const clearAll = () => {
    if (confirm('Clear all data?')) {
      setAssets([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-4 rounded border border-gray-200 mb-6 no-print shadow-sm">
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-gray-800">
        <Calculator className="w-4 h-4 text-blue-800" />
        PPE Controls
      </h3>

      <div className="flex flex-wrap gap-3">
        <button 
          onClick={addRow}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold"
        >
          <Plus className="w-4 h-4" /> Add Asset Row
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
        >
          <Save className="w-4 h-4" /> Print Report
        </button>
        <button 
          onClick={clearAll}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold"
        >
          <Trash2 className="w-4 h-4" /> Clear All
        </button>
      </div>
    </div>
  );
};
