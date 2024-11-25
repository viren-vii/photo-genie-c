import React from "react";
import { cn } from "./lib/utils";

const Layout = ({
  children,
  className,
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement> ) => {
  return (
    <div
      className={cn("flex justify-center items-center h-screen px-4", className)}
    >
      {children}
    </div>
  );
};

export default Layout;
