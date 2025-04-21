import { ActivityTracker, ModelCallOptions } from "./types";
import { ResearchState } from "./types";
import { openrouter,google,openai } from "./services";
import { generateObject, generateText, LanguageModel } from "ai";
import { MAX_RETRY_ATTEMPTS, RETRY_DELAY_MS,MODELS } from "./constants";
import { delay } from "./utils";
import { ModelProvider } from "@/store/deepResearch";


// const getModelInstance = (provider: ModelProvider, taskType: keyof typeof MODELS): LanguageModel => {
//     const modelName = MODELS[taskType][provider]; // Safely access the model name
//     if (!modelName) {
//         throw new Error(`Model not found for provider: ${provider}, taskType: ${taskType}`);
//     }
//     console.log(`Selecting model for Provider: ${provider}, Task: ${taskType}, ModelName: ${modelName}`);
//     switch (provider) {
//         case 'openai':
//             return openai(modelName);
//         case 'openrouter':
//             return openrouter(modelName);
//         case 'gemini':
//         default:
//             return google(modelName);
//     }
// };

const getModelInstance = (provider: ModelProvider, taskType: string): LanguageModel => {
	// Map activityType to the correct MODELS key
	const taskTypeMapping: Record<string, keyof typeof MODELS> = {
		planning: "PLANNING",
		extract: "EXTRACT",
		analyze: "ANALYZE",
		report: "REPORT",
		generate: "REPORT", 
	};

	const mappedTaskType = taskTypeMapping[taskType.toLowerCase()];
	if (!mappedTaskType) {
		throw new Error(`Invalid task type: ${taskType}`);
	}

	// Type assertion to ensure provider is a valid key for the model object
	const modelName = MODELS[mappedTaskType]?.[provider as keyof (typeof MODELS)[typeof mappedTaskType]]; 
	if (!modelName) {
		throw new Error(`Model not found for provider: ${provider}, taskType: ${mappedTaskType}`);
	}

    console.log(`Selecting model for Provider: ${provider}, Task: ${mappedTaskType}, ModelName: ${modelName}`);
    switch (provider) {
        case "openai":
            return openai(modelName);
        case "openrouter":
            return openrouter(modelName);
        case "gemini":
        default:
            return google(modelName);
    }
};

export async function callModel<T>(
	{ provider, prompt, system, schema, activityType = "generate" }: ModelCallOptions<T>,
	researchState: ResearchState,
	activityTracker: ActivityTracker
): Promise<T | string> {

	let attempts = 0;
	let lastError : Error | null = null;
	console.log("Activity Type: ", activityType);
	const taskType = (activityType.toUpperCase() as keyof typeof MODELS);
	console.log(`Task Type: ${taskType}, Provider: ${provider}`);
	const modelInstance = getModelInstance(provider, taskType);

	while (attempts<MAX_RETRY_ATTEMPTS){
		try{
			if (schema) {
				// console.log("Model: ", model);
				console.log("Using Model Instance: ", modelInstance);
				const { object, usage } = await generateObject({
					// model: openrouter(model),
					// model: model === "gpt-4o" ? openai(model) : google(model),
					model: modelInstance,
					prompt,
					system,
					schema: schema,
				});
		
				researchState.tokenUsed += usage.totalTokens;
				researchState.completedSteps++;
		
				return object;
			} else {
				const reportModelInstance = getModelInstance(provider, 'REPORT'); 

				const { text, usage } = await generateText({
					model: reportModelInstance,
					prompt,
					system,
				});
		
				researchState.tokenUsed += usage.totalTokens;
				researchState.completedSteps++;
				
				return text
			}
		}
		catch(error){
			attempts++;
			lastError = error instanceof Error ? error : new Error('Unknown error');

			if (attempts < MAX_RETRY_ATTEMPTS){
				activityTracker.add(activityType, 'warning', `Model call failed, attempt ${attempts}/${MAX_RETRY_ATTEMPTS}. Retrying...`)
			}
			await delay(RETRY_DELAY_MS*attempts)
		}
	}

	throw lastError || new Error(`Failed after ${MAX_RETRY_ATTEMPTS} attempts!`)
}
