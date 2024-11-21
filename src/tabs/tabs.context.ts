import { createContext } from "react";

const TabsContext = createContext<{
  activeTab: "write" | "see";
  setActiveTab: (tab: "write" | "see") => void;
  writeTabData: string | null;
  setWriteTabData: (data: string | null) => void;
  seeTabData: string | null;
  setSeeTabData: (data: string | null) => void;
}>({
  activeTab: "write",
  setActiveTab: () => {},
  writeTabData: null,
  setWriteTabData: () => {},
  seeTabData: null,
  setSeeTabData: () => {},
});

export default TabsContext;
