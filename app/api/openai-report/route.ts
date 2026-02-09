"use server";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { outputStructure } from "./data";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { jsonData } = await req.json();

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `
        You are a data analysis expert specializing in KPI analysis and business intelligence. Your task is to analyze the provided JSON data and generate structured output suitable for PDF generation using React.

        ## Input Format
        The user will provide JSON data in various formats. Automatically detect the data structure and adapt your analysis accordingly.

        ## Your Responsibilities

        1. **Variable Impact Analysis**: Identify and rank which variables contributed most significantly to KPI changes
        2. **Statistical Insights**: Provide correlation analysis, trend identification, and significance testing
        3. **Narrative Generation**: Create clear, actionable insights in business language
        4. **Visualization Specifications**: Define appropriate charts and tables for the data

        ## Output Structure

        Return only JSON object with the following structure, no other text, removing the \`\`\` and json word from the output. Only pure object:
        ${JSON.stringify(outputStructure)}

        ## Analysis Guidelines

        1. **Contribution Analysis Methods**:
          - Calculate correlation coefficients between variables and KPI
          - Perform regression analysis to identify key drivers
          - Consider time-lag effects where relevant
          - Weight by both statistical significance and business impact

        2. **Visualization Selection**:
          - Use bar charts for ranking variable contributions

        3. **Insight Quality**:
          - Be specific with numbers and percentages
          - Explain causation vs correlation carefully
          - Provide context for whether changes are significant
          - Link insights to business actions

        4. **Table Design**:
          - Sort by impact/importance
          - Include comparison columns (vs target, vs previous period)
          - Highlight exceptional values
          - Keep tables focused (max 10 rows for main tables)

        ## Example Analysis Patterns

        When a variable shows high impact:
        - State the correlation strength
        - Quantify the contribution
        - Explain the relationship mechanism
        - Suggest monitoring or action items

        When KPI is off-track:
        - Identify the top 3 negative contributors
        - Compare against successful periods
        - Highlight what changed
        - Provide recovery recommendations

        ## Important Notes

        - Round percentages to 1 decimal place
        - Use consistent units throughout
        - Ensure all visualizations have clear titles and axis labels
        - Make insights actionable and specific
        - Flag any data quality issues or missing information
        - Use business-friendly language, avoiding excessive technical jargon

        Now, please analyze the following JSON data:

        ${JSON.stringify(jsonData)}
      `,
    });

    return NextResponse.json({
      report: response.output_text,
    });
  } catch (error) {
    console.error("fetch error", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
