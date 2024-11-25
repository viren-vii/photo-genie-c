import React, { useEffect } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import WriteTab from "./write";
import SeeTab from "./see";
import { CreativeAssistantBasePrompt, NanoPrompt } from "../utils/nano";
import { cn } from "../lib/utils";
import { useAtom, useSetAtom } from "jotai";
import {
  activeThreadAtom,
  seeTabDataAtom,
  improveTabDataAtom,
  ThreadDataKey,
  activeTabAtom,
  nanoPromptAtom,
  messagesAtom,
} from "../lib/atoms";
import { Button } from "../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { getFromStorage, setToStorage } from "../utils/chrome.storage";
import Board from "./board";
import Improve from "./improve";

export const tabs = ["board", "write", "improve", "see"] as const;

const AppTabs = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [nano, setNano] = useAtom(nanoPromptAtom);
  useEffect(() => {
    (async () => {
      const nano = new NanoPrompt(CreativeAssistantBasePrompt);
      console.log("reloading nano");
      setNano(nano);
    })();
  }, []);

  const [messages, setMessages] = useAtom(messagesAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  const [activeThread, setActiveThread] = useAtom(activeThreadAtom);
  const storageKey = `${ThreadDataKey}-${activeThread?.threadId}`;
  const setImproveTabData = useSetAtom(improveTabDataAtom);
  const setSeeTabData = useSetAtom(seeTabDataAtom);

  useEffect(() => {
    const listener = async (info: chrome.contextMenus.OnClickData) => {
      try {
        if (info.selectionText) {
          console.log("[App] Context menu: handling text", info.selectionText);
          setImproveTabData(info.selectionText);
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

  useEffect(() => {
    if (messages.length > 0) {
      (async () => {
        setToStorage(storageKey, {
          threadId: activeThread?.threadId,
          systemPrompt: CreativeAssistantBasePrompt,
          messages,
        });
      })();
    }
  }, [messages, activeThread, storageKey]);

  useEffect(() => {
    (async () => {
      const oldThreadData = await getFromStorage(storageKey);
      setMessages(oldThreadData ? JSON.parse(oldThreadData)?.messages : []);
    })();
  }, [activeThread, storageKey]);

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
          {tabs.map((tab) => (
            <TabsTrigger className="w-full" value={tab}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="board" className="h-[800px]">
          <Board />
        </TabsContent>
        <TabsContent value="write" className="h-[800px]">
          <WriteTab />
        </TabsContent>
        <TabsContent value="improve" className="h-[800px]">
          <Improve />
        </TabsContent>
        <TabsContent value="see" className="h-[800px]">
          <SeeTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppTabs;
