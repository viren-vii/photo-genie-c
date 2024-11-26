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
import { CheckIcon, PlusIcon, User, Bot } from "lucide-react";
import Loader from "../components/ui/loader";

export type MessageProps = {
  role: "user" | "assistant";
  content: string;
};

const Message = ({ message }: { message: MessageProps }) => {
  const [boardIdeas, setBoardIdeas] = useAtom(boardIdeasAtom);
  const alreadyAdded = boardIdeas.fromText.includes(message.content);

  return (
    <div className={`flex flex-col gap-2 my-2 `}>
      <div
        className={`flex flex-col gap-2 ${
          message.role === "user" ? "items-end" : "items-start"
        }`}>
        <div className="flex items-center gap-2 text-[0.75rem] font-medium">
          {message.role === "user" && "User"}
          <div
            className={`w-7 h-7 shrink-0 ${
              message.role === "assistant"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            } rounded-full flex items-center justify-center border`}>
            {message.role === "assistant" && <Bot className="w-4 h-4" />}
            {message.role === "user" && <User className="w-4 h-4" />}
          </div>
          {message.role === "assistant" && "Assistant"}
        </div>
        <Markdown
          className={`${
            message.role === "assistant"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          } rounded-md p-2 px-4 relative`}>
          {message.content}
        </Markdown>
      </div>
      {message.role === "assistant" ? (
        <Button
          size="sm"
          variant="outline"
          className="w-fit"
          disabled={alreadyAdded}
          onClick={() =>
            setBoardIdeas((prev) => ({
              ...prev,
              fromText: [message.content, ...prev.fromText],
            }))
          }>
          {alreadyAdded ? (
            <CheckIcon className="w-4 h-4" />
          ) : (
            <PlusIcon className="w-4 h-4" />
          )}
          {alreadyAdded ? "Added to board" : "Add to board"}
        </Button>
      ) : null}
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
      <ScrollArea className="py-4 px-2">
        {messages.map((message, index) => (
          <Message
            key={`message-${activeThreadId.toString()}-${index}`}
            message={message}
          />
        ))}
        <div style={{ float: "left", clear: "both" }} ref={bottomRef}></div>
        <ScrollBar />
      </ScrollArea>
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
            {loading && <Loader />}
            {loading ? "Thinking..." : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WriteTab;
