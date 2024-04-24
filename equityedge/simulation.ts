import Big from "big.js";
import {
  addDays,
  addWeeks,
  addMonths,
  isWithinInterval,
  parseISO,
  getDaysInMonth,
} from "date-fns";

type AdjustmentEvent = {
  date: string;
  target: "loan" | "offset"; // Specifies whether it's the loan balance or the cash in offset that's being adjusted
  action: "increase" | "decrease"; // Specifies the action to take on the target
  amount: number; // The amount by which the target is adjusted
  description?: string; // Optional description for the event
};

export type SimulationEntry = {
  date: string | undefined;
  loanBalance: string;
  cashInOffset: string;
  interestSaved: string;
  cumulativeInterestSaved: string;
  cumulativeInterest: string; // Cumulative interest up to this period
  interestForPeriod: string; // Interest amount for this period
  events: (AdjustmentEvent & { description?: string })[]; // Array of adjustment events for the repayment entry
};

export type SimulationParams = {
  startDate: string;
  loanAmount: number;
  annualInterestRate: number;
  cashInOffset: number;
  incomePerInterval: number;
  loanTermYears: number;
  intervals: number;
  intervalType: "weekly" | "fortnightly" | "monthly";
  events: AdjustmentEvent[];
};

function processEvents(
  events: AdjustmentEvent[],
  currentDate: Date,
  nextDate: Date,
  currentLoanBalance: Big,
  currentCashInOffset: Big,
): { newLoanBalance: Big; newCashInOffset: Big } {
  let newLoanBalance = currentLoanBalance;
  let newCashInOffset = currentCashInOffset;

  events.forEach((event) => {
    const eventDate = parseISO(event.date);
    if (isWithinInterval(eventDate, { start: currentDate, end: nextDate })) {
      const amount = new Big(event.amount);
      switch (event.target) {
        case "loan":
          if (event.action === "increase") {
            newLoanBalance = newLoanBalance.plus(amount);
          } else {
            newLoanBalance = newLoanBalance.minus(amount);
          }
          break;
        case "offset":
          if (event.action === "increase") {
            newCashInOffset = newCashInOffset.plus(amount);
          } else {
            newCashInOffset = newCashInOffset.minus(amount);
          }
          break;
      }
    }
  });

  return { newLoanBalance, newCashInOffset };
}

function calculateWeekly(
  currentDate: Date,
  monthlyRate: Big,
  monthlyRepayment: Big,
  daysInCurrentMonth: number,
) {
  const intervalRate = monthlyRate.mul(7 / daysInCurrentMonth);
  const intervalRepayment = monthlyRepayment.mul(7 / daysInCurrentMonth);
  const nextDate = addWeeks(currentDate, 1);
  return { intervalRate, intervalRepayment, nextDate };
}

function calculateFortnightly(
  currentDate: Date,
  monthlyRate: Big,
  monthlyRepayment: Big,
  daysInCurrentMonth: number,
) {
  const intervalRate = monthlyRate.mul(14 / daysInCurrentMonth);
  const intervalRepayment = monthlyRepayment.mul(14 / daysInCurrentMonth);
  const nextDate = addWeeks(currentDate, 2);
  return { intervalRate, intervalRepayment, nextDate };
}

function calculateMonthly(
  currentDate: Date,
  monthlyRate: Big,
  monthlyRepayment: Big,
) {
  const intervalRate = monthlyRate;
  const intervalRepayment = monthlyRepayment;
  const nextDate = addMonths(currentDate, 1);
  return { intervalRate, intervalRepayment, nextDate };
}

