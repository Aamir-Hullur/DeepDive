import { string } from "zod";
import { ModelCallOptions } from "./types";
import { ResearchState } from "./types";
import { openrouter } from "./services";
import { generateObject, generateText } from "ai";
import { google } from "./services";
import { openai } from "./services";

export async function callModel<T>(
	{ model, prompt, system, schema }: ModelCallOptions<T>,
	researchState: ResearchState
): Promise<T | string> {
	if (schema) {
		console.log("Model: ", model);
		const { object, usage } = await generateObject({
			// model: openrouter(model),
			model: model === "gpt-4o" ? openai(model) : google(model),
			prompt,
			system,
			schema: schema,
		});

		researchState.tokenUsed += usage.totalTokens;
		researchState.completedSteps++;

		return object;
	} else {
		const { text, usage } = await generateText({
			model: google("gemini-2.5-pro-exp-03-25"),
			prompt,
			system,
		});

        researchState.tokenUsed += usage.totalTokens;
		researchState.completedSteps++;
        
        return text
    }
}
