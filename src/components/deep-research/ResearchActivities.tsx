"use client";
import { useDeepResearchStore } from "@/store/deepResearch";
import React, { useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "../ui/button";
import { 
	Activity, 
	BookOpenIcon, 
	ChevronDown, 
	ExternalLink, 
	Globe, 
	GraduationCapIcon, 
	InfoIcon 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const ResearchActivities = () => {
	const [isOpen, setIsOpen] = useState(true);
	const { activities, sources } = useDeepResearchStore();

	if (activities.length === 0) return null;

	const completedActivities = activities.filter(a => a.status === "complete").length;
	const pendingActivities = activities.filter(a => a.status === "pending").length;
	const errorActivities = activities.filter(a => a.status === "error").length;

	return (
		<div className="fixed top-4 right-4 z-50">
			<TooltipProvider delayDuration={300}>
				<Collapsible
					className="w-[340px] max-w-[95vw]"
					open={isOpen}
					onOpenChange={setIsOpen}
				>
					<div className="flex justify-end mb-2">
						<CollapsibleTrigger asChild>
							<Button 
								variant="outline" 
								size="sm" 
								className="bg-white/80 border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2"
							>
								<Activity className="h-4 w-4 text-primary" />
								<span className="font-medium">
									Research Progress
								</span>
								<div className="flex items-center gap-1 ml-1">
									<span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">{completedActivities}</span>
									{pendingActivities > 0 && (
										<span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">{pendingActivities}</span>
									)}
									{errorActivities > 0 && (
										<span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-red-100 text-red-700">{errorActivities}</span>
									)}
								</div>
								<ChevronDown
									className={`w-4 h-4 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
								/>
							</Button>
						</CollapsibleTrigger>
					</div>
					
					<CollapsibleContent className="mt-2">
						<div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-sm overflow-hidden max-h-[calc(100vh-120px)]">
							<Tabs defaultValue="activities" className="w-full">
								<div className="border-b border-slate-100">
									<TabsList className="w-full h-auto p-0 bg-transparent">
										<TabsTrigger
											value="activities"
											className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 text-sm font-medium text-slate-600 data-[state=active]:text-slate-900 transition-all"
										>
											<Activity className="h-4 w-4 mr-2" />
											Research Activities
										</TabsTrigger>
										{sources.length > 0 && (
											<TabsTrigger 
												value="sources" 
												className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 text-sm font-medium text-slate-600 data-[state=active]:text-slate-900 transition-all"
											>
												<Globe className="h-4 w-4 mr-2" />
												Sources ({sources.length})
											</TabsTrigger>
										)}
									</TabsList>
								</div>

								<TabsContent
									value="activities"
									className="max-h-[60vh] overflow-y-auto p-0 m-0"
								>
									<div className="p-3 pb-2 bg-slate-50 border-b border-slate-100">
										<div className="flex justify-between items-center">
											<h3 className="text-xs font-medium text-slate-500">ACTIVITY LOG</h3>
											<div className="flex gap-1">
												<Tooltip>
													<TooltipTrigger asChild>
														<div className="rounded-full w-2 h-2 bg-emerald-500"></div>
													</TooltipTrigger>
													<TooltipContent side="bottom">
														<p className="text-xs">Completed</p>
													</TooltipContent>
												</Tooltip>
												<Tooltip>
													<TooltipTrigger asChild>
														<div className="rounded-full w-2 h-2 bg-amber-500"></div>
													</TooltipTrigger>
													<TooltipContent side="bottom">
														<p className="text-xs">In progress</p>
													</TooltipContent>
												</Tooltip>
												<Tooltip>
													<TooltipTrigger asChild>
														<div className="rounded-full w-2 h-2 bg-red-500"></div>
													</TooltipTrigger>
													<TooltipContent side="bottom">
														<p className="text-xs">Error</p>
													</TooltipContent>
												</Tooltip>
											</div>
										</div>
									</div>
									
									<ul className="divide-y divide-slate-100">
										{activities.map((activity, index) => (
											<li
												key={index}
												className="p-3 hover:bg-slate-50/50 transition-colors"
											>
												<div className="flex items-start gap-3">
													<div 
														className={`
															flex-none w-2 h-2 mt-1.5 rounded-full 
															${activity.status === "complete" 
																? "bg-emerald-500" 
																: activity.status === "error" 
																	? "bg-red-500" 
																	: "bg-amber-500"
															}
														`}
													/>
													<div className="flex-1 min-w-0">
														<p className="text-sm text-slate-700 font-medium break-words">
															{activity.message.includes("https://")
																? activity.message.split("https://")[0] + activity.message.split("https://")[1].split("/")[0]
																: activity.message
															}
														</p>
														{activity.timestamp && (
															<time className="text-xs text-slate-500 mt-1 block">
																{format(activity.timestamp, "HH:mm:ss")}
															</time>
														)}
													</div>
												</div>
											</li>
										))}
									</ul>
									
									{activities.length === 0 && (
										<div className="p-8 text-center">
											<InfoIcon className="mx-auto h-8 w-8 text-slate-300" />
											<p className="mt-2 text-sm text-slate-500">No activities yet</p>
										</div>
									)}
								</TabsContent>

								{sources.length > 0 && (
									<TabsContent
										value="sources"
										className="max-h-[60vh] overflow-y-auto p-0 m-0"
									>
										<div className="p-3 pb-2 bg-slate-50 border-b border-slate-100">
											<h3 className="text-xs font-medium text-slate-500">REFERENCE SOURCES</h3>
										</div>
										
										<ul className="divide-y divide-slate-100">
											{sources.map((source, index) => (
												<li key={index} className="p-3 hover:bg-slate-50/50 transition-colors">
													<div className="flex items-start gap-3">
														<div className="rounded-md p-1.5 bg-primary/10 text-primary">
															<GraduationCapIcon className="h-4 w-4" />
														</div>
														<div className="flex-1 min-w-0">
															<Link
																href={source.url}
																target="_blank"
																className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
															>
																{source.title}
																<ExternalLink className="h-3 w-3 inline flex-shrink-0" />
															</Link>
															<p className="text-xs text-slate-500 mt-1 truncate">
																{source.url}
															</p>
														</div>
													</div>
												</li>
											))}
										</ul>
										
										{sources.length === 0 && (
											<div className="p-8 text-center">
												<BookOpenIcon className="mx-auto h-8 w-8 text-slate-300" />
												<p className="mt-2 text-sm text-slate-500">No sources found yet</p>
											</div>
										)}
									</TabsContent>
								)}
							</Tabs>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</TooltipProvider>
		</div>
	);
};

export default ResearchActivities;
