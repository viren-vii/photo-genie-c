import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { analyzeImage } from "../utils/actions";
import { useAtomValue, useSetAtom } from "jotai";
import { seeTabDataAtom, activeTabAtom } from "../lib/atoms";

const SeeTab = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const seeTabData = useAtomValue(seeTabDataAtom);
  const setActiveTab = useSetAtom(activeTabAtom);

  useEffect(() => {
    (async () => {
      if (seeTabData) {
        const response = await analyzeImage({ imageUrl: seeTabData });
        setAnalysis(response);
        console.log(response);
      }
    })();
  }, [seeTabData]);

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="w-full relative h-[420px] bg-secondary border-[1px] rounded-md">
        <img
          src={seeTabData || ""}
          alt="Selected Image"
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
      {analysis && <div>{JSON.stringify(analysis)}</div>}
      <div className="mt-auto">
        <Button className="w-full" onClick={() => setActiveTab("write")}>
          Ideate
        </Button>
      </div>
    </div>
  );
};

export default SeeTab;
