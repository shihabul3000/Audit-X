import { useState, useEffect } from 'react';
import { AuditReportData } from '../types';

const DEFAULT_DATA: AuditReportData = {
  company: 'Stark Industrys',
  addr: 'Dhaka Bangladesh',
  date: '26 March 2026',
  reportingDate: '2025-06-30',
  startDate: '2024-07-01',
  ppe: {
    assets: [
      { id: '1', particular: "Buildings", statementHead: "Buildings", costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
      { id: '2', particular: "Machinery", statementHead: "Plant & machineries", costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
      { id: '3', particular: "Furniture and fixtures", statementHead: "Furniture & Fixture", costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' },
      { id: '4', particular: "Office equipment", statementHead: "Office equipment", costOpening: '', costAddition: '', costDisposal: '', rate: '', depOpening: '', depCharged: '', depAdjustment: '' }
    ],
    headerInfo: {
      reportTitle: "Property, plant and equipment",
      annexure: "Annexure A",
      asAtDate: "30 June 2025",
      yearStart: "01 Jul 24",
      yearEnd: "30 June 25"
    },
    prevYearData: {
      costOpening: '',
      costAddition: '',
      costDisposal: '',
      depOpening: '',
      depCharged: '',
      depAdjustment: ''
    },
    breakdown: {
      adminExpense: '0',
      costOfSalesLabel: 'Cost of sales',
      adminExpenseLabel: 'Administrative expense'
    }
  },
  discussionData: {
    docStatuses: {
      'land-deed': 'No',
      'dcr': 'No',
      'mutation': 'No',
      'rs': 'No',
      'sa': 'No',
      'cs': 'No',
      'physical-verification': 'No',
      'entry-ppe': 'No',
      'general-ledger': 'No',
      'developers-bills': 'No',
      'mr-payment': 'No',
      'buildings-physical': 'No',
      'buildings-ppe': 'No',
      'buildings-ledger': 'No',
      'machinery-invoice': 'No',
      'machinery-voucher': 'No',
      'machinery-physical': 'Yes',
      'machinery-ppe': 'Yes',
      'machinery-ledger': 'No',
      'motor-invoice': 'No',
      'motor-registration': 'No',
      'motor-tax': 'No',
      'motor-physical': 'No',
      'motor-ppe': 'No',
      'furniture-ledger': 'No',
      'furniture-invoice': 'No',
      'furniture-payment': 'No',
      'furniture-physical': 'No',
      'furniture-ppe': 'No',
      'office-ledger': 'No',
      'office-invoice': 'No',
      'office-payment': 'No',
      'office-physical': 'No',
      'office-ppe': 'No',
      'inv-finished': 'N/A',
      'inv-wip': 'N/A',
      'inv-raw': 'N/A',
      'inv-packing': 'N/A',
      'inv-spare': 'N/A',
      'inv-transit': 'N/A',
      'cos-opening': 'Rectified',
      'cos-production': 'Correct',
      'cos-sample': 'Rectified',
      'cos-closing': 'Correct',
      'rev-customer-aging': 'No',
      'rev-gl-trade': 'No',
      'rev-invoices-cutoff': 'No',
      'tax-challan-payment': 'No',
    },
    values: {}
  }
};

export function useAuditData() {
  const [data, setData] = useState<AuditReportData>(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('auditReportData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Merge with DEFAULT_DATA to handle schema changes
        setData({
          ...DEFAULT_DATA,
          ...parsed,
          ppe: {
            ...DEFAULT_DATA.ppe,
            ...(parsed.ppe || {})
          }
        });
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever it changes, but only after initial load
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('auditReportData', JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const updateData = (newData: Partial<AuditReportData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  return { data, updateData, isLoaded };
}
