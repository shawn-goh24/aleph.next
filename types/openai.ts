type Status = "on-track" | "at-risk" | "off-track";
type Direction = "positive" | "negative";
type Significance = "high" | "medium" | "low";
type Trend = "increasing" | "decreasing" | "stable";
type ChartType = "bar" | "line" | "pie" | "scatter" | "heatmap" | "waterfall";
type InsightCategory =
  | "trend"
  | "correlation"
  | "anomaly"
  | "opportunity"
  | "risk";
type Priority = "high" | "medium" | "low";
type Alignment = "left" | "center" | "right";

interface Metadata {
  analysisDate: string; // ISO date string
  reportTitle: string;
  kpiName: string;
  period: string;
}

interface TopContributor {
  variable: string;
  impact: number; // percentage or absolute
  direction: Direction;
}

interface ExecutiveSummary {
  kpiPerformance: string; // 2-3 sentences
  keyFindings: string[];
  topContributors: TopContributor[];
}

interface KpiOverview {
  current: number;
  target: number;
  previousPeriod: number;
  percentageChange: number;
  status: Status;
}

interface VariableRanking {
  rank: number;
  variableName: string;
  contributionScore: number;
  contributionPercentage: number;
  correlationCoefficient: number;
  significance: Significance;
  trend: Trend;
  insight: string; // 1-2 sentences explaining the impact
}

interface DetailedBreakdown {
  topPositiveDrivers: VariableRanking[];
  topNegativeDrivers: VariableRanking[];
  neutralFactors: string[];
}

interface VariableAnalysis {
  contributionRanking: VariableRanking[];
  detailedBreakdown: DetailedBreakdown;
}

interface Dataset {
  label: string;
  data: (number | string)[];
  backgroundColor?: string | string[];
  borderColor?: string;
}

interface VisualizationOptions {
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  customSettings?: Record<string, unknown>;
}

interface VisualizationData {
  labels: (string | number)[];
  datasets: Dataset[];
}

interface Visualization {
  id: string;
  type: ChartType;
  title: string;
  description: string;
  data: VisualizationData;
  options: VisualizationOptions;
}

interface TableStyling {
  highlightRows?: number[];
  columnAlignment?: Alignment[];
}

interface Table {
  id: string;
  title: string;
  description: string;
  headers: string[];
  rows: (string | number)[][];
  styling?: TableStyling;
}

interface SupportingData {
  metric: string;
  value: number;
  comparison: string;
}

interface Insight {
  category: InsightCategory;
  priority: Priority;
  title: string;
  description: string; // detailed explanation
  affectedVariables: string[];
  recommendation: string; // actionable suggestion
  supportingData: SupportingData;
}

interface Recommendation {
  priority: Priority;
  action: string;
  expectedImpact: string;
  timeframe: string;
  relatedVariables: string[];
}

interface Appendix {
  methodology: string; // brief explanation of analysis approach
  dataQualityNotes: string[];
  assumptions: string[];
}

interface OutputStructure {
  metadata: Metadata;
  executiveSummary: ExecutiveSummary;
  kpiOverview: KpiOverview;
  variableAnalysis: VariableAnalysis;
  visualizations: Visualization[];
  tables: Table[];
  insights: Insight[];
  recommendations: Recommendation[];
  appendix: Appendix;
}

export type {
  OutputStructure,
  Metadata,
  ExecutiveSummary,
  KpiOverview,
  VariableAnalysis,
  Visualization,
  Table,
  Insight,
  Recommendation,
  Appendix,
  Status,
  Direction,
  Significance,
  Trend,
  ChartType,
  InsightCategory,
  Priority,
};
