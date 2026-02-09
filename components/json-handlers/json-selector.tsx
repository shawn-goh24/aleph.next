import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SimulationResponse } from "@/types/json_data";

interface JsonSelectorProps {
  listOfJsonData: Record<string, { name: string; content: SimulationResponse }>;
  selectedId: string;
  handleSelectionValueChange: (value: string) => void;
  isDisabled: boolean;
}

export function JsonSelector(props: JsonSelectorProps) {
  return (
    <Select
      value={props.selectedId}
      onValueChange={props.handleSelectionValueChange}
      disabled={props.isDisabled}
    >
      <SelectTrigger className=" bg-white cursor-pointer hover:bg-gray-50">
        <SelectValue placeholder="Choose Json" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(props.listOfJsonData).map(([key, value]) => (
            <SelectItem key={key} value={String(key)}>
              {value.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
