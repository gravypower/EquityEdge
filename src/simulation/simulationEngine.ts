// src/simulation/simulationEngine.ts

import { SimulationParams, SimulationResult } from "./financialTypes";
import { generateEvents } from "./generateEvents";
import { processEvents } from "./processEvents";



export function runSimulation(params: SimulationParams): SimulationResult[] {
  const events = generateEvents(params);
  return processEvents(events);
}
