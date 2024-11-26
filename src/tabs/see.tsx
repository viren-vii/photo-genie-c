import { useState, useEffect } from "react";
import { analyzeImage } from "../utils/actions";
import { useAtomValue } from "jotai";
import { seeTabDataAtom } from "../lib/atoms";

const testImage =
  "https://images.unsplash.com/photo-1732496742791-8e3e7ba5c385?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const SeeTab = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const seeTabData = useAtomValue(seeTabDataAtom);

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
      <div className="w-full relative aspect-square bg-secondary border overflow-hidden rounded-md">
        <img
          src={testImage}
          alt="Selected Image"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {analysis && <div>{JSON.stringify(analysis)}</div>}
    </div>
  );
};

export default SeeTab;
