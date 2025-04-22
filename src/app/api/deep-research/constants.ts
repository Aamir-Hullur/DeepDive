import { ModelProvider } from "@/store/deepResearch";

export const MAX_ITERATIONS = 2; // Maximum number of iterations
export const MAX_SEARCH_RESULTS = 1; // Maximum number of search results
export const MAX_CONTENT_CHARS = 20000; // Maximum number of characters in the content
export const MAX_RETRY_ATTEMPTS = 3; // It is the number of times the model will try to call LLMs if it fails
export const RETRY_DELAY_MS = 1000; // It is the delay in milliseconds between retries for the model to call LLMs

export interface ModelMap {
  [key: string]: string;
}

export interface ProviderModelMap {
  openai: ModelMap;
  gemini: ModelMap;
  // openrouter: ModelMap;
  // deepseek: ModelMap;
  [key: string]: ModelMap;
}

export const PROVIDER_MODEL_MAP: ProviderModelMap = {
  openai: {
    "gpt-4.1": "gpt-4.1",
    "gpt-o4-mini": "o4-mini", 
    "gpt-4o": "gpt-4o",
  },
  gemini: {
    "gemini-2.5-pro": "gemini-2.5-pro-exp-03-25", 
    "gemini-2.5-flash": "gemini-2.5-flash-preview-04-17",
  },
  openrouter: {
    "openrouter-gemini-2.0-pro": "google/gemini-2.5-pro-exp-03-25:free", 
    "qwen": "qwen/qwq-32b:free", 
  },
  deepseek: {
    "deepseek-r1": "deepseek/DeepSeek-R1", 
    "deepseek-v3": "deepseek/DeepSeek-V3-0324",
  },
};

export const MODELS = {
  PLANNING: {
      gemini: "gemini-2.0-flash-exp",
      openai: "gpt-4o",
      // openrouter: "google/gemini-2.0-flash-lite-preview-02-05:free",
      // deepseek: "deepseek/DeepSeek-V3-0324",
  },
  EXTRACT: {
      gemini: "gemini-2.0-flash-exp",
      openai: "gpt-4o",
      // openrouter: "google/gemini-2.0-flash-lite-preview-02-05:free",
      // deepseek: "deepseek/DeepSeek-V3-0324", 
  },
  ANALYZE: {
      gemini: "gemini-2.0-flash-exp",
      openai: "gpt-4o",
      // openrouter: "google/gemini-2.0-flash-lite-preview-02-05:free",
      // deepseek: "deepseek/DeepSeek-V3-0324",
  },
  REPORT: {
      gemini: "gemini-2.5-pro-exp-03-25",
      openai: "gpt-4o",
      // openrouter: "google/gemini-2.0-flash-lite-preview-02-05:free",
      // deepseek: "deepseek/DeepSeek-V3-0324", 
  },
};
