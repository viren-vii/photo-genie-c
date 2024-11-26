import { useAtom } from "jotai";
import { boardIdeasAtom, finalThoughtsAtom } from "../lib/atoms";
import { CopyIcon, Hash, PencilIcon, Trash2, XIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import Markdown from "markdown-to-jsx";
import { Textarea } from "../components/ui/textarea";
import { NanoPrompt } from "../utils/nano";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import { useEffect, useState } from "react";
import Loader from "../components/ui/loader";

const TagsDisplayDialog = ({
  tags,
  open,
  onOpenChange,
}: {
  tags: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [tagsArray, setTagsArray] = useState<string[]>([]);

  useEffect(() => {
    setTagsArray(tags.split(" "));
  }, [tags]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generated Hash Tags</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          You can copy and paste these hashtags wherever you desire!
        </DialogDescription>
        <div className="flex flex-wrap gap-2">
          {tagsArray.map((tag, index) => (
            <div
              key={`tag-${index}`}
              className="bg-primary-foreground p-2 text-sm rounded-full border flex items-center gap-2">
              <XIcon
                className="w-4 h-4 text-destructive cursor-pointer"
                onClick={() =>
                  setTagsArray((prev) => prev.filter((t) => t !== tag))
                }
              />
              {tag}
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(tagsArray.join(" "));
              onOpenChange(false);
            }}>
            <CopyIcon className="w-4 h-4" />
            Copy & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Board = () => {
  const [boardIdeas, setBoardIdeas] = useAtom(boardIdeasAtom);
  const [finalThoughts, setFinalThoughts] = useAtom(finalThoughtsAtom);
  const [hashTags, setHashTags] = useState<string>("");
  const [showHashTagsDialog, setShowHashTagsDialog] = useState<boolean>(false);
  const [isGeneratingHashTags, setIsGeneratingHashTags] =
    useState<boolean>(false);

  const generateHashTags = async () => {
    const nanoForHashTags = new NanoPrompt({
      systemPrompt: `You are a social media expert. You are given a text and you need to generate at least 10 hash tags for that text.
          Do not include any other text. Hashtags should be unique and relevant to the text. Hashtags should be in lowercase and separated by spaces.`,
    });
    setIsGeneratingHashTags(true);
    try {
      const result = await nanoForHashTags.doPrompt(finalThoughts);
      setHashTags(result);
      setIsGeneratingHashTags(false);
      setShowHashTagsDialog(true);
    } catch (error) {
      setIsGeneratingHashTags(false);
      console.log(error);
    }
  };

  return (
    <>
      <TagsDisplayDialog
        tags={hashTags}
        open={showHashTagsDialog}
        onOpenChange={setShowHashTagsDialog}
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">Storming Board</h1>
          <ScrollArea className="h-[450px] p-2 border rounded-md bg-muted">
            {boardIdeas.length > 0 ? (
              boardIdeas.map((data, index) => (
                <div
                  key={`board-content-${index}`}
                  className="bg-primary-foreground my-2 group rounded-md p-2 px-4 border border-border relative">
                  <div className="flex absolute right-2 -top-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Nothing added to the board yet
              </p>
            )}
            <ScrollBar />
          </ScrollArea>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">Final Thoughts</h1>
          <Textarea
            value={finalThoughts}
            className="h-[200px]"
            onChange={(e) => setFinalThoughts(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isGeneratingHashTags}
              onClick={generateHashTags}>
              {isGeneratingHashTags ? (
                <Loader />
              ) : (
                <Hash className="w-4 h-4 text-blue-500" />
              )}
              {isGeneratingHashTags ? "Generating" : "Generate"} Hash Tags
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setFinalThoughts("")}>
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
