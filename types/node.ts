import type { ValueOf } from "./base";

export type Node = {
  id: number;
  name: string;
  type: Type | undefined;
};

export const Types = {
  TYPE_1: "Type 1",
  TYPE_2: "Type 2",
  TYPE_3: "Type 3",
  "": "",
} as const;
export type Type = ValueOf<typeof Types>;

export const TypeColors = {
  [Types.TYPE_1]: "#49c976",
  [Types.TYPE_2]: "#4994c9",
  [Types.TYPE_3]: "#e65757",
};
