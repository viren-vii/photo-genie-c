import { atom } from "jotai";
import { MenuItem } from "../menu";

export const ThreadsKey = "threads";

const activeThreadAtom = atom<MenuItem | null>(null);
const threadsAtom = atom<MenuItem[]>([]);

export { activeThreadAtom, threadsAtom };
