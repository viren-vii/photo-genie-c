import { atom } from "jotai";
import { MenuItem } from "../menu";
import { tabs } from "../tabs";
import { NanoPrompt } from "../utils/nano";
import { MessageProps } from "../tabs/write";
export const ThreadsKey = "threads";
export const ThreadDataKey = "threadData";

const activeThreadAtom = atom<MenuItem | null>(null);
const threadsAtom = atom<MenuItem[]>([]);

const boardIdeasAtom = atom<string[]>([]);

const seeTabDataAtom = atom<string | null>(null);
const improveTabDataAtom = atom<string | null>(null);

const activeTabAtom = atom<(typeof tabs)[number]>("write");

const nanoPromptAtom = atom<NanoPrompt | null>(null);
const messagesAtom = atom<MessageProps[]>([]);

const activeThreadId = atom((get) => {
  const activeThread = get(activeThreadAtom);
  return activeThread?.threadId || "";
});

export {
  activeThreadAtom,
  threadsAtom,
  boardIdeasAtom,
  seeTabDataAtom,
  improveTabDataAtom,
  activeTabAtom,
  nanoPromptAtom,
  messagesAtom,
  activeThreadId,
};
