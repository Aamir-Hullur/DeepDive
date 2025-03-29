export const MAX_ITERATIONS = 2; // Maximum number of iterations
export const MAX_SEARCH_RESULTS = 1; // Maximum number of search results
export const MAX_CONTENT_CHARS = 20000; // Maximum number of characters in the content
export const MAX_RETRY_ATTEMPTS = 3; // It is the number of times the model will try to call LLMs if it fails
export const RETRY_DELAY_MS = 1000; // It is the delay in milliseconds between retries for the model to call LLMs

// Model names
// export const MODELS = {
//   PLANNING: "google/gemini-2.0-flash-lite-preview-02-05:free",
//   EXTRACTION: "google/gemini-2.0-flash-lite-preview-02-05:free",
//   ANALYSIS: "google/gemini-2.0-flash-lite-preview-02-05:free",
//   REPORT: "google/gemini-2.0-flash-lite-preview-02-05:free"
// }; 

// export const MODELS = {
//     PLANNING: "gemini-2.0-flash-exp",
//     EXTRACTION: "gemini-2.0-flash-exp",
//     ANALYSIS: "gemini-2.0-flash-exp",
//     REPORT: "gemini-2.5-pro-exp-03-25"
//   }; 

// export const MODELS = {
//     PLANNING: "gpt-4o",
//     EXTRACTION: "gpt-4o",
//     ANALYSIS: "gpt-4o",
//     REPORT: "gemini-2.5-pro-exp-03-25"
//   }; 

//   gemini-2.0-flash-thinking-exp-01-21

export const MODELS = {
  PLANNING: {
      gemini: "gemini-2.0-flash-exp",
      openai: "gpt-4o",
      openrouter: "google/gemini-2.0-flash-lite-preview-02-05:free",
  },
  EXTRACT: {
      gemini: "gemini-2.0-flash-exp",
      openai: "gpt-4o",
      openrouter: "google/gemini-2.0-flash-lite-preview-02-05:free",
  },
  ANALYZE: {
      gemini: "gemini-2.0-flash-exp",
      openai: "gpt-4o",
      openrouter: "google/gemini-2.0-flash-lite-preview-02-05:free",
  },
  REPORT: {
      gemini: "gemini-2.5-pro-exp-03-25",
      openai: "gpt-4o",
      openrouter: "google/gemini-2.0-flash-lite-preview-02-05:free",
  },
};
