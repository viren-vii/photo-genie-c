import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center h-screen px-4">
      {children}
    </div>
  );
};

export default Layout;
