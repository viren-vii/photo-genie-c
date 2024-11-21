import React, { useState, useRef, useEffect, useContext } from "react";
import { GeminiNano } from "../utils/nano";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Markdown from "markdown-to-jsx";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import TabsContext from "./tabs.context";

export type MessageProps = {
  role: "user" | "assistant";
  content: string;
};

const Message = ({ message }: { message: MessageProps }) => {
  return (
    <div
      className={`flex gap-2 ${
        message.role === "user" ? "flex-row-reverse" : ""
      }`}>
      <div className="w-10 h-10 shrink-0 bg-secondary rounded-full"></div>
      <Markdown className="bg-secondary rounded-md p-2 px-4">
        {message.content}
      </Markdown>
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
              key={`suggestion-${index}`}
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

const WriteTab = ({
  nano,
  messages,
  setMessages,
}: {
  nano: GeminiNano;
  messages: MessageProps[];
  setMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>;
}) => {
  const { writeTabData } = useContext(TabsContext);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (writeTabData) {
      console.log("writeTabData", writeTabData);
      setPromptSuggestions((prev) => [writeTabData, ...prev]);
    }
  }, [writeTabData]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const generate = async () => {
    setPromptSuggestions([]);
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setPrompt("");
    setLoading(true);
    const result = await nano.doPrompt(prompt);
    setLoading(false);
    setMessages((prev) => [...prev, { role: "assistant", content: result }]);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2 overflow-y-auto py-4 px-2">
        {messages.map((message, index) => (
          <>
            <Message key={`message-${index}`} message={message} />
            <div style={{ float: "left", clear: "both" }} ref={bottomRef}></div>
          </>
        ))}
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        {promptSuggestions.length > 0 && (
          <PromptSuggestions
            promptSuggestions={promptSuggestions}
            setPrompt={setPrompt}
          />
        )}
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
