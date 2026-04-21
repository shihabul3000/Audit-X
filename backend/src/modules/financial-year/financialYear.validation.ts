import { z } from "zod";

export const createYearSchema = z.object({
  reportingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export const updateYearSchema = z.object({
  reportingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});

export const rolloverSchema = z.object({
  newReportingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export const getDefaultAuditReportData = (reportingDate: string): object => {
  const year = new Date(reportingDate).getFullYear();
  return {
    company: "New Company",
    addr: "Address",
    date: new Date().toLocaleDateString(),
    reportingDate: reportingDate,
    startDate: `${year - 1}-07-01`,
    ppe: {
      assets: [
        { id: "1", particular: "Buildings", statementHead: "Buildings", costOpening: "", costAddition: "", costDisposal: "", rate: "", depOpening: "", depCharged: "", depAdjustment: "" },
        { id: "2", particular: "Machinery", statementHead: "Plant & machineries", costOpening: "", costAddition: "", costDisposal: "", rate: "", depOpening: "", depCharged: "", depAdjustment: "" },
        { id: "3", particular: "Furniture and fixtures", statementHead: "Furniture & Fixture", costOpening: "", costAddition: "", costDisposal: "", rate: "", depOpening: "", depCharged: "", depAdjustment: "" },
        { id: "4", particular: "Office equipment", statementHead: "Office equipment", costOpening: "", costAddition: "", costDisposal: "", rate: "", depOpening: "", depCharged: "", depAdjustment: "" }
      ],
      headerInfo: {
        reportTitle: "Property, plant and equipment",
        annexure: "Annexure A",
        asAtDate: `30 June ${year}`,
        yearStart: `01 Jul ${String(year - 1).slice(2)}`,
        yearEnd: `30 June ${String(year).slice(2)}`
      },
      prevYearData: {
        costOpening: "", costAddition: "", costDisposal: "",
        depOpening: "", depCharged: "", depAdjustment: ""
      },
      breakdown: {
        adminExpense: "0",
        costOfSalesLabel: "Cost of sales",
        adminExpenseLabel: "Administrative expense"
      }
    },
    discussionData: {
      docStatuses: {},
      values: {}
    }
  };
};

export const getDefaultNotesData = (reportingDate: string): object => {
  const year = new Date(reportingDate).getFullYear();
  return {
    company: {
      companyName: "New Company Ltd.",
      address: "Dhaka, Bangladesh",
      reportingDateLabel: `30 June ${year}`,
      priorDateLabel: `30 June ${year - 1}`,
      currency: "BDT",
    },
    ppe: {
      costClosing_cy: 0, costOpening_py: 0,
      depClosing_cy: 0, depOpening_py: 0,
      totalDepCharged_cy: 0, adminDep_cy: 0, taxBase_cy: 0,
    },
    shareConfig: { authorizedShares: 10000000, authorizedFaceValue: 10, issuedShares: 1000000, issuedFaceValue: 10 },
    taxConfig: { rateOnRevenue_cy: 0.01, rateOnRevenue_py: 0.006, rateOnIncome_cy: 0.275, rateOnIncome_py: 0.275 },
    shareholders: [],
    bankAccounts: [],
    loans: [],
    upasEntries: [],
    sections: [],
  };
};