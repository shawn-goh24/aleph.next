import { Edge } from "./edge";
import { Node } from "./node";

export type CanvasProps = {
  width?: number;
  height?: number;
  nodes: Node[];
  edges: Edge[];
};
