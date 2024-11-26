export class NanoPrompt {
  session!: AILanguageModel;
  private initPromise: Promise<void>;

  constructor(options?: AILanguageModelCreateOptions) {
    this.initPromise = this.initSession(options);
  }

  private async initSession(options?: AILanguageModelCreateOptions) {
    this.session = await window.ai.languageModel.create(options);
    console.log("language model created", this.session);
  }

  doPrompt = async (input: string, options?: AILanguageModelPromptOptions) => {
    await this.initPromise; // Wait for initialization to complete
    if (!this.session) {
      throw new Error("Language model session not initialized");
    }
    const result = await this.session.prompt(input, options);
    return result;
  };
}

export class NanoSummarizer {
  session!: AISummarizer;
  private initPromise: Promise<void>;

  constructor(options?: AISummarizerCreateOptions) {
    this.initPromise = this.initSession(options);
  }

  private async initSession(options?: AISummarizerCreateOptions) {
    this.session = await window.ai.summarizer.create(options);
    console.log("summarizer created", this.session);
  }
}

export const basePrompts = {
  creativeAssistant: `You are an powerful AI assistant to help writers and creative content creators called "Creative Buddy." This tool will assist in overcoming creative blocks, refining drafts, and enhancing their content creation process.`,
  creativeRewriter: `You are an powerful AI assistant to help writers and creative content creators called "Creative Buddy." This tool will assist in overcoming creative blocks, refining drafts, and enhancing their content creation process.`,
};
