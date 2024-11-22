import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { MessageProps } from "./tabs/write";
import { GeminiNano } from "./utils/nano";
import Layout from "./layout";
import WriteTab from "./tabs/write";
import SeeTab from "./tabs/see";

function App() {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [nano, setNano] = useState<GeminiNano | null>(null);
  const [activeTab, setActiveTab] = useState<"write" | "see">("write");
  const [writeTabData, setWriteTabData] = useState<string | null>(null);
  const [seeTabData, setSeeTabData] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const nano = new GeminiNano();
      console.log("reloading nano");
      setNano(nano);
    })();
  }, []);

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
    <Layout>
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
    </Layout>
  );
}

export default App;

