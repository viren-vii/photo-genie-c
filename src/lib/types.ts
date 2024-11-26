import { MessageProps } from "../tabs/write";

export type ThreadData = {
  threadId: string;
  title: string;
  dateTime: string;
  writeTab: {
    systemPrompt: string;
    messages: MessageProps[];
  };
  improveTab: {
    output: string[];
  };
  boardTab: {
    ideas: string[];
    finalThoughts: string;
  };
};
