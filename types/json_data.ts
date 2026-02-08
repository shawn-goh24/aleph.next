// ============================================================================
// Core Variable Types
// ============================================================================

/**
 * Type of variable - either a Setpoint (controllable) or Condition (observed)
 */
export type VariableType = "Setpoint" | "Condition";

/**
 * Unit of measurement for temperature and other physical quantities
 */
export type Unit = "K" | "C" | "F" | string;

/**
 * Individual variable within equipment specification
 */
export interface Variable {
  /** Variable name (e.g., "temperature", "cold_fluid_temperature") */
  name: string;
  /** Type of variable */
  type: VariableType;
  /** Numerical value */
  value: number;
  /** Unit of measurement */
  unit: Unit;
}

/**
 * Equipment specification with associated variables
 */
export interface EquipmentSpecification {
  /** Equipment identifier (e.g., "HEX-100", "Fuel", "Air") */
  equipment: string;
  /** Array of variables for this equipment */
  variables: Variable[];
}

// ============================================================================
// Scenario Types
// ============================================================================

/**
 * Individual simulation scenario with inputs and outputs
 */
export interface Scenario {
  /** Scenario identifier (e.g., "Scenario 0", "Scenario 1") */
  scenario: string;
  /** Equipment specifications and their variable settings */
  equipment_specification: EquipmentSpecification[];
  /** KPI name being measured */
  kpi: string;
  /** KPI value (output result) */
  kpi_value: number;
}

/**
 * Collection of all simulated scenarios
 */
export interface SimulatedSummary {
  /** Array of all simulation scenarios */
  simulated_data: Scenario[];
}

// ============================================================================
// Impact Analysis Types
// ============================================================================

/**
 * Impact percentages for each variable
 * Keys are in format: "Equipment.variable_name"
 * Values are impact percentages (0-100)
 */
export interface TopImpact {
  [key: string]: number;
}

/**
 * Top variable that influences KPI
 */
export interface TopVariable {
  /** Equipment name */
  equipment: string;
  /** Variable type */
  type: VariableType;
  /** Variable name */
  name: string;
  /** Optimal value */
  value: number;
  /** Unit of measurement */
  unit: Unit;
}

/**
 * Setpoint impact summary with weightage
 */
export interface SetpointImpact {
  /** Equipment name */
  equipment: string;
  /** Setpoint variable name */
  setpoint: string;
  /** Impact weightage percentage */
  weightage: number;
  /** Unit of measurement */
  unit: Unit;
}

/**
 * Condition impact summary (similar structure to SetpointImpact)
 */
export interface ConditionImpact {
  /** Equipment name */
  equipment: string;
  /** Condition variable name */
  condition: string;
  /** Impact weightage percentage */
  weightage: number;
  /** Unit of measurement */
  unit: Unit;
}

// ============================================================================
// Main Data Structure
// ============================================================================

/**
 * Main simulation data container
 */
export interface SimulationData {
  /** Summary text explaining main findings */
  main_summary_text: string;

  /** Summary text for top performers */
  top_summary_text: string;

  /** Impact distribution across variables */
  top_impact: TopImpact;

  /** Top variables to focus on */
  top_variables: TopVariable[];

  /** Impact analysis summary text */
  impact_summary_text: string;

  /** Setpoint impact analysis */
  setpoint_impact_summary: SetpointImpact[];

  /** Condition impact analysis */
  condition_impact_summary: ConditionImpact[];

  /** All simulation scenarios and results */
  simulated_summary: SimulatedSummary;
}

/**
 * Root response structure
 */
export interface SimulationResponse {
  /** Main data container */
  data: SimulationData;
}
