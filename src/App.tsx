// src/components/App.tsx

import React, { useState } from 'react';
import InputField from './components/InputField';
import ResultsTable from './components/ResultsTable';
import { calculateMonthlyRepayment } from './simulation/calculateRepayment';
import { IntervalType, SimulationResult, SimulationParams } from './simulation/financialTypes';
import { runSimulation } from './simulation/simulationEngine';


const App: React.FC = () => {
  // State for form inputs
  const [startDate, setStartDate] = useState<string>('2023-01-01');
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(3.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [offsetAccountInitialBalance, setOffsetAccountInitialBalance] = useState<number>(0);
  const [monthlyOffsetContribution, setMonthlyOffsetContribution] = useState<number>(0);
  const [intervalType, setIntervalType] = useState<IntervalType>('monthly');
  const [results, setResults] = useState<SimulationResult[]>([]);

  // Event handlers
  const handleSubmit = () => {
    const monthlyRepayment = calculateMonthlyRepayment(loanAmount, annualInterestRate, loanTermYears);
    const params: SimulationParams = {
      startDate,
      loanAmount,
      annualInterestRate,
      loanTermYears,
      offsetAccountInitialBalance,
      monthlyOffsetContribution,
      events: [],
      intervalType
    };
    const simulationResults = runSimulation(params);
    setResults(simulationResults);
  };

  // Render method
  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Loan Simulation</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Inputs */}
        <InputField label="Start Date" type="date" value={startDate} onChange={setStartDate} />
        <InputField label="Loan Amount" type="number" value={loanAmount.toString()} onChange={val => setLoanAmount(Number(val))} />
        <InputField label="Annual Interest Rate (%)" type="number" value={annualInterestRate.toString()} onChange={val => setAnnualInterestRate(Number(val))} />
        <InputField label="Loan Term (Years)" type="number" value={loanTermYears.toString()} onChange={val => setLoanTermYears(Number(val))} />
        <InputField label="Offset Account Initial Balance" type="number" value={offsetAccountInitialBalance.toString()} onChange={val => setOffsetAccountInitialBalance(Number(val))} />
        <InputField label="Monthly Offset Contribution" type="number" value={monthlyOffsetContribution.toString()} onChange={val => setMonthlyOffsetContribution(Number(val))} />
        <InputField label="Repayment Interval" type="select" value={intervalType} onChange={val => setIntervalType(val as IntervalType)} options={[
          { label: 'Weekly', value: 'weekly' },
          { label: 'Fortnightly', value: 'fortnightly' },
          { label: 'Monthly', value: 'monthly' }
        ]} />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Run Simulation</button>
      </div>
      <ResultsTable results={results} />
    </div>
  );
};

export default App;
