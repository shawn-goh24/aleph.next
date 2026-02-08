export const mockOpenAiOutputData = {
  metadata: {
    analysisDate: "2023-10-01T00:00:00Z",
    reportTitle: "KPI Impact Analysis Report",
    kpiName: "Heater Outlet Temperature",
    period: "Last 30 Days",
  },
  executiveSummary: {
    kpiPerformance:
      "The Heater Outlet Temperature has shown variability influenced by several temperature setpoints. Notable focus is required on the highest contributing variables to enhance performance.",
    keyFindings: [
      "Air temperature is the most significant contributor, followed closely by Fuel temperature and HEX-100 cold fluid temperature.",
      "The average KPI value has fluctuated significantly over the analyzed period.",
      "Optimizing the setpoints of the identified variables could yield improved KPI results.",
    ],
    topContributors: [
      {
        variable: "Air.temperature",
        impact: 47.9,
        direction: "positive",
      },
      {
        variable: "Fuel.temperature",
        impact: 27.9,
        direction: "positive",
      },
      {
        variable: "HEX-100.cold_fluid_temperature",
        impact: 24.2,
        direction: "positive",
      },
    ],
  },
  kpiOverview: {
    current: 500.895,
    target: 550,
    previousPeriod: 440,
    percentageChange: 13,
    status: "at-risk",
  },
  variableAnalysis: {
    contributionRanking: [
      {
        rank: 1,
        variableName: "Air.temperature",
        contributionScore: 47.9,
        contributionPercentage: 47.9,
        correlationCoefficient: 0.75,
        significance: "high",
        trend: "increasing",
        insight:
          "As the Air temperature increases, the Heater Outlet Temperature tends to rise significantly, pointing to a strong positive relationship.",
      },
      {
        rank: 2,
        variableName: "Fuel.temperature",
        contributionScore: 27.9,
        contributionPercentage: 27.9,
        correlationCoefficient: 0.65,
        significance: "high",
        trend: "stable",
        insight:
          "Fuel temperature has a stable correlation with the KPI, suggesting moderate control can enhance performance.",
      },
      {
        rank: 3,
        variableName: "HEX-100.cold_fluid_temperature",
        contributionScore: 24.2,
        contributionPercentage: 24.2,
        correlationCoefficient: 0.6,
        significance: "medium",
        trend: "decreasing",
        insight:
          "While showing some influence, decreasing values in cold fluid temperature negatively impact overall temperature.",
      },
    ],
    detailedBreakdown: {
      topPositiveDrivers: [
        {
          equipment: "HEX-100",
          setpoint: "cold_fluid_temperature",
          weightage: 24.2,
          unit: "K",
        },
        {
          equipment: "Fuel",
          setpoint: "temperature",
          weightage: 27.9,
          unit: "K",
        },
        {
          equipment: "Air",
          setpoint: "temperature",
          weightage: 47.9,
          unit: "K",
        },
      ],
      topNegativeDrivers: [],
      neutralFactors: [],
    },
  },
  visualizations: [
    {
      id: "variable_contribution_bar_chart",
      type: "bar",
      title: "Variable Contribution to Heater Outlet Temperature",
      description:
        "This bar chart illustrates the contribution percentage of each variable affecting the Heater Outlet Temperature.",
      data: {
        labels: [
          "Air.temperature",
          "Fuel.temperature",
          "HEX-100.cold_fluid_temperature",
        ],
        datasets: [
          {
            label: "Contribution Percentage",
            data: [47.9, 27.9, 24.2],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
          },
        ],
      },
      options: {
        xAxisLabel: "Variables",
        yAxisLabel: "Contribution Percentage",
        showLegend: true,
        customSettings: {},
      },
    },
  ],
  tables: [
    {
      id: "kpi_analysis_table",
      title: "KPI Analysis Table",
      description: "Overview of the KPI against the targeted performance.",
      headers: [
        "KPI Value",
        "Target",
        "Previous Period",
        "Percentage Change",
        "Status",
      ],
      rows: [
        [500.895, 550, 440, 13, "at-risk"],
        [500.895, 550, 440, 13, "at-risk"],
        [500.895, 550, 440, 13, "at-risk"],
      ],
      styling: {
        highlightRows: [],
        columnAlignment: ["center", "center", "center", "center", "center"],
      },
    },
  ],
  insights: [
    {
      category: "trend",
      priority: "high",
      title: "Air Temperature Impact",
      description:
        "The increasing trend of Air temperature significantly boosts the Heater Outlet Temperature, indicating an opportunity to leverage environmental factors for enhanced performance.",
      affectedVariables: ["Air.temperature"],
      recommendation:
        "Closely monitor Air temperature and consider implementing strategies to optimize its control.",
      supportingData: {
        metric: "Average Air Temperature",
        value: 360,
        comparison: "vs Last Month: +5%",
      },
    },
  ],
  recommendations: [
    {
      priority: "high",
      action: "Optimize Air and Fuel temperature settings",
      expectedImpact: "Increase Heater Outlet Temperature to meet targets",
      timeframe: "Within 14 days",
      relatedVariables: ["Air.temperature", "Fuel.temperature"],
    },
  ],
  appendix: {
    methodology:
      "The analysis employed regression and correlation techniques to identify key variables influencing the KPI based on historical data.",
    dataQualityNotes: [
      "Data collected is consistent and within expected parameters.",
      "No missing values were detected.",
    ],
    assumptions: [
      "The relationship between variable changes and KPI is linear.",
      "External factors remain constant throughout the analysis period.",
    ],
  },
};
