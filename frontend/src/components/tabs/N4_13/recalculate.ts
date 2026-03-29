import { Store } from './types';
// ─── CALCULATION ENGINE ───────────────────────────────────────────────────────
const recalculate = (state: any) => {
  const getRow = (sId: string, rId: string) => state.sections.find((s: any) => s.id === sId)?.rows.find((r: any) => r.id === rId);
  const setVal = (sId: string, rId: string, f: string, v: number) => { const r = getRow(sId, rId); if (r) r[f] = v; };
  const getVal = (sId: string, rId: string, f = 'value_cy') => getRow(sId, rId)?.[f] ?? 0;

  // ── Step 1: PPE → Note 4 ──────────────────────────────────────────────────
  setVal('note04', 'ppe_cost', 'value_cy', state.ppe.costClosing_cy);
  setVal('note04', 'ppe_cost', 'value_py', state.ppe.costOpening_py);
  setVal('note04', 'ppe_dep', 'value_cy', -Math.abs(state.ppe.depClosing_cy));
  setVal('note04', 'ppe_dep', 'value_py', -Math.abs(state.ppe.depOpening_py));

  // Note 5 (Intangible) — user-entered, just recalc total
  // Note 6 (Inventories) — user-entered

  // ── Step 2: Bank accounts → Note 11 cash_at_bank ─────────────────────────
  const bcy = state.bankAccounts.reduce((s, b) => s + b.value_cy, 0);
  const bpy = state.bankAccounts.reduce((s, b) => s + b.value_py, 0);
  setVal('note11', 'cash_at_bank', 'value_cy', bcy);
  setVal('note11', 'cash_at_bank', 'value_py', bpy);

  // ── Step 3: Closing stocks → Cost of Sales (Note 20/note20) ──────────────
  // Note 6 FG → Note 20 closing FG (negative)
  const fg_cy = getVal('note06', 'fg', 'value_cy');
  const fg_py = getVal('note06', 'fg', 'value_py');
  setVal('note20', 'cos_close_fg', 'value_cy', -Math.abs(fg_cy));
  setVal('note20', 'cos_close_fg', 'value_py', -Math.abs(fg_py));

  // Note 6 RM → Note 20_02 closing RM (negative)
  const rm_cy = getVal('note06', 'rm', 'value_cy');
  const rm_py = getVal('note06', 'rm', 'value_py');
  setVal('note20_02', 'rm_close', 'value_cy', -Math.abs(rm_cy));
  setVal('note20_02', 'rm_close', 'value_py', -Math.abs(rm_py));

  // Note 6 WIP → Note 20_03 closing WIP (negative)
  const wip_cy = getVal('note06', 'wip', 'value_cy');
  const wip_py = getVal('note06', 'wip', 'value_py');
  setVal('note20_03', 'wip_close', 'value_cy', wip_cy === 0 ? 0 : -Math.abs(wip_cy));
  setVal('note20_03', 'wip_close', 'value_py', wip_py === 0 ? 0 : -Math.abs(wip_py));

  // Note 6 prod_supplies → Note 20_04 closing PS (negative)
  const ps_cy = getVal('note06', 'prod_supplies', 'value_cy');
  const ps_py = getVal('note06', 'prod_supplies', 'value_py');
  setVal('note20_04', 'ps_close', 'value_cy', ps_cy === 0 ? 0 : -Math.abs(ps_cy));
  setVal('note20_04', 'ps_close', 'value_py', ps_py === 0 ? 0 : -Math.abs(ps_py));

  // ── Step 4: PPE depreciation split → Note 24.03 factory dep, Note 25 admin dep ──
  const factoryDep = state.ppe.totalDepCharged_cy - state.ppe.adminDep_cy;
  setVal('note20_03', 'dep_factory', 'value_cy', factoryDep);
  setVal('note20_03', 'dep_factory', 'value_py', 0);
  setVal('note21', 'dep_admin', 'value_cy', state.ppe.adminDep_cy);
  setVal('note21', 'dep_admin', 'value_py', 0);

  // ── Step 5: Note 20_04 → 20_03 prod_sup ──────────────────────────────────
  // (recalced in totals step below first, then push)

  // ── Step 6: Note 21 audit fees → Note 22 provision for audit ─────────────
  const auditFees_cy = getVal('note21', 'audit_fees', 'value_cy');
  const auditFees_py = getVal('note21', 'audit_fees', 'value_py');
  setVal('note22', 'prov_audit', 'value_cy', auditFees_cy);
  setVal('note22', 'prov_audit', 'value_py', auditFees_py);

  // ── Step 7: Recalc all standard section totals ────────────────────────────
  state.sections.forEach(sec => {
    if (!sec.tableType || sec.tableType === 'standard') {
      let scy = 0, spy = 0;
      sec.rows.forEach(r => {
        if (r.isTotal) {
          r.value_cy = scy;
          r.value_py = spy;
          scy = 0; spy = 0;
        } else if (!r.isSubHeader && !r.isRichText) {
          scy += r.value_cy;
          spy += r.value_py;
        }
      });
    }
  });

  // ── Step 8: Sub-note cascades (after totals recalced) ────────────────────
  // Note 20_04 total → Note 20_03 prod_sup
  const ps_total_cy = getVal('note20_04', 'ps_total', 'value_cy');
  const ps_total_py = getVal('note20_04', 'ps_total', 'value_py');
  setVal('note20_03', 'prod_sup', 'value_cy', ps_total_cy);
  setVal('note20_03', 'prod_sup', 'value_py', ps_total_py);

  // Note 20_02 mat_total → Note 20_01 mat_used
  const mat_cy = getVal('note20_02', 'mat_total', 'value_cy');
  const mat_py = getVal('note20_02', 'mat_total', 'value_py');
  setVal('note20_01', 'mat_used', 'value_cy', mat_cy);
  setVal('note20_01', 'mat_used', 'value_py', mat_py);

  // Note 20_03 total → Note 20_01 prod_oh
  const oh_cy = getVal('note20_03', 'prod_oh_total', 'value_cy');
  const oh_py = getVal('note20_03', 'prod_oh_total', 'value_py');
  setVal('note20_01', 'prod_oh', 'value_cy', oh_cy);
  setVal('note20_01', 'prod_oh', 'value_py', oh_py);

  // Note 20_01 total → Note 20 cop
  const cop_cy = getVal('note20_01', 'cop_total', 'value_cy');
  const cop_py = getVal('note20_01', 'cop_total', 'value_py');
  setVal('note20', 'cop', 'value_cy', cop_cy);
  setVal('note20', 'cop', 'value_py', cop_py);

  // ── Re-run totals after cascades ─────────────────────────────────────────
  state.sections.forEach(sec => {
    if (!sec.tableType || sec.tableType === 'standard') {
      let scy = 0, spy = 0;
      sec.rows.forEach(r => {
        if (r.isTotal) {
          r.value_cy = scy;
          r.value_py = spy;
          scy = 0; spy = 0;
        } else if (!r.isSubHeader && !r.isRichText) {
          scy += r.value_cy;
          spy += r.value_py;
        }
      });
    }
  });

  // ── Step 9: Tax calculation (Bangladesh rule) ─────────────────────────────
  const rev_cy = getVal('note19', 'net_revenue', 'value_cy');
  const pbt_cy = getVal('note25_01', 'pbt', 'value_cy');
  const tax_cy = Math.max(rev_cy * state.taxConfig.rateOnRevenue_cy, pbt_cy * state.taxConfig.rateOnIncome_cy);
  const rev_py = getVal('note19', 'net_revenue', 'value_py');
  const pbt_py = getVal('note25_01', 'pbt', 'value_py');
  const tax_py = Math.max(rev_py * state.taxConfig.rateOnRevenue_py, pbt_py * state.taxConfig.rateOnIncome_py);
  setVal('note21_ctp', 'current_tax', 'value_cy', tax_cy);
  setVal('note21_ctp', 'current_tax', 'value_py', tax_py);
  setVal('note25', 'current_tax', 'value_cy', tax_cy);
  setVal('note25', 'current_tax', 'value_py', tax_py);

  // ── Step 10: Note 21_ctp adjustment → Note 10 ait_adj ────────────────────
  const adj_cy = getVal('note21_ctp', 'adjustment', 'value_cy');
  const adj_py = getVal('note21_ctp', 'adjustment', 'value_py');
  setVal('note10', 'ait_adj', 'value_cy', adj_cy);
  setVal('note10', 'ait_adj', 'value_py', adj_py);

  // ── Step 11: Shareholders → Note 12 ──────────────────────────────────────
  const totalShares = state.shareholders.reduce((s, sh) => s + sh.shares, 0);
  const totalAmt = totalShares * state.shareConfig.issuedFaceValue;
  const authAmt = state.shareConfig.authorizedShares * state.shareConfig.authorizedFaceValue;
  setVal('note12_01', 'auth_capital', 'value_cy', authAmt);
  setVal('note12_01', 'auth_capital', 'value_py', authAmt);
  setVal('note12_02', 'issued_capital', 'value_cy', totalAmt);
  setVal('note12_02', 'issued_capital', 'value_py', totalAmt);

  // ── Step 12: Loans totals → Note 15 ──────────────────────────────────────
  const loanNC = state.loans.reduce((s, l) => s + l.nonCurrent_cy, 0);
  const loanC = state.loans.reduce((s, l) => s + l.current_cy, 0);
  const loanPY = state.loans.reduce((s, l) => s + l.total_py, 0);
  setVal('note15', 'loan_grand', 'value_cy', loanNC + loanC);
  setVal('note15', 'loan_grand', 'value_py', loanPY);

  // UPAS
  const upasNC = state.upasEntries.reduce((s, l) => s + l.nonCurrent_cy, 0);
  const upasC = state.upasEntries.reduce((s, l) => s + l.current_cy, 0);
  const upasPY = state.upasEntries.reduce((s, l) => s + l.total_py, 0);
  setVal('note16', 'upas_grand', 'value_cy', upasNC + upasC);
  setVal('note16', 'upas_grand', 'value_py', upasPY);

  // ── Final total pass ──────────────────────────────────────────────────────
  state.sections.forEach(sec => {
    if (!sec.tableType || sec.tableType === 'standard') {
      let scy = 0, spy = 0;
      sec.rows.forEach(r => {
        if (r.isTotal) {
          r.value_cy = scy;
          r.value_py = spy;
          scy = 0; spy = 0;
        } else if (!r.isSubHeader && !r.isRichText) {
          scy += r.value_cy;
          spy += r.value_py;
        }
      });
    }
  });
};


export { recalculate };