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
import { Input } from "@/components/ui/input";
import { useDeepResearchStore } from "@/store/deepResearch";
import { ArrowUp, Loader2 } from "lucide-react";

const formSchema = z.object({
	input: z
		.string()
		.min(2, "Please enter at least 2 characters")
		.max(200, "Topic should be less than 200 characters"),
});

const UserInput = () => {
	const { 
		setQuestions, 
		setTopic, 
		isLoading, 
		isCompleted,
		setIsLoading, 
		modelProvider, 
		modelId,
		setIsCompleted, 
		setAnswers, 
		setCurrentQuestion 
	} = useDeepResearchStore();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			input: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			setTopic(values.input);
			setQuestions([]);
			setAnswers([]);
			setCurrentQuestion(0);
			setIsCompleted(false);
			
			const response = await fetch("/api/generate-question", {
				method: "POST",
				body: JSON.stringify({
					topic: values.input,
					modelProvider: modelProvider,
					modelId: modelId, 
				}),
			});
			const data = await response.json();
			setQuestions(data);
		} catch (err) {
			console.error("Error fetching questions:", err);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="w-full ">
			<div className="bg-slate-100/60 rounded-2xl shadow-sm border border-slate-200/50 p-0.5 max-h-26">

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="input"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="relative w-full bg-white rounded-xl">
											<Input
												type="text"
												placeholder="Enter your research topic (e.g. Quantum Computing, Climate Change)"
												{...field}
												className=" h-24 
                        pl-4 pr-16 py-6 rounded-xl w-full bg-white border-slate-200 shadow-sm focus:ring-0 focus:ring-primary/0
                      placeholder:text-slate-400 placeholder:text-[15px]
                      focus-visible:outline-none focus-visible:ring-0 focus-visible:border-slate-300
                      text-slate-900 resize-none text-[15px]
                      "
											/>
											<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
												<Button
													type="submit"
													size="icon"
													disabled={isLoading || !field.value || isCompleted}
													className="w-8 h-8 rounded-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white shadow-xl disabled:opacity-50 cursor-pointer"
												>{isLoading ? (
														<Loader2 className="h-4 w-4 animate-spin" />
												) : (
                          <ArrowUp className="w-4 h-4" />
												)}
													
												</Button>
											</div>
										</div>
									</FormControl>
									<FormMessage className="text-sm text-red-500 mt-2 pl-2 pb-4" />
								</FormItem>
							)}
							/>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default UserInput;
