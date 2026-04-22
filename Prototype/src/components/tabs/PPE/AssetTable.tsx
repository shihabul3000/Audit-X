import React from 'react';
import { usePPE, ASSET_TYPES } from './Shared';
import { Trash2 } from 'lucide-react';
import { getFormattedDate } from '../../../utils/dateFormatter';

export const AssetTable: React.FC = () => {
  const { 
    assets, 
    handleAssetChange, 
    handleKeyDown, 
    formatDisplay, 
    formatRateDisplay,
    parseValue,
    totals,
    data,
    tableRef,
    setAssets,
    prevYearData,
    setPrevYearData
  } = usePPE();

  const deleteRow = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  const handlePrevYearChange = (field: string, value: string) => {
    setPrevYearData((prev: any) => ({ ...prev, [field]: value }));
  };

  const prevCostOpening = parseValue(prevYearData.costOpening);
  const prevCostAddition = parseValue(prevYearData.costAddition);
  const prevCostDisposal = parseValue(prevYearData.costDisposal);
  const prevCostClosing = prevCostOpening + prevCostAddition - prevCostDisposal;

  const prevDepOpening = parseValue(prevYearData.depOpening);
  const prevDepCharged = parseValue(prevYearData.depCharged);
  const prevDepAdjustment = parseValue(prevYearData.depAdjustment);
  const prevDepClosing = prevDepOpening + prevDepCharged + prevDepAdjustment;

  const prevWDVCurrent = prevCostClosing - prevDepClosing;
  const prevWDVPrevious = prevCostOpening - prevDepOpening;

  return (
    <div className="p-1">
      <table ref={tableRef} className="w-full border-collapse text-[10px] table-fixed text-black">
        <colgroup>
          <col style={{ width: '40px' }} />
          <col style={{ width: '180px' }} />
          <col style={{ width: '180px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '50px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '100px' }} />
          <col style={{ width: '60px' }} />
        </colgroup>
        <thead>
          <tr className="bg-white">
            <th rowSpan={3} data-col-index="0" className="border border-black p-1 relative font-bold">
              SI
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
            <th rowSpan={3} data-col-index="1" className="border border-black p-1 relative font-bold">
              Particulars
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
            <th rowSpan={3} data-col-index="2" className="border border-black p-1 relative font-bold">
              as per company's<br/>statement heads
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
            <th colSpan={4} className="border border-black p-1 font-bold">Costs</th>
            <th colSpan={5} className="border border-black p-1 font-bold">Accumulated depreciation and impairment</th>
            <th colSpan={2} className="border border-black p-1 font-bold">W.D.V</th>
            <th rowSpan={3} data-col-index="14" className="border border-black p-1 no-print relative font-bold">
              Action
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
          </tr>
          <tr className="bg-white">
            <th rowSpan={2} data-col-index="3" className="border border-black p-1 relative font-bold">
              Balance at<br/>{getFormattedDate(data.startDate)}
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
            <th rowSpan={2} data-col-index="4" className="border border-black p-1 relative font-bold">
              Addition for<br/>the year
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
            <th rowSpan={2} data-col-index="5" className="border border-black p-1 relative font-bold">
              Disposal/<br/>Adjustment
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
            <th rowSpan={2} data-col-index="6" className="border border-black p-1 relative font-bold">
              Total<br/>{getFormattedDate(data.reportingDate)}
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
            <th rowSpan={2} data-col-index="7" className="border border-black p-1 relative font-bold">
              Rate
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
            <th rowSpan={2} data-col-index="8" className="border border-black p-1 relative font-bold">
              Balance at<br/>{getFormattedDate(data.startDate)}
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
            <th rowSpan={2} data-col-index="9" className="border border-black p-1 relative font-bold">
              Charged for<br/>the year
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
            <th rowSpan={2} data-col-index="10" className="border border-black p-1 relative font-bold">
              Adjustment
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
            <th rowSpan={2} data-col-index="11" className="border border-black p-1 relative font-bold">
              Total<br/>{getFormattedDate(data.reportingDate)}
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
            <th rowSpan={2} data-col-index="12" className="border border-black p-1 relative font-bold">
              {getFormattedDate(data.reportingDate)}
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
            <th rowSpan={2} data-col-index="13" className="border border-black p-1 relative font-bold">
              {getFormattedDate(data.startDate)}
              <div className="resizer absolute top-0 -right-1 w-2 h-full cursor-col-resize hover:bg-blue-400 z-10"></div>
            </th>
          </tr>
          <tr></tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => {
            const costOpening = parseFloat(asset.costOpening.replace(/,/g, '')) || 0;
            const costAddition = parseFloat(asset.costAddition.replace(/,/g, '')) || 0;
            const costDisposal = parseFloat(asset.costDisposal.replace(/,/g, '')) || 0;
            const costClosing = costOpening + costAddition - costDisposal;

            const depOpening = parseFloat(asset.depOpening.replace(/,/g, '')) || 0;
            const depCharged = parseFloat(asset.depCharged.replace(/,/g, '')) || 0;
            const depAdjustment = parseFloat(asset.depAdjustment.replace(/,/g, '')) || 0;
            const depClosing = depOpening + depCharged + depAdjustment;

            const wdvCurrent = costClosing - depClosing;
            const wdvPrevious = costOpening - depOpening;

            return (
              <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                <td className="border border-black text-center p-1">{index + 1}</td>
                <td className="border border-black p-0">
                  <select 
                    className="w-full p-1 bg-transparent outline-none border-none cursor-pointer font-serif"
                    value={asset.particular}
                    onChange={(e) => handleAssetChange(asset.id, 'particular', e.target.value)}
                    onKeyDown={handleKeyDown}
                  >
                    <option value="">Select type</option>
                    {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </td>
                <td className="border border-black p-0">
                  <input 
                    type="text" 
                    className="w-full p-1 bg-transparent outline-none border-none font-serif"
                    value={asset.statementHead}
                    onChange={(e) => handleAssetChange(asset.id, 'statementHead', e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </td>
                <td className="border border-black p-0">
                  <input 
                    type="text" 
                    className="w-full p-1 bg-blue-50/30 text-right outline-none border-none font-serif"
                    value={asset.costOpening}
                    placeholder="-"
                    onChange={(e) => handleAssetChange(asset.id, 'costOpening', e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </td>
                <td className="border border-black p-0">
                  <input 
                    type="text" 
                    className="w-full p-1 bg-blue-50/30 text-right outline-none border-none font-serif"
                    value={asset.costAddition}
                    placeholder="-"
                    onChange={(e) => handleAssetChange(asset.id, 'costAddition', e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </td>
                <td className="border border-black p-0">
                  <input 
                    type="text" 
                    className="w-full p-1 bg-blue-50/30 text-right outline-none border-none font-serif"
                    value={asset.costDisposal}
                    placeholder="-"
                    onChange={(e) => handleAssetChange(asset.id, 'costDisposal', e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </td>
                <td className="border border-black text-right p-1 bg-gray-50 font-bold">{formatDisplay(costClosing)}</td>
                <td className="border border-black p-0">
                  <input 
                    type="text" 
                    className="w-full p-1 bg-transparent text-center outline-none border-none font-serif"
                    value={formatRateDisplay(asset.rate)}
                    placeholder="%"
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const oldRate = asset.rate;
                      
                      if (oldRate && !newValue.includes('%') && newValue === oldRate) {
                        handleAssetChange(asset.id, 'rate', oldRate.slice(0, -1));
                      } else {
                        const sanitized = newValue.replace('%', '').replace(/[^0-9.]/g, '');
                        const parts = sanitized.split('.');
                        const finalVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
                        handleAssetChange(asset.id, 'rate', finalVal);
                      }
                    }}
                  />
                </td>
                <td className="border border-black p-0">
                  <input 
                    type="text" 
                    className="w-full p-1 bg-blue-50/30 text-right outline-none border-none font-serif"
                    value={asset.depOpening}
                    placeholder="-"
                    onChange={(e) => handleAssetChange(asset.id, 'depOpening', e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </td>
                <td className="border border-black text-right p-1 bg-gray-50">{formatDisplay(parseFloat(asset.depCharged) || 0)}</td>
                <td className="border border-black p-0">
                  <input 
                    type="text" 
                    className="w-full p-1 bg-blue-50/30 text-right outline-none border-none font-serif"
                    value={asset.depAdjustment}
                    placeholder="-"
                    onChange={(e) => handleAssetChange(asset.id, 'depAdjustment', e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </td>
                <td className="border border-black text-right p-1 bg-gray-50 font-bold">{formatDisplay(depClosing)}</td>
                <td className="border border-black text-right p-1 bg-green-50/50 font-bold">{formatDisplay(wdvCurrent)}</td>
                <td className="border border-black text-right p-1 bg-gray-50">{formatDisplay(wdvPrevious)}</td>
                <td className="border border-black text-center p-1 no-print">
                  <button 
                    onClick={() => deleteRow(asset.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete Row"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-white font-bold total-row">
            <td colSpan={3} className="border border-black text-center p-2 uppercase">At {getFormattedDate(data.reportingDate)}</td>
            <td className="border border-black text-right p-2">{formatDisplay(totals.costOpening)}</td>
            <td className="border border-black text-right p-2">{formatDisplay(totals.costAddition)}</td>
            <td className="border border-black text-right p-2">{formatDisplay(totals.costDisposal)}</td>
            <td className="border border-black text-right p-2 bg-gray-100">{formatDisplay(totals.costClosing)}</td>
            <td className="border border-black"></td>
            <td className="border border-black text-right p-2">{formatDisplay(totals.depOpening)}</td>
            <td className="border border-black text-right p-2">{formatDisplay(totals.depCharged)}</td>
            <td className="border border-black text-right p-2">{formatDisplay(totals.depAdjustment)}</td>
            <td className="border border-black text-right p-2 bg-gray-100">{formatDisplay(totals.depClosing)}</td>
            <td className="border border-black text-right p-2 bg-gray-100 font-bold">{formatDisplay(totals.wdvCurrent)}</td>
            <td className="border border-black text-right p-2 bg-gray-100">{formatDisplay(totals.wdvPrevious)}</td>
            <td className="border border-black no-print"></td>
          </tr>
          <tr className="bg-white font-bold previous-year-row">
            <td colSpan={3} className="border border-black text-center p-2 uppercase">At {getFormattedDate(data.startDate)}</td>
            <td className="border border-black p-0">
              <input 
                type="text" 
                className="w-full p-1 bg-blue-50/30 text-right outline-none border-none font-serif"
                value={prevYearData.costOpening}
                placeholder="-"
                onChange={(e) => handlePrevYearChange('costOpening', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </td>
            <td className="border border-black p-0">
              <input 
                type="text" 
                className="w-full p-1 bg-blue-50/30 text-right outline-none border-none font-serif"
                value={prevYearData.costAddition}
                placeholder="-"
                onChange={(e) => handlePrevYearChange('costAddition', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </td>
            <td className="border border-black p-0">
              <input 
                type="text" 
                className="w-full p-1 bg-blue-50/30 text-right outline-none border-none font-serif"
                value={prevYearData.costDisposal}
                placeholder="-"
                onChange={(e) => handlePrevYearChange('costDisposal', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </td>
            <td className="border border-black text-right p-2 bg-gray-100">{formatDisplay(prevCostClosing)}</td>
            <td className="border border-black text-center p-2">-</td>
            <td className="border border-black p-0">
              <input 
                type="text" 
                className="w-full p-1 bg-blue-50/30 text-right outline-none border-none font-serif"
                value={prevYearData.depOpening}
                placeholder="-"
                onChange={(e) => handlePrevYearChange('depOpening', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </td>
            <td className="border border-black p-0">
              <input 
                type="text" 
                className="w-full p-1 bg-blue-50/30 text-right outline-none border-none font-serif"
                value={prevYearData.depCharged}
                placeholder="-"
                onChange={(e) => handlePrevYearChange('depCharged', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </td>
            <td className="border border-black p-0">
              <input 
                type="text" 
                className="w-full p-1 bg-blue-50/30 text-right outline-none border-none font-serif"
                value={prevYearData.depAdjustment}
                placeholder="-"
                onChange={(e) => handlePrevYearChange('depAdjustment', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </td>
            <td className="border border-black text-right p-2 bg-gray-100">{formatDisplay(prevDepClosing)}</td>
            <td className="border border-black text-right p-2 bg-gray-100 font-bold">{formatDisplay(prevWDVCurrent)}</td>
            <td className="border border-black text-right p-2 bg-gray-100">{formatDisplay(prevWDVPrevious)}</td>
            <td className="border border-black no-print"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
