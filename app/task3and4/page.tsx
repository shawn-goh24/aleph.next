"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Loader } from "lucide-react";
import { useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import JsonUploader from "@/components/json-uploader";
import { OutputStructure } from "@/types/openai";
import ReportDocument from "@/components/report-document";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { randomId } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import {
  generateChartForVariableImpactDistribution,
  generateSimulatedSummary,
  generateTop3Variable,
} from "@/lib/chart";
import { SimulationResponse } from "@/types/json_data";

export default function Task3And4() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listOfUploadedJson, setListOfUploadedJson] = useState<
    Record<string, { name: string; content: SimulationResponse }>
  >({});
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const chartData = useMemo(() => {
    const jsonData = listOfUploadedJson[selectedFileId];
    if (!jsonData) return {};

    return {
      variableImpactDistribution: generateChartForVariableImpactDistribution(
        jsonData.content,
      ),
      top3Variable: generateTop3Variable(jsonData.content),
      simulatedSummary: generateSimulatedSummary(jsonData.content),
    };
  }, [listOfUploadedJson, selectedFileId]);

  function handleUpload(fileName: string, content: SimulationResponse | null) {
    if (content != null) {
      const id = String(randomId());
      setSelectedFileId(id);
      setListOfUploadedJson((prev) => ({
        ...prev,
        ...{
          [id]: {
            name: fileName,
            content,
          },
        },
      }));
    }
  }

  async function generateReport(data: unknown) {
    // return mockOpenAiOutputData;
    if (!data) return;

    setIsSubmitting(true);
    const res = await fetch("/api/openai-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonData: data,
      }),
    });

    const result = await res.json();
    setIsSubmitting(false);
    return JSON.parse(result.report);
  }

  async function generateAndDownloadPDF(data: OutputStructure) {
    if (!data) return;
    console.log(data);
    const blob = await pdf(<ReportDocument data={data} />).toBlob();

    // auto-download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.metadata.reportTitle}.pdf`;
    a.click();

    // cleanup
    URL.revokeObjectURL(url);
  }

  async function handleGeneratePdf() {
    const result = await generateReport(listOfUploadedJson[selectedFileId]);
    await generateAndDownloadPDF(result);
  }

  console.log(chartData);

  return (
    <div className="bg-gray-100 h-full">
      <header className="border-b flex justify-between items-center bg-white">
        <div className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </div>
      </header>
      <div className="m-2 h-fit rounded-md p-2 flex gap-4 flex-col">
        {/* Select/Upload JSON and generate pdf */}
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex gap-4 flex-wrap">
            <Select
              value={selectedFileId}
              onValueChange={(value) => setSelectedFileId(value)}
              disabled={
                listOfUploadedJson == undefined ||
                !Object.values(listOfUploadedJson).length
              }
            >
              <SelectTrigger className=" bg-white cursor-pointer hover:bg-gray-50">
                <SelectValue placeholder="Choose Json" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(listOfUploadedJson).map(([key, value]) => (
                    <SelectItem key={key} value={String(key)}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <JsonUploader handleUpload={handleUpload} />
          </div>
          <Button disabled={isSubmitting} onClick={handleGeneratePdf}>
            {isSubmitting ? (
              <div className="flex gap-2 items-center">
                <Loader className="animate-spin" />
                <p>Generating PDF...</p>
              </div>
            ) : (
              <span>Generate PDF</span>
            )}
          </Button>
        </div>

        {/* Charts */}
        <div className="gap-4 grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-4">
          <div className="h-full lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-3">
            <Card className="flex flex-col h-full w-full">
              <CardHeader className="items-center pb-0">
                <CardTitle>Variable Impact Distribution</CardTitle>
                <CardDescription>
                  Shows percentage of each variable
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={{}}
                  className="mx-auto aspect-square max-h-87.5"
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
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-4 leading-none font-medium">
                  <p>Legend: </p>
                  {Object.values(
                    chartData.variableImpactDistribution?.config ?? {},
                  ).map((variable) => (
                    <div
                      key={variable.label}
                      className="flex gap-1 items-center"
                    >
                      <div
                        className={"w-4 h-4"}
                        style={{ backgroundColor: variable.color }}
                      />
                      <p>{variable.label}</p>
                    </div>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="h-full lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-3">
            <Card className="h-full w-full">
              <CardHeader className="items-center pb-4">
                <CardTitle>Top 3 scenarios</CardTitle>
                <CardDescription>
                  Showing the top 3 scenarios across all variables
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <ChartContainer
                  config={chartData.top3Variable?.config ?? {}}
                  className="mx-auto aspect-square max-h-87.5"
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
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                  <p>Legend: </p>
                  {Object.values(chartData.top3Variable?.config ?? {}).map(
                    (variable) => (
                      <div
                        key={variable.label}
                        className="flex gap-1 items-center"
                      >
                        <div
                          className={"w-4 h-4"}
                          style={{ backgroundColor: variable.color }}
                        />
                        <p>{variable.label}</p>
                      </div>
                    ),
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="w-full h-full lg:col-start-1 lg:col-end-5 lg:row-start-3 lg:row-end-5">
            <Card className="h-full w-full">
              <CardHeader>
                <CardTitle>
                  All scenarios with variables including KPI
                </CardTitle>
                <CardDescription>Line chart to compare</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartData.simulatedSummary?.config ?? {}}
                  className="mx-auto aspect-square max-h-87.5 w-full"
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
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    {Object.values(
                      chartData.simulatedSummary?.config ?? {},
                    ).map((variable) => (
                      <Line
                        key={variable.label}
                        dataKey={variable.label}
                        type="monotone"
                        stroke={`var(--color-${variable.label})`}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                  <p>Legend: </p>
                  {Object.values(chartData.simulatedSummary?.config ?? {}).map(
                    (variable) => (
                      <div
                        key={variable.label}
                        className="flex gap-1 items-center"
                      >
                        <div
                          className={"w-4 h-4"}
                          style={{ backgroundColor: variable.color }}
                        />
                        <p>{variable.label}</p>
                      </div>
                    ),
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
