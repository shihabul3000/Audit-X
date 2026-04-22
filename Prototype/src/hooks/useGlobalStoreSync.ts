import { useEffect } from 'react';
import { useStore } from '../components/tabs/N4_13/store';
import { AuditReportData } from '../types';
import { getFormattedDate } from '../utils/dateFormatter';

export const useGlobalStoreSync = (data: AuditReportData) => {
  const store = useStore();

  const reportingDateLabel = getFormattedDate(data?.reportingDate) || '30 June 2024';
  const priorDateLabel = getFormattedDate(data?.startDate) || '30 June 2023';

  const parseValue = (val: string | number): number => {
    if (!val || val === '' || val === '-') return 0;
    const str = typeof val === 'string' 
      ? val.split(',').join('').split('%').join('').split('(').join('-').split(')').join('')
      : val.toString();
    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
  };

  useEffect(() => {
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

      // Update PPE summarized data in store. This also triggers recalculate().
      store.updatePPESummary({
        costClosing_cy,
        costOpening_py,
        depClosing_cy,
        depOpening_py,
        totalDepCharged_cy,
        adminDep_cy: adminDep,
      });
    }
  }, [reportingDateLabel, priorDateLabel, data, store.updateCompanyInfo, store.updatePPESummary]);
};
