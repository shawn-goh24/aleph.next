"use client";

import { useMemo } from "react";
import "@react-sigma/core/lib/style.css";
import { SigmaContainer } from "@react-sigma/core";
import LoadGraph from "./canvas/Graph";
import GraphEvents from "./canvas/GraphEvents";
import { MultiDirectedGraph } from "graphology";
import EdgeCurveProgram from "@sigma/edge-curve";
import { EdgeArrowProgram } from "sigma/rendering";
import { CanvasProps } from "@/types/canvas";

const sigmaStyle = { height: "100%", width: "100%", borderRadius: "8px" };

export default function SigmaCanvas(props: CanvasProps) {
  const settings = useMemo(
    () => ({
      allowInvalidContainer: true,
      defaultEdgeType: "curve",
      edgeProgramClasses: {
        straight: EdgeArrowProgram,
        curved: EdgeCurveProgram,
      },
    }),
    [],
  );

  return (
    <SigmaContainer
      style={sigmaStyle}
      graph={MultiDirectedGraph}
      settings={settings}
    >
      <LoadGraph {...props} />
      <GraphEvents />
    </SigmaContainer>
  );
}
