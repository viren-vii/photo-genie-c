import Layout from "./layout";
import AppTabs from "./tabs";
import Menu, { MenuItem } from "./menu";
import { activeThreadAtom, threadsAtom, ThreadsKey } from "./lib/atoms";
import { useAtomValue, useAtom } from "jotai";
import { useEffect } from "react";
import { getFromStorage, setToStorage } from "./utils/chrome.storage";

function App() {
  const [threads, setThreads] = useAtom(threadsAtom);
  const activeThread = useAtomValue(activeThreadAtom);

  useEffect(() => {
    (async () => {
      const threads = await getFromStorage(ThreadsKey);
      setThreads(threads ? (JSON.parse(threads) as MenuItem[]) : []);
    })();
  }, []);

  useEffect(() => {
    setToStorage(ThreadsKey, threads);
  }, [threads]);

  return (
    <Layout>{!activeThread ? <Menu /> : <AppTabs className="w-full" />}</Layout>
  );
}

export default App;

