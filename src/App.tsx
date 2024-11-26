import Layout from "./layout";
import AppTabs from "./tabs";
import Menu, { MenuItem } from "./menu";
import {
  activeThreadAtom,
  threadsAtom,
  ThreadsKey,
  activeThreadDataAtom,
  TActiveThreadData,
  boardIdeasAtom,
  finalThoughtsAtom,
  messagesAtom,
  improveTabOutputAtom,
} from "./lib/atoms";
import { useAtomValue, useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { getFromStorage, setToStorage } from "./utils/chrome.storage";

function App() {
  const [threads, setThreads] = useAtom(threadsAtom);
  const activeThread = useAtomValue(activeThreadAtom);
  const activeThreadData = useAtomValue(activeThreadDataAtom);

  // Board tab
  const setBoardIdeas = useSetAtom(boardIdeasAtom);
  const setFinalThoughts = useSetAtom(finalThoughtsAtom);
  // Write tab
  const setMessages = useSetAtom(messagesAtom);
  // Improve tab
  const setImproveTabOutput = useSetAtom(improveTabOutputAtom);

  // Load threads from local storage
  useEffect(() => {
    (async () => {
      const threads = await getFromStorage(ThreadsKey);
      setThreads(threads ? (JSON.parse(threads) as MenuItem[]) : []);
    })();
  }, []);

  // Save threads to local storage
  useEffect(() => {
    setToStorage(ThreadsKey, threads);
  }, [threads]);

  // Load active thread data from local storage or clear it if it doesn't exist
  useEffect(() => {
    (async () => {
      const localActiveThreadData = await getFromStorage(
        `${activeThread?.threadId}`
      );
      if (localActiveThreadData) {
        const parsedData: TActiveThreadData = JSON.parse(localActiveThreadData);
        setBoardIdeas(parsedData.boardTab.ideas);
        setFinalThoughts(parsedData.boardTab.finalThoughts);
        setMessages(parsedData.writeTab.messages);
        setImproveTabOutput(parsedData.improveTab.output);
      } else {
        setBoardIdeas([]);
        setFinalThoughts("");
        setMessages([]);
        setImproveTabOutput([]);
      }
    })();
  }, [activeThread]);

  // Save active thread data to local storage everytime it updates
  useEffect(() => {
    if (activeThread?.threadId) {
      setToStorage(`${activeThread?.threadId}`, activeThreadData);
    }
  }, [activeThreadData]);

  return (
    <Layout>{!activeThread ? <Menu /> : <AppTabs className="w-full" />}</Layout>
  );
}

export default App;

