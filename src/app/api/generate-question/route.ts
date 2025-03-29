import { NextResponse } from "next/server";
import { generateObject, LanguageModel } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from "zod";
import { ModelProvider } from "@/store/deepResearch";

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || "",
  });

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || "",
});

const openai = createOpenAI({
    baseURL: process.env.AZURE_OPENAI_ENDPOINT || "",
    apiKey: process.env.GITHUB_API_KEY || "",
    compatibility: 'compatible'
});

const getModelInstance = (provider: ModelProvider): LanguageModel => {
    switch (provider) {
        case 'openai':
            return openai("gpt-4o"); 
        case 'openrouter':
            return openrouter("google/gemini-2.0-flash-lite-preview-02-05:free"); 
        case 'gemini':
        default:
            return google("gemini-2.0-flash-exp");
    }
}

const clarifyResearchGoals = async(topic: string, provider: ModelProvider) => {
    
    const prompt = `
    Given the research topic <topic>${topic}</topic>, generate 2-4 clarifying questions to help narrow down the research scope. Focus on identifying: 
    - Specific aspects of interes
    - Reqiored depth/complexity level
    `
    try{
        const modelInstance = getModelInstance(provider)
        const { object } = await generateObject({
            model: modelInstance,
            prompt,
            schema: z.object({
                questions: z.array(z.string())
            })
          }); 
        return object.questions;
    }catch(e){
        console.log("Generate Error : ",e)
    }
}


export async function POST(req: Request){

    try{

        const {topic, modelProvider} = await req.json();
        console.log("TOPIC:", topic); 
        console.log("Model Provider: ", modelProvider)
        const questions = await clarifyResearchGoals(topic, modelProvider as ModelProvider);
        console.log("Questions:", questions)

        return NextResponse.json(questions)
    } catch(err){
        console.log("Generate Error : ",err)

        return NextResponse.json({
            success: false,
            error: "Failed",
        },{status: 500})
    }


}