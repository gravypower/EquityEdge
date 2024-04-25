// src/components/ResultsTable.tsx

import React from 'react';
import { SimulationResult } from '../simulation/financialTypes';


interface ResultsTableProps {
  results: SimulationResult[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
          <tr>
            <th scope="col" className="py-3 px-6">Date</th>
            <th scope="col" className="py-3 px-6">Loan Balance</th>
            <th scope="col" className="py-3 px-6">Offset Balance</th>
            <th scope="col" className="py-3 px-6">Net Position</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index} className="bg-white border-b">
              <td className="py-4 px-6">{result.date}</td>
              <td className="py-4 px-6">${result.loanBalance.toFixed(2)}</td>
              <td className="py-4 px-6">${result.offsetBalance.toFixed(2)}</td>
              <td className="py-4 px-6">${result.netPosition.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
