// src/utils/generateEvents.ts

import { addMonths } from 'date-fns';
import { SimulationParams, FinancialEvent } from './financialTypes';
import { calculateMonthlyRepayment } from './calculateRepayment';

export function generateEvents(params: SimulationParams): FinancialEvent[] {
  let events: FinancialEvent[] = [];
  let currentDate = new Date(params.startDate);
  let loanBalance = params.loanAmount;
  let offsetBalance = params.offsetAccountInitialBalance;
  const monthlyRepayment = calculateMonthlyRepayment(params.loanAmount, params.annualInterestRate, params.loanTermYears);

  for (let i = 0; i < params.loanTermYears * 12; i++) {
    const interestAmount = Math.max(0, (loanBalance - offsetBalance) * (params.annualInterestRate / 1200));
    loanBalance += interestAmount; // Assuming interest is compounded to the balance
    loanBalance -= monthlyRepayment; // Assuming repayment reduces the balance
    offsetBalance += params.monthlyOffsetContribution;

    events.push({
      date: currentDate.toISOString().split("T")[0],
      account: 'Loan',
      action: 'debit',
      amount: interestAmount,
      description: 'Interest charged'
    });

    events.push({
      date: currentDate.toISOString().split("T")[0],
      account: 'Loan',
      action: 'credit',
      amount: monthlyRepayment,
      description: 'Repayment'
    });

    currentDate = addMonths(currentDate, 1);
  }

  // Add custom events if they exist
  events = events.concat(params.events);

  return events;
}
