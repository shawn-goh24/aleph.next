import { ChangeEvent, useState } from "react";
import { Input } from "../ui/input";
import { SimulationResponse } from "@/types/json_data";

interface JsonUploaderProps {
  handleUpload: (fileName: string, content: SimulationResponse | null) => void;
}

export function JsonUploader({ handleUpload }: JsonUploaderProps) {
  const [error, setError] = useState("");

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement> | undefined,
  ) => {
    if (!event || !event.target.files) return;

    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      setError("");
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          if (!e.target) return;
          console.log(file);
          // Parse the file content as a JSON object
          const content = JSON.parse(e.target.result as string);
          handleUpload(file.name, content);
        } catch (err) {
          console.error(err);
          setError(
            "Failed to parse JSON file. Please ensure the file is a valid JSON format.",
          );
          handleUpload(file.name, null);
        }
      };

      reader.onerror = () => {
        setError("Error reading file.");
      };

      // Read the file as text
      reader.readAsText(file);
    } else {
      setError("Please select a valid JSON file.");
      handleUpload("", null);
    }
  };

  return (
    <div>
      <Input
        className="cursor-pointer bg-white hover:bg-gray-50"
        type="file"
        accept=".json"
        onChange={handleFileChange}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
