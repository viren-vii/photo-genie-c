import React from "react";
import { useAtom } from "jotai";
import { improveTabDataAtom } from "../lib/atoms";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {
  Maximize2,
  Minimize2,
  Smile,
  WandSparkles,
  BriefcaseBusiness,
} from "lucide-react";

const Improve = () => {
  const [improveTabData, setImproveTabData] = useAtom(improveTabDataAtom);
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold">Text in context:</h1>
      <Textarea
        value={improveTabData || ""}
        onChange={(e) => setImproveTabData(e.target.value)}
      />
      <div className="flex gap-2 items-center justify-center">
        <Button>
          Improve <WandSparkles />
        </Button>
        <Button>
          Make it formal <BriefcaseBusiness />
        </Button>
        <Button>
          Make it casual <Smile />{" "}
        </Button>
        <Button>
          Shorten <Minimize2 />{" "}
        </Button>
        <Button>
          Expand <Maximize2 />{" "}
        </Button>
      </div>
    </div>
  );
};

export default Improve;
