import { ResearchState, searchResult } from "./types";
import { z } from "zod";
import { getPlanningPrompt, PLANNING_SYSTEM_PROMPT } from "./prompts";
import { callModel } from "./model-caller";
import { exa } from "./services";


export async function generateSearchQueries(
    researchState: ResearchState
){

    const results = await callModel({
        model: "google/gemini-2.0-flash-lite-preview-02-05:free",
        prompt: getPlanningPrompt(researchState.topic, researchState.clarificationsText),
        system: PLANNING_SYSTEM_PROMPT,
        schema: z.object({
            searchQueries: z.array(z.string()).describe("Search Queries which can be used to find the most relevant contnt which can be used to write the most comprehensive report on the given topic. (max 3 queries)")
        })
    },researchState)

    return results;
}

export async function search(
    query: string,
    researchState: ResearchState,
): Promise<searchResult[]> {

    try {
        const searchResult = await exa.searchAndContents(
            query,
            {
              type: "keyword",
              numResults: 3,
              startPublishedDate: new Date(Date.now() - 365*24*60*60*1000).toISOString(),
              endPublishedDate: new Date().toISOString(),
              startCrawlDate: new Date(Date.now() - 365*24*60*60*1000).toISOString(),
              endCrawlDate: new Date().toISOString(),
              excludeDomains: ["https://youtube.com"],
              text: {
                maxCharacters: 20000
              }
            }
          )


          const filteredResults = searchResult.results.filter(r => r.title && r.text !== undefined).map(r => ({
            title : r.title || "",
            url : r.url || "",
            content : r.text || "",
          }))

          researchState.completedSteps++;

          return filteredResults;
    }catch (err){
        console.log("error: ",err)
    }
}