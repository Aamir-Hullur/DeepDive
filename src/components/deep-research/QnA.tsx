"use client";
import { useDeepResearchStore } from "@/store/deepResearch";
import React, { useEffect } from "react";
import QuestionForm from "./QuestionForm";
import { useChat } from '@ai-sdk/react';
import ResearchActivities from "./ResearchActivities";
import ResearchReport from "./ResearchReport";
import ResearchTimer from "./ResearchTimer";
import CompletedQuestions from "./CompletedQuestions";

const QnA = () => {
	const { questions, isCompleted, topic, answers, setIsLoading, setActivities, setSources, setReport, isLoading, modelProvider } = useDeepResearchStore();
    const { append, data } = useChat({
        api:"/api/deep-research"
    });

    useEffect(() => {
        if (!data) return;

        const messages = data as unknown[];
        const activities = messages.filter(msg => typeof msg === 'object' && (msg as any).type === 'activity').map(msg => (msg as any).content)

        setActivities(activities)
        const sources = activities.filter(activity => activity.type === 'extract' && activity.status === 'complete')
        .map(activity => {
            const url = activity.message.split("from ")[1]

            return {
                url,
                title: url?.split("/")[2] || url
            }
        })

        setSources(sources)
        const reportData = messages.find(msg => typeof msg === 'object' && (msg as any).type === 'report')
        const report = typeof (reportData as any)?.content == "string"? (reportData as any).content : ""
        setReport(report)

        setIsLoading(isLoading)
    }, [data, setActivities, setSources, setReport, setIsLoading, isLoading])

    useEffect(() => {
        if(isCompleted && questions.length > 0) {
            const clarifications = questions.map((question, index) => ({
                question: question,
                answer: answers[index],
            }))

            append({
                role: "user",
                content: JSON.stringify({
                    topic: topic,
                    clarifications: clarifications,
                    modelProvider: modelProvider,
                })
            })
        }
    }, [isCompleted, questions, answers, topic, append, modelProvider])

	return (
		<div className="w-full flex flex-col items-center mb-16">
            <div className="w-full max-w-3xl space-y-6">
                <QuestionForm />
                <CompletedQuestions />
            </div>
            
            <ResearchActivities />
            
            <div className="w-full max-w-3xl">
                <ResearchTimer />
            </div>
            
            <div className="w-full">
                <ResearchReport />
            </div>
		</div>
	);
};

export default QnA;
