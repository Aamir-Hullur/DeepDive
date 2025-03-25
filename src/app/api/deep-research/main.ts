import { MAX_ITERATIONS } from "./constants";
import { analyzeFindings, generateSearchQueries, processSearchResults, search } from "./research-functions";
import { ResearchState } from "./types";

export async function deepResearch(researchState: ResearchState, dataStream: any){

    let Iteration = 0

    
    const initialQueries = await generateSearchQueries(researchState)
    let currentQueries = (initialQueries as any).searchQueries

    while (currentQueries && currentQueries.length > 0 && Iteration < MAX_ITERATIONS){
        Iteration++

        console.log("We are running on iteration number:", Iteration);
        const searchResults = currentQueries.map((query:string) => search(query,researchState))
        const searchResultsResponses = await Promise.allSettled(searchResults)

        // const allSearchResults = searchResultsResponses.filter(result => result.status === 'fulfilled' && result.value.length > 0).map(result => result.value).flat()
        const allSearchResults = searchResultsResponses.filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled' && result.value.length > 0).map(result => result.value).flat()

        console.log(`We got ${allSearchResults.length} search results!`)

        const newFindings = await processSearchResults(
            allSearchResults, researchState
        )
        
        console.log(`Results are processed!`)
        researchState.findings = [...researchState.findings, ...newFindings];


        const analysis = await analyzeFindings(
            researchState,
            currentQueries,
            Iteration
        )
        console.log("Analysis: ",analysis)
        if((analysis as any).sufficient){
            break;
        }


        currentQueries = ((analysis as any).queries || []).filter((query:string) => !currentQueries.includes(query));
    }

    console.log("We are outside of the loop with total iterations: ", Iteration)

    console.log("Findings: ",researchState.findings)
    return initialQueries;
}