export const outputStructure = {
  metadata: {
    analysisDate: "ISO date string",
    reportTitle: "string",
    kpiName: "string",
    period: "string",
  },
  executiveSummary: {
    kpiPerformance: "string (2-3 sentences)",
    keyFindings: ["string", "string", "string"],
    topContributors: [
      {
        variable: "string",
        impact: "number (percentage or absolute)",
        direction: "positive | negative",
      },
    ],
  },
  kpiOverview: {
    current: "number",
    target: "number",
    previousPeriod: "number",
    percentageChange: "number",
    status: "on-track | at-risk | off-track",
  },
  variableAnalysis: {
    contributionRanking: [
      {
        rank: "number",
        variableName: "string",
        contributionScore: "number",
        contributionPercentage: "number",
        correlationCoefficient: "number",
        significance: "high | medium | low",
        trend: "increasing | decreasing | stable",
        insight: "string (1-2 sentences explaining the impact)",
      },
    ],
    detailedBreakdown: {
      topPositiveDrivers: ["array of variable objects"],
      topNegativeDrivers: ["array of variable objects"],
      neutralFactors: ["array of variable names"],
    },
  },
  visualizations: [
    {
      id: "string",
      type: "bar | line | pie | scatter | heatmap | waterfall",
      title: "string",
      description: "string",
      data: {
        labels: ["array"],
        datasets: [
          {
            label: "string",
            data: ["array"],
            backgroundColor: "string or array",
            borderColor: "string",
          },
        ],
      },
      options: {
        xAxisLabel: "string",
        yAxisLabel: "string",
        showLegend: "boolean",
        customSettings: {},
      },
    },
  ],
  tables: [
    {
      id: "string",
      title: "string",
      description: "string",
      headers: ["string", "string", "string"],
      rows: [["value", "value", "value"]],
      styling: {
        highlightRows: ["number"],
        columnAlignment: ["left | center | right"],
      },
    },
  ],
  insights: [
    {
      category: "trend | correlation | anomaly | opportunity | risk",
      priority: "high | medium | low",
      title: "string",
      description: "string (detailed explanation)",
      affectedVariables: ["array of variable names"],
      recommendation: "string (actionable suggestion)",
      supportingData: {
        metric: "string",
        value: "number",
        comparison: "string",
      },
    },
  ],
  recommendations: [
    {
      priority: "high | medium | low",
      action: "string",
      expectedImpact: "string",
      timeframe: "string",
      relatedVariables: ["array"],
    },
  ],
  appendix: {
    methodology: "string (brief explanation of analysis approach)",
    dataQualityNotes: ["array of strings"],
    assumptions: ["array of strings"],
  },
};
