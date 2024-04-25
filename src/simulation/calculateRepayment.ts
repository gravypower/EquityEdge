export function calculateMonthlyRepayment(loanAmount: number, annualInterestRate: number, loanTermYears: number): number {
    const monthlyRate = annualInterestRate / 1200;
    const numberOfPayments = loanTermYears * 12;
    if (monthlyRate === 0) { // No interest rate scenario
      return loanAmount / numberOfPayments;
    }
    const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
    return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
  }