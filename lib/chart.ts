import { SimulationResponse } from "@/types/json_data";
import { generateRandomHexColor } from "./utils";

export type Config = Record<string, { label: string; color: string }>;

/**
 * Generates chart data and configuration for visualizing variable impact distribution.
 *
 * Takes JSON data uploaded by user and transforms the top impact variables into a format
 * suitable for chart rendering, with each variable assigned a unique random color.
 *
 * @param jsonData - The simulation response containing impact data
 * @param jsonData.data.top_impact - Object mapping variable names to their impact values
 *
 * @returns An object containing:
 *   - `chart`: Array of chart data points, each with `name`, `value`, and `fill` color
 *   - `config`: Configuration object mapping variable names to their labels and colors
 *
 * @example
 * ```typescript
 * const simulationData = {
 *   data: {
 *     top_impact: {
 *       'temperature': 0.85,
 *       'pressure': 0.62,
 *       'humidity': 0.43
 *     }
 *   }
 * };
 *
 * const { chart, config } = generateChartForVariableImpactDistribution(simulationData);
 * // chart: [
 * //   { name: 'temperature', value: 0.85, fill: '#A3C2F1' },
 * //   { name: 'pressure', value: 0.62, fill: '#F1A3C2' },
 * //   ...
 * // ]
 * // config: {
 * //   'temperature': { label: 'temperature', color: '#A3C2F1' },
 * //   ...
 * // }
 * ```
 */
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

/**
 * Generates chart data for comparing variables across the top 3 performing scenarios.
 *
 * Identifies the three scenarios with the highest KPI values from the simulation data,
 * then extracts and organizes all equipment variables and KPI values for comparison.
 * Each scenario is assigned a unique color for visualization purposes.
 *
 * @param jsonData - The simulation response containing scenario data
 * @param jsonData.data.simulated_summary.simulated_data - Array of simulation scenarios with equipment specs and KPI values
 *
 * @returns An object containing:
 *   - `chart`: Array of data points, one per variable (including KPI), with values from each of the top 3 scenarios
 *   - `config`: Configuration object mapping scenario keys to their labels and colors
 *
 * @example
 * ```typescript
 * const simulationData = {
 *   data: {
 *     simulated_summary: {
 *       simulated_data: [
 *         {
 *           kpi_value: 95.5,
 *           equipment_specification: [{
 *             variables: [
 *               { name: 'temperature', value: 75 },
 *               { name: 'pressure', value: 120 }
 *             ]
 *           }]
 *         },
 *         // ... more scenarios
 *       ]
 *     }
 *   }
 * };
 *
 * const { chart, config } = generateTop3Variable(simulationData);
 * // chart: [
 * //   { name: 'temperature', scenario0: 75, scenario1: 80, scenario2: 70 },
 * //   { name: 'pressure', scenario0: 120, scenario1: 115, scenario2: 125 },
 * //   { name: 'kpi', scenario0: 95.5, scenario1: 92.3, scenario2: 89.1 }
 * // ]
 * // config: {
 * //   scenario0: { label: 'scenario0', color: '#A3C2F1' },
 * //   scenario1: { label: 'scenario1', color: '#F1A3C2' },
 * //   scenario2: { label: 'scenario2', color: '#C2F1A3' }
 * // }
 * ```
 */
export function generateTop3Variable(jsonData: SimulationResponse) {
  const chartMap = new Map<string, Record<string, string | number>>();
  const config: Config = {};

  const sortedTop3 = jsonData.data.simulated_summary.simulated_data.sort(
    (a, b) => b.kpi_value - a.kpi_value,
  );

  // loop 3 to only show top 3 after sorting
  for (let i = 0; i < 3; i++) {
    const scenarioData = sortedTop3[i];
    const scenarioKey = `scenario${i}`;

    // config entry
    config[scenarioKey] = {
      label: scenarioKey,
      color: generateRandomHexColor(),
    };

    scenarioData.equipment_specification.forEach((spec) => {
      spec.variables.forEach((variable) => {
        if (!chartMap.has(variable.name)) {
          chartMap.set(variable.name, { name: variable.name });
        }

        chartMap.get(variable.name)![scenarioKey] = variable.value;
      });
    });

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

/**
 * Generates chart data and configuration for visualizing all simulated scenarios.
 *
 * Transforms simulation data into a flat structure suitable for multi-series charting,
 * where each scenario becomes a data point with all its equipment variables and KPI value.
 * Dynamically discovers all unique variables across scenarios and assigns each a random color.
 *
 * @param jsonData - The simulation response containing all scenario data
 * @param jsonData.data.simulated_summary.simulated_data - Array of simulation scenarios with equipment specifications and KPI values
 *
 * @returns An object containing:
 *   - `chart`: Array of flattened scenario objects, each containing scenario identifier, all variable values, and KPI
 *   - `config`: Configuration object mapping each variable name (including 'kpi') to its label and color
 *
 * @example
 * ```typescript
 * const simulationData = {
 *   data: {
 *     simulated_summary: {
 *       simulated_data: [
 *         {
 *           scenario: 'Scenario A',
 *           kpi_value: 95.5,
 *           equipment_specification: [{
 *             variables: [
 *               { name: 'temperature', value: 75 },
 *               { name: 'pressure', value: 120 }
 *             ]
 *           }]
 *         },
 *         {
 *           scenario: 'Scenario B',
 *           kpi_value: 88.2,
 *           equipment_specification: [{
 *             variables: [
 *               { name: 'temperature', value: 80 },
 *               { name: 'humidity', value: 60 }
 *             ]
 *           }]
 *         }
 *       ]
 *     }
 *   }
 * };
 *
 * const { chart, config } = generateSimulatedSummary(simulationData);
 * // chart: [
 * //   { scenario: 'Scenario A', temperature: 75, pressure: 120, kpi: 95.5 },
 * //   { scenario: 'Scenario B', temperature: 80, humidity: 60, kpi: 88.2 }
 * // ]
 * // config: {
 * //   temperature: { label: 'temperature', color: '#A3C2F1' },
 * //   pressure: { label: 'pressure', color: '#F1A3C2' },
 * //   humidity: { label: 'humidity', color: '#C2F1A3' },
 * //   kpi: { label: 'kpi', color: '#F1C2A3' }
 * // }
 * ```
 */
export function generateSimulatedSummary(jsonData: SimulationResponse) {
  const simulatedData = jsonData.data.simulated_summary.simulated_data;

  // Build chart array
  const chart = simulatedData.map((data) => {
    const entry: Record<string, number | string> = {
      scenario: data.scenario,
    };

    data.equipment_specification.forEach((eq) => {
      eq.variables.forEach((v) => {
        entry[v.name] = v.value;
      });
    });

    entry["kpi"] = data.kpi_value;

    return entry;
  });

  // collect variable names
  const variableNames = new Set<string>();
  simulatedData.forEach((scenario) => {
    scenario.equipment_specification.forEach((eq) => {
      eq.variables.forEach((v) => variableNames.add(v.name));
    });
  });
  variableNames.add("kpi");

  // build config
  const config: Config = {};
  Array.from(variableNames).forEach((name) => {
    config[name] = {
      label: name,
      color: generateRandomHexColor(),
    };
  });

  return { chart, config };
}
