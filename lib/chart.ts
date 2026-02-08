import { SimulationResponse } from "@/types/json_data";
import { generateRandomHexColor } from "./utils";

export type Config = Record<string, { label: string; color: string }>;

//todo: add docstring to show output
export function generateChartForVariableImpactDistribution(
  jsonData: SimulationResponse,
) {
  const config: Config = {};

  const chart = Object.entries(jsonData.data.top_impact).map(([key, value]) => {
    const color = generateRandomHexColor();

    config[key] = {
      label: key,
      color: color,
    };

    return {
      name: key,
      value,
      fill: color,
    };
  });

  return {
    chart,
    config,
  };
}

//todo: add docstring to show output
export function generateTop3Variable(jsonData: SimulationResponse) {
  const chartMap = new Map<string, Record<string, string | number>>();
  const config: Config = {};

  const sortedTop3 = jsonData.data.simulated_summary.simulated_data.sort(
    (a, b) => b.kpi_value - a.kpi_value,
  );

  for (let i = 0; i < 3; i++) {
    const scenarioData = sortedTop3[i];
    const scenarioKey = `scenario${i}`;

    // config entry
    config[scenarioKey] = {
      label: scenarioKey,
      color: generateRandomHexColor(),
    };

    // equipment variables
    scenarioData.equipment_specification.forEach((spec) => {
      spec.variables.forEach((variable) => {
        if (!chartMap.has(variable.name)) {
          chartMap.set(variable.name, { name: variable.name });
        }

        chartMap.get(variable.name)![scenarioKey] = variable.value;
      });
    });

    // KPI row
    if (!chartMap.has("kpi")) {
      chartMap.set("kpi", { name: "kpi" });
    }

    chartMap.get("kpi")![scenarioKey] = scenarioData.kpi_value;
  }

  return {
    chart: Array.from(chartMap.values()),
    config: config,
  };
}

//todo: add docstring to show output
export function generateSimulatedSummary(jsonData: SimulationResponse) {
  const simulatedData = jsonData.data.simulated_summary.simulated_data;

  // Build chart array
  const chart = simulatedData.map((scenario) => {
    const entry: Record<string, number | string> = {
      scenario: scenario.scenario,
    };

    scenario.equipment_specification.forEach((eq) => {
      eq.variables.forEach((v) => {
        entry[v.name] = v.value;
      });
    });

    entry["kpi"] = scenario.kpi_value;

    return entry;
  });

  // Collect all variable names dynamically
  const variableNames = new Set<string>();
  simulatedData.forEach((scenario) => {
    scenario.equipment_specification.forEach((eq) => {
      eq.variables.forEach((v) => variableNames.add(v.name));
    });
  });

  // Add KPI as well
  variableNames.add("kpi");

  // Build config object
  const config: Config = {};
  Array.from(variableNames).forEach((name) => {
    config[name] = {
      label: name,
      color: generateRandomHexColor(), // assign colors dynamically
    };
  });

  return { chart, config };
}
