"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { use, useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { OutputStructure } from "@/types/openai";
import ReportDocument from "@/components/report-document";
import { randomId } from "@/lib/utils";
import {
  generateChartForVariableImpactDistribution,
  generateSimulatedSummary,
  generateTop3Variable,
} from "@/lib/chart";
import { SimulationResponse } from "@/types/json_data";
import ChartVisualisationSection from "@/components/chart/chart-visualisation-section";
import { JsonSelector, JsonUploader } from "@/components/json-handlers";
import Header from "@/components/header";
import {
  JsonListsContext,
  UpdateJsonListsContext,
} from "../providers/JsonListsProvider";
import { mockCharData } from "@/data/mocks";

export default function Task3And4() {
  const listOfUploadedJson = use(JsonListsContext);
  const setListOfUploadedJson = use(UpdateJsonListsContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string>(
    Object.keys(listOfUploadedJson)?.[0] ?? "",
  );
  const chartData = useMemo(() => {
    // return mockCharData;
    const jsonData = listOfUploadedJson[selectedFileId];

    if (!jsonData) return null;

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

  console.log(chartData);

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

  return (
    <div className="bg-gray-100 h-full">
      <Header />
      <div className="m-2 h-fit rounded-md p-2 flex gap-4 flex-col">
        {/* Select/Upload JSON and generate pdf */}
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex gap-4 flex-wrap">
            <JsonSelector
              listOfJsonData={listOfUploadedJson}
              selectedId={selectedFileId}
              handleSelectionValueChange={(value) => setSelectedFileId(value)}
              isDisabled={
                listOfUploadedJson == undefined ||
                !Object.values(listOfUploadedJson).length
              }
            />
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
        <ChartVisualisationSection chartData={chartData} />
      </div>
    </div>
  );
}
