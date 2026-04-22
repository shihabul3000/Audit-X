import React from 'react';
import { AuditReportData } from '../../../types';
import Header from './Page1/Header';
import Note4 from './Page1/Note4';
import Note4_01 from './Page1/Note4_01';
import AssetTable from './Page1/AssetTable';

interface PageProps {
  data: AuditReportData;
  onUpdate: (data: Partial<AuditReportData>) => void;
  docStatuses: Record<string, string>;
  handleStatusChange: (id: string, val: string) => void;
}

export const Page1: React.FC<PageProps> = ({ data, onUpdate, docStatuses, handleStatusChange }) => {
  return (
    <div className="bg-white p-4">
      <Header data={data} onUpdate={onUpdate} />
      <Note4 />
      <Note4_01 />
      <AssetTable docStatuses={docStatuses} handleStatusChange={handleStatusChange} />
    </div>
  );
};
