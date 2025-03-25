import { ResearchFindings, ResearchState, SearchResult } from "./types";
import { z } from "zod";
import {
    ANALYSIS_SYSTEM_PROMPT,
	EXTRACTION_SYSTEM_PROMPT,
	getAnalysisPrompt,
	getExtractionPrompt,
	getPlanningPrompt,
	PLANNING_SYSTEM_PROMPT,
} from "./prompts";
import { callModel } from "./model-caller";
import { exa } from "./services";
import { combineFindings } from "./utils";
import { MAX_CONTENT_CHARS, MAX_ITERATIONS, MAX_SEARCH_RESULTS, MODELS } from "./constants";

export async function generateSearchQueries(researchState: ResearchState) {
	const results = await callModel(
		{
			model: MODELS.PLANNING,
			prompt: getPlanningPrompt(
				researchState.topic,
				researchState.clarificationsText
			),
			system: PLANNING_SYSTEM_PROMPT,
			schema: z.object({
				searchQueries: z
					.array(z.string())
					.describe(
					"The search queries that can be used to find the most relevant content which can be used to write the comprehensive report on the given topic. (max 3 queries)"
					),
			}),
		},
		researchState
	);

	return results;
}

export async function search(
	query: string,
	researchState: ResearchState
): Promise<SearchResult[]> {
	try {
		console.log("Searching for query:", query);
		const searchResult = await exa.searchAndContents(query, {
			type: "keyword",
			numResults: MAX_SEARCH_RESULTS,
			startPublishedDate: new Date(
				Date.now() - 365 * 24 * 60 * 60 * 1000
			).toISOString(),
			endPublishedDate: new Date().toISOString(),
			startCrawlDate: new Date(
				Date.now() - 365 * 24 * 60 * 60 * 1000
			).toISOString(),
			endCrawlDate: new Date().toISOString(),
			excludeDomains: ["https://youtube.com"],
			text: {
				maxCharacters: MAX_CONTENT_CHARS,
			},
		});

		const filteredResults = searchResult.results
			.filter((r) => r.title && r.text !== undefined)
			.map((r) => ({
				title: r.title || "",
				url: r.url || "",
				content: r.text || "",
			}));

		researchState.completedSteps++;
		console.log("Filtered results:", filteredResults);
		return filteredResults;
	} catch (err) {
		console.log("error: ", err);
	}
}

export async function extractContent(
	content: string,
	url: string,
	researchState: ResearchState
) {
	const results = await callModel(
		{
			model: MODELS.EXTRACTION,
			prompt: getExtractionPrompt(
				content,
				researchState.topic,
				researchState.clarificationsText
			),
			system: EXTRACTION_SYSTEM_PROMPT,
			schema: z.object({
				summary: z
					.string()
					.describe("A comprehensive summary of the content"),
			}),
		},
		researchState
	);

	return {
		url,
		summary: (results as any).summary,
	};
}

export async function processSearchResults(
	searchResults: SearchResult[],
	researchState: ResearchState
): Promise<ResearchFindings[]> {
	const extractionPromises = searchResults.map((result) =>
		extractContent(result.content, result.url, researchState)
	);
	const extractionResults = await Promise.allSettled(extractionPromises);

	type ExtractionResult = { url: string; summary: string };

	const newFindings = extractionResults
		.filter(
			(result): result is PromiseFulfilledResult<ExtractionResult> =>
				result.status === "fulfilled" &&
				result.value !== null &&
				result.value !== undefined
		)
		.map((result) => {
			const { summary, url } = result.value;

			return {
				summary,
				source: url,
			};
		});
	console.log("Processed search Results!");
	return newFindings;
}


export async function analyzeFindings(
    researchState: ResearchState,
    currentQueries: string[],
    currentIteration: number,
){

    try{

        const contentText = combineFindings(researchState.findings)

        const result = await callModel({
            model: MODELS.ANALYSIS,
            prompt: getAnalysisPrompt(
                contentText,
                researchState.topic,
                researchState.clarificationsText,
                currentQueries,
                currentIteration,
                MAX_ITERATIONS,
                contentText.length,
            ),
            system: ANALYSIS_SYSTEM_PROMPT,
            schema: z.object({
                sufficient: z.boolean().describe("Whether the collected content is sufficient for a useful report"),
                gaps: z.array(z.string()).describe("Identified gaps in the content"),
                queries: z.array(z.string()).describe("Search queries for missing information. Max 3 queries.")
            })
        }, researchState)

        return result;

    }catch(err){
        console.log(err)
    }
}