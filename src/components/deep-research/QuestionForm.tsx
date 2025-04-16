"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { useDeepResearchStore } from "@/store/deepResearch";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
	answer: z.string().min(1, "Please provide an answer to continue").max(500, "Answer should be less than 500 characters"),
});

const QuestionForm = () => {
	const { questions, currentQuestion, answers, setCurrentQuestion, setAnswers, setIsCompleted, isLoading, isCompleted } = useDeepResearchStore();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			answer: answers[currentQuestion] || "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = values.answer;
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            form.reset({ answer: answers[currentQuestion + 1] || "" });
        } else {
            setIsCompleted(true);
        }
	}

	if (isCompleted) return null;
    if (questions.length === 0) return null;

	return (
		<Card className="w-full shadow-sm bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl overflow-hidden">
			<CardHeader className="bg-slate-50/80 border-b border-slate-100 px-6 py-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
					<div>
						<CardTitle className="text-lg text-slate-800">
							Question {currentQuestion + 1} of {questions.length}
						</CardTitle>
						<CardDescription className="text-slate-500 text-sm">
							Help us refine your research by answering these questions
						</CardDescription>
					</div>
					<Progress 
						value={((currentQuestion + 1) / questions.length) * 100} 
						className="h-2 w-full sm:max-w-[180px] bg-slate-200"
					/>
				</div>
			</CardHeader>
			<CardContent className="p-6">
				<div className="mb-6">
					<h3 className="text-base md:text-lg font-medium text-slate-800 mb-1">
						{questions[currentQuestion]}
					</h3>
					<p className="text-sm text-slate-500">
						Your answer will help tailor the research to your specific interests
					</p>
				</div>
				
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="answer"
							render={({ field }) => (
								<FormItem>
									<FormControl> 
										<Textarea
											placeholder="Type your answer here..."
											{...field}
											className="min-h-[120px] p-4 text-base resize-none border-slate-200 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
											onKeyDown={(e) => {
												if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
													e.preventDefault();
													form.handleSubmit(onSubmit)();
												}
											}}
										/>
									</FormControl>
									<FormMessage className="text-sm text-red-500 mt-2" />
									<p className="text-xs text-slate-500 mt-2">Press Ctrl+Enter or Cmd+Enter to submit</p>
								</FormItem>
							)}
						/>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
							<Button 
								type="button" 
								variant="outline"
								className="w-full sm:w-auto order-2 sm:order-1 border-slate-200 text-slate-600 hover:bg-slate-50"
								onClick={() => {
									if (currentQuestion > 0) {
										setCurrentQuestion(currentQuestion - 1);
										form.setValue("answer", answers[currentQuestion - 1] || "");
									}
								}}
								disabled={currentQuestion === 0 || isLoading}
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Previous Question
							</Button>

							<Button 
								type="submit"
								className="w-full sm:w-auto order-1 sm:order-2 bg-primary hover:bg-primary/90"
								disabled={isLoading}
							>
								{currentQuestion === questions.length - 1 ? (
									<>
										<Sparkles className="mr-2 h-4 w-4" />
										Begin Research
									</>
								) : (
									<>
										Next Question
										<ArrowRight className="ml-2 h-4 w-4" />
									</>
								)}
							</Button>
                        </div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default QuestionForm;
