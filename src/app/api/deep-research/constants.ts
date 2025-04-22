import { getProviderModelMap, taskModelMap } from "@/config/models";

export const MAX_ITERATIONS = 2; // Maximum number of iterations
export const MAX_SEARCH_RESULTS = 1; // Maximum number of search results
export const MAX_CONTENT_CHARS = 20000; // Maximum number of characters in the content
export const MAX_RETRY_ATTEMPTS = 3; // It is the number of times the model will try to call LLMs if it fails
export const RETRY_DELAY_MS = 1000; // It is the delay in milliseconds between retries for the model to call LLMs

// Re-export the generated provider model map from our centralized config
export const PROVIDER_MODEL_MAP = getProviderModelMap();

// Re-export the task model map from our centralized config
export const MODELS = taskModelMap;
