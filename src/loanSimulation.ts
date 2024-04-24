import Big from "big.js";

export type LoanRepaymentEntry = {
  date: string | undefined;
  loanBalance: string;
  cashInOffset: string;
  interestSaved: string;
  cumulativeInterestSaved: string;
};

export type LoanSimulationParams = {
  startDate: string;
  loanAmount: number;
  annualInterestRate: number;
  cashInOffset: number;
  fortnightlyIncome: number;
  loanTermYears: number;
  fortnights: number;
};

export function simulateLoanRepayments(
  params: LoanSimulationParams,
): LoanRepaymentEntry[] {
  const {
    startDate,
    loanAmount,
    annualInterestRate,
    cashInOffset,
    fortnightlyIncome,
    loanTermYears,
    fortnights,
  } = params;
  const monthlyRate = new Big(annualInterestRate).div(1200); // Convert annual rate to a monthly rate
  const totalPayments = new Big(loanTermYears).times(12); // Total number of monthly payments
  const P = new Big(loanAmount);
  const onePlusR = monthlyRate.plus(1);
  const monthlyRepayment = P.mul(monthlyRate)
    .mul(onePlusR.pow(totalPayments.toNumber()))
    .div(onePlusR.pow(totalPayments.toNumber()).minus(1));
  const fortnightlyRepayment = monthlyRepayment.div(2.17); // Approximate conversion of monthly to fortnightly payment

  let currentLoanBalance = new Big(loanAmount);
  let currentCashInOffset = new Big(cashInOffset);
  let cumulativeInterestSaved = new Big(0);
  const repayments: LoanRepaymentEntry[] = [];

  for (let i = 0; i < fortnights; i++) {
    // Add income to offset each period before calculating interest
    currentCashInOffset = currentCashInOffset.plus(fortnightlyIncome);

    // Calculate interest based on current loan and offset balance
    const effectiveLoanBalance = currentLoanBalance.minus(currentCashInOffset);
    const interestSaved = effectiveLoanBalance.gt(0)
      ? effectiveLoanBalance.times(monthlyRate.div(2.17))
      : new Big(0);
    cumulativeInterestSaved = cumulativeInterestSaved.plus(interestSaved);
    currentLoanBalance = currentLoanBalance.minus(interestSaved); // Reducing the balance by interest saved

    // Apply fortnightly repayment to the loan balance
    currentLoanBalance = currentLoanBalance.minus(fortnightlyRepayment);
    currentLoanBalance = currentLoanBalance.gt(0)
      ? currentLoanBalance
      : new Big(0);

    const entry: LoanRepaymentEntry = {
      date: new Date(
        new Date(startDate).getTime() + i * 14 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split("T")[0],
      loanBalance: currentLoanBalance.round(2).toString(),
      cashInOffset: currentCashInOffset.round(2).toString(),
      interestSaved: interestSaved.round(2).toString(),
      cumulativeInterestSaved: cumulativeInterestSaved.round(2).toString(),
    };
    repayments.push(entry);

    // Break out of the loop if the loan is fully repaid
    if (currentLoanBalance.lte(0)) break;
  }

  return repayments;
}

// Function to print the repayments in a table
export function printRepaymentsTable(repayments: LoanRepaymentEntry[]): void {
  console.log(
    "Date       | Loan Balance | Cash in Offset | Interest Saved | Cumulative Interest Saved",
  );
  console.log(
    "------------------------------------------------------------------------------------",
  );
  repayments.forEach((entry) => {
    console.log(
      `${entry.date} | $${entry.loanBalance.padStart(12)} | $${entry.cashInOffset.padStart(13)} | $${entry.interestSaved.padStart(13)} | $${entry.cumulativeInterestSaved.padStart(23)}`,
    );
  });
}
