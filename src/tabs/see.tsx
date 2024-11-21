import { Button } from "../components/ui/button";
import TabsContext from "./tabs.context";
import { useContext } from "react";

const SeeTab = () => {
  const { setActiveTab, seeTabData } = useContext(TabsContext);
  if (!seeTabData) return <>No Image Selected</>;
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="w-full relative h-[420px] bg-secondary border-[1px] rounded-md">
        <img
          src={seeTabData}
          alt="Selected Image"
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
      <div className="mt-auto">
        <Button className="w-full" onClick={() => setActiveTab("write")}>
          Ideate
        </Button>
      </div>
    </div>
  );
};

export default SeeTab;
