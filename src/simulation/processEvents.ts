import { FinancialEvent, SimulationResult } from "./financialTypes";

export function processEvents(events: FinancialEvent[]): SimulationResult[] {
  let loanBalance = 0;
  let offsetBalance = 0;
  let results: SimulationResult[] = [];

  events.forEach(event => {
    if (event.account === 'Loan') {
      loanBalance += (event.action === 'debit' ? event.amount : -event.amount);
    } else if (event.account === 'Offset') {
      offsetBalance += (event.action === 'credit' ? event.amount : -event.amount);
    }

    results.push({
      date: event.date,
      loanBalance,
      offsetBalance,
      netPosition: loanBalance - offsetBalance
    });
  });

  return results;
}
