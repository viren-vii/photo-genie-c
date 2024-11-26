import React, { useState } from "react";
import { useAtom } from "jotai";
import {
  boardIdeasAtom,
  improveTabInputAtom,
  improveTabOutputAtom,
} from "../lib/atoms";
import { Textarea } from "../components/ui/textarea";
import {
  Maximize2,
  Minimize2,
  Smile,
  WandSparkles,
  BriefcaseBusiness,
  FileCode,
  FileText,
  PenLine,
  X,
  Plus,
  Check,
} from "lucide-react";
import { NanoPrompt } from "../utils/nano";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import Loader from "../components/ui/loader";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";

const RewriteOptions = [
  {
    label: "Tone",
    key: "tone",
    options: [
      {
        label: "As It Is",
        value: "as-is",
        icon: <PenLine className="w-4 h-4" />,
      },
      {
        label: "More Formal",
        value: "more-formal",
        icon: <BriefcaseBusiness className="w-4 h-4" />,
      },
      {
        label: "More Casual",
        value: "more-casual",
        icon: <Smile className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Length",
    key: "length",
    options: [
      {
        label: "As It Is",
        value: "as-is",
        icon: <PenLine className="w-4 h-4" />,
      },
      {
        label: "Shorter",
        value: "shorter",
        icon: <Minimize2 className="w-4 h-4" />,
      },
      {
        label: "Longer",
        value: "longer",
        icon: <Maximize2 className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Format",
    key: "format",
    options: [
      {
        label: "Plain Text",
        value: "plain-text",
        icon: <FileText className="w-4 h-4" />,
      },
      {
        label: "Markdown",
        value: "markdown",
        icon: <FileCode className="w-4 h-4" />,
      },
    ],
  },
];

const ImprovementInput = ({
  setImprovedText,
  improvedText,
}: {
  setImprovedText: (text: string[]) => void;
  improvedText: string[];
}) => {
  const [improveTabInput, setImproveTabInput] = useAtom(improveTabInputAtom);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<{
    tone: AIRewriterTone;
    length: AIRewriterLength;
    format: AIRewriterFormat;
  }>({
    tone: "as-is",
    length: "as-is",
    format: "plain-text",
  });

  const rewrite = async () => {
    setIsLoading(true);
    const rewriterNano = new NanoPrompt({
      systemPrompt: `
      You are an expert paraphraser. You are supposed to rewrite the text provided by the user based on following instructions.
      Try not to return the same text as the user provided.
      You cannot change the meaning of the text or introduce any new information.
      Stick to the information provided by the user.
      Follow these rules strictly:
      1. Maintain a ${selectedOptions.tone} tone throughout
      2. Length requirement: ${selectedOptions.length}. It is relative to the input that you will be provided.
      3. You can use ${selectedOptions.format} format.
      4. Be concise and direct.
      5. Do not add any additional text or comments.
      6. You are supposed to give output strictly. Not chat with the user.
      `,
    });

    const result = await rewriterNano.doPrompt(improveTabInput || "");
    setImprovedText([result, ...improvedText]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold">Text to rewrite:</h1>
        <Textarea
          value={improveTabInput || ""}
          onChange={(e) => setImproveTabInput(e.target.value)}
        />
      </div>
      <div className="flex gap-2 items-center justify-center">
        {RewriteOptions.map((option) => (
          <div key={option.label} className="flex flex-col gap-2">
            <span className="text-xs font-medium">{option.label}</span>
            <Select
              value={
                selectedOptions[option.key as keyof typeof selectedOptions] ||
                option.options[0].value
              }
              onValueChange={(value) =>
                setSelectedOptions({
                  ...selectedOptions,
                  [option.key]: value,
                })
              }>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={option.label} />
              </SelectTrigger>
              <SelectContent>
                {option.options.map((o, i) => (
                  <SelectItem key={option.label + o.value + i} value={o.value}>
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {o.icon}
                      </span>
                      <span>{o.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <Button className="w-fit mx-auto" onClick={rewrite} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader />
            <span>Rewriting...</span>
          </>
        ) : (
          <>
            Rewrite Text <WandSparkles />
          </>
        )}
      </Button>
    </div>
  );
};

const ImprovementOutput = ({
  improvedText,
  setImprovedText,
}: {
  improvedText: string[];
  setImprovedText: (text: string[]) => void;
}) => {
  const [boardIdeas, setBoardIdeas] = useAtom(boardIdeasAtom);
  return (
    improvedText.length > 0 && (
      <ScrollArea className="h-full px-4">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold">Improved Text:</h1>
          {improvedText.map((text, i) => {
            const isBoardIdea = boardIdeas.includes(text);
            return (
              <div key={i} className="flex flex-col gap-1">
                <div className="p-4 bg-muted rounded-md relative">
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-[-2px] right-[-2px]"
                    onClick={() =>
                      setImprovedText(improvedText.filter((_, j) => j !== i))
                    }>
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                  {text}
                </div>
                <Button
                  variant="outline"
                  className="w-fit"
                  size="sm"
                  disabled={isBoardIdea}
                  onClick={() => setBoardIdeas([text, ...boardIdeas])}>
                  {isBoardIdea ? <Check className="w-4 h-4" /> : <Plus />}{" "}
                  <span className="text-xs">Add to Board</span>
                </Button>
              </div>
            );
          })}
        </div>
        <ScrollBar />
      </ScrollArea>
    )
  );
};

const Improve = () => {
  const [improveTabOutput, setImproveTabOutput] = useAtom(improveTabOutputAtom);

  return (
    <div className="flex flex-col gap-6 h-full px-4">
      <ImprovementInput
        setImprovedText={setImproveTabOutput}
        improvedText={improveTabOutput}
      />
      <ImprovementOutput
        improvedText={improveTabOutput}
        setImprovedText={setImproveTabOutput}
      />
    </div>
  );
};

export default Improve;
