'use client';
import QnA from "@/components/deep-research/QnA";
import UserInput from "@/components/deep-research/UserInput";
import Image from "next/image";
import bg from "../../public/050 Snow Again.png";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { useDeepResearchStore, ModelProvider } from "@/store/deepResearch"; 
import { Label } from "@/components/ui/label"; 
import { BookOpenIcon } from "lucide-react";

export default function Home() {
	const { modelProvider, setModelProvider, isLoading, isCompleted } = useDeepResearchStore();
	return (
		// <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-600" id="page-top">
		<div className="min-h-screen w-full bg-slate-200" id="page-top">
			<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col items-center">
				<header className="w-full max-w-4xl mb-12 md:mb-16 text-center">
					<div className="inline-flex items-center justify-center mb-4">
						<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
							<BookOpenIcon className="h-6 w-6 text-primary" />
						</div>
					</div>
					<h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-dancing-script italic bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent mb-4 tracking-tight">
						Deep Research
					</h1>
					<p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
						Generate comprehensive research reports on any topic through AI-powered analysis
					</p>
				</header>

				<div className="w-full max-w-xl mb-8">
					<div className="bg-white/80 backdrop-blur-sm shadow-sm border border-slate-200/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
						<div>
							<h2 className="font-medium text-slate-800 mb-1">Research Configuration</h2>
							<p className="text-xs text-slate-500">Select your preferred AI model provider</p>
						</div>
						<div className="flex items-center gap-2">
							<Label htmlFor="model-select" className="text-sm text-slate-600 whitespace-nowrap">Model:</Label>
							<Select
								value={modelProvider}
								onValueChange={(value) => setModelProvider(value as ModelProvider)}
								disabled={isLoading || isCompleted} 
							>
								<SelectTrigger id="model-select" className="w-36 bg-white border-slate-200">
									<SelectValue placeholder="Select Provider" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="gemini">Gemini</SelectItem>
									<SelectItem value="openai">OpenAI</SelectItem>
									<SelectItem value="openrouter">OpenRouter</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<div className="w-full flex flex-col items-center space-y-6 max-w-6xl">
					<div className="w-full max-w-3xl">
						<UserInput />
					</div>
					
					<QnA />
				</div>
			</main>
			
		</div>
	);
}
