import React from "react";
import { cn } from "./lib/utils";

const Layout = ({
  children,
  className,
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex justify-center items-center h-screen px-4 max-w-[360px] mx-auto",
        className
      )}>
      {children}
    </div>
  );
};

export default Layout;
