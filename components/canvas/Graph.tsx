import { CanvasProps } from "@/types/canvas";
import { Node, TypeColors } from "@/types/node";
import { useLoadGraph } from "@react-sigma/core";
import {
  indexParallelEdgesIndex,
  DEFAULT_EDGE_CURVATURE,
} from "@sigma/edge-curve";
import { MultiDirectedGraph } from "graphology";
import { useEffect, useMemo } from "react";

type CanvasNode = Node & { x: number; y: number };

export default function LoadGraph(props: CanvasProps) {
  const { nodes, edges } = props;
  const loadGraph = useLoadGraph();

  const canvasNodes = useMemo<CanvasNode[]>(() => {
    let vertical = 0;
    return nodes.map((node, index) => {
      const x = 100 * ((index % 3) + 1);
      if (index % 3 === 0) {
        vertical++;
      }
      const y = 100 * vertical;

      return {
        ...node,
        x,
        y,
      };
    });
  }, [nodes]);

  useEffect(() => {
    const graph = new MultiDirectedGraph();

    if (!canvasNodes.length) return;

    canvasNodes.forEach((canvasNode) => {
      graph.addNode(canvasNode.id, {
        x: canvasNode.x,
        y: canvasNode.y,
        size: 20,
        label: canvasNode.name,
        color: canvasNode.type ? TypeColors[canvasNode.type] : "#FA4F40",
        prevColor: "",
      });
    });

    edges.forEach((edge) => {
      const from = canvasNodes.find((n) => n.id === edge.downstreamNode);
      const to = canvasNodes.find((n) => n.id === edge.upstreamNode);
      if (!from || !to) return;
      graph.addEdgeWithKey(edge.id, from.id, to.id, {
        label: "",
        size: 5,
        from: from.id,
        to: to.id,
      });
    });

    indexParallelEdgesIndex(graph, {
      edgeIndexAttribute: "parallelIndex",
      edgeMaxIndexAttribute: "parallelMaxIndex",
    });

    // Adapt types and curvature of parallel edges for rendering:
    graph.forEachEdge((edge, { parallelIndex, parallelMaxIndex }) => {
      if (typeof parallelIndex === "number") {
        graph.mergeEdgeAttributes(edge, {
          type: "curved",
          curvature:
            DEFAULT_EDGE_CURVATURE +
            (3 * DEFAULT_EDGE_CURVATURE * parallelIndex) /
              (parallelMaxIndex || 1),
        });
      } else {
        graph.setEdgeAttribute(edge, "type", "straight");
      }
    });

    loadGraph(graph);
  }, [canvasNodes, edges, loadGraph]);

  return null;
}
