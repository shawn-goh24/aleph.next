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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Node } from "@/types/node";
import { randomId } from "@/lib/utils";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Trash } from "lucide-react";

interface NodeSheetProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (node: Node[]) => void;
}

export function NodeSheet({ isOpen, setIsOpen, onSubmit }: NodeSheetProps) {
  "use no memo";
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Record<string, Node[]>>({
    defaultValues: {
      nodes: [{ id: randomId(), name: "", type: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "nodes",
    control,
  });

  // Reset form whenever sheet opens/closes
  useEffect(() => {
    if (isOpen) {
      reset({ nodes: [{ id: randomId(), name: "", type: "" }] });
    }
  }, [isOpen, reset]);

  const onFormSubmit = (data: Record<string, Node[]>) => {
    onSubmit(data.nodes);
    setIsOpen(false);
    reset({ nodes: [{ id: randomId(), name: "", type: "" }] });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Nodes</SheetTitle>
          <SheetDescription>
            Add new nodes to the table. Click save when done.
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
                  <FieldLabel>Name</FieldLabel>
                  <Controller
                    name={`nodes.${index}.name`}
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field: controllerField }) => (
                      <Input {...controllerField} placeholder="Evil Rabbit" />
                    )}
                  />
                  {errors.nodes?.[index]?.name && (
                    <p className="text-red-500 text-sm">
                      {errors.nodes?.[index]?.name?.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <Controller
                    name={`nodes.${index}.type`}
                    control={control}
                    rules={{ required: "Type is required" }}
                    render={({ field: controllerField }) => (
                      <Select
                        value={controllerField.value}
                        onValueChange={controllerField.onChange}
                      >
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Choose type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Type 1">Type 1</SelectItem>
                            <SelectItem value="Type 2">Type 2</SelectItem>
                            <SelectItem value="Type 3">Type 3</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.nodes?.[index]?.type && (
                    <p className="text-red-500 text-sm">
                      {errors.nodes?.[index]?.type?.message}
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
            onClick={() => append([{ id: randomId(), name: "", type: "" }])}
            type="button"
          >
            Add another node
          </Button>

          <SheetFooter>
            <Field>
              <Button type="submit">Submit</Button>
              <SheetClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </SheetClose>
            </Field>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
