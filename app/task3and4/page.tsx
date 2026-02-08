"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Loader } from "lucide-react";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import JsonUploader from "@/components/json-uploader";
import { OutputStructure } from "@/types/openai";
import { mockOpenAiOutputData } from "@/data/mocks";
import ReportDocument from "@/components/report-document";

export default function Task3And4() {
  const [jsonData, setJsonData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  async function generateReport(data: unknown) {
    return mockOpenAiOutputData;
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
    const result = await generateReport(jsonData);
    await generateAndDownloadPDF(result);
  }

  return (
    <>
      <header className="border-b flex justify-between items-center">
        <div className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </div>
        <Button className="mx-4" onClick={() => setIsUploaderOpen(true)}>
          Upload file
        </Button>
      </header>
      <Dialog
        open={isUploaderOpen}
        onOpenChange={(open) => {
          setIsUploaderOpen(open);
          setJsonData(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload file</DialogTitle>
            <DialogDescription>Upload file</DialogDescription>
            <JsonUploader setJsonData={setJsonData} />
            <Button
              disabled={!jsonData || isSubmitting}
              onClick={handleGeneratePdf}
            >
              {isSubmitting ? (
                <div className="flex gap-2 items-center">
                  <Loader className="animate-spin" />
                  <p>Generating PDF...</p>
                </div>
              ) : (
                <span>Generate PDF</span>
              )}
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
