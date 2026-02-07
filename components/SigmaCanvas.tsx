import {
  SigmaContainer,
  useLoadGraph,
  useRegisterEvents,
  useSigma,
} from "@react-sigma/core";
import { useEffect, useMemo } from "react";
import "@react-sigma/core/lib/style.css";
import type { Edge } from "@/types/edge";
import { TypeColors, type Node } from "@/types/node";
import { MultiDirectedGraph } from "graphology";
import EdgeCurveProgram, {
  DEFAULT_EDGE_CURVATURE,
  indexParallelEdgesIndex,
} from "@sigma/edge-curve";
import { EdgeArrowProgram } from "sigma/rendering";

const sigmaStyle = { height: "100%", width: "100%", borderRadius: "8px" };

type CanvasProps = {
  width?: number;
  height?: number;
  nodes: Node[];
  edges: Edge[];
};

type CanvasNode = Node & { x: number; y: number };

const GraphEvents: React.FC = () => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();

  useEffect(() => {
    // Register the events
    registerEvents({
      // node events
      enterNode: (event) => {
        const graph = sigma.getGraph();
        const allNodes = graph.nodes();
        const neighbours = graph.neighbors(event.node);
        const notNeighbours = allNodes.filter(
          (node) => !neighbours.includes(node) && node !== event.node,
        );

        graph.forEachEdge((edge) => {
          const [s, t] = graph.extremities(edge); // gets the from and to node id
          // set hidden edge when current hovered node id does not have any attachment to current edge pointer
          graph.setEdgeAttribute(
            edge,
            "hidden",
            s !== event.node && t !== event.node,
          );
        });

        // highlight and focus on neighbouring nodes
        neighbours.forEach((neighbour) => {
          sigma.getGraph().setNodeAttribute(neighbour, "highlighted", true);
        });
        // dehighlight non-neighbouring nodes
        notNeighbours.forEach((neighbour) => {
          sigma
            .getGraph()
            .setNodeAttribute(
              neighbour,
              "prevColor",
              graph.getNodeAttribute(neighbour, "color"),
            );
          graph.setNodeAttribute(neighbour, "color", "#f0f0f0");
        });
      },
      leaveNode: (event) => {
        const graph = sigma.getGraph();
        const allNodes = graph.nodes();
        const neighbours = graph.neighbors(event.node);
        const notNeighbours = allNodes.filter(
          (node) => !neighbours.includes(node) && node !== event.node,
        );

        // unhide previously hidden edges
        graph.forEachEdge((edge) => {
          graph.setEdgeAttribute(edge, "hidden", false);
        });

        // dehighlight previously highlighted nodes
        neighbours.forEach((neighbour) => {
          sigma.getGraph().setNodeAttribute(neighbour, "highlighted", false);
        });
        // recolor, previously dehighlighted nodes
        notNeighbours.forEach((neighbour) => {
          sigma
            .getGraph()
            .setNodeAttribute(
              neighbour,
              "color",
              graph.getNodeAttribute(neighbour, "prevColor"),
            );
        });
      },
    });
  }, [registerEvents, sigma]);

  return null;
};

// Component that load the graph
export const LoadGraph = (props: CanvasProps) => {
  const { nodes, edges } = props;
  const loadGraph = useLoadGraph();

  // todo: make this better???
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
};

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
