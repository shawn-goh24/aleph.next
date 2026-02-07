import type { CustomCellRendererProps } from "ag-grid-react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

interface DeleteButtonCellRendererProps extends CustomCellRendererProps {
  onClick: (params: CustomCellRendererProps) => void;
}

export default function DeleteButtonCellRenderer(
  props: DeleteButtonCellRendererProps,
) {
  const onClick = () => props.onClick(props);

  return (
    <span>
      <Button
        onClick={onClick}
        className="hover:cursor-pointer"
        variant={"secondary"}
        size={"icon-xs"}
      >
        <Trash />
      </Button>
    </span>
  );
}
