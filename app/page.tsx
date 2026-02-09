import Header from "@/components/header";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const lists = [
    {
      title: "Nodes and Edges",
      tasks: "Task 1 and 2",
      url: "/task1and2",
    },
    {
      title: "JSON and Charts",
      tasks: "Task 3 and 4",
      url: "/task3and4",
    },
  ];

  return (
    <>
      <Header />
      <div className="flex justify-around items-center h-full flex-wrap">
        {lists.map((list) => (
          <Link key={list.title} href={list.url}>
            <Card className="aspect-square max-w-124 w-full flex justify-center items-center flex-col p-12 bg-gray-50 shadow-sm hover:shadow-2xl">
              <p className="text-5xl">{list.title}</p>
              <p className="text-3xl">{list.tasks}</p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
