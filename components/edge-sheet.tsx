import { useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Field, FieldLabel, FieldSet } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import type { Edge } from "@/types/edge";
import type { Node } from "@/types/node";
import { randomId } from "@/lib/utils";
import { Controller, useForm } from "react-hook-form";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (node: Edge) => void;
  nodes: Node[];
};

export default function EdgeSheet({
  isOpen,
  setIsOpen,
  onSubmit,
  nodes,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Edge>({
    defaultValues: {
      id: randomId(),
      upstreamNode: undefined,
      downstreamNode: undefined,
    },
  });

  const upstreamNode = watch("upstreamNode");

  useEffect(() => {
    if (isOpen) {
      reset({
        id: randomId(),
        upstreamNode: undefined,
        downstreamNode: undefined,
      });
    }
  }, [isOpen, reset]);

  const onFormSubmit = (data: Edge) => {
    onSubmit({ ...data });

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
          className="flex flex-col justify-between h-full"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <FieldSet className="grid grid-cols-2 gap-6 px-4">
            <Field>
              <FieldLabel>Upstream Node</FieldLabel>
              <Controller
                name="upstreamNode"
                control={control}
                rules={{ required: "Upstream node is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose upstream node" />
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
              {errors.upstreamNode && (
                <p className="text-red-500 text-sm">
                  {errors.upstreamNode.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel>Downstream Node</FieldLabel>
              <Controller
                name="downstreamNode"
                control={control}
                rules={{ required: "Downstream node is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose downstream node" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {nodes
                          .filter((node) => node.id !== upstreamNode) // todo: remove?
                          .map((node) => (
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
              {errors.downstreamNode && (
                <p className="text-red-500 text-sm">
                  {errors.downstreamNode.message}
                </p>
              )}
            </Field>
          </FieldSet>

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
