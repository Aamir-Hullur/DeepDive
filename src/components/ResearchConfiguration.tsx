import React, { useState, useEffect, useRef } from 'react';
import { useDeepResearchStore } from "@/store/deepResearch"; 
import { Label } from "@/components/ui/label"; 
import { Brain, ChevronDown, ChevronLeft, Eye, FileText, Globe, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
    ModelProvider, 
    Provider, 
    getEnabledProviders,
    getModelById,
} from "@/config/models";

type ViewMode = "list" | "grid";

const ResearchConfiguration = () => {
	const { modelProvider, modelId, setSelectedModel, isLoading, isCompleted } = useDeepResearchStore(); 
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
	const [viewMode, setViewMode] = useState<ViewMode>("list");
	const dropdownRef = useRef<HTMLDivElement>(null);
	
	const providers = getEnabledProviders();
	
	const getSelectedModel = () => {
		if (!modelProvider || !modelId) return null;
		return getModelById(modelProvider, modelId);
	};
	
	const selectedModel = getSelectedModel();

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);

		if (!isDropdownOpen) {
			setSelectedProvider(null);
		}
	};

	const selectProvider = (provider: Provider) => {
		setSelectedProvider(provider);
	};

	const selectModel = (provider: ModelProvider, modelId: string) => {
		setSelectedModel(provider, modelId); 
		setIsDropdownOpen(false);
		setSelectedProvider(null); 
	};

	const backToProviders = () => {
		setSelectedProvider(null);
	};

	const toggleViewMode = () => {
		setViewMode(viewMode === "list" ? "grid" : "list");
	};

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
												onClick={() => selectModel(model.provider, model.id)}
												className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer relative"
											>
												{model.isNew && (
													<span className="absolute top-1 right-1 text-[10px] text-blue-500 font-medium">NEW</span>
												)}
												<span className="text-slate-700 text-xs font-semibold">{model.name}</span>
												{model.capabilities && model.capabilities.length > 0
												 && (<div className="flex items-center mt-2">
														 {model.capabilities.includes("vision") && <Eye className="w-4 h-4 text-slate-400" />}
														{model.capabilities.includes("web") && <Globe className="w-4 h-4 text-slate-400" />}
														{model.capabilities.includes("files") && <FileText className="w-4 h-4 text-slate-400" />}
														{model.capabilities.includes("reasoning") && <Brain className="w-4 h-4 text-slate-400" />}
													 </div>)}
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

export default ResearchConfiguration;