import { useEffect, useState } from "react";
import { analyzeImage, colorPalette, getCaptions } from "../utils/actions";
import { useAtom, useAtomValue } from "jotai";
import { boardIdeasAtom, seeTabDataAtom } from "../lib/atoms";
import { Button } from "../components/ui/button";
import Loader from "../components/ui/loader";
import Markdown from "markdown-to-jsx";
import {
  Sheet,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetHeader,
  SheetContent,
} from "../components/ui/sheet";
import {
  Check,
  Copy,
  Pencil,
  PencilRuler,
  Plus,
  RefreshCcw,
  X,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";

const testImage =
  "https://images.unsplash.com/photo-1732496742791-8e3e7ba5c385?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const ColorPaletteView = ({
  colorPalette,
}: {
  colorPalette: { light: object; dark: object };
}) => {
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(colorPalette).map(([theme, colors]) => (
        <div key={theme} className="flex flex-col gap-1">
          <h3 className="font-semibold capitalize">{theme} Theme</h3>
          <div className="flex flex-col gap-1 p-2 rounded-md border bg-primary-foreground">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className="h-4 w-4 shrink-0 rounded-md border"
                  style={{ backgroundColor: value as string }}
                />
                <span className="capitalize">
                  {key}: {value as string}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const DesignerTools = ({
  imageUrl,
  children,
}: {
  imageUrl: string;
  children: React.ReactNode;
}) => {
  const [colorPaletteOutput, setColorPaletteOutput] = useState<{
    light: object;
    dark: object;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const extractColorPalette = async () => {
    setLoading(true);
    const response = await colorPalette({ imageUrl });
    setColorPaletteOutput(response);
    setIsCopied(false);
    setLoading(false);
  };

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), 3000);
    }
  }, [isCopied]);

  return (
    <Sheet>
      {children}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Designer Tools</SheetTitle>
          <SheetDescription>
            Theme and Color Palette Generator{" "}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 mt-2 p-2 bg-secondary border rounded-md">
          {colorPaletteOutput && (
            <ColorPaletteView colorPalette={colorPaletteOutput} />
          )}
          <div className="flex items-center gap-2">
            {loading ? (
              <Loader />
            ) : (
              <Button
                size={"icon"}
                variant={"outline"}
                onClick={extractColorPalette}
                disabled={loading}>
                <RefreshCcw />
              </Button>
            )}
            {colorPaletteOutput ? "Refresh" : "Generate"}
            <Button
              size={"icon"}
              variant={"outline"}
              disabled={!colorPaletteOutput}
              onClick={() => {
                navigator.clipboard.writeText(
                  JSON.stringify(colorPaletteOutput)
                );
                setIsCopied(true);
              }}>
              <Copy className="w-4 h-4" />
            </Button>
            {isCopied ? "Copied!" : "Copy"}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const SeeTab = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const seeTabData = useAtomValue(seeTabDataAtom);
  const [loading, setLoading] = useState<boolean>(false);

  const [captions, setCaptions] = useState<string[]>([]);
  const [isGeneratingCaptions, setIsGeneratingCaptions] =
    useState<boolean>(false);
  const [boardIdeas, setBoardIdeas] = useAtom(boardIdeasAtom);

  const understandImage = async () => {
    console.log("understanding image");
    setLoading(true);
    const response = await analyzeImage({ imageUrl: testImage });
    setAnalysis(response);
    console.log(response);
    setLoading(false);
  };

  const generateCaptions = async () => {
    setIsGeneratingCaptions(true);
    const response = await getCaptions({ imageUrl: testImage });
    setCaptions([response, ...captions]);
    setIsGeneratingCaptions(false);
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="w-full relative aspect-square bg-secondary border overflow-hidden rounded-md">
        <img
          src={testImage}
          alt="Selected Image"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-2 items-center">
        <DesignerTools imageUrl={testImage}>
          <SheetTrigger asChild>
            <Button size={"sm"}>
              <PencilRuler className="w-4 h-4" /> Designer
            </Button>
          </SheetTrigger>
        </DesignerTools>
        <Button
          size={"sm"}
          onClick={generateCaptions}
          disabled={isGeneratingCaptions}>
          {isGeneratingCaptions ? <Loader /> : <Pencil className="w-4 h-4" />}
          Caption
        </Button>
      </div>
      {captions.length > 0 && (
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2 border rounded-md p-2 bg-secondary">
            {captions.map((caption, index) => {
              const isBoardIdea = boardIdeas.fromImage.includes(caption);
              return (
                <div className="flex flex-col gap-1">
                  <div
                    key={index}
                    className="p-2 border rounded-md bg-primary-foreground relative group">
                    <Markdown>{caption}</Markdown>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      onClick={() => {
                        setCaptions(captions.filter((_, i) => i !== index));
                      }}
                      className=" absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <Button
                    size={"sm"}
                    variant={"outline"}
                    className="w-fit"
                    onClick={() => {
                      setBoardIdeas((prev) => ({
                        ...prev,
                        fromImage: [caption, ...prev.fromImage],
                      }));
                    }}
                    disabled={isBoardIdea}>
                    {isBoardIdea ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {isBoardIdea ? "Added" : "Add to board"}
                  </Button>
                </div>
              );
            })}
          </div>
          <ScrollBar />
        </ScrollArea>
      )}
      <div className="flex flex-col gap-2">
        <Button onClick={understandImage} disabled={loading}>
          {loading && <Loader />}
          {loading ? "Looking at it..." : "Understand"}
        </Button>

        {analysis && <Markdown>{analysis}</Markdown>}
      </div>
    </div>
  );
};

export default SeeTab;
