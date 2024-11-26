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
  X,
  Plus,
  Check,
  Sparkles,
  Text,
  SignalMedium,
  EqualApproximately,
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
import Markdown from "markdown-to-jsx";

const RewriteOptions = [
  {
    label: "Tone",
    key: "tone",
    options: [
      {
        label: "Same",
        value: "as-is",
        icon: <EqualApproximately className="w-4 h-4" />,
      },
      {
        label: "Formal",
        value: "more-formal",
        icon: <BriefcaseBusiness className="w-4 h-4" />,
      },
      {
        label: "Casual",
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
        label: "Similar",
        value: "as-is",
        icon: <SignalMedium className="w-4 h-4" />,
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
        label: "Plain",
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
  const [loading, setLoading] = useState<"rewrite" | "ideate" | "title" | null>(
    null
  );

  const [selectedOptions, setSelectedOptions] = useState<{
    tone: AIRewriterTone;
    length: AIRewriterLength;
    format: AIRewriterFormat;
  }>({
    tone: "as-is",
    length: "as-is",
    format: "plain-text",
  });

  const processText = async (type: "rewrite" | "ideate" | "title") => {
    setLoading(type);
    const systemPrompt =
      type === "rewrite"
        ? `You are an expert paraphraser. You are supposed to rewrite the text provided by the user based on following instructions.
      Try not to return the same text as the user provided.
      You cannot change the meaning of the text or introduce any new information.
      Follow these rules strictly:
      1. Maintain a ${selectedOptions.tone} tone throughout
      2. Length requirement: ${selectedOptions.length}. It is relative to the input that you will be provided.
      3. You can use ${selectedOptions.format} format.
      4. Be concise and direct.
      5. Do not add any additional text or comments.`
        : type === "ideate"
        ? `You are an expert ideator. You are supposed to ideate the text provided by the user based on following instructions.
      You are supposed to give 5 ideas to the user based on the text provided.
      Do not deviate from the information in the text provided. Ideas should be logical and make sense in reference to the text provided.
      Follow these rules strictly:
      1. Ideas should be more ${selectedOptions.tone} in tone and style.
      2. Length requirement: ${selectedOptions.length}. Give only headlines if length is shorter, else you can give more details.
      3. You must return the response in ${selectedOptions.format} format.
      4. Be concise and direct.
      5. Do not add any additional text or comments.`
        : `You are an expert title generator. Imagine that you are going to write a blog post or article based on the text provided.
      You are supposed to generate a title for the text provided by the user based on following instructions.
      Title should be ${selectedOptions.tone} in tone and style. Try to be creative and unique.
      Follow these rules strictly:
      1. Title should be ${selectedOptions.length} in length.
      2. You must return the response in ${selectedOptions.format} format.
      3. Title should be concise and direct.
      4. Do not add any additional text or comments.`;
    const rewriterNano = new NanoPrompt({ systemPrompt });

    const result = await rewriterNano.doPrompt(improveTabInput || "");
    setImprovedText([result, ...improvedText]);
    setLoading(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold">Your raw text:</h1>
        <Textarea
          value={improveTabInput || ""}
          onChange={(e) => setImproveTabInput(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2 items-center justify-center">
        {RewriteOptions.map((option) => (
          <div key={option.label} className="flex flex-col gap-1">
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
              <SelectTrigger>
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
      <div className="flex gap-2 justify-center flex-wrap">
        <Button
          onClick={() => processText("rewrite")}
          disabled={!!loading}
          size="sm">
          {loading === "rewrite" ? (
            <>
              <Loader />
              <span>Rewriting...</span>
            </>
          ) : (
            <>
              Rewrite <WandSparkles />
            </>
          )}
        </Button>
        <Button
          onClick={() => processText("ideate")}
          disabled={!!loading}
          size="sm">
          {loading === "ideate" ? (
            <>
              <Loader />
              <span>Ideating...</span>
            </>
          ) : (
            <>
              Ideate <Sparkles />
            </>
          )}
        </Button>
        <Button
          onClick={() => processText("title")}
          disabled={!!loading}
          size="sm">
          {loading === "title" ? (
            <>
              <Loader />
              <span>Title</span>
            </>
          ) : (
            <>
              Title <Text />
            </>
          )}
        </Button>
      </div>
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
      <ScrollArea className="h-full p-4 bg-muted rounded-md border">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold">The output:</h1>
          {improvedText.map((text, i) => {
            const isBoardIdea = boardIdeas.includes(text);
            return (
              <div key={i} className="flex flex-col gap-1">
                <div className="p-4 bg-primary-foreground border rounded-md relative group">
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() =>
                      setImprovedText(improvedText.filter((_, j) => j !== i))
                    }>
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                  <Markdown>{text}</Markdown>
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
    <div className="flex flex-col gap-4 h-full px-4">
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
