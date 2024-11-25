class GeminiNano {
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

const CreativeAssistantBasePrompt = `You are an powerful AI assistant to help writers and creative content creators called "Creative Buddy." This tool will assist in overcoming creative blocks, refining drafts, and enhancing their content creation process.`;

export { GeminiNano, CreativeAssistantBasePrompt };
