import React from 'react';
import { SectionHeader, EditableValue, TableCell, Dropdown, ValueRow } from './Shared';

interface PageProps {
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

export const Page12: React.FC<PageProps> = ({ docStatuses, handleStatusChange }) => {
  return (
    <div className="bg-white p-4">
      <div className="mb-6">
        <SectionHeader id="12" title="Share capital" />
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <ValueRow label="Share capital" id2025="p12_share_capital_2025" id2024="p12_share_capital_2024" width="w-[60px]" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 font-bold text-[11px] mb-2">
          <span className="bg-white text-black px-1 rounded border border-black text-[10px]">12.01</span>
          <span>. Authorized capital</span>
        </div>
        <div className="pl-8 py-2 text-[11px]">
          <ValueRow label="10,000,000 ordinary shares of Tk. 10 each" id2025="p12_auth_cap_2025" id2024="p12_auth_cap_2024" width="w-[60px]" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 font-bold text-[11px] mb-2">
          <span className="bg-white text-black px-1 rounded border border-black text-[10px]">12.02</span>
          <span>. Issued, subscribed, called up and paid up capital</span>
        </div>
        <div className="pl-8 py-2 text-[11px]">
          <ValueRow label="5,000,000 ordinary shares of Tk. 10 each" id2025="p12_issued_cap_2025" id2024="p12_issued_cap_2024" width="w-[60px]" />
        </div>
      </div>

      <div className="mb-6">
        <SectionHeader id="13" title="Calls-in-arrear" />
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <ValueRow label="Calls-in-arrear" id2025="p12_calls_arrear_2025" id2024="p12_calls_arrear_2024" width="w-[60px]" />
        </div>
      </div>

      <div className="mb-6">
        <SectionHeader id="14" title="Share money deposit" />
        <div className="pl-8 py-2 text-[11px] space-y-1">
          <ValueRow label="Share money deposit" id2025="p12_share_money_2025" id2024="p12_share_money_2024" width="w-[60px]" />
        </div>
      </div>

      <div className="mt-4 border border-blue-800 p-2 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400 min-w-[500px]">
          <tbody>
            <tr>
              <TableCell className="bg-gray-100 font-bold w-1/3">RJSC Return / Form XII</TableCell>
              <TableCell>Form XII, Schedule X, COI, MOA, AOA</TableCell>
              <TableCell className="p-0 w-16"><Dropdown value={docStatuses['rjsc-return']} onChange={(v) => handleStatusChange('rjsc-return', v)} /></TableCell>
            </tr>
            <tr>
              <TableCell className="bg-gray-100 font-bold">Share money deposit ledger</TableCell>
              <TableCell>Bank statement, board resolution, allotment letter</TableCell>
              <TableCell className="p-0 w-16"><Dropdown value={docStatuses['share-money-ledger']} onChange={(v) => handleStatusChange('share-money-ledger', v)} /></TableCell>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
