import QnA from "@/components/deep-research/QnA";
import UserInput from "@/components/deep-research/UserInput";
import Image from "next/image";

export default function Home() {
	return (
		<main className="min-h-screen w-full flex flex-col items-center justify-start gap-8 py-16">
			<div className="flex flex-col items-center gap-4">
				<h1 className="text-8xl font-bold font-dancing-script italic bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
					Deep Research
				</h1>
				<p className="text-gray-600 text-center">
					Enter a topic and answer the following question to generate
					comprehensive report.
				</p>
			</div>

			<UserInput />

			<QnA />
		</main>
	);
}
