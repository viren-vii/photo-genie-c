import React, { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Markdown from "markdown-to-jsx";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import {
  activeThreadId,
  boardIdeasAtom,
  messagesAtom,
  nanoPromptAtom,
} from "../lib/atoms";
import { useAtom, useAtomValue } from "jotai";
import { CheckIcon, PlusIcon } from "lucide-react";

export type MessageProps = {
  role: "user" | "assistant";
  content: string;
};

const Message = ({ message }: { message: MessageProps }) => {
  const [boardIdeas, setBoardIdeas] = useAtom(boardIdeasAtom);
  const alreadyAdded = boardIdeas.includes(message.content);
  return (
    <div
      className={`flex gap-2 ${
        message.role === "user" ? "flex-row-reverse" : ""
      }`}>
      <div className="w-10 h-10 shrink-0 bg-secondary rounded-full"></div>
      <div className="flex flex-col gap-2">
        <Markdown className="bg-secondary rounded-md p-2 px-4 relative">
          {message.content}
        </Markdown>
        {message.role === "assistant" ? (
          <Button
            size="sm"
            variant="outline"
            className="w-fit"
            disabled={alreadyAdded}
            onClick={() => setBoardIdeas((prev) => [message.content, ...prev])}>
            {alreadyAdded ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <PlusIcon className="w-4 h-4" />
            )}
            {alreadyAdded ? "Added to board" : "Add to board"}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

const PromptSuggestions = ({
  promptSuggestions,
  setPrompt,
}: {
  promptSuggestions: string[];
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex flex-col gap-2 p-2 rounded-md bg-secondary border-[1px]">
      <p className="text-xs font-medium text-muted-foreground">Suggestions</p>
      <ScrollArea className="w-full">
        <div className="flex space-x-2 w-max">
          {promptSuggestions.map((suggestion, index) => (
            <Button
              size="sm"
              variant="outline"
              key={`suggestion-${activeThreadId.toString()}-${index}`}
              onClick={() => setPrompt(suggestion)}>
              {suggestion}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

const WriteTab = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const nano = useAtomValue(nanoPromptAtom);
  const [messages, setMessages] = useAtom(messagesAtom);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const generate = async () => {
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setPrompt("");
    setLoading(true);
    const result = await nano?.doPrompt(prompt);
    setLoading(false);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: result || "" },
    ]);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2 overflow-y-auto py-4 px-2">
        {messages.map((message, index) => (
          <>
            <Message
              key={`message-${activeThreadId.toString()}-${index}`}
              message={message}
            />
            <div style={{ float: "left", clear: "both" }} ref={bottomRef}></div>
          </>
        ))}
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        {/* {promptSuggestions.length > 0 && (
          <PromptSuggestions
            promptSuggestions={promptSuggestions}
            setPrompt={setPrompt}
          />
        )} */}
        <div className="flex gap-2 items-center">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ideate here..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                generate();
              }
            }}
            disabled={loading}
          />
          <Button onClick={generate} disabled={loading || prompt.length === 0}>
            {loading ? "Thinking..." : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WriteTab;
