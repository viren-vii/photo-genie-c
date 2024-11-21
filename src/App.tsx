import { useContext, useEffect, useState } from "react";
import { TabsContent } from "./components/ui/tabs";
import { MessageProps } from "./tabs/write";
import { GeminiNano } from "./utils/nano";
import Layout from "./layout";
import AppTabs from "./tabs";
import TabsContext from "./tabs/tabs.context";
import WriteTab from "./tabs/write";
import SeeTab from "./tabs/see";

function App() {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  const [nano, setNano] = useState<GeminiNano | null>(null);

  const { setActiveTab, setWriteTabData, setSeeTabData } =
    useContext(TabsContext);

  useEffect(() => {
    (async () => {
      const nano = new GeminiNano();
      console.log("reloading nano");
      setNano(nano);
    })();
  }, []);

  useEffect(() => {
    const listener = (info: chrome.contextMenus.OnClickData) => {
      if (info.selectionText) {
        setWriteTabData(info.selectionText);
        setActiveTab("write");
      } else if (info.srcUrl && info.mediaType === "image") {
        setSeeTabData(info.srcUrl);
        setActiveTab("see");
      }
    };
    chrome.contextMenus?.onClicked.addListener(listener);
    return () => {
      chrome.contextMenus?.onClicked.removeListener(listener);
    };
  }, []);

  if (!nano) {
    return <div>Loading session...</div>;
  }

  return (
    <Layout>
      <AppTabs>
        <TabsContent value="write" className="h-[800px]">
          <WriteTab nano={nano} messages={messages} setMessages={setMessages} />
        </TabsContent>
        <TabsContent value="see" className="h-[800px]">
          <SeeTab />
        </TabsContent>
      </AppTabs>
    </Layout>
  );
}

export default App;

