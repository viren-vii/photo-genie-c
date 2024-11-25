export class NanoPrompt {
  session!: AILanguageModel;

  constructor(basePrompt: string) {
    this.initSession(basePrompt);
  }

  private async initSession(basePrompt: string) {
    this.session = await window.ai.languageModel.create({
      systemPrompt: basePrompt,
    });
  }

  doPrompt = async (prompt: string) => {
    const result = await this.session.prompt(prompt);
    return result;
  };
}

export const CreativeAssistantBasePrompt = `You are an powerful AI assistant to help writers and creative content creators called "Creative Buddy." This tool will assist in overcoming creative blocks, refining drafts, and enhancing their content creation process.`;

type SummarizerInitProps = {
  sharedContext: string;
  type: AISummarizerType;
  length: AISummarizerLength;
};

export class NanoSummarizer {
  session!: AISummarizer;
  constructor({ sharedContext, type, length }: SummarizerInitProps) {
    this.initSession({ sharedContext, type, length });
  }

  private async initSession({
    sharedContext,
    type,
    length,
  }: SummarizerInitProps) {
    this.session = await window.summarizer.create({
      sharedContext: sharedContext,
      type: type,
      length: length,
    });
  }
}

type WriterInitProps = {
  sharedContext: string;
  tone: AIWriterTone;
  length: AIWriterLength;
  format: AIWriterFormat;
};

export class NanoWriter {
  session!: AIWriter;
  constructor({ sharedContext, tone, length, format }: WriterInitProps) {
    this.initSession({ sharedContext, tone, length, format });
  }

  private async initSession({
    sharedContext,
    tone,
    length,
    format,
  }: WriterInitProps) {
    this.session = await window.writer.create({
      sharedContext: sharedContext,
      tone: tone,
      length: length,
      format: format,
    });
  }
}

type RewriterInitProps = {
  sharedContext: string;
  tone: AIRewriterTone;
  format: AIRewriterFormat;
  length: AIRewriterLength;
};

export class NanoRewriter {
  session!: AIRewriter;
  constructor({ sharedContext, tone, format, length }: RewriterInitProps) {
    this.initSession({ sharedContext, tone, format, length });
  }

  private async initSession({
    sharedContext,
    tone,
    format,
    length,
  }: RewriterInitProps) {
    this.session = await window.rewriter.create({
      sharedContext: sharedContext,
      tone: tone,
      format: format,
      length: length,
    });
  }
}
