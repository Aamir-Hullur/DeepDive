import { string } from "zod";
import { ModelCallOptions } from "./types";
import { ResearchState } from "./types";
import { openrouter } from "./services";
import { generateObject } from "ai";

export async function callModel<T>({
    model,prompt,system,schema
}: ModelCallOptions<T>,
researchState: ResearchState): Promise<T | string>{
    const { object, usage } = await generateObject({
        model: openrouter(model),
        prompt,
        system,
        schema: schema,
      }); 

      researchState.tokenUsed += usage.totalTokens;
      researchState.completedSteps ++

      return object;
}