import { describe, it } from "node:test";
import { expect } from "chai";
import {
  LoanSimulationParams,
  simulateLoanRepayments,
} from "src/loanSimulation";
import Big from "big.js";

describe("Loan Repayment Simulation Tests", () => {
  it("Standard functionality with typical input values", () => {
    // Arrange
    const simulationParams: LoanSimulationParams = {
      startDate: "2024-05-01",
      loanAmount: 100000,
      annualInterestRate: 5,
      cashInOffset: 10000,
      fortnightlyIncome: 500,
      loanTermYears: 1,
      fortnights: 26,
    };

    // Act
    const results = simulateLoanRepayments(simulationParams);

    // Assert
    expect(results).to.have.lengthOf(26);
    const firstRepaymentEntry = results[0];
    expect(firstRepaymentEntry).to.not.be.undefined;
    expect(firstRepaymentEntry.loanBalance).to.satisfy((num: string) =>
      new Big(num).lte(new Big(simulationParams.loanAmount)),
    );
  });

  it("No income added to the offset account", () => {
    // Arrange
    const simulationParams: LoanSimulationParams = {
      startDate: "2024-05-01",
      loanAmount: 50000,
      annualInterestRate: 5,
      cashInOffset: 5000,
      fortnightlyIncome: 0,
      loanTermYears: 1,
      fortnights: 26,
    };

    // Act
    const results = simulateLoanRepayments(simulationParams);

    // Assert
    expect(results).to.have.lengthOf(26);
    const lastRepaymentEntry = results[results.length - 1];
    expect(lastRepaymentEntry.loanBalance).to.not.equal("0");
  });

  it("High income significantly reducing loan balance quickly", () => {
    // Arrange
    const simulationParams: LoanSimulationParams = {
      startDate: "2024-05-01",
      loanAmount: 50000,
      annualInterestRate: 5,
      cashInOffset: 5000,
      fortnightlyIncome: 10000,
      loanTermYears: 1,
      fortnights: 26,
    };

    // Act
    const results = simulateLoanRepayments(simulationParams);

    // Assert
    const secondRepaymentEntry = results[1];
    expect(new Big(secondRepaymentEntry.loanBalance)).to.be.below(
      new Big(50000),
    );
  });

  it("Zero interest rate", () => {
    // Arrange
    const simulationParams: LoanSimulationParams = {
      startDate: "2024-05-01",
      loanAmount: 100000,
      annualInterestRate: 0,
      cashInOffset: 10000,
      fortnightlyIncome: 500,
      loanTermYears: 1,
      fortnights: 26,
    };

    // Act
    const results = simulateLoanRepayments(simulationParams);

    // Assert
    const firstRepaymentEntry = results[0];
    expect(firstRepaymentEntry.interestSaved).to.equal("0.00");
  });

  it("Loan fully offset from start", () => {
    // Arrange
    const simulationParams: LoanSimulationParams = {
      startDate: "2024-05-01",
      loanAmount: 50000,
      annualInterestRate: 5,
      cashInOffset: 50000,
      fortnightlyIncome: 1000,
      loanTermYears: 1,
      fortnights: 26,
    };

    // Act
    const results = simulateLoanRepayments(simulationParams);

    // Assert
    const firstRepaymentEntry = results[0];
    expect(firstRepaymentEntry.interestSaved).to.equal("0.00");
  });
});
