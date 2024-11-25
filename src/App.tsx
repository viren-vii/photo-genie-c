import Layout from "./layout";
import AppTabs from "./tabs";
import Menu, { MenuItem } from "./menu";
import {
  activeThreadAtom,
  boardIdeasAtom,
  seeTabDataAtom,
  messagesAtom,
  threadsAtom,
  ThreadsKey,
  improveTabDataAtom,
} from "./lib/atoms";
import { useAtomValue, useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { getFromStorage, setToStorage } from "./utils/chrome.storage";

function App() {
  const [threads, setThreads] = useAtom(threadsAtom);
  const activeThread = useAtomValue(activeThreadAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setBoardIdeas = useSetAtom(boardIdeasAtom);
  const setSeeTabData = useSetAtom(seeTabDataAtom);
  const setImproveTabData = useSetAtom(improveTabDataAtom);

  useEffect(() => {
    (async () => {
      const threads = await getFromStorage(ThreadsKey);
      setThreads(threads ? (JSON.parse(threads) as MenuItem[]) : []);
    })();
  }, []);

  useEffect(() => {
    setToStorage(ThreadsKey, threads);
  }, [threads]);

  useEffect(() => {
    setMessages([]);
    setBoardIdeas([]);
    setSeeTabData(null);
    setImproveTabData(null);
  }, [activeThread]);

  return (
    <Layout>{!activeThread ? <Menu /> : <AppTabs className="w-full" />}</Layout>
  );
}

export default App;

