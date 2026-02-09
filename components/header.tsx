import { ReactNode } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";

interface HeaderProps {
  children?: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <header className="border-b flex justify-between items-center bg-white">
      <div className="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </div>
      {children}
    </header>
  );
}
