import ChartCard from "./chart-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
} from "recharts";
import { Config } from "@/lib/chart";

interface ChartVisualisationSectionProps {
  chartData: {
    variableImpactDistribution?: {
      chart: {
        name: string;
        value: number;
        fill: string;
      }[];
      config: Config;
    };
    top3Variable?: {
      chart: Record<string, string | number>[];
      config: Config;
    };
    simulatedSummary?: {
      chart: Record<string, string | number>[];
      config: Config;
    };
  } | null;
}

export default function ChartVisualisationSection({
  chartData,
}: ChartVisualisationSectionProps) {
  if (chartData == null) return <p>Not available</p>;

  return (
    <div className="gap-4 grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-4">
      <div className="h-full lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-3">
        <ChartCard
          title="Variable Impact Distribution"
          description="Shows percentage of each variable"
          legends={Object.values(
            chartData.variableImpactDistribution?.config ?? {},
          )}
        >
          <ChartContainer
            config={chartData.variableImpactDistribution?.config ?? {}}
            className="mx-auto max-h-87.5"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData.variableImpactDistribution?.chart ?? []}
                dataKey="value"
                nameKey="name"
              />
            </PieChart>
          </ChartContainer>
        </ChartCard>
      </div>
      <div className="h-full lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-3">
        <ChartCard
          title="Top 3 scenarios"
          description="Showing the top 3 scenarios across all variables"
          legends={Object.values(chartData.top3Variable?.config ?? {})}
        >
          <ChartContainer
            config={chartData.top3Variable?.config ?? {}}
            className="mx-auto max-h-87.5"
          >
            <RadarChart data={chartData.top3Variable?.chart}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <PolarAngleAxis dataKey="name" />
              <PolarGrid radialLines={false} />
              {Object.values(chartData.top3Variable?.config ?? {}).map(
                (variable) => (
                  <Radar
                    key={variable.label}
                    dataKey={variable.label}
                    fill={`var(--color-${variable.label})`}
                    fillOpacity={0}
                    stroke={`var(--color-${variable.label})`}
                    strokeWidth={2}
                  />
                ),
              )}
            </RadarChart>
          </ChartContainer>
        </ChartCard>
      </div>
      <div className="w-full h-full lg:col-start-1 lg:col-end-5 lg:row-start-3 lg:row-end-5">
        <ChartCard
          title="All scenarios with variables including KPI"
          description="Line chart to compare"
          legends={Object.values(chartData.simulatedSummary?.config ?? {})}
        >
          <ChartContainer
            config={chartData.simulatedSummary?.config ?? {}}
            className="mx-auto max-h-87.5 w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData.simulatedSummary?.chart}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="scenario"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {Object.values(chartData.simulatedSummary?.config ?? {}).map(
                (variable) => (
                  <Line
                    key={variable.label}
                    dataKey={variable.label}
                    type="monotone"
                    stroke={`var(--color-${variable.label})`}
                    strokeWidth={2}
                    dot={false}
                  />
                ),
              )}
            </LineChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  );
}
