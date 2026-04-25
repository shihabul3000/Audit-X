import React from 'react';
import AdvancesDeposits from './Page6/AdvancesDeposits';
import ProvisionForExpense from './Page6/ProvisionForExpense';
import AdministrativeExpense from './Page6/AdministrativeExpense';
import DistributionCosts from './Page6/DistributionCosts';

export const Page6: React.FC = () => {
  return (
    <div className="bg-white p-4">
      <AdvancesDeposits />
      <ProvisionForExpense />
      <AdministrativeExpense />
      <DistributionCosts />
    </div>
  );
};
