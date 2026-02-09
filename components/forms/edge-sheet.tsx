import { useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Edge } from "@/types/edge";
import type { Node } from "@/types/node";
import { randomId } from "@/lib/utils";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Trash } from "lucide-react";

interface EdgeSheetProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (edges: Edge[]) => void;
  nodes: Node[];
}

export function EdgeSheet({
  isOpen,
  setIsOpen,
  onSubmit,
  nodes,
}: EdgeSheetProps) {
  "use no memo";
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Record<string, Edge[]>>({
    defaultValues: {
      edges: [
        { id: randomId(), upstreamNode: undefined, downstreamNode: undefined },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "edges",
    control,
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        edges: [
          {
            id: randomId(),
            upstreamNode: undefined,
            downstreamNode: undefined,
          },
        ],
      });
    }
  }, [isOpen, reset]);

  const onFormSubmit = (data: Record<string, Edge[]>) => {
    onSubmit(data.edges);

    setIsOpen(false);
    reset();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Edge</SheetTitle>
          <SheetDescription>
            Connect two nodes. Click save when done.
          </SheetDescription>
        </SheetHeader>

        <form
          className="flex flex-col justify-between h-full px-4 gap-6"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          {fields.map((field, index, array) => {
            return (
              <FieldSet key={field.id} className="flex flex-row">
                <Field>
                  <FieldLabel>Upstream Node</FieldLabel>
                  <Controller
                    name={`edges.${index}.upstreamNode`}
                    control={control}
                    rules={{ required: "Upstream node is required" }}
                    render={({ field: controllerField }) => (
                      <Select
                        value={controllerField.value?.toString()}
                        onValueChange={(value) =>
                          controllerField.onChange(Number(value))
                        }
                      >
                        <SelectTrigger className="cursor-pointer max-w-[138.33px]">
                          <SelectValue placeholder="Upstream" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {nodes.map((node) => (
                              <SelectItem
                                key={`upstream-${node.id}`}
                                value={String(node.id)}
                              >
                                {node.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.edges?.[index]?.upstreamNode && (
                    <p className="text-red-500 text-sm">
                      {errors.edges?.[index]?.upstreamNode.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Downstream Node</FieldLabel>
                  <Controller
                    name={`edges.${index}.downstreamNode`}
                    control={control}
                    rules={{ required: "Downstream node is required" }}
                    render={({ field: controllerField }) => (
                      <Select
                        value={controllerField.value?.toString()}
                        onValueChange={(value) =>
                          controllerField.onChange(Number(value))
                        }
                      >
                        <SelectTrigger className="cursor-pointer max-w-[138.33px]">
                          <SelectValue placeholder="Downstream" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {nodes.map((node) => (
                              <SelectItem
                                key={`downstream-${node.id}`}
                                value={String(node.id)}
                              >
                                {node.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.edges?.[index]?.downstreamNode && (
                    <p className="text-red-500 text-sm">
                      {errors.edges?.[index]?.downstreamNode.message}
                    </p>
                  )}
                </Field>
                <Button
                  variant={"ghost"}
                  size={"icon-sm"}
                  className="rounded-full mt-[31.25px]"
                  onClick={() => remove(index)}
                  disabled={array.length < 2}
                  type="button"
                >
                  <Trash />
                </Button>
              </FieldSet>
            );
          })}

          <Button
            onClick={() =>
              append([
                {
                  id: randomId(),
                  upstreamNode: undefined,
                  downstreamNode: undefined,
                },
              ])
            }
            type="button"
          >
            Add another node
          </Button>

          <SheetFooter>
            <Button type="submit">Submit</Button>
            <SheetClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
