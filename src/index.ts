#!/usr/bin/env node

// executable package. E.g. code that can be used as cli like prettier or eslint

import {
  printRepaymentsTable,
  simulateLoanRepayments,
} from "./simulateLoanRepayments";

const main = () => {
  const startDate = "2024-05-01";
  const loanAmount = 500000; // $500,000 loan
  const annualInterestRate = 4; // 4% annual interest
  const cashInOffset = 50000; // $50,000 in the offset account
  const fortnightlyIncome = 2000; // $2,000 added to the offset account every fortnight
  const loanTermYears = 30; // 30-year loan term
  const fortnights = 52 * 30; // Simulate for 30 years

  const repayments = simulateLoanRepayments(
    startDate,
    loanAmount,
    annualInterestRate,
    cashInOffset,
    fortnightlyIncome,
    loanTermYears,
    fortnights,
  );
  printRepaymentsTable(repayments);
};

main();
