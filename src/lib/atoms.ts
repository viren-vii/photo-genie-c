import { atom } from "jotai";
import { MenuItem } from "../menu";
import { tabs } from "../tabs";
import { NanoPrompt } from "../utils/nano";
import { MessageProps } from "../tabs/write";
export const ThreadsKey = "threads";
export const ThreadDataKey = "threadData";

const activeThreadAtom = atom<MenuItem | null>(null);
const threadsAtom = atom<MenuItem[]>([]);

const boardIdeasAtom = atom<{ fromText: string[]; fromImage: string[] }>({
  fromText: [],
  fromImage: [],
});
const finalThoughtsAtom = atom<string>("");

const seeTabDataAtom = atom<string | null>(null);

const improveTabInputAtom = atom<string | null>(null);
const improveTabOutputAtom = atom<string[]>([]);

const activeTabAtom = atom<(typeof tabs)[number]>("write");

const nanoPromptAtom = atom<NanoPrompt | null>(null);
const messagesAtom = atom<MessageProps[]>([]);

const activeThreadId = atom((get) => {
  const activeThread = get(activeThreadAtom);
  return activeThread?.threadId || "";
});

type TActiveThreadData = ReturnType<typeof activeThreadDataAtom.read>;

const activeThreadDataAtom = atom((get) => {
  const activeThread = get(activeThreadAtom);
  const boardIdeas = get(boardIdeasAtom);
  const finalThoughts = get(finalThoughtsAtom);
  const improveTabOutput = get(improveTabOutputAtom);
  const messages = get(messagesAtom);

  return {
    ...activeThread,
    boardTab: {
      ideas: boardIdeas,
      finalThoughts: finalThoughts,
    },
    improveTab: {
      output: improveTabOutput,
    },
    writeTab: {
      messages: messages,
    },
  };
});

export {
  activeThreadAtom,
  threadsAtom,
  boardIdeasAtom,
  seeTabDataAtom,
  improveTabInputAtom,
  improveTabOutputAtom,
  activeTabAtom,
  nanoPromptAtom,
  messagesAtom,
  activeThreadId,
  activeThreadDataAtom,
  finalThoughtsAtom,
  type TActiveThreadData,
};
