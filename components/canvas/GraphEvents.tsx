import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { useEffect } from "react";

export default function GraphEvents() {
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
}
