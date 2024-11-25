import React, { useState } from "react";
import { ArrowRight, Trash2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import { activeThreadAtom, threadsAtom } from "../lib/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";

export type MenuItem = {
  title: string;
  thread_id: string;
  dateTime: string;
};

const DeleteThreadDialog = ({
  thread,
  children,
}: {
  thread: MenuItem;
  children: React.ReactNode;
}) => {
  const [threads, setThreads] = useAtom(threadsAtom);
  const [loading, setLoading] = useState(false);
  const deleteThread = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLoading(true);
    setThreads(threads.filter((t) => t.thread_id !== thread.thread_id));
    setLoading(false);
  };

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure about deleting {thread.title}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            ideation existing in this session.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteThread} disabled={loading}>
            {loading ? "Deleting" : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const CreateThreadDialog = ({ children }: { children: React.ReactNode }) => {
  const [threadTitle, setThreadTitle] = useState("");
  const [threads, setThreads] = useAtom(threadsAtom);
  const setActiveThread = useSetAtom(activeThreadAtom);

  const createNewThread = () => {
    const newThread = {
      title: threadTitle,
      thread_id: crypto.randomUUID() + "@" + Date.now().toString(),
      dateTime: new Date().toISOString(),
    };
    setThreads([...threads, newThread]);
    setActiveThread(newThread);
  };

  return (
    <Dialog>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new idea</DialogTitle>
          <DialogDescription>
            Please enter a title for your new idea
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            value={threadTitle}
            onChange={(e) => setThreadTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createNewThread();
              }
            }}
          />
          <Button onClick={createNewThread}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Menu = () => {
  const threads = useAtomValue(threadsAtom);
  const setActiveThread = useSetAtom(activeThreadAtom);

  return (
    <div
      className={cn(
        "flex flex-col gap-2 flex-1 items-center justify-between h-[90%]",
        !threads.length && "justify-center"
      )}>
      {threads.length ? (
        <div className="flex flex-col gap-2 flex-1 items-center justify-center">
          <h1 className="text-2xl font-bold mb-12">Go to your old ideas</h1>
          <ScrollArea>
            <div className="flex flex-col w-[450px] hover:cursor-pointer max-h-[500px]">
              {threads?.map((item) => (
                <div
                  key={item.thread_id}
                  className="flex flex-1 group"
                  onClick={() => setActiveThread(item)}>
                  <div className="flex w-full flex-col gap-1 p-2 border-b-[1px] font-medium shadow-sm border-secondary hover:bg-secondary transition-all duration-500 ease-in-out">
                    <p>
                      {item.title}
                      <ArrowRight className="w-4 h-4 inline-block ml-2" />
                    </p>
                    <p className="text-xs font-extralight text-muted-foreground">
                      {new Date(item.dateTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="max-w-0 bg-red-500 group/delete w-full flex justify-center items-center group-hover:max-w-[10px] transition-all duration-500 ease-in-out hover:!max-w-[50px] overflow-hidden">
                    <DeleteThreadDialog thread={item}>
                      <AlertDialogTrigger
                        className="group-hover/delete:visible invisible"
                        onClick={(e) => e.stopPropagation()}>
                        <Trash2 className="w-4 h-4 text-white" />
                      </AlertDialogTrigger>
                    </DeleteThreadDialog>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>
      ) : null}

      <CreateThreadDialog>
        <DialogTrigger asChild>
          <Button size="lg">Create new idea</Button>
        </DialogTrigger>
      </CreateThreadDialog>
    </div>
  );
};

export default Menu;
