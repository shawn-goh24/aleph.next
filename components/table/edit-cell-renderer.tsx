import type { CustomCellRendererProps } from "ag-grid-react";
import { Button } from "@/components/ui/button";

// todo: add docstring
export function EditCellRenderer(props: CustomCellRendererProps) {
  const handleClick = () => {
    props.api.startEditingCell({
      rowIndex: props.node.rowIndex!,
      colKey: props.column!.getId(),
    });
  };

  return (
    <div className="group w-full flex justify-between items-center">
      <span style={{ paddingLeft: "4px" }}>
        {props.valueFormatted ?? props.value}
      </span>
      <Button
        className="h-7.5 opacity-0 group-hover:opacity-100 hover:cursor-pointer"
        onClick={handleClick}
        variant={"ghost"}
        size={"icon-xs"}
      >
        ✎
      </Button>
    </div>
  );
}
