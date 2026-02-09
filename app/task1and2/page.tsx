"use client";

import { use, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Circle, Merge, Plus } from "lucide-react";
import type { Edge } from "@/types/edge";
import { Types, type Node } from "@/types/node";
import type { CustomCellRendererProps } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  type CellEditingStoppedEvent,
  type ColDef,
  type ColGroupDef,
} from "ag-grid-community";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import { EdgeSheet, NodeSheet } from "@/components/forms";
import {
  DeleteButtonCellRenderer,
  EditCellRenderer,
  Table,
} from "@/components/table";
import {
  EdgeContext,
  NodeContext,
  UpdateEdgeContext,
  UpdateNodeContext,
} from "../providers/NodeEdgeProvider";

ModuleRegistry.registerModules([AllCommunityModule]);

// this is required as sigma canvas is only usable in client components
const SigmaCanvas = dynamic(() => import("@/components/sigma-canvas"), {
  ssr: false,
});

export default function Task1And2() {
  const [isNodeSheetOpen, setIsNodeSheetOpen] = useState(false);
  const [isEdgeSheetOpen, setIsEdgeSheetOpen] = useState(false);

  const nodeRowData = use(NodeContext);
  const setNodeRowData = use(UpdateNodeContext);
  const edgeRowData = use(EdgeContext);
  const setEdgeRowData = use(UpdateEdgeContext);

  // Shared default table options
  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      editable: true,
      cellRenderer: EditCellRenderer,
    }),
    [],
  );

  // Table options for Nodes
  const nodeColDefs = useMemo<(ColDef<Node> | ColGroupDef<Node>)[]>(
    () => [
      { field: "name" },
      {
        field: "type",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: Object.values(Types),
        },
      },
      {
        colId: "customButton",
        headerName: "Action",
        cellRenderer: DeleteButtonCellRenderer,
        cellRendererParams: {
          suppressMouseEventHandling: () => true, // https://www.ag-grid.com/react-data-grid/component-cell-renderer/#reference-EventCellRendererParams-suppressMouseEventHandling
          onClick: (params: CustomCellRendererProps) => {
            setNodeRowData((prev) =>
              prev.filter((row) => params.node.id && row.id != +params.node.id),
            );
          },
        },
      },
    ],
    [setNodeRowData],
  );

  // Table options for Edges
  const edgeColDefs = useMemo<(ColDef<Edge> | ColGroupDef<Edge>)[]>(
    () => [
      { field: "id" },
      {
        field: "upstreamNode",
        valueFormatter: (params) => {
          return (
            nodeRowData.find((data) => data.id === params.value)?.name ?? ""
          );
        },
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: nodeRowData.map((data) => data.id),
        },
      },
      {
        field: "downstreamNode",
        valueFormatter: (params) => {
          return (
            nodeRowData.find((data) => data.id === params.value)?.name ?? ""
          );
        },
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: nodeRowData.map((data) => data.id),
        },
        valueParser: (params) => {
          console.log("valueParser", params);
          return params.newValue;
        },
      },
      {
        colId: "customButton",
        headerName: "Action",
        cellRenderer: DeleteButtonCellRenderer,
        cellRendererParams: {
          suppressMouseEventHandling: () => true,
          onClick: (params: CustomCellRendererProps) => {
            setEdgeRowData((prev) =>
              prev.filter((row) => params.node.id && row.id != +params.node.id),
            );
          },
        },
      },
    ],
    [nodeRowData, setEdgeRowData],
  );

  // Submit function
  const handleRowSubmit = <T extends { id: number }>(
    rowData: T[],
    setRowData: React.Dispatch<React.SetStateAction<T[]>>,
    newRow: T[],
  ) => {
    setRowData([...rowData, ...newRow]);
  };

  // Edit stop function
  const handleRowEditStop = <T extends { id: number }>(
    setRowData: React.Dispatch<React.SetStateAction<T[]>>,
    event: CellEditingStoppedEvent,
  ) => {
    if (event.oldValue === event.newValue) return;

    setRowData((prev) =>
      prev.map((row) =>
        row.id === event.data.id ? { ...row, ...event.data } : row,
      ),
    );
  };

  return (
    <>
      <Header>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="mx-4">
              <Plus /> Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsNodeSheetOpen(true)}>
                <Circle />
                Node
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEdgeSheetOpen(true)}>
                <Merge /> Edge
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>
      <div className="m-4 h-full gap-4 grid grid-cols-1 lg:grid-cols-5 lg:grid-rows-4">
        <div className="h-full lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-3">
          <Table<Node>
            name={"Nodes"}
            rowData={nodeRowData}
            columnDefs={nodeColDefs}
            defaultColDef={defaultColDef}
            suppressClickEdit={true}
            onCellEditingStopped={(event) =>
              handleRowEditStop(setNodeRowData, event)
            }
            invalidEditValueMode={"revert"}
          />
        </div>
        <div className="h-full lg:col-start-1 lg:col-end-3 lg:row-start-3 lg:row-end-5">
          <Table<Edge>
            name={"Edges"}
            rowData={edgeRowData}
            columnDefs={edgeColDefs}
            defaultColDef={defaultColDef}
            onCellEditingStopped={(event) => {
              handleRowEditStop(setEdgeRowData, event);
            }}
            invalidEditValueMode={"revert"}
          />
        </div>
        <div className="border border-gray-300 rounded-lg w-full h-full lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-5">
          {/* To continue if there's time */}
          {/* <Canvas nodes={nodeRowData} edges={edgeRowData} /> */}
          <SigmaCanvas nodes={nodeRowData} edges={edgeRowData} />
        </div>
      </div>
      <NodeSheet
        isOpen={isNodeSheetOpen}
        setIsOpen={setIsNodeSheetOpen}
        onSubmit={(nodes) => {
          handleRowSubmit(nodeRowData, setNodeRowData, nodes);
        }}
      />
      <EdgeSheet
        isOpen={isEdgeSheetOpen}
        setIsOpen={setIsEdgeSheetOpen}
        onSubmit={(edges) =>
          handleRowSubmit(edgeRowData, setEdgeRowData, edges)
        }
        nodes={nodeRowData}
      />
    </>
  );
}
