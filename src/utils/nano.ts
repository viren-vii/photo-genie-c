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
export class NanoWriter {
  session!: AIWriter;
  private initPromise: Promise<void>;

  constructor(options?: AIWriterCreateOptions) {
    this.initPromise = this.initSession(options);
  }

  private async initSession(options?: AIWriterCreateOptions) {
    this.session = await window.ai.writer.create(options);
    console.log("writer created", this.session);
  }
}
export class NanoRewriter {
  private session: AIRewriter | null = null;
  private initPromise: Promise<void>;

  constructor(options?: AIRewriterCreateOptions) {
    this.initPromise = this.initSession(options);
  }

  private async initSession(options?: AIRewriterCreateOptions) {
    this.session = await window.ai.rewriter.create(options);
    console.log("rewriter created", this.session);
  }

  rewrite = async ({
    input,
    options,
  }: {
    input: string;
    options?: AIRewriterRewriteOptions;
  }) => {
    await this.initPromise; // Wait for initialization to complete
    if (!this.session) {
      throw new Error("Rewriter session not initialized");
    }
    const result = await this.session.rewrite(input, options);
    return result;
  };
}

export const basePrompts = {
  creativeAssistant: `You are an powerful AI assistant to help writers and creative content creators called "Creative Buddy." This tool will assist in overcoming creative blocks, refining drafts, and enhancing their content creation process.`,
  creativeRewriter: `You are an powerful AI assistant to help writers and creative content creators called "Creative Buddy." This tool will assist in overcoming creative blocks, refining drafts, and enhancing their content creation process.`,
};