export function runSimulation(params: SimulationParams): SimulationEntry[] {
  const {
    startDate,
    loanAmount,
    annualInterestRate,
    cashInOffset,
    incomePerInterval,
    loanTermYears,
    intervals,
    intervalType,
    events,
  } = params;

  const monthlyRate = new Big(annualInterestRate).div(1200);
  const P = new Big(loanAmount);
  const onePlusR = monthlyRate.plus(1);
  const totalPayments = new Big(loanTermYears).times(12);
  const monthlyRepayment = P.mul(monthlyRate)
    .mul(onePlusR.pow(totalPayments.toNumber()))
    .div(onePlusR.pow(totalPayments.toNumber()).minus(1));

  let currentLoanBalance = new Big(loanAmount);
  let currentCashInOffset = new Big(cashInOffset);
  let cumulativeInterestSaved = new Big(0);
  let cumulativeInterest = new Big(0);
  const repayments: SimulationEntry[] = [];
  let currentDate = new Date(startDate);

  // Define the intervalFunction based on the intervalType
  let intervalFunction: (
    currentDate: Date,
    monthlyRate: Big,
    monthlyRepayment: Big,
    daysInCurrentMonth: number,
  ) => { intervalRate: Big; intervalRepayment: Big; nextDate: Date };
  switch (intervalType) {
    case "weekly":
      intervalFunction = calculateWeekly;
      break;
    case "fortnightly":
      intervalFunction = calculateFortnightly;
      break;
    case "monthly":
      intervalFunction = calculateMonthly;
      break;
    default:
      throw new Error(`Invalid interval type: ${intervalType}`);
  }

  for (let i = 0; i < intervals; i++) {
    // Calculate next date
    const nextDate = intervalFunction(
      currentDate,
      monthlyRate,
      monthlyRepayment,
      getDaysInMonth(currentDate),
    ).nextDate;

    // Process events for the current interval
    const { newLoanBalance, newCashInOffset } = processEvents(
      events,
      currentDate,
      nextDate,
      currentLoanBalance,
      currentCashInOffset,
    );
    currentLoanBalance = newLoanBalance;
    currentCashInOffset = newCashInOffset;

    const daysInCurrentMonth = getDaysInMonth(currentDate);
    const { intervalRate, intervalRepayment } = intervalFunction(
      currentDate,
      monthlyRate,
      monthlyRepayment,
      daysInCurrentMonth,
    );

    currentCashInOffset = currentCashInOffset.plus(incomePerInterval);

    const effectiveLoanBalance = currentLoanBalance.minus(currentCashInOffset);

    const interestSaved = effectiveLoanBalance.gt(0)
      ? effectiveLoanBalance.times(intervalRate)
      : new Big(0);
    cumulativeInterestSaved = cumulativeInterestSaved.plus(interestSaved);
    cumulativeInterest = cumulativeInterest.plus(interestSaved);

    const interestForPeriod = cumulativeInterest.minus(cumulativeInterestSaved);
    currentLoanBalance = currentLoanBalance
      .minus(interestSaved)
      .minus(intervalRepayment);
    currentLoanBalance = currentLoanBalance.gt(0)
      ? currentLoanBalance
      : new Big(0);

    const entry: SimulationEntry = {
      date: currentDate.toISOString().split("T")[0],
      loanBalance: currentLoanBalance.round(2).toString(),
      cashInOffset: currentCashInOffset.round(2).toString(),
      interestSaved: interestSaved.round(2).toString(),
      cumulativeInterestSaved: cumulativeInterestSaved.round(2).toString(),
      cumulativeInterest: cumulativeInterest.round(2).toString(),
      interestForPeriod: interestForPeriod.round(2).toString(),
      events: events
        .filter((event) =>
          isWithinInterval(parseISO(event.date), {
            start: currentDate,
            end: nextDate,
          }),
        )
        .map((event) => ({
          ...event,
          description: event.description
            ? event.description
            : `${event.target.charAt(0).toUpperCase() + event.target.slice(1)} ${event.action === "increase" ? "increased" : "decreased"} by ${event.amount}`,
        })),
    };

    repayments.push(entry);

    if (currentLoanBalance.lte(0)) break;
    currentDate = nextDate;
  }

  return repayments;
}
