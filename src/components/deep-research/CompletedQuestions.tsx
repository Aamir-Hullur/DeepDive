'use-client'

import { useDeepResearchStore } from '@/store/deepResearch'
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CheckCircle2, ChevronRightIcon, ListChecksIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'

const CompletedQuestions = () => {
  const { questions, answers, isCompleted } = useDeepResearchStore();

  if (!isCompleted || questions.length === 0) return null;

  return (
    <Card className="w-full shadow-sm bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl overflow-hidden mb-6">
      <CardHeader className="bg-slate-50/80 border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-lg text-slate-800">Research Parameters Defined</CardTitle>
            <CardDescription className="text-slate-500 text-sm">
              Your answers will guide our research process
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion 
          type="single" 
          collapsible 
          className="w-full"
          defaultValue="item-summary"
        >
          <AccordionItem value="item-summary" className="border-0">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListChecksIcon className="h-5 w-5 text-slate-500" />
                  <span className="font-medium text-slate-800">Your Research Framework</span>
                </div>
                <AccordionTrigger className="ml-auto p-0 hover:no-underline">
                  <span className="sr-only">Toggle</span>
                </AccordionTrigger>
              </div>
            </div>
            <AccordionContent className="px-6 pt-0 pb-6">
              <div className="space-y-4 border-l-2 border-slate-200 pl-4">
                {questions.map((question, index) => (
                  <div key={index} className="group cursor-pointer">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem 
                        value={`question-${index}`} 
                        className="border shadow-sm rounded-lg bg-white overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 text-left hover:no-underline flex gap-2 group-hover:bg-slate-50/80 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-medium text-slate-600">
                                {index + 1}
                              </div>
                              <p className="text-sm font-medium text-slate-700 line-clamp-1">
                                {question}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="border-t bg-slate-50/50 px-4 py-3">
                          <div className="flex gap-3 items-start">
                            <ChevronRightIcon className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">
                              {answers[index]}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

export default CompletedQuestions