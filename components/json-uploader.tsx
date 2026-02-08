import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Input } from "./ui/input";

interface JsonUploaderProps {
  setJsonData: Dispatch<SetStateAction<null>>;
}

export default function JsonUploader({ setJsonData }: JsonUploaderProps) {
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
          // Parse the file content as a JSON object
          const content = JSON.parse(e.target.result as string);
          setJsonData(content);
        } catch (err) {
          console.error(err);
          setError(
            "Failed to parse JSON file. Please ensure the file is a valid JSON format.",
          );
          setJsonData(null);
        }
      };

      reader.onerror = () => {
        setError("Error reading file.");
      };

      // Read the file as text
      reader.readAsText(file);
    } else {
      setError("Please select a valid JSON file.");
      setJsonData(null);
    }
  };

  return (
    <div>
      <Input
        className="cursor-pointer"
        type="file"
        accept=".json"
        onChange={handleFileChange}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
