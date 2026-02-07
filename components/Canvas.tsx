import type { Edge } from "@/types/edge";
import type { Node } from "@/types/node";
import { useCallback, useEffect, useMemo, useRef } from "react";

type CanvasProps = {
  width?: number;
  height?: number;
  nodes: Node[];
  edges: Edge[];
};

type CanvasNode = Node & { x: number; y: number };

export default function Canvas(props: CanvasProps) {
  const { nodes, edges } = props;

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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function drawNode(ctx: CanvasRenderingContext2D, node: CanvasNode) {
    const radius = 25;

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.stroke();

    ctx.fillStyle = "#000";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.name, node.x, node.y);
  }

  function drawArrow(
    ctx: CanvasRenderingContext2D,
    from: CanvasNode,
    to: CanvasNode,
  ) {
    const headLength = 10;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);

    // line
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    // ctx.lineTo(to.x, to.y);
    ctx.quadraticCurveTo(
      Math.abs(from.x + to.x) / 2,
      // Math.abs(from.y + to.y) / 2,
      40,
      to.x,
      to.y,
    );
    ctx.stroke();

    // arrow head
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headLength * Math.cos(angle - Math.PI / 6),
      to.y - headLength * Math.sin(angle - Math.PI / 6),
    );
    ctx.lineTo(
      to.x - headLength * Math.cos(angle + Math.PI / 6),
      to.y - headLength * Math.sin(angle + Math.PI / 6),
    );
    ctx.closePath();
    // ctx.fill();
  }

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D | null) => {
      if (!ctx) return;
      ctx.reset();

      edges.forEach((edge) => {
        const from = canvasNodes.find((n) => n.id === edge.downstreamNode);
        const to = canvasNodes.find((n) => n.id === edge.upstreamNode);
        if (!from || !to) return;
        drawArrow(ctx, from, to);
      });
      canvasNodes.forEach((node) => drawNode(ctx, node));
    },
    [canvasNodes, edges],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");

    //Our draw come here
    draw(context);
  }, [draw]);

  return (
    <canvas
      className="border border-red-200 rounded-lg"
      width="500"
      height="500"
      ref={canvasRef}
      {...props}
    />
  );
}
