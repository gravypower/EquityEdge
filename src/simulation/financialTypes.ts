// financialTypes.ts
export type EventType = 'Repayment' | 'Interest Charge' | 'Income Application' | 'Adjustment' | 'Offset Contribution' | 'Custom';

export type IntervalType = 'weekly' | 'fortnightly' | 'monthly';
export type AccountType = 'Loan' | 'Interest' | 'Cash' | 'Offset' | 'Income';

export interface FinancialEvent {
  date: string;
  account: AccountType;
  action: 'debit' | 'credit';
  amount: number;
  description?: string;
}

export interface SimulationParams {
  startDate: string;
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;
  offsetAccountInitialBalance: number;
  monthlyOffsetContribution: number;
  events: FinancialEvent[];
  intervalType: IntervalType;
}

export interface SimulationResult {
  date: string;
  loanBalance: number;
  offsetBalance: number;
  netPosition: number;
}