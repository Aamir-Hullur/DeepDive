import { NextResponse } from "next/server";
import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from "zod";

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || "",
  });

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || "",
});

const openai = createOpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.GITHUB_API_KEY || "",
    compatibility: 'compatible'
});

const clarifyResearchGoals = async(topic: string) => {
    
    const prompt = `
    Given the research topic <topic>${topic}</topic>, generate 2-4 clarifying questions to help narrow down the research scope. Focus on identifying: 
    - Specific aspects of interes
    - Reqiored depth/complexity level
    `
    try{
        const { object } = await generateObject({
            // model: openrouter("google/gemini-2.0-flash-lite-preview-02-05:free"),
            // model: google("gemini-2.0-flash-exp"),
            model: openai("gpt-4o"),
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

    const {topic} = await req.json();
    console.log("TOPIC:",topic); 

    try{
        const questions = await clarifyResearchGoals(topic);
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