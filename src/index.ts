#!/usr/bin/env node

// executable package. E.g. code that can be used as cli like prettier or eslint

import {
  SimulationParams,
  printRepaymentsTable,
  runSimulation,
} from "../equityedge/simulation";

const main = () => {
  const simulationParams: SimulationParams = {
    startDate: "2024-01-01",
    loanAmount: 10000,
    annualInterestRate: 5,
    cashInOffset: 0,
    incomePerInterval: 1000,
    loanTermYears: 5,
    intervals: 60, // Assuming monthly intervals for 5 years
    intervalType: "monthly",
    events: [
      {
        date: "2024-02-15",
        target: "offset",
        action: "increase",
        amount: 500, // Increase cash in offset by $500 on January 15, 2024,
        description: "some bill",
      },
      {
        date: "2024-03-20",
        target: "loan",
        action: "decrease",
        amount: 2000, // Decrease loan amount by $2000 on March 1, 2024
      },
      // Add more events as needed
    ],
  };

  // Simulate loan repayments
  const repayments = runSimulation(simulationParams);
  // Print the repayments table
  printRepaymentsTable(repayments);
};

main();
