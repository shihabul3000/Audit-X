import { z } from "zod";

export const coverDataSchema = z.object({
  companyName: z.string().optional(),
  reportingDate: z.string().optional(),
  preparedBy: z.string().optional(),
  reviewedBy: z.string().optional(),
  approvedBy: z.string().optional(),
  basisOfPreparation: z.string().optional(),
  significantAccountingPolicies: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export const ppeDataSchema = z.object({
  landAndBuildings: z
    .object({
      cost: z.number().optional(),
      accumulatedDepreciation: z.number().optional(),
      netBookValue: z.number().optional(),
    })
    .optional(),
  plantAndEquipment: z
    .object({
      cost: z.number().optional(),
      accumulatedDepreciation: z.number().optional(),
      netBookValue: z.number().optional(),
    })
    .optional(),
  furnitureAndFittings: z
    .object({
      cost: z.number().optional(),
      accumulatedDepreciation: z.number().optional(),
      netBookValue: z.number().optional(),
    })
    .optional(),
  motorVehicles: z
    .object({
      cost: z.number().optional(),
      accumulatedDepreciation: z.number().optional(),
      netBookValue: z.number().optional(),
    })
    .optional(),
  computerEquipment: z
    .object({
      cost: z.number().optional(),
      accumulatedDepreciation: z.number().optional(),
      netBookValue: z.number().optional(),
    })
    .optional(),
  total: z.object({
    cost: z.number().optional(),
    accumulatedDepreciation: z.number().optional(),
    netBookValue: z.number().optional(),
  }),
});

export const sfpDataSchema = z.object({
  assets: z.object({
    nonCurrentAssets: z
      .object({
        propertyPlantEquipment: z.number().optional(),
        intangibleAssets: z.number().optional(),
        investmentProperties: z.number().optional(),
        longTermInvestments: z.number().optional(),
        deferredTaxAssets: z.number().optional(),
        otherNonCurrentAssets: z.number().optional(),
        totalNonCurrentAssets: z.number().optional(),
      })
      .optional(),
    currentAssets: z
      .object({
        inventories: z.number().optional(),
        tradeReceivables: z.number().optional(),
        otherReceivables: z.number().optional(),
        cashAndCashEquivalents: z.number().optional(),
        totalCurrentAssets: z.number().optional(),
      })
      .optional(),
    totalAssets: z.number().optional(),
  }),
  equityAndLiabilities: z.object({
    equity: z
      .object({
        shareCapital: z.number().optional(),
        retainedEarnings: z.number().optional(),
        otherReserves: z.number().optional(),
        totalEquity: z.number().optional(),
      })
      .optional(),
    nonCurrentLiabilities: z
      .object({
        longTermBorrowings: z.number().optional(),
        deferredTaxLiabilities: z.number().optional(),
        longTermProvisions: z.number().optional(),
        totalNonCurrentLiabilities: z.number().optional(),
      })
      .optional(),
    currentLiabilities: z
      .object({
        tradePayables: z.number().optional(),
        shortTermBorrowings: z.number().optional(),
        shortTermProvisions: z.number().optional(),
        taxPayable: z.number().optional(),
        totalCurrentLiabilities: z.number().optional(),
      })
      .optional(),
    totalLiabilities: z.number().optional(),
    totalEquityAndLiabilities: z.number().optional(),
  }),
});

export const pnlDataSchema = z.object({
  revenue: z.object({
    revenueFromOperations: z.number().optional(),
    otherIncome: z.number().optional(),
    totalRevenue: z.number().optional(),
  }),
  expenses: z.object({
    costOfMaterials: z.number().optional(),
    employeeBenefits: z.number().optional(),
    depreciation: z.number().optional(),
    otherExpenses: z.number().optional(),
    financeCosts: z.number().optional(),
    totalExpenses: z.number().optional(),
  }),
  profitBeforeTax: z.number().optional(),
  taxExpense: z.number().optional(),
  profitAfterTax: z.number().optional(),
});

export const sceDataSchema = z.object({
  goingConcern: z.object({
    assessment: z.string().optional(),
    keyFactors: z.string().optional(),
    materialUncertainty: z.string().optional(),
  }),
  fraud: z.object({
    riskOfFraud: z.string().optional(),
    proceduresPerformed: z.string().optional(),
  }),
  relatedParties: z.object({
    transactions: z.string().optional(),
    "disclosure adequacy": z.string().optional(),
  }),
  subsequentEvents: z.object({
    events: z.string().optional(),
    impact: z.string().optional(),
  }),
  estimates: z.object({
    keyEstimates: z.string().optional(),
    judgementAreas: z.string().optional(),
  }),
});

export const scfDataSchema = z.object({
  operatingActivities: z.object({
    netProfit: z.number().optional(),
    adjustments: z.number().optional(),
    workingCapitalChanges: z.number().optional(),
    netCashFromOperations: z.number().optional(),
  }),
  investingActivities: z.object({
    purchaseOfPPE: z.number().optional(),
    disposalOfPPE: z.number().optional(),
    netCashFromInvesting: z.number().optional(),
  }),
  financingActivities: z.object({
    borrowings: z.number().optional(),
    repayments: z.number().optional(),
    netCashFromFinancing: z.number().optional(),
  }),
  netChangeInCash: z.number().optional(),
  openingCashBalance: z.number().optional(),
  closingCashBalance: z.number().optional(),
});

export const notesDataSchema = z.object({
  noteNumber: z.number().optional(),
  noteTitle: z.string().optional(),
  content: z.string().optional(),
});

export const updateAuditDataSchema = z.object({
  data: z.record(z.string(), z.unknown()),
});

export type CoverDataInput = z.infer<typeof coverDataSchema>;
export type PPEDataInput = z.infer<typeof ppeDataSchema>;
export type SFPDataInput = z.infer<typeof sfpDataSchema>;
export type PNLDataInput = z.infer<typeof pnlDataSchema>;
export type SCEDataInput = z.infer<typeof sceDataSchema>;
export type SCFDataInput = z.infer<typeof scfDataSchema>;
export type NotesDataInput = z.infer<typeof notesDataSchema>;
export type UpdateAuditDataInput = z.infer<typeof updateAuditDataSchema>;