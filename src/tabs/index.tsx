import React, { useState, useEffect } from "react";
import { MessageProps } from "./write";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import WriteTab from "./write";
import SeeTab from "./see";
import { GeminiNano } from "../utils/nano";
import { cn } from "../lib/utils";
import { useAtom } from "jotai";
import { activeThreadAtom } from "../lib/atoms";
import { Button } from "../components/ui/button";
import {
  ChevronLeft,
  LucideSeparatorVertical,
  SeparatorVertical,
  SeparatorVerticalIcon,
} from "lucide-react";
import { Separator } from "../components/ui/separator";

const AppTabs = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [nano, setNano] = useState<GeminiNano | null>(null);
  useEffect(() => {
    (async () => {
      const nano = new GeminiNano();
      console.log("reloading nano");
      setNano(nano);
    })();
  }, []);

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [activeTab, setActiveTab] = useState<"write" | "see">("write");
  const [writeTabData, setWriteTabData] = useState<string | null>(null);
  const [seeTabData, setSeeTabData] = useState<string | null>(null);

  const [activeThread, setActiveThread] = useAtom(activeThreadAtom);

  useEffect(() => {
    const listener = async (info: chrome.contextMenus.OnClickData) => {
      try {
        if (info.selectionText) {
          console.log("[App] Context menu: handling text", info.selectionText);
          setWriteTabData(info.selectionText);
          setActiveTab("write");
        } else if (info.srcUrl && info.mediaType === "image") {
          console.log("[App] Context menu: handling image", info.srcUrl);
          setSeeTabData(info.srcUrl);
          setActiveTab("see");
        }
      } catch (error) {
        console.error("Error in context menu handler:", error);
      }
    };

    chrome.contextMenus?.onClicked.addListener(listener);
    return () => chrome.contextMenus?.onClicked.removeListener(listener);
  }, []);

  if (!nano) return <div>Loading session...</div>;

  return (
    <div className={cn(className, "flex flex-col gap-2")}>
      <div className="flex relative items-center justify-center gap-2">
        <Button
          variant="ghost"
          className="absolute left-0"
          onClick={() => setActiveThread(null)}>
          <ChevronLeft /> Go to Menu
        </Button>
        <h1 className="font-bold">PROJECT NAME</h1> &nbsp;/&nbsp;
        {activeThread?.title}
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(value: string) =>
          setActiveTab(value as "write" | "see")
        }
        className="w-full ml-auto">
        <TabsList className="w-full justify-between">
          <TabsTrigger className="w-full" value="write">
            Write
          </TabsTrigger>
          <TabsTrigger className="w-full" value="see">
            See
          </TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="h-[800px]">
          <WriteTab
            nano={nano}
            messages={messages}
            setMessages={setMessages}
            writeTabData={writeTabData}
            setWriteTabData={setWriteTabData}
          />
        </TabsContent>
        <TabsContent value="see" className="h-[800px]">
          <SeeTab
            seeTabData={seeTabData}
            setSeeTabData={setSeeTabData}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppTabs;
