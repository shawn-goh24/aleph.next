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
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import type { Node } from "@/types/node";
import { randomId } from "@/lib/utils";
import { Controller, useForm } from "react-hook-form";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (node: Node) => void;
};

export default function NodeSheet({ isOpen, setIsOpen, onSubmit }: Props) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Node>({
    defaultValues: { id: randomId(), name: "", type: undefined },
  });

  // Reset form whenever sheet opens/closes
  useEffect(() => {
    if (isOpen) {
      reset({ id: randomId(), name: "", type: undefined });
    }
  }, [isOpen, reset]);

  const onFormSubmit = (data: Node) => {
    onSubmit({ ...data });
    setIsOpen(false);
    reset({ id: randomId(), name: "", type: undefined });
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
          className="flex flex-col justify-between h-full"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <FieldSet className="grid grid-cols-2 gap-6 px-4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <Input {...field} placeholder="Evil Rabbit" />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel>Type</FieldLabel>
              <Controller
                name="type"
                control={control}
                rules={{ required: "Type is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
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
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </Field>
          </FieldSet>

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
