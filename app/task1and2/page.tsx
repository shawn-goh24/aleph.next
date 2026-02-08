// todo: make this page serverside
"use client";

import Table from "@/components/table";
import { useMemo, useState } from "react";
import nodeJsonData from "../../data/nodes.json"; // todo: fix import
import edgeJsonData from "../../data/edges.json"; // todo: fix import
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Circle, Merge, Plus } from "lucide-react";
import NodeSheet from "@/components/node-sheet";
import type { Edge } from "@/types/edge";
import EdgeSheet from "@/components/edge-sheet";
import { Types, type Node } from "@/types/node";
import type { CustomCellRendererProps } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  type CellEditingStoppedEvent,
  type ColDef,
  type ColGroupDef,
} from "ag-grid-community";
import EditCellRenderer from "@/components/EditCellRenderer";
import DeleteButtonCellRenderer from "@/components/DeleteButtonCellRenderer";
import dynamic from "next/dynamic";

ModuleRegistry.registerModules([AllCommunityModule]);

// todo: check what is this
const SigmaCanvas = dynamic(() => import("@/components/SigmaCanvas"), {
  ssr: false,
});

export default function Task1And2() {
  const [isNodeSheetOpen, setIsNodeSheetOpen] = useState(false);
  const [isEdgeSheetOpen, setIsEdgeSheetOpen] = useState(false);
  const [nodeRowData, setNodeRowData] = useState<Node[]>(
    nodeJsonData.items as Node[],
  );
  const [edgeRowData, setEdgeRowData] = useState<Edge[]>(
    edgeJsonData.items as Edge[],
  );

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
            console.log("delete", params);
            // todo: this causes re-render, need to think of a way to delete without rendering
            setNodeRowData((prev) =>
              prev.filter((row) => params.node.id && row.id != +params.node.id),
            );
          },
        },
      },
    ],
    [],
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
          // TODO: Validation to not allow selecting same node id
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
          // TODO: Validation to not allow selecting same node id
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
            console.log("delete", params);
            // todo: this causes re-render, need to think of a way to delete without rendering
            setEdgeRowData((prev) =>
              prev.filter((row) => params.node.id && row.id != +params.node.id),
            );
          },
        },
      },
    ],
    [nodeRowData],
  );

  // Submit function
  const handleRowSubmit = <T extends { id: number }>(
    rowData: T[],
    setRowData: React.Dispatch<React.SetStateAction<T[]>>,
    newRow: T,
  ) => {
    setRowData([...rowData, { ...newRow }]);
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

  console.log(nodeRowData);

  return (
    <>
      <header className="border-b flex justify-between items-center">
        <div className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </div>
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
      </header>
      <div className="m-4 h-full gap-4 grid grid-cols-1 lg:grid-cols-5 lg:grid-rows-4">
        <div className="h-full lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-3">
          <Table<Node>
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
          {/* <Canvas nodes={nodeRowData} edges={edgeRowData} /> */}{" "}
          <SigmaCanvas nodes={nodeRowData} edges={edgeRowData} />
        </div>
      </div>
      <NodeSheet
        isOpen={isNodeSheetOpen}
        setIsOpen={setIsNodeSheetOpen}
        onSubmit={(node) => {
          handleRowSubmit(nodeRowData, setNodeRowData, node);
        }}
      />
      <EdgeSheet
        isOpen={isEdgeSheetOpen}
        setIsOpen={setIsEdgeSheetOpen}
        onSubmit={(edge) => handleRowSubmit(edgeRowData, setEdgeRowData, edge)}
        nodes={nodeRowData}
      />
    </>
  );
}
