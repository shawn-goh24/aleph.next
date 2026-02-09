"use client";

import { Edge } from "@/types/edge";
import { Node } from "@/types/node";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import nodeJsonData from "../../data/nodes.json"; // todo: fix import
import edgeJsonData from "../../data/edges.json"; // todo: fix import

export const NodeContext = createContext<Node[]>([]);
export const UpdateNodeContext = createContext<
  Dispatch<SetStateAction<Node[]>>
>(() => {});
export const EdgeContext = createContext<Edge[]>([]);
export const UpdateEdgeContext = createContext<
  Dispatch<SetStateAction<Edge[]>>
>(() => {});

export default function NodeEdgeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [nodeRowData, setNodeRowData] = useState<Node[]>(
    nodeJsonData.items as Node[],
  );
  const [edgeRowData, setEdgeRowData] = useState<Edge[]>(
    edgeJsonData.items as Edge[],
  );

  return (
    <NodeContext value={nodeRowData}>
      <UpdateNodeContext value={setNodeRowData}>
        <EdgeContext value={edgeRowData}>
          <UpdateEdgeContext value={setEdgeRowData}>
            {children}
          </UpdateEdgeContext>
        </EdgeContext>
      </UpdateNodeContext>
    </NodeContext>
  );
}
