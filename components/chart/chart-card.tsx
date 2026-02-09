import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Config } from "@/lib/chart";
import { ValueOf } from "@/types/base";

interface ChartCardProps {
  title: string;
  description: string;
  legends: ValueOf<Config>[];
  children: ReactNode;
}

export default function ChartCard({ children, ...props }: ChartCardProps) {
  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">{children}</CardContent>
      <CardFooter className="flex items-center gap-4 leading-none font-medium flex-wrap justify-center">
        <p>Legend: </p>
        {props.legends.map((legend) => (
          <div key={legend.label} className="flex gap-1 items-center">
            <div
              className={"w-4 h-4 rounded-2xl"}
              style={{ backgroundColor: legend.color }}
            />
            <p>{legend.label}</p>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
