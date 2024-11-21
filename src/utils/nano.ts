class GeminiNano {
  session!: AILanguageModel;

  constructor() {
    this.initSession();
  }

  private async initSession() {
    this.session = await window.ai.languageModel.create({
      systemPrompt: "You are a helpful assistant.",
    });
  }

  doPrompt = async (prompt: string) => {
    const result = await this.session.prompt(prompt);
    return result;
  };
}

export { GeminiNano };
