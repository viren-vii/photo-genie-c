import { useState } from "react";
import TabsContext from "./tabs.context";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
const AppTabs = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState<"write" | "see">("write");
  const [writeTabData, setWriteTabData] = useState<string | null>(null);
  const [seeTabData, setSeeTabData] = useState<string | null>(
    "https://wholefully.com/wp-content/uploads/2017/06/movie-theatre-popcorn-800x1200.jpg"
  );
  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        writeTabData,
        setWriteTabData,
        seeTabData,
        setSeeTabData,
      }}>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "write" | "see")}
        className="w-full ml-auto">
        <TabsList className="w-full justify-between">
          <TabsTrigger className="w-full" value="write">
            Write
          </TabsTrigger>
          <TabsTrigger className="w-full" value="see">
            See
          </TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </TabsContext.Provider>
  );
};

export default AppTabs;
