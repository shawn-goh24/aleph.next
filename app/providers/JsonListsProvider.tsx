"use client";

import { SimulationResponse } from "@/types/json_data";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export const JsonListsContext = createContext<
  Record<string, { name: string; content: SimulationResponse }>
>({});
export const UpdateJsonListsContext = createContext<
  Dispatch<
    SetStateAction<
      Record<string, { name: string; content: SimulationResponse }>
    >
  >
>(() => {});

export default function JsonProvider({ children }: { children: ReactNode }) {
  const [listOfUploadedJson, setListOfUploadedJson] = useState<
    Record<string, { name: string; content: SimulationResponse }>
  >({});

  return (
    <JsonListsContext value={listOfUploadedJson}>
      <UpdateJsonListsContext value={setListOfUploadedJson}>
        {children}
      </UpdateJsonListsContext>
    </JsonListsContext>
  );
}
