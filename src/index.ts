#!/usr/bin/env node

// executable package. E.g. code that can be used as cli like prettier or eslint

import { simulateLoanRepayments } from "./simulateLoanRepayments";

const main = () => {
  // Example usage
  const startDate = "2024-05-01";
  const loanAmount = 800000; // $500,000 loan
  const annualInterestRate = 4; // 4% annual interest
  const cashInOffset = 50000; // $50,000 in the offset account
  const fortnightlyIncome = 14000; // $2,000 added to the offset account every fortnight
  const loanTermYears = 30; // 30-year loan term
  const fortnights = 26 * 30; // Simulate for 30 years (max, though will likely end earlier due to repayments)

  console.log(
    simulateLoanRepayments(
      startDate,
      loanAmount,
      annualInterestRate,
      cashInOffset,
      fortnightlyIncome,
      loanTermYears,
      fortnights,
    ),
  );
};

main();
