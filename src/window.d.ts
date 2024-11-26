interface Window {
  readonly ai: AI;
}

interface WorkerGlobalScope {
  readonly ai: AI;
}

interface AI {
  readonly languageModel: AILanguageModelFactory;
  readonly summarizer: AISummarizerFactory;
  readonly writer: AIWriterFactory;
  readonly rewriter: AIRewriterFactory;
}

interface AICreateMonitor extends EventTarget {
  ondownloadprogress:
    | ((this: AICreateMonitor, ev: ProgressEvent) => unknown)
    | null;
}

type AICreateMonitorCallback = (monitor: AICreateMonitor) => void;

type AICapabilityAvailability = "readily" | "after-download" | "no";

// LanguageModel

interface AILanguageModelFactory {
  create(options?: AILanguageModelCreateOptions): Promise<AILanguageModel>;
  capabilities(): Promise<AILanguageModelCapabilities>;
}

interface AILanguageModel extends EventTarget {
  prompt(
    input: string,
    options?: AILanguageModelPromptOptions
  ): Promise<string>;
  promptStreaming(
    input: string,
    options?: AILanguageModelPromptOptions
  ): ReadableStream;

  countPromptTokens(
    input: string,
    options?: AILanguageModelPromptOptions
  ): Promise<number>;
  readonly maxTokens: number;
  readonly tokensSoFar: number;
  readonly tokensLeft: number;
  readonly topK: number;
  readonly temperature: number;

  clone(): Promise<AILanguageModel>;
  destroy(): void;
}

interface AILanguageModelCapabilities {
  readonly available: AICapabilityAvailability;

  // Always null if available === "no"
  readonly defaultTopK: number | null;
  readonly maxTopK: number | null;
  readonly defaultTemperature: number | null;
}

interface AILanguageModelCreateOptions {
  signal?: AbortSignal;
  monitor?: AICreateMonitorCallback;

  systemPrompt?: string;
  initialPrompts?: AILanguageModelPrompt[];
  topK?: number;
  temperature?: number;
}

interface AILanguageModelPrompt {
  role: AILanguageModelPromptRole;
  content: string;
}

interface AILanguageModelPromptOptions {
  signal?: AbortSignal;
}

type AILanguageModelPromptRole = "system" | "user" | "assistant";

// Summarizer

interface AISummarizerFactory {
  create(options?: AISummarizerCreateOptions): Promise<AISummarizer>;
  capabilities(): Promise<AISummarizerCapabilities>;
}

interface AISummarizer {
  summarize(
    input: string,
    options?: AISummarizerSummarizeOptions
  ): Promise<string>;
  summarizeStreaming(
    input: string,
    options?: AISummarizerSummarizeOptions
  ): ReadableStream;

  readonly sharedContext: string;
  readonly type: AISummarizerType;
  readonly format: AISummarizerFormat;
  readonly length: AISummarizerLength;

  destroy(): void;
}

interface AISummarizerCapabilities {
  readonly available: AICapabilityAvailability;

  createOptionsAvailable(
    options: AISummarizerCreateCoreOptions
  ): AICapabilityAvailability;
  languageAvailable(languageTag: string): AICapabilityAvailability;
}

interface AISummarizerCreateCoreOptions {
  type?: AISummarizerType;
  format?: AISummarizerFormat;
  length?: AISummarizerLength;
}

interface AISummarizerCreateOptions extends AISummarizerCreateCoreOptions {
  signal?: AbortSignal;
  monitor?: AICreateMonitorCallback;
  sharedContext?: string;
}

interface AISummarizerSummarizeOptions {
  signal?: AbortSignal;
  context?: string;
}

type AISummarizerType = "tl;dr" | "key-points" | "teaser" | "headline";
type AISummarizerFormat = "plain-text" | "markdown";
type AISummarizerLength = "short" | "medium" | "long";

// Add Writer interfaces
interface AIWriterFactory {
  create(options?: AIWriterCreateOptions): Promise<AIWriter>;
  capabilities(): Promise<AIWriterCapabilities>;
}

interface AIWriter {
  write(writingTask: string, options?: AIWriterWriteOptions): Promise<string>;
  writeStreaming(
    writingTask: string,
    options?: AIWriterWriteOptions
  ): ReadableStream;

  readonly sharedContext: string;
  readonly tone: AIWriterTone;
  readonly format: AIWriterFormat;
  readonly length: AIWriterLength;

  destroy(): void;
}

interface AIWriterCapabilities {
  readonly available: AICapabilityAvailability;

  createOptionsAvailable(
    options: AIWriterCreateCoreOptions
  ): AICapabilityAvailability;
  languageAvailable(languageTag: string): AICapabilityAvailability;
}

interface AIWriterCreateCoreOptions {
  tone?: AIWriterTone;
  format?: AIWriterFormat;
  length?: AIWriterLength;
}

interface AIWriterCreateOptions extends AIWriterCreateCoreOptions {
  signal?: AbortSignal;
  monitor?: AICreateMonitorCallback;
  sharedContext?: string;
}

interface AIWriterWriteOptions {
  context?: string;
  signal?: AbortSignal;
}

// Add Writer-specific types
type AIWriterTone = "formal" | "neutral" | "casual";
type AIWriterFormat = "plain-text" | "markdown";
type AIWriterLength = "short" | "medium" | "long";

// Add Rewriter interfaces
interface AIRewriterFactory {
  create(options?: AIRewriterCreateOptions): Promise<AIRewriter>;
  capabilities(): Promise<AIRewriterCapabilities>;
}

interface AIRewriter {
  rewrite(input: string, options?: AIRewriterRewriteOptions): Promise<string>;
  rewriteStreaming(
    input: string,
    options?: AIRewriterRewriteOptions
  ): ReadableStream;

  readonly sharedContext: string;
  readonly tone: AIRewriterTone;
  readonly format: AIRewriterFormat;
  readonly length: AIRewriterLength;

  destroy(): void;
}

interface AIRewriterCapabilities {
  readonly available: AICapabilityAvailability;

  createOptionsAvailable(
    options: AIRewriterCreateCoreOptions
  ): AICapabilityAvailability;
  languageAvailable(languageTag: string): AICapabilityAvailability;
}

interface AIRewriterCreateCoreOptions {
  tone?: AIRewriterTone;
  format?: AIRewriterFormat;
  length?: AIRewriterLength;
}

interface AIRewriterCreateOptions extends AIRewriterCreateCoreOptions {
  signal?: AbortSignal;
  monitor?: AICreateMonitorCallback;
  sharedContext?: string;
}

interface AIRewriterRewriteOptions {
  context?: string;
  signal?: AbortSignal;
}

// Add Rewriter-specific types
type AIRewriterTone = "as-is" | "more-formal" | "more-casual";
type AIRewriterFormat = "as-is" | "plain-text" | "markdown";
type AIRewriterLength = "as-is" | "shorter" | "longer";
