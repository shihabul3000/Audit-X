/**
 * Rollover logic: carries forward closing balances from previous year
 * as opening balances for the new year.
 * This mirrors the exact logic in Prototype/src/store/useAppStore.ts startNewYear()
 */

interface AssetRow {
  id: string;
  particular: string;
  statementHead: string;
  costOpening: string;
  costAddition: string;
  costDisposal: string;
  rate: string;
  depOpening: string;
  depCharged: string;
  depAdjustment: string;
}

interface PPEData {
  assets: AssetRow[];
  headerInfo: {
    reportTitle: string;
    annexure: string;
    asAtDate: string;
    yearStart: string;
    yearEnd: string;
  };
  prevYearData: {
    costOpening: string;
    costAddition: string;
    costDisposal: string;
    depOpening: string;
    depCharged: string;
    depAdjustment: string;
  };
  breakdown: {
    adminExpense: string;
    costOfSalesLabel: string;
    adminExpenseLabel: string;
  };
}

interface AuditReportData {
  company: string;
  addr: string;
  date: string;
  reportingDate: string;
  startDate: string;
  ppe: PPEData;
  discussionData: {
    docStatuses: Record<string, string>;
    values: Record<string, string>;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type N4_13_State = Record<string, any>;

const parsePpeValue = (v: string) => parseFloat(String(v || '').replace(/,/g, '')) || 0;

export const getDefaultAuditData = (reportingDate: string, startDate: string, companyName: string, addr: string): AuditReportData => {
  const repYear = new Date(reportingDate).getFullYear();
  return {
    company: companyName,
    addr,
    date: new Date().toLocaleDateString(),
    reportingDate,
    startDate,
    ppe: {
      assets: [
        { id: '1', particular: 'Buildings', statementHead: 'Buildings', costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
        { id: '2', particular: 'Machinery', statementHead: 'Plant & machineries', costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
        { id: '3', particular: 'Furniture and fixtures', statementHead: 'Furniture & Fixture', costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
        { id: '4', particular: 'Office equipment', statementHead: 'Office equipment', costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
      ],
      headerInfo: {
        reportTitle: 'Property, plant and equipment',
        annexure: 'Annexure A',
        asAtDate: `30 June ${repYear}`,
        yearStart: `01 Jul ${String(repYear - 1).slice(2)}`,
        yearEnd: `30 June ${String(repYear).slice(2)}`,
      },
      prevYearData: { costOpening: '', costAddition: '', costDisposal: '', depOpening: '', depCharged: '', depAdjustment: '' },
      breakdown: { adminExpense: '0', costOfSalesLabel: 'Cost of sales', adminExpenseLabel: 'Administrative expense' },
    },
    discussionData: { docStatuses: {}, values: {} },
  };
};

export const getDefaultNotesData = (reportingDate: string, companyName: string, addr: string): N4_13_State => {
  const repYear = new Date(reportingDate).getFullYear();
  return {
    company: {
      companyName,
      address: addr,
      reportingDateLabel: `30 June ${repYear}`,
      priorDateLabel: `30 June ${repYear - 1}`,
      currency: 'BDT',
    },
    ppe: { costClosing_cy: 0, costOpening_py: 0, depClosing_cy: 0, depOpening_py: 0, totalDepCharged_cy: 0, adminDep_cy: 0, taxBase_cy: 0 },
    shareConfig: { authorizedShares: 10000000, authorizedFaceValue: 10, issuedShares: 1000000, issuedFaceValue: 10 },
    taxConfig: { rateOnRevenue_cy: 0.01, rateOnRevenue_py: 0.006, rateOnIncome_cy: 0.275, rateOnIncome_py: 0.275 },
    shareholders: [],
    bankAccounts: [],
    loans: [],
    upasEntries: [],
    sections: [],
  };
};

export const performRollover = (
  prevAuditData: AuditReportData,
  prevNotesData: N4_13_State,
  newReportingDate: string,
  prevReportingDate: string,
): { auditData: AuditReportData; notesData: N4_13_State } => {
  const repYear = new Date(newReportingDate).getFullYear();

  const newAuditData: AuditReportData = getDefaultAuditData(
    newReportingDate,
    prevReportingDate,
    prevAuditData.company,
    prevAuditData.addr,
  );

  // Carry forward PPE assets: closing → opening
  newAuditData.ppe.assets = prevAuditData.ppe.assets.map(lastAsset => {
    const co = parsePpeValue(lastAsset.costOpening);
    const ca = parsePpeValue(lastAsset.costAddition);
    const cd = parsePpeValue(lastAsset.costDisposal);
    const costClosing = co + ca - cd;

    const dop = parsePpeValue(lastAsset.depOpening);
    const dc = parsePpeValue(lastAsset.depCharged);
    const da = parsePpeValue(lastAsset.depAdjustment);
    const depClosing = dop + dc + da;

    return {
      ...lastAsset,
      costOpening: costClosing ? costClosing.toString() : '',
      costAddition: '',
      costDisposal: '',
      depOpening: depClosing ? depClosing.toString() : '',
      depCharged: '',
      depAdjustment: '',
    };
  });

  newAuditData.ppe.headerInfo = {
    ...prevAuditData.ppe.headerInfo,
    asAtDate: `30 June ${repYear}`,
    yearStart: `01 Jul ${String(repYear - 1).slice(2)}`,
    yearEnd: `30 June ${String(repYear).slice(2)}`,
  };

  // prevYearData = totals from previous year
  const prevTotals = prevAuditData.ppe.assets.reduce(
    (t, asset) => {
      const co = parsePpeValue(asset.costOpening);
      const ca = parsePpeValue(asset.costAddition);
      const cd = parsePpeValue(asset.costDisposal);
      const dop = parsePpeValue(asset.depOpening);
      const dc = parsePpeValue(asset.depCharged);
      const da = parsePpeValue(asset.depAdjustment);
      return {
        costOpening: t.costOpening + co, costAddition: t.costAddition + ca, costDisposal: t.costDisposal + cd,
        depOpening: t.depOpening + dop, depCharged: t.depCharged + dc, depAdjustment: t.depAdjustment + da,
      };
    },
    { costOpening: 0, costAddition: 0, costDisposal: 0, depOpening: 0, depCharged: 0, depAdjustment: 0 }
  );

  newAuditData.ppe.prevYearData = {
    costOpening: prevTotals.costOpening ? prevTotals.costOpening.toString() : '',
    costAddition: prevTotals.costAddition ? prevTotals.costAddition.toString() : '',
    costDisposal: prevTotals.costDisposal ? prevTotals.costDisposal.toString() : '',
    depOpening: prevTotals.depOpening ? prevTotals.depOpening.toString() : '',
    depCharged: prevTotals.depCharged ? prevTotals.depCharged.toString() : '',
    depAdjustment: prevTotals.depAdjustment ? prevTotals.depAdjustment.toString() : '',
  };

  // Notes data rollover
  const newNotesData: N4_13_State = {
    ...getDefaultNotesData(newReportingDate, prevAuditData.company, prevAuditData.addr),
    company: {
      ...prevNotesData.company,
      reportingDateLabel: new Date(newReportingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      priorDateLabel: prevNotesData.company?.reportingDateLabel || `30 June ${repYear - 1}`,
    },
    ppe: {
      costClosing_cy: 0,
      costOpening_py: prevNotesData.ppe?.costClosing_cy || 0,
      depClosing_cy: 0,
      depOpening_py: prevNotesData.ppe?.depClosing_cy || 0,
      totalDepCharged_cy: 0,
      adminDep_cy: 0,
      taxBase_cy: 0,
    },
    shareConfig: { ...prevNotesData.shareConfig },
    taxConfig: { ...prevNotesData.taxConfig },
    shareholders: JSON.parse(JSON.stringify(prevNotesData.shareholders || [])),
    bankAccounts: (prevNotesData.bankAccounts || []).map((acc: Record<string, unknown>) => ({ ...acc, value_py: acc.value_cy, value_cy: 0 })),
    loans: (prevNotesData.loans || []).map((loan: Record<string, unknown>) => ({
      ...loan,
      total_py: (loan.nonCurrent_cy as number || 0) + (loan.current_cy as number || 0),
      nonCurrent_cy: 0,
      current_cy: 0,
    })),
    upasEntries: (prevNotesData.upasEntries || []).map((upas: Record<string, unknown>) => ({
      ...upas,
      total_py: (upas.nonCurrent_cy as number || 0) + (upas.current_cy as number || 0),
      nonCurrent_cy: 0,
      current_cy: 0,
    })),
    sections: JSON.parse(JSON.stringify(prevNotesData.sections || [])),
  };

  // Roll sections: cy → py
  if (newNotesData.sections) {
    newNotesData.sections.forEach((section: Record<string, unknown>) => {
      const rows = section.rows as Array<Record<string, unknown>>;
      if (rows) {
        rows.forEach((row: Record<string, unknown>) => {
          row.value_py = row.value_cy;
          row.value_cy = 0;
        });
      }
    });
  }

  return { auditData: newAuditData, notesData: newNotesData };
};
