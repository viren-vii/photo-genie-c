import { useAtom } from "jotai";
import { boardIdeasAtom } from "../lib/atoms";
import { PencilIcon, XIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import Markdown from "markdown-to-jsx";
import { useState } from "react";
import { Textarea } from "../components/ui/textarea";

const Board = () => {
  const [boardIdeas, setBoardIdeas] = useAtom(boardIdeasAtom);

  const [finalThoughts, setFinalThoughts] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold">Storming Board</h1>
      <ScrollArea>
        <div className="flex gap-2">
          {boardIdeas.map((data, index) => (
            <div
              key={`board-content-${index}`}
              className="bg-secondary rounded-md p-2 px-4 border border-border relative w-[550px]">
              <div className="flex flex-col absolute right-[-6px] top-[-6px]">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setFinalThoughts((prev) => prev + "\n" + data)
                  }>
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  color="destructive"
                  onClick={() =>
                    setBoardIdeas((prev) =>
                      prev.filter((idea) => idea !== data)
                    )
                  }>
                  <XIcon className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <Markdown className="w-fit">{data}</Markdown>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <h1 className="text-lg font-semibold">Final Thoughts</h1>
      <Textarea
        value={finalThoughts}
        onChange={(e) => setFinalThoughts(e.target.value)}
      />
    </div>
  );
};

export default Board;
