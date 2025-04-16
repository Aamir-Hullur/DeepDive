"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowUp,
  ChevronDown,
  Search,
  Eye,
  Globe,
  FileText,
  Clock,
  Filter,
  Paperclip,
  Cpu,
  Diamond,
  Network,
  MessageSquare,
  Brain,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
type ModelCapability = "vision" | "web" | "files" | "reasoning"

type Model = {
  id: string
  name: string
  isNew?: boolean
  isDegraded?: boolean
  capabilities: ModelCapability[]
}

type Provider = {
  id: string
  name: string
  icon: React.ReactNode
  models: Model[]
}

export default function ChatModelSelector() {
  const [message, setMessage] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [selectedModel, setSelectedModel] = useState<Model>(providers[0].models[0]) // Default model
  const [searchQuery, setSearchQuery] = useState("")

  // Filter providers based on search query
  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter models of selected provider based on search query
  const filteredModels = selectedProvider
    ? selectedProvider.models.filter((model) => model.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
    // Reset to provider view when opening dropdown
    if (!isDropdownOpen) {
      setSelectedProvider(null)
    }
  }

  const selectProvider = (provider: Provider) => {
    setSelectedProvider(provider)
    setSearchQuery("") // Clear search when selecting a provider
  }

  const selectModel = (model: Model) => {
    setSelectedModel(model)
    setIsDropdownOpen(false)
    setSelectedProvider(null) // Reset to provider view for next open
  }

  const backToProviders = () => {
    setSelectedProvider(null)
    setSearchQuery("") // Clear search when going back
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Model selector */}
      <div className="mb-2">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-300 bg-[#111111] rounded-md border border-gray-700"
        >
          {selectedModel.name} <ChevronDown className="w-4 h-4 ml-1" />
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute bottom-full mb-2 w-full max-h-[500px] overflow-y-auto bg-[#111111] rounded-lg border border-gray-700 shadow-lg z-10">
            {/* Search bar */}
            <div className="p-3 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder={selectedProvider ? "Search models..." : "Search providers..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a1a1a] text-gray-200 pl-10 pr-4 py-2 rounded-md focus:outline-none"
                />
              </div>
            </div>

            {/* Header with back button when in model view */}
            {selectedProvider && (
              <div className="flex items-center p-2 border-b border-gray-700">
                <button onClick={backToProviders} className="flex items-center text-pink-500 text-sm">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span>Back to providers</span>
                </button>
                <div className="flex items-center ml-2 gap-2">
                  <div className="text-pink-500">{selectedProvider.icon}</div>
                  <span className="text-gray-200">{selectedProvider.name}</span>
                </div>
              </div>
            )}

            {/* View toggle and filters when in provider view */}
            {!selectedProvider && (
              <div className="flex justify-between items-center p-2 border-b border-gray-700">
                <div className="text-pink-500 text-sm">Select a provider</div>
                <button className="text-gray-400">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Provider list view */}
            {!selectedProvider && (
              <div className="max-h-[400px] overflow-y-auto">
                {filteredProviders.map((provider) => (
                  <div
                    key={provider.id}
                    onClick={() => selectProvider(provider)}
                    className="flex items-center justify-between p-3 hover:bg-[#1a1a1a] cursor-pointer border-b border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-pink-500">{provider.icon}</div>
                      <span className="text-gray-200">{provider.name}</span>
                    </div>
                    <div className="text-gray-400 text-xs">{provider.models.length} models</div>
                  </div>
                ))}
              </div>
            )}

            {/* Models grid view for selected provider */}
            {selectedProvider && (
              <div className="p-3">
                <div className="grid grid-cols-3 gap-2">
                  {filteredModels.map((model) => (
                    <div
                      key={model.id}
                      onClick={() => selectModel(model)}
                      className="flex flex-col items-center justify-center p-3 bg-[#1a1a1a] rounded-lg border border-gray-800 hover:border-gray-700 cursor-pointer relative"
                    >
                      {model.isNew && (
                        <span className="absolute top-1 right-1 text-[10px] text-pink-500 font-medium">NEW</span>
                      )}
                      <span className="text-gray-200 text-xs text-center">{model.name}</span>
                      <div className="flex items-center gap-1 mt-2">
                        {model.capabilities.includes("vision") && <Eye className="w-4 h-4 text-gray-400" />}
                        {model.capabilities.includes("web") && <Globe className="w-4 h-4 text-gray-400" />}
                        {model.capabilities.includes("files") && <FileText className="w-4 h-4 text-gray-400" />}
                        {model.capabilities.includes("reasoning") && <Clock className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat input */}
      <div className="relative w-full bg-[#111111] rounded-lg border border-gray-700">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="w-full bg-transparent text-gray-200 px-4 py-3 pr-20 focus:outline-none"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button className="text-gray-400 hover:text-gray-200">
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              message ? "bg-purple-700 text-white" : "bg-gray-700 text-gray-400",
            )}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

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
      },
      {
        id: "gpt-4o-mini",
        name: "GPT 4o mini",
        capabilities: ["vision", "web"],
      },
      {
        id: "gpt-4-1",
        name: "GPT 4.1",
        capabilities: ["vision", "files", "reasoning"],
      },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: <Diamond className="w-5 h-5" />,
    models: [
      {
        id: "gemini-2-flash",
        name: "2.0 Flash",
        capabilities: ["vision", "web"],
        isNew: true,
      },
      {
        id: "gemini-2-5-pro",
        name: "2.5 Pro",
        capabilities: ["vision", "web", "files", "reasoning"],
      },
      {
        id: "gemini-2-5-flash-thinking",
        name: "2.5 Flash Thinking",
        capabilities: ["vision", "web", "reasoning"],
        isNew: true,
      },
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    icon: <Network className="w-5 h-5" />,
    models: [
      {
        id: "openrouter-claude-3-5",
        name: "Claude 3.5",
        capabilities: ["vision", "files"],
      },
      {
        id: "openrouter-claude-3-7",
        name: "Claude 3.7",
        capabilities: ["vision", "files", "reasoning"],
      },
      {
        id: "openrouter-gpt-4o",
        name: "OpenAI GPT 4o",
        capabilities: ["vision", "web", "files"],
      },
      {
        id: "openrouter-gemini-flash",
        name: "Gemini Flash 2.0",
        capabilities: ["vision", "web"],
      },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    icon: <MessageSquare className="w-5 h-5" />,
    models: [
      {
        id: "claude-3-7-sonnet",
        name: "Sonnet 3.7",
        capabilities: ["vision", "files", "reasoning"],
      },
      {
        id: "claude-3-5-sonnet",
        name: "Sonnet 3.5",
        capabilities: ["vision", "files"],
      },
    ],
  },
  {
    id: "deepseek",
    name: "Deepseek",
    icon: <Brain className="w-5 h-5" />,
    models: [
      {
        id: "deepseek-v3",
        name: "DeepSeek v3",
        capabilities: ["reasoning"],
      },
      {
        id: "deepseek-coder",
        name: "DeepSeek Coder",
        capabilities: ["files"],
      },
    ],
  },
]
