import React, { useState, useEffect, useRef } from 'react';
import { useDeepResearchStore, ModelProvider } from "@/store/deepResearch"; 
import { Label } from "@/components/ui/label"; 
import { ChevronDown, Eye, Globe, FileText, Clock, Cpu, Diamond, Network, ChevronLeft, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type ModelCapability = "vision" | "web" | "files" | "reasoning";

type Model = {
  id: string;
  name: string;
  isNew?: boolean;
  isDegraded?: boolean;
  capabilities: ModelCapability[];
  provider: ModelProvider;
};

type Provider = {
  id: ModelProvider;
  name: string;
  icon: React.ReactNode;
  models: Model[];
};

type ViewMode = "list" | "grid";

const ResearchConfiguration = () => {
	const { modelProvider, setModelProvider, isLoading, isCompleted } = useDeepResearchStore();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
	const [viewMode, setViewMode] = useState<ViewMode>("list");
	const dropdownRef = useRef<HTMLDivElement>(null);
	
	// Get the currently selected model based on modelProvider
	const getSelectedModel = () => {
		const provider = providers.find(p => p.id === modelProvider);
		return provider ? provider.models[0] : null;
	};
	
	const selectedModel = getSelectedModel();

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
		// Reset to provider view when opening dropdown
		if (!isDropdownOpen) {
			setSelectedProvider(null);
		}
	};

	const selectProvider = (provider: Provider) => {
		setSelectedProvider(provider);
	};

	const selectModel = (model: Model) => {
		setModelProvider(model.provider);
		setIsDropdownOpen(false);
		setSelectedProvider(null); // Reset to provider view for next open
	};

	const backToProviders = () => {
		setSelectedProvider(null);
	};

	const toggleViewMode = () => {
		setViewMode(viewMode === "list" ? "grid" : "list");
	};

	// Handle click outside to close dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		if (isDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isDropdownOpen]);

	return (
		<div className="w-full max-w-xl mb-8 relative z-50">
			<div className="bg-white/80 backdrop-blur-sm shadow-sm border border-slate-200/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
				<div>
					<h2 className="font-medium text-slate-800 mb-1">Research Configuration</h2>
					<p className="text-xs text-slate-500">Select your preferred AI model provider</p>
				</div>
				
				<div className="relative overflow-visible z-50" ref={dropdownRef}>
					<div className="flex items-center gap-2">
						<Label htmlFor="model-select" className="text-sm text-slate-600 whitespace-nowrap">Model:</Label>
						<button
							id="model-select"
							onClick={toggleDropdown}
							disabled={isLoading || isCompleted}
							className={cn(
								"flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border",
								isLoading || isCompleted ? "text-slate-400 bg-slate-100 border-slate-200 cursor-not-allowed" : 
								"text-slate-700 bg-white border-slate-200 hover:border-slate-300"
							)}
						>
							{selectedModel?.name || "Select Model"} <ChevronDown className="w-4 h-4 ml-1" />
						</button>
					</div>

					{/* Dropdown */}
					{isDropdownOpen && (
						<div className="absolute z-[9999] right-0 mt-1 w-80 max-h-[500px] overflow-y-auto bg-white rounded-lg border border-slate-200 shadow-lg">
							{/* Header with back button when in model view */}
							{selectedProvider && (
								<div className="flex items-center p-2 border-b border-slate-100">
									<button onClick={backToProviders} className="flex items-center text-blue-500 text-sm">
										<ChevronLeft className="w-4 h-4 mr-1" />
										<span>Back to providers</span>
									</button>
									<div className="flex items-center ml-2 gap-2">
										<div className="text-blue-500">{selectedProvider.icon}</div>
										<span className="text-slate-700">{selectedProvider.name}</span>
									</div>
								</div>
							)}

							{/* View toggle and filters when in provider view */}
							{!selectedProvider && (
								<div className="flex justify-between items-center p-2 border-b border-slate-100">
									<div className="text-blue-500 text-sm">Select a provider</div>
									<div className="flex items-center gap-2">
										<button 
											onClick={toggleViewMode} 
											className={cn(
												"p-1 rounded",
												viewMode === "list" ? "bg-slate-100" : "text-slate-400"
											)}
										>
											<List className="w-4 h-4" />
										</button>
										<button 
											onClick={toggleViewMode}
											className={cn(
												"p-1 rounded",
												viewMode === "grid" ? "bg-slate-100" : "text-slate-400"
											)}
										>
											<LayoutGrid className="w-4 h-4" />
										</button>
									</div>
								</div>
							)}

							{/* Provider list view */}
							{!selectedProvider && viewMode === "list" && (
								<div className="max-h-[400px] overflow-y-auto">
									{providers.map((provider) => (
										<div
											key={provider.id}
											onClick={() => selectProvider(provider)}
											className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100"
										>
											<div className="flex items-center gap-3">
												<div className="text-blue-500">{provider.icon}</div>
												<span className="text-slate-700">{provider.name}</span>
											</div>
											<div className="text-slate-400 text-xs">{provider.models.length} models</div>
										</div>
									))}
								</div>
							)}

							{/* Provider grid view */}
							{!selectedProvider && viewMode === "grid" && (
								<div className="p-3">
									<div className="grid grid-cols-2 gap-2">
										{providers.map((provider) => (
											<div
												key={provider.id}
												onClick={() => selectProvider(provider)}
												className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer"
											>
												<div className="text-blue-500 mb-1">{provider.icon}</div>
												<span className="text-slate-700 text-xs text-center">{provider.name}</span>
												<div className="text-slate-400 text-[10px] mt-1">{provider.models.length} models</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Models grid view for selected provider */}
							{selectedProvider && (
								<div className="p-3">
									<div className="grid grid-cols-2 gap-2">
										{selectedProvider.models.map((model) => (
											<div
												key={model.id}
												onClick={() => selectModel(model)}
												className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer relative"
											>
												{model.isNew && (
													<span className="absolute top-1 right-1 text-[10px] text-blue-500 font-medium">NEW</span>
												)}
												<span className="text-slate-700 text-xs text-center">{model.name}</span>
												<div className="flex items-center gap-1 mt-2">
													{model.capabilities.includes("vision") && <Eye className="w-4 h-4 text-slate-400" />}
													{model.capabilities.includes("web") && <Globe className="w-4 h-4 text-slate-400" />}
													{model.capabilities.includes("files") && <FileText className="w-4 h-4 text-slate-400" />}
													{model.capabilities.includes("reasoning") && <Clock className="w-4 h-4 text-slate-400" />}
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// Provider and model data
const providers: Provider[] = [
	{
		id: "openai",
		name: "OpenAI",
		icon: <Cpu className="w-5 h-5" />,
		models: [
			{
				id: "gpt-4o",
				name: "GPT 4o",
				capabilities: ["vision", "web", "files", "reasoning"],
				isNew: true,
				provider: "openai",
			},
			{
				id: "gpt-4-turbo",
				name: "GPT-4 Turbo",
				capabilities: ["vision", "files", "reasoning"],
				provider: "openai",
			}
		],
	},
	{
		id: "gemini",
		name: "Gemini",
		icon: <Diamond className="w-5 h-5" />,
		models: [
			{
				id: "gemini-pro",
				name: "Gemini Pro",
				capabilities: ["reasoning"],
				provider: "gemini",
			},
			{
				id: "gemini-ultra",
				name: "Gemini Ultra",
				capabilities: ["vision", "web", "reasoning"],
				isNew: true,
				provider: "gemini",
			}
		],
	},
	{
		id: "openrouter",
		name: "OpenRouter",
		icon: <Network className="w-5 h-5" />,
		models: [
			{
				id: "openrouter-claude",
				name: "Claude 3",
				capabilities: ["vision", "files"],
				provider: "openrouter",
			},
			{
				id: "openrouter-mixtral",
				name: "Mixtral 8x7B",
				capabilities: ["reasoning"],
				provider: "openrouter",
			}
		],
	}
];

export default ResearchConfiguration;