'use client';
import QnA from "@/components/deep-research/QnA";
import UserInput from "@/components/deep-research/UserInput";
import Image from "next/image";
import bg from "../../public/bg1.png"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { useDeepResearchStore, ModelProvider } from "@/store/deepResearch"; 
import { Label } from "@/components/ui/label"; 

export default function Home() {
	const { modelProvider, setModelProvider, isLoading, isCompleted } = useDeepResearchStore();
	return (
		<main className="min-h-screen w-full flex flex-col items-center justify-start gap-8 py-16">

			<div className="fixed top-0 left-0 w-full h-full object-cover -z-10 bg-black/30">
				<Image src={bg} alt="Deep Research AI Agent" className="w-full h-full object-center opacity-50"/>
			</div>

			<div className="flex flex-col items-center gap-4">
				<h1 className="text-8xl font-bold font-dancing-script italic bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
					Deep Research
				</h1>
				<p className="text-gray-600 text-center">
					Enter a topic and answer the following question to generate
					comprehensive report.
				</p>
			</div>
            <div className="flex items-center gap-2">
                <Label htmlFor="model-select" className="text-gray-600">Select Model Provider:</Label>
                <Select
                    value={modelProvider}
                    onValueChange={(value) => setModelProvider(value as ModelProvider)}
                    disabled={isLoading || isCompleted} 
                >
                    <SelectTrigger id="model-select" className="w-[180px] bg-white/60 border-black/10">
                        <SelectValue placeholder="Select Provider" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="gemini">Gemini</SelectItem>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="openrouter">OpenRouter</SelectItem>
                    </SelectContent>
                </Select>
            </div>
			<UserInput />

			<QnA />
		</main>
	);
}
